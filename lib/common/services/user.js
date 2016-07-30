'use strict';

let db = require(global.getAppPath('config')).db;
let MySqlConnector = require(global.getAppPath('common/connectors')).MySql;

let userService = new class UserService extends MySqlConnector {
	constructor() {
		super(db, 'users');
	}

	// Get user by username
	getUser(username) {
		return super.findOne({
			where: {
				username
			}
		});
	}

	// Find or create new user
	findOrCreate(username) {
		return super.findOrCreate({
			where: {
				username
			}
		});
	}
}();

// Exports create method
exports.getInstance = () => userService;