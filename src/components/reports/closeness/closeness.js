import React, { useEffect, useState, useMemo } from "react";
import NumericInput from "react-numeric-input";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";

import Runner from "../../../lib/evolution/runner";
import { random } from "../../../lib/utils/utils";

import { Chart } from "react-charts";

import "./closeness.css";

import {
  ALGORITHMS,
  FUNCTIONS,
  SELECTION_FUNCTIONS
} from "../../../lib/utils/constants";

const ITERATIONS = 300;
const POPULATION_SIZE = 5;

const ClosenessChart = () => {
  const [resultsSingleNode, setResultsSingleNode] = useState([]);
  const [resultsMultipleNodes, setResultsMultipleNodes] = useState([]);
  const [iterationNumber, setIterationNumber] = useState(0);
  const [populationSize, setPopulationSize] = useState(0);
  const [algorithm, setAlgorithm] = useState(ALGORITHMS.PSO);
  const [optimisationFunction, setOptimisationFunction] = useState(
    FUNCTIONS.FF_SCHWEFEL
  );

  const testSingeNode = () => {
    const results = [];

    const runner = new Runner(algorithm, optimisationFunction, {
      populationSize: populationSize,
      selectionFunction: SELECTION_FUNCTIONS.ROULETTE,
      reportBest: false
    });

    runner.startRunner();
    runner.collaboration.resetGlobalBest();

    for (let i = 0; i < iterationNumber; i++) {
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
      new Runner(algorithm, optimisationFunction, {
        populationSize: populationSize,
        selectionFunction: SELECTION_FUNCTIONS.ROULETTE,
        reportBest: false
      })
    ];

    runners[0].startRunner();
    runners[0].collaboration.resetGlobalBest();

    for (let i = 0; i < iterationNumber; i++) {
      const rand = random(0, 1);
      if (rand < 0.05) {
        runners.push(
          new Runner(algorithm, optimisationFunction, {
            populationSize: populationSize,
            selectionFunction: SELECTION_FUNCTIONS.ROULETTE,
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
      {
        primary: true,
        type: "linear",
        position: "bottom",
        showGrid: true,
        showTicks: true
      },
      { type: "linear", position: "left", showGrid: true, showTicks: true }
    ],
    []
  );

  const recalculate = () => {
    setResultsSingleNode(testSingeNode());
    setResultsMultipleNodes(testMultipleNodes());
  };

  useEffect(() => {
    setIterationNumber(ITERATIONS);
    setPopulationSize(POPULATION_SIZE);
  }, []);

  useEffect(() => {
    recalculate();
  }, [iterationNumber, populationSize, algorithm, optimisationFunction]);

  return (
    <div className="closeness-results-container">
      <div className="subtitle">Evolution to global minimum:</div>
      <div className="report-controls">
        <div className="iterations">
          Algorithm Iterations:
          <NumericInput
            min={0}
            max={1000}
            value={iterationNumber}
            onChange={value => setIterationNumber(value)}
          />
        </div>
        <div className="population">
          Population Size:
          <NumericInput
            min={0}
            max={1000}
            value={populationSize}
            onChange={value => setPopulationSize(value)}
          />
        </div>
      </div>
      <div className="report-controls">
        <div className="algorithm">
          Algorithm:
          <Dropdown
            options={Object.values(ALGORITHMS)}
            value={algorithm}
            onChange={e => {
              setAlgorithm(e.value);
            }}
          />
        </div>
        <div className="function">
          Function:
          <Dropdown
            options={Object.values(FUNCTIONS)}
            value={optimisationFunction}
            onChange={e => {
              setOptimisationFunction(e.value);
            }}
          />
        </div>
        <div className="recalculate">
          <div className="btn" onClick={recalculate}>
            Recalculate
          </div>
        </div>
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
