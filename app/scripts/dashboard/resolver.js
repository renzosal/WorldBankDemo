(function () {
	'use strict';

	angular
	.module('worldBank')
	.factory('DasboardResolver', dashboardResolver);

	dashboardResolver.$inject = ['$q','WorldBankService', 'EconomyService', 
		'EducationService', 'HealthService', 'EnvironmentService', 'UrbanService'];

	function dashboardResolver($q, WorldBankService, EconomyService, EducationService, 
															HealthService, EnvironmentService, UrbanService) {


		var data = {
			allCountries: _getAllCountries,
			worldEconomy: _worldEconomy,
			worldEducation: _worldEducation,
			worldHealth: _worldHealth,
			worldEnvironment: _worldEnvironment,
			worldUrbanDev: _worldUrbanDev
		};

		return data;


		function _getAllCountries() {
			return WorldBankService.getCountries()
        .then(function(data) { return data; });
		}

		function _worldEconomy() {
			return EconomyService.getAllGDP(2012,'1W')
        .then(function(data) { return data; });
		}

		function _worldEducation() {
			return EducationService.getAllSchoolEnrollPrimaryByYear(2012,'1W')
        .then(function(data) { return data; });
		}

		function _worldHealth() {
			return HealthService.getAllLifeExpectancyByYear(2012,'1W')
        .then(function(data) { return data; });
		}

		function _worldEnvironment() {
			return EnvironmentService.getAllEnergyUseKtByYear(2012,'1W')
        .then(function(data) { return data; });
		}

		function _worldUrbanDev(){
			return UrbanService.getAllUrbanPopPercentageByYear(2012,'1W')
        .then(function(data) { return data; });
		}

	}

})();