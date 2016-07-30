'use strict';

require('./global.js');

let config = require(global.getAppPath('config'));
// Init Sql db
config.db.init(config.env);

// Create the auctions runner
let auctionService = require(global.getAppPath('components/auction/service.js')).getInstance();
var taskRunner = require('./common/tasks/runner').create(auctionService);

// Init express
let httpServer = require('./adaptors/rest').create(taskRunner);
let app = httpServer.listen();

// Init web sockets
let ws = require('./adaptors/ws').create(app, taskRunner);
ws.init();

// Check if has not completed auctions
taskRunner.start();

module.exports = app;