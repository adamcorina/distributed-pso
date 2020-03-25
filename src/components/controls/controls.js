import React from "react";

import "./controls.css";

const Controls = ({ stop, start }) => {
  return (
    <div className="controls">
      <div className="btn start" onClick={start}>
        Start
      </div>
      <div className="btn stop" onClick={stop}>
        Stop
      </div>
    </div>
  );
};

export default Controls;
