from pathlib import Path
import random

import joblib
import numpy as np
import pandas as pd

from services.model_service import model, feature_columns
from services.feature_engineering import (
    team_statistics,
    create_match_features
)


# ============================================================
# PATHS
# ============================================================

PROJECT_ROOT = Path(__file__).resolve().parents[2]

FIXTURES_PATH = (
    PROJECT_ROOT
    / "data"
    / "wc_2026_fixtures.csv"
)

THIRD_PLACE_LOOKUP_PATH = (
    PROJECT_ROOT
    / "models"
    / "third_place_lookup.pkl"
)


# ============================================================
# LOAD DATA
# ============================================================

fixtures = pd.read_csv(FIXTURES_PATH)

third_place_lookup = joblib.load(
    THIRD_PLACE_LOOKUP_PATH
)


# ============================================================
# GET TEAM
# ============================================================

def get_team(team):

    row = team_statistics[
        team_statistics["team"] == team
    ]

    if row.empty:
        raise ValueError(
            f"{team} not found."
        )

    return row.iloc[0]


# ============================================================
# SIMULATE MATCH
# ============================================================

def simulate_match(
    home_team,
    away_team,
    tournament="FIFA World Cup",
    host_team=None
):

    importance = {
        "Friendly": 1,
        "Nations League": 2,
        "Qualifier": 3,
        "Continental Cup": 4,
        "FIFA World Cup": 5
    }

    tournament_importance = importance.get(
        tournament,
        1
    )

    tournament_type = 0

    host_advantage = 0

    if host_team is not None:

        if home_team == host_team:
            host_advantage = 1

    features = create_match_features(
        home_team,
        away_team,
        tournament_type,
        tournament_importance,
        host_advantage
    )

    features = features[feature_columns]

    probabilities = model.predict_proba(
        features
    )[0]

    outcome = np.random.choice(
        [0, 1, 2],
        p=probabilities
    )

    return outcome, probabilities


# ============================================================
# SIMULATE GROUP
# ============================================================

def simulate_group(group_matches):

    table = {}

    teams = pd.unique(
        group_matches[
            ["team1", "team2"]
        ].values.ravel()
    )

    for team in teams:

        table[team] = {

            "Team": team,

            "Points": 0,

            "Played": 0,

            "Wins": 0,

            "Draws": 0,

            "Losses": 0,

            "GF": 0,

            "GA": 0,

            "GD": 0
        }

    for _, match in group_matches.iterrows():

        home = match["team1"]

        away = match["team2"]

        _, probabilities = simulate_match(
            home,
            away
        )

        home_prob = probabilities[2]

        draw_prob = probabilities[1]

        away_prob = probabilities[0]

        r = random.random()

        if r < home_prob:

            winner = home

            home_goals = random.choice(
                [1, 2, 2, 3, 3, 4]
            )

            away_goals = random.choice(
                [0, 1, 1, 2]
            )

        elif r < home_prob + draw_prob:

            winner = "Draw"

            g = random.choice(
                [0, 1, 1, 2]
            )

            home_goals = g

            away_goals = g

        else:

            winner = away

            home_goals = random.choice(
                [0, 1, 1, 2]
            )

            away_goals = random.choice(
                [1, 2, 2, 3, 3, 4]
            )

        table[home]["Played"] += 1
        table[away]["Played"] += 1

        if winner == home:

            table[home]["Points"] += 3

            table[home]["Wins"] += 1

            table[away]["Losses"] += 1

        elif winner == away:

            table[away]["Points"] += 3

            table[away]["Wins"] += 1

            table[home]["Losses"] += 1

        else:

            table[home]["Points"] += 1

            table[away]["Points"] += 1

            table[home]["Draws"] += 1

            table[away]["Draws"] += 1

        table[home]["GF"] += home_goals

        table[home]["GA"] += away_goals

        table[away]["GF"] += away_goals

        table[away]["GA"] += home_goals

    for team in teams:

        table[team]["GD"] = (
            table[team]["GF"]
            - table[team]["GA"]
        )

    standings = pd.DataFrame(
        table.values()
    )

    standings = standings.sort_values(
        by=[
            "Points",
            "GD",
            "GF"
        ],
        ascending=False
    ).reset_index(drop=True)

    return standings


# ============================================================
# SIMULATE ALL GROUPS
# ============================================================

def simulate_all_groups():

    group_fixtures = fixtures.dropna(
        subset=["group"]
    )

    groups = sorted(
        group_fixtures["group"].unique()
    )

    all_tables = {}

    for group in groups:

        matches = group_fixtures[
            group_fixtures["group"] == group
        ]

        all_tables[group] = simulate_group(
            matches
        )

    return all_tables


# ============================================================
# QUALIFIERS
# ============================================================

def get_group_qualifiers(group_tables):

    winners = {}

    qualifiers = {}

    for group, table in group_tables.items():

        winners[group] = table.iloc[0]["Team"]

        qualifiers[group] = [

            table.iloc[0]["Team"],

            table.iloc[1]["Team"]
        ]

    return winners, qualifiers


# ============================================================
# BEST THIRD-PLACED TEAMS
# ============================================================

def get_best_third_placed(group_tables):

    third_place = []

    for group, table in group_tables.items():

        team = table.iloc[2]

        third_place.append({

            "Group": group,

            "Team": team["Team"],

            "Points": team["Points"],

            "GD": team["GD"],

            "GF": team["GF"]
        })

    third_place = pd.DataFrame(
        third_place
    )

    third_place = third_place.sort_values(
        by=[
            "Points",
            "GD",
            "GF"
        ],
        ascending=False
    ).reset_index(drop=True)

    best8 = third_place.head(8)

    return third_place, best8


# ============================================================
# QUALIFIED TEAMS
# ============================================================

def get_qualified_teams(
    winners,
    qualifiers,
    best8
):

    qualified = {}

    for group in sorted(
        winners.keys()
    ):

        qualified[group + "1"] = (
            qualifiers[group][0]
        )

        qualified[group + "2"] = (
            qualifiers[group][1]
        )

    for _, row in best8.iterrows():

        qualified[
            row["Group"] + "3"
        ] = row["Team"]

    return qualified


# ============================================================
# ROUND OF 32
# ============================================================

def build_round_of_32(
    qualified,
    third_place_mapping
):

    bracket = {}

    bracket["73"] = (
        qualified["A2"],
        qualified["B2"]
    )

    bracket["75"] = (
        qualified["F1"],
        qualified["C2"]
    )

    bracket["76"] = (
        qualified["C1"],
        qualified["F2"]
    )

    bracket["78"] = (
        qualified["E2"],
        qualified["I2"]
    )

    bracket["83"] = (
        qualified["K2"],
        qualified["L2"]
    )

    bracket["84"] = (
        qualified["H1"],
        qualified["J2"]
    )

    bracket["86"] = (
        qualified["J1"],
        qualified["H2"]
    )

    bracket["88"] = (
        qualified["D2"],
        qualified["G2"]
    )

    bracket["74"] = (
        qualified["E1"],
        qualified[
            third_place_mapping["74"]
        ]
    )

    bracket["77"] = (
        qualified["I1"],
        qualified[
            third_place_mapping["77"]
        ]
    )

    bracket["79"] = (
        qualified["A1"],
        qualified[
            third_place_mapping["79"]
        ]
    )

    bracket["80"] = (
        qualified["L1"],
        qualified[
            third_place_mapping["80"]
        ]
    )

    bracket["81"] = (
        qualified["D1"],
        qualified[
            third_place_mapping["81"]
        ]
    )

    bracket["82"] = (
        qualified["G1"],
        qualified[
            third_place_mapping["82"]
        ]
    )

    bracket["85"] = (
        qualified["B1"],
        qualified[
            third_place_mapping["85"]
        ]
    )

    bracket["87"] = (
        qualified["K1"],
        qualified[
            third_place_mapping["87"]
        ]
    )

    return bracket


# ============================================================
# KNOCKOUT MATCH
# ============================================================

def simulate_knockout_match(
    team1,
    team2
):

    outcome, probabilities = simulate_match(
        team1,
        team2
    )

    if outcome == 2:

        return team1

    if outcome == 0:

        return team2

    home_prob = probabilities[2]

    away_prob = probabilities[0]

    probs = np.array(
        [home_prob, away_prob],
        dtype=float
    )

    probs /= probs.sum()

    return np.random.choice(
        [team1, team2],
        p=probs
    )


# ============================================================
# GENERIC ROUND
# ============================================================

def simulate_round(
    bracket
):

    winners = []

    results = []

    for match_id in sorted(
        bracket.keys(),
        key=lambda x: int(x)
    ):

        team1, team2 = bracket[
            match_id
        ]

        winner = simulate_knockout_match(
            team1,
            team2
        )

        winners.append(
            str(winner)
        )

        results.append({

            "match": match_id,

            "team1": team1,

            "team2": team2,

            "winner": winner
        })

    return winners, results


# ============================================================
# ROUND OF 16
# ============================================================

def build_round_of_16(
    teams
):

    return {

        "89": (teams[0], teams[1]),

        "90": (teams[2], teams[3]),

        "91": (teams[4], teams[5]),

        "92": (teams[6], teams[7]),

        "93": (teams[8], teams[9]),

        "94": (teams[10], teams[11]),

        "95": (teams[12], teams[13]),

        "96": (teams[14], teams[15])
    }


# ============================================================
# QUARTER-FINALS
# ============================================================

def build_quarterfinals(
    teams
):

    return {

        "97": (teams[0], teams[1]),

        "98": (teams[2], teams[3]),

        "99": (teams[4], teams[5]),

        "100": (teams[6], teams[7])
    }


# ============================================================
# SEMI-FINALS
# ============================================================

def build_semifinals(
    teams
):

    return {

        "101": (
            teams[0],
            teams[1]
        ),

        "102": (
            teams[2],
            teams[3]
        )
    }


# ============================================================
# SIMULATE SEMI-FINALS
# ============================================================

def simulate_semifinals(
    bracket
):

    finalists = []

    third_place_teams = []

    results = []

    for match_id in sorted(
        bracket.keys()
    ):

        team1, team2 = bracket[
            match_id
        ]

        winner = simulate_knockout_match(
            team1,
            team2
        )

        loser = (
            team2
            if winner == team1
            else team1
        )

        finalists.append(
            winner
        )

        third_place_teams.append(
            loser
        )

        results.append({

            "match": match_id,

            "team1": team1,

            "team2": team2,

            "winner": winner
        })

    return (
        finalists,
        third_place_teams,
        results
    )


# ============================================================
# COMPLETE WORLD CUP SIMULATION
# ============================================================

def simulate_world_cup():

    # --------------------------------------------------------
    # GROUP STAGE
    # --------------------------------------------------------

    group_tables = (
        simulate_all_groups()
    )

    winners, qualifiers = (
        get_group_qualifiers(
            group_tables
        )
    )

    _, best8 = (
        get_best_third_placed(
            group_tables
        )
    )

    qualified = (
        get_qualified_teams(
            winners,
            qualifiers,
            best8
        )
    )

    # --------------------------------------------------------
    # THIRD-PLACE LOOKUP
    # --------------------------------------------------------

    third_place_groups = sorted([

        key[0]

        for key in qualified.keys()

        if key.endswith("3")
    ])

    qualified_key = tuple(
        third_place_groups
    )

    third_place_mapping = (
        third_place_lookup[
            qualified_key
        ]
    )

    # --------------------------------------------------------
    # ROUND OF 32
    # --------------------------------------------------------

    round32 = build_round_of_32(
        qualified,
        third_place_mapping
    )

    round16_teams, round32_results = (
        simulate_round(round32)
    )

    # --------------------------------------------------------
    # ROUND OF 16
    # --------------------------------------------------------

    round16 = build_round_of_16(
        round16_teams
    )

    quarterfinal_teams, round16_results = (
        simulate_round(round16)
    )

    # --------------------------------------------------------
    # QUARTER-FINALS
    # --------------------------------------------------------

    quarterfinals = build_quarterfinals(
        quarterfinal_teams
    )

    semifinal_teams, quarterfinal_results = (
        simulate_round(quarterfinals)
    )

    # --------------------------------------------------------
    # SEMI-FINALS
    # --------------------------------------------------------

    semifinals = build_semifinals(
        semifinal_teams
    )

    (
        finalists,
        third_place_teams,
        semifinal_results
    ) = simulate_semifinals(
        semifinals
    )

    # --------------------------------------------------------
    # THIRD PLACE
    # --------------------------------------------------------

    third_place_winner = (
        simulate_knockout_match(
            third_place_teams[0],
            third_place_teams[1]
        )
    )

    fourth_place = (

        third_place_teams[1]

        if third_place_winner
        == third_place_teams[0]

        else third_place_teams[0]
    )

    # --------------------------------------------------------
    # FINAL
    # --------------------------------------------------------

    champion = (
        simulate_knockout_match(
            finalists[0],
            finalists[1]
        )
    )

    runner_up = (

        finalists[1]

        if champion == finalists[0]

        else finalists[0]
    )

    # --------------------------------------------------------
    # RETURN FULL TOURNAMENT
    # --------------------------------------------------------

    return {

        "groups": {
            group: table.to_dict(
                orient="records"
            )
            for group, table
            in group_tables.items()
        },

        "qualified": qualified,

        "round32": round32_results,

        "round16": round16_results,

        "quarterfinals":
            quarterfinal_results,

        "semifinals":
            semifinal_results,

        "finalists":
            finalists,

        "third_place": {

            "team1":
                third_place_teams[0],

            "team2":
                third_place_teams[1],

            "winner":
                third_place_winner
        },

        "final": {

            "team1":
                finalists[0],

            "team2":
                finalists[1],

            "winner":
                champion
        },

        "champion":
            str(champion),

        "runner_up":
            str(runner_up),

        "third":
            str(third_place_winner),

        "fourth":
            str(fourth_place)
    }