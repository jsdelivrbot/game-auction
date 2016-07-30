// Auth. http interceptor - sends auth. token with every http request
export default (API, API_AUTH, auth, $rootScope, AUTH_EVENTS) => {
	return {
		request: (config) => {
			var token = auth.getToken();

			if ((config.url.indexOf(API) !== -1 ||
				config.url.indexOf(API_AUTH + '/logout') !== -1) && token) {
				config.headers.Authorization = 'Bearer ' + token;
			}

			return config;
		},
		response: (res) => {
			if (res.config.url.indexOf(API_AUTH + '/login') !== -1 && res.data.token) {
				auth.saveToken(res.data.token);
			}

			return res;
		},
		responseError: (response) => {
			if (response.status === 401 || response.status === 403) {
				auth.deleteToken();
				$rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
			}

			return response;
		}
	}
}