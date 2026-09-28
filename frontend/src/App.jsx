import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./components/layout/Layout";

import Home from "./pages/Home";
import Predictor from "./pages/Predictor";
import Tournament from "./pages/Tournament";
import Teams from "./pages/Teams";
import TeamDetails from "./pages/TeamDetails";
import Analytics from "./pages/Analytics";
import Methodology from "./pages/Methodology";


function App() {

  return (

    <BrowserRouter>

      <Routes>

        {/* ==================================
            MAIN APPLICATION LAYOUT
        ================================== */}

        <Route
          element={<Layout />}
        >

          {/* ==================================
              HOME
          ================================== */}

          <Route
            path="/"
            element={<Home />}
          />


          {/* ==================================
              MATCH PREDICTOR
          ================================== */}

          <Route
            path="/predictor"
            element={<Predictor />}
          />


          {/* ==================================
              TOURNAMENT
          ================================== */}

          <Route
            path="/tournament"
            element={<Tournament />}
          />


          {/* ==================================
              TEAM EXPLORER
          ================================== */}

          <Route
            path="/teams"
            element={<Teams />}
          />


          {/* ==================================
              TEAM DETAILS
          ================================== */}

          <Route
            path="/teams/:teamName"
            element={<TeamDetails />}
          />


          {/* ==================================
              ANALYTICS
          ================================== */}

          <Route
            path="/analytics"
            element={<Analytics />}
          />


          {/* ==================================
              METHODOLOGY
          ================================== */}

          <Route
            path="/methodology"
            element={<Methodology />}
          />

        </Route>

      </Routes>

    </BrowserRouter>

  );
}


export default App;