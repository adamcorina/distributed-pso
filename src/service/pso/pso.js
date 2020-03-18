import { indexOfLargest } from "../../utils/utils";
import { eventBus } from "../../event-bus/eventBus";
import { numberRounding } from "../../utils/utils";

export default class PSO {
  constructor(fitnessFunction, particles) {
    this.dimensions = fitnessFunction.dimensions;
    this.fitnessFunction = fitnessFunction;

    this.inertiaWeight = 0.75;
    this.cognitiveWeight = 0.1;
    this.socialWeight = 0.3;

    this.particles = particles;
    this.updateGlobalBest();

    this.colaborativeBestPosition = this.bestPosition;
  }

  updateColaborativeBest(coordinates) {
    this.colaborativeBestPosition = [...coordinates];
  }

  addParticle(p) {
    this.particles.push(p);
  }

  introduceColaborativeBest() {
    const bestToIntroduce = [...this.colaborativeBestPosition];
    if (this.bestPosition.slice(-1)[0] > bestToIntroduce.slice(-1)[0]) {
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
      numberRounding(oldBest.slice(-1)[0], 5) >
        numberRounding(this.bestPosition.slice(-1)[0], 5)
    ) {
      eventBus.$emit("new-best");
    }
  }

  getSocialBest() {
    return this.bestPosition;
  }
}
