'use strict';

application.controller('mxSkillsCtrl', function($scope, $state, $stateParams, mxSkill) {
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
		$state.go('addEditSkill');
	};

	$scope.deleteSkill = function(skill) {
		if (confirm("Are you sure you want to delete Skill \"" + skill.name + "\" and all of it's data?")) {
			console.log("delete skill " + skill.name)
			var skillToDelete = new mxSkill();

			skillToDelete.$deleteById({id: skill._id}, function() {
				console.log("Skill deleted: " + skill.name);
				$scope.skills.splice($scope.skills.indexOf(skill));
			});
		};		
	};

	$scope.editSkill = function(skill) {
		console.log("Edit skill " + skill.name);
		$stateParams.skill = skill;
		$state.go('addEditSkill', {name: skill.name, _id:skill._id});
	};

	$scope.moveItem = function(skill, fromIndex, toIndex) {
		if(toIndex>fromIndex) toIndex-=1;
    	$scope.skills.splice(fromIndex, 1);
    	$scope.skills.splice(toIndex, 0, skill);
    	//save skills back to database with updated order?
    	console.log("Reordering won't persist!");
  	};
});