const algorithmMap = require("./algorithms/algorithms");
const functionMap = require("./optimisation-functions/functions");
import Particle from "../evolution/algorithms/pso/particle";
import Collaboration from "../collaboration/collaboration";
import {random} from "../utils/utils"
export default class Runner {
  constructor(algorithm, ff, options) {
    this.options = {
      populationSize: 2
    };
    Object.assign(this.options, options);
    this.ff = new functionMap[ff]();
    this.algorithm = new algorithmMap[algorithm](this.ff);
    this.initializePopulation();
    this.collaboration = new Collaboration();
    this.collaboration.initialize(this.algorithm);
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
    this.collaboration.render(this.algorithm);
  }
  onTick() {}
}