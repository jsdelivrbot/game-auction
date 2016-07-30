// Auth. token service
export default class {
	constructor($window, storage, __env) {
		this.$window = $window;
		this.storage = storage;
		this.__env = __env;
	}

	logout() {
		this.deleteToken();
	}

	getAuthHeader() {
		return {
			Authorization: 'Bearer ' + this.getToken()
		}
	}

	deleteToken() {
		delete this.storage['jwtToken'];
	}

	parseJwt(token) {
		let base64Url = token.split('.')[1];
		let base64 = base64Url.replace('-', '+').replace('_', '/');
		return JSON.parse(this.$window.atob(base64));
	}

	saveToken(token) {
		this.storage['jwtToken'] = token;
	}

	getToken() {
		return this.storage['jwtToken'];
	}

	getTokenProp(prop) {
		let token = this.getToken();
		if (token) {
			let params = this.parseJwt(token);
			return params[prop];
		} else {
			return null;
		}
	}

	isAuthenticated() {
		let exp = this.getTokenProp('exp');
		if (exp) {
			return Math.round(new Date().getTime() / 1000) <= exp;
		} else {
			return false;
		}
	}
}