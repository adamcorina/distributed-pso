import React, { useState, useEffect } from "react";
import {
  FF_Sphere,
  FF_Rastrigin,
  FF_Schwefel,
  FF_Umbrella,
  FF_Weierstrass
} from "../service/functions";
import PSO from "../service/pso";
import Particle from "../service/particle";
import FunctionPlotter3D from "./components/plot3D";
import FunctionPlotter2D from "./components/plot2D";

const App = () => {
  const [pso, setPSO] = useState(null);

  function initializePopulation() {
    const numParticles = 100;
    let particles = [];
    const fitnessFunction = new FF_Weierstrass(100);

    for (let i = 0; i < numParticles; i++) {
      const uniqueId = particles.length;
      let p = new Particle(fitnessFunction, uniqueId);
      particles.push(p);
    }

    setPSO(new PSO(fitnessFunction, particles));
  }

  useEffect(() => {
    initializePopulation();
  }, []);

  if (!pso) {
    return null;
  }

  return pso.fitnessFunction.dimensions.length == 2 ? (
    <FunctionPlotter3D pso={pso} />
  ) : (
    <FunctionPlotter2D pso={pso} />
  );
};

export default App;
