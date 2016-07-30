'use strict';

exports.initRest = (app) => {
	app.use('/', require('./router.js')());
};
