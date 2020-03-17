const indexOfLargest = function(particles) {
  let lowest = 0;
  for (let i = 1; i < particles.length; i++) {
    if (particles[i].position.slice(-1)[0] < particles[lowest].position.slice(-1)[0]) lowest = i;
  }
  return lowest;
};

module.exports = { indexOfLargest };
