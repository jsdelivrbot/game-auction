// Export module ns
export default name = 'app.constants';

import angular from 'angular';

var __env = {};

// Import variables if present (from env.js)
if (window) {
	Object.assign(__env, window.__env);
}

angular.module(name, [])
	// API url
	.constant('__env', __env)
	.constant('API', __env.apiUrl)
	.constant('API_AUTH', __env.apiAuthUrl);