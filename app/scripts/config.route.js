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