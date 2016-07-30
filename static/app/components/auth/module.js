// Export module ns
export default name = 'app.auth';

import angular from 'angular';
import 'ngstorage';

import login from './components/login/module';
import logout from './components/logout/module';
import authInterceptor from './services/authInterceptor';
import userService from './services/userService';
import authService from './services/authService';

angular.module(name, [login, logout, 'ngStorage'])
	.constant('AUTH_EVENTS', {
		loginSuccess: 'auth-login-success',
		loginFailed: 'auth-login-failed',
		logoutSuccess: 'auth-logout-success',
		sessionTimeout: 'auth-session-timeout',
		notAuthenticated: 'auth-not-authenticated',
		forbidden: 'auth-forbidden'
	})
	.config(['$httpProvider', function($httpProvider) {
		$httpProvider.interceptors.push('authInterceptor');
	}])
	.run(['$rootScope', 'AUTH_EVENTS', 'auth', function($rootScope, AUTH_EVENTS, auth) {
		$rootScope.$on('$stateChangeStart', function(event, next) {
			if (next.authenticate) {
				if (!auth.isAuthenticated()) {
					$rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
				}
			}
		});
	}])
	.factory('authInterceptor', ['API', 'API_AUTH', 'auth', '$rootScope', 'AUTH_EVENTS', authInterceptor])
	.service('user', ['$http', 'API_AUTH', 'auth', '$rootScope', 'AUTH_EVENTS', '$q', userService])
	.service('auth', ['$window', '$sessionStorage', '__env', authService]);