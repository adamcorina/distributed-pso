import { random } from "../../../utils/utils";

export default class Tournament {
  constructor(numSelected, numParticipants) {
    this.numSelected = numSelected;
    this.numParticipants = numParticipants;
  }

  execute(population) {
    const selection = [];

    for (let i = 0; i < this.numSelected; i++) {
      // tournament round
      let best = null;
      for (let j = 0; j < this.numParticipants; j++) {
        const index = random(0, population.length - 1, 0);
        const ind = population[index];
        if (best === null || ind.fitness < best.fitness) {
          best = ind;
        }
      }
      selection.push(best);
    }

    return selection;
  }
}
