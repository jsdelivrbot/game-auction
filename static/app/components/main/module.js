// Main app settings
export default name = 'app';

import angular from 'angular';
import 'angular-ui-router';
import 'angular-material';

import auth from '../auth/module';
import dashboard from '../dashboard/module';
import constants from '../../common/constants/module';
import services from '../../common/services/module';

import './styles.css!';
import tpl from './template.html!text';

import defaultInterceptor from './interceptor';

angular.module(name, ['ui.router', auth, dashboard, constants, services, 'ngMaterial'])
	.config(['$mdThemingProvider', function($mdThemingProvider) {
		$mdThemingProvider.theme("error-toast");
	}])
	.run(['$mdToast', '$rootScope', 'AUTH_EVENTS', 'auth', '$location', function($mdToast, $rootScope, AUTH_EVENTS, auth, $location) {
		// Handle App Events
		$rootScope.$on(AUTH_EVENTS.loginSuccess, function() {
			$rootScope.$evalAsync(function() {
				$location.path('/dashboard');
			});
		});

		$rootScope.$on('message', function(e, msg) {
			$mdToast.show(
				$mdToast.simple()
				.textContent(msg)
				.hideDelay(1500)
			);
		});

		$rootScope.$on('error', function(e, msg) {
			$mdToast.show(
				$mdToast.simple()
				.textContent(msg)
				.hideDelay(1500)
				.theme('error-toast')
			);
		});

		$rootScope.$on('error', function($ev, msg) {
			let errText = 'Error!';
			if (typeof msg === 'string') {
				errText = (typeof msg === 'string' && msg !== '' ? msg : 'App Error');
			} else {
				errText = msg ? msg.message || 'App Error' : 'App Error';
			}

			$mdToast.show(
				$mdToast.simple()
				.textContent(errText)
				.hideDelay(1500)
				.theme('error-toast')
			);
		});

		$rootScope.$on(AUTH_EVENTS.loginFailed, function() {
			$mdToast.show(
				$mdToast.simple()
				.textContent('Login Failed!')
				.hideDelay(1500)
				.theme('error-toast')
			);
		});

		$rootScope.$on(AUTH_EVENTS.logoutSuccess, function() {
			$rootScope.$evalAsync(function() {
				$location.path('/');
			});
		});

		$rootScope.$on(AUTH_EVENTS.notAuthenticated, function() {
			$rootScope.$evalAsync(function() {
				$location.path('/');
			});
		});

		$rootScope.$on(AUTH_EVENTS.forbidden, function() {
			$rootScope.$evalAsync(function() {
				$location.path('/');
			});
		});

		$rootScope.$on(AUTH_EVENTS.notAuthorized, function() {
			$mdToast.show(
				$mdToast.simple()
				.textContent('Not Authorized!')
				.hideDelay(1500)
				.theme('error-toast')
			);
		});
	}])
	.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function($stateProvider, $urlRouterProvider, $locationProvider) {
		$urlRouterProvider.otherwise("/");

		// Add main / route
		$stateProvider
			.state('main', {
				url: "/",
				template: tpl,
				resolve: {
					isAuthenticated: ['$q', 'auth', '$rootScope', '$location', function($q, auth, $rootScope, $location) {
						return $q(function(resolve) {
							var isAuth = auth.isAuthenticated();

							if (isAuth) {
								$rootScope.$evalAsync(function() {
									$location.path('/dashboard');
								});
							} else {
								resolve(isAuth);
							}
						});
					}]
				}
			});

		// Enable HTML5 mode
		$locationProvider.html5Mode({
			enabled: true,
			requireBase: false
		});
	}])
	.factory('defaultInterceptor', ['API', '$rootScope', defaultInterceptor])
	.config(['$httpProvider', function($httpProvider) {
		$httpProvider.interceptors.push('defaultInterceptor');
	}]);