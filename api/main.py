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
        db_response = supabase.table("matches").select(
                "id",
                "team_one:teams!matches_team_one_fkey(name, flag)",
                "team_two:teams!matches_team_two_fkey(name, flag)",
                "date",
                "time",
                "team_one_goals",
                "team_two_goals",
                "group",
                "matchday",
            ).eq("finished", False).order("id").execute()
        
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
        db_response = supabase.table("users").select("points").eq("id", id).execute()
        if not db_response.data:
            return jsonify({"error": "Wrong user ID"}), 404
        return db_response.data[0], 200
    except Exception as e:
        print(f"[{request.remote_addr}] Error getting points for user {id}: {e}")
        return jsonify({"error": "Internal Server Error"}), 500

@app.route("/api/scoreboard")
def get_scoreboard():
    print(f"[{request.remote_addr}] GET /api/scoreboard request")
    try:
        db_response = supabase.table("users").select("login", "points", "correct_exact_result").execute()
        if not db_response.data:
            return jsonify({"error": "Could not get scoreboard"}), 500
        users = db_response.data
        users = sorted(users, key=lambda x: (-x['points'], -x['correct_exact_result']))
    except Exception as e:
        print(f"[{request.remote_addr}] Error fetching users: {e}")
        return jsonify({"error": "Internal Server Error"}), 500
    return users

@app.route("/api/login", methods=["POST"])
def login():
    data = request.get_json()
    login = data["login"]
    print(f"[{request.remote_addr}] POST /api/login request for user: {login}")
    password = data["password"]
    try:
        db_response = supabase.table("users").select("id", "password", "points").eq("login", login).execute()
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
            team_one_id = supabase.table("teams").select("id").eq("name", team_one).execute().data[0]["id"]
            if team_one_id is None:
                print(f"[{request.remote_addr}] Wrong team name: {team_one}")
                return jsonify({"error": "Wrong username"}), 404
        except Exception as e:
            print(f"[{request.remote_addr}] Error getting id for team {team_one}: {e}")
            return jsonify({"error": "Internal Server Error"}), 500
        try:
            team_two_id = supabase.table("teams").select("id").eq("name", team_two).execute().data[0]["id"]
            if team_two_id is None:
                print(f"[{request.remote_addr}] Wrong team name: {team_two}")
                return jsonify({"error": "Wrong username"}), 404
        except Exception as e:
            print(f"[{request.remote_addr}] Error getting id for team {team_two}: {e}")
            return jsonify({"error": "Internal Server Error"}), 500
        
        try:
            db_response = supabase.table("matches").insert(
                {"team_one": team_one_id,
                "team_two": team_two_id, 
                "date": date,
                "time": time,
                "matchday": round}
            ).execute()
        except Exception as e:
            print(f"[{request.remote_addr}] Error login user {login}: {e}")
            return jsonify({"error": "Internal Server Error"}), 500
        print(f"[{request.remote_addr}] Inserted knockout match:\n{team_one}({team_one_id})\n{team_two}({team_two_id})\n{date}\n{time}\n{round}")
        response[num] = db_response.data

    return jsonify(response), 200

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
        try:
            team_one_id = supabase.table("teams").select("id").eq("name", team_one).execute().data[0]["id"]
        except Exception as e:
            print(f"[{request.remote_addr}] Error getting id for team {team_one}: {e}")
            return jsonify({"error": "Internal Server Error"}), 500
        try:
            team_two_id = supabase.table("teams").select("id").eq("name", team_two).execute().data[0]["id"]
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
                    "group": group
                }
            ).execute()
        except Exception as e:
            print(f"[{request.remote_addr}] Error inserting group matches {match}: {e}")
            return jsonify({"error": "Internal Server Error"}), 500
        
        print(f"[{request.remote_addr}] Inserted group match:\n{team_one}({team_one_id})\n{team_two}({team_two_id})\n{date}\n{time}\n{round}")
        response[num] = db_response.data

    return jsonify(response), 200

@app.route("/api/teams", methods=["POST"])
@require_auth
def post_teams():
    data = request.get_json()
    api_response = dict()
    for group in data:
        teams = group["drużyny"]
        for team in teams:
            flag_source = os.path.join("src", "img", "flags" f"{team}.jpg")
            try:
                supabase.table("teams").insert({"name": team, "flag": flag_source}).execute()
                api_response[team] = flag_source
            except Exception as e:
                print(f"[{request.remote_addr}] Error adding team: {team}: {e}")
                return jsonify({"error": "Internal Server Error"}), 500
    return jsonify(api_response), 200

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
    try:
        already_predicted = supabase.table("predictions").select("id").match({"match_id": match_id, "user_id": user_id}).execute()
    except Exception as e:
        print(f"[{request.remote_addr}] Error getting user predictions for user id: {user_id}, match id: {match_id}: {e}")
        return jsonify({"error": "Internal Server Error"}), 500
    if already_predicted.data is not None:
        print(f"[{request.remote_addr}] Match is already predicted by user, updating")
        to_update = dict()
        if team_one_goals and team_two_goals:
            to_update["team_one_goals"] = team_one_goals
            to_update["team_two_goals"] = team_two_goals
        if result is not None:
            to_update["result"] = result
        try:
            db_response = supabase.table("predictions").update(to_update).match({"match_id": match_id, "user_id": user_id}).execute()
        except Exception as e:
            print(f"[{request.remote_addr}] Error updating user predictions for user id: {user_id}, match id: {match_id}: {e}")
            return jsonify({"error": "Internal Server Error"}), 500
        print(f"[{request.remote_addr}] Update prediction for:\n{user_id}\n{match_id}\n{team_one_goals}\n{team_two_goals}\n{result}")
        return db_response.data[0], 200
    
    print(f"[{request.remote_addr}] Match is not already predicted by user, inserting")
    try:
        db_response = supabase.table("predictions").insert(
                {
                    "match_id": match_id,
                    "user_id": user_id,
                    "team_one_goals": team_one_goals,
                    "team_two_goals": team_two_goals,
                    "result": result,
                }).execute()
    except Exception as e:
        print(f"[{request.remote_addr}] Error getting user predictions for user id: {user_id}, match id: {match_id}: {e}")
        return jsonify({"error": "Internal Server Error"}), 500
    print(f"[{request.remote_addr}] Update prediction for:\n{user_id}\n{match_id}\n{team_one_goals}\n{team_two_goals}\n{result}")
    return db_response.data, 200


@app.route("/api/predictions/<user_id>")
def get_predictions(user_id):
    print(f"[{request.remote_addr}] GET /api/predictions/{user_id} request")
    try:
        result = supabase.table("predictions").select(
                "match_id",
                "result",
                "team_one_goals",
                "team_two_goals",
            ).eq("user_id", user_id).execute()
    except Exception as e:
        print(f"[{request.remote_addr}] Error getting user predictions for user id: {user_id}: {e}")
        return jsonify({"error": "Internal Server Error"}), 500
    return result.data, 200

@app.route("/api/match_predictions/<match_id>")
def get_match_predictions(match_id):
    print(f"[{request.remote_addr}] GET /api/match_predictions/{match_id} request")

    result = supabase.table("matches").select("date", "time").eq("id", match_id).execute()
    date = result.data[0]["date"]
    time = result.data[0]["time"]
    timezone = pytz.timezone('Europe/Warsaw')
    timedate = datetime.strptime((date + " " + time), "%Y-%m-%d %H:%M:%S")
    timedate = timezone.localize(timedate)
    if not timedate < datetime.now(timezone):
        return jsonify({"message": "Match hasn't started yet"}), 404
    try:
        all_predictions = supabase.table("predictions").select("user_id:users!predictions_user_id_fkey(login)", "result", "team_one_goals", "team_two_goals").eq("match_id", match_id).execute()
    except Exception as e:
        print(f"[{request.remote_addr}] Error getting all predictions for match id {match_id}: {e}")
        return jsonify({"error": "Internal Server Error"}), 500
    return all_predictions.data, 200

@app.route("/api/result", methods=["POST"])
@require_auth
def update_result():
    match_result_info = request.get_json()
    print(f"[{request.remote_addr}] POST /api/result data:\n{match_result_info}")
    match_id, real_team_one_goals, real_team_two_goals = (
        match_result_info["match_id"],
        match_result_info["team_one_goals"],
        match_result_info["team_two_goals"],
    )

    table_before = supabase.table("users").select("id", "login", "points", "correct_exact_result").execute()
    filepath = os.path.join(os.path.expanduser("~"), "bet_app_user_table", f"table_before{match_id}.json")
    with open(filepath, "w") as f:
        json.dump(table_before.data, f)

    match_result = (
        1
        if real_team_one_goals > real_team_two_goals
        else 2
        if real_team_one_goals < real_team_two_goals
        else 0
    )
    supabase.table("matches").update(
        {
            "team_one_goals": real_team_one_goals,
            "team_two_goals": real_team_two_goals,
            "result": match_result,
        }
    ).eq("id", match_id).execute()
    print(
        f"[{request.remote_addr}] Updated result for {match_id}, team_one_goals: {real_team_one_goals} team_two_goals: {real_team_two_goals}, result: {match_result}"
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
    response = dict()
    for user_prediction in users_predictions.data:
        user_id = user_prediction.get("user_id")
        user_result = user_prediction.get("result")
        user_team_one_goals = user_prediction.get("team_one_goals")
        user_team_two_goals = user_prediction.get("team_two_goals")

        points_to_add = 0
        exact_result_to_add = 0
        if match_result == user_result:
            points_to_add += 1
        if (
            user_team_one_goals == real_team_one_goals
            and user_team_two_goals == real_team_two_goals
        ):
            points_to_add += 3
            exact_result_to_add += 1

        current_user_points = (
            supabase.table("users").select("login", "points", "correct_exact_result").eq("id", user_id).execute()
        )
        current_user_points = current_user_points.data[0]
        username = current_user_points["login"]
        user_points = current_user_points["points"]
        user_exact_results = current_user_points["correct_exact_result"]
        
        final_user_points = user_points + points_to_add
        final_exact_results = user_exact_results + exact_result_to_add

        supabase.table("users").update({"points": final_user_points, "correct_exact_result": final_exact_results}).eq("id", user_id).execute()

        print(f"[{request.remote_addr}] update user points for user id {user_id}, because: user result = {user_result}, user_team_one_goals = {user_team_one_goals}, user_team_two_goals = {user_team_two_goals} \
              user had {user_points}, achived {points_to_add} points, so has {final_user_points} now")
        response[username] = {"achived_points": points_to_add, "achived_exact_result": exact_result_to_add}

    table_after = supabase.table("users").select("id", "login", "points", "correct_exact_result").execute()
    filepath = os.path.join(os.path.expanduser("~"), "bet_app_user_table", f"table_after{match_id}.json")
    with open(filepath, "w") as f:
        json.dump(table_after.data, f, indent=4)

    return jsonify(response)

if __name__ == "__main__":
    app.run(debug=True)
