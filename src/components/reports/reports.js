import React from "react";
import { Link } from "react-router-dom";

import RepetitionsChart from "./repetitions/repetitions";
import ClosenessChart from "./closeness/closeness";

import "./reports.css";

const Reports = () => {
  return (
    <div className="reports">
      <div
        className="goto-simulator btn"
        onClick={() => {
          window.location.href = "/";
        }}
      >
        Go to simulator
      </div>
      <div className="title">Reports</div>
      <RepetitionsChart />
      <ClosenessChart />
    </div>
  );
};

export default Reports;
