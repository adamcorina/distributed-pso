import React, { useState, useEffect } from "react";
import {
  FF_Sphere,
  FF_Rastrigin,
  FF_Schwefel,
  FF_2D
} from "../lib/evolution/optimisation-functions/functions";
import PSO from "../lib/evolution/algorithms/pso/pso";
import Particle from "../lib/evolution/algorithms/pso/particle";
import FunctionPlotter3D from "./plotters/plot3D";
import FunctionPlotter2D from "./plotters/plot2D";
import TopParticles from "./top-particles/topParticles";

const Gun = require("gun/gun");
require("gun/lib/not.js");
require("gun/sea");

import { eventBus } from "../event-bus/eventBus";

import "./app.css";

const TIME_BETWEEN_ITERATIONS = 120;

const App = () => {
  const [pso, setPSO] = useState(null);
  const [gun] = useState(Gun(location.origin + "/gun"));

  function initializePopulation() {
    const numParticles = 10;
    let particles = [];
    const fitnessFunction = new FF_2D();

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
      const plotter = pso.fitnessFunction.dimensions.length === 2 ? new FunctionPlotter3D() : new FunctionPlotter2D();
      const domElement = plotter.initialize(pso, TIME_BETWEEN_ITERATIONS);
      const container = document.getElementById("functionPlotterContainer");

      container.appendChild(domElement);

      setInterval(() => {
        plotter.render(pso);
      }, TIME_BETWEEN_ITERATIONS);

    }
  }, [pso]);

  if (!pso) {
    return null;
  }

  return (
    <div className="app-container">
      <div id="functionPlotterContainer"/>
      <TopParticles pso={pso} />
    </div>
  );
};

export default App;
