export default class {
	constructor($http, $q, API) {
		this.$http = $http;
		this.$q = $q;
		this.API = API;
	}

	// Get the player from the server
	getPlayer(userId) {
		return this.$http.get(`${this.API}/users/${userId}/players`)
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