(function () {
	'use strict';

	angular
	.module('worldBank')
	.factory('HealthResolver', healthResolver);

	healthResolver.$inject = ['$q', 'WorldBankService', 'HealthService', 'TOPICS'];

	function healthResolver($q, WorldBankService, HealthService, TOPICS) {


		var data = {
			lifeExpectancy: _lifeExpectancy,
			topicInfo: _topicInfo
		};

		return data;


		function _lifeExpectancy() {
			return HealthService.getAllLifeExpectancyByYear(2012)
        .then(function(data) { return data; });
		}

		function _topicInfo (){
			return WorldBankService.getTopicDescription(TOPICS.Health)
        .then(function(data) { return data; });
		}
	}

})();