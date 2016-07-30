'use strict';

let debug = require('debug')('app:debug');
let error = require('debug')('app:error');
let _ = require('lodash');

// Web sockets authentication class
class WsAuth {
	constructor(io) {
		this.io = io;
	}

	init(options) {
		options = options || {};

		_.each(this.io.nsps, this._forbidConnections);

		// Check if the new connected by web socket user sends the auth. token
		this.io.on('connection', (socket) => {
			socket.auth = false;
			socket.username = null;
			socket.token = null;

			try {
				let tokenString = socket.client.request._query.token;
				let [word, token] = tokenString.split(' ');

				if (word != 'Bearer' || !token) {
					throw new Error('Not Authenticated!');
				} else {
					options.verify(token)
						.then((user) => {
							if (!user) {
								// Disconnect the web socket's connection if no auth. jwt token is presented
								return this._disconnect(socket, 'Token not found!');
							}

							if (options.single) {
								// Disconect other users with the same username
								this._forceDisconnect({
									username: user.username,
									except: socket
								});
							}

							// Authorize user
							this._authorize(socket, user);
						})
						.catch((err) => {
							// Disconnect on error
							this._disconnect(socket, err);
						});
				}
			} catch (err) {
				this._disconnect(socket, err);
			}
		});
	}

	forceDisconnect(token) {
		this._forceDisconnect({
			token
		});
	}

	_authorize(socket, user) {
		debug('Authenticated socket %s', socket.id);
		socket.auth = true;
		socket.username = user.username;
		socket.token = user.token;

		_.each(this.io.nsps, (nsp) => {
			this._restoreConnection(nsp, socket);
		});

		socket.emit('authorized');
	}

	// Disconnect the web socket's connection
	_disconnect(socket, err) {
		error('Error: ', err);
		debug('Authentication failure socket %s', socket.id);

		socket
			.emit('unauthorized')
			.disconnect();
	}

	// Remove the connection from the socket.io collection before the user get authenticate
	_forbidConnections(nsp) {
		nsp.on('connect', (socket) => {
			if (!socket.auth) {
				debug('removing socket from %s', nsp.name);
				delete nsp.connected[socket.id];
			}
		});
	}

	// Restore the connection to the socket.io collection after the user is authenticate
	_restoreConnection(nsp, socket) {
		if (_.find(nsp.sockets, {
				id: socket.id
			})) {
			debug('restoring socket to %s', nsp.name);
			nsp.connected[socket.id] = socket;
		}
	}

	// Force logout
	_forceDisconnect({
		username, token, except
	}) {
		if (!username && !token) {
			return;
		}

		_.each(this.io.nsps, (nsp) => {
			let socket = null;

			if (username) {
				socket = _.find(nsp.sockets, {
					username
				});
			} else if(token) {
				socket = _.find(nsp.sockets, {
					token
				});
			}

			if (socket && (!except || socket.id !== except.id)) {
				socket
					.emit('forceDisconnect')
					.disconnect();

				debug('removing socket from %s', nsp.name);
				delete nsp.connected[socket.id];
			}
		});
	}
}

// Exports create method
exports.create = (io) => new WsAuth(io);