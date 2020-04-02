import React, { useEffect, useState, useMemo } from "react";

import Runner from "../../../lib/evolution/runner";
import { random } from "../../../lib/utils/utils";

import { Chart } from "react-charts";

import "./closeness.css";

import {
  ALGORITHMS,
  FUNCTIONS,
  SELECTION_FUNCTIONS
} from "../../../lib/utils/constants";

const ITERATIONS = 500;
const POPULATION_SIZE = 5;

const ClosenessChart = () => {
  const [resultsSingleNode, setResultsSingleNode] = useState([]);
  const [resultsMultipleNodes, setResultsMultipleNodes] = useState([]);

  const testSingeNode = () => {
    const results = [];

    const runner = new Runner(ALGORITHMS.PSO, FUNCTIONS.FF_RASTRIGIN, {
      populationSize: POPULATION_SIZE,
      selectionFunction: SELECTION_FUNCTIONS.TOURNAMENT,
      reportBest: false
    });

    runner.startRunner();
    runner.collaboration.resetGlobalBest();

    for (let i = 0; i < ITERATIONS; i++) {
      runner.tick();
      results.push({
        x: i,
        y:
          runner.algorithm.bestPosition.slice(-1)[0] -
          runner.ff.actualMinimum.slice(-1)[0]
      });
    }

    return results;
  };

  const testMultipleNodes = () => {
    const results = [];

    const runners = [
      new Runner(ALGORITHMS.PSO, FUNCTIONS.FF_RASTRIGIN, {
        populationSize: POPULATION_SIZE,
        selectionFunction: SELECTION_FUNCTIONS.TOURNAMENT,
        reportBest: false
      })
    ];

    runners[0].startRunner();
    runners[0].collaboration.resetGlobalBest();

    for (let i = 0; i < ITERATIONS; i++) {
      const rand = random(0, 1);
      if (rand < 0.05) {
        runners.push(
          new Runner(ALGORITHMS.PSO, FUNCTIONS.FF_RASTRIGIN, {
            populationSize: POPULATION_SIZE,
            selectionFunction: SELECTION_FUNCTIONS.TOURNAMENT,
            reportBest: false
          })
        );
        runners[runners.length - 1].startRunner();
      }

      for (let j = 0; j < runners.length; j++) {
        runners[j].tick();
      }
      results.push({
        x: i,
        y:
          runners[0].algorithm.bestPosition.slice(-1)[0] -
          runners[0].ff.actualMinimum.slice(-1)[0]
      });
    }

    return results;
  };

  const series = useMemo(
    () => ({
      showPoints: false
    }),
    []
  );
  const axes = useMemo(
    () => [
      { primary: true, type: "linear", position: "bottom", showGrid: true, showTicks: true },
      { type: "linear", position: "left", showGrid: true, showTicks: true }
    ],
    []
  );

  useEffect(() => {
    setResultsSingleNode(testSingeNode());
    setResultsMultipleNodes(testMultipleNodes());
  }, []);

  return (
    <div className="closeness-results-container">
      <div>
        Iterations for a repetition: {ITERATIONS} <br />
        Population size: {POPULATION_SIZE} <br />
      </div>
      <div className="closeness-results">
        <Chart
          data={[
            {
              label: "Classic algorithm",
              data: resultsSingleNode
            },
            {
              label: "Distributed algorithm",
              data: resultsMultipleNodes
            }
          ]}
          series={series}
          axes={axes}
          tooltip
        />
      </div>
    </div>
  );
};

export default ClosenessChart;
