import os

from dotenv import load_dotenv
from flask import Flask, request
from supabase import create_client

load_dotenv()

url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_KEY")
supabase = create_client(url, key)

app = Flask(__name__)


@app.route("/", methods=["GET"])
def get_matches():
    response = (
        supabase.table("matches")
        .select(
            "team_one:teams!matches_team_one_fkey(name, flag)",
            "team_two:teams!matches_team_two_fkey(name, flag)",
            "date",
            "time",
            "team_one_goals",
            "team_two_goals",
            "group",
        )
        .execute()
    )
    return response.model_dump_json()

@app.route("/matches", methods=["POST"])
def post_matches():
    matches = request.get_json()
    for match in matches:
        print(match)

if __name__ == "__main__":
    app.run(debug=True)
