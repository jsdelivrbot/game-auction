'use strict';

let response = require(global.getAppPath('common/utils/response.js'));
let errors = require(global.getAppPath('errors'));

// Base class for components' controllers
module.exports = class ModelCtrl {
	constructor(service) {
		this.service = service;
		this.response = response;
		this.errors = errors;
	}

	get(options, req, res, next) {
		return this.service.get(options)
			.then(this.response._handleResponse(req, res, next, false))
			.catch(this.response._handleError(req, res, next));
	}

	getAll(options, req, res, next) {
		return this.service.getAll(options)
			.then(this.response._handleResponse(req, res, next, false))
			.catch(this.response._handleError(req, res, next));
	}

	create(data, req, res, next) {
		return this.service.create(data)
			.then(this.response._handleResponse(req, res, next, false))
			.catch(this.response._handleError(req, res, next));
	}
}