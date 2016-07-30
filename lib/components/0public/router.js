'use strict';

let Router = require('express').Router;

module.exports = () => {
	let router = new Router();

	// Serves angular's app index.html
	router.get('/', function(req, res) {
		res.sendFile(global.joinAppPath('../static', 'index.html'));
	});

	// Serves angular's app index.html
	router.get(/dashboard/, function(req, res) {
		res.sendFile(global.joinAppPath('../static', 'index.html'));
	});

	return router;
};