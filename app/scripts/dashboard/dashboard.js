(function () {
  'use strict';

  angular
    .module('worldBank')
    .controller('DashboardController', dashboardController);

    dashboardController.$inject = ['countries', 'DashboardHelper','worldEconomy',
      'worldEducation','worldHealth','worldEnvironment','worldUrbanDev'];

    function dashboardController(countries, DashboardHelper,worldEconomy,worldEducation,
                                worldHealth, worldEnvironment, worldUrbanDev) {

      var vm = this;

      vm.years = DashboardHelper.years;
      vm.countries = countries;
      //Tiles
      vm.economyTile = worldEconomy[0];
      vm.educationTile = worldEducation[0];
      vm.healthTile = worldHealth[0];
      vm.environmentTile = worldEnvironment[0];
      vm.urbanDevTile = worldUrbanDev[0];
      vm.getCountryOverview = _getCountryOverview;

      vm.mapSettings = {   
      showTooltip: true,
      enableZoom: true,   
        onRegionClick: function(element, code, region){
          vm.selectedCountry = DashboardHelper.getSelectedCountry(countries, code);
          vm.countrySearch = vm.selectedCountry.name;
          vm.getCountryOverview()
        }
      };



      function _getCountryOverview() {
        DashboardHelper.getCountryOverview(vm.selectedYear, vm.selectedCountry).then(function(data){
          vm.economyTile = data.economy[0];
          vm.educationTile = data.education[0];
          vm.healthTile = data.health[0];
          vm.environmentTile = data.environment[0];
          vm.urbanDevTile = data.urbanDev[0];
        });
      }
    }

})();