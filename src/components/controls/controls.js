import React, { useState } from "react";

import "./controls.css";

export const PLAY_STATE = {
  RESUME: "Resume",
  PAUSE: "Pause"
};

const Controls = ({ pause, start }) => {
  const [playState, setPlayState] = useState(PLAY_STATE.PAUSE);
  return (
    <div className="controls">
      <div className="btn" onClick={start}>
        Start
      </div>
      <div
        className="btn"
        onClick={() => {
          pause(playState);
          playState === PLAY_STATE.PAUSE
            ? setPlayState(PLAY_STATE.RESUME)
            : setPlayState(PLAY_STATE.PAUSE);
        }}
      >
        {playState}
      </div>
    </div>
  );
};

export default Controls;
