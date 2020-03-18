import {random} from "../../utils/utils"

export default class Particle {
  constructor(fitnessFunction, id) {
    this.id = id;
    this.position = [];
    this.fitness = Infinity;

    this.bestPosition = [];
    this.bestFitness = Infinity;
    this.fitnessFunction = fitnessFunction;

    this.domMeshReference = null;

    for (let i = 0; i < this.fitnessFunction.dimensions.length; i++) {
      const randomNumber = random(
        this.fitnessFunction.dimensions[i].min,
        this.fitnessFunction.dimensions[i].max
      );
      this.position.push(randomNumber);
      this.bestPosition.push(this.position[i]);
    }

    this.computeFitness();

    this.velocity = [];
    for (let i = 0; i < this.fitnessFunction.dimensions.length; i++) {
      let d =
        this.fitnessFunction.dimensions[i].max -
        this.fitnessFunction.dimensions[i].min;
      this.velocity.push(random(-d, d));
    }
  }

  computeFitness() {
    this.fitness = this.fitnessFunction.compute(...this.position);
    if (this.fitness < this.bestFitness) {
      for (let i = 0; i < this.position.length; i++) {
        this.bestPosition[i] = this.position[i];
      }
      this.bestFitness = this.fitness;
    }
  }
}
