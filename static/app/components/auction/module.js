// Auction's module
export default name = 'app.auction';

import angular from 'angular';

import component from './component';
import service from './service';

angular.module(name, [])
	.service('auctionService', ['$http', '$q', 'API', service])
	.component('auction', component);