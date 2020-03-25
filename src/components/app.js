import React, { useEffect, useState } from "react";
import Runner from "../lib/evolution/runner";
import "./app.css";
import UIRunner from "./ui-runner";
import {
  ALGORITHMS,
  FUNCTIONS,
  SELECTION_FUNCTIONS
} from "../lib/utils/constants";

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
        <UIRunner runner={runner} key={index} updateInterval={90} />
      ))}
    </div>
  );
};
export default App;
