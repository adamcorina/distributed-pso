import React, { useEffect, useState } from "react";
import Runner from "../lib/evolution/runner";
import "./app.css";
import UIRunner from "./ui-runner";
const ALGORITHMS = require("../lib/utils/constants").ALGORITHMS;
const FUNCTIONS = require("../lib/utils/constants").FUNCTIONS;
const SELECTION_FUNCTIONS = require("../lib/utils/constants").SELECTION_FUNCTIONS;

const App = () => {
  const [runners, setRunners] = useState([]);

  useEffect(() => {
    setRunners([
      new Runner(ALGORITHMS.PSO, FUNCTIONS.FF_SCHWEFEL, {
        populationSize: 10,
        selectionFunction: SELECTION_FUNCTIONS.TOURNAMENT
      })
    ]);
  }, []);

  if (!runners.length) {
    return null;
  }

  return (
    <div className="app-container">
      {runners.map((runner, index) => (
        <UIRunner runner={runner} key={index} initialUpdateInterval={90} />
      ))}
    </div>
  );
};
export default App;
