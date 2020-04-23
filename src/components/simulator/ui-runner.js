import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import FunctionPlotter3D from "./plotters/plot3D";
import FunctionPlotter2D from "./plotters/plot2D";
import TopParticles from "./top-particles/topParticles";
import Controls from "./controls/controls";
import Status from "./status/status";

import "./ui-runner.css";

const PLAY_STATE = {
  RESUME: "Resume",
  PAUSE: "Pause"
};

let interval = null;

export function CanvasPlotter({ population, ff, iteration }) {
  return ff.dimensions.length === 2 ? (
    <FunctionPlotter3D population={population} ff={ff} iteration={iteration} />
  ) : (
    <FunctionPlotter2D population={population} ff={ff} iteration={iteration} />
  );
}

export default function UIRunner({ runner, initialUpdateInterval = 150 }) {
  const timestamp = Date.now();
  const [iterations, setIterations] = useState(0);
  const [plotters, setPlotters] = useState([
    { type: "canvas", key: "canvas" + timestamp },
    { type: "table", key: "table" + timestamp }
  ]);
  const [intervalRef, setIntervalRef] = useState(null);
  const [playState, setPlayState] = useState(PLAY_STATE.PAUSE);
  const [updateInterval, setUpdateInterval] = useState(initialUpdateInterval);

  const onClickPauseCallback = () => {
    if (playState === PLAY_STATE.PAUSE) {
      clearInterval(interval);
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

  const onChangeAlgorithmCallback = algorithmTag => {
    runner.changeSpecifications({ algorithmTag });
  };

  const onChangeFunctionCallback = functionTag => {
    runner.changeSpecifications({ functionTag });
  };

  const onChangeUpdateIntervalCallback = intervalValue => {
    setUpdateInterval(intervalValue);
    if (playState === PLAY_STATE.PAUSE) {
      run(intervalValue);
    }
  };

  const onChangePopulationSize = populationSize => {
    runner.changeSpecifications({ populationSize });
  };

  const onLocallyChangeAlgorithmCallback = algorithmTag => {
    runner.locallyChangeSpecifications({ algorithmTag });
  };

  const resetUI = () => {
    setIterations(0);
    setPlayState(PLAY_STATE.PAUSE);
    setUpdateInterval(initialUpdateInterval);
    const timestamp = Date.now();
    setPlotters([
      { type: "canvas", key: "canvas" + timestamp },
      { type: "table", key: "table" + timestamp }
    ]);

    run();
  };

  const run = time => {
    clearInterval(interval);
    clearInterval(intervalRef);

    interval = setInterval(() => {
      runner.tick();
      setIterations(iterations => iterations + 1);
    }, time || updateInterval);
    setIntervalRef(interval);
  };

  const destroyInstance = () => {};

  useEffect(() => {
    runner.registerSpecificationChangesCallback(resetUI);
    runner.startRunner();
    return () => {
      clearInterval(interval);
      clearInterval(intervalRef);
    }
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
              iteration={iterations}
            />
          );
        }
        if (plotter.type === "table") {
          return (
            <TopParticles
              key={plotter.key}
              population={runner.population}
              ff={runner.ff}
              iteration={iterations}
            />
          );
        }
      })}
      <Controls
        pause={onClickPauseCallback}
        start={onClickStartCallback}
        changeAlgorithm={onChangeAlgorithmCallback}
        changeFunction={onChangeFunctionCallback}
        changeUpdateInterval={onChangeUpdateIntervalCallback}
        changePopulationSize={onChangePopulationSize}
        locallyChangeAlgorithm={onLocallyChangeAlgorithmCallback}
        playState={playState}
        algorithmTag={runner.options.algorithmTag}
        functionTag={runner.options.functionTag}
        updateInterval={updateInterval}
        populationSize={runner.options.populationSize}
        localAlgorithmTag={runner.options.localAlgorithmTag}
      />
      <Status iterations={iterations} />
      <Link className="goto-reports" to="/reports" onClick={destroyInstance}>
        <div className="btn">See reports</div>
      </Link>
    </div>
  );
}
