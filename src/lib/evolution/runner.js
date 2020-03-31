const algorithmMap = require("./algorithms/algorithms");
const functionMap = require("./optimisation-functions/functions");
import Collaboration from "../collaboration/collaboration";
import Population from "./algorithms/population";

export default class Runner {
  constructor(algorithmTag, functionTag, options) {
    this.options = {
      populationSize: 2,
      algorithmTag: algorithmTag,
      localAlgorithmTag: algorithmTag,
      functionTag: functionTag,
      isCollaborative: true
    };
    Object.assign(this.options, options);

    this.onSpecificationChangesCallbacks = [];

    this.ff = new functionMap[functionTag]();
    this.population = new Population(this.options.populationSize, this.ff);
    this.algorithm = new algorithmMap[algorithmTag](this.ff, this.options);
    this.algorithm.setPopulation(this.population);

    if (this.options.isCollaborative) {
      this.collaboration = new Collaboration(
        algorithmTag,
        functionTag,
        this.options.populationSize,
        this.onSpecificationChanges.bind(this)
      );
    }
  }

  registerSpecificationChangesCallback(callback) {
    this.onSpecificationChangesCallbacks.push(callback);
  }

  changeSpecifications(options) {
    if (this.options.isCollaborative) {
      if (options.algorithmTag) {
        this.collaboration.changeAlgorithm(options.algorithmTag);
      }
      if (options.functionTag) {
        this.collaboration.changeFunction(options.functionTag);
      }
      if (options.populationSize) {
        this.collaboration.changePopulationSize(options.populationSize);
      }
    }
  }

  locallyChangeSpecifications(options) {
    if (options.algorithmTag) {
      this.options.localAlgorithmTag = options.algorithmTag;
      this.population = new Population(this.options.populationSize, this.ff);
      this.algorithm = new algorithmMap[this.options.localAlgorithmTag](
        this.ff,
        this.options
      );
      this.algorithm.setPopulation(this.population);
    }

    this.onSpecificationChangesCallbacks.forEach(callback => {
      callback();
    });
  }

  onSpecificationChanges(options) {
    this.options.algorithmTag = options.algorithmTag;
    this.options.localAlgorithmTag = options.algorithmTag;
    this.options.functionTag = options.functionTag;
    this.options.populationSize = options.populationSize;
    this.ff = new functionMap[this.options.functionTag]();
    this.population = new Population(this.options.populationSize, this.ff);
    this.algorithm = new algorithmMap[this.options.algorithmTag](
      this.ff,
      this.options
    );
    this.algorithm.setPopulation(this.population);

    this.onSpecificationChangesCallbacks.forEach(callback => {
      callback();
    });
  }

  resetRunner() {
    this.changeSpecifications(this.options);
  }

  startRunner() {
    if (this.options.isCollaborative) {
      this.collaboration.initialize();
    }
  }

  tick() {
    this.algorithm.iterate();
    if (this.options.isCollaborative) {
      this.collaboration.render(this.algorithm);
    }
  }
}
