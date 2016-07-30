'use strict';

let path = require('path');

let fs = require('fs');
let error = require('debug')('app:error');
let errors = require(global.getAppPath('errors'));

module.exports.initRest = (app, taskRunner) => {
	initComponents('Rest', [app, taskRunner]);

	// Default route
	app.all('*', (req, res, next) => {
		next(new errors.NotFound());
	});

	// Default error handler
	app.use(function(err, req, res) {
		error(typeof err.stack !== 'undefined' ? err.stack : err);
		if (err.status === 404 ||
			err.status === 500) {
			if (err.status === 500) {
				return res.status(err.status).send({
					message: err.code
				});
			}

			return res.sendStatus(err.status);
		}

		res.sendStatus(500);
	});
};

module.exports.initWs = (ws) => {
	initComponents('Ws', [ws]);
};

// Initialize all components routes
function initComponents(type, params) {
	let dirs = getDirectoriesSync('./').sort((a, b) => a - b);

	dirs.forEach((dir) => {
		let component = null;
		try {
			component = require(`./${dir}`);
		} catch (e) {
			error(e);
		}

		if (component && component[`init${type}`]) {
			component[`init${type}`].apply(null, params);
		}
	});
}

function getDirectoriesSync(srcpath) {
	return fs.readdirSync(path.resolve(__dirname, srcpath)).filter((file) => {
		return fs.statSync(path.resolve(__dirname, file)).isDirectory();
	});
}