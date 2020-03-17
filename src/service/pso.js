import { indexOfLargest } from "../utils/utils";
import { eventBus } from "../event-bus/eventBus";

export default class PSO {
  constructor(fitnessFunction, particles) {
    this.dimensions = fitnessFunction.dimensions;
    this.fitnessFunction = fitnessFunction;

    this.iterationNum = 0;

    this.inertiaWeight = 0.75;
    this.cognitiveWeight = 0.1;
    this.socialWeight = 0.2;

    this.particles = particles;
    this.updateGlobalBest();

    this.colaborativeBestPosition = this.bestPosition;
  }

  updateColaborativeBest(coordinates) {
    console.log("updating colaborative best with particle: ", coordinates);
    this.colaborativeBestPosition = [...coordinates];
  }

  addParticle(p) {
    this.particles.push(p);
  }

  introduceColaborativeBest() {
    const bestToIntroduce = [...this.colaborativeBestPosition];
    if (this.bestPosition.slice(-1)[0] > bestToIntroduce.slice(-1)[0]) {
      console.log(
        "replaced particle with fitness: ",
        this.bestPosition.slice(-1)[0],
        " with: ",
        bestToIntroduce.slice(-1)[0]
      );
      const smallestIndex = indexOfLargest(this.particles);
      this.particles[smallestIndex].fitness = bestToIntroduce.pop();
      this.particles[smallestIndex].position = bestToIntroduce;
      this.particles[smallestIndex].bestFitness = this.particles[
        smallestIndex
      ].fitness;
      this.particles[smallestIndex].bestPosition = [
        ...this.particles[smallestIndex].position
      ];
      this.particles[smallestIndex].velocity = new Array(
        this.fitnessFunction.dimensions.length
      ).fill(0);

      return {
        index: smallestIndex,
        position: [
          ...this.particles[smallestIndex].bestPosition,
          this.particles[smallestIndex].bestFitness
        ]
      };
    }
    return null;
  }

  iterate() {
    for (let i = 0; i < this.particles.length; i++) {
      this.particles[i].movePosition(
        this.bestPosition,
        this.inertiaWeight,
        this.cognitiveWeight,
        this.socialWeight
      );
      this.particles[i].computeFitness();
    }
    this.updateGlobalBest();
    this.iterationNum++;
  }

  updateGlobalBest() {
    const oldBest = this.bestPosition;

    this.bestPosition = [
      ...this.particles[0].bestPosition,
      this.particles[0].bestFitness
    ];

    for (let i = 1; i < this.particles.length; i++) {
      if (this.particles[i].bestFitness < this.bestPosition.slice(-1)[0]) {
        this.bestPosition = [
          ...this.particles[i].bestPosition,
          this.particles[i].bestFitness
        ];
      }
    }

    if (
      oldBest &&
      oldBest.slice(-1)[0].toFixed(5) >
        this.bestPosition.slice(-1)[0].toFixed(5)
    ) {
      eventBus.$emit("new-best");
    }
  }

  getSocialBest() {
    return this.bestPosition;
  }
}
