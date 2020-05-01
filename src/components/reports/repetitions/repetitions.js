import React, { useEffect, useState, useMemo } from "react";
import NumericInput from "react-numeric-input";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";

import Runner from "../../../lib/evolution/runner";
import { random, numberRounding } from "../../../lib/utils/utils";
import { POPULATION_BASED_ALGORITHMS } from "../../../lib/utils/constants";

import { Chart } from "react-charts";

import "./repetitions.css";

import { ALGORITHMS, FUNCTIONS, SELECTION_FUNCTIONS } from "../../../lib/utils/constants";

const ITERATIONS = 300;
const POPULATION_SIZE = 5;
const REPETITIONS = 30;

const RepetitionsChart = () => {
  const [resultsSingleNode, setResultsSingleNode] = useState([]);
  const [resultsMultipleNodes, setResultsMultipleNodes] = useState([]);
  const [repetitionNumber, setRepetitionNumber] = useState(REPETITIONS);
  const [iterationNumber, setIterationNumber] = useState(ITERATIONS);
  const [populationSize, setPopulationSize] = useState(POPULATION_SIZE);
  const [algorithm, setAlgorithm] = useState(ALGORITHMS.PSO);
  const [optimisationFunction, setOptimisationFunction] = useState(FUNCTIONS.FF_RASTRIGIN);

  const testSingeNode = () => {
    let counter = 0;
    for (let i = 0; i < repetitionNumber; i++) {
      const runner = new Runner(algorithm, optimisationFunction, {
        populationSize: POPULATION_BASED_ALGORITHMS.includes(algorithm) ? populationSize : 1,
        selectionFunction: SELECTION_FUNCTIONS.ROULETTE,
        reportBest: false,
      });

      runner.startRunner();
      runner.collaboration.resetGlobalBest();

      for (let i = 0; i < iterationNumber; i++) {
        runner.tick();
      }
      if (
        numberRounding(runner.algorithm.bestPosition.slice(-1)[0], 3) ===
        numberRounding(runner.ff.actualMinimum.slice(-1)[0], 3)
      ) {
        counter++;
      }
    }
    return [{ x: "Classic algorithm", y: counter }];
  };

  const testMultipleNodes = () => {
    let counter = 0;
    for (let i = 0; i < repetitionNumber; i++) {
      const runners = [
        new Runner(algorithm, optimisationFunction, {
          populationSize: POPULATION_BASED_ALGORITHMS.includes(algorithm) ? populationSize : 1,
          selectionFunction: SELECTION_FUNCTIONS.ROULETTE,
          reportBest: false,
        }),
      ];

      runners[0].startRunner();
      runners[0].collaboration.resetGlobalBest();

      for (let i = 0; i < iterationNumber; i++) {
        const rand = random(0, 1);
        if (rand < 0.05) {
          runners.push(
            new Runner(algorithm, optimisationFunction, {
              populationSize: POPULATION_BASED_ALGORITHMS.includes(algorithm) ? populationSize : 1,
              selectionFunction: SELECTION_FUNCTIONS.ROULETTE,
              reportBest: false,
            })
          );
          runners[runners.length - 1].startRunner();
        }

        for (let j = 0; j < runners.length; j++) {
          runners[j].tick();
        }
      }
      if (
        numberRounding(runners[0].algorithm.bestPosition.slice(-1)[0], 3) ===
        numberRounding(runners[0].ff.actualMinimum.slice(-1)[0], 3)
      ) {
        counter++;
      }
    }
    return [{ x: "Distributed algorithm", y: counter }];
  };

  const series = useMemo(
    () => ({
      type: "bar",
    }),
    []
  );
  const axes = useMemo(
    () => [
      { primary: true, type: "ordinal", position: "left" },
      {
        position: "bottom",
        type: "linear",
        stacked: true,
        tickCount: repetitionNumber,
        range0: 0,
        range1: repetitionNumber,
      },
    ],
    []
  );

  const recalculate = () => {
    setResultsSingleNode(testSingeNode());
    setResultsMultipleNodes(testMultipleNodes());
  };

  useEffect(() => {
    recalculate();
  }, []);

  useEffect(() => {
    recalculate();
  }, [repetitionNumber, iterationNumber, populationSize, algorithm, optimisationFunction]);

  return (
    <div className="repetition-results-container">
      <div className="subtitle">Successfully found minimums:</div>
      <div className="report-controls">
        <div className="repetitions">
          Repetitions:
          <NumericInput min={0} max={1000} value={repetitionNumber} onChange={(value) => setRepetitionNumber(value)} />
        </div>
        <div className="iterations">
          Algorithm Iterations:
          <NumericInput min={0} max={1000} value={iterationNumber} onChange={(value) => setIterationNumber(value)} />
        </div>
        <div className="population">
          Population Size:
          <NumericInput
            min={0}
            max={1000}
            value={POPULATION_BASED_ALGORITHMS.includes(algorithm) ? populationSize : 1}
            disabled={!POPULATION_BASED_ALGORITHMS.includes(algorithm) ? true : false}
            onChange={(value) => setPopulationSize(value)}
          />
        </div>
      </div>
      <div className="report-controls">
        <div className="algorithm">
          Algorithm:
          <Dropdown
            options={Object.values(ALGORITHMS)}
            value={algorithm}
            onChange={(e) => {
              setAlgorithm(e.value);
            }}
          />
        </div>
        <div className="function">
          Function:
          <Dropdown
            options={Object.values(FUNCTIONS)}
            value={optimisationFunction}
            onChange={(e) => {
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
      <div className="repetition-results">
        <Chart
          data={[
            {
              label: "Classic algorithm",
              data: resultsSingleNode,
            },
            {
              label: "Distributed algorithm",
              data: resultsMultipleNodes,
            },
          ]}
          series={series}
          axes={axes}
          tooltip
        />
      </div>
    </div>
  );
};

export default RepetitionsChart;
