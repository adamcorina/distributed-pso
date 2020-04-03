import React from "react";
import RepetitionsChart from "./repetitions/repetitions";
import ClosenessChart from "./closeness/closeness";

import "./reports.css";

const Reports = () => {
  return (
    <div className="reports">
      <div className="title">Reports</div>
      <RepetitionsChart />
      <ClosenessChart />
    </div>
  );
};

export default Reports;
