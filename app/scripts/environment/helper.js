(function () {
	'use strict';

	angular
		.module('worldBank')
		.factory('EnvironmentHelper', environmentHelper);

	environmentHelper.$inject = ['EnvironmentService'];

	function environmentHelper(EnvironmentService) {

		var helper = {
			yearsList : [2011,2010,2009,2008, 2007],
			indicators: [
				{	name:'Energy Use (kt of oil equivalent)', 
	      	method: 'getAllEnergyUseKtByYear',
	      	labelFormat: '#value# kt of oil equivalent' 
	      },
	      {	name:'Energy Production (kt of oil equivalent)', 
	      	method: 'getAllEnergyProdKtByYear',
	      	labelFormat: '#value# kt of oil equivalent' 
	      },
	      {	name:'Forest area (sq. km)', 
	      	method: 'getAllForestAreaKmByYear',
	      	labelFormat: '#value#  sq. km' 
	      },
	      {	name:'Access to electricity (% of pop.)', 
	      	method: 'getAllAccessElectricityByYear',
	      	labelFormat: '#value# % of population'
	      }
	    ],
			getIndicatorDataByYear: _getIndicatorDataByYear,
			generateMapHoverLabel: _generateMapHoverLabel
		};

		return helper;

		function _getIndicatorDataByYear(year, methodName){
			if(typeof EnvironmentService[methodName] == 'function'){
				return EnvironmentService[methodName](year);
			}else{
				throw new Error('EnvironmentService does not have method: ' + methodName);
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