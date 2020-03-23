import { random } from "../../../utils/utils";

export default class PSO {
  constructor(fitnessFunction, population) {
    this.dimensions = fitnessFunction.dimensions;
    this.population = population;
    this.updateGlobalBest();

    this.inertiaWeight = 0.75;
    this.cognitiveWeight = 0.1;
    this.socialWeight = 0.3;
  }

  iterate() {
    for (let i = 0; i < this.population.particles.length; i++) {
      this.movePosition(this.population.particles[i]);
    }
    this.population.computeFitness();
    this.updateGlobalBest();
  }

  initializeVelocity(particle) {
    particle.velocity = [];
    for (let i = 0; i < this.dimensions.length; i++) {
      let d =
        this.dimensions[i].max -
        this.dimensions[i].min;
      particle.velocity.push(random(-d, d));
    }
  }

  movePosition(particle) {
    if (!particle.velocity) {
      this.initializeVelocity(particle);
    }
    for (let i = 0; i < this.dimensions.length; i++) {
      let vMomentum = this.inertiaWeight * particle.velocity[i];

      let d1 = particle.bestPosition[i] - particle.position[i];
      let vCognitive = this.cognitiveWeight * random(0, 1) * d1;

      let d2 = this.bestPosition[i] - particle.position[i];
      let vSocial = this.socialWeight * random(0, 1) * d2;

      particle.velocity[i] = vMomentum + vCognitive + vSocial;
      particle.position[i] = particle.position[i] + particle.velocity[i];

      if (particle.position[i] > this.dimensions[i].max) {
        particle.position[i] = this.dimensions[i].max;
      }
      if (particle.position[i] < this.dimensions[i].min) {
        particle.position[i] = this.dimensions[i].min;
      }
    }
  }

  updateGlobalBest() {
    this.bestPosition = [
      ...this.population.particles[0].bestPosition,
      this.population.particles[0].bestFitness
    ];

    for (let i = 1; i < this.population.particles.length; i++) {
      if (this.population.particles[i].bestFitness < this.bestPosition.slice(-1)[0]) {
        this.bestPosition = [
          ...this.population.particles[i].bestPosition,
          this.population.particles[i].bestFitness
        ];
      }
    }
  }
}
