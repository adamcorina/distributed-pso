const Gun = require("gun/gun");
require("gun/lib/not.js");
require("gun/sea");

import { numberRounding } from "../utils/utils";

export default class Collaboration {
  constructor(algorithmTag, functionTag, populationSize, onChangesCallback) {
    this.collaborativeBest = null;
    this.gun = Gun(location.origin + "/gun");
    this.algorithmTag = algorithmTag;
    this.functionTag = functionTag;
    this.populationSize = populationSize;
    this.onChangesCallback = onChangesCallback;
  }

  initialize() {
    this.gun
      .get("global-minimum")
      .get("position")
      .on(() => {
        this.gun
          .get("global-minimum")
          .get("position")
          .once(position => {
            let { _, ...coordinates } = position;
            this.collaborativeBest = Object.values(coordinates);
          });
      });

    this.gun.get("optimization").on(() => {
      this.gun
        .get("optimization")
        .get("algorithm")
        .once(algorithm => {
          this.algorithmTag = algorithm;
        });
      this.gun
        .get("optimization")
        .get("ff")
        .once(ff => {
          this.functionTag = ff;
        });
      this.gun
        .get("optimization")
        .get("populationSize")
        .once(populationSize => {
          this.populationSize = populationSize;
        });

      this.onChangesCallback({
        algorithmTag: this.algorithmTag,
        functionTag: this.functionTag,
        populationSize: this.populationSize
      });
    });
  }

  changeFunction(functionTag) {
    this.functionTag = functionTag;
    this.gun.get("optimization").put({ ff: functionTag });
    this.resetGlobalBest();
  }

  changeAlgorithm(algorithmTag) {
    this.algorithmTag = algorithmTag;
    this.gun.get("optimization").put({ algorithm: algorithmTag });
    this.resetGlobalBest();
  }

  changePopulationSize(populationSize) {
    this.populationSize = populationSize;
    this.gun.get("optimization").put({ populationSize: populationSize });
  }

  resetGlobalBest() {
    this.gun.get("global-minimum").put({
      position: Object.assign({}, [
        Number.MAX_VALUE,
        Number.MAX_VALUE,
        Number.MAX_VALUE
      ])
    });
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
        this.gun.get("global-minimum").put({
          position: Object.assign({}, [...algorithm.bestPosition])
        });
      }
    } else {
      if (
        numberRounding(bestToIntroduce, 5) >
        numberRounding(algorithm.bestPosition.slice(-1)[0], 5)
      ) {
        this.gun.get("global-minimum").put({
          position: Object.assign({}, [...algorithm.bestPosition])
        });
      }
    }
  }
}
