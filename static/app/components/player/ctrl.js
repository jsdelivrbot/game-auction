// Player component's controller
export default class {
	constructor($scope, $timeout, service) {
		this.$timeout = $timeout;
		this.$scope = $scope;
		this.service = service;

		this._init();
	}

	_init() {
		this._getPlayer();

		// Update player's info on auction completed
		this.$scope.$on('auctionCompleted', function() {
			this.$timeout(function () {
				this._getPlayer();
			}.bind(this));
		}.bind(this));
	}

	// Get the player by userId
	_getPlayer() {
		this.service.getPlayer(this.userId)
			.then((result) => this.player = result)
			.catch(() => this.player = null);
	}
}