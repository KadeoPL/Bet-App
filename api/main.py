import os

from dotenv import load_dotenv, find_dotenv
from flask import Flask, jsonify, request
from flask_cors import CORS
from supabase import create_client
from datetime import datetime
import json
import pytz

load_dotenv(find_dotenv())

url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_KEY")
secret_key = os.getenv("SECRET_KEY")
if not url or not key or not secret_key:
    raise ValueError("SUPABASE_URL, SUPABASE_KEY and SECRET_KEY must be set")
supabase = create_client(url, key)

app = Flask(__name__)
app.secret_key = secret_key

CORS(app)

def require_auth(func):
    def wrapper(*args, **kwargs):
        secret_key = request.headers.get('Authorization')
        if secret_key == app.secret_key:
            return func(*args, **kwargs)
        else:
            return jsonify({'message': 'Unauthorized'}), 401
    wrapper.__name__ = func.__name__
    return wrapper

@app.route("/api/matches", methods=["GET"])
def get_matches():
    print(f"[{request.remote_addr}] GET /api/matches request")
    try:
        db_response = (
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
        if not db_response.data:
            return jsonify({"error": "Could not get matches"}), 500
        return db_response.data, 200
    except Exception as e:
        print(f"[{request.remote_addr}] Error fetching matches: {e}")
        return jsonify({"error": "Internal Server Error"}), 500

@app.route("/api/points/<id>")
def get_points_for_user(id):
    print(f"[{request.remote_addr}] GET /api/points/{id} request")
    try:
        db_response = (
            supabase.table("users")
            .select("points")
            .eq("id", id)
            .execute()
        )
        if not db_response.data:
            return jsonify({"error": "Wrong user ID"}), 404
        return db_response.data[0], 200
    except Exception as e:
        print(f"[{request.remote_addr}] Error getting points for user {id}: {e}")
        return jsonify({"error": "Internal Server Error"}), 500

@app.route("/api/results")
def get_users_result():
    print(f"[{request.remote_addr}] GET /api/results request")
    try:
        db_response = (
            supabase.table("users")
            .select("login", "points")
            .order("points", desc=True)
            .execute()
        )
        if not db_response.data:
            return jsonify({"error": "Could not user results"}), 500
        return db_response.data, 200
    except Exception as e:
        print(f"[{request.remote_addr}] Error fetching users: {e}")
        return jsonify({"error": "Internal Server Error"}), 500

@app.route("/api/login", methods=["POST"])
def login():
    data = request.get_json()
    login = data["login"]
    print(f"[{request.remote_addr}] POST /api/login request for user: {login}")
    password = data["password"]
    try:
        db_response = (
            supabase.table("users")
            .select("id", "password", "points")
            .eq("login", login)
            .execute()
        )
        if not db_response.data:
            print(f"[{request.remote_addr}] Wrong username for login: {login}")
            return jsonify({"error": "Wrong username"}), 404
        user_password = db_response.data[0].pop("password")
        if user_password != password:
            print(f"[{request.remote_addr}] Wrong password: {password}")
            return jsonify({"error": "Wrong password"}), 404
        print(f"[{request.remote_addr}] User successfully login: {login}")
        return db_response.data[0], 200
    except Exception as e:
        print(f"[{request.remote_addr}] Error login user {login}: {e}")
        return jsonify({"error": "Internal Server Error"}), 500
    
@app.route("/api/knockout_matches", methods=["POST"])
@require_auth
def post_knockout_matches():
    print(f"[{request.remote_addr}] POST /api/knockout_matches request")
    matches_data = request.get_json()
    round = matches_data["round"]
    matches = matches_data["matches"]
    response = dict()
    response["round"] = round
    for num, match in enumerate(matches):
        date = match["date"]
        time = match["time"]
        team_one = match["team_one"]
        team_two = match["team_two"]
        try:
            team_one_id = (
                supabase.table("teams")
                .select("id")
                .eq("name", team_one)
                .execute()
                .data[0]["id"]
            )
            if team_one_id is None:
                print(f"[{request.remote_addr}] Wrong team name: {team_one}")
                return jsonify({"error": "Wrong username"}), 404
        except Exception as e:
            print(f"[{request.remote_addr}] Error getting id for team {team_one}: {e}")
            return jsonify({"error": "Internal Server Error"}), 500
        try:
            team_two_id = (
                supabase.table("teams")
                .select("id")
                .eq("name", team_two)
                .execute()
                .data[0]["id"]
            )
            if team_two_id is None:
                print(f"[{request.remote_addr}] Wrong team name: {team_two}")
                return jsonify({"error": "Wrong username"}), 404
        except Exception as e:
            print(f"[{request.remote_addr}] Error getting id for team {team_two}: {e}")
            return jsonify({"error": "Internal Server Error"}), 500
        
        try:
            db_response = supabase.table("matches").insert(
                {
                    "team_one": team_one_id,
                    "team_two": team_two_id,
                    "date": date,
                    "time": time,
                    "matchday": round,
                }
            ).execute()
        except Exception as e:
            print(f"[{request.remote_addr}] Error login user {login}: {e}")
            return jsonify({"error": "Internal Server Error"}), 500
        print(f"[{request.remote_addr}] Inserted knockout match:\n{team_one}({team_one_id})\n{team_two}({team_two_id})\n{date}\n{time}\n{round}")
        response[num] = db_response.data

    return jsonify(response)

@app.route("/api/group_matches", methods=["POST"])
@require_auth
def post_group_matches():
    print(f"[{request.remote_addr}] POST /api/matches request")
    matches_data = request.get_json()
    round = matches_data["round"]
    matches = matches_data["matches"]
    response = dict()
    response["round"] = round
    for num, match in enumerate(matches):
        date = match["date"]
        time = match["time"]
        team_one = match["team_one"]
        team_two = match["team_two"]
        group = match["group"]
        team_one_id = (
            supabase.table("teams")
            .select("id")
            .eq("name", team_one)
            .execute()
            .data[0]["id"]
        )
        team_two_id = (
            supabase.table("teams")
            .select("id")
            .eq("name", team_two)
            .execute()
            .data[0]["id"]
        )
        db_response = supabase.table("matches").insert(
            {
                "team_one": team_one_id,
                "team_two": team_two_id,
                "date": date,
                "time": time,
                "matchday": round,
                "group": group
            }
        ).execute()
        print(f"[{request.remote_addr}] Inserted group match:\n{team_one}({team_one_id})\n{team_two}({team_two_id})\n{date}\n{time}\n{round}")
        response[num] = db_response.data

    return jsonify(response)

@app.route("/api/teams", methods=["POST"])
@require_auth
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
    print(f"[{request.remote_addr}] POST /api.predictions/ with data:\n{data}")
    already_predicted = (
        supabase.table("predictions")
        .select("id", count="exact")
        .match({"match_id": match_id, "user_id": user_id})
        .execute()
    )
    if already_predicted.count > 0:
        print(f"[{request.remote_addr}] Match is already predicted by user, updating")
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
            f"[{request.remote_addr}] Update prediction for:\n{user_id}\n{match_id}\n{team_one_goals}\n{team_two_goals}\n{result}"
        )

        return result.model_dump_json()

    print(f"[{request.remote_addr}] Match is not already predicted by user, inserting")
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
        f"[{request.remote_addr}] Update prediction for:\n{user_id}\n{match_id}\n{team_one_goals}\n{team_two_goals}\n{result}"
    )
    return result.model_dump_json()


@app.route("/api/predictions/<user_id>")
def get_predictions(user_id):
    print(f"[{request.remote_addr}] GET /api/predictions/{user_id} request")
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

@app.route("/api/match_predictions/<match_id>")
def get_match_predictions(match_id):
    print(f"[{request.remote_addr}] GET /api/match_predictions/{match_id} request")

    result = supabase.table("matches").select("date", "time").eq("id", match_id).execute().model_dump()
    date = result["data"][0]["date"]
    time = result["data"][0]["time"]
    timezone = pytz.timezone('Europe/Warsaw')
    timedate = datetime.strptime((date + " " + time), "%Y-%m-%d %H:%M:%S")
    timedate = timezone.localize(timedate)
    if not timedate < datetime.now(timezone):
        return json.dumps({"message": "Mecz się jeszcze nie rozpoczął"}, ensure_ascii=False), 404
    all_predictions = supabase.table("predictions").select("user_id:users!predictions_user_id_fkey(login)", "result", "team_one_goals", "team_two_goals").eq("match_id", match_id).execute().model_dump_json()
    return all_predictions, 200


@app.route("/api/result", methods=["POST"])
@require_auth
def update_result():
    data = request.get_json()
    print(f"[{request.remote_addr}] POST /api/result data:\n{data}")
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
        f"[{request.remote_addr}] Updated result for {match_id}, team_one_goals: {team_one_goals} team_two_goals: {team_two_goals}, result: {result}"
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
        exact_result = 0
        if result == user_result:
            points += 1
        if (
            user_team_one_goals == team_one_goals
            and user_team_two_goals == team_two_goals
        ):
            points += 3
            exact_result += 1

        result = (
            supabase.table("users").select("points", "correct_exact_result").eq("id", user_id).execute()
        )
        user_points = result.data[0]["points"]
        user_exact_results = result.data[0]["correct_exact_result"]
        finished_user_points = user_points + points
        finished_exact_results = user_exact_results + exact_result
        result = (
            supabase.table("users")
            .update({"points": finished_user_points, "correct_exact_result": finished_exact_results})
            .eq("id", user_id)
            .execute()
        )
        print(f"[{request.remote_addr}] update user points for user id {user_id}, because: user result = {user_result}, user_team_one_goals = {user_team_one_goals}, user_team_two_goals = {user_team_two_goals} \
              user had {user_points}, achived {points} points, so has {finished_user_points} now")

    return "jest git"


if __name__ == "__main__":
    app.run(debug=True)
