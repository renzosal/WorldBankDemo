(function () {
	'use strict';

	angular
		.module('worldBank')
		.factory('UrbanHelper', urbanHelper);

	urbanHelper.$inject = ['UrbanService'];

	function urbanHelper(UrbanService) {

		var helper = {
			yearsList : [2013,2012,2011,2010,2009],
			indicators: [
	      {	name:'Urban population (% of total)', 
	      	method: 'getAllUrbanPopPercentageByYear',
	      	labelFormat: '#value#% of total' 
	      },
	      {	name:'Population in the largest city (% of urban population)', 
	      	method: 'getAllLargestCityPopByYear',
	      	labelFormat: '#value#% of urban pop.'
	      },
	      {	name:'Improved sanitation facilities, urban (% of urban population with access)', 
	      	method: 'getAllSanitationAccessByYear',
	      	labelFormat: '$#value#% of urban pop.'
	      },
	      {	name:'Improved water source, urban (% of urban population with access)', 
	      	method: 'getAllWaterAccessByYear',
	      	labelFormat: '$#value#% of urban pop.'
	      }
	    ],
			getIndicatorDataByYear: _getIndicatorDataByYear,
			generateMapHoverLabel: _generateMapHoverLabel
		};

		return helper;

		function _getIndicatorDataByYear(year, methodName){
			if(typeof UrbanService[methodName] == 'function'){
				return UrbanService[methodName](year);
			}else{
				throw new Error('UrbanService does not have method: ' + methodName);
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