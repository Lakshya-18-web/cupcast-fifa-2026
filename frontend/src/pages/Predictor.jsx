import { useEffect, useState } from "react";

import {
  getTeams,
  predictMatch,
} from "../services/api";


function Predictor() {

  const [teams, setTeams] = useState([]);

  const [homeTeam, setHomeTeam] =
    useState("");

  const [awayTeam, setAwayTeam] =
    useState("");

  const [prediction, setPrediction] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");


  /* ========================================
     LOAD TEAMS
  ======================================== */

  useEffect(() => {

    async function loadTeams() {

      try {

        const data = await getTeams();

        setTeams(data.teams || []);

      } catch (err) {

        setError(
          "Unable to load teams. Make sure the FastAPI server is running."
        );
      }
    }

    loadTeams();

  }, []);


  /* ========================================
     PREDICT
  ======================================== */

  async function handlePredict() {

    if (!homeTeam || !awayTeam) {

      setError(
        "Please select both teams."
      );

      return;
    }

    if (homeTeam === awayTeam) {

      setError(
        "Please select two different teams."
      );

      return;
    }

    setError("");
    setPrediction(null);
    setLoading(true);

    try {

      const data = await predictMatch({
        homeTeam,
        awayTeam,
      });

      setPrediction(
        data.prediction
      );

    } catch (err) {

      setError(
        err.message ||
        "Prediction failed."
      );

    } finally {

      setLoading(false);

    }
  }


  return (

    <div className="predictor-page">

      {/* ==================================
          HEADER
      ================================== */}

      <div className="page-header">

        <div>

          <span className="section-label">
            MATCH PREDICTOR
          </span>

          <h1>
            Who wins?
          </h1>

          <p>
            Select two teams and let the
            XGBoost prediction engine analyze
            the matchup.
          </p>

        </div>

      </div>


      {/* ==================================
          MATCH SELECTOR
      ================================== */}

      <section className="predictor-card">

        <div className="match-selectors">

          {/* HOME */}

          <div className="team-selector">

            <label>
              HOME TEAM
            </label>

            <select
              value={homeTeam}
              onChange={(event) =>
                setHomeTeam(
                  event.target.value
                )
              }
            >

              <option value="">
                Select home team
              </option>

              {teams.map((team) => (

                <option
                  key={team}
                  value={team}
                >
                  {team}
                </option>

              ))}

            </select>

          </div>


          <div className="vs-divider">
            VS
          </div>


          {/* AWAY */}

          <div className="team-selector">

            <label>
              AWAY TEAM
            </label>

            <select
              value={awayTeam}
              onChange={(event) =>
                setAwayTeam(
                  event.target.value
                )
              }
            >

              <option value="">
                Select away team
              </option>

              {teams.map((team) => (

                <option
                  key={team}
                  value={team}
                >
                  {team}
                </option>

              ))}

            </select>

          </div>

        </div>


        {/* ==================================
            BUTTON
        ================================== */}

        <button
          className="predict-button"
          onClick={handlePredict}
          disabled={loading}
        >

          {loading
            ? "Running Model..."
            : "Predict Match →"}

        </button>


        {/* ==================================
            ERROR
        ================================== */}

        {error && (

          <div className="error-message">
            {error}
          </div>

        )}

      </section>


      {/* ==================================
          RESULT
      ================================== */}

      {prediction && (

        <section className="prediction-result">

          <div className="result-header">

            <div>

              <span className="section-label">
                MODEL PREDICTION
              </span>

              <h2>
                {prediction.prediction}
              </h2>

            </div>

            <div className="result-match">
              {prediction.home_team}
              <span>vs</span>
              {prediction.away_team}
            </div>

          </div>


          <div className="probability-grid">

            <ProbabilityCard
              label={prediction.home_team}
              value={
                prediction.probabilities.home_win
              }
            />

            <ProbabilityCard
              label="Draw"
              value={
                prediction.probabilities.draw
              }
            />

            <ProbabilityCard
              label={prediction.away_team}
              value={
                prediction.probabilities.away_win
              }
            />

          </div>


          <div className="probability-bar">

            <div
              className="bar-home"
              style={{
                width:
                  `${prediction.probabilities.home_win * 100}%`
              }}
            />

            <div
              className="bar-draw"
              style={{
                width:
                  `${prediction.probabilities.draw * 100}%`
              }}
            />

            <div
              className="bar-away"
              style={{
                width:
                  `${prediction.probabilities.away_win * 100}%`
              }}
            />

          </div>


          <div className="model-note">

            <span>
              MODEL
            </span>

            <p>
              XGBoost classification using
              18 engineered match features.
            </p>

          </div>

        </section>

      )}

    </div>
  );
}


/* ==========================================
   PROBABILITY CARD
========================================== */

function ProbabilityCard({
  label,
  value,
}) {

  return (

    <div className="probability-card">

      <span>
        {label}
      </span>

      <strong>
        {(value * 100).toFixed(1)}%
      </strong>

    </div>

  );
}


export default Predictor;