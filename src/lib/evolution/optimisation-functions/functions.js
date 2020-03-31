class FF_Sphere {
  constructor() {
    this.dimensions = [
      { min: -5, max: 5 },
      { min: -5, max: 5 }
    ];
    this.actualMinimum = [0, 0, 0];
  }

  compute(x = 0, y = 0) {
    const f = x * x + y * y;
    return f / 10;
  };
}

class FF_Rastrigin {
  constructor() {
    this.dimensions = [
      { min: -5, max: 5 },
      { min: -5, max: 5 }
    ];
    this.actualMinimum = [0, 0, 0];
  }

  compute(x = 0, y = 0) {
    const f =
      20 +
      x * x +
      y * y -
      10 * (Math.cos(2 * Math.PI * x) + Math.cos(2 * Math.PI * y));
    return f / 20;
  };
}

class FF_Schwefel {
  constructor() {
    this.dimensions = [
      { min: -500, max: 500 },
      { min: -500, max: 500 }
    ];
    this.actualMinimum = [420.9687, 420.9687, 83.79658];
  }

  compute(x = 0, y = 0) {
    const f =
      418.9829 * 3 -
      (x * Math.sin(Math.sqrt(Math.abs(x))) +
        y * Math.sin(Math.sqrt(Math.abs(y))));
    return f / 5;
  };
}

class FF_2D {
  constructor() {
    this.dimensions = [{ min: 0, max: 2 }];
    this.actualMinimum = [1.8783, -1.8636];
  }

  compute(x = 0) {
    const f = x * Math.sin(4 * Math.PI * Math.abs(x - 1));
    return f;
  };
};

module.exports = {
  FF_Sphere,
  FF_Rastrigin,
  FF_Schwefel,
  FF_2D
};
