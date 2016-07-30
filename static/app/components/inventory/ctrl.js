// Inventory component's controller

import dialogTpl from './dialog.html!text';

export default class {
	constructor($scope, $timeout, service, auction, $mdDialog) {
		this.service = service;
		this.auction = auction;
		this.$mdDialog = $mdDialog;
		this.$scope = $scope;
		this.$timeout = $timeout;

		this._init();
	}

	_init() {
		this._getInventory();

		// Update player's inventory on auction completed
		this.$scope.$on('auctionCompleted', function() {
			this.$timeout(function() {
				this._getInventory();
			}.bind(this));
		}.bind(this));
	}

	// Get player's inventory
	_getInventory() {
		this.service.getInventory(this.userId, this.playerId)
			.then((result) => this.inventory = result)
			.catch(() => this.inventory = null);
	}

	// Show dialog for inserting the new auction qty and min price coins
	startAuction(item) {
		this.$mdDialog.show({
				controller: ['$scope', '$mdDialog', ($scope, $mdDialog) => {
					$scope.data = {};
					$scope.item = item;

					$scope.hide = function() {
						$mdDialog.hide();
					};

					$scope.cancel = function() {
						$mdDialog.cancel();
					};

					$scope.start = function() {
						$mdDialog.hide($scope.data);
					}
				}],
				template: dialogTpl,
				clickOutsideToClose: true
			})
			.then((data) => {
				if (isNaN(data.qty) ||
					isNaN(data.minPrice) ||
					parseFloat(data.qty) <= 0 ||
					parseFloat(data.minPrice) <= 0) {
					this.$scope.$emit('error', 'Wrong value!');
				} else {
					this.auction.start(this.userId, this.playerId, item.id, data.qty, data.minPrice)
						.then(() => {
							this.$scope.$emit('message', 'Auction created!');
						});
				}
			});
	}
}