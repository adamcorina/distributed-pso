const indexOfLargest = function(particles) {
  var lowest = 0;
  for (var i = 1; i < particles.length; i++) {
    if (particles[i].position.slice(-1)[0] < particles[lowest].position.slice(-1)[0]) lowest = i;
  }
  return lowest;
};

module.exports = { indexOfLargest };
