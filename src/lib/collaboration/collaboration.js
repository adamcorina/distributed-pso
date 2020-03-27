const Gun = require("gun/gun");
require("gun/lib/not.js");
require("gun/sea");

import { numberRounding } from "../utils/utils";

export default class Collaboration {
  constructor(algorithmTag, onChangesCallback) {
    this.collaborativeBest = null;
    this.gun = Gun(location.origin + "/gun");
    this.algorithmTag = algorithmTag;
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
          this.onChangesCallback({ algorithmTag: this.algorithmTag });
        });
    });
  }

  changeAlgorithm(algorithmTag) {
    this.algorithmTag = algorithmTag;
    this.gun.get("optimization").put({ algorithm: algorithmTag });
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
    const bestToIntroduce = [...this.collaborativeBest];
    if (algorithm.bestPosition.slice(-1)[0] > bestToIntroduce.slice(-1)[0]) {
      algorithm.population.replaceWorstParticle(bestToIntroduce);
    } else {
      if (
        numberRounding(bestToIntroduce.slice(-1)[0], 5) >
        numberRounding(algorithm.bestPosition.slice(-1)[0], 5)
      ) {
        this.gun.get("global-minimum").put({
          position: Object.assign({}, [...algorithm.bestPosition])
        });
      }
    }
  }
}
