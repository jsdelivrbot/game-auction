'use strict';

class WrongParams extends Error {
	constructor(error) {
		super(typeof error === 'undefined' ? undefined : error.message);
		Error.captureStackTrace(this, this.constructor);

		this.name = 'WrongParams';
		this.message = typeof error === 'undefined' ? undefined : error.message;
		this.code = '400';
		this.status = 400;
		this.inner = error;
	}
}

module.exports = WrongParams;