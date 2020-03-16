const FF_Sphere = function() {
  this.dimensions = [
    { min: -5, max: 5 },
    { min: -5, max: 5 }
  ];

  this.compute = function(x, y) {
    const f = x * x + y * y;
    return f/10;
  };
};

const FF_Rastrigin = function() {
  this.dimensions = [
    { min: -5, max: 5 },
    { min: -5, max: 5 }
  ];

  this.compute = function(x, y) {
    const f =
      20 +
      x * x +
      y * y -
      10 * (Math.cos(2 * Math.PI * x) + Math.cos(2 * Math.PI * y));
    return f/20;
  };
};

const FF_Schwefel = function() {
  this.dimensions = [
    { min: -500, max: 500 },
    { min: -500, max: 500 }
  ];

  this.compute = function(x, y) {
    const f =
      418.9829 * 3 -
      (x * Math.sin(Math.sqrt(Math.abs(x))) +
        y * Math.sin(Math.sqrt(Math.abs(y))));
    return f/5;
  };
};

const FF_2D = function() {
  this.dimensions = [{ min: 0, max: 2 }];
  this.compute = function(x) {
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