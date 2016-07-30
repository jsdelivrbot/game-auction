// Export module ns
export default name = 'app.dashboard';

import angular from 'angular';
import 'angular-ui-router';

import auction from '../auction/module';
import inventory from '../inventory/module';
import player from '../player/module';
import auth from '../auth/module';

import ctrl from './ctrl';
import template from './template.html!text';

angular.module(name, [auth, auction, inventory, player])
	.config(['$stateProvider', function($stateProvider) {
		// Init dashboard routes
		$stateProvider
			.state('dashboard', {
				abstract: true,
				template: '<ui-view/>',
				controller: ['userId', 'socket', ctrl],
				controllerAs: 'vm',
				url: '/dashboard',
				resolve: {
					userId: ['user', (user) => user.getUserId()]
				}
			})
			.state('dashboard.default', {
				url: '',
				template,
				authenticate: true
			});
	}]);