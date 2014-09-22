(function () {
	'use strict';

	angular
		.module('worldBank')
		.factory('WorldBankService', worldBankService);

		worldBankService.$inject = ['$http', '$q', 'CONFIG'];

		function worldBankService ($http, $q, CONFIG) {

			var service = {
				//Common
				getCountries: _getCountries,
				getTopicDescription: _getTopicDescription
			};

			return service;

			function _getTopicDescription(topicId){

				var promise = $http
					.jsonp(CONFIG.apiBaseUrl + 'topic/' + topicId,
					{
						params: {
							per_page: 260
						}
					})
					.then(function(response){
						var topicData = {
							id: response.data[1][0].id,
							name: response.data[1][0].value,
							description: response.data[1][0].sourceNote
						};
						return $q.when(topicData);
					});

				return promise;				
			}

			function _getCountries(){

				var promise = $http
				.jsonp(CONFIG.apiBaseUrl + '/countries/all',
				{
					params: {
						per_page: 262
					}
				})
				.then(function(response){

					var countryList = [];
					_.each(response.data[1], function (country) {
						countryList.push({
							id: country.iso2Code,
							name: country.name,
							long: country.longitude,
							lat: country.latitude
							});
					});
					return $q.when(countryList);
				});

				return promise;

			}


		}

})();