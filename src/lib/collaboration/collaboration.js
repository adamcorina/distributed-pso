const Gun = require("gun/gun");
require("gun/lib/not.js");
require("gun/sea");

import {numberRounding} from "../utils/utils"

export default class Collaboration {
  constructor(algorithmTag) {
    this.collaborativeBest = null;
    this.gun = Gun(location.origin + "/gun");
    this.algorithmTag = algorithmTag
  }
  initialize(algorithm) {
    this.gun.get(`global-minimum-${this.algorithmTag}`).not(key => {
      this.gun.get(key).put({
        position: Object.assign({}, [...algorithm.bestPosition])
      });
    });
    this.gun
      .get(`global-minimum-${this.algorithmTag}`)
      .get("position")
      .once(position => {
        let { _, ...coordinates } = position;
        this.collaborativeBest = Object.values(coordinates);
      });

    this.gun.get(`global-minimum-${this.algorithmTag}`).on(() => {
      this.gun
        .get(`global-minimum-${this.algorithmTag}`)
        .get("position")
        .once(position => {
          let { _, ...coordinates } = position;
          this.collaborativeBest = Object.values(coordinates);
        });
    });
  }

  render(algorithm) {
    const bestToIntroduce = [...this.collaborativeBest];
    if (algorithm.bestPosition.slice(-1)[0] > bestToIntroduce.slice(-1)[0]) {
      algorithm.population.replaceWorstParticle(bestToIntroduce);
    } else {
      if (
        numberRounding(bestToIntroduce.slice(-1)[0], 5) >
        numberRounding(algorithm.bestPosition.slice(-1)[0], 5)
      ) {
        this.gun.get(`global-minimum-${this.algorithmTag}`).put({
          position: Object.assign({}, [...algorithm.bestPosition])
        });
      }
    }
  }
}
