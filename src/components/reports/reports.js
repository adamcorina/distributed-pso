import React from "react";
import { Link } from "react-router-dom";

import RepetitionsChart from "./repetitions/repetitions";
import ClosenessChart from "./closeness/closeness";

import "./reports.css";

const Reports = () => {
  return (
    <div className="reports">
      <Link className="goto-simulator" to="/">
        <div className="btn">Go to simulator</div>
      </Link>
      <div className="title">Reports</div>
      <RepetitionsChart />
      <ClosenessChart />
    </div>
  );
};

export default Reports;
