import logoutTpl from './logout.html!text';

// Logout component's controller
class LogputCtrl {
	constructor($rootScope, AUTH_EVENTS, user, auth) {
		this.$rootScope = $rootScope;
		this.AUTH_EVENTS = AUTH_EVENTS;
		this.user = user;
		this.auth = auth;
	}

	logout() {
		if (this.auth.isAuthenticated()) {
			this.user.logout()
				.then(() => {
					this.auth.logout && this.auth.logout();
					this.$rootScope.$broadcast(this.AUTH_EVENTS.logoutSuccess);
				})
				.catch((err) => {
					this.auth.logout && this.auth.logout();
					this.$rootScope.$broadcast(this.AUTH_EVENTS.forbidden, err);
				});
		} else {
			this.$rootScope.$broadcast(this.AUTH_EVENTS.logoutSuccess);
		}
	}
}

export default {
	controller: ['$rootScope', 'AUTH_EVENTS', 'user', 'auth', LogputCtrl],
	template: logoutTpl
}