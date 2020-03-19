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

import Collaboration from "../lib/collaboration/collaboration"
import { eventBus } from "../event-bus/eventBus";


import "./app.css";

const TIME_BETWEEN_ITERATIONS = 120;

const App = () => {
  const [pso, setPSO] = useState(null);

  function initializePopulation() {
    const numParticles = 10;
    let particles = [];
    const fitnessFunction = new FF_Schwefel();

    for (let i = 0; i < numParticles; i++) {
      const uniqueId = particles.length;
      let p = new Particle(fitnessFunction, uniqueId);
      particles.push(p);
    }

    const pso = new PSO(fitnessFunction, particles);
    setPSO(pso);
  }

  useEffect(() => {
    initializePopulation();
  }, []);

  useEffect(() => {
    if (pso) {
      const collaboration = new Collaboration();
      collaboration.initialize(pso);

      const plotter = pso.fitnessFunction.dimensions.length === 2 ? new FunctionPlotter3D() : new FunctionPlotter2D();
      const domElement = plotter.initialize(pso, TIME_BETWEEN_ITERATIONS);
      const container = document.getElementById("functionPlotterContainer");

      container.appendChild(domElement);

      setInterval(() => {
        pso.iterate();
        eventBus.$emit("iteration");
        plotter.render(pso);
        collaboration.render(pso);
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
