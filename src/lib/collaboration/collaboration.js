const Gun = require("gun/gun");
require("gun/lib/not.js");
require("gun/sea");

import {numberRounding} from "../utils/utils"

export default class Collaboration {
  constructor() {
    this.collaborativeBest = null;
    this.gun = Gun(location.origin + "/gun");
  }
  initialize(pso) {
    this.gun.get("global-minimum").not(key => {
      this.gun.get(key).put({
        position: Object.assign({}, [...pso.bestPosition])
      });
    });
    this.gun
      .get("global-minimum")
      .get("position")
      .once(position => {
        let { _, ...coordinates } = position;
        this.collaborativeBest = Object.values(coordinates);
      });

    this.gun.get("global-minimum").on(() => {
      this.gun
        .get("global-minimum")
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
      pso.replaceWorstParticle(bestToIntroduce);
    } else {
      if (
        numberRounding(bestToIntroduce.slice(-1)[0], 5) >
        numberRounding(pso.bestPosition.slice(-1)[0], 5)
      ) {
        this.gun.get("global-minimum").put({
          position: Object.assign({}, [...pso.bestPosition])
        });
      }
    }
  }
}
