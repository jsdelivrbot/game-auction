'use strict';

let unless = require('express-unless');
let jwt = require('express-jwt');

let jwtAuth = require(global.getAppPath('common/auth/jwt.js')).getInstance();
let WsAuth = require(global.getAppPath('common/auth/wsAuth.js'));
let config = require(global.getAppPath('config')).env;

exports.initRest = (app) => {
	let jwtCheck = jwt({
		secret: config.secret
	});
	jwtCheck.unless = unless;

	// Token verification - is auth token valid
	app.use(jwtCheck.unless({
		path: [
			'/auth/login',
			/\/socket.io\//i
		]
	}));

	// Check is token exists in Redis db
	app.use(jwtAuth.middleware().unless({
		path: [
			'/auth/login',
			/\/socket.io\//i
		]
	}));

	app.use('/auth', require('./router.js')());
};

exports.initWs = (ws) => {
	let wsAuth = WsAuth.create(ws);
	wsAuth.init({
		verify: jwtAuth.verifyByToken.bind(jwtAuth),
		single: true
	});

	// Force disconect the user with the same username logged on different browsers
	jwtAuth.on('expired', (data) => wsAuth.forceDisconnect(data.token));
};