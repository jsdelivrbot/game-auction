'use strict';

let db = require(global.getAppPath('config')).db;
let ModelService = require(global.getAppPath('common/model/service.js'));

let playersService = new class PlayersService extends ModelService {
	constructor() {
		// Set main playersService's model
		super(db.getModel('players'));

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
		}]);
	}
}();

// Exports create method
exports.getInstance = () => playersService;