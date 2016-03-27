(function () {
	'use strict';

	angular
		.module('worldBank')
		.factory('DashboardHelper', dashboardHelper);

	dashboardHelper.$inject = ['$q','EducationService', 'EconomyService', 'HealthService', 'EnvironmentService', 'UrbanService'];

	function dashboardHelper($q,EducationService, EconomyService, HealthService, EnvironmentService, UrbanService) {

		var $q = $q;

    var actualYear = new Date().getFullYear();
    var finalYear = 2006;
    var rangeYears = [];
    for(var i = actualYear; i>finalYear; i--) {
      rangeYears.push(i);
    }

		var helper = {
			years : rangeYears, 
			getCountryOverview: _getCountryOverview,
			getSelectedCountry: _getSelectedCountry
		};

		return helper;

		function _getSelectedCountry(countries, code){
			var matchFound =  _.find(countries, function (country) {
				return country.id === code.toUpperCase();
			});

			return matchFound;
		}

		function _getCountryOverview(year, country){
			var countryCode = '1W';
			if(typeof country !== 'undefined' && country !== null){
				countryCode = country.id;
			}

			return $q.all({
					economy: EconomyService.getAllGDP(year, countryCode),
					education: EducationService.getAllSchoolEnrollPrimaryByYear(year, countryCode),
					health: HealthService.getAllLifeExpectancyByYear(year,countryCode),
					environment: EnvironmentService.getAllEnergyUseKtByYear(year,countryCode),
					urbanDev: UrbanService.getAllUrbanPopPercentageByYear(year,countryCode)
				}).then(function (data){
					return data;
				});
		}

	}

})();
