from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd


# ============================================================
# SERVICES
# ============================================================

from services.simulation_service import (
    simulate_world_cup
)

from services.probability_service import (
    get_probability_table,
    get_all_probabilities,
    get_team_progression
)

from services.feature_engineering import (
    team_statistics
)

from services.model_service import (
    model,
    feature_columns
)

from services.prediction_service import (
    predict_match
)


# ============================================================
# FASTAPI APPLICATION
# ============================================================

app = FastAPI(
    title="FIFA World Cup 2026 Prediction API",
    description=(
        "Backend API for FIFA World Cup 2026 "
        "ML predictions and tournament simulation."
    ),
    version="1.0.0"
)


# ============================================================
# CORS
# ============================================================

app.add_middleware(
    CORSMiddleware,

    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://cupcast-fifa-2026.vercel.app",
    ],

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"],
)


# ============================================================
# REQUEST MODEL
# ============================================================

class MatchPredictionRequest(BaseModel):

    home_team: str

    away_team: str

    tournament: str = "FIFA World Cup"

    host_team: str | None = None


# ============================================================
# ROOT
# ============================================================

@app.get("/")
def root():

    return {
        "message":
            "FIFA World Cup 2026 Prediction API is running!",

        "status":
            "online"
    }


# ============================================================
# HEALTH
# ============================================================

@app.get("/health")
def health_check():

    return {
        "status": "healthy"
    }


# ============================================================
# MODEL STATUS
# ============================================================

@app.get("/model-status")
def model_status():

    return {
        "model_loaded":
            model is not None,

        "feature_count":
            len(feature_columns)
    }


# ============================================================
# MATCH PREDICTION
# ============================================================

@app.post("/predict")
def predict(
    request: MatchPredictionRequest
):

    try:

        result = predict_match(

            home_team=request.home_team,

            away_team=request.away_team,

            tournament=request.tournament,

            host_team=request.host_team

        )

        return {

            "success": True,

            "prediction": result

        }

    except ValueError as e:

        raise HTTPException(

            status_code=404,

            detail=str(e)

        )

    except Exception as e:

        raise HTTPException(

            status_code=400,

            detail=str(e)

        )


# ============================================================
# AVAILABLE TEAMS
# ============================================================

@app.get("/teams")
def get_teams():

    teams = sorted(

        team_statistics["team"]

        .dropna()

        .unique()

        .tolist()

    )

    return {

        "count": len(teams),

        "teams": teams

    }


# ============================================================
# TEAM DETAILS
# ============================================================

@app.get("/teams/{team_name}")
def get_team_details(
    team_name: str
):

    matching_teams = team_statistics[
        team_statistics["team"]
        .astype(str)
        .str.lower()
        == team_name.lower()
    ]


    if matching_teams.empty:

        raise HTTPException(

            status_code=404,

            detail=f"Team '{team_name}' not found."

        )


    team_data = (
        matching_teams
        .iloc[0]
        .to_dict()
    )


    # Convert pandas NaN values
    # into JSON-compatible null values.

    for key, value in team_data.items():

        if pd.isna(value):

            team_data[key] = None

        elif hasattr(value, "item"):

            team_data[key] = value.item()


    return {

        "success": True,

        "team": team_data

    }


# ============================================================
# PROBABILITY TABLE
# ============================================================

@app.get("/probabilities/{stage}")
def get_probabilities_by_stage(
    stage: str
):

    try:

        data = get_probability_table(stage)

        return {

            "stage": stage,

            "data": data

        }

    except ValueError as e:

        raise HTTPException(

            status_code=400,

            detail=str(e)

        )

    except FileNotFoundError as e:

        raise HTTPException(

            status_code=404,

            detail=str(e)

        )


# ============================================================
# ALL PROBABILITIES
# ============================================================

@app.get("/probabilities")
def get_probabilities():

    return {

        "data":
            get_all_probabilities()

    }


# ============================================================
# TEAM PROGRESSION
# ============================================================

@app.get("/progression")
def progression():

    return {

        "data":
            get_team_progression()

    }


# ============================================================
# TOURNAMENT SIMULATION
# ============================================================

@app.post("/simulation")
def simulation():

    try:

        result = simulate_world_cup()

        return {

            "success": True,

            "simulation": result

        }

    except Exception as e:

        raise HTTPException(

            status_code=500,

            detail=str(e)

        )