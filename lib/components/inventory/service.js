'use strict';

let db = require(global.getAppPath('config')).db;
let ModelService = require(global.getAppPath('common/model/service.js'));

let inventoryService = new class PlayersService extends ModelService {
	constructor() {
		// Set main inventoryService's model
		super(db.getModel('inventory'));

		this._init();
	}

	_init() {
		this.addAssociations([{
			// 'views' means that it's used like include option for model's findAll query method call
			views: {
				model: db.getModel('inventory_types'),
				attributes: ['name', 'img']
			}
		}]);
	}
}();

// Exports create method
exports.getInstance = () => inventoryService;