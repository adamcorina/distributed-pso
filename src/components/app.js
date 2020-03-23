import React from "react";
import Runner from "../lib/evolution/runner"
import "./app.css";
import UIRunner from "./ui-runner";

const ALGORITHMS = {
  PSO: "PSO"
}

const FUNCTIONS = {
  FF_SPHERE: "FF_Sphere",
  FF_RASTRIGIN: "FF_Rastrigin",
  FF_SCHWEFEL: "FF_Schwefel",
  FF_2D: "FF_2D"
}

const App = () => {
  const runners = [
    new Runner(ALGORITHMS.PSO, FUNCTIONS.FF_2D, { populationSize: 5 })
  ]
  return (
    <div className="app-container">
      {runners.map((runner, index) => <UIRunner runner={runner} key={index} updateInterval={90} />)}
    </div>
  );
};
export default App;