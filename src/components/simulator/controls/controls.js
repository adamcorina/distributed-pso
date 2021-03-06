import React, { useState, useEffect } from "react";
import Draggable from "react-draggable";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import NumericInput from "react-numeric-input";

import { ALGORITHMS, FUNCTIONS } from "../../../lib/utils/constants";

import "./controls.css";

const STEP = 50;

const Controls = ({
  pause,
  start,
  changeAlgorithm,
  changeFunction,
  changeUpdateInterval,
  changePopulationSize,
  locallyChangeAlgorithm,
  playState,
  algorithmTag,
  functionTag,
  updateInterval,
  populationSize,
  localAlgorithmTag
}) => {
  const [localPopulationSize, updateLocalPopulationSize] = useState(
    populationSize
  );
  const onPopulationChange = newSize => {
    updateLocalPopulationSize(newSize);
  };

  const propagatePopulationSizeChange = () => {
    changePopulationSize(localPopulationSize);
  };

  useEffect(() => {
    updateLocalPopulationSize(populationSize);
  }, [populationSize]);

  return (
    <Draggable cancel=".react-numeric-input">
      <table className="controls">
        <tr>
          <td colspan="3">
            <div className="subtitle">All nodes:</div>
          </td>
        </tr>
        <tr>
          <td colspan="3">
            <div className="btn" onClick={start}>
              Restart
            </div>
          </td>
        </tr>
        <tr>
          <td colspan="1">
            <div className="description">Algorithm:</div>
          </td>
          <td colspan="2">
            <Dropdown
              options={Object.values(ALGORITHMS)}
              value={algorithmTag}
              onChange={e => {
                changeAlgorithm(e.value);
              }}
            />
          </td>
        </tr>
        <tr>
          <td colspan="1">
            <div className="description">Function:</div>
          </td>
          <td colspan="2">
            <Dropdown
              options={Object.values(FUNCTIONS)}
              value={functionTag}
              onChange={e => {
                changeFunction(e.value);
              }}
            />
          </td>
        </tr>
        <tr>
          <td colspan="1">
            <div className="description">Population:</div>
          </td>
          <td colspan="2" className="population-controls">
            <NumericInput
              min={0}
              max={200}
              value={localPopulationSize}
              onChange={onPopulationChange}
              onKeyDown={e => e.stopPropagation()}
              onFocus={e => e.stopPropagation()}
            />
            <div className="btn" onClick={propagatePopulationSizeChange}>
              Update
            </div>
          </td>
        </tr>
        <tr>
          <td colspan="3">
            <hr />
          </td>
        </tr>
        <tr>
          <td colspan="3">
            <td>
              <div className="subtitle">Local node:</div>
            </td>
          </td>
        </tr>
        <tr>
          <td colspan="3">
            <div
              className="btn"
              onClick={() => {
                pause();
              }}
            >
              {playState}
            </div>
          </td>
        </tr>
        <tr>
          <td colspan="1">
            <div className="description">Speed:</div>
          </td>
          <td colspan="2" className="speed-controls">
            <div
              className={`btn ${
                updateInterval + STEP > 5000 ? "disabled" : ""
              }`}
              onClick={() => {
                let newUpdateInterval = updateInterval;
                newUpdateInterval =
                  newUpdateInterval + STEP < 5000
                    ? newUpdateInterval + STEP
                    : newUpdateInterval;
                changeUpdateInterval(newUpdateInterval);
              }}
            >
              slower
            </div>
            <div className="value">{updateInterval} ms</div>
            <div
              className={`btn ${updateInterval - STEP < 0 ? "disabled" : ""}`}
              onClick={() => {
                let newUpdateInterval = updateInterval;
                newUpdateInterval =
                  newUpdateInterval - STEP > 0
                    ? newUpdateInterval - STEP
                    : newUpdateInterval;
                changeUpdateInterval(newUpdateInterval);
              }}
            >
              faster
            </div>
          </td>
        </tr>
        <tr>
          <td colspan="1">
            <div className="description">Algorithm:</div>
          </td>
          <td colspan="2">
            <Dropdown
              options={Object.values(ALGORITHMS)}
              value={localAlgorithmTag}
              onChange={e => {
                locallyChangeAlgorithm(e.value);
              }}
            />
          </td>
        </tr>
      </table>
    </Draggable>
  );
};

export default Controls;
