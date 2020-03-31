import React, { useState, useEffect } from "react";
import Draggable from "react-draggable";

import "./topParticles.css";

const TopParticles = ({ population, ff, iteration }) => {
  const [topValues, setTopValues] = useState([]);

  useEffect(() => {
    const values = population.individuals.map(particle => [
      ...particle.position,
      particle.fitness
    ]);
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
    <Draggable>
      <table className="top-particles">
        <thead>
          <tr>
            <td colSpan={ff.dimensions.length + 1} align="center">
              Top particles
            </td>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    </Draggable>
  );
};

export default TopParticles;
