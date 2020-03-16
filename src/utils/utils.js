const indexOfLargest = function(particles) {
  var lowest = 0;
  for (var i = 1; i < particles.length; i++) {
    if (particles[i].position.slice(-1) < particles[lowest].position.slice(-1)) lowest = i;
  }
  return lowest;
};

module.exports = { indexOfLargest };
