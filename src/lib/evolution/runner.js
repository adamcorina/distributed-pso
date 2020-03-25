const algorithmMap = require("./algorithms/algorithms");
const functionMap = require("./optimisation-functions/functions");
import Collaboration from "../collaboration/collaboration";
import Population from "./algorithms/population";

export default class Runner {
  constructor(algorithm, ff, options) {
    this.options = {
      populationSize: 2,
      algorithmTag: algorithm
    };
    Object.assign(this.options, options);

    this.ff = new functionMap[ff]();
    this.algorithm = new algorithmMap[algorithm](this.ff, this.options);

    this.population = new Population(this.options.populationSize, this.ff);
    this.algorithm.setPopulation(this.population);
    this.collaboration = new Collaboration(
      algorithm,
      this.onSpecificationChanges.bind(this)
    );
    this.onChangeCallbacks = [];
    this.collaboration.initialize();
    this.collaboration.initializeAlgorithm(this.algorithm);
  }

  registerCallback(callback) {
    this.onChangeCallbacks.push(callback);
  }

  changeSpecifications(options) {
      this.collaboration.changeAlgorithm(options ? options.algorithmTag : this.options.algorithmTag);
  }

  onSpecificationChanges(options) {
    this.options.algorithmTag = options.algorithmTag;
    this.algorithm = new algorithmMap[this.options.algorithmTag](
      this.ff,
      this.options
    );
    this.startAlgorithm.call(this);
    this.onChangeCallbacks.forEach(callback => {
      callback();
    });
  }

  startAlgorithm() {
    this.population = new Population(this.options.populationSize, this.ff);
    this.algorithm.setPopulation(this.population);
    this.collaboration.initializeAlgorithm(this.algorithm);
  }

  tick() {
    this.algorithm.iterate();
    this.collaboration.render(this.algorithm);
  }
}
