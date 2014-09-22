(function () {
	'use strict';

	angular
		.module('worldBank')
		.factory('HealthService', healthService);

		healthService.$inject = ['$http', '$q', 'CONFIG'];

		function healthService ($http, $q, CONFIG) {

			var service = {
				//Health
				getAllLifeExpectancyByYear: _getAllLifeExpectancyByYear,
				getAllFertilityRateByYear: _getAllFertilityRateByYear,
				getAllHealthExpenditureByYear: _getAllHealthExpenditureByYear
			};

			return service;

			function _getCountryCode(args){
				return (args.length ===2) ? args[1] : 'all';
			}

			function _getAllHealthExpenditureByYear(year){
				var promise = $http
					.jsonp(CONFIG.apiBaseUrl + 'countries/'+_getCountryCode(arguments)+'/indicators/SH.XPD.PCAP',
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

			function _getAllFertilityRateByYear(year){
				var promise = $http
					.jsonp(CONFIG.apiBaseUrl + 'countries/'+_getCountryCode(arguments)+'/indicators/SP.DYN.TFRT.IN',
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
								value: Math.round(row.value * 10)/10
							});
						});
						return $q.when(countryList);
					});

				return promise;				
			}

			function _getAllLifeExpectancyByYear(year){

				var promise = $http
					.jsonp(CONFIG.apiBaseUrl + 'countries/'+_getCountryCode(arguments)+'/indicators/SP.DYN.LE00.IN',
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
								value: Math.round(row.value * 10)/10
							});
						});
						return $q.when(countryList);
					});

				return promise;
			}

		}

})();