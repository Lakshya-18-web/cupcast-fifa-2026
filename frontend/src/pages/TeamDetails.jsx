import {
  useEffect,
  useState
} from "react";

import {
  useParams,
  useNavigate
} from "react-router-dom";

import {
  getTeamDetails,
  getTeamProgression
} from "../services/api";


function TeamDetails() {

  const { teamName } =
    useParams();

  const navigate =
    useNavigate();


  const team =
    decodeURIComponent(teamName);


  const [teamData, setTeamData] =
    useState(null);


  const [progression, setProgression] =
    useState(null);


  const [loading, setLoading] =
    useState(true);


  const [error, setError] =
    useState("");


  /* ========================================
     LOAD TEAM DATA
  ======================================== */

  useEffect(() => {

    async function loadData() {

      try {

        setLoading(true);

        setError("");


        const [
          teamResponse,
          progressionResponse
        ] = await Promise.all([

          getTeamDetails(team),

          getTeamProgression()

        ]);


        setTeamData(
          teamResponse.team
        );


        const teamProgression =
          progressionResponse.data.find(
            (item) =>
              item.Team === team
          );


        setProgression(
          teamProgression || null
        );


      } catch (err) {

        setError(
          err.message ||
          "Unable to load team data."
        );

      } finally {

        setLoading(false);

      }

    }


    loadData();

  }, [team]);


  /* ========================================
     LOADING
  ======================================== */

  if (loading) {

    return (

      <div className="team-details-page">

        <div className="teams-state">

          Loading {team}...

        </div>

      </div>

    );

  }


  /* ========================================
     ERROR
  ======================================== */

  if (error) {

    return (

      <div className="team-details-page">

        <button
          className="back-button"
          onClick={() =>
            navigate("/teams")
          }
        >
          ← Back to Teams
        </button>


        <div className="error-message">

          {error}

        </div>

      </div>

    );

  }


  /* ========================================
     DATA VALUES
  ======================================== */

  const fifaRank =
    teamData?.FIFA_Rank ??
    teamData?.fifa_rank ??
    "—";


  const eloRating =
    teamData?.elo_rating_x ??
    teamData?.elo_rating_y ??
    teamData?.elo_rating ??
    "—";


  const formPoints =
    teamData?.form_points ??
    "—";


  const goalDifference =
    teamData?.goal_difference ??
    "—";


  const championProbability =
    progression?.Champion ??
    0;


  const progressionStages = [

    {
      label: "Group Winner",
      value:
        progression?.["Group Winner"] ?? 0
    },

    {
      label: "Group Runner-up",
      value:
        progression?.["Group Runner-up"] ?? 0
    },

    {
      label: "Round of 32",
      value:
        progression?.["Qualified for R32"] ?? 0
    },

    {
      label: "Round of 16",
      value:
        progression?.["Round of 16"] ?? 0
    },

    {
      label: "Quarter-final",
      value:
        progression?.["Quarter-final"] ?? 0
    },

    {
      label: "Semi-final",
      value:
        progression?.["Semi-final"] ?? 0
    },

    {
      label: "Final",
      value:
        progression?.["Final"] ?? 0
    },

    {
      label: "Champion",
      value:
        progression?.Champion ?? 0
    }

  ];


  return (

    <div className="team-details-page">


      {/* ==================================
          BACK
      ================================== */}

      <button

        className="back-button"

        onClick={() =>
          navigate("/teams")
        }

      >

        ← Back to Teams

      </button>



      {/* ==================================
          TEAM HEADER
      ================================== */}

      <div className="team-details-header">


        <div className="team-details-avatar">

          {getTeamInitials(team)}

        </div>


        <div>

          <span className="section-label">

            TEAM PROFILE

          </span>


          <h1>

            {team}

          </h1>


          <p>

            FIFA World Cup 2026

          </p>

        </div>

      </div>



      {/* ==================================
          CORE STATS
      ================================== */}

      <div className="team-details-grid">


        <StatCard
          label="FIFA RANKING"
          value={fifaRank}
          description="Current ranking"
        />


        <StatCard
          label="ELO RATING"
          value={formatNumber(eloRating)}
          description="Current Elo rating"
        />


        <StatCard
          label="CHAMPIONSHIP PROBABILITY"
          value={`${Number(
            championProbability
          ).toFixed(2)}%`}
          description="Monte Carlo probability"
        />


      </div>



      {/* ==================================
          FORM / PERFORMANCE
      ================================== */}

      <div className="team-secondary-grid">


        <StatCard
          label="FORM POINTS"
          value={formPoints}
          description="Recent match form"
        />


        <StatCard
          label="GOAL DIFFERENCE"
          value={goalDifference}
          description="Recent goal difference"
        />


        <StatCard
          label="TOURNAMENT MODEL"
          value="XGBoost"
          description="Prediction engine"
        />


      </div>



      {/* ==================================
          PROGRESSION
      ================================== */}

      <div className="team-progression-card">


        <div>

          <span className="section-label">

            TOURNAMENT PROGRESSION

          </span>


          <h2>

            Probability of reaching each stage

          </h2>


          <p>

            Based on the 10,000 Monte Carlo
            tournament simulations.

          </p>

        </div>


        <div className="progression-list">

          {progressionStages.map(
            (stage) => (

              <div
                key={stage.label}
                className="progression-row"
              >


                <div className="progression-label">

                  <span>
                    {stage.label}
                  </span>

                  <strong>
                    {Number(
                      stage.value
                    ).toFixed(2)}
                    %
                  </strong>

                </div>


                <div className="progression-bar">

                  <div
                    style={{
                      width:
                        `${Math.min(
                          Number(stage.value),
                          100
                        )}%`
                    }}
                  />

                </div>


              </div>

            )
          )}

        </div>

      </div>


    </div>

  );

}


/* ==========================================
   STAT CARD
========================================== */

function StatCard({
  label,
  value,
  description
}) {

  return (

    <div className="detail-card">

      <span>
        {label}
      </span>


      <strong>
        {value}
      </strong>


      <p>
        {description}
      </p>

    </div>

  );

}


/* ==========================================
   NUMBER FORMATTER
========================================== */

function formatNumber(value) {

  if (
    value === null ||
    value === undefined ||
    value === "—"
  ) {

    return "—";

  }


  const number =
    Number(value);


  if (Number.isNaN(number)) {

    return value;

  }


  return number.toLocaleString();

}


/* ==========================================
   TEAM INITIALS
========================================== */

function getTeamInitials(team) {

  const words =
    team.split(" ");


  if (words.length === 1) {

    return team
      .slice(0, 2)
      .toUpperCase();

  }


  return words

    .slice(0, 2)

    .map(
      (word) => word[0]
    )

    .join("")

    .toUpperCase();

}


export default TeamDetails;