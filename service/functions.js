const FF_Sphere = function() {
  this.dimensions = [
    { min: -10, max: 10 },
    { min: -10, max: 10 },
    { min: 0, max: 100 }

  ];

  this.compute = function(x, y) {
    if (x < this.dimensions[0].min) {
      x = this.dimensions[0].min;
    }

    if (x > this.dimensions[0].max) {
      x = this.dimensions[0].max;
    }

    if (y < this.dimensions[1].min) {
      y = this.dimensions[1].min;
    }

    if (y > this.dimensions[1].max) {
      y = this.dimensions[1].max;
    }

    const f = x*x + y*y;
    return f;
  }.bind(this);
};

module.exports = {
  FF_Sphere
};
