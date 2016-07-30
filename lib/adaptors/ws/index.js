'use strict';

let io = require('socket.io');

// WsAdaptor class
class WsAdaptor {
	constructor(server, subscribe) {
		this.ws = null;
		this.server = server;
		this.subscribe = subscribe;
	}

	init() {
		// Create socket.io server
		this.ws = io(this.server);

		require(global.getAppPath('components')).initWs(this.ws);

		// Notify clients on events fired
		this.subscribe.on('taskUpdated', (data) => {
			this.ws.emit('taskUpdated', data);
		});

		this.subscribe.on('allTasksCompleted', () => {
			this.ws.emit('allTasksCompleted');
		});

		this.subscribe.on('taskStarted', () => {
			this.ws.emit('taskStarted');
		});

		this.subscribe.on('taskCompleted', () => {
			this.ws.emit('taskCompleted');
		});
	}
}

// Exports create method
exports.create = (server, subscribe) => new WsAdaptor(server, subscribe);