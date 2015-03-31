'use strict';

application.controller('mxSkillsCtrl', function($scope, $state, mxSkill) {
	$scope.data = {
		showDelete:false,
		showReorder:false
	};

	$scope.skills = mxSkill.listWithDuration();

	$scope.gotoAddSession = function(skill) {
		console.log("goToAddSession for skill " + skill.name);
	};

	$scope.gotoAddSkill = function() {
		console.log("gotoAddSkill");

	};

	$scope.deleteSkill = function(skill) {
		if (confirm("Are you sure you want to delete Skill \"" + skill.name + "\"?")) {
			console.log("delete skill " + skill.name)
		};		
	};

	$scope.editSkill = function(skill) {
		console.log("Edit skill " + skill.name);
	};

	$scope.moveItem = function(skill, fromIndex, toIndex) {
		if(toIndex>fromIndex) toIndex-=1;
    	$scope.skills.splice(fromIndex, 1);
    	$scope.skills.splice(toIndex, 0, skill);
    	//save skills back to database with updated order?
    	console.log("Reordering won't persist!");
  	};
});