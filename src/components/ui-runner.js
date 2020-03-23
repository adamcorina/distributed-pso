import React, { useEffect, useState } from "react";
import FunctionPlotter3D from "./plotters/plot3D";
import FunctionPlotter2D from "./plotters/plot2D";
import TopParticles from "./top-particles/topParticles"

import "./ui-runner.css";

export function CanvasPlotter({ algorithm, iteration }) {
  return algorithm.fitnessFunction.dimensions.length === 2 ? (
    <FunctionPlotter3D algorithm={algorithm} iteration={iteration} />
  ) : <FunctionPlotter2D algorithm={algorithm} iteration={iteration} />;
}

export default function UIRunner({ runner, updateInterval = 150 }) {
  const [seconds, setSeconds] = useState(0);
  const [plotters] = useState(["canvas", "table"]);
  useEffect(() => {
    const interval = setInterval(() => {
      runner.tick();
      setSeconds(seconds => seconds + 1);
    }, updateInterval);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="runner">
      {plotters.map((type, index) => {
        if (type === "canvas") {
          return (
            <CanvasPlotter
              key={index}
              algorithm={runner.algorithm}
              iteration={seconds}
            />
          );
        }
        if(type === "table") {
          return (
            <TopParticles
              key={index}
              algorithm={runner.algorithm}
              iteration={seconds}
            />
          );
        }
      })}
    </div>
  );
}
