import React from "react";
import ReactDOM from "react-dom";
import { HashRouter as Router, Switch, Route } from "react-router-dom";

import Simulator from "./components/simulator/simulator";
import Reports from "./components/reports/reports";

var mountNode = document.getElementById("app");
ReactDOM.render(
  <Router>
    <Switch>
      <Route path="/reports">
        <Reports />
      </Route>
      <Route path="/">
        <Simulator />
      </Route>
    </Switch>
  </Router>,
  mountNode
);
