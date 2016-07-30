export default class {
	constructor($http, $q, API) {
		this.$http = $http;
		this.$q = $q;
		this.API = API;
	}

	// Get player's inventory from the server
	getInventory(userId, playerId) {
		return this.$http.get(`${this.API}/users/${userId}/players/${playerId}/inventory`)
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