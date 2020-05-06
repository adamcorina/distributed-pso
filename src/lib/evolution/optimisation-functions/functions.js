class FF_Sphere {
  constructor() {
    this.dimensions = [
      { min: -5, max: 5 },
      { min: -5, max: 5 },
    ];
    this.actualMinimum = [0, 0, 0];
  }

  compute(x = 0, y = 0) {
    const f = x * x + y * y;
    return f / 10;
  }
}

class FF_Rastrigin {
  constructor() {
    this.dimensions = [
      { min: -5, max: 5 },
      { min: -5, max: 5 },
    ];
    this.actualMinimum = [0, 0, 0];
  }

  compute(x = 0, y = 0) {
    const f = 20 + x * x + y * y - 10 * (Math.cos(2 * Math.PI * x) + Math.cos(2 * Math.PI * y));
    return f / 20;
  }
}

class FF_Schwefel {
  constructor() {
    this.dimensions = [
      { min: -500, max: 500 },
      { min: -500, max: 500 },
    ];
    this.actualMinimum = [420.968746, 420.968746, 83.796585];
  }

  compute(x = 0, y = 0) {
    const f = 418.9829 * 3 - (x * Math.sin(Math.sqrt(Math.abs(x))) + y * Math.sin(Math.sqrt(Math.abs(y))));
    return f / 5;
  }
}

class FF_Ackley {
  constructor() {
    this.dimensions = [
      { min: -5, max: 5 },
      { min: -5, max: 5 },
    ];
    this.actualMinimum = [0, 0, 0];
  }

  compute(x = 0, y = 0) {
    const f =
      -20 * Math.exp(-0.2 * Math.sqrt(0.5 * (x * x + y * y))) -
      Math.exp(0.5 * (Math.cos(2 * Math.PI * x) + Math.cos(2 * Math.PI * y))) +
      Math.E +
      20;
    return f / 2.5;
  }
}

class FF_Eggholder {
  constructor() {
    this.dimensions = [
      { min: -512, max: 512 },
      { min: -512, max: 512 },
    ];
    this.actualMinimum = [512, 404.231805, -191.92813];
  }

  compute(x = 0, y = 0) {
    const f =
      -(y + 47) * Math.sin(Math.sqrt(Math.abs(x / 2 + (y + 47)))) - x * Math.sin(Math.sqrt(Math.abs(x - (y + 47))));
    return f / 5;
  }
}

class FF_2D {
  constructor() {
    this.dimensions = [{ min: 0, max: 2 }];
    this.actualMinimum = [1.87836, -1.87668];
  }

  compute(x = 0) {
    const f = x * Math.sin(4 * Math.PI * Math.abs(x - 1));
    return f;
  }
}

module.exports = {
  FF_Sphere,
  FF_Rastrigin,
  FF_Schwefel,
  FF_Ackley,
  FF_Eggholder,
  FF_2D,
};
