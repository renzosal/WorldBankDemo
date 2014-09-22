(function () {
	'use strict';

	angular
		.module('worldBank')
		.factory('EnvironmentService', environmentService);

		environmentService.$inject = ['$http', '$q', 'CONFIG'];

		function environmentService ($http, $q, CONFIG) {

			var service = {
				//Environment
				getAllCO2perCapitaByYear: _getAllCO2perCapitaByYear,
				getAllForestAreaKmByYear: _getAllForestAreaKmByYear,
				getAllAccessElectricityByYear: _getAllAccessElectricityByYear,
				getAllEnergyUseKtByYear: _getAllEnergyUseKtByYear,
				getAllEnergyProdKtByYear: _getAllEnergyProdKtByYear
			};

			return service;

			function _getCountryCode(args){
				return (args.length ===2) ? args[1] : 'all';
			}

			function _getAllEnergyProdKtByYear(year){
				var promise = $http
					.jsonp(CONFIG.apiBaseUrl + 'countries/'+_getCountryCode(arguments)+'/indicators/EG.EGY.PROD.KT.OE',
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

			function _getAllEnergyUseKtByYear(year){

				var promise = $http
					.jsonp(CONFIG.apiBaseUrl + 'countries/'+_getCountryCode(arguments)+'/indicators/EG.USE.COMM.KT.OE',
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

			function _getAllAccessElectricityByYear(year){

				var promise = $http
					.jsonp(CONFIG.apiBaseUrl + 'countries/'+_getCountryCode(arguments)+'/indicators/EG.ELC.ACCS.ZS',
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

			function _getAllForestAreaKmByYear(year){

				var promise = $http
					.jsonp(CONFIG.apiBaseUrl + 'countries/'+_getCountryCode(arguments)+'/indicators/AG.LND.FRST.K2',
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

			function _getAllCO2perCapitaByYear(year){

				var promise = $http
					.jsonp(CONFIG.apiBaseUrl + 'countries/'+_getCountryCode(arguments)+'/indicators/EN.ATM.CO2E.PC',
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