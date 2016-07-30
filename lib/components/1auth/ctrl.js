'use strict';

let debug = require('debug')('app:debug');
let _ = require('lodash');

let errors = require(global.getAppPath('errors'));
let jwtAuth = require(global.getAppPath('common/auth/jwt.js')).getInstance();
let userService = require(global.getAppPath('common/services/user.js')).getInstance();

class AuthCtrl {
	// User's authentication
	authenticate(req, res, next) {
		debug('Processing authenticate middleware');

		let username = req.body.username;

		if (_.isEmpty(username)) {
			return next(new errors.UnauthorizedAccess({
				message: 'Invalid username'
			}));
		}

		process.nextTick(() => {
			userService.findOrCreate(username)
				.then((user) => {
					if (!user) {
						return next(new errors.UnauthorizedAccess({
							message: 'Invalid username'
						}));
					}

					jwtAuth.create(Object.assign({}, user), req, res, next);
				})
				.catch((err) => {
					if(err) {
						return next(new errors.Db(err));
					}

					next(new errors.UnauthorizedAccess());
				});
		});
	}

	// User's login
	login(req, res) {
		return res.status(200).json(req.user);
	}

	// Checks is user logged in
	verify(req, res) {
		return res.status(200).json(undefined);
	}

	// User's logout
	logout(req, res, next) {
		if (jwtAuth.expire(req.headers)) {
			delete req.user;

			return res.status(200).json({
				'message': 'User has been successfully logged out'
			});
		} else {
			return next(new errors.UnauthorizedAccess());
		}
	}
}

exports.create = () => new AuthCtrl();