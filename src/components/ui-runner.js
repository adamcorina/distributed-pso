import React, { useEffect, useState } from "react";
import FunctionPlotter3D from "./plotters/plot3D";
import FunctionPlotter2D from "./plotters/plot2D";
import TopParticles from "./top-particles/topParticles";
import Controls from "./controls/controls";

import "./ui-runner.css";

const PLAY_STATE = {
  RESUME: "Resume",
  PAUSE: "Pause"
};

export function CanvasPlotter({ population, ff, iteration }) {
  return ff.dimensions.length === 2 ? (
    <FunctionPlotter3D population={population} ff={ff} iteration={iteration} />
  ) : (
    <FunctionPlotter2D population={population} ff={ff} iteration={iteration} />
  );
}

export default function UIRunner({ runner, updateInterval = 150 }) {
  const timestamp = Date.now();
  let interval = null;
  const [seconds, setSeconds] = useState(0);
  const [plotters, setPlotters] = useState([
    { type: "canvas", key: "canvas" + timestamp },
    { type: "table", key: "canvas" + timestamp }
  ]);
  const [intervalRef, setIntervalRef] = useState(null);
  const [playState, setPlayState] = useState(PLAY_STATE.PAUSE);

  const onClickPauseCallback = () => {
    if (playState === PLAY_STATE.PAUSE) {
      clearInterval(intervalRef);
      setPlayState(PLAY_STATE.RESUME);
    } else {
      run();
      setPlayState(PLAY_STATE.PAUSE);
    }
  };

  const onClickStartCallback = () => {
    runner.resetRunner();
  };

  const resetUI = () => {
    setPlayState(PLAY_STATE.PAUSE);
    const timestamp = Date.now();
    setPlotters([
      { type: "canvas", key: "canvas" + timestamp },
      { type: "table", key: "canvas" + timestamp }
    ]);

    run();
  };

  const run = () => {
    clearInterval(interval);

    interval = setInterval(() => {
      runner.tick();
      setSeconds(seconds => seconds + 1);
    }, updateInterval);
    setIntervalRef(interval);
  };

  useEffect(() => {
    runner.registerSpecificationChangesCallback(resetUI);
    runner.startRunner();
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="runner">
      {plotters.map(plotter => {
        if (plotter.type === "canvas") {
          return (
            <CanvasPlotter
              key={plotter.key}
              population={runner.population}
              ff={runner.ff}
              iteration={seconds}
            />
          );
        }
        if (plotter.type === "table") {
          return (
            <TopParticles
              key={plotter.key}
              population={runner.population}
              ff={runner.ff}
              iteration={seconds}
            />
          );
        }
      })}
      <Controls pause={onClickPauseCallback} start={onClickStartCallback} playState={playState} />
    </div>
  );
}
