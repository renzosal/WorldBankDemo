(function () {
	'use strict';

	angular
		.module('worldBank')
		.factory('HealthHelper', healthHelper);

	healthHelper.$inject = ['HealthService'];

	function healthHelper(HealthService) {

    var actualYear = new Date().getFullYear();
    var finalYear = 2006;
    var rangeYears = [];
    for(var i = actualYear; i>finalYear; i--) {
      rangeYears.push(i);
    }

		var helper = {
			yearsList : rangeYears, 
			indicators: [
	      {	name:'Life expectancy at birth, total (years)', 
	      	method: 'getAllLifeExpectancyByYear',
	      	labelFormat: '#value# years' 
	      },
	      {	name:'Fertility rate, total (births per woman)', 
	      	method: 'getAllFertilityRateByYear',
	      	labelFormat: '#value# births per woman'
	      },
	      {	name:'Health expenditure per capita (current US$)', 
	      	method: 'getAllHealthExpenditureByYear',
	      	labelFormat: '$#value# '
	      }
	    ],
			getIndicatorDataByYear: _getIndicatorDataByYear,
			generateMapHoverLabel: _generateMapHoverLabel
		};

		return helper;

		function _getIndicatorDataByYear(year, methodName){
			if(typeof HealthService[methodName] == 'function'){
				return HealthService[methodName](year);
			}else{
				throw new Error('HealthService does not have method: ' + methodName);
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
