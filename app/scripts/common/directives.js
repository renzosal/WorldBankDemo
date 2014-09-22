(function () {
	'use strict';

/**
 * @desc mapdateselector directive to display tabs above the data map
 * @file directives.js
 * @example <div map-date-selector></div>
 */

	angular
		.module('worldBank')
		.directive('mapDateSelector', mapdateselector);

	mapdateselector.$inject = [];

	function mapdateselector() {
		var directive = {
			restrict: 'A',
			require: "ngModel",
			replace: true,
			scope: {
				years : '=',
				ngModel: '=',
				callback: '&'
			},
			template: '<ul class="nav nav-tabs">'+
								'<li ng-class="{active: ngModel == year}" '+
								'ng-click="setModel(year)" ng-repeat="year in years">'+
								'<a>{{year}}</a></li></ul>',
			link: link
		};

		return directive;

    function link(scope, element, attr, ngModel) {

    	scope.setModel = function (year) {
    		ngModel.$setViewValue(year);
    		ngModel.$render();
    		if(angular.isDefined(attr.callback)){
    			scope.callback();
    		}
    	}
		}
	}


	/**
 * @desc autocomplete directive to display a 
 				 filtered list below input found in source array
 * @file directives.js
 * @example  <input autocomplete
	                   source="source"
	                   output="output"
	                   ng-model="myModel"
	                   type="text" 
	                   class="form-control" 
	                   placeholder="Search By" >
 */

	angular
		.module('worldBank')
		.directive('autocomplete', autocomplete);

	autocomplete.$inject = ['$compile'];
	function autocomplete($compile) {
		var directive = {
			restrict: 'A',
			require: "ngModel",
			scope: {
				source: '=',//array to use as base for search
				output: '='//Selected item from predictive results
			},
			link: link
		};

		return directive;


		function link (scope, element, attr, ngModel) {
			var sourceArr = [];
		  scope.filteredArr = [];

		  scope.setOutput = function (selection){

				scope.output = selection;
				ngModel.$setViewValue(selection.name);
				ngModel.$render();
				scope.filteredArr = [];
			}

      scope.$watch('source', function(newValue, oldValue) {
          if (newValue)
          sourceArr = scope.source;
      });

			var el = angular.element('<span class="autocomplete-result" />');
			el.append('<div class="list-group"><a class="list-group-item" ng-click="setOutput(country)" ng-repeat="country in filteredArr">{{country.name}}</a></div>');
			el.insertAfter(element);

			$compile(element.siblings('span.autocomplete-result'))(scope);

			element.on("input", function () {
				scope.output = null;
				if(ngModel.$viewValue.length > 2){
					scope.filteredArr = _.filter(sourceArr, function(country) {
						return country.name.toLowerCase()
										.indexOf(ngModel.$viewValue.toLowerCase()) > -1;
					});
				}else{
					scope.filteredArr = [];
				}
			});
		}

	}



angular
  .module('worldBank')
  .directive('disableAnimation', disableAnimation);

  disableAnimation.$inject = ['$animate'];

  function disableAnimation ($animate){
    return {
        restrict: 'A',
        link: function($scope, $element, $attrs){
            $attrs.$observe('disableAnimation', function(value){
                $animate.enabled(!value, $element);
            });
        }
    }
  }


angular
  .module('worldBank')
  .directive('canvasChart', canvasChart);

  function canvasChart ($animate){
    return {
      restrict: 'EA',
      scope: {
        data: '=canvasChart',
        options: '=options',
        type: '=',
      },
      link: function (scope, element, attr) {
        if (Chart) {
          // console.log(element[0].getContext);
          (new Chart($(element)[0].getContext('2d')))[scope.type](scope.data, scope.options);
        }
      }
    }
  }


angular
  .module('worldBank')
  .directive('jqvmap', jqvmap);

  jqvmap.$inject = ['$timeout'];

  function jqvmap ($timeout){
  	return {
  		restrict: 'A',
  		scope: {
  			options: '=',
  		},
  		link: function (scope, element, attr) {
  			$timeout( function () {
          element.vectorMap(scope.options);
          scope.$on('$destroy', function () {
            element.data().mapObject.applyTransform = function() {}; // prevent acting on nonexistent object
          });

          scope.$watch('options.values', function(newValue, oldValue) {
              if (newValue){
                element.vectorMap('set', 'values', newValue);
              }
                  
          }, true);

        });
  		}
  	}
  }

angular
  .module('worldBank')
  .directive('slideOut', slideOut);

  function slideOut (){
    return {
      restrict: 'A',
      scope: {
        show: '=slideOut'
      },
      link: function (scope, element, attr) {
        element.hide();
        scope.$watch('show', function (newVal, oldVal) {
          if (newVal !== oldVal) {
            element.slideToggle({
              complete: function () { scope.$apply(); }
            });
          }
        });
      }
    }
  }

angular
  .module('worldBank')
  .directive('pulsate', pulsate);

  function pulsate (){
    return {
      scope: {
        pulsate: '='
      },
      link: function (scope, element, attr) {
        $(element).pulsate(scope.pulsate);
      }
    }
  }


angular
  .module('worldBank')
  .directive('stickyScroll', stickyScroll);

  function stickyScroll (){
    return {
      restrict: 'A',
      link: function (scope, element, attr) {
        function stickyTop() {
            var topMax = parseInt(attr.stickyScroll);
            var headerHeight = $('header').height();
            if (headerHeight>topMax) topMax = headerHeight;
            if ($('body').hasClass('static-header') == false)
              return element.css('top', topMax+'px');
            var window_top = $(window).scrollTop();
            var div_top = element.offset().top;
            if (window_top < topMax) {
                element.css('top', (topMax-window_top)+'px');
            } else {
                element.css('top', 0+'px');
            }
        }

        $(function () {
            $(window).scroll(stickyTop);
            stickyTop();
        });
      }
    }
  }

angular
  .module('worldBank')
  .directive('backToTop', backToTop);

  function backToTop (){
    return {
      restrict: 'AE',
      link: function (scope, element, attr) {
        element.click( function (e) {
          $('body').scrollTop(0);
        });
      }
    }
  }

})();