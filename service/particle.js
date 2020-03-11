function random(min, max) {
  return min + (max - min) * Math.random();
}

export default class Particle {
  constructor(fitnessFunction, id) {
    this.id = id;
    this.position = [];
    this.fitness = Infinity;

    this.bestParticleId = 0;
    this.bestPosition = [];
    this.bestFitness = Infinity;
    this.fitnessFunction = fitnessFunction;

    for (let i = 0; i < this.fitnessFunction.dimensions.length; i++) {
      const randomNumber = random(
        this.fitnessFunction.dimensions[i].min,
        this.fitnessFunction.dimensions[i].max
      );
      this.position.push(randomNumber);
      this.bestPosition.push(this.position[i]);
    }

    this.computeFitness();

    this.velocity = [];
    for (let i = 0; i < this.fitnessFunction.dimensions.length; i++) {
      let d =
        this.fitnessFunction.dimensions[i].max -
        this.fitnessFunction.dimensions[i].min;
      this.velocity.push(random(-d, d));
    }
  }

  computeFitness() {
    this.fitness = this.fitnessFunction.compute(...this.position);
    if (this.fitness < this.bestFitness) {
      for (let i = 0; i < this.position.length; i++) {
        this.bestPosition[i] = this.position[i];
      }
      this.bestFitness = this.fitness;
    }
  }

  movePosition(
    socialBestPosition,
    inertiaWeight,
    cognitiveWeight,
    socialWeight
  ) {
    for (let i = 0; i < this.fitnessFunction.dimensions.length; i++) {
      let vMomentum = inertiaWeight * this.velocity[i];

      let d1 = this.bestPosition[i] - this.position[i];
      let vCognitive = cognitiveWeight * random(0, 1) * d1;

      let d2 = socialBestPosition[i] - this.position[i];
      let vSocial = socialWeight * random(0, 1) * d2;

      this.velocity[i] = vMomentum + vCognitive + vSocial;
      this.position[i] = this.position[i] + this.velocity[i];

      if (this.position[i] > this.fitnessFunction.dimensions[i].max) {
        this.position[i] = this.fitnessFunction.dimensions[i].max;
      }
      if (this.position[i] < this.fitnessFunction.dimensions[i].min) {
        this.position[i] = this.fitnessFunction.dimensions[i].min;
      }
    }
  }
}
