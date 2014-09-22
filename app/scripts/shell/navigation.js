(function () {
  'use strict';

  angular
    .module('worldBank')
    .controller('NavigationController', navigationController);

  navigationController.$inject = ['$location', '$timeout', '$scope'];

  function navigationController ($location, $timeout, $scope) {
    var vm = this;

    vm.selectedItem = {};
    vm.selectedFromNavMenu = false;

    vm.menu = [
        {
            label: 'Dashboard',
            iconClasses: 'fa fa-home',
            url: '#/'
        },
        {
            label: 'Economy & Growth',
            iconClasses: 'fa fa-money',
            url: '#/economy-growth'
        },
        {
            label: 'Education',
            iconClasses: 'fa fa-graduation-cap',
            url: '#/education'
        },
        {
            label: 'Health',
            iconClasses: 'fa fa-ambulance',
            url: '#/health'
        },
        {
            label: 'Environment',
            iconClasses: 'fa fa-tree',
            url: '#/environment'
        },
        {
            label: 'Urban Development',
            iconClasses: 'fa fa-building',
            url: '#/urban-development'
        }
    ];

    vm.findItemByUrl = _findItemByUrl;
    vm.select = _select;


    function _findItemByUrl(menu, url) {
      for (var i = 0, length = menu.length; i<length; i++) {
        if (menu[i].url && menu[i].url.replace('#', '') == url) return menu[i];
      }
    };

    function _select(item) {
        vm.selectedFromNavMenu = true;
        vm.selectedItem.selected = false;
        item.selected = true;
        vm.selectedItem = item;
    };

    $scope.$watch(function () {
        return $location.path();
      }, function (newVal, oldVal) {
        if (vm.selectedFromNavMenu == false) {
          var item = vm.findItemByUrl (vm.menu, newVal);
          if (item)
            $timeout (function () { vm.select (item); });
        }
        vm.selectedFromNavMenu = false;
    });    
  }

})();