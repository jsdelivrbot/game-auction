'use strict';

let ModelCtrl = require(global.getAppPath('common/model/ctrl.js'));

// PlayersCtrl extends ModelCtrl
class PlayersCtrl extends ModelCtrl {
	constructor(service) {
		super(service);
	}

	// Get player by userId
	getByUserId(req, res, next) {
		let userId = req.user ? req.user.id : null;

		if (typeof userId === 'undefined') {
			return next(new this.errors.WrongParams());
		}

		// Call base class get method
		super.get({
			where: {
				user_id: userId
			}
		}, req, res, next);
	}
}

exports.create = (service) => new PlayersCtrl(service);