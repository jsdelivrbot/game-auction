//Auction's service
export default class {
	constructor($http, $q, API) {
		this.$http = $http;
		this.$q = $q;
		this.API = API;
	}

	// Create new auction
	start(userId, playerId, inventoryId, qty, minPrice) {
		return this.$http.post(`${this.API}/users/${userId}/players/${playerId}/auctions`, {
			inventoryId,
			qty,
			minPrice
		})
			.then((response) => {
				return this.$q((resolve, reject) => {
					if (response.status === 200) {
						resolve(response.data);
					} else {
						reject(response.statusText);
					}
				});
			});
	}

	// Get the current auction from server
	getCurrentAuction() {
		return this.$http.get(`${this.API}/auctions`)
			.then((response) => {
				return this.$q((resolve, reject) => {
					if (response.status === 200) {
						resolve(response.data);
					} else {
						reject(response.statusText);
					}
				});
			});
	}

	// Place new bid
	placeBid(playerId, auctionId, bid) {
		return this.$http.patch(`${this.API}/auctions/${auctionId}`, {
			player_id: playerId,
			coins: bid
		})
			.then((response) => {
				return this.$q((resolve, reject) => {
					if (response.status === 200) {
						resolve(response.data);
					} else {
						reject(response.statusText);
					}
				});
			});
	}
}