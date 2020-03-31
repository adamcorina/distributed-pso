import React, { useEffect } from "react";
import Runner from "../../lib/evolution/runner";

import {
  ALGORITHMS,
  FUNCTIONS,
  SELECTION_FUNCTIONS
} from "../../lib/utils/constants";

const ITERATIONS = 1000;
const CICLE_ITERATIONS = 20;

const Results = () => {
  const testSingeNode = () => {
    console.log("---------------------------")
    const runner = new Runner(ALGORITHMS.GA, FUNCTIONS.FF_SCHWEFEL, {
      populationSize: 5,
      selectionFunction: SELECTION_FUNCTIONS.ROULETTE,
      isCollaborative: false
    });

    runner.startRunner();

    for (let i = 0; i < ITERATIONS; i++) {
      runner.tick();
    }
    console.log(runner.algorithm.bestPosition);
  };

  const testMultipleNodes = () => {
      console.log("---------------------------")
    const runners = [
      new Runner(ALGORITHMS.GA, FUNCTIONS.FF_SCHWEFEL, {
        populationSize: 5,
        selectionFunction: SELECTION_FUNCTIONS.ROULETTE,
        isCollaborative: true
      })
    ];

    runners[0].startRunner();

    runners[0].collaboration.changeAlgorithm(ALGORITHMS.GA);
    runners[0].collaboration.changeFunction(FUNCTIONS.FF_SCHWEFEL);
    runners[0].collaboration.changePopulationSize(5);

    for (let i = 0; i < ITERATIONS; i++) {
      if (i % CICLE_ITERATIONS === CICLE_ITERATIONS - 1) {
        runners.push(
          new Runner(ALGORITHMS.GA, FUNCTIONS.FF_SCHWEFEL, {
            populationSize: 5,
            selectionFunction: SELECTION_FUNCTIONS.ROULETTE,
            isCollaborative: true
          })
        );
        runners[runners.length - 1].startRunner();
      }

      for (let j = 0; j < runners.length; j++) {
        runners[j].tick();
      }
    }

    console.log(runners.slice(-1)[0].collaboration.collaborativeBest);
    console.log("---------------------------")
    console.log(runners.slice(-1)[0].ff.actualMinimum);
  };

  useEffect(() => {
    testSingeNode();
    testMultipleNodes();
  }, []);

  return <div>Results</div>;
};

export default Results;
