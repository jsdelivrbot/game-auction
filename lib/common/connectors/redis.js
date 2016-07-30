'use strict';

let _ = require('lodash');
let redis = require('redis');
let debug = require('debug')('app:debug');

// Redis connector - used by jwt auth.
class RedisConnector {
	constructor(conn, tokenExp) {
		this.client = redis.createClient(conn);
		this.tokenExp = tokenExp;

		this._init();
	}

	_init() {
		this.client.on('error', (err) => {
			debug(err);
		});

		this.client.on('connect', () => {
			debug('Redis successfully connected');
		});
	}

	get(id, done) {
		this.client.get(id, (err, reply) => {
			if (err) {
				return done(err, {
					'message': err
				});
			}

			if (_.isNull(reply)) {
				return done(new Error('token_invalid'), {
					'message': 'Token doesn\'t exists, are you sure it hasn\'t expired or been revoked?'
				});
			} else {
				let data = JSON.parse(reply);

				if (_.isEqual(data.token, id)) {
					return done(null, data);
				} else {
					return done(new Error('token_doesnt_exist'), {
						'message': 'Token doesn\'t exists, login into the system so it can generate new token.'
					});
				}
			}
		});
	}

	set(data, done) {
		this.client.set(data.token, JSON.stringify(data), (err, reply) => {
			if (err) {
				return done(new Error(err));
			}

			if (reply) {
				this.client.expire(data.token, this.tokenExp, (err, reply) => {
					if (err) {
						return done(new Error('Can not set the expire value for the token key'));
					}
					if (reply) {
						done(null, data);
					} else {
						return done(new Error('Expiration not set on redis'));
					}
				});
			} else {
				return done(new Error('Token not set in redis'));
			}
		});
	}

	expire(token, exp) {
		this.client.expire(token, exp);
	}
}

exports.create = (conn, tokenExp) => new RedisConnector(conn, tokenExp);