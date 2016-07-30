'use strict';

let Router = require('express').Router;
let service = require('./service').getInstance();
let ctrl = require('./ctrl.js').create(service);
let usersMdl = require(global.getAppPath('common/middlewares/users.js'));

module.exports = () => {
	let router = new Router();

	// POST /api/users/:userId/players/:playerId/auctions
	router.post('/users/:userId/players/:playerId/auctions', usersMdl.owner, ctrl.create.bind(ctrl));

	// GET /api/auctions/:auctionId?
	router.get('/auctions/:auctionId?', ctrl.getRunningAction.bind(ctrl));

	// PATCH /api/auctions/:auctionId
	router.patch('/auctions/:auctionId', ctrl.updateAction.bind(ctrl));

	return router;
};