'use strict';

let ModelCtrl = require(global.getAppPath('common/model/ctrl.js'));

class AuctionCtrl extends ModelCtrl {
	constructor(service) {
		super(service);
	}

	// Create new auction
	create(req, res, next) {
		let playerId = req.params['playerId'];
		let userId = req.user ? req.user.id : null;

		if (typeof playerId === 'undefined' || typeof userId === 'undefined') {
			return next(new this.errors.WrongParams('Wrong params!'));
		}

		let data = req.body;

		// Validate auction's data
		if (!this._isAuctionDataValid(data)) {
			return next(new this.errors.WrongParams('Wrong params!'));
		}

		super.create(Object.assign({
				inventory_id: data.inventoryId,
				qty: data.qty,
				min_price: data.minPrice
			}, {
				user_id: userId,
				player_id: playerId,
				status: 'pending'
			}), req, res, next)
			// Notify on created
			.then(this.service.notifyCreate.bind(this.service));
	}

	_isAuctionDataValid(data) {
		return (typeof data.minPrice !== 'undefined' &&
			typeof data.qty !== 'undefined' &&
			!isNaN(data.minPrice) &&
			parseFloat(data.minPrice) > 0 &&
			!isNaN(data.qty) &&
			parseFloat(data.qty) > 0);
	}

	// Get current running auction
	getRunningAction(req, res, next) {
		this.service.get({
				where: {
					status: 'running'
				},
				order: [
					['createdAt', 'ASC']
				]
			})
			.then(this.service.attachInventoryType.bind(this.service))
			.then(this.service.getMaxBid.bind(this.service))
			.then(this.response._handleResponse(req, res, next, false))
			.catch(this.response._handleError(req, res, next));
	}

	// Add new bid for the current auction
	updateAction(req, res, next) {
		let auctionId = req.params['auctionId'];

		if (typeof auctionId === 'undefined') {
			return next(new this.errors.WrongParams('Wrong params!'));
		}

		let data = req.body;

		if (!this._isBidDataValid(data)) {
			return next(new this.errors.WrongParams('Wrong params!'));
		}

		// Check is there running auction?
		this.service.checkCanBid(auctionId, data.coins)
			.then(() => {
				return this.service.get({
					where: {
						status: 'running',
						id: auctionId
					}
				})
			})
			// Add new bid
			.then(this.service.updateMaxBid(data).bind(this.service))
			// Notify on new max bid added
			.then(this.service.notifyMaxBid.bind(this.service))
			.then(this.response._handleResponse(req, res, next, false))
			.catch(this.response._handleError(req, res, next));
	}

	// Check is the new bid a valid decimal value
	_isBidDataValid(data) {
		return (typeof data.player_id !== 'undefined' &&
			typeof data.coins !== 'undefined' &&
			!isNaN(data.coins) &&
			parseFloat(data.coins) > 0);
	}
}

exports.create = (service) => new AuctionCtrl(service);