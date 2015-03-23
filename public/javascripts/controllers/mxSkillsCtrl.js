'use strict';

application.controller('mxSkillsCtrl', function($scope, mxSkill) {
	$scope.skills = mxSkill.listWithDuration();
	$scope.goToAddSession = function(skill) {
		console.log("goToAddSession for skill " + skill.name);
	}
});