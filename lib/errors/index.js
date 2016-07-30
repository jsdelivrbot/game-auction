'use strict';

// Application errors classes
let NotFound = require('./notFoundError');
let UnauthorizedAccess = require('./unauthorizedAccessError');
let WrongParams = require('./wrongParamsError');
let Server = require('./serverError');
let Forbidden = require('./forbiddenError');
let Db = require('./dbError');

module.exports = {
	WrongParams,
	NotFound,
	UnauthorizedAccess,
	Server,
	Forbidden,
	Db
}