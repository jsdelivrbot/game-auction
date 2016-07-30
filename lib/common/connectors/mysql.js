'use strict';

let NotFoundError = require(global.getAppPath('errors')).NotFound;
let DbError = require(global.getAppPath('errors')).Db;

// MySql connector - used by user's service
module.exports = class MySql {
	constructor(db, modelName) {
		this.db = db;
		this.model = db.getModel(modelName);
	}

	findOne(options) {
		options = options || {};

		return this.model.findOne(options);
	}

	findAll(options) {
		options = options || {};

		return this.model.findAll(options);
	}

	findOrCreate(options) {
		options = options || {};

		return new Promise((resolve, reject) => {
			this.model.findOrCreate(options)
				.spread((instance, created) => {
					if (instance) {
						resolve(instance.get({
							plain: true
						}));
					} else {
						if (created) {
							reject(new DbError());
						} else {
							reject(new NotFoundError());
						}
					}
				})
				.catch(reject);
		});
	}
}