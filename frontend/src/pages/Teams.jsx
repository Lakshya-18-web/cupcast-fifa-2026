import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import { getTeams } from "../services/api";


function Teams() {

  const navigate = useNavigate();


  const [teams, setTeams] =
    useState([]);


  const [search, setSearch] =
    useState("");


  const [loading, setLoading] =
    useState(true);


  const [error, setError] =
    useState("");


  /* ========================================
     LOAD TEAMS
  ======================================== */

  useEffect(() => {

    async function loadTeams() {

      try {

        const data =
          await getTeams();


        setTeams(
          data.teams || []
        );

      } catch (err) {

        setError(
          err.message ||
          "Unable to load teams."
        );

      } finally {

        setLoading(false);

      }

    }


    loadTeams();

  }, []);


  /* ========================================
     SEARCH
  ======================================== */

  const filteredTeams =
    teams.filter((team) =>
      team
        .toLowerCase()
        .includes(
          search.toLowerCase()
        )
    );


  /* ========================================
     TEAM CLICK
  ======================================== */

  function handleTeamClick(team) {

    navigate(
      `/teams/${encodeURIComponent(team)}`
    );

  }


  /* ========================================
     KEYBOARD ACCESS
  ======================================== */

  function handleTeamKeyDown(
    event,
    team
  ) {

    if (
      event.key === "Enter" ||
      event.key === " "
    ) {

      event.preventDefault();

      handleTeamClick(team);

    }

  }


  return (

    <div className="teams-page">


      {/* ==================================
          HEADER
      ================================== */}

      <div className="page-header">

        <span className="section-label">

          TEAM EXPLORER

        </span>


        <h1>

          World Cup Teams

        </h1>


        <p>

          Explore the{" "}

          {teams.length || 48}

          {" "}

          national teams participating in
          the prediction engine.

        </p>

      </div>



      {/* ==================================
          SEARCH
      ================================== */}

      <div className="teams-toolbar">


        <div className="team-search">

          <span>

            🔍

          </span>


          <input

            type="text"

            placeholder="Search teams..."

            value={search}

            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }

          />

        </div>


        <div className="team-count">

          {filteredTeams.length}

          {" "}

          teams

        </div>

      </div>



      {/* ==================================
          ERROR
      ================================== */}

      {error && (

        <div className="error-message">

          {error}

        </div>

      )}



      {/* ==================================
          LOADING
      ================================== */}

      {loading && (

        <div className="teams-state">

          Loading teams...

        </div>

      )}



      {/* ==================================
          TEAM GRID
      ================================== */}

      {!loading &&
        !error && (

          <div className="teams-grid">

            {filteredTeams.map(
              (team, index) => (

                <div

                  key={team}

                  className="team-card"

                  onClick={() =>
                    handleTeamClick(
                      team
                    )
                  }

                  onKeyDown={(event) =>
                    handleTeamKeyDown(
                      event,
                      team
                    )
                  }

                  role="button"

                  tabIndex={0}

                >


                  {/* TEAM NUMBER */}

                  <div className="team-number">

                    {String(index + 1)
                      .padStart(2, "0")}

                  </div>



                  {/* TEAM INFORMATION */}

                  <div className="team-card-main">


                    <div className="team-avatar">

                      {getTeamInitials(
                        team
                      )}

                    </div>


                    <div>

                      <h3>

                        {team}

                      </h3>


                      <span>

                        FIFA World Cup 2026

                      </span>

                    </div>

                  </div>



                  {/* ARROW */}

                  <div className="team-arrow">

                    →

                  </div>


                </div>

              )
            )}

          </div>

        )}



      {/* ==================================
          NO RESULTS
      ================================== */}

      {!loading &&
        !error &&
        filteredTeams.length === 0 && (

          <div className="teams-state">

            No teams found for:

            <strong>

              {" "}

              "{search}"

            </strong>

          </div>

        )}

    </div>

  );

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


export default Teams;