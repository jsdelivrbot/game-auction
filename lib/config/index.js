'use strict';

exports.env = require(`./${process.env.NODE_ENV}.js`);
exports.express = require('./express.js');
exports.db = require('./mysql.js');