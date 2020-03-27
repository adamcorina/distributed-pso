import React from "react";

import "./controls.css";

const Controls = ({ pause, start, playState }) => {
  return (
    <div className="controls">
      <div className="btn" onClick={start}>
        Start
      </div>
      <div
        className="btn"
        onClick={() => {
          pause();
        }}
      >
        {playState}
      </div>
    </div>
  );
};

export default Controls;
