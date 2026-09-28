from pathlib import Path

import pandas as pd


# ============================================================
# PATHS
# ============================================================

PROJECT_ROOT = Path(__file__).resolve().parents[2]

TEAM_STATISTICS_PATH = (
    PROJECT_ROOT
    / "data"
    / "team_statistics.csv"
)


# ============================================================
# EXACT FEATURES USED BY THE TRAINED MODEL
# ============================================================

FEATURE_COLUMNS = [
    "home_elo",
    "away_elo",
    "elo_difference",

    "home_fifa_rank",
    "away_fifa_rank",
    "rank_difference",

    "home_form_points",
    "away_form_points",
    "form_difference",

    "home_goal_diff",
    "away_goal_diff",
    "goal_diff_difference",

    "home_wins_last5",
    "away_wins_last5",
    "wins_difference",

    "host_advantage",
    "tournament_type",
    "tournament_importance"
]


# ============================================================
# LOAD TEAM STATISTICS
# ============================================================

def load_team_statistics():
    """
    Load the precomputed team statistics generated
    by the original prediction notebook.
    """

    if not TEAM_STATISTICS_PATH.exists():
        raise FileNotFoundError(
            f"Team statistics file not found: "
            f"{TEAM_STATISTICS_PATH}"
        )

    return pd.read_csv(TEAM_STATISTICS_PATH)


team_statistics = load_team_statistics()


# ============================================================
# GET TEAM
# ============================================================

def get_team(team: str):
    """
    Return statistics for a specific national team.
    """

    row = team_statistics[
        team_statistics["team"] == team
    ]

    if row.empty:
        raise ValueError(
            f"{team} not found in team statistics."
        )

    return row.iloc[0]


# ============================================================
# CREATE MATCH FEATURES
# ============================================================

def create_match_features(
    home_team: str,
    away_team: str,
    tournament_type: int = 0,
    tournament_importance: int = 5,
    host_advantage: int = 0
):
    """
    Recreates the exact feature construction used
    in 03_prediction_engine.ipynb.
    """

    home = get_team(home_team)
    away = get_team(away_team)

    features = {

        "home_elo":
        home["elo_rating"],

        "away_elo":
        away["elo_rating"],

        "elo_difference":
        home["elo_rating"] - away["elo_rating"],


        "home_fifa_rank":
        home["FIFA_Rank"],

        "away_fifa_rank":
        away["FIFA_Rank"],

        "rank_difference":
        away["FIFA_Rank"] - home["FIFA_Rank"],


        "home_form_points":
        home["form_points"],

        "away_form_points":
        away["form_points"],

        "form_difference":
        home["form_points"] - away["form_points"],


        "home_goal_diff":
        home["goal_difference"],

        "away_goal_diff":
        away["goal_difference"],

        "goal_diff_difference":
        home["goal_difference"]
        - away["goal_difference"],


        "home_wins_last5":
        home["wins_last5"],

        "away_wins_last5":
        away["wins_last5"],

        "wins_difference":
        home["wins_last5"]
        - away["wins_last5"],


        "host_advantage":
        host_advantage,

        "tournament_type":
        tournament_type,

        "tournament_importance":
        tournament_importance
    }

    features = pd.DataFrame([features])

    # EXACT SAME ORDER AS TRAINING
    features = features[FEATURE_COLUMNS]

    return features