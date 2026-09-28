import { useState } from "react";

import { runSimulation } from "../services/api";


function Tournament() {

  const [simulation, setSimulation] = useState(null);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [activeStage, setActiveStage] = useState("round32");


  /* ==========================================
     RUN TOURNAMENT
  ========================================== */

  async function handleSimulation() {

    setLoading(true);
    setError("");

    try {

      const data = await runSimulation();

      console.log("TOURNAMENT SIMULATION:", data);

      setSimulation(data);

    } catch (err) {

      console.error("Simulation error:", err);

      setError(
        err.message ||
        "Tournament simulation failed."
      );

    } finally {

      setLoading(false);

    }

  }


  /* ==========================================
     TOURNAMENT STAGES
  ========================================== */

  const stages = [

    {
      key: "round32",
      label: "Round of 32",
    },

    {
      key: "round16",
      label: "Round of 16",
    },

    {
      key: "quarterfinals",
      label: "Quarter-finals",
    },

    {
      key: "semifinals",
      label: "Semi-finals",
    },

    {
      key: "final",
      label: "Final",
    },

  ];


  return (

    <div className="tournament-page">


      {/* ==================================
          HEADER
      ================================== */}

      <div className="tournament-header">

        <div>

          <span className="section-label">
            TOURNAMENT ENGINE
          </span>

          <h1>
            World Cup Simulator
          </h1>

          <p>
            Simulate an entire FIFA World Cup
            using the trained match prediction
            model.
          </p>

        </div>


        <button
          className="simulate-button"
          onClick={handleSimulation}
          disabled={loading}
        >

          {loading
            ? "Simulating..."
            : "▶ Run Tournament"}

        </button>

      </div>


      {/* ==================================
          INTRO
      ================================== */}

      {!simulation && !loading && (

        <section className="tournament-intro">

          <div className="intro-icon">
            🏆
          </div>

          <div>

            <h2>
              Run a complete tournament
            </h2>

            <p>
              The simulation starts from the
              group stage and progresses through
              the knockout rounds until a champion
              is determined.
            </p>

          </div>

        </section>

      )}


      {/* ==================================
          LOADING
      ================================== */}

      {loading && (

        <section className="simulation-loading">

          <div className="loading-spinner" />

          <h2>
            Simulating World Cup...
          </h2>

          <p>
            Running the tournament prediction
            engine.
          </p>

        </section>

      )}


      {/* ==================================
          ERROR
      ================================== */}

      {error && (

        <div className="error-message">
          {error}
        </div>

      )}


      {/* ==================================
          SIMULATION RESULT
      ================================== */}

      {simulation && !loading && (

        <>

          {/* ==================================
              CHAMPION CARD
          ================================== */}

          <section className="champion-card">

            <div>

              <span className="section-label">
                SIMULATION RESULT
              </span>

              <h2>
                {simulation.champion}
              </h2>

              <p>
                Tournament Champion
              </p>

            </div>


            <div className="podium">

              <div>

                <span>
                  Runner-up
                </span>

                <strong>
                  {simulation.runner_up}
                </strong>

              </div>


              <div>

                <span>
                  Third
                </span>

                <strong>
                  {simulation.third}
                </strong>

              </div>


              <div>

                <span>
                  Fourth
                </span>

                <strong>
                  {simulation.fourth}
                </strong>

              </div>

            </div>

          </section>


          {/* ==================================
              STAGE SECTION
          ================================== */}

          <section className="stage-section">


            {/* STAGE TABS */}

            <div className="stage-tabs">

              {stages.map((stage) => (

                <button
                  key={stage.key}
                  className={
                    activeStage === stage.key
                      ? "stage-tab active"
                      : "stage-tab"
                  }
                  onClick={() =>
                    setActiveStage(stage.key)
                  }
                >

                  {stage.label}

                </button>

              ))}

            </div>


            {/* STAGE CONTENT */}

            <StageView
              stage={activeStage}
              simulation={simulation}
            />

          </section>

        </>

      )}

    </div>

  );

}


/* ==========================================
   STAGE VIEW
========================================== */

function StageView({
  stage,
  simulation,
}) {


  const data = simulation[stage];


  console.log(
    "Stage:",
    stage,
    "Data:",
    data
  );


  /* ----------------------------------------
     FINAL
  ---------------------------------------- */

  if (stage === "final") {

    return (

      <div className="final-stage">

        <div className="final-match-card">

          <span className="section-label">
            FINAL
          </span>


          <div className="final-teams">

            <strong>
              {simulation.finalists?.[0] ||
                "Finalist 1"}
            </strong>

            <span>
              VS
            </span>

            <strong>
              {simulation.finalists?.[1] ||
                "Finalist 2"}
            </strong>

          </div>


          <div className="final-winner">

            <span>
              Champion
            </span>

            <strong>
              {simulation.champion}
            </strong>

          </div>

        </div>

      </div>

    );

  }


  /* ----------------------------------------
     NO DATA
  ---------------------------------------- */

  if (
    !data ||
    !Array.isArray(data) ||
    data.length === 0
  ) {

    return (

      <div className="stage-empty">

        No data available for this stage.

      </div>

    );

  }


  /* ----------------------------------------
     STAGE HEADER
  ---------------------------------------- */

  const stageTitles = {

    round32: {
      label: "ROUND OF 32",
      title: "Qualified Teams",
      description:
        "The 32 teams advancing to the knockout stage.",
    },

    round16: {
      label: "ROUND OF 16",
      title: "Round of 16",
      description:
        "The 16 teams remaining in the tournament.",
    },

    quarterfinals: {
      label: "QUARTER-FINALS",
      title: "Quarter-finals",
      description:
        "The final eight teams competing for a semi-final place.",
    },

    semifinals: {
      label: "SEMI-FINALS",
      title: "Semi-finals",
      description:
        "The final four teams competing for a place in the final.",
    },

  };


  const stageInfo =
    stageTitles[stage];


  /* ----------------------------------------
     MATCHES
  ---------------------------------------- */

  return (

    <div className="stage-content">

      {stageInfo && (

        <div className="stage-heading">

          <span className="section-label">
            {stageInfo.label}
          </span>

          <h2>
            {stageInfo.title}
          </h2>

          <p>
            {stageInfo.description}
          </p>

        </div>

      )}


      <div className="bracket-grid">

        {data.map((match, index) => (

          <MatchCard
            key={index}
            match={match}
            index={index}
          />

        ))}

      </div>

    </div>

  );

}


/* ==========================================
   MATCH CARD
========================================== */

function MatchCard({
  match,
  index,
}) {


  /*
    Support the possible structures
    returned by the backend.
  */

  const home =
    match?.home_team ||
    match?.home ||
    match?.team1 ||
    match?.teams?.[0] ||
    match?.team_a ||
    "Team 1";


  const away =
    match?.away_team ||
    match?.away ||
    match?.team2 ||
    match?.teams?.[1] ||
    match?.team_b ||
    "Team 2";


  const winner =
    match?.winner ||
    match?.result ||
    match?.winning_team ||
    "";


  return (

    <div className="match-card">


      {/* MATCH NUMBER */}

      <div className="match-number">

        MATCH {index + 1}

      </div>


      {/* HOME TEAM */}

      <div
        className={
          winner === home
            ? "match-team winner"
            : "match-team"
        }
      >

        <span>
          {home}
        </span>

        {winner === home && (

          <b>
            W
          </b>

        )}

      </div>


      {/* DIVIDER */}

      <div className="match-divider">

        VS

      </div>


      {/* AWAY TEAM */}

      <div
        className={
          winner === away
            ? "match-team winner"
            : "match-team"
        }
      >

        <span>
          {away}
        </span>

        {winner === away && (

          <b>
            W
          </b>

        )}

      </div>


    </div>

  );

}


export default Tournament;