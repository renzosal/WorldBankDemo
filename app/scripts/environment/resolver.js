(function () {
	'use strict';

	angular
	.module('worldBank')
	.factory('EnvironmentResolver', environmentResolver);

	environmentResolver.$inject = ['$q', 'WorldBankService', 'EnvironmentService', 'TOPICS'];

	function environmentResolver($q, WorldBankService, EnvironmentService, TOPICS) {


		var data = {
			EnergyUseKt: _EnergyUseKt,
			topicInfo: _topicInfo
		};

		return data;


		function _EnergyUseKt() {
			return EnvironmentService.getAllEnergyUseKtByYear(2011)
        .then(function(data) { return data; });
		}

		function _topicInfo (){
			return WorldBankService.getTopicDescription(TOPICS.Environment)
        .then(function(data) { return data; });
		}
	}

})();