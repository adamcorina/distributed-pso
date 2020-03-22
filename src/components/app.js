import React from "react";
import Runner from "../lib/evolution/runner"
import "./app.css";
import UIRunner from "./ui-runner";
const App = () => {
  const runners = [
    new Runner("PSO", "FF_Schwefel", { populationSize: 5 })
  ]
  return (
    <div className="app-container">
      {runners.map((runner, index) => <UIRunner runner={runner} key={index} updateInterval={90} />)}
    </div>
  );
};
export default App;