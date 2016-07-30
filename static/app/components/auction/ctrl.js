// Auction component's controller
export default class {
	constructor($scope, service, $timeout) {
		this.service = service;
		this.$scope = $scope;
		this.$timeout = $timeout;

		this._init();
	}

	_init() {
		// Get the current auction
		this._getAuction();

		// Updates the current auction exp. time or max bid value
		this.$scope.$on('auctionUpdated', function(e, data) {
			this.$timeout(() => {
				this.auction = Object.assign({}, this.auction, data);
			});
		}.bind(this));

		// Clear the current's auction on completed
		this.$scope.$on('allAuctionsCompleted', function() {
			this.$timeout(() => {
				this.auction = null;
			});
		}.bind(this));

		// Retreive the current auction on new auction being started
		this.$scope.$on('auctionStarted', function() {
			this.$timeout(() => {
				this.auction = null;
				this._getAuction();
			});
		}.bind(this));
	}

	// Retreive the current auction
	_getAuction() {
		this.service.getCurrentAuction()
			.then((result) => this.auction = result)
			.catch(() => this.auction = null);
	}

	// Place new current's auction bid
	placeBid() {
		let bid = parseFloat(this.bid);

		// Bid's value validation
		if (isNaN(this.bid) ||
			bid <= 0 ||
			!this.auction ||
			(typeof this.auction.max_bid !== 'undefined' && bid <= this.auction.max_bid) ||
			(!this.auction.max_bid && bid < this.auction.min_price)) {
			this.$scope.$emit('error', 'Wrong value!');
		} else {
			this.service.placeBid(this.playerId, this.auction.id, this.bid)
				.then(() => {
					this.bid = null;
				});
		}
	}
}