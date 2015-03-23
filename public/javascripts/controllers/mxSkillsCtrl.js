'use strict';

application.controller('mxSkillsCtrl', function($scope, mxSkill) {
	$scope.skills = mxSkill.listWithDuration();
});