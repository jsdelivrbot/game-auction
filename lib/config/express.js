'use strict';

let bodyParser = require('body-parser');
let morgan = require('morgan');
let express = require('express');

exports.init = (app) => {
	app.use(express.static(global.getAppPath('../static')));
	app.use(bodyParser.urlencoded({
		extended: false
	}));

	app.use(bodyParser.json());
	app.use(morgan('dev'));
};