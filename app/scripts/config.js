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