const algorithmMap = require("./algorithms/algorithms");
const functionMap = require("./optimisation-functions/functions");
import Collaboration from "../collaboration/collaboration";
import Population from "./algorithms/population";

export default class Runner {
  constructor(algorithmTag, ff, options) {
    this.options = {
      populationSize: 2,
      algorithmTag: algorithmTag
    };
    Object.assign(this.options, options);

    this.onSpecificationChangesCallbacks = [];

    this.ff = new functionMap[ff]();
    this.population = new Population(this.options.populationSize, this.ff);
    this.algorithm = new algorithmMap[algorithmTag](this.ff, this.options);
    this.algorithm.setPopulation(this.population);
    this.collaboration = new Collaboration(
      algorithmTag,
      this.onSpecificationChanges.bind(this)
    );
  }

  registerSpecificationChangesCallback(callback) {
    this.onSpecificationChangesCallbacks.push(callback);
  }

  changeSpecifications(options) {
      this.collaboration.changeAlgorithm(options.algorithmTag);
  }

  onSpecificationChanges(options) {
    this.options.algorithmTag = options.algorithmTag;
    this.algorithm = new algorithmMap[this.options.algorithmTag](
      this.ff,
      this.options
    );
    this.population = new Population(this.options.populationSize, this.ff);
    this.algorithm.setPopulation(this.population);
    this.collaboration.collaborativeBest = this.algorithm.bestPosition;

    this.onSpecificationChangesCallbacks.forEach(callback => {
      callback();
    });
  }

  resetRunner() {
    this.changeSpecifications(this.options);
  }

  startRunner() {
    this.collaboration.initialize();
  }

  tick() {
    this.algorithm.iterate();
    this.collaboration.render(this.algorithm);
  }
}
