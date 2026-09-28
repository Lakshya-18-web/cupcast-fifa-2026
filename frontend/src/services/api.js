const API_BASE_URL = "http://127.0.0.1:8000";


/* ==========================================
   GENERIC API REQUEST
========================================== */

async function request(endpoint, options = {}) {

  const response = await fetch(
    `${API_BASE_URL}${endpoint}`,
    {
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      ...options,
    }
  );


  if (!response.ok) {

    let errorMessage =
      "API request failed.";

    try {

      const errorData =
        await response.json();

      errorMessage =
        errorData.detail ||
        errorMessage;

    } catch {

      // Keep default error message

    }

    throw new Error(errorMessage);

  }


  return response.json();

}


/* ==========================================
   GET TEAMS
========================================== */

export async function getTeams() {

  return request("/teams");

}


/* ==========================================
   GET TEAM DETAILS
========================================== */

export async function getTeamDetails(teamName) {

  return request(
    `/teams/${encodeURIComponent(teamName)}`
  );

}


/* ==========================================
   PREDICT MATCH
========================================== */

export async function predictMatch({
  homeTeam,
  awayTeam,
  tournament = "FIFA World Cup",
  hostTeam = null,
}) {

  return request(
    "/predict",
    {
      method: "POST",

      body: JSON.stringify({

        home_team: homeTeam,

        away_team: awayTeam,

        tournament: tournament,

        host_team: hostTeam,

      }),
    }
  );

}


/* ==========================================
   RUN TOURNAMENT SIMULATION
========================================== */

export async function runSimulation() {

  const response = await request(
    "/simulation",
    {
      method: "POST",

      body: JSON.stringify({}),

    }
  );


  /*
    Backend response:

    {
      success: true,
      simulation: {
        groups: {...},
        qualified: {...},
        round32: [...],
        round16: [...],
        quarterfinals: [...],
        semifinals: [...],
        finalists: [...],
        third_place: {...},
        final: {...},
        champion: "...",
        runner_up: "...",
        third: "...",
        fourth: "..."
      }
    }

    Tournament.jsx expects the actual
    simulation object directly.

    Therefore return:

        response.simulation

    instead of the complete API response.
  */

  return response.simulation;

}


/* ==========================================
   GET PROBABILITY TABLE
========================================== */

export async function getProbabilities(stage) {

  return request(
    `/probabilities/${stage}`
  );

}


/* ==========================================
   GET ALL PROBABILITIES
========================================== */

export async function getAllProbabilities() {

  return request(
    "/probabilities"
  );

}


/* ==========================================
   GET TEAM PROGRESSION
========================================== */

export async function getTeamProgression() {

  return request(
    "/progression"
  );

}