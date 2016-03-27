(function () {
	'use strict';

	angular
		.module('worldBank')
		.factory('EconomyHelper', economyHelper);

	economyHelper.$inject = ['EconomyService'];

	function economyHelper(EconomyService) {

    var actualYear = new Date().getFullYear();
    var finalYear = 2006;
    var rangeYears = [];
    for(var i = actualYear; i>finalYear; i--) {
      rangeYears.push(i);
    }

		var helper = {
			yearsList : rangeYears, 
			indicators: [
				{	name:'GNI per capita, Atlas method (current US$)', 
	      	method: 'getAllGNIPerCapitaByYear',
	      	labelFormat: '$#value# US$' 
	      },
	      {	name:'GDP (current US$)', 
	      	method: 'getAllGDP',
	      	labelFormat: '$#value# US$' 
	      },
	      {	name:'Total reserves (includes gold, current US$)', 
	      	method: 'getAllTotalReserves',
	      	labelFormat: '$#value# US$' 
	      }
	    ],
			getIndicatorDataByYear: _getIndicatorDataByYear,
			generateMapHoverLabel: _generateMapHoverLabel
		};

		return helper;

		function _getIndicatorDataByYear(year, methodName){
			if(typeof EconomyService[methodName] == 'function'){
				return EconomyService[methodName](year);
			}else{
				throw new Error('EconomyService does not have method: ' + methodName);
			}
		}

		function _generateMapHoverLabel (labelFormat, code, mapData){
			var value = mapData[code];
			var label = "";
			if(value !== null){
				label = ': ' + labelFormat.replace("#value#", value);
			}
			return label;
			
		}
	}

})();
