import os

from dotenv import load_dotenv, find_dotenv
from flask import Flask, jsonify, request
from flask_cors import CORS
from supabase import create_client
import json

load_dotenv(find_dotenv())

url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_KEY")
if not url or not key:
    raise ValueError("SUPABASE_URL and SUPABASE_KEY must be set")
supabase = create_client(url, key)

app = Flask(__name__)

CORS(app)

@app.route("/api/crontest")
def crontest():
    print(f"GET /api/crontest request from {request.remote_addr}")
    return jsonify({"message": "jest git"})

@app.route("/api/matches", methods=["GET"])
def get_matches():
    print(f"GET /api/matches request from {request.remote_addr}")
    try:
        response = (
            supabase.table("matches")
            .select(
                "id",
                "team_one:teams!matches_team_one_fkey(name, flag)",
                "team_two:teams!matches_team_two_fkey(name, flag)",
                "date",
                "time",
                "team_one_goals",
                "team_two_goals",
                "group",
                "matchday",
            )
            .eq("finished", False)
            .order("id")
            .execute()
        )
        return response.model_dump_json()
    except Exception as e:
        print(f"Error fetching matches: {e}")
        return jsonify({"error": "Internal Server Error"}), 500


@app.route("/api/users")
def get_users_result():
    print(f"GET /api/users request from {request.remote_addr}")
    try:
        result = (
            supabase.table("users")
            .select("login", "points")
            .order("points", desc=True)
            .execute()
        )
    except Exception as e:
        print(f"Error fetching users: {e}")
        return jsonify({"error": "Internal Server Error"}), 500
    return result.model_dump_json()


@app.route("/api/login", methods=["POST"])
def login():
    data = request.get_json()
    login = data["login"]
    password = data["password"]
    result = (
        supabase.table("users")
        .select("id", "password", "points")
        .eq("login", login)
        .execute()
        .model_dump()
    )
    print(f"GET /api/login request from {request.remote_addr} for {login}")
    if len(result["data"]) == 0:
        return json.dumps(
            {"message": "Błędna nazwa użytkownika", "id": None, "points": None},
            ensure_ascii=False,
        ), 404
    if result["data"][0]["password"] != password:
        return json.dumps(
            {"message": "Błędne hasło", "id": None, "points": None}, ensure_ascii=False
        ), 404
    return json.dumps(
        {
            "message": "Użytkownik został zalogowany",
            "id": result["data"][0]["id"],
            "points": result["data"][0]["points"],
        },
        ensure_ascii=False,
    ), 200


@app.route("/api/matches", methods=["POST"])
def post_matches():
    data = request.get_json()
    rounds = data["rounds"]
    for round in rounds:
        matchday = round["name"]
        for match in round["matches"]:
            date = match["date"]
            time = match["time"]
            team_one = match["team1"]["name"]
            team_two = match["team2"]["name"]
            group = match["group"]

            team_one_id = (
                supabase.table("teams")
                .select("id")
                .eq("name", team_one)
                .execute()
                .model_dump()["data"][0]["id"]
            )
            team_two_id = (
                supabase.table("teams")
                .select("id")
                .eq("name", team_two)
                .execute()
                .model_dump()["data"][0]["id"]
            )

            (
                supabase.table("matches").insert(
                    {
                        "team_one": team_one_id,
                        "team_two": team_two_id,
                        "date": date,
                        "time": time,
                        "group": group,
                        "matchday": matchday,
                    }
                )
            ).execute()

            print(
                f"Inserted match:\n{team_one}({team_one_id})\n{team_two}({team_two_id})\n{date}\n{time}\n{group}\n{matchday}"
            )

    return jsonify({"status": "ok"})


@app.route("/api/teams", methods=["POST"])
def post_teams():
    data = request.get_json()
    for group in data:
        teams = group["drużyny"]
        for team in teams:
            flag_source = os.path.join("src", "img", "flags" f"{team}.jpg")
            result = (
                supabase.table("teams")
                .insert({"name": team, "flag": flag_source})
                .execute()
            )
    return result.model_dump_json()


@app.route("/api/predictions", methods=["POST"])
def post_predictions():
    data = request.get_json()
    match_id, user_id, team_one_goals, team_two_goals, result = (
        data.get("match_id"),
        data.get("user_id"),
        data.get("team_one_goals"),
        data.get("team_two_goals"),
        data.get("result"),
    )
    print(f"POST /api.predictions/ with data:\n{data}")
    already_predicted = (
        supabase.table("predictions")
        .select("id", count="exact")
        .match({"match_id": match_id, "user_id": user_id})
        .execute()
    )
    if already_predicted.count > 0:
        print("Match is already predicted by user, updating")
        to_update = dict()
        if team_one_goals and team_two_goals:
            to_update["team_one_goals"] = team_one_goals
            to_update["team_two_goals"] = team_two_goals
        if result is not None:
            to_update["result"] = result

        result = (
            supabase.table("predictions")
            .update(to_update)
            .match({"match_id": match_id, "user_id": user_id})
            .execute()
        )
        print(
            f"Update prediction for:\n{user_id}\n{match_id}\n{team_one_goals}\n{team_two_goals}\n{result}"
        )

        return result.model_dump_json()

    print("Match is not already predicted by user, inserting")
    result = (
        supabase.table("predictions")
        .insert(
            {
                "match_id": match_id,
                "user_id": user_id,
                "team_one_goals": team_one_goals,
                "team_two_goals": team_two_goals,
                "result": result,
            }
        )
        .execute()
    )
    print(
        f"Update prediction for:\n{user_id}\n{match_id}\n{team_one_goals}\n{team_two_goals}\n{result}"
    )
    return result.model_dump_json()


@app.route("/api/predictions/<user_id>")
def get_predictions(user_id):
    print(f"GET /api/predictions/{user_id} request from {request.remote_addr}")
    result = (
        supabase.table("predictions")
        .select(
            "match_id",
            "result",
            "team_one_goals",
            "team_two_goals",
        )
        .eq("user_id", user_id)
        .execute()
    )
    return result.model_dump_json()


@app.route("/api/result", methods=["POST"])
def update_result():
    data = request.get_json()
    print(f"POST /api/result data:\n{data}")
    match_id, team_one_goals, team_two_goals = (
        data["match_id"],
        data["team_one_goals"],
        data["team_two_goals"],
    )
    result = (
        1
        if team_one_goals > team_two_goals
        else 2
        if team_one_goals < team_two_goals
        else 0
    )
    supabase.table("matches").update(
        {
            "team_one_goals": team_one_goals,
            "team_two_goals": team_two_goals,
            "result": result,
        }
    ).eq("id", match_id).execute()
    print(
        f"Updated result for {match_id}, team_one_goals: {team_one_goals} team_two_goals: {team_two_goals}, result: {result}"
    )
    users_predictions = (
        supabase.table("predictions")
        .select(
            "user_id",
            "result",
            "team_one_goals",
            "team_two_goals",
        )
        .eq("match_id", match_id)
        .execute()
    )
    for user_prediction in users_predictions.data:
        user_id = user_prediction.get("user_id")
        user_result = user_prediction.get("result")
        user_team_one_goals = user_prediction.get("team_one_goals")
        user_team_two_goals = user_prediction.get("team_two_goals")

        points = 0
        if result == user_result:
            points += 1
        if (
            user_team_one_goals == team_one_goals
            and user_team_two_goals == team_two_goals
        ):
            points += 3

        user_points = (
            supabase.table("users").select("points").eq("id", user_id).execute()
        )
        user_points = user_points.data[0]["points"]
        finished_user_points = user_points + points
        result = (
            supabase.table("users")
            .update({"points": user_points})
            .eq("id", user_id)
            .execute()
        )
        print(f"update user points for user id {user_id}, because: user result = {user_result}, user_team_one_goals = {user_team_one_goals}, user_team_two_goals = {user_team_two_goals} \
              user had {user_points}, achived {points} points, so has {finished_user_points} now")

    return "jest git"


if __name__ == "__main__":
    app.run(debug=True)
