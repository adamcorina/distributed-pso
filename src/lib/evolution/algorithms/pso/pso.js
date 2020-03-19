import { indexOfLargest } from "../../../utils/utils";
import { random } from "../../../utils/utils";

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

  addParticle(p) {
    this.particles.push(p);
  }

  replaceWorstParticle(bestToIntroduce) {
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
      this.particles[smallestIndex].domMeshReference.material.color.setHex(0xffe100);
  }

  iterate() {
    for (let i = 0; i < this.particles.length; i++) {
      this.movePosition(this.particles[i]);
      this.particles[i].computeFitness();
    }
    this.updateGlobalBest();
  }

  movePosition(particle) {
    for (let i = 0; i < this.fitnessFunction.dimensions.length; i++) {
      let vMomentum = this.inertiaWeight * particle.velocity[i];

      let d1 = particle.bestPosition[i] - particle.position[i];
      let vCognitive = this.cognitiveWeight * random(0, 1) * d1;

      let d2 = this.bestPosition[i] - particle.position[i];
      let vSocial = this.socialWeight * random(0, 1) * d2;

      particle.velocity[i] = vMomentum + vCognitive + vSocial;
      particle.position[i] = particle.position[i] + particle.velocity[i];

      if (particle.position[i] > particle.fitnessFunction.dimensions[i].max) {
        particle.position[i] = particle.fitnessFunction.dimensions[i].max;
      }
      if (particle.position[i] < particle.fitnessFunction.dimensions[i].min) {
        particle.position[i] = particle.fitnessFunction.dimensions[i].min;
      }
    }
  }

  updateGlobalBest() {
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
  }

  getSocialBest() {
    return this.bestPosition;
  }
}
