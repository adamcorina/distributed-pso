const indexOfLargest = function(particles) {
  let lowest = 0;
  for (let i = 1; i < particles.length; i++) {
    if (
      particles[i].position.slice(-1)[0] <
      particles[lowest].position.slice(-1)[0]
    )
      lowest = i;
  }
  return lowest;
};

const numberRounding = function(num, digits, base = 10) {
  const pow = Math.pow(base || 10, digits);
  return Math.round(num * pow) / pow;
};

module.exports = { indexOfLargest, numberRounding };
