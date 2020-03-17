const express = require("express");
const app = express();
const Gun = require('gun');

const webpack = require("webpack");
const webpackDevMiddleware = require("webpack-dev-middleware");
const webpackHotMiddleware = require("webpack-hot-middleware");
const config = require("./webpack.config.js");
const compiler = webpack(config);

app.use(Gun.serve);
app.use(webpackHotMiddleware(compiler));
app.use(webpackDevMiddleware(compiler));

const server = app.listen(8080);
Gun({ file: 'db/data', web: server });