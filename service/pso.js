import Particle from "./particle";

export default class PSO {
  constructor(fitnessFunction, particles) {
    this.dimensions = fitnessFunction.dimensions;
    this.fitnessFunction = fitnessFunction;

    this.iterationNum = 0;

    this.inertiaWeight = 0.85;
    this.cognitiveWeight = 0.1;
    this.socialWeight = 0.1;

    this.particles = particles;
	this.updateGlobalBest();
  }

  addParticle() {
    let uniqueId = this.particles.length;
    let p = new Particle(this.fitnessFunction, uniqueId);
    this.particles.push(p);
  }

  iterate() {
    for (let i = 0; i < this.particles.length; i++) {
      this.particles[i].movePosition(this.bestPosition, this.inertiaWeight, this.cognitiveWeight, this.socialWeight);
	  this.particles[i].computeFitness();
	}
    this.updateGlobalBest();
	this.iterationNum++;
  }

  updateGlobalBest() {
    this.bestParticleId = 0;
    this.bestPosition = this.particles[0].bestPosition;
    this.bestFitness = this.particles[0].bestFitness;
    for (let i = 1; i < this.particles.length; i++) {
      if (this.particles[i].bestFitness < this.bestFitness) {
        this.bestParticleId = i;
        this.bestFitness = this.particles[i].bestFitness;
        this.bestPosition = this.particles[i].bestPosition;
      }
    }
  }

  getSocialBest() {
    return this.bestPosition;
  }
}
