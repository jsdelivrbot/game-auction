'use strict';

let Sequelize = require('sequelize');
let fs = require('fs');
let dbInstance = null;
let error = require('debug')('app:error');

exports.init = (config) => {
	let options = {
		host: config.mysql.host,
		dialect: 'mysql'
	};

	if(typeof config.mysql.port !== 'undefined') {
		options.port = config.mysql.port | 0;
	}

	if (process.env.NODE_ENV !== 'development') {
		options.logging = false; //Prevent Sequelize from outputting SQL to the console on execution of query
	}

	let sequelize = new Sequelize(config.mysql.database, config.mysql.user, config.mysql.password, options);

	let db = {};

	// Init Db Schema Models
	fs
  .readdirSync(global.getAppPath('models'))
  .filter(function(file) {
    return (file.indexOf(".") !== 0) && (file !== "index.js");
  })
  .forEach(function(file) {
    let model = sequelize.import(global.joinAppPath('models', file));
    db[model.name] = model;
  });

  // Init models associations
	Object.keys(db).forEach(function(modelName) {
		if ("associate" in db[modelName]) {
			db[modelName].associate(db);
		}
	});

	dbInstance = db;
};

exports.getDb = (() => {
	let instance;

	return () => {
		if (instance) {
			return instance;
		}

		instance = dbInstance;
		return instance;
	}
})();

exports.getModel = (modelName) => {
	let db = exports.getDb();

	if(!db[modelName]) {
		error('Missing model with name: ' + modelName);
	}

	return db[modelName];
}

exports.getAllModels = () => {
	let db = exports.getDb();

	return db;
}