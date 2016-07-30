// Export module ns
export default name = 'app.services';

import angular from 'angular';

import socket from './socket';

angular.module(name, [])
	.service('socket', ['$rootScope', 'user', 'auth', socket]);