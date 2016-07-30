'use strict';

let Router = require('express').Router;
let ctrl = require('./ctrl.js').create();

module.exports = () => {
	let router = new Router();

	// POST /api/users/:userId/players/:playerId/auctions - user's login
	router.post('/login', ctrl.authenticate, ctrl.login);

	// GET /logout - user's logout
	router.get('/logout', ctrl.logout);

	// GET /verify - auth's token verify
	router.get('/verify', ctrl.verify);

	return router;
};