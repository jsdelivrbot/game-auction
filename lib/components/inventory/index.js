'use strict';

exports.initRest = (app) => {
	// Inventory component main route path
	app.use('/api', require('./router.js')());
};
