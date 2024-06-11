import os
import logging
from dotenv import load_dotenv
from flask import Flask, jsonify, request
from flask_cors import CORS
from supabase import create_client

load_dotenv()

url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_KEY")
supabase = create_client(url, key)

app = Flask(__name__)
CORS(app)
logging.basicConfig(level=logging.INFO)
@app.route("/api/matches", methods=["GET"])
def get_matches():
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
        .eq("finished", False).order("id")
        .execute()
    )
    app.logger.info("Get request dupa")
    return response.model_dump_json()

@app.route("/api/users")
def get_users_result(user_id):
    result = (
        supabase.table("users")
        .select(
            "name",
            "points"
        )
        .eq("user_id", user_id)
        .execute()
    )
    return result.model_dump_json()


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
            result = (
                supabase.table("matches")
                .insert(
                    {
                        "team_one": team_one_id,
                        "team_two": team_two_id,
                        "date": date,
                        "time": time,
                        "group": group,
                        "matchday": matchday,
                    }
                )
                .execute()
            )
            print(result)

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
        data.get("result")
    )
    already_predicted = supabase.table("predictions").select("id", count="exact").match({"match_id": match_id, "user_id": user_id}).execute()
    if already_predicted.count > 0:
        to_update = dict()
        if team_one_goals and team_two_goals:
            to_update["team_one_goals"] = team_one_goals
            to_update["team_two_goals"] = team_two_goals
        if result:
            to_update["result"] = result
            
        result = supabase.table("predictions").update(to_update).match({"match_id": match_id, "user_id": user_id}).execute()
        return result.model_dump_json()
    result = (
            supabase.table("predictions")
            .insert(
                {
                    "match_id": match_id,
                    "user_id": user_id,
                    "team_one_goals": team_one_goals,
                    "team_two_goals": team_two_goals,
                    "result": result
                }
            )
            .execute()
        )
    return result.model_dump_json()

@app.route("/api/predictions/<user_id>")
def get_predictions(user_id):
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
    match_id, team_one_goals, team_two_goals = data["match_id"], data["team_one_goals"], data["team_two_goals"]
    result = 1 if team_one_goals > team_two_goals else 2 if team_one_goals < team_two_goals else 0
    supabase.table("matches").update({"team_one_goals": team_one_goals, "team_two_goals": team_two_goals, "result": result}).eq("id", match_id).execute()
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
        if user_team_one_goals == team_one_goals and user_team_two_goals == team_two_goals:
            points += 3
        
        user_points = supabase.table('users').select('points').eq("id", user_id).execute()
        user_points = user_points.data[0]["points"]
        user_points += points
        result = supabase.table("users").update({"points": user_points}).eq("id", user_id).execute()

    return "jest git"

if __name__ == "__main__":
    app.run(debug=True)
