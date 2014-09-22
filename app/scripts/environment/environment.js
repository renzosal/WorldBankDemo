(function () {
	'use strict';

	angular
		.module('worldBank')
		.controller('EnvironmentController', environmentController);

	environmentController.$inject = [ 'EnvironmentHelper', 'EnergyUseKt', 'topicInfo'];

	function environmentController(EnvironmentHelper, EnergyUseKt, topicInfo) {
		var vm = this; 

		//View Model
		vm.years = EnvironmentHelper.yearsList;
		vm.selectedYear = vm.years[0];

		vm.indicators = EnvironmentHelper.indicators;
		vm.selectedIndicator = vm.indicators[0].method;
		vm.mapHoverLabelFormat = vm.indicators[0].labelFormat;

		vm.gridData = EnergyUseKt;
		vm.topicInfo = topicInfo;
		vm.mapData = 	_generateMapData(EnergyUseKt);

    vm.environmentMap = {
      map: 'world_en',
      backgroundColor: 'transparent',
      color: '#f5f5f5',
      hoverOpacity: 0.7,
      selectedColor: '#1880c4',
      enableZoom: true,
      showTooltip: true,
      values:vm.mapData,
      scaleColors: ['#C3F4C5', '#0A8005'],
      normalizeFunction: 'polynomial',
      onLabelShow: function (event, label, code){
      	label[0].innerHTML += EnvironmentHelper.generateMapHoverLabel(vm.mapHoverLabelFormat, code, vm.mapData);
      }

    };

    vm.worldLineChartData = {
      labels : vm.years,
      datasets : [
        {
          fillColor : "rgba(220,220,220,0.5)",
          strokeColor : "rgba(220,220,220,1)",
          pointColor : "rgba(220,220,220,1)",
          pointStrokeColor : "#fff",
          data : [65,59,90,81]
        }
      ]
    };

    //View Model functions
    vm.getIndicatorData = _getIndicatorData;

    //Functions

		function _generateMapData (collection) {
			var mapData = {};
			_.each(collection, function (country) {
				mapData[country.id.toLowerCase()] = country.value;
			});
			return mapData;
		}

		function _getIndicatorData (methodName) {
			vm.selectedIndicator = methodName;
			vm.mapHoverLabelFormat = _.find(vm.indicators, function(ind) {return ind.method === methodName })
																.labelFormat;

			EnvironmentHelper.getIndicatorDataByYear(vm.selectedYear, methodName).then(function (data) {
				vm.gridData = data;
      	vm.environmentMap.values = vm.mapData = _generateMapData(data);
			});
		}

	}

})();