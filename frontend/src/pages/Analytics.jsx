import { useEffect, useMemo, useState } from "react";

import {
  getAllProbabilities,
  getTeamProgression,
} from "../services/api";


function Analytics() {

  const [probabilities, setProbabilities] = useState(null);
  const [progression, setProgression] = useState([]);

  const [selectedTeam, setSelectedTeam] =
    useState("Spain");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  /* =========================================================
     LOAD ANALYTICS DATA
  ========================================================= */

  useEffect(() => {

    async function loadAnalytics() {

      try {

        setLoading(true);
        setError("");

        const [
          probabilityData,
          progressionData,
        ] = await Promise.all([
          getAllProbabilities(),
          getTeamProgression(),
        ]);


        setProbabilities(
          probabilityData?.data || {}
        );

        setProgression(
          progressionData?.data || []
        );

      } catch (err) {

        setError(
          err.message ||
          "Unable to load analytics data."
        );

      } finally {

        setLoading(false);

      }

    }


    loadAnalytics();

  }, []);


  /* =========================================================
     CHAMPION DATA
  ========================================================= */

  const championData = useMemo(() => {

    if (!probabilities) {
      return [];
    }


    /*
      Backend normally returns:

      {
        champion: [...],
        ...
      }

      We also support:
      {
        "champion_probabilities": [...]
      }
    */

    const data =
      probabilities.champion ||
      probabilities.champion_probabilities ||
      [];


    if (!Array.isArray(data)) {
      return [];
    }


    return [...data]
      .sort(
        (a, b) =>
          Number(
            b["Probability (%)"] ??
            b.probability ??
            0
          )
          -
          Number(
            a["Probability (%)"] ??
            a.probability ??
            0
          )
      )
      .slice(0, 10);

  }, [probabilities]);


  /* =========================================================
     SELECTED TEAM
  ========================================================= */

  const teamData = useMemo(() => {

    if (!progression || progression.length === 0) {
      return null;
    }


    return progression.find(
      (team) =>
        String(team.Team).toLowerCase() ===
        String(selectedTeam).toLowerCase()
    ) || null;

  }, [progression, selectedTeam]);


  /* =========================================================
     TEAM LIST
  ========================================================= */

  const teamList = useMemo(() => {

    return progression
      .map((team) => team.Team)
      .filter(Boolean)
      .sort();

  }, [progression]);


  /* =========================================================
     HELPERS
  ========================================================= */

  function getProbability(row) {

    return Number(
      row["Probability (%)"] ??
      row.probability ??
      0
    );

  }


  function getStageValue(team, stage) {

    if (!team) {
      return 0;
    }

    return Number(
      team[stage] ?? 0
    );

  }


  function formatPercentage(value) {

    const number = Number(value || 0);

    return `${number.toFixed(2)}%`;

  }


  function getBarWidth(value) {

    const number = Number(value || 0);

    return `${Math.min(Math.max(number, 0), 100)}%`;

  }


  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {

    return (

      <div className="analytics-page">

        <div className="page-header">

          <span className="section-label">
            TOURNAMENT ANALYTICS
          </span>

          <h1>
            Simulation Analytics
          </h1>

          <p>
            Loading Monte Carlo simulation results...
          </p>

        </div>


        <div className="analytics-loading">

          <div className="loading-spinner" />

          <p>
            Loading 10,000 simulation results...
          </p>

        </div>

      </div>

    );

  }


  /* =========================================================
     ERROR
  ========================================================= */

  if (error) {

    return (

      <div className="analytics-page">

        <div className="page-header">

          <span className="section-label">
            TOURNAMENT ANALYTICS
          </span>

          <h1>
            Simulation Analytics
          </h1>

          <p>
            Analyze the results of the FIFA World Cup
            Monte Carlo simulation.
          </p>

        </div>


        <div className="error-message">
          {error}
        </div>

      </div>

    );

  }


  /* =========================================================
     MAIN DASHBOARD
  ========================================================= */

  return (

    <div className="analytics-page">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="page-header">

        <span className="section-label">
          TOURNAMENT ANALYTICS
        </span>

        <h1>
          Simulation Analytics
        </h1>

        <p>
          Explore the probabilities generated from
          10,000 Monte Carlo World Cup simulations.
        </p>

      </div>


      {/* =====================================================
          SUMMARY CARDS
      ===================================================== */}

      <section className="analytics-summary">

        <div className="analytics-stat-card">

          <span className="analytics-stat-label">
            SIMULATIONS
          </span>

          <strong>
            10,000
          </strong>

          <p>
            Monte Carlo tournaments
          </p>

        </div>


        <div className="analytics-stat-card">

          <span className="analytics-stat-label">
            TEAMS
          </span>

          <strong>
            {progression.length || 48}
          </strong>

          <p>
            Teams analyzed
          </p>

        </div>


        <div className="analytics-stat-card">

          <span className="analytics-stat-label">
            TOP CHAMPIONSHIP PROBABILITY
          </span>

          <strong>
            {championData.length > 0
              ? formatPercentage(
                  getProbability(championData[0])
                )
              : "—"}
          </strong>

          <p>
            Highest simulated probability
          </p>

        </div>


        <div className="analytics-stat-card">

          <span className="analytics-stat-label">
            MODEL
          </span>

          <strong>
            XGBoost
          </strong>

          <p>
            Match prediction engine
          </p>

        </div>

      </section>


      {/* =====================================================
          CHAMPION PROBABILITY
      ===================================================== */}

      <section className="analytics-card">

        <div className="analytics-card-header">

          <div>

            <span className="section-label">
              CHAMPIONSHIP PROBABILITY
            </span>

            <h2>
              Who becomes champion?
            </h2>

            <p>
              Simulated probability of winning the
              FIFA World Cup.
            </p>

          </div>

        </div>


        <div className="champion-chart">

          {championData.length === 0 ? (

            <div className="analytics-empty">
              No championship probability data available.
            </div>

          ) : (

            championData.map((team, index) => {

              const probability =
                getProbability(team);

              const teamName =
                team.Team ||
                team.team ||
                `Team ${index + 1}`;


              return (

                <div
                  className="probability-row"
                  key={teamName}
                >

                  <div className="probability-rank">
                    {String(index + 1).padStart(2, "0")}
                  </div>


                  <div className="probability-team">

                    <div className="probability-team-header">

                      <strong>
                        {teamName}
                      </strong>

                      <span>
                        {formatPercentage(probability)}
                      </span>

                    </div>


                    <div className="probability-track">

                      <div
                        className="probability-fill"
                        style={{
                          width:
                            getBarWidth(probability),
                        }}
                      />

                    </div>

                  </div>

                </div>

              );

            })

          )}

        </div>

      </section>


      {/* =====================================================
          TEAM PROGRESSION
      ===================================================== */}

      <section className="analytics-card">

        <div className="analytics-card-header">

          <div>

            <span className="section-label">
              TOURNAMENT PROGRESSION
            </span>

            <h2>
              Team journey through the tournament
            </h2>

            <p>
              Compare the probability of a team
              reaching each stage.
            </p>

          </div>


          <select
            className="analytics-team-select"
            value={selectedTeam}
            onChange={(event) =>
              setSelectedTeam(event.target.value)
            }
          >

            {teamList.map((team) => (

              <option
                key={team}
                value={team}
              >
                {team}
              </option>

            ))}

          </select>

        </div>


        {teamData ? (

          <div className="progression-chart">

            <ProgressionBar
              label="Group Winner"
              value={getStageValue(
                teamData,
                "Group Winner"
              )}
            />

            <ProgressionBar
              label="Group Runner-up"
              value={getStageValue(
                teamData,
                "Group Runner-up"
              )}
            />

            <ProgressionBar
              label="Round of 32"
              value={getStageValue(
                teamData,
                "Qualified for R32"
              )}
            />

            <ProgressionBar
              label="Round of 16"
              value={getStageValue(
                teamData,
                "Round of 16"
              )}
            />

            <ProgressionBar
              label="Quarter-final"
              value={getStageValue(
                teamData,
                "Quarter-final"
              )}
            />

            <ProgressionBar
              label="Semi-final"
              value={getStageValue(
                teamData,
                "Semi-final"
              )}
            />

            <ProgressionBar
              label="Final"
              value={getStageValue(
                teamData,
                "Final"
              )}
            />

            <ProgressionBar
              label="Champion"
              value={getStageValue(
                teamData,
                "Champion"
              )}
              highlight
            />

          </div>

        ) : (

          <div className="analytics-empty">
            No progression data available for this team.
          </div>

        )}

      </section>


      {/* =====================================================
          FULL TEAM TABLE
      ===================================================== */}

      <section className="analytics-card">

        <div className="analytics-card-header">

          <div>

            <span className="section-label">
              TEAM COMPARISON
            </span>

            <h2>
              Tournament probabilities
            </h2>

            <p>
              Compare how teams progress through
              the simulated tournament.
            </p>

          </div>

        </div>


        {progression.length > 0 ? (

          <div className="analytics-table-wrapper">

            <table className="analytics-table">

              <thead>

                <tr>

                  <th>
                    Team
                  </th>

                  <th>
                    R32
                  </th>

                  <th>
                    R16
                  </th>

                  <th>
                    QF
                  </th>

                  <th>
                    SF
                  </th>

                  <th>
                    Final
                  </th>

                  <th>
                    Champion
                  </th>

                </tr>

              </thead>


              <tbody>

                {progression.map((team) => (

                  <tr
                    key={team.Team}
                    className={
                      team.Team === selectedTeam
                        ? "selected-team-row"
                        : ""
                    }
                  >

                    <td>

                      <button
                        className="analytics-team-button"
                        onClick={() =>
                          setSelectedTeam(team.Team)
                        }
                      >
                        {team.Team}
                      </button>

                    </td>


                    <td>
                      {formatPercentage(
                        team["Qualified for R32"]
                      )}
                    </td>


                    <td>
                      {formatPercentage(
                        team["Round of 16"]
                      )}
                    </td>


                    <td>
                      {formatPercentage(
                        team["Quarter-final"]
                      )}
                    </td>


                    <td>
                      {formatPercentage(
                        team["Semi-final"]
                      )}
                    </td>


                    <td>
                      {formatPercentage(
                        team["Final"]
                      )}
                    </td>


                    <td className="champion-value">
                      {formatPercentage(
                        team["Champion"]
                      )}
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        ) : (

          <div className="analytics-empty">
            No team progression data available.
          </div>

        )}

      </section>


      {/* =====================================================
          MODEL INFORMATION
      ===================================================== */}

      <section className="analytics-model-card">

        <div>

          <span className="section-label">
            MODEL INFORMATION
          </span>

          <h2>
            How these probabilities are generated
          </h2>

          <p>
            Each tournament simulation uses the trained
            XGBoost match prediction model. Group-stage
            results determine qualification, followed by
            simulated knockout matches until a champion
            is produced. Repeating this process 10,000
            times produces the tournament probabilities
            shown above.
          </p>

        </div>


        <div className="analytics-model-tags">

          <span>
            XGBoost
          </span>

          <span>
            18 Features
          </span>

          <span>
            Monte Carlo
          </span>

          <span>
            10,000 Simulations
          </span>

        </div>

      </section>

    </div>

  );
}


/* ============================================================
   PROGRESSION BAR
============================================================ */

function ProgressionBar({
  label,
  value,
  highlight = false,
}) {

  const percentage =
    Number(value || 0);


  return (

    <div
      className={
        highlight
          ? "progression-item highlight"
          : "progression-item"
      }
    >

      <div className="progression-header">

        <span>
          {label}
        </span>

        <strong>
          {percentage.toFixed(2)}%
        </strong>

      </div>


      <div className="progression-track">

        <div
          className="progression-fill"
          style={{
            width:
              `${Math.min(
                Math.max(percentage, 0),
                100
              )}%`,
          }}
        />

      </div>

    </div>

  );

}


export default Analytics;