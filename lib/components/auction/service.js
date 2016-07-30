'use strict';

let _ = require('lodash');
let db = require(global.getAppPath('config')).db;
let ModelService = require(global.getAppPath('common/model/service.js'));
let DbError = require(global.getAppPath('errors')).Db;
let WrongParamsError = require(global.getAppPath('errors')).WrongParams;

let auctionService = new class AuctionService extends ModelService {
	constructor() {
		super(db.getModel('auctions'));

		this.inventoryModel = db.getModel('inventory');
		this.auctionsBidsModel = db.getModel('auctions_bids');

		this._init();
	}

	_init() {
		// Create player's model associations used for model's query methods
		this.addAssociations([{
			// 'details' means that it's used like include option for model's findOne query method call
			details: {
				model: db.getModel('users'),
				fields: ['id', 'username']
			}
		}, {
			details: {
				model: db.getModel('auctions_bids'),
				fields: ['coins']
			}
		}]);
	}

	// Attach inventory's item inventory type
	attachInventoryType(auction) {
		return this.inventoryModel.findOne({
				where: {
					id: auction.inventory_id
				},
				include: [{
					model: db.getModel('inventory_types'),
					attributes: ['name', 'img']
				}]
			})
			.then((inventory) => {
				let result = Object.assign(auction, {
					inventory_type: inventory.inventory_type.get({
						plain: true
					})
				});

				return result;
			});
	}

	// Filter max bid
	getMaxBid(auction) {
		if (!auction) {
			return auction;
		}

		let maxBid = _.chain(auction.auctions_bids).map('coins').max().value();
		auction.max_bid = maxBid || null;

		delete auction.auctions_bids;
		return auction;
	}

	// Notify on new bid added
	notifyMaxBid(auctionBid) {
		this.emit('auction:updated', {
			max_bid: auctionBid.coins
		});

		return auctionBid;
	}

	// Notify on new auction created
	notifyCreate() {
		this.emit('auction:created');
	}

	// Add new bid to the auction
	updateMaxBid(data) {
		return (auction) => {
			if (!auction) {
				return Promise.reject(new DbError('Not found!'));
			}

			this.emit('auction:updated');

			return this.auctionsBidsModel.create({
				auction_id: auction.id,
				player_id: data.player_id,
				coins: data.coins
			});
		}
	}

	// Get auction that is not completed - i.e. still running
	getNotCompleted() {
		return this.get({
			where: {
				status: {
					$notIn: ['completed']
				}
			},
			order: [
				['createdAt', 'ASC']
			]
		}, null, true);
	}

	// Check if the bid is highter that the max bid for the auction or >= auction's min price if no winning bid has made
	checkCanBid(auctionId, coins) {
		return this.get({
				where: {
					id: auctionId
				}
			}, null, true)
			.then((auction) => {
				this.getMaxBid(auction);

				let minPrice = auction.min_price;
				let maxBid = auction.max_bid;

				if ((!maxBid && coins < minPrice) || (!isNaN(maxBid) && maxBid !== null && coins <= maxBid)) {
					throw new WrongParamsError('Wrong params!')
				}
			});
	}
}();

// Exports create method
exports.getInstance = () => auctionService;