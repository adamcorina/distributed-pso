import Individual from "./individual";
import { random, indexOfLargest } from "../../utils/utils";

export default class Population {
  constructor(populationSize, fitnessFunction) {
    this.individuals = [];
    this.ff = fitnessFunction;
    for (let i = 0; i < populationSize; i++) {
      let p = new Individual(this.ff, i);
      for (let j = 0; j < this.ff.dimensions.length; j++) {
        const randomNumber = random(
          this.ff.dimensions[j].min,
          this.ff.dimensions[j].max
        );
        p.position.push(randomNumber);
        p.bestPosition.push(randomNumber);
      }
      this.individuals.push(p);
    }
    this.computeFitness();
  }

  replaceWorstParticle(bestToIntroduce) {
    const smallestIndex = indexOfLargest(this.individuals);
    this.individuals[smallestIndex].fitness = bestToIntroduce.pop();
    this.individuals[smallestIndex].position = bestToIntroduce;
    this.individuals[smallestIndex].bestFitness = this.individuals[
      smallestIndex
    ].fitness;
    this.individuals[smallestIndex].bestPosition = [
      ...this.individuals[smallestIndex].position
    ];
    this.individuals[smallestIndex].velocity = new Array(
      this.ff.dimensions.length
    ).fill(0);
    this.individuals[smallestIndex].isReplaced = true;

    this.sortPopulation();
  }

  sortPopulation(){
    this.individuals.sort((i1, i2) => i1.fitness - i2.fitness)
  }

  computeFitness() {
    for (let i = 0; i < this.individuals.length; i++) {
      this.individuals[i].computeFitness();
    }
    this.sortPopulation()
  }
}
