import React, { useState } from "react";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";

import { ALGORITHMS } from "../../lib/utils/constants";

import "./controls.css";

const Controls = ({ pause, start, changeAlgorithm, playState, algorithmTag }) => {
  return (
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
          <div>Algorithm:</div>
        </td>
        <td colspan="2">
          <Dropdown options={Object.values(ALGORITHMS)} value={algorithmTag} onChange={
            (e) => {
              changeAlgorithm(e.value);
            }
          }/>
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
    </table>
  );
};

export default Controls;
