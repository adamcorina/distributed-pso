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
  initialize(pso) {
    this.gun.get(`global-minimum-${this.algorithmTag}`).not(key => {
      this.gun.get(key).put({
        position: Object.assign({}, [...pso.bestPosition])
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

  render(pso) {
    const bestToIntroduce = [...this.collaborativeBest];
    if (pso.bestPosition.slice(-1)[0] > bestToIntroduce.slice(-1)[0]) {
      pso.population.replaceWorstParticle(bestToIntroduce);
    } else {
      if (
        numberRounding(bestToIntroduce.slice(-1)[0], 5) >
        numberRounding(pso.bestPosition.slice(-1)[0], 5)
      ) {
        this.gun.get(`global-minimum-${this.algorithmTag}`).put({
          position: Object.assign({}, [...pso.bestPosition])
        });
      }
    }
  }
}
