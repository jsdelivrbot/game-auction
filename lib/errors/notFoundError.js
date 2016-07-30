'use strict';

class NotFoundError extends Error {
	constructor(error) {
		super(typeof error === 'undefined' ? undefined : error.message);
		Error.captureStackTrace(this, this.constructor);

		this.name = 'NotFoundError';
		this.message = typeof error === 'undefined' ? undefined : error.message;
		this.code = '404';
		this.status = 404;
		this.inner = error;
	}
}

module.exports = NotFoundError;