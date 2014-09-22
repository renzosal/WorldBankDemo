(function () {
	'use strict';

	angular
		.module('worldBank')
		.factory('httpInterceptor', httpInterceptor);

	httpInterceptor.$inject = ['$q', 'CONFIG'];

	function httpInterceptor($q, CONFIG) {
		var jsonpIncrement = 0;
		var interceptor = {
			request: request,
			response: response
		};

		return interceptor;

		function request (requestConfig) {
			if(requestConfig.url.indexOf(CONFIG.apiBaseUrl) != -1){
				var separator = requestConfig.url.indexOf('?') === -1 ? '?' : '&';
				requestConfig.url += separator + 'format=jsonP&prefix=JSON_CALLBACK';
				requestConfig.cache = true;
				jsonpIncrement = jsonpIncrement + 1;
			}
			return requestConfig || $q.when(requestConfig);
		}

		function response(response) {
			return response || $q.when(response);
		}

	}

})();