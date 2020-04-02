import React from "react";
import RepetitionsChart from "./repetitions/repetitions";
import ClosenessChart from "./closeness/closeness";

import "./results.css";

const Results = () => {
  return (
    <div className="results">
      <RepetitionsChart />
      <ClosenessChart />
    </div>
  );
};

export default Results;
