// Export module ns
export default name = 'app.auth.logout';

import angular from 'angular';

import authLogout from './component';

angular.module(name, [])
	.component('authLogout', authLogout);