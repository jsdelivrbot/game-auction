'use strict';

exports.initRest = (app) => {
	// Player component main route path
	app.use('/api', require('./router.js')());
};
