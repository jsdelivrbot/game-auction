'use strict';

var express = require('express');
let debug = require('debug')('app:debug');

let config = require(global.getAppPath('config'));

// Create http server
class RestAdaptor {
    constructor(taskRunner) {
        this.app = express();
        this.taskRunner = taskRunner;

        this._init();
    }

    _init() {
        config.express.init(this.app);

        // Init app components routes endpoints
        require(global.getAppPath('components')).initRest(this.app, this.taskRunner);
    }

    listen() {
        return this.app.listen(config.env.port, function() {
            debug('Server started at port: ' + config.env.port);
        });
    }
}

exports.create = (taskRunner) => new RestAdaptor(taskRunner);