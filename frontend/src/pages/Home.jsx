import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="home-page">

      {/* ================= HERO ================= */}

      <section className="hero-section">

        <div className="hero-content">

          <div className="hero-badge">
            FIFA WORLD CUP 2026
          </div>

          <h1>
            Predict the game.
            <br />
            <span>Simulate the tournament.</span>
          </h1>

          <p className="hero-description">
            An XGBoost-powered football prediction engine
            combined with Monte Carlo tournament simulation
            to analyze the 2026 FIFA World Cup.
          </p>

          <div className="hero-actions">

            <Link
              to="/predictor"
              className="primary-button"
            >
              Predict a Match
              <span>→</span>
            </Link>

            <Link
              to="/tournament"
              className="secondary-button"
            >
              Explore Tournament
            </Link>

          </div>

        </div>


        <div className="hero-visual">

          <div className="hero-card">

            <div className="hero-card-label">
              MODEL OUTPUT
            </div>

            <div className="hero-match">

              <div className="hero-team">
                <div className="team-circle">
                  🇪🇸
                </div>

                <span>Spain</span>
              </div>

              <div className="hero-vs">
                VS
              </div>

              <div className="hero-team">
                <div className="team-circle">
                  🇫🇷
                </div>

                <span>France</span>
              </div>

            </div>

            <div className="hero-probabilities">

              <div>
                <span>Spain</span>
                <strong>55.5%</strong>
              </div>

              <div>
                <span>Draw</span>
                <strong>18.9%</strong>
              </div>

              <div>
                <span>France</span>
                <strong>25.6%</strong>
              </div>

            </div>

          </div>

        </div>

      </section>


      {/* ================= STATS ================= */}

      <section className="stats-grid">

        <div className="stat-card">
          <span>ML MODEL</span>
          <strong>XGBoost</strong>
          <p>Match outcome classification</p>
        </div>

        <div className="stat-card">
          <span>SIMULATIONS</span>
          <strong>10,000</strong>
          <p>Monte Carlo tournaments</p>
        </div>

        <div className="stat-card">
          <span>MODEL FEATURES</span>
          <strong>18</strong>
          <p>Engineered match features</p>
        </div>

        <div className="stat-card">
          <span>TOURNAMENT</span>
          <strong>2026</strong>
          <p>FIFA World Cup</p>
        </div>

      </section>


      {/* ================= FEATURES ================= */}

      <section className="features-section">

        <div className="section-heading">

          <div>
            <span className="section-label">
              EXPLORE THE ENGINE
            </span>

            <h2>
              Everything in one place.
            </h2>
          </div>

          <p>
            From individual match predictions to
            complete tournament simulations.
          </p>

        </div>


        <div className="feature-grid">

          <Link
            to="/predictor"
            className="feature-card"
          >

            <div className="feature-icon">
              ⚡
            </div>

            <h3>
              Match Predictor
            </h3>

            <p>
              Select two teams and generate
              win, draw and loss probabilities
              using the trained XGBoost model.
            </p>

            <span className="feature-link">
              Predict a match →
            </span>

          </Link>


          <Link
            to="/tournament"
            className="feature-card"
          >

            <div className="feature-icon">
              🏆
            </div>

            <h3>
              Tournament Simulator
            </h3>

            <p>
              Run an entire World Cup from
              the group stage through the final
              using the prediction engine.
            </p>

            <span className="feature-link">
              Open tournament →
            </span>

          </Link>


          <Link
            to="/analytics"
            className="feature-card"
          >

            <div className="feature-icon">
              📊
            </div>

            <h3>
              Monte Carlo Analytics
            </h3>

            <p>
              Explore probabilities for reaching
              every tournament stage across
              10,000 simulated tournaments.
            </p>

            <span className="feature-link">
              View analytics →
            </span>

          </Link>

        </div>

      </section>


      {/* ================= HOW IT WORKS ================= */}

      <section className="how-section">

        <div className="section-heading">

          <div>
            <span className="section-label">
              THE PIPELINE
            </span>

            <h2>
              From data to prediction.
            </h2>
          </div>

        </div>


        <div className="pipeline">

          <div className="pipeline-step">

            <div className="step-number">
              01
            </div>

            <h3>
              Team Data
            </h3>

            <p>
              Elo ratings, FIFA rankings,
              recent form and goal statistics.
            </p>

          </div>


          <div className="pipeline-line" />


          <div className="pipeline-step">

            <div className="step-number">
              02
            </div>

            <h3>
              Feature Engineering
            </h3>

            <p>
              18 engineered features describe
              the matchup between two teams.
            </p>

          </div>


          <div className="pipeline-line" />


          <div className="pipeline-step">

            <div className="step-number">
              03
            </div>

            <h3>
              XGBoost
            </h3>

            <p>
              The trained model generates
              win, draw and loss probabilities.
            </p>

          </div>


          <div className="pipeline-line" />


          <div className="pipeline-step">

            <div className="step-number">
              04
            </div>

            <h3>
              Simulation
            </h3>

            <p>
              Predictions are used to simulate
              complete tournament outcomes.
            </p>

          </div>

        </div>

      </section>


      {/* ================= CTA ================= */}

      <section className="home-cta">

        <div>

          <span className="section-label">
            READY?
          </span>

          <h2>
            See what the model predicts.
          </h2>

          <p>
            Choose any two teams and run a
            prediction through the trained model.
          </p>

        </div>

        <Link
          to="/predictor"
          className="primary-button"
        >
          Start Predicting
          <span>→</span>
        </Link>

      </section>

    </div>
  );
}

export default Home;