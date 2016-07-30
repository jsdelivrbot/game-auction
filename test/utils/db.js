'use strict';

let db = require(global.getAppPath('config')).db;
let async = require('async');
let error = require('debug')('app:error');

let except = ['inventory_types'];

exports.cleanDatabase = (cb) => {
	let models = db.getAllModels();

	async.eachSeries(Object.keys(models), function(name, next) {
		if (except.indexOf(name) !== -1) {
			next();
		} else {
			models[name].truncate({})
				.then(() => {
					next();
				})
				.catch((err) => {
					error(err);
					next();
				});
		}
	}, cb);
}