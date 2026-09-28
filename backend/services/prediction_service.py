import numpy as np

from services.model_service import model

from services.feature_engineering import (
    create_match_features
)


# ============================================================
# TOURNAMENT IMPORTANCE
# ============================================================

TOURNAMENT_IMPORTANCE = {

    "Friendly": 1,

    "Nations League": 2,

    "Qualifier": 3,

    "Continental Cup": 4,

    "FIFA World Cup": 5
}


# ============================================================
# PREDICT MATCH
# ============================================================

def predict_match(
    home_team: str,
    away_team: str,
    tournament: str = "FIFA World Cup",
    host_team: str | None = None
):
    """
    Generate match outcome probabilities.

    Model classes:

        0 = Away Win
        1 = Draw
        2 = Home Win
    """

    # --------------------------------------------------------
    # Tournament importance
    # --------------------------------------------------------

    tournament_importance = (
        TOURNAMENT_IMPORTANCE.get(
            tournament,
            1
        )
    )

    # --------------------------------------------------------
    # Exact notebook behaviour
    # --------------------------------------------------------

    tournament_type = 0

    host_advantage = 0

    if host_team is not None:

        if home_team == host_team:

            host_advantage = 1

    # --------------------------------------------------------
    # Create exact 18-feature vector
    # --------------------------------------------------------

    features = create_match_features(

        home_team,

        away_team,

        tournament_type,

        tournament_importance,

        host_advantage
    )

    # --------------------------------------------------------
    # Prediction
    # --------------------------------------------------------

    probabilities = model.predict_proba(
        features
    )[0]

    # --------------------------------------------------------
    # Determine prediction
    # --------------------------------------------------------

    winner = np.argmax(
        probabilities
    )

    if winner == 0:

        prediction = f"{away_team} Win"

    elif winner == 1:

        prediction = "Draw"

    else:

        prediction = f"{home_team} Win"

    # --------------------------------------------------------
    # Return API-friendly response
    # --------------------------------------------------------

    return {

        "home_team":
        home_team,

        "away_team":
        away_team,

        "prediction":
        prediction,

        "probabilities": {

            "home_win":
            float(probabilities[2]),

            "draw":
            float(probabilities[1]),

            "away_win":
            float(probabilities[0])
        },

        "features":
        features.iloc[0].to_dict()
    }