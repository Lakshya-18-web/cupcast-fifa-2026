from pathlib import Path

import pandas as pd


# ============================================================
# PATHS
# ============================================================

PROJECT_ROOT = Path(__file__).resolve().parents[2]

OUTPUTS_DIR = PROJECT_ROOT / "outputs"


# ============================================================
# FILE MAPPING
# ============================================================

PROBABILITY_FILES = {

    "champion":
        "champion_probabilities.csv",

    "final":
        "final_probabilities.csv",

    "semifinal":
        "semifinal_probabilities.csv",

    "quarterfinal":
        "quarterfinal_probabilities.csv",

    "round16":
        "round16_probabilities.csv",

    "qualified_r32":
        "qualified_r32_probabilities.csv",

    "group_winner":
        "group_winner_probabilities.csv",

    "group_runner":
        "group_runner_probabilities.csv",

    "best_third":
        "best_third_probabilities.csv"
}


# ============================================================
# LOAD ONE PROBABILITY FILE
# ============================================================

def load_probability_file(filename: str):

    path = OUTPUTS_DIR / filename

    if not path.exists():

        raise FileNotFoundError(
            f"Probability file not found: {path}"
        )

    df = pd.read_csv(path)

    return df


# ============================================================
# GET PROBABILITY TABLE
# ============================================================

def get_probability_table(stage: str):

    if stage not in PROBABILITY_FILES:

        raise ValueError(
            f"Unknown stage: {stage}"
        )

    filename = PROBABILITY_FILES[stage]

    df = load_probability_file(filename)

    # Convert dataframe into frontend-friendly format
    records = df.to_dict(
        orient="records"
    )

    return records


# ============================================================
# GET ALL PROBABILITIES
# ============================================================

def get_all_probabilities():

    result = {}

    for stage, filename in PROBABILITY_FILES.items():

        try:

            result[stage] = load_probability_file(
                filename
            ).to_dict(
                orient="records"
            )

        except FileNotFoundError:

            result[stage] = []

    return result

# ============================================================
# TEAM PROGRESSION
# ============================================================

def get_team_progression():

    stages = {
        "group_winner": "Group Winner",
        "group_runner": "Group Runner-up",
        "best_third": "Best Third",
        "qualified_r32": "Qualified for R32",
        "round16": "Round of 16",
        "quarterfinal": "Quarter-final",
        "semifinal": "Semi-final",
        "final": "Final",
        "champion": "Champion"
    }

    progression = {}

    for stage_key, stage_name in stages.items():

        df = load_probability_file(
            PROBABILITY_FILES[stage_key]
        )

        for _, row in df.iterrows():

            team = row["Team"]

            if team not in progression:
                progression[team] = {
                    "Team": team
                }

            progression[team][stage_name] = float(
                row["Probability (%)"]
            )

    result = list(progression.values())

    return result