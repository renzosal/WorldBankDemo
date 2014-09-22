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