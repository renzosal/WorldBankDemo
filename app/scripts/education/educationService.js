(function () {
	'use strict';

	angular
		.module('worldBank')
		.factory('EducationService', educationService);

		educationService.$inject = ['$http', '$q', 'CONFIG'];

		function educationService ($http, $q, CONFIG) {

			var service = {
				//Education
				getAllSchoolEnrollPrimaryByYear: _getAllSchoolEnrollPrimaryByYear,
				getAllSchoolEnrollSecondaryByYear: _getAllSchoolEnrollSecondaryByYear,
				getAllPupilTeacherRatioPrimaryByYear: _getAllPupilTeacherRatioPrimaryByYear,
				getAllOutOfSchoolFemaleByYear: _getAllOutOfSchoolFemaleByYear,
				getAllOutOfSchoolMaleByYear: _getAllOutOfSchoolMaleByYear
			};

			return service;

			function _getCountryCode(args){
				return (args.length ===2) ? args[1] : 'all';
			}

			function _getAllOutOfSchoolMaleByYear(year){

				var promise = $http
					.jsonp(CONFIG.apiBaseUrl + 'countries/'+_getCountryCode(arguments)+'/indicators/SE.PRM.UNER.MA',
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

			function _getAllOutOfSchoolFemaleByYear(year){

				var promise = $http
					.jsonp(CONFIG.apiBaseUrl + 'countries/'+_getCountryCode(arguments)+'/indicators/SE.PRM.UNER.FE',
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

			function _getAllPupilTeacherRatioPrimaryByYear(year){

				var promise = $http
					.jsonp(CONFIG.apiBaseUrl + 'countries/'+_getCountryCode(arguments)+'/indicators/SE.PRM.ENRL.TC.ZS',
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

			function _getAllSchoolEnrollSecondaryByYear(year){

				var promise = $http
					.jsonp(CONFIG.apiBaseUrl + 'countries/'+_getCountryCode(arguments)+'/indicators/SE.SEC.ENRR',
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

			function _getAllSchoolEnrollPrimaryByYear(year){

				var promise = $http
					.jsonp(CONFIG.apiBaseUrl + 'countries/'+_getCountryCode(arguments)+'/indicators/SE.PRM.ENRR',
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