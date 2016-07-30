'use strict';

let service = require('./service').getInstance();

exports.initRest = (app, taskRunner) => {
	// Auction component main route path
	app.use('/api', require('./router.js')());

	// Run auctions task runner on new auction being created
	service.on('auction:created', () => {
		taskRunner.start();
	});

	// Increase current auction's time with 10 seconds when new bid is made
	service.on('auction:updated', () => {
		taskRunner.updated();
	});
};

exports.initWs = (ws) => {
	// Notify the clients for the new bid via web sockets
	service.on('auction:updated', (data) => {
		ws.emit('taskUpdated', data);
	});
};