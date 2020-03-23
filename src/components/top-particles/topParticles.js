import React, { useState, useEffect } from "react";
import "./topParticles.css";

const TopParticles = ({ algorithm, iteration }) => {
  const [topValues, setTopValues] = useState([]);

  useEffect(() => {
    const values = algorithm.particles.map(particle => [
      ...particle.bestPosition,
      particle.bestFitness
    ]);
    values.sort((a, b) => a.slice(-1)[0] - b.slice(-1)[0]);
    setTopValues(values.slice(0, 3));
  }, [iteration]);

  const rows = [];
  for (let i = 0; i < topValues.length; i++) {
    const rowID = `row${i}`;
    const cell = [];
    const coordinates = topValues[i];
    for (let j = 0; j < coordinates.length; j++) {
      const cellID = `cell${i}-${j}`;
      cell.push(
        <td key={cellID} id={cellID}>
          {coordinates[j]}
        </td>
      );
    }
    rows.push(
      <tr key={i} id={rowID}>
        {cell}
      </tr>
    );
  }

  return (
    <table className="top-particles">
      <thead>
        <tr>
          <td
            colSpan={algorithm.fitnessFunction.dimensions.length + 1}
            align="center"
          >
            Top particles
          </td>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
};

export default TopParticles;
