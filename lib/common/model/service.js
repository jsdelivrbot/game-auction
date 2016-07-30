'use strict';

let _ = require('lodash');
let NotFoundError = require(global.getAppPath('errors')).NotFound;
let EventEmitter = require('events');

// Base class for components' services
module.exports = class ModelService extends EventEmitter  {
	constructor(model) {
		super();

		this.model = model;
		this.associations = [];
	}

	// Get model's item from db
	get(options, exclude, getInstance) {
		options = options || {};

		// Include associations if exists
		let includes = this._getAssociationsIncludes('details', exclude);
		if (includes && includes.length) {
			options.include = includes;
		}

		return this.model.findOne(options)
			.then((instance) => {
				if (instance) {
					if(getInstance) {
						return instance;
					}

					return instance.get({
						plain: true
					});
				} else {
					throw new NotFoundError();
				}
			});
	}

	// Get all model's item from db
	getAll(options, exclude) {
		options = options || {};

		// Include associations if exists
		let includes = this._getAssociationsIncludes('views', exclude);
		if (includes && includes.length) {
			options.include = includes;
		}

		return this.model.findAll(options);
	}

	create(data) {
		return this.model.create(data, this.model);
	}

	// Add associations for the main service's model
	addAssociations(associations) {
		if (_.isArray(associations)) {
			this.associations = this.associations.concat(associations);
		} else {
			this.associations.push(associations);
		}
	}

	_getAssociationsIncludes(type, exclude) {
		if (!this.associations) {
			return null;
		}

		let include = null;

		_.each(this.associations, (association) => {
			if (association[type] && (!exclude || exclude.indexOf(association[type].model.name) === -1)) {
				if (!include) {
					include = [];
				}

				include.push(association[type]);
			}
		});

		return include;
	}
}