import React, { useState, useEffect } from "react";
import TopParticles from "./top-particles/topParticles";
import Runner from "../lib/evolution/runner"

import "./app.css";

const TIME_BETWEEN_ITERATIONS = 120;

const App = () => {
  const [runner, setRunner] = useState(null);

  useEffect(() => {
    const runner = new Runner("PSO", "FF_Schwefel", {});
    setRunner(runner);
  }, []);

  useEffect(() => {
    if (runner) {

      setInterval(() => {
        runner.tick();
      }, TIME_BETWEEN_ITERATIONS);

    }
  }, [runner]);

  if (!runner) {
    return null;
  }

  return (
    <div className="app-container">
      <div id="functionPlotterContainer"/>
      <TopParticles pso={runner.algorithm} />
    </div>
  );
};

export default App;
