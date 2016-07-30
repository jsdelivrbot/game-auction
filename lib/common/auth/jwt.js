'use strict';

let _ = require('lodash');
let UnauthorizedAccessError = require(global.getAppPath('errors')).UnauthorizedAccess;
let debug = require('debug')('app:debug');
let jsonwebtoken = require('jsonwebtoken');
let EventEmitter = require('events');

let config = require(global.getAppPath('config')).env;
let RedisConnector = require(global.getAppPath('common/connectors')).Redis;
let TOKEN_EXPIRATION_SEC = config.token_expiration * 60;

// JSON web token authentication class
let jwtAuth = new class JwtUtils extends EventEmitter {
	constructor() {
		super();

		this.db = RedisConnector.create(config.redis, TOKEN_EXPIRATION_SEC);
	}

	// Checks if the user is authenticated
	middleware() {
		let func = (req, res, next) => {

			let token = this.fetch(req.headers);

			this.retrieve(token, (err, data) => {
				if (err) {
					req.user = undefined;
					return next(new UnauthorizedAccessError({
						message: 'invalid_token'
					}));
				} else {
					req.user = _.merge(req.user, data);
					next();
				}
			});
		};

		func.unless = require('express-unless');

		return func;
	}

	// Check is the jwt expired
	expire(headers) {
		let token = this.fetch(headers);

		debug('Expiring token: %s', token);

		if (token !== null) {
			this.db.expire(token, 0);
			this.emit('expired', {
				token
			});
		}

		return token !== null;
	}

	// Extract the token from the req header
	fetch(headers) {
		if (headers && headers.authorization) {
			let authorization = headers.authorization;
			let part = authorization.split(' ');

			if (part.length === 2) {
				let token = part[1];
				return token;
			} else {
				return null;
			}
		} else {
			return null;
		}
	}

	// Create new jwt
	create(user, req, res, next) {
		debug('Create token');

		if (_.isEmpty(user)) {
			return next(new Error('User data cannot be empty.'));
		}

		let data = {
			id: user.id,
			username: user.username,
			token: jsonwebtoken.sign({
				id: user.id,
				username: user.username
			}, config.secret, {
				expiresIn: TOKEN_EXPIRATION_SEC
			})
		};

		let decoded = jsonwebtoken.decode(data.token);

		data.token_exp = decoded.exp;
		data.token_iat = decoded.iat;

		debug('Token generated for user: %s, token: %s', data.username, data.token);

		this.db.set(data, (err, result) => {
			if (err) {
				return next(err);
			}

			req.user = result;
			next();
		});

		return data;
	}

	// Get the token from Redis db
	retrieve(id, done) {
		debug('Calling retrieve for token: %s', id);

		if (_.isNull(id)) {
			return done(new Error('token_invalid'), {
				'message': 'Invalid token'
			});
		}

		this.db.get(id, done);
	}

	// Checks is the token valid
	verify(req, res, next) {
		debug('Verifying token');

		var token = this.fetch(req.headers);

		this.verifyByToken(token)
			.then((data) => {
				req.user = data;
				next();
			})
			.catch(() => {
				req.user = undefined;
				next(new UnauthorizedAccessError('invalid_token'));
			});
	}

	// This method is used by web socket's auth. class for web socket's connection auth.
	verifyByToken(token) {
		debug('Verifying token');

		return new Promise((resolve, reject) => {
			jsonwebtoken.verify(token, config.secret, (err) => {
				if (err) {
					return reject(new UnauthorizedAccessError('invalid_token'));
				}

				this.retrieve(token, (err, data) => {
					if (err) {
						return reject(new UnauthorizedAccessError('invalid_token', data));
					}

					resolve(data);
				});
			});
		});
	}
}();

// Exports create method
exports.getInstance = () => jwtAuth;