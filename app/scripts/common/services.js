(function () {
	'use strict';
	angular
		.module('worldBank')
		.factory('EnquireService', enquireService);

	enquireService.$inject = ['$window'];

	function enquireService($window) {
		return $window.enquire;
	}




angular
  .module('worldBank')
  .service('globalService',globalService);

  globalService.$inject = ['$rootScope', '$document', 'EnquireService'];
  function globalService ($rootScope, $document, EnquireService) {
    this.settings = {
      fixedHeader: true,
      leftbarCollapsed: false,
      leftbarShown: false
    };


    $document.ready( function() {
      EnquireService.register("screen and (max-width: 767px)", {
        match: function () {
          $rootScope.$broadcast('globalStyles:maxWidth767', true);
        },
        unmatch: function () {
          $rootScope.$broadcast('globalStyles:maxWidth767', false);
        }
      });
    });

    this.get = function (key) { return this.settings[key]; };
    this.set = function (key, value) {
      this.settings[key] = value;
      $rootScope.$broadcast('globalStyles:changed', {key: key, value: this.settings[key]});
      $rootScope.$broadcast('globalStyles:changed:'+key, this.settings[key]);
    };
    this.values = function () { return this.settings; };
  }

})();