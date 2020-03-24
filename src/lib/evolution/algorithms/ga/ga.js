const selectionFunctionMappings = require("./selection/selection-functions");

import { random } from "../../../utils/utils";

export default class GA {
  constructor(fitnessFunction, population, options) {
    const numSelection = 2 * Math.round(population.individuals.length / 50);

    this.dimensions = fitnessFunction.dimensions;
    this.population = population;

    this.selection = new selectionFunctionMappings[
      options.selectionFunction || "Roulette"
    ](numSelection);

    this.updateGlobalBest();
  }

  updateGlobalBest() {
    this.bestPosition = [
      ...this.population.individuals[0].bestPosition,
      this.population.individuals[0].bestFitness
    ];

    for (let i = 1; i < this.population.individuals.length; i++) {
      if (
        this.population.individuals[i].bestFitness <
        this.bestPosition.slice(-1)[0]
      ) {
        this.bestPosition = [
          ...this.population.individuals[i].bestPosition,
          this.population.individuals[i].bestFitness
        ];
      }
    }
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
          const interval = this.dimensions[j].max - this.dimensions[j].min;
          child.position[j] += random(0, interval * 0.005);
        }
      }
    }
    this.population.computeFitness();
    this.updateGlobalBest();
  }
}
