const algorithmMap = require("./algorithms/algorithms");
const functionMap = require("./optimisation-functions/functions");
import Collaboration from "../collaboration/collaboration";
import Population from "./algorithms/population";

export default class Runner {
  constructor(algorithm, ff, options) {
    this.options = {
      populationSize: 2
    };
    Object.assign(this.options, options);
    this.ff = new functionMap[ff]();
    this.population = new Population(this.options.populationSize, this.ff);
    this.algorithm = new algorithmMap[algorithm](
      this.ff,
      this.population,
      this.options
    );
    this.collaboration = new Collaboration(algorithm);
    this.collaboration.initialize(this.algorithm);
  }

  initializePopulation() {
    this.population = new Population(this.options.populationSize, this.ff);
    this.algorithm.setPopulation(this.population);
  }

  tick() {
    this.algorithm.iterate();
    this.collaboration.render(this.algorithm);
  }
  onTick() {}
}
