import React from "react";
import Runner from "../lib/evolution/runner"
import "./app.css";
import UIRunner from "./ui-runner";
import {ALGORITHMS, FUNCTIONS, SELECTION_FUNCTIONS} from "../lib/utils/constants";

const App = () => {
  const runners = [
    new Runner(ALGORITHMS.GA, FUNCTIONS.FF_SCHWEFEL, { populationSize: 100, selectionFunction: SELECTION_FUNCTIONS.ROULETTE })
  ]
  return (
    <div className="app-container">
      {runners.map((runner, index) => <UIRunner runner={runner} key={index} updateInterval={90} />)}
    </div>
  );
};
export default App;