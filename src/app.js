import React, { useState, useEffect } from "react";
import {
  FF_Sphere,
  FF_Rastrigin,
  FF_Schwefel,
  FF_2D
} from "./service/functions";
import PSO from "./service/pso";
import Particle from "./service/particle";
import FunctionPlotter3D from "./components/plot3D";
import FunctionPlotter2D from "./components/plot2D";
import TopParticles from "./components/topParticles";

const Gun = require("gun/gun");
require("gun/lib/not.js");
require("gun/sea");

import { eventBus } from "./event-bus/eventBus";

import "./app.css";

const NUMBER_OF_ITERATIONS = 500,
  TIME_BETWEEN_ITERATIONS = 90;

const App = () => {
  const [pso, setPSO] = useState(null);
  const [gun] = useState(Gun(location.origin + "/gun"));

  function initializePopulation() {
    const numParticles = 2;
    let particles = [];
    const fitnessFunction = new FF_Rastrigin();

    for (let i = 0; i < numParticles; i++) {
      const uniqueId = particles.length;
      let p = new Particle(fitnessFunction, uniqueId);
      particles.push(p);
    }

    const pso = new PSO(fitnessFunction, particles);
    gun.get("global-minimum").not(function(key) {
      gun.get(key).put({
        position: Object.assign({}, [...pso.bestPosition])
      });
    });

    setPSO(pso);
  }

  const globalMinimumChanged = () => {
    gun
      .get("global-minimum")
      .get("position")
      .once(position => {
        let { _, ...coordinates } = position;
        pso.updateColaborativeBest(Object.values(coordinates));
      });
  };

  useEffect(() => {
    initializePopulation();
  }, []);

  useEffect(() => {
    if (pso) {
      gun.get("global-minimum").on(function() {
        globalMinimumChanged();
      });
      eventBus.$on("new-best", () => {
        gun.get("global-minimum").put({
          position: Object.assign({}, [...pso.bestPosition])
        });
      });
    }
  }, [pso]);

  if (!pso) {
    return null;
  }

  return (
    <div className="app-container">
      {pso.fitnessFunction.dimensions.length == 2 ? (
        <FunctionPlotter3D
          pso={pso}
          numberOfIterations={NUMBER_OF_ITERATIONS}
          timeBetweenIterations={TIME_BETWEEN_ITERATIONS}
        />
      ) : (
        <FunctionPlotter2D
          pso={pso}
          numberOfIterations={NUMBER_OF_ITERATIONS}
          timeBetweenIterations={TIME_BETWEEN_ITERATIONS}
        />
      )}
      <TopParticles pso={pso} />
    </div>
  );
};

export default App;
