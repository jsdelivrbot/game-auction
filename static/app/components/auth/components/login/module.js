// Export module ns
export default name = 'app.auth.login';

import angular from 'angular';

import authLogin from './component';

angular.module(name, [])
	.component('authLogin', authLogin);