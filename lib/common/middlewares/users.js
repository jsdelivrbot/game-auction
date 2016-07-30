'use strict';

let errors = require(global.getAppPath('errors'));

// Auth. middleware - checks if the user is owner of the requested model's items
exports.owner = (req, res, next) => {
	let userId = req.params['userId'];

	if (typeof userId === 'undefined' || userId === 'undefined') {
		return next(new errors.WrongParams());
	}

	if(parseInt(userId) !== req.user.id) {
		return next(new errors.Forbidden());
	}

	next();
}