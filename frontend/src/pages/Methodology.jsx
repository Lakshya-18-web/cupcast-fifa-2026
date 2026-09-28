function Methodology() {
  return (
    <div className="methodology-page">

      {/* =========================================
          HEADER
      ========================================= */}

      <div className="methodology-header">

        <span className="section-label">
          MODEL METHODOLOGY
        </span>

        <h1>
          How the Prediction Engine Works
        </h1>

        <p>
          An end-to-end machine learning pipeline built to
          predict FIFA World Cup 2026 matches and simulate
          the complete tournament.
        </p>

      </div>


      {/* =========================================
          OVERVIEW
      ========================================= */}

      <section className="methodology-card methodology-overview">

        <div className="methodology-card-header">

          <span className="section-label">
            OVERVIEW
          </span>

          <h2>
            From historical data to tournament probabilities
          </h2>

          <p>
            The system combines historical international football
            data, team strength metrics and recent performance to
            generate match probabilities. These predictions are
            then used repeatedly inside a Monte Carlo tournament
            simulation.
          </p>

        </div>


        <div className="pipeline">

          <PipelineStep
            number="01"
            title="Historical Data"
            text="International match results, rankings and team performance data."
          />

          <div className="pipeline-arrow">→</div>

          <PipelineStep
            number="02"
            title="Feature Engineering"
            text="Convert raw team information into predictive match features."
          />

          <div className="pipeline-arrow">→</div>

          <PipelineStep
            number="03"
            title="XGBoost"
            text="Predict the probability of home win, draw and away win."
          />

          <div className="pipeline-arrow">→</div>

          <PipelineStep
            number="04"
            title="Tournament Simulation"
            text="Use match probabilities to simulate the complete World Cup."
          />

          <div className="pipeline-arrow">→</div>

          <PipelineStep
            number="05"
            title="Monte Carlo"
            text="Repeat the tournament simulation 10,000 times."
          />

        </div>

      </section>


      {/* =========================================
          MODEL
      ========================================= */}

      <section className="methodology-card">

        <span className="section-label">
          PREDICTION MODEL
        </span>

        <h2>
          XGBoost Match Prediction
        </h2>

        <p className="methodology-description">
          The prediction engine uses an XGBoost classification
          model trained to estimate the outcome probabilities
          of an international football match.
        </p>


        <div className="info-grid">

          <InfoCard
            label="MODEL"
            value="XGBoost"
            description="Gradient boosting classification model"
          />

          <InfoCard
            label="FEATURES"
            value="18"
            description="Engineered features used for prediction"
          />

          <InfoCard
            label="OUTPUT"
            value="3 Classes"
            description="Home Win · Draw · Away Win"
          />

          <InfoCard
            label="APPLICATION"
            value="World Cup 2026"
            description="Match and tournament prediction"
          />

        </div>

      </section>


      {/* =========================================
          FEATURES
      ========================================= */}

      <section className="methodology-card">

        <span className="section-label">
          FEATURE ENGINEERING
        </span>

        <h2>
          What the model looks at
        </h2>

        <p className="methodology-description">
          Match predictions are based on engineered differences
          and team-level statistics rather than relying on a
          single ranking metric.
        </p>


        <div className="feature-list">

          <FeatureRow
            title="Elo Difference"
            description="Difference between the Elo ratings of the two teams."
          />

          <FeatureRow
            title="FIFA Ranking Difference"
            description="Relative FIFA ranking strength between the teams."
          />

          <FeatureRow
            title="Home Elo"
            description="Elo rating of the home team."
          />

          <FeatureRow
            title="Away Elo"
            description="Elo rating of the away team."
          />

          <FeatureRow
            title="Home FIFA Ranking"
            description="FIFA ranking of the home team."
          />

          <FeatureRow
            title="Away FIFA Ranking"
            description="FIFA ranking of the away team."
          />

          <FeatureRow
            title="Recent Form"
            description="Recent match performance used to represent current team form."
          />

          <FeatureRow
            title="Goal Difference"
            description="Recent scoring performance represented through goal difference."
          />

          <FeatureRow
            title="Tournament Type"
            description="Competition context and tournament importance."
          />

          <FeatureRow
            title="Host Advantage"
            description="Accounts for the additional home advantage applicable to host nations."
          />

        </div>

      </section>


      {/* =========================================
          PROBABILITY OUTPUT
      ========================================= */}

      <section className="methodology-card">

        <span className="section-label">
          MATCH PROBABILITIES
        </span>

        <h2>
          Three possible match outcomes
        </h2>

        <p className="methodology-description">
          For every matchup, the model produces a probability
          distribution across three possible outcomes.
        </p>


        <div className="outcome-grid">

          <OutcomeCard
            title="Home Win"
            symbol="H"
            description="Probability that the home team wins."
          />

          <OutcomeCard
            title="Draw"
            symbol="D"
            description="Probability that the match ends level."
          />

          <OutcomeCard
            title="Away Win"
            symbol="A"
            description="Probability that the away team wins."
          />

        </div>

      </section>


      {/* =========================================
          TOURNAMENT SIMULATION
      ========================================= */}

      <section className="methodology-card">

        <span className="section-label">
          TOURNAMENT ENGINE
        </span>

        <h2>
          From one match to an entire World Cup
        </h2>

        <p className="methodology-description">
          The match prediction engine is connected to a complete
          tournament simulation pipeline. Each simulated match
          determines which team advances to the next stage.
        </p>


        <div className="tournament-flow">

          <FlowItem
            number="01"
            title="Group Stage"
            text="All group-stage matches are simulated."
          />

          <FlowItem
            number="02"
            title="Qualification"
            text="Group winners, runners-up and the best third-placed teams advance."
          />

          <FlowItem
            number="03"
            title="Round of 32"
            text="The 32 qualified teams enter the knockout stage."
          />

          <FlowItem
            number="04"
            title="Knockout Rounds"
            text="Matches continue through the Round of 16, quarter-finals and semi-finals."
          />

          <FlowItem
            number="05"
            title="Final"
            text="The two semi-final winners meet to determine the champion."
          />

        </div>

      </section>


      {/* =========================================
          MONTE CARLO
      ========================================= */}

      <section className="methodology-card methodology-highlight">

        <div className="highlight-content">

          <span className="section-label">
            MONTE CARLO SIMULATION
          </span>

          <h2>
            10,000 simulated World Cups
          </h2>

          <p>
            A single tournament simulation produces one possible
            outcome. To estimate tournament probabilities, the
            complete tournament is simulated repeatedly.
          </p>

          <p>
            After 10,000 simulations, the number of times a team
            reaches each stage is converted into a probability.
          </p>

        </div>


        <div className="simulation-stats">

          <Stat
            value="10,000"
            label="Simulations"
          />

          <Stat
            value="48"
            label="Teams"
          />

          <Stat
            value="7"
            label="Knockout stages"
          />

        </div>

      </section>


      {/* =========================================
          PROGRESSION
      ========================================= */}

      <section className="methodology-card">

        <span className="section-label">
          PROBABILITY CALCULATION
        </span>

        <h2>
          Turning simulations into probabilities
        </h2>

        <p className="methodology-description">
          The probability for a particular tournament stage is
          calculated from how frequently a team reaches that stage
          across all simulations.
        </p>


        <div className="formula-card">

          <div className="formula-label">
            STAGE PROBABILITY
          </div>

          <div className="formula">
            Probability (%) =
            <span>
              Successful simulations
            </span>
            /
            <span>
              Total simulations
            </span>
            × 100
          </div>

        </div>


        <div className="progression-stages">

          <span>Group Winner</span>
          <span>R32</span>
          <span>R16</span>
          <span>QF</span>
          <span>SF</span>
          <span>Final</span>
          <span>Champion</span>

        </div>

      </section>


      {/* =========================================
          ARCHITECTURE
      ========================================= */}

      <section className="methodology-card">

        <span className="section-label">
          APPLICATION ARCHITECTURE
        </span>

        <h2>
          Full-stack prediction system
        </h2>

        <p className="methodology-description">
          The trained model and simulation results are exposed
          through a FastAPI backend and consumed by the React
          frontend.
        </p>


        <div className="architecture">

          <ArchitectureBlock
            title="Data Layer"
            items={[
              "Historical match data",
              "Elo ratings",
              "FIFA rankings",
              "World Cup fixtures",
            ]}
          />

          <div className="architecture-arrow">
            →
          </div>

          <ArchitectureBlock
            title="ML Engine"
            items={[
              "Feature engineering",
              "XGBoost",
              "Match probabilities",
              "Prediction service",
            ]}
          />

          <div className="architecture-arrow">
            →
          </div>

          <ArchitectureBlock
            title="Backend"
            items={[
              "FastAPI",
              "REST API",
              "Tournament simulation",
              "Probability services",
            ]}
          />

          <div className="architecture-arrow">
            →
          </div>

          <ArchitectureBlock
            title="Frontend"
            items={[
              "React",
              "Team Explorer",
              "Match Predictor",
              "Analytics Dashboard",
            ]}
          />

        </div>

      </section>


      {/* =========================================
          TECHNOLOGY STACK
      ========================================= */}

      <section className="methodology-card">

        <span className="section-label">
          TECHNOLOGY STACK
        </span>

        <h2>
          Built with
        </h2>


        <div className="technology-grid">

          <Tech
            name="Python"
            category="Machine Learning"
          />

          <Tech
            name="XGBoost"
            category="Prediction Model"
          />

          <Tech
            name="Pandas"
            category="Data Processing"
          />

          <Tech
            name="FastAPI"
            category="Backend API"
          />

          <Tech
            name="React"
            category="Frontend"
          />

          <Tech
            name="Vite"
            category="Frontend Tooling"
          />

          <Tech
            name="JavaScript"
            category="Application Logic"
          />

          <Tech
            name="Monte Carlo"
            category="Simulation"
          />

        </div>

      </section>


      {/* =========================================
          DISCLAIMER
      ========================================= */}

      <section className="methodology-note">

        <strong>
          Important
        </strong>

        <p>
          The probabilities shown by this application are
          model-generated estimates based on the available data,
          engineered features and simulation process. They are
          not guarantees of actual match or tournament outcomes.
        </p>

      </section>

    </div>
  );
}


/* ============================================
   PIPELINE STEP
============================================ */

function PipelineStep({
  number,
  title,
  text,
}) {
  return (
    <div className="pipeline-step">

      <div className="pipeline-number">
        {number}
      </div>

      <h3>
        {title}
      </h3>

      <p>
        {text}
      </p>

    </div>
  );
}


/* ============================================
   INFO CARD
============================================ */

function InfoCard({
  label,
  value,
  description,
}) {
  return (
    <div className="methodology-info-card">

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


/* ============================================
   FEATURE ROW
============================================ */

function FeatureRow({
  title,
  description,
}) {
  return (
    <div className="feature-row">

      <div className="feature-icon">
        ✓
      </div>

      <div>

        <h3>
          {title}
        </h3>

        <p>
          {description}
        </p>

      </div>

    </div>
  );
}


/* ============================================
   OUTCOME CARD
============================================ */

function OutcomeCard({
  title,
  symbol,
  description,
}) {
  return (
    <div className="outcome-card">

      <div className="outcome-symbol">
        {symbol}
      </div>

      <div>

        <h3>
          {title}
        </h3>

        <p>
          {description}
        </p>

      </div>

    </div>
  );
}


/* ============================================
   FLOW ITEM
============================================ */

function FlowItem({
  number,
  title,
  text,
}) {
  return (
    <div className="flow-item">

      <div className="flow-number">
        {number}
      </div>

      <div>

        <h3>
          {title}
        </h3>

        <p>
          {text}
        </p>

      </div>

    </div>
  );
}


/* ============================================
   STAT
============================================ */

function Stat({
  value,
  label,
}) {
  return (
    <div className="simulation-stat">

      <strong>
        {value}
      </strong>

      <span>
        {label}
      </span>

    </div>
  );
}


/* ============================================
   ARCHITECTURE BLOCK
============================================ */

function ArchitectureBlock({
  title,
  items,
}) {
  return (
    <div className="architecture-block">

      <h3>
        {title}
      </h3>

      <div className="architecture-items">

        {items.map((item) => (
          <span key={item}>
            {item}
          </span>
        ))}

      </div>

    </div>
  );
}


/* ============================================
   TECHNOLOGY
============================================ */

function Tech({
  name,
  category,
}) {
  return (
    <div className="technology-card">

      <strong>
        {name}
      </strong>

      <span>
        {category}
      </span>

    </div>
  );
}


export default Methodology;