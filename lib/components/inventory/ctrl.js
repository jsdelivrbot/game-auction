'use strict';

let ModelCtrl = require(global.getAppPath('common/model/ctrl.js'));

class InventoryCtrl extends ModelCtrl {
	constructor(service) {
		super(service);
	}

	// Get all inventory items by playerId
	getAllByPlayerId(req, res, next) {
		let playerId = req.params['playerId'];
		let userId = req.user ? req.user.id : null;

		if (typeof playerId === 'undefined' || typeof userId === 'undefined') {
			return next(new this.errors.WrongParams('Wrong params!'));
		}

		super.getAll({
			where: {
				user_id: userId,
				player_id: playerId
			}
		}, req, res, next);
	}
}

exports.create = (service) => new InventoryCtrl(service);