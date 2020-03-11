import React, { useState, useEffect } from "react";
import { FF_Sphere } from "../service/functions";
import PSO from "../service/pso";
import Particle from "../service/particle";
import FunctionPlotter from "./components/plot";

const App = () => {
  const [pso, setPSO] = useState(null);

  function initializePopulation() {
    const numParticles = 100;
    let particles = [];
    const fitnessFunction = new FF_Sphere();

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

  return (
    <FunctionPlotter
      pso={pso}
    />
  );
};

export default App;
