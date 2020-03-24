import Tournament from "./tournament";
import { random } from "../../../utils/utils";

export default class GA {
  constructor(fitnessFunction, population) {
    this.dimensions = fitnessFunction.dimensions;
    this.population = population;
    this.tournament = new Tournament(
      2 * Math.round(this.population.individuals.length / 20),
      Math.round(this.population.individuals.length / 10)
    );
  }

  iterate() {
    const selected = this.tournament.execute(this.population.individuals);
    for (let i = 0; i < selected.length; i += 2) {
      const parent1 = selected[i];
      const parent2 = selected[i + 1];

      //individual to replace
      let index = this.population.individuals.length - i / 2 - 1;
      let child = this.population.individuals[index];

      //crossover
      for (let j = 0; j < this.dimensions.length; j++) {
        const rand = random(0, 1);
        if (rand < 0.5) {
          child.position[j] = parent1.position[j];
          child.bestPosition[j] = parent1.position[j];
        } else {
          child.position[j] = parent2.position[j];
          child.bestPosition[j] = parent2.position[j];
        }
      }
      //mutation
      for (let j = 0; j < this.dimensions.length; j++) {
        const rand = random(0, 1);
        if (rand < 0.1) {
          child.position[j] += random(0, 5);
        }
      }
    }
    this.population.computeFitness();
  }
}
