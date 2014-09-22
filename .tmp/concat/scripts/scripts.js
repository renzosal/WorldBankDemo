'use strict';

angular
  .module('worldBank', [
    'ui.bootstrap',
    'angular-loading-bar',
    'ngResource',
    'ngSanitize',
    'ngRoute',
    'ngAnimate',
  ]);

(function() {
	'use strict';

 	var config = {
 		apiBaseUrl : 'http://api.worldbank.org/',
 		jsonpIncrement: 0
 	};

 	var topics = {
 		Economy: 3,
 		Education: 4,
 		Environment: 5,
 		Health: 8,
 		Urban: 16
 	};

	angular
		.module('worldBank')
		.constant('CONFIG', config)
		.constant('TOPICS', topics)
		.config(configuration);

	configuration.$inject = ['$httpProvider'];

	function configuration ($httpProvider){

		configureInterceptors();


		function configureInterceptors(){
			$httpProvider.interceptors.push('httpInterceptor');
		}
	}


})();
(function() {
	'use strict';

	angular
		.module('worldBank')
		.constant('routes', getRoutes())
  	.config(routeConfiguration);

  routeConfiguration.$inject = ['$routeProvider', 'routes'];

	function routeConfiguration ($routeProvider, routes) {

		_.each(routes, function (route) {
			$routeProvider.when(route.url, route.config);
		});

		$routeProvider.otherwise({redirectTo: '/'});

	}

  function getRoutes() {
  		return [
  			{
  				url: '/',
  				config: {
	        	templateUrl: 'scripts/dashboard/dashboard.html',
	        	controller: 'DashboardController',
	        	controllerAs: 'vm',
	        	resolve: {
	        		countries : ['DasboardResolver', function (resolver) {
	        			return resolver.allCountries();
	        		}],
	        		worldEconomy : ['DasboardResolver', function (resolver) {
	        			return resolver.worldEconomy();
	        		}],
	        		worldEducation : ['DasboardResolver', function (resolver) {
	        			return resolver.worldEducation();
	        		}],
	        		worldHealth : ['DasboardResolver', function (resolver) {
	        			return resolver.worldHealth();
	        		}],
	        		worldEnvironment : ['DasboardResolver', function (resolver) {
	        			return resolver.worldEnvironment();
	        		}],
	        		worldUrbanDev : ['DasboardResolver', function (resolver) {
	        			return resolver.worldUrbanDev();
	        		}]
	        	}
	      	}
  			},
  			{
  				url: '/health',
  				config: {
	        	templateUrl: 'scripts/health/health.html',
	        	controller: 'HealthController',
	        	controllerAs: 'vm',
	        	resolve: {
	        		lifeExpectancy : ['HealthResolver', function (resolver) {
	        			return resolver.lifeExpectancy();
	        		}],
	        		topicInfo : ['HealthResolver', function (resolver) {
	        			return resolver.topicInfo();
	        		}]
	        	}
	      	}
  			},
  			{
  				url: '/economy-growth',
  				config: {
	        	templateUrl: 'scripts/economy/economy.html',
	        	controller: 'EconomyController',
	        	controllerAs: 'vm',
	        	resolve: {
	        		GNPPerCapita : ['EconomyResolver', function (resolver) {
	        			return resolver.GNPPerCapita();
	        		}],
	        		GNPPerCapitaWorld : ['EconomyResolver', function (resolver) {
	        			return resolver.GNPPerCapitaWorld();
	        		}],
	        		topicInfo : ['EconomyResolver', function (resolver) {
	        			return resolver.topicInfo();
	        		}]
	        	}
	      	}
  			},
  			{
  				url: '/education',
  				config: {
	        	templateUrl: 'scripts/education/education.html',
	        	controller: 'EducationController',
	        	controllerAs: 'vm',
	        	resolve: {
	        		SchoolEnrollmentPrimary : ['EducationResolver', function (resolver) {
	        			return resolver.SchoolEnrollmentPrimary();
	        		}],
	        		topicInfo : ['EducationResolver', function (resolver) {
	        			return resolver.topicInfo();
	        		}]
	        	}
	      	}
  			},
  			{
  				url: '/environment',
  				config: {
	        	templateUrl: 'scripts/environment/environment.html',
	        	controller: 'EnvironmentController',
	        	controllerAs: 'vm',
	        	resolve: {
	        		EnergyUseKt : ['EnvironmentResolver', function (resolver) {
	        			return resolver.EnergyUseKt();
	        		}],
	        		topicInfo : ['EnvironmentResolver', function (resolver) {
	        			return resolver.topicInfo();
	        		}]
	        	}
	      	}
  			},
  			{
  				url: '/urban-development',
  				config: {
	        	templateUrl: 'scripts/urban/urban.html',
	        	controller: 'UrbanController',
	        	controllerAs: 'vm',
	        	resolve: {
	        		urbanPopulation : ['UrbanResolver', function (resolver) {
	        			return resolver.urbanPopulation();
	        		}],
	        		topicInfo : ['UrbanResolver', function (resolver) {
	        			return resolver.topicInfo();
	        		}]
	        	}
	      	}
  			}
  		];
  }

})();
(function () {
	'use strict';

	angular
		.module('worldBank')
		.factory('WorldBankService', worldBankService);

		worldBankService.$inject = ['$http', '$q', 'CONFIG'];

		function worldBankService ($http, $q, CONFIG) {

			var service = {
				//Common
				getCountries: _getCountries,
				getTopicDescription: _getTopicDescription
			};

			return service;

			function _getTopicDescription(topicId){

				var promise = $http
					.jsonp(CONFIG.apiBaseUrl + 'topic/' + topicId,
					{
						params: {
							per_page: 260
						}
					})
					.then(function(response){
						var topicData = {
							id: response.data[1][0].id,
							name: response.data[1][0].value,
							description: response.data[1][0].sourceNote
						};
						return $q.when(topicData);
					});

				return promise;				
			}

			function _getCountries(){

				var promise = $http
				.jsonp(CONFIG.apiBaseUrl + '/countries/all',
				{
					params: {
						per_page: 262
					}
				})
				.then(function(response){

					var countryList = [];
					_.each(response.data[1], function (country) {
						countryList.push({
							id: country.iso2Code,
							name: country.name,
							long: country.longitude,
							lat: country.latitude
							});
					});
					return $q.when(countryList);
				});

				return promise;

			}


		}

})();
(function () {
	'use strict';

	angular
		.module('worldBank')
		.factory('httpInterceptor', httpInterceptor);

	httpInterceptor.$inject = ['$q', 'CONFIG'];

	function httpInterceptor($q, CONFIG) {
		var jsonpIncrement = 0;
		var interceptor = {
			request: request,
			response: response
		};

		return interceptor;

		function request (requestConfig) {
			if(requestConfig.url.indexOf(CONFIG.apiBaseUrl) != -1){
				var separator = requestConfig.url.indexOf('?') === -1 ? '?' : '&';
				requestConfig.url += separator + 'format=jsonP&prefix=JSON_CALLBACK';
				requestConfig.cache = true;
				jsonpIncrement = jsonpIncrement + 1;
			}
			return requestConfig || $q.when(requestConfig);
		}

		function response(response) {
			return response || $q.when(response);
		}

	}

})();
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
(function () {
	'use strict';

	angular
	.module('worldBank')
	.factory('DasboardResolver', dashboardResolver);

	dashboardResolver.$inject = ['$q','WorldBankService', 'EconomyService', 
		'EducationService', 'HealthService', 'EnvironmentService', 'UrbanService'];

	function dashboardResolver($q, WorldBankService, EconomyService, EducationService, 
															HealthService, EnvironmentService, UrbanService) {


		var data = {
			allCountries: _getAllCountries,
			worldEconomy: _worldEconomy,
			worldEducation: _worldEducation,
			worldHealth: _worldHealth,
			worldEnvironment: _worldEnvironment,
			worldUrbanDev: _worldUrbanDev
		};

		return data;


		function _getAllCountries() {
			return WorldBankService.getCountries()
        .then(function(data) { return data; });
		}

		function _worldEconomy() {
			return EconomyService.getAllGDP(2012,'1W')
        .then(function(data) { return data; });
		}

		function _worldEducation() {
			return EducationService.getAllSchoolEnrollPrimaryByYear(2012,'1W')
        .then(function(data) { return data; });
		}

		function _worldHealth() {
			return HealthService.getAllLifeExpectancyByYear(2012,'1W')
        .then(function(data) { return data; });
		}

		function _worldEnvironment() {
			return EnvironmentService.getAllEnergyUseKtByYear(2012,'1W')
        .then(function(data) { return data; });
		}

		function _worldUrbanDev(){
			return UrbanService.getAllUrbanPopPercentageByYear(2012,'1W')
        .then(function(data) { return data; });
		}

	}

})();
(function () {
	'use strict';

	angular
		.module('worldBank')
		.factory('DashboardHelper', dashboardHelper);

	dashboardHelper.$inject = ['$q','EducationService', 'EconomyService', 'HealthService', 'EnvironmentService', 'UrbanService'];

	function dashboardHelper($q,EducationService, EconomyService, HealthService, EnvironmentService, UrbanService) {

		var $q = $q;

		var helper = {
			years : [2013,2012,2011,2010,2009,2008],
			getCountryOverview: _getCountryOverview,
			getSelectedCountry: _getSelectedCountry
		};

		return helper;

		function _getSelectedCountry(countries, code){
			var matchFound =  _.find(countries, function (country) {
				return country.id === code.toUpperCase();
			});

			return matchFound;
		}

		function _getCountryOverview(year, country){
			var countryCode = '1W';
			if(typeof country !== 'undefined' && country !== null){
				countryCode = country.id;
			}

			return $q.all({
					economy: EconomyService.getAllGDP(year, countryCode),
					education: EducationService.getAllSchoolEnrollPrimaryByYear(year, countryCode),
					health: HealthService.getAllLifeExpectancyByYear(year,countryCode),
					environment: EnvironmentService.getAllEnergyUseKtByYear(year,countryCode),
					urbanDev: UrbanService.getAllUrbanPopPercentageByYear(year,countryCode)
				}).then(function (data){
					return data;
				});
		}

	}

})();
(function () {
	'use strict';

	angular
		.module('worldBank')
		.controller('HealthController', healthController);

	healthController.$inject = ['HealthHelper', 'lifeExpectancy', 'topicInfo'];

	function healthController(HealthHelper, lifeExpectancy, topicInfo) {
		var vm = this; 

		//View Model
		vm.years = HealthHelper.yearsList;
		vm.selectedYear = vm.years[0];

		vm.indicators = HealthHelper.indicators;
		vm.selectedIndicator = vm.indicators[0].method;
		vm.mapHoverLabelFormat = vm.indicators[0].labelFormat;

		vm.gridData = lifeExpectancy;
		vm.topicInfo = topicInfo;
		vm.mapData = 	_generateMapData(lifeExpectancy);

    vm.healthMap = {
      map: 'world_en',
      backgroundColor: 'transparent',
      color: '#f5f5f5',
      hoverOpacity: 0.7,
      selectedColor: '#1880c4',
      enableZoom: true,
      showTooltip: true,
      values:vm.mapData,
      scaleColors: ['#F4C3C3', '#941616'],
      normalizeFunction: 'polynomial',
      onLabelShow: function (event, label, code){
      	label[0].innerHTML += HealthHelper.generateMapHoverLabel(vm.mapHoverLabelFormat, code, vm.mapData);
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

			HealthHelper.getIndicatorDataByYear(vm.selectedYear, methodName).then(function (data) {
				vm.gridData = data;
      	vm.healthMap.values = vm.mapData = _generateMapData(data);
			});
		}

	}

})();
(function () {
	'use strict';

	angular
	.module('worldBank')
	.factory('HealthResolver', healthResolver);

	healthResolver.$inject = ['$q', 'WorldBankService', 'HealthService', 'TOPICS'];

	function healthResolver($q, WorldBankService, HealthService, TOPICS) {


		var data = {
			lifeExpectancy: _lifeExpectancy,
			topicInfo: _topicInfo
		};

		return data;


		function _lifeExpectancy() {
			return HealthService.getAllLifeExpectancyByYear(2012)
        .then(function(data) { return data; });
		}

		function _topicInfo (){
			return WorldBankService.getTopicDescription(TOPICS.Health)
        .then(function(data) { return data; });
		}
	}

})();
(function () {
	'use strict';

	angular
		.module('worldBank')
		.factory('HealthHelper', healthHelper);

	healthHelper.$inject = ['HealthService'];

	function healthHelper(HealthService) {

		var helper = {
			yearsList : [2012,2011,2010,2009,2008],
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
(function () {
	'use strict';

	angular
		.module('worldBank')
		.factory('HealthService', healthService);

		healthService.$inject = ['$http', '$q', 'CONFIG'];

		function healthService ($http, $q, CONFIG) {

			var service = {
				//Health
				getAllLifeExpectancyByYear: _getAllLifeExpectancyByYear,
				getAllFertilityRateByYear: _getAllFertilityRateByYear,
				getAllHealthExpenditureByYear: _getAllHealthExpenditureByYear
			};

			return service;

			function _getCountryCode(args){
				return (args.length ===2) ? args[1] : 'all';
			}

			function _getAllHealthExpenditureByYear(year){
				var promise = $http
					.jsonp(CONFIG.apiBaseUrl + 'countries/'+_getCountryCode(arguments)+'/indicators/SH.XPD.PCAP',
					{
						params: {
							per_page: 260,
							date: year
						}
					})
					.then(function(response){

						var countryList = [];
						_.each(response.data[1], function (row) {
							countryList.push({
								id: row.country.id,
								name: row.country.value,
								value: Math.floor(row.value)
							});
						});
						return $q.when(countryList);
					});

				return promise;				
			}

			function _getAllFertilityRateByYear(year){
				var promise = $http
					.jsonp(CONFIG.apiBaseUrl + 'countries/'+_getCountryCode(arguments)+'/indicators/SP.DYN.TFRT.IN',
					{
						params: {
							per_page: 260,
							date: year
						}
					})
					.then(function(response){

						var countryList = [];
						_.each(response.data[1], function (row) {
							countryList.push({
								id: row.country.id,
								name: row.country.value,
								value: Math.round(row.value * 10)/10
							});
						});
						return $q.when(countryList);
					});

				return promise;				
			}

			function _getAllLifeExpectancyByYear(year){

				var promise = $http
					.jsonp(CONFIG.apiBaseUrl + 'countries/'+_getCountryCode(arguments)+'/indicators/SP.DYN.LE00.IN',
					{
						params: {
							per_page: 260,
							date: year
						}
					})
					.then(function(response){

						var countryList = [];
						_.each(response.data[1], function (row) {
							countryList.push({
								id: row.country.id,
								name: row.country.value,
								value: Math.round(row.value * 10)/10
							});
						});
						return $q.when(countryList);
					});

				return promise;
			}

		}

})();
(function () {
	'use strict';

	angular
		.module('worldBank')
		.controller('EconomyController', economyController);

	economyController.$inject = ['EconomyHelper', 'GNPPerCapita', 'GNPPerCapitaWorld', 'topicInfo'];

	function economyController(EconomyHelper, GNPPerCapita, GNPPerCapitaWorld, topicInfo) {
		var vm = this; 
		//View Model
		vm.years = EconomyHelper.yearsList;
		vm.selectedYear = vm.years[0];

		vm.indicators = EconomyHelper.indicators;
		vm.selectedIndicator = vm.indicators[0].method;
		vm.mapHoverLabelFormat = vm.indicators[0].labelFormat;

		vm.gridData = GNPPerCapita;
		vm.topicInfo = topicInfo;
		vm.mapData = 	_generateMapData(GNPPerCapita);

    vm.economyMap = {
      map: 'world_en',
      backgroundColor: 'transparent',
      color: '#f5f5f5',
      hoverOpacity: 0.7,
      selectedColor: '#1880c4',
      enableZoom: true,
      showTooltip: true,
      values:vm.mapData,
      scaleColors: ['#C3E2F4', '#055480'],
      normalizeFunction: 'polynomial',
      onLabelShow: function (event, label, code){
      	label[0].innerHTML += EconomyHelper.generateMapHoverLabel(vm.mapHoverLabelFormat, code, vm.mapData);
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

			EconomyHelper.getIndicatorDataByYear(vm.selectedYear, methodName).then(function (data) {
				vm.gridData = data;
				console.log(data);
      	vm.economyMap.values = vm.mapData = _generateMapData(data);
			});
		}

	}

})();
(function () {
	'use strict';

	angular
	.module('worldBank')
	.factory('EconomyResolver', economyResolver);

	economyResolver.$inject = ['$q', 'WorldBankService', 'EconomyService', 'TOPICS'];

	function economyResolver($q, WorldBankService, EconomyService, TOPICS) {


		var data = {
			GNPPerCapita: _GNPPerCapita,
			GNPPerCapitaWorld: _GNPPerCapitaWorld,
			topicInfo: _topicInfo
		};

		return data;


		function _GNPPerCapita() {
			return EconomyService.getAllGNIPerCapitaByYear(2013)
        .then(function(data) { return data; });
		}

		function _GNPPerCapitaWorld() {
			console.log("test");
			return EconomyService.getAllGNIPerCapitaByYear('2003:2013','1W')
        .then(function(data) { return data; });	
		}

		function _topicInfo (){
			return WorldBankService.getTopicDescription(TOPICS.Economy)
        .then(function(data) { return data; });
		}
	}

})();
(function () {
	'use strict';

	angular
		.module('worldBank')
		.factory('EconomyHelper', economyHelper);

	economyHelper.$inject = ['EconomyService'];

	function economyHelper(EconomyService) {

		var helper = {
			yearsList : [2013,2012,2011,2010,2009],
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
(function () {
	'use strict';

	angular
		.module('worldBank')
		.factory('EconomyService', economyService);

		economyService.$inject = ['$http', '$q', 'CONFIG'];

		function economyService ($http, $q, CONFIG) {

			var service = {

				//Economy
				getAllGDP: _getAllGDP,
				getAllGNIPerCapitaByYear: _getAllGNIPerCapitaByYear,
				getAllTotalReserves: _getAllTotalReserves
			};

			return service;

			function _getCountryCode(args){
				return (args.length ===2) ? args[1] : 'all';
			}

			function _getAllGDP(year){

				var promise = $http
					.jsonp(CONFIG.apiBaseUrl + 'countries/'+ _getCountryCode(arguments) +'/indicators/NY.GDP.MKTP.CD',
					{
						params: {
							per_page: 260,
							date: year
						}
					})
					.then(function(response){

						var countryList = [];
						_.each(response.data[1], function (row) {
							countryList.push({
								id: row.country.id,
								name: row.country.value,
								value: row.value
							});
						});
						return $q.when(countryList);
					});

				return promise;					
			}

			function _getAllTotalReserves(year){

				var promise = $http
					.jsonp(CONFIG.apiBaseUrl + 'countries/'+_getCountryCode(arguments)+'/indicators/FI.RES.TOTL.CD',
					{
						params: {
							per_page: 260,
							date: year
						}
					})
					.then(function(response){

						var countryList = [];
						_.each(response.data[1], function (row) {
							countryList.push({
								id: row.country.id,
								name: row.country.value,
								value: Math.floor(row.value)
							});
						});
						return $q.when(countryList);
					});

				return promise;					
			}

			function _getAllGNIPerCapitaByYear(year){

				var promise = $http
					.jsonp(CONFIG.apiBaseUrl + 'countries/'+ _getCountryCode(arguments) +'/indicators/NY.GNP.PCAP.CD',
					{
						params: {
							per_page: 260,
							date: year
						}
					})
					.then(function(response){

						var countryList = [];
						_.each(response.data[1], function (row) {
							countryList.push({
								id: row.country.id,
								name: row.country.value,
								value: Math.floor(row.value)
							});
						});
						return $q.when(countryList);
					});

				return promise;					
			}

		}

})();
(function () {
	'use strict';

	angular
		.module('worldBank')
		.controller('EducationController', educationController);

	educationController.$inject = ['EducationHelper', 'SchoolEnrollmentPrimary', 'topicInfo'];

	function educationController(EducationHelper, SchoolEnrollmentPrimary, topicInfo) {
		var vm = this; 

		//View Model
		vm.years = EducationHelper.yearsList;
		vm.selectedYear = vm.years[0];

		vm.indicators = EducationHelper.indicators;
		vm.selectedIndicator = vm.indicators[0].method;
		vm.mapHoverLabelFormat = vm.indicators[0].labelFormat;

		vm.gridData = SchoolEnrollmentPrimary;
		vm.topicInfo = topicInfo;
		vm.mapData = 	_generateMapData(SchoolEnrollmentPrimary);

    vm.educationMap = {
      map: 'world_en',
      backgroundColor: 'transparent',
      color: '#f5f5f5',
      hoverOpacity: 0.7,
      selectedColor: '#1880c4',
      enableZoom: true,
      showTooltip: true,
      values:vm.mapData,
      scaleColors: ['#C3D3F4', '#053680'],
      normalizeFunction: 'polynomial',
      onLabelShow: function (event, label, code){
      	label[0].innerHTML += EducationHelper.generateMapHoverLabel(vm.mapHoverLabelFormat, code, vm.mapData);
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

			EducationHelper.getIndicatorDataByYear(vm.selectedYear, methodName).then(function (data) {
				vm.gridData = data;
      	vm.educationMap.values = vm.mapData = _generateMapData(data);
			});
		}

	}

})();
(function () {
	'use strict';

	angular
	.module('worldBank')
	.factory('EducationResolver', educationResolver);

	educationResolver.$inject = ['$q', 'WorldBankService', 'EducationService', 'TOPICS'];

	function educationResolver($q, WorldBankService, EducationService, TOPICS) {


		var data = {
			SchoolEnrollmentPrimary: _SchoolEnrollmentPrimary,
			topicInfo: _topicInfo
		};

		return data;


		function _SchoolEnrollmentPrimary() {
			return EducationService.getAllSchoolEnrollPrimaryByYear(2011)
        .then(function(data) { return data; });
		}

		function _topicInfo (){
			return WorldBankService.getTopicDescription(TOPICS.Education)
        .then(function(data) { return data; });
		}
	}

})();
(function () {
	'use strict';

	angular
		.module('worldBank')
		.factory('EducationHelper', educationHelper);

	educationHelper.$inject = ['EducationService'];

	function educationHelper(EducationService) {

		var helper = {
			yearsList : [2012,2011,2010,2009,2008],
			indicators: [
				{	name:'School enrollment, primary (% gross)', 
	      	method: 'getAllSchoolEnrollPrimaryByYear',
	      	labelFormat: '#value#% gross' 
	      },
	      {	name:'School enrollment, secondary (% gross)', 
	      	method: 'getAllSchoolEnrollSecondaryByYear',
	      	labelFormat: '#value#% gross' 
	      },
	      {	name:'Pupil-teacher ratio, primary', 
	      	method: 'getAllPupilTeacherRatioPrimaryByYear',
	      	labelFormat: '#value#' 
	      },
	      {	name:'Children out of school, primary, female', 
	      	method: 'getAllOutOfSchoolFemaleByYear',
	      	labelFormat: '#value# female'
	      },
	      {	name:'Children out of school, primary, male', 
	      	method: 'getAllOutOfSchoolMaleByYear',
	      	labelFormat: '#value# male'
	      }
	    ],
			getIndicatorDataByYear: _getIndicatorDataByYear,
			generateMapHoverLabel: _generateMapHoverLabel
		};

		return helper;

		function _getIndicatorDataByYear(year, methodName){
			if(typeof EducationService[methodName] == 'function'){
				return EducationService[methodName](year);
			}else{
				throw new Error('EducationService does not have method: ' + methodName);
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
(function () {
	'use strict';

	angular
		.module('worldBank')
		.factory('EducationService', educationService);

		educationService.$inject = ['$http', '$q', 'CONFIG'];

		function educationService ($http, $q, CONFIG) {

			var service = {
				//Education
				getAllSchoolEnrollPrimaryByYear: _getAllSchoolEnrollPrimaryByYear,
				getAllSchoolEnrollSecondaryByYear: _getAllSchoolEnrollSecondaryByYear,
				getAllPupilTeacherRatioPrimaryByYear: _getAllPupilTeacherRatioPrimaryByYear,
				getAllOutOfSchoolFemaleByYear: _getAllOutOfSchoolFemaleByYear,
				getAllOutOfSchoolMaleByYear: _getAllOutOfSchoolMaleByYear
			};

			return service;

			function _getCountryCode(args){
				return (args.length ===2) ? args[1] : 'all';
			}

			function _getAllOutOfSchoolMaleByYear(year){

				var promise = $http
					.jsonp(CONFIG.apiBaseUrl + 'countries/'+_getCountryCode(arguments)+'/indicators/SE.PRM.UNER.MA',
					{
						params: {
							per_page: 260,
							date: year
						}
					})
					.then(function(response){

						var countryList = [];
						_.each(response.data[1], function (row) {
							countryList.push({
								id: row.country.id,
								name: row.country.value,
								value: row.value
							});
						});
						return $q.when(countryList);
					});

				return promise;					
			}

			function _getAllOutOfSchoolFemaleByYear(year){

				var promise = $http
					.jsonp(CONFIG.apiBaseUrl + 'countries/'+_getCountryCode(arguments)+'/indicators/SE.PRM.UNER.FE',
					{
						params: {
							per_page: 260,
							date: year
						}
					})
					.then(function(response){

						var countryList = [];
						_.each(response.data[1], function (row) {
							countryList.push({
								id: row.country.id,
								name: row.country.value,
								value: row.value
							});
						});
						return $q.when(countryList);
					});

				return promise;					
			}

			function _getAllPupilTeacherRatioPrimaryByYear(year){

				var promise = $http
					.jsonp(CONFIG.apiBaseUrl + 'countries/'+_getCountryCode(arguments)+'/indicators/SE.PRM.ENRL.TC.ZS',
					{
						params: {
							per_page: 260,
							date: year
						}
					})
					.then(function(response){

						var countryList = [];
						_.each(response.data[1], function (row) {
							countryList.push({
								id: row.country.id,
								name: row.country.value,
								value: Math.floor(row.value)
							});
						});
						return $q.when(countryList);
					});

				return promise;					
			}

			function _getAllSchoolEnrollSecondaryByYear(year){

				var promise = $http
					.jsonp(CONFIG.apiBaseUrl + 'countries/'+_getCountryCode(arguments)+'/indicators/SE.SEC.ENRR',
					{
						params: {
							per_page: 260,
							date: year
						}
					})
					.then(function(response){

						var countryList = [];
						_.each(response.data[1], function (row) {
							countryList.push({
								id: row.country.id,
								name: row.country.value,
								value: Math.floor(row.value)
							});
						});
						return $q.when(countryList);
					});

				return promise;					
			}

			function _getAllSchoolEnrollPrimaryByYear(year){

				var promise = $http
					.jsonp(CONFIG.apiBaseUrl + 'countries/'+_getCountryCode(arguments)+'/indicators/SE.PRM.ENRR',
					{
						params: {
							per_page: 260,
							date: year
						}
					})
					.then(function(response){

						var countryList = [];
						_.each(response.data[1], function (row) {
							countryList.push({
								id: row.country.id,
								name: row.country.value,
								value: Math.floor(row.value)
							});
						});
						return $q.when(countryList);
					});

				return promise;					
			}
		}

})();
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
(function () {
	'use strict';

	angular
	.module('worldBank')
	.factory('EnvironmentResolver', environmentResolver);

	environmentResolver.$inject = ['$q', 'WorldBankService', 'EnvironmentService', 'TOPICS'];

	function environmentResolver($q, WorldBankService, EnvironmentService, TOPICS) {


		var data = {
			EnergyUseKt: _EnergyUseKt,
			topicInfo: _topicInfo
		};

		return data;


		function _EnergyUseKt() {
			return EnvironmentService.getAllEnergyUseKtByYear(2011)
        .then(function(data) { return data; });
		}

		function _topicInfo (){
			return WorldBankService.getTopicDescription(TOPICS.Environment)
        .then(function(data) { return data; });
		}
	}

})();
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
(function () {
	'use strict';

	angular
		.module('worldBank')
		.factory('EnvironmentService', environmentService);

		environmentService.$inject = ['$http', '$q', 'CONFIG'];

		function environmentService ($http, $q, CONFIG) {

			var service = {
				//Environment
				getAllCO2perCapitaByYear: _getAllCO2perCapitaByYear,
				getAllForestAreaKmByYear: _getAllForestAreaKmByYear,
				getAllAccessElectricityByYear: _getAllAccessElectricityByYear,
				getAllEnergyUseKtByYear: _getAllEnergyUseKtByYear,
				getAllEnergyProdKtByYear: _getAllEnergyProdKtByYear
			};

			return service;

			function _getCountryCode(args){
				return (args.length ===2) ? args[1] : 'all';
			}

			function _getAllEnergyProdKtByYear(year){
				var promise = $http
					.jsonp(CONFIG.apiBaseUrl + 'countries/'+_getCountryCode(arguments)+'/indicators/EG.EGY.PROD.KT.OE',
					{
						params: {
							per_page: 260,
							date: year
						}
					})
					.then(function(response){

						var countryList = [];
						_.each(response.data[1], function (row) {
							countryList.push({
								id: row.country.id,
								name: row.country.value,
								value: Math.round(row.value * 10)/10
							});
						});
						return $q.when(countryList);
					});

				return promise;					
			}

			function _getAllEnergyUseKtByYear(year){

				var promise = $http
					.jsonp(CONFIG.apiBaseUrl + 'countries/'+_getCountryCode(arguments)+'/indicators/EG.USE.COMM.KT.OE',
					{
						params: {
							per_page: 260,
							date: year
						}
					})
					.then(function(response){

						var countryList = [];
						_.each(response.data[1], function (row) {
							countryList.push({
								id: row.country.id,
								name: row.country.value,
								value: Math.round(row.value * 10)/10
							});
						});
						return $q.when(countryList);
					});

				return promise;					
			}

			function _getAllAccessElectricityByYear(year){

				var promise = $http
					.jsonp(CONFIG.apiBaseUrl + 'countries/'+_getCountryCode(arguments)+'/indicators/EG.ELC.ACCS.ZS',
					{
						params: {
							per_page: 260,
							date: year
						}
					})
					.then(function(response){

						var countryList = [];
						_.each(response.data[1], function (row) {
							countryList.push({
								id: row.country.id,
								name: row.country.value,
								value: Math.round(row.value * 10)/10
							});
						});
						return $q.when(countryList);
					});

				return promise;					
			}

			function _getAllForestAreaKmByYear(year){

				var promise = $http
					.jsonp(CONFIG.apiBaseUrl + 'countries/'+_getCountryCode(arguments)+'/indicators/AG.LND.FRST.K2',
					{
						params: {
							per_page: 260,
							date: year
						}
					})
					.then(function(response){

						var countryList = [];
						_.each(response.data[1], function (row) {
							countryList.push({
								id: row.country.id,
								name: row.country.value,
								value: row.value
							});
						});
						return $q.when(countryList);
					});

				return promise;					
			}

			function _getAllCO2perCapitaByYear(year){

				var promise = $http
					.jsonp(CONFIG.apiBaseUrl + 'countries/'+_getCountryCode(arguments)+'/indicators/EN.ATM.CO2E.PC',
					{
						params: {
							per_page: 260,
							date: year
						}
					})
					.then(function(response){

						var countryList = [];
						_.each(response.data[1], function (row) {
							countryList.push({
								id: row.country.id,
								name: row.country.value,
								value: Math.round(row.value * 10)/10
							});
						});
						return $q.when(countryList);
					});

				return promise;					
			}
		}

})();
(function () {
	'use strict';

	angular
		.module('worldBank')
		.controller('UrbanController', urbanController);

	urbanController.$inject = ['UrbanHelper', 'urbanPopulation', 'topicInfo'];

	function urbanController(UrbanHelper, urbanPopulation, topicInfo) {
		var vm = this; 

		//View Model
		vm.years = UrbanHelper.yearsList;
		vm.selectedYear = vm.years[0];

		vm.indicators = UrbanHelper.indicators;
		vm.selectedIndicator = vm.indicators[0].method;
		vm.mapHoverLabelFormat = vm.indicators[0].labelFormat;

		vm.gridData = urbanPopulation;
		vm.topicInfo = topicInfo;
		vm.mapData = 	_generateMapData(urbanPopulation);

    vm.urbanDevelopmentMap = {
      map: 'world_en',
      backgroundColor: 'transparent',
      color: '#f5f5f5',
      hoverOpacity: 0.7,
      selectedColor: '#1880c4',
      enableZoom: true,
      showTooltip: true,
      values:vm.mapData,
      scaleColors: ['#F4DCC3', '#804A05'],
      normalizeFunction: 'polynomial',
      onLabelShow: function (event, label, code){
      	label[0].innerHTML += UrbanHelper.generateMapHoverLabel(vm.mapHoverLabelFormat, code, vm.mapData);
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

			UrbanHelper.getIndicatorDataByYear(vm.selectedYear, methodName).then(function (data) {
				vm.gridData = data;
      	vm.urbanDevelopmentMap.values = vm.mapData = _generateMapData(data);
			});
		}

	}

})();
(function () {
	'use strict';

	angular
	.module('worldBank')
	.factory('UrbanResolver', urbanResolver);

	urbanResolver.$inject = ['$q', 'WorldBankService', 'UrbanService', 'TOPICS'];

	function urbanResolver($q, WorldBankService, UrbanService, TOPICS) {


		var data = {
			urbanPopulation: _urbanPopulation,
			topicInfo: _topicInfo
		};

		return data;


		function _urbanPopulation() {
			return UrbanService.getAllUrbanPopPercentageByYear(2013)
        .then(function(data) { return data; });
		}

		function _topicInfo (){
			return WorldBankService.getTopicDescription(TOPICS.Urban)
        .then(function(data) { return data; });
		}
	}

})();
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
(function () {
	'use strict';

	angular
		.module('worldBank')
		.factory('UrbanService', urbanService);

		urbanService.$inject = ['$http', '$q', 'CONFIG'];

		function urbanService ($http, $q, CONFIG) {

			var service = {
				//Urban Development
				getAllUrbanPopPercentageByYear: _getAllUrbanPopPercentageByYear,
				getAllLargestCityPopByYear: _getAllLargestCityPopByYear,
				getAllSanitationAccessByYear: _getAllSanitationAccessByYear,
				getAllWaterAccessByYear: _getAllWaterAccessByYear
			};

			return service;

			function _getCountryCode(args){
				return (args.length ===2) ? args[1] : 'all';
			}

			function _getAllWaterAccessByYear(year){

				var promise = $http
					.jsonp(CONFIG.apiBaseUrl + 'countries/'+_getCountryCode(arguments)+'/indicators/SH.H2O.SAFE.UR.ZS',
					{
						params: {
							per_page: 260,
							date: year
						}
					})
					.then(function(response){

						var countryList = [];
						_.each(response.data[1], function (row) {
							countryList.push({
								id: row.country.id,
								name: row.country.value,
								value: Math.floor(row.value)
							});
						});
						return $q.when(countryList);
					});

				return promise;					
			}

			function _getAllSanitationAccessByYear(year){

				var promise = $http
					.jsonp(CONFIG.apiBaseUrl + 'countries/'+_getCountryCode(arguments)+'/indicators/SH.STA.ACSN.UR',
					{
						params: {
							per_page: 260,
							date: year
						}
					})
					.then(function(response){

						var countryList = [];
						_.each(response.data[1], function (row) {
							countryList.push({
								id: row.country.id,
								name: row.country.value,
								value: Math.floor(row.value)
							});
						});
						return $q.when(countryList);
					});

				return promise;					
			}

			function _getAllLargestCityPopByYear(year){

				var promise = $http
					.jsonp(CONFIG.apiBaseUrl + 'countries/'+_getCountryCode(arguments)+'/indicators/EN.URB.LCTY.UR.ZS',
					{
						params: {
							per_page: 260,
							date: year
						}
					})
					.then(function(response){

						var countryList = [];
						_.each(response.data[1], function (row) {
							countryList.push({
								id: row.country.id,
								name: row.country.value,
								value: Math.floor(row.value)
							});
						});
						return $q.when(countryList);
					});

				return promise;					
			}

			function _getAllUrbanPopPercentageByYear(year){

				var promise = $http
					.jsonp(CONFIG.apiBaseUrl + 'countries/'+_getCountryCode(arguments)+'/indicators/SP.URB.TOTL.IN.ZS',
					{
						params: {
							per_page: 260,
							date: year
						}
					})
					.then(function(response){

						var countryList = [];
						_.each(response.data[1], function (row) {
							countryList.push({
								id: row.country.id,
								name: row.country.value,
								value: Math.floor(row.value)
							});
						});
						return $q.when(countryList);
					});

				return promise;					
			}

		}

})();