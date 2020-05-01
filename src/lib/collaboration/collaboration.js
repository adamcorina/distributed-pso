import { numberRounding, random } from "../utils/utils";
import { POPULATION_BASED_ALGORITHMS } from "../utils/constants";

export default class Collaboration {
  constructor(algorithmTag) {
    if (!!Collaboration.instance) {
      return Collaboration.instance;
    }

    Collaboration.instance = this;
    
    this.algorithmTag = algorithmTag;
    this.collaborativeBest = null;

    return this;
  }

  resetGlobalBest() {
    this.collaborativeBest = [Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE];
  }

  render(algorithm) {
    if (!this.collaborativeBest) {
      return;
    }
    const bestToIntroduceCoordinates = [...this.collaborativeBest];
    const bestToIntroduce = bestToIntroduceCoordinates.pop();

    if (algorithm.bestPosition.slice(-1)[0] > bestToIntroduce) {
      if (algorithm.population.ff.compute(...bestToIntroduceCoordinates) === bestToIntroduce) {
        const rand = random(0, 1);
        if (
          POPULATION_BASED_ALGORITHMS.includes(this.algorithmTag) ||
          (!POPULATION_BASED_ALGORITHMS.includes(this.algorithmTag) &&
            1 - algorithm.checkProbability(algorithm.bestPosition.slice(-1)[0], bestToIntroduce, false) > rand)
        ) {
          algorithm.population.replaceWorstParticle([...bestToIntroduceCoordinates, bestToIntroduce]);
        }
      } else {
        this.collaborativeBest = [...algorithm.bestPosition];
      }
    } else {
      if (numberRounding(bestToIntroduce, 5) > numberRounding(algorithm.bestPosition.slice(-1)[0], 5)) {
        this.collaborativeBest = [...algorithm.bestPosition];
      }
    }
  }
}
