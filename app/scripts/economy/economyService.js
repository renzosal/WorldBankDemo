(function () {
	'use strict';

	angular
		.module('worldBank')
		.factory('EconomyService', economyService);

		economyService.$inject = ['$http', '$q', 'CONFIG'];

		function economyService ($http, $q, CONFIG) {

			var service = {

				//Economy
				getAllGDP: _getAllGDP,
				getAllGNIPerCapitaByYear: _getAllGNIPerCapitaByYear,
				getAllTotalReserves: _getAllTotalReserves
			};

			return service;

			function _getCountryCode(args){
				return (args.length ===2) ? args[1] : 'all';
			}

			function _getAllGDP(year){

				var promise = $http
					.jsonp(CONFIG.apiBaseUrl + 'countries/'+ _getCountryCode(arguments) +'/indicators/NY.GDP.MKTP.CD',
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
								value: row.value
							});
						});
						return $q.when(countryList);
					});

				return promise;					
			}

			function _getAllTotalReserves(year){

				var promise = $http
					.jsonp(CONFIG.apiBaseUrl + 'countries/'+_getCountryCode(arguments)+'/indicators/FI.RES.TOTL.CD',
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

			function _getAllGNIPerCapitaByYear(year){

				var promise = $http
					.jsonp(CONFIG.apiBaseUrl + 'countries/'+ _getCountryCode(arguments) +'/indicators/NY.GNP.PCAP.CD',
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