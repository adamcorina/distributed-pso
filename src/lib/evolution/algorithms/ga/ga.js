import Roulette from "./roulette";
import Tournament from "./tournament";
import { random } from "../../../utils/utils";

export default class GA {
  constructor(fitnessFunction, population) {
    this.dimensions = fitnessFunction.dimensions;
    this.population = population;
    // this.selection = new Tournament(
    //   2 * Math.round(this.population.individuals.length / 50),
    //   2 * Math.round(this.population.individuals.length / 20)
    // );
    this.selection = new Roulette(2 * Math.round(this.population.individuals.length / 50));
  }

  iterate() {
    const selected = this.selection.execute(this.population);
    for (let i = 0; i < selected.length; i += 2) {
      const parent1 = selected[i];
      const parent2 = selected[i + 1];

      //individual to replace
      let index = this.population.individuals.length - i / 2 - 1;
      let child = this.population.individuals[index];

      //crossover
      for (let j = 0; j < this.dimensions.length; j++) {
        let rand = random(0, 1);
        if (rand < 0.5) {
          child.position[j] = parent1.position[j];
          child.bestPosition[j] = parent1.position[j];
        } else {
          child.position[j] = parent2.position[j];
          child.bestPosition[j] = parent2.position[j];
        }
        rand = random(0, 1);
        if (rand < 0.2) {
          child.position[j] = (parent1.position[j] + parent2.position[j]) / 2;
          child.bestPosition[j] =
            (parent1.position[j] + parent2.position[j]) / 2;
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
