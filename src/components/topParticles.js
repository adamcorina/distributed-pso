import React, { useState, useEffect } from "react";
import { eventBus } from "../event-bus/eventBus";
import "./topParticles.css";

const TopParticles = ({ pso }) => {
  const [topValues, setTopValues] = useState([]);

  useEffect(() => {
    eventBus.$on("iteration", () => {
      const values = pso.particles.map(particle => [
        ...particle.bestPosition,
        particle.bestFitness
      ]);
      values.sort((a, b) => a.slice(-1) - b.slice(-1));
      setTopValues(values.slice(0, 3));
    });
  }, []);

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
            colSpan={pso.fitnessFunction.dimensions.length + 1}
            align="center"
          >
            Top 3 particles
          </td>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
};

export default TopParticles;
