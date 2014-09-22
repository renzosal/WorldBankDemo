(function () {
	'use strict';

	angular
	.module('worldBank')
	.factory('EconomyResolver', economyResolver);

	economyResolver.$inject = ['$q', 'WorldBankService', 'EconomyService', 'TOPICS'];

	function economyResolver($q, WorldBankService, EconomyService, TOPICS) {


		var data = {
			GNPPerCapita: _GNPPerCapita,
			GNPPerCapitaWorld: _GNPPerCapitaWorld,
			topicInfo: _topicInfo
		};

		return data;


		function _GNPPerCapita() {
			return EconomyService.getAllGNIPerCapitaByYear(2013)
        .then(function(data) { return data; });
		}

		function _GNPPerCapitaWorld() {
			console.log("test");
			return EconomyService.getAllGNIPerCapitaByYear('2003:2013','1W')
        .then(function(data) { return data; });	
		}

		function _topicInfo (){
			return WorldBankService.getTopicDescription(TOPICS.Economy)
        .then(function(data) { return data; });
		}
	}

})();