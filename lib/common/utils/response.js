'use strict';

let _ = require('lodash');
let errors = require(global.getAppPath('errors'));

// REST api routes default response handler
exports._handleResponse = _.curry((req, res, next, proceed, data) => {
	if (data) {
		if (proceed) {
			res.locals.data = data;
			next();
		} else {
			res.send(data);
		}
	} else {
		res.send(null);
	}

	return data;
});

// REST api routes default response error handler
exports._handleError = _.curry((req, res, next, err) => {
	if (err) {
		return next(err);
	}

	next(new errors.Server());
});