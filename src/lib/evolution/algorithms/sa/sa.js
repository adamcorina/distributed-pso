import Individual from "../individual";
import { random } from "../../../utils/utils";

export default class SA {
  constructor(fitnessFunction, options) {
    this.dimensions = fitnessFunction.dimensions;
    this.temperature = 1000;
  }

  setPopulation(population) {
    // population with one individual
    this.population = population;
    this.updateGlobalBest();
  }

  updateGlobalBest() {
    if (!this.population.individuals.length) {
      return;
    }
    this.bestPosition = [...this.population.individuals[0].bestPosition, this.population.individuals[0].bestFitness];
  }

  checkProbability(currentStepFitness, nextStepFitness, asc) {
    return Math.exp(
      (asc === true ? currentStepFitness - nextStepFitness : nextStepFitness - currentStepFitness) / this.temperature
    );
  }

  iterate() {
    const p = new Individual(this.population.ff, 0);

    for (let j = 0; j < this.dimensions.length; j++) {
      const interval = this.dimensions[j].max - this.dimensions[j].min;
      const rand = random(0, 1);
      if (rand < 0.5) {
        p.position[j] = this.population.individuals[0].position[j] + random(0, interval * 0.05);
      } else {
        p.position[j] = this.population.individuals[0].position[j] - random(0, interval * 0.05);
      }
      if (p.position[j] > this.dimensions[j].max) {
        p.position[j] = this.dimensions[j].max;
      }
      if (p.position[j] < this.dimensions[j].min) {
        p.position[j] = this.dimensions[j].min;
      }
    }
    p.computeFitness();

    if (p.fitness < this.population.individuals[0].fitness) {
      this.population.individuals[0].position = [...p.position];
    } else {
      const rand = random(0, 1);
      if (this.checkProbability(this.population.individuals[0].fitness, p.fitness, true) > rand) {
        this.population.individuals[0].position = [...p.position];
      }
    }

    this.population.computeFitness();
    this.updateGlobalBest();

    this.temperature *= 0.95;
  }
}
