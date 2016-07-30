// Dashboard component's controller
export default class {
	constructor(userId, socket) {
		this.userId = userId;
		this.socket = socket;

		this._init();
	}

	_init() {
		this.socket.connect();
	}
}