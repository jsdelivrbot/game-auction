'use strict';

class UnauthorizedAccessError extends Error {
	constructor(error) {
		super(typeof error === 'undefined' ? undefined : error.message);
		Error.captureStackTrace(this, this.constructor);

		this.name = 'UnauthorizedAccessError';
		this.message = error.message;
		this.code = '401';
		this.status = 401;
		this.inner = error;
	}
}

module.exports = UnauthorizedAccessError;