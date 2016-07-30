// Main http interceptor - fires error event on http error
export default (API, $rootScope) => {
	return {
		request: (config) => {
			return config;
		},
		response: (res) => {
			return res;
		},
		responseError: (response) => {
			if (response.status !== 200 &&
				response.config.url.indexOf(API) !== -1 &&
				response.config.url !== API + '/auctions') {
				$rootScope.$broadcast('error', 'Server error! ' +
					(response.data && response.data.message ? response.data.message : response.statusText));
			}

			return response;
		}
	}
}