import { random } from "../../../../utils/utils";

export default class Tournament {
  constructor(numSelected) {
    this.numSelected = numSelected;
  }

  execute(population) {
    const selection = [];
    const numParticipants = Math.round(population.individuals.length / 2);

    for (let i = 0; i < this.numSelected; i++) {
      // tournament round
      let best = null;
      for (let j = 0; j < numParticipants; j++) {
        const index = random(0, population.individuals.length - 1, 0);
        const ind = population.individuals[index];
        if (best === null || ind.fitness < best.fitness) {
          best = ind;
        }
      }
      selection.push(best);
    }

    return selection;
  }
}
