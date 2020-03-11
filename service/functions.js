const FF_Sphere = function() {
  this.dimensions = [
    { min: -5, max: 5 },
    { min: -5, max: 5 }
  ];

  this.compute = function(x, y) {
    const f = x * x + y * y;
    return f;
  }.bind(this);
};

const FF_Rastrigin = function() {
  this.dimensions = [
    { min: -5, max: 5 },
    { min: -5, max: 5 }
  ];

  this.compute = function(x, y) {
    const f =
      20 + x * x + y * y - 10 * (Math.cos(2 * Math.PI * x) + Math.cos(2 * Math.PI * y));
    return f;
  }.bind(this);
};

module.exports = {
  FF_Sphere, FF_Rastrigin
};
