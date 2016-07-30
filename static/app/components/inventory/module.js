// Export module ns
export default name = 'app.inventory';

import angular from 'angular';

import component from './component';
import service from './service';

angular.module(name, [])
	.service('inventoryService', ['$http', '$q', 'API', service])
	.component('inventory', component);