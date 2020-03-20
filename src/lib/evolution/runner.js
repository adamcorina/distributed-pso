const algorithmMap = require("./algorithms/algorithms");
const functionMap = require("./optimisation-functions/functions");

import Particle from "../evolution/algorithms/pso/particle";
import FunctionPlotter3D from "../../components/plotters/plot3D";
import FunctionPlotter2D from "../../components/plotters/plot2D";

import Collaboration from "../collaboration/collaboration";

import { eventBus } from "../../event-bus/eventBus";

import {random} from "../utils/utils"

export default class Runner {
  constructor(algorithm, ff, options) {
    this.options = {
      populationSize: 2
    };

    this.ff = new functionMap[ff]();
    this.algorithm = new algorithmMap[algorithm](this.ff);
    this.initializePopulation();
    Object.assign(this.options, options);

    // this.collaboration = new Collaboration();
    // this.collaboration.initialize(this.algorithm);

    // this.plotter =
    //   this.ff.dimensions.length === 2
    //     ? new FunctionPlotter3D()
    //     : new FunctionPlotter2D();
    // const domElement = this.plotter.initialize(this.algorithm);
    // const container = document.getElementById("functionPlotterContainer");

    // container.appendChild(domElement);
  }

  initializePopulation() {
    let particles = [];

    for (let i = 0; i < this.options.populationSize; i++) {
      const uniqueId = particles.length;
      let p = new Particle(this.ff, uniqueId);
      for (let i = 0; i < this.ff.dimensions.length; i++) {
        const randomNumber = random(
          this.ff.dimensions[i].min,
          this.ff.dimensions[i].max
        );
        p.position.push(randomNumber);
        p.bestPosition.push(p.position[i]);
      }
      particles.push(p);
      p.computeFitness();
    }

    this.algorithm.setParticles(particles);
  }
  tick() {
    this.algorithm.iterate();
    // eventBus.$emit("iteration");
    // this.plotter.render(pso);
    // this.collaboration.render(pso);
  }

  onTick() {}
}
