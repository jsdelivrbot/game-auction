import loginTpl from './login.html!text';

// Login component's controller
class LoginCtrl {
	constructor($rootScope, AUTH_EVENTS, user, auth) {
		this.$rootScope = $rootScope;
		this.AUTH_EVENTS = AUTH_EVENTS;
		this.user = user;
		this.auth = auth;
	}

	login() {
		this.user.login(this.user.username)
			.then(() => {
				this.$rootScope.$broadcast(this.AUTH_EVENTS.loginSuccess);
			})
			.catch((err) => {
				this.$rootScope.$broadcast(this.AUTH_EVENTS.loginFailed, err);
			});
	}
}

export default {
	controller: ['$rootScope', 'AUTH_EVENTS', 'user', 'auth', LoginCtrl],
	template: loginTpl
}