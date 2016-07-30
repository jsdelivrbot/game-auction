// Export module ns
export default name = 'app.player';

import angular from 'angular';

import component from './component';
import service from './service';

angular.module(name, [])
	.service('playerService', ['$http', '$q', 'API', service])
	.component('player', component);