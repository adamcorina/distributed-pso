import React from "react";
import ReactDOM from "react-dom";
import { HashRouter as Router, Switch, Route } from "react-router-dom";

import Simulator from "./components/simulator/simulator";
import Results from "./components/results/results";

var mountNode = document.getElementById("app");
ReactDOM.render(
  <Router>
    <Switch>
      <Route path="/results">
        <Results />
      </Route>
      <Route path="/">
        <Simulator />
      </Route>
    </Switch>
  </Router>,
  mountNode
);
