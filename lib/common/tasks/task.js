'use strict';

let EventEmitter = require('events').EventEmitter;
let debug = require('debug')('app:debug');
let config = require(global.getAppPath('config')).env;

class Task extends EventEmitter {
	constructor(task) {
		super();

		this.task = task;
		this.hrstart = null;
		this.interval = null;
		this.incDuration = config.task_inc_duration;
	}

	// Change the current auction state to running
	run() {
		return new Promise((resolve, reject) => {
			switch (this.task.status) {
				case 'pending':
					this.task.setRunning()
						.then(() => {
							this._action().then(resolve, reject);
						})
						.catch(reject);
					break;
				case 'running':
					this._action().then(resolve, reject);
					break;
			}
		});
	}

	// Update auction's exp. time with 10 seconds
	updated() {
		let hrend = process.hrtime(this.hrstart);

		if (hrend[0] > this.duration - this.incDuration) {
			this.duration += (this.incDuration + 1 - (this.duration - hrend[0]));
		}
	}

	// Run the current auction
	_action() {
		return new Promise((resolve, reject) => {
			this.duration = config.task_duration;
			this.emit('taskStarted');

			this.hrstart = process.hrtime();

			this.interval = setInterval(() => {
				let hrend = process.hrtime(this.hrstart);

				// Notify the clients for the auction's remaining time
				this._progress();

				// Check is auction time remaining
				if (hrend[0] >= this.duration) {
					clearInterval(this.interval);
					this._complete(resolve, reject);
				}
			}, 1000);
		});
	}

	// Change the current auction state to completed and started stored procedure updates the results from the auction
	_complete(resolve, reject) {
		debug('Task completed');

		this.task.setCompleted()
			.then(() => {
				this.emit('taskCompleted');
				resolve();
			})
			.catch(reject);
	}

	// Notify the clients for the auction's remaining time
	_progress() {
		if (this.task.status === 'running') {
			if (this.hrstart) {
				let hrend = process.hrtime(this.hrstart);

				this.emit('data', {
					time_left: this.duration - hrend[0]
				});
			}
		}
	}
}

module.exports.create = (task) => new Task(task);