'use strict';

var EventEmitter = require('events').EventEmitter;

var error = require('debug')('app:error');
var Task = require('./task');
let config = require(global.getAppPath('config')).env;

// This task runner executes the auctions one after another
class TaskRunner extends EventEmitter {
	constructor(service) {
		super();

		this.service = service;
		this.busy = false;
		this.taskObj = null;
	}

	start() {
		if (!this.busy) {
			this.busy = true;

			this.next(0);
		}
	}

	// Run auction
	runTask(task) {
		this.taskObj = Task.create(task);
		this._addEventHandlers(this.taskObj);

		this.taskObj.run()
			.then(() => {
				if (this.taskObj) {
					this._removeEventHandlers(this.taskObj);
				}

				this.next(config.task_wait_duration * 1000);
			})
			.catch((err) => {
				error(err);

				if (this.taskObj) {
					this._removeEventHandlers(this.taskObj);
				}

				this.next(config.task_wait_duration * 1000);
			});
	}

	// Run next auction
	next(time) {
		setTimeout(() => {
			this.service.getNotCompleted()
				.then((task) => {
					this.runTask(task);
				})
				.catch(this._stop.bind(this));
		}, time);
	}

	// Subscribe for task's events
	_addEventHandlers(task) {
		task.on('data', (data) => {
			this.emit('taskUpdated', data);
		});

		task.on('taskStarted', () => {
			this.emit('taskStarted');
		});

		task.on('taskCompleted', () => {
			this.emit('taskCompleted');
		});
	}

	// Update auction's exp. time with 10 seconds
	updated() {
		this.taskObj.updated();
	}

	// Remove task's event listeners on task's completed
	_removeEventHandlers(task) {
		task.removeAllListeners('data');
		task.removeAllListeners('taskStarted');
		task.removeAllListeners('taskCompleted');
	}

	// Stop the runner when all auctions in the queue are completed
	_stop() {
		if (this.taskObj) {
			this._removeEventHandlers(this.taskObj);
		}

		this.taskObj = null;
		this.busy = false;
		this.emit('allTasksCompleted');
	}
}

module.exports.create = (service) => new TaskRunner(service);