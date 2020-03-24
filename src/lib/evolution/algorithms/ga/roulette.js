import { random } from "../../../utils/utils";

export default class Roulette {
  constructor(numSelected) {
    this.numSelected = numSelected;
  }

  ranking(population) {
    let sum = 0;
    const weights = [];
    for (let i = 0; i < population.individuals.length; i++) {
      const invertedFitness = 1 / population.individuals[i].fitness;
      weights.push(invertedFitness);
      sum += invertedFitness;
    }
    return weights.map(weight => weight / sum);
  }

  execute(population) {
    const selection = [];
    let individual;

    const weights = this.ranking(population);

    for (let i = 0; i < this.numSelected; i++) {
      let rand = random();
      let index = 0;
      while (rand > 0 && index < population.individuals.length) {
        individual = population.individuals[index];
        rand -= weights[index];

        index++;
      }

      selection.push(individual);
    }

    return selection;
  }
}
