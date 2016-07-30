// User's service
export default class {
	constructor($http, API_AUTH, auth, $rootScope, AUTH_EVENTS, $q) {
		this.$http = $http;
		this.$q = $q;
		this.API_AUTH = API_AUTH;
		this.auth = auth;
		this.$rootScope = $rootScope;
		this.AUTH_EVENTS = AUTH_EVENTS;
	}

	// User's login
	login(username) {
		return this.$http.post(this.API_AUTH + '/login', {
				username
			})
			.then((response) => {
				return this.$q((resolve, reject) => {
					if (response.status === 200) {
						resolve();
					} else {
						reject(response.statusText);
					}
				});
			});
	}

	// User's logout
	logout() {
		return this.$http.get(this.API_AUTH + '/logout')
			.then((response) => {
				return this.$q((resolve, reject) => {
					if (response.status === 200) {
						resolve();
					} else {
						reject(response.statusText);
					}
				});
			});
	}

	// User's logout without server's req being called
	silentLogout() {
		this.auth.deleteToken();
		this.$rootScope.$broadcast(this.AUTH_EVENTS.logoutSuccess);
	}

	// On not authenticated error
	onServerError(err) {
		switch (err.status) {
			case 401:
				this.auth.deleteToken();
				this.$rootScope.$broadcast(this.AUTH_EVENTS.notAuthenticated);
				break;
			default:
				this.$rootScope.$broadcast('error', err.message);
		}
	}

	// Get the user's username from the auth. token
	getUserName() {
		return this.auth.getTokenProp('username');
	}

	// Get the user's id from the auth. token
	getUserId() {
		return this.auth.getTokenProp('id');
	}
}