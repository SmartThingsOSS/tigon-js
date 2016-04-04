const path = require('path');
const webpack = require('webpack');
const config = require('./webpack.config');
const buildDir = path.resolve(__dirname, '../dist');

config.entry = './index.js';
config.output.path = buildDir;
config.output.library = 'tigon';

module.exports = config;