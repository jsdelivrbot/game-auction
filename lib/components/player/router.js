'use strict';

let Router = require('express').Router;
let service = require('./service').getInstance();
let ctrl = require('./ctrl.js').create(service);
let usersMdl = require(global.getAppPath('common/middlewares/users.js'));

module.exports = () => {
	let router = new Router();

	// GET /api/users/:userId/players/:id?
	router.get('/users/:userId/players/:id?', usersMdl.owner, ctrl.getByUserId.bind(ctrl));

	return router;
};