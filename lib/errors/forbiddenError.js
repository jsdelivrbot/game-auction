'use strict';

class ForbiddenError extends Error {
	constructor(error) {
		super(typeof error === 'undefined' ? undefined : error.message);
		Error.captureStackTrace(this, this.constructor);

		this.name = 'ForbiddenError';
		this.message = typeof error === 'undefined' ? undefined : error.message;
		this.code = '403';
		this.status = 403;
		this.inner = error;
	}
}

module.exports = ForbiddenError;