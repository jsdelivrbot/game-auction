'use strict';

class ServerError extends Error {
	constructor(error) {
		super(typeof error === 'undefined' ? undefined : error.message);
		Error.captureStackTrace(this, this.constructor);

		this.name = 'ServerError';
		this.message = typeof error === 'undefined' ? undefined : error.message;
		this.code = '500';
		this.status = 500;
		this.inner = error;
	}
}

module.exports = ServerError;