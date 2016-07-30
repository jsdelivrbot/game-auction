'use strict';

let Router = require('express').Router;
let service = require('./service').getInstance();
let ctrl = require('./ctrl.js').create(service);

// Users authorization middleware
let usersMdl = require(global.getAppPath('common/middlewares/users.js'));

module.exports = () => {
	let router = new Router();

	// GET /api/users/:userId/players/:playerId/inventory/:id?
	router.get('/users/:userId/players/:playerId/inventory/:id?', usersMdl.owner, ctrl.getAllByPlayerId.bind(ctrl));

	return router;
};