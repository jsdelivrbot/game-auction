// Auction's component
import template from './template.html!text';
import ctrl from './ctrl';

export default {
	bindings: {
		userId: '<',
		playerId: '<'
	},
	template,
	controller: ['$scope', 'auctionService', '$timeout', ctrl]
}