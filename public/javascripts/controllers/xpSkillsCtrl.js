'use strict';

application.controller('xpSkillsCtrl', function($scope, $state, xpSkill, xpSession) {
	$scope.data = {
		showDelete:false,
		showReorder:false
	};

	$scope.skills = xpSkill.listWithDuration();
	$scope.currentSkillShowingSessions = null;

	$scope.gotoAddSkill = function() {
		console.log("gotoAddSkill");
		$state.go('addEditSkill');
	};

	$scope.editSkill = function(skill) {
		console.log("Edit skill " + skill.name);
		$state.go('addEditSkill', {skillName: skill.name, skillId:skill._id});
	};

	$scope.deleteSkill = function(skill) {
		if (confirm("Are you sure you want to delete Skill \"" + skill.name + "\" and all of it's data?")) {
			console.log("delete skill " + skill.name)
			var skillToDelete = new xpSkill();

			skillToDelete.$deleteById({id: skill._id}, function() {
				console.log("Skill deleted: " + skill.name);
				$scope.skills.splice($scope.skills.indexOf(skill));
			});
		};		
	};

	$scope.isSessionListShown = function(skill) {
		return $scope.currentSkillShowingSessions === skill._id;
	};

	$scope.toggleSessionList = function(skill) {
		if ($scope.isSessionListShown(skill)) {
	    	$scope.currentSkillShowingSessions = null;
	    } else {
	    	$scope.showSessionsForSkill(skill);
	    }
	};

	$scope.showSessionsForSkill = function(skill) {
		if ($scope.skills.indexOf(skill) != -1 && $scope.skills[$scope.skills.indexOf(skill)].sessions === undefined ) {
			$scope.skills[$scope.skills.indexOf(skill)].sessions = xpSession.listForSkill({skillId:skill._id});
		}
		$scope.currentSkillShowingSessions = skill._id;
	};

	$scope.gotoAddSession = function(skill) {
		if (!!skill) {
			console.log("goToAddSession for skill " + skill.name);
			$state.go('addEditSession', {skillId: skill._id});
		}
		else {
			console.log("add new session");
			$state.go('addEditSession');
		}
	};

	$scope.deleteSession = function(session) {
		if (!!session && confirm("Are you sure you want to delete this Session?")) {
			xpSession.deleteById({id: session._id});
		}
	};

	$scope.editSession = function(session) {
		console.log("Edit session on " + session.date);
		$state.go('addEditSession', {sessionId: session._id, sessionDuration: session.duration, sessionDate: session.date, skillId: session.skill_id});

	}


	$scope.moveSkill = function(skill, fromIndex, toIndex) {
		if(toIndex>fromIndex) toIndex-=1;
    	$scope.skills.splice(fromIndex, 1);
    	$scope.skills.splice(toIndex, 0, skill);
    	//save skills back to database with updated order?
    	console.log("Reordering won't persist!");
  	};

  	$scope.stringifyDate = function(date) {
  		return new Date(date).toDateString()
  	};
});