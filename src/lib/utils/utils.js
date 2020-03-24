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

const random = function(min, max, precision) {
  let result = min + Math.random() * (max - min);

  if (precision !== undefined) {
    const power = Math.pow(10, precision);
    result = Math.round(result * power) / power;
  }

  return result;
};

module.exports = { indexOfLargest, numberRounding, random };
