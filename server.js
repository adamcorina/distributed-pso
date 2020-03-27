const express = require("express");
const app = express();
const Gun = require("gun");
require("gun/lib/not.js");

const webpack = require("webpack");
const webpackDevMiddleware = require("webpack-dev-middleware");
const webpackHotMiddleware = require("webpack-hot-middleware");
const config = require("./webpack.config.js");
const compiler = webpack(config);

const ALGORITHMS = require("./src/lib/utils/constants").ALGORITHMS;
const FUNCTIONS = require("./src/lib/utils/constants").FUNCTIONS;
const functionMap = require("./src/lib/evolution/optimisation-functions/functions");

const random = require("./src/lib/utils/utils").random;

app.use(Gun.serve);
app.use(webpackHotMiddleware(compiler));
app.use(webpackDevMiddleware(compiler));

const server = app.listen(8080);
const gun = Gun({ file: "db/data", web: server });

gun.get("optimization").not(key => {
  gun.get(key).put({
    algorithm: ALGORITHMS.PSO,
    function: FUNCTIONS.FF_SCHWEFEL
  });
});

gun
  .get("optimization")
  .get("function")
  .once(functionTag => {
    const ff = new functionMap[functionTag]();
    const coordinates = new Array(ff.dimensions.length).fill(Number.MAX_VALUE);
    gun.get("global-minimum").not(key => {
      gun.get(key).put({
        position: Object.assign({}, [...coordinates])
      });
    });
  });
