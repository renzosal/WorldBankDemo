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