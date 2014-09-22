(function() {

	angular
		.module('worldBank')
	  .controller('ShellController', ShellController);

	  ShellController.$inject = ['$scope', '$timeout', '$location', 'globalService'];

		function ShellController ($scope, $timeout, $location, globalService) {

	    $scope.style_fixedHeader = globalService.get('fixedHeader');
	    $scope.style_leftbarCollapsed = globalService.get('leftbarCollapsed');
	    $scope.style_leftbarShown = globalService.get('leftbarShown');
	    $scope.style_isSmallScreen = false;


	    $scope.toggleLeftBar = function () {
	      if ($scope.style_isSmallScreen) {
	        return globalService.set('leftbarShown', !$scope.style_leftbarShown);
	      }
	      globalService.set('leftbarCollapsed', !$scope.style_leftbarCollapsed);
	    };

	    $scope.$on('globalStyles:changed', function (event, newVal) {
	      $scope['style_'+newVal.key] = newVal.value;
	    });

	    $scope.$on('globalStyles:maxWidth767', function (event, newVal) {
	      $timeout( function () {      
	        $scope.style_isSmallScreen = newVal;
	        if (!newVal) {
	          globalService.set('leftbarShown', false);
	        } else {
	          globalService.set('leftbarCollapsed', false);
	        }
	      });
	    });

	    $scope.$on('$routeChangeStart', function (e) {
	      // console.log('start: ', $location.path());

	    });
	    $scope.$on('$routeChangeSuccess', function (e) {
	      // console.log('success: ', $location.path());

	    });
	  }
})();