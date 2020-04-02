import { numberRounding } from "../utils/utils";

export default class Collaboration {
  constructor() {
    if (!!Collaboration.instance) {
      return Collaboration.instance;
    }

    Collaboration.instance = this;

    this.collaborativeBest = null;

    return this;
  }

  resetGlobalBest() {
    this.collaborativeBest = [
      Number.MAX_VALUE,
      Number.MAX_VALUE,
      Number.MAX_VALUE
    ];
  }

  render(algorithm) {
    if (!this.collaborativeBest) {
      return;
    }
    const bestToIntroduceCoordinates = [...this.collaborativeBest];
    const bestToIntroduce = bestToIntroduceCoordinates.pop();

    if (algorithm.bestPosition.slice(-1)[0] > bestToIntroduce) {
      if (
        algorithm.population.ff.compute(...bestToIntroduceCoordinates) ===
        bestToIntroduce
      ) {
        algorithm.population.replaceWorstParticle([
          ...bestToIntroduceCoordinates,
          bestToIntroduce
        ]);
      } else {
        this.collaborativeBest = [...algorithm.bestPosition];
      }
    } else {
      if (
        numberRounding(bestToIntroduce, 5) >
        numberRounding(algorithm.bestPosition.slice(-1)[0], 5)
      ) {
        this.collaborativeBest = [...algorithm.bestPosition];
      }
    }
  }
}
