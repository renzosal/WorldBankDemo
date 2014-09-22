(function () {
	'use strict';

	angular
	.module('worldBank')
	.factory('UrbanResolver', urbanResolver);

	urbanResolver.$inject = ['$q', 'WorldBankService', 'UrbanService', 'TOPICS'];

	function urbanResolver($q, WorldBankService, UrbanService, TOPICS) {


		var data = {
			urbanPopulation: _urbanPopulation,
			topicInfo: _topicInfo
		};

		return data;


		function _urbanPopulation() {
			return UrbanService.getAllUrbanPopPercentageByYear(2013)
        .then(function(data) { return data; });
		}

		function _topicInfo (){
			return WorldBankService.getTopicDescription(TOPICS.Urban)
        .then(function(data) { return data; });
		}
	}

})();