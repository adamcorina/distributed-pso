export default class Particle {
  constructor(fitnessFunction, id) {
    this.id = id;
    this.position = [];
    this.fitness = Infinity;

    this.bestPosition = [];
    this.bestFitness = Infinity;
    this.fitnessFunction = fitnessFunction;

    this.isReplaced = false;
    this.domMeshReference = null;
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
