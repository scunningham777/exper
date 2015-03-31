'use strict';

application.controller('mxAddEditSkillCtrl', function($scope, $state, mxSkill) {
	$scope.createSkill = function(newSkill) {
		if (newSkill.name==null || newSkill.name=='') {
			alert("Can't create skill with new name!");
			return;
		}
	}
});