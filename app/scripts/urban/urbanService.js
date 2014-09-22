(function () {
	'use strict';

	angular
		.module('worldBank')
		.factory('UrbanService', urbanService);

		urbanService.$inject = ['$http', '$q', 'CONFIG'];

		function urbanService ($http, $q, CONFIG) {

			var service = {
				//Urban Development
				getAllUrbanPopPercentageByYear: _getAllUrbanPopPercentageByYear,
				getAllLargestCityPopByYear: _getAllLargestCityPopByYear,
				getAllSanitationAccessByYear: _getAllSanitationAccessByYear,
				getAllWaterAccessByYear: _getAllWaterAccessByYear
			};

			return service;

			function _getCountryCode(args){
				return (args.length ===2) ? args[1] : 'all';
			}

			function _getAllWaterAccessByYear(year){

				var promise = $http
					.jsonp(CONFIG.apiBaseUrl + 'countries/'+_getCountryCode(arguments)+'/indicators/SH.H2O.SAFE.UR.ZS',
					{
						params: {
							per_page: 260,
							date: year
						}
					})
					.then(function(response){

						var countryList = [];
						_.each(response.data[1], function (row) {
							countryList.push({
								id: row.country.id,
								name: row.country.value,
								value: Math.floor(row.value)
							});
						});
						return $q.when(countryList);
					});

				return promise;					
			}

			function _getAllSanitationAccessByYear(year){

				var promise = $http
					.jsonp(CONFIG.apiBaseUrl + 'countries/'+_getCountryCode(arguments)+'/indicators/SH.STA.ACSN.UR',
					{
						params: {
							per_page: 260,
							date: year
						}
					})
					.then(function(response){

						var countryList = [];
						_.each(response.data[1], function (row) {
							countryList.push({
								id: row.country.id,
								name: row.country.value,
								value: Math.floor(row.value)
							});
						});
						return $q.when(countryList);
					});

				return promise;					
			}

			function _getAllLargestCityPopByYear(year){

				var promise = $http
					.jsonp(CONFIG.apiBaseUrl + 'countries/'+_getCountryCode(arguments)+'/indicators/EN.URB.LCTY.UR.ZS',
					{
						params: {
							per_page: 260,
							date: year
						}
					})
					.then(function(response){

						var countryList = [];
						_.each(response.data[1], function (row) {
							countryList.push({
								id: row.country.id,
								name: row.country.value,
								value: Math.floor(row.value)
							});
						});
						return $q.when(countryList);
					});

				return promise;					
			}

			function _getAllUrbanPopPercentageByYear(year){

				var promise = $http
					.jsonp(CONFIG.apiBaseUrl + 'countries/'+_getCountryCode(arguments)+'/indicators/SP.URB.TOTL.IN.ZS',
					{
						params: {
							per_page: 260,
							date: year
						}
					})
					.then(function(response){

						var countryList = [];
						_.each(response.data[1], function (row) {
							countryList.push({
								id: row.country.id,
								name: row.country.value,
								value: Math.floor(row.value)
							});
						});
						return $q.when(countryList);
					});

				return promise;					
			}

		}

})();