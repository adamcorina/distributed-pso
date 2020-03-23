import Particle from "./particle";
import { random, indexOfLargest } from "../../utils/utils";

export default class Population {
  constructor(populationSize, fitnessFunction) {
    this.population = [];
    this.ff = fitnessFunction;
    for (let i = 0; i < populationSize; i++) {
      let p = new Particle(this.ff, i);
      for (let j = 0; j < this.ff.dimensions.length; j++) {
        const randomNumber = random(
          this.ff.dimensions[j].min,
          this.ff.dimensions[j].max
        );
        p.position.push(randomNumber);
        p.bestPosition.push(randomNumber);
      }
      this.population.push(p);
    }
  }

  replaceWorstParticle(bestToIntroduce) {
    const smallestIndex = indexOfLargest(this.population);
    this.population[smallestIndex].fitness = bestToIntroduce.pop();
    this.population[smallestIndex].position = bestToIntroduce;
    this.population[smallestIndex].bestFitness = this.population[
      smallestIndex
    ].fitness;
    this.population[smallestIndex].bestPosition = [
      ...this.population[smallestIndex].position
    ];
    this.population[smallestIndex].velocity = new Array(
      this.ff.dimensions.length
    ).fill(0);
    this.population[smallestIndex].isReplaced = true;
  }

  get particles() {
    return this.population;
  }

  computeFitness() {
    for (let i = 0; i < this.population.length; i++) {
      this.population[i].computeFitness();
    }
  }
}
