const FF_Sphere = function() {
  this.dimensions = [
    { min: -5, max: 5 },
    { min: -5, max: 5 }
  ];

  this.compute = function(x, y) {
    const f = x*x + y*y;
    return f;
  }.bind(this);
};

module.exports = {
  FF_Sphere
};
