import template from './template.html!text';
import ctrl from './ctrl';

export default {
	bindings: {
		userId: '<',
		playerId: '<'
	},
	template,
	controller: ['$scope', '$timeout', 'inventoryService', 'auctionService', '$mdDialog', ctrl]
}