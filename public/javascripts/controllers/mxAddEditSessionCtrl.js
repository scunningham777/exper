'use strict';

application.controller('mxAddEditSessionCtrl', function($scope, $state, $stateParams, $ionicModal, skills, mxSession) {
	if (skills==null || skills.length < 1) {
		$state.go('skills');		
	}
	$scope.skills = skills;

	$scope.isNewSession = !$stateParams.sessionId;
	if (!$scope.isNewSession) {
		$scope.curSession = {
			_id: $stateParams.sessionId,
			duration: $stateParams.sessionDuration,
			date: new Date($stateParams.sessionDate),
			skillId: $stateParams.skillId
		}
	}
	else {
		$scope.curSession = {
			skillId: !!$stateParams.skillId?$stateParams.skillId:null,
			duration: 0,
			date: new Date()
		};
	}
	$scope.curSession.date.setMinutes($scope.curSession.date.getMinutes() - $scope.curSession.date.getTimezoneOffset());

	$ionicModal.fromTemplateUrl('../../partials/addEditSession.html', {
		scope: $scope,
	}).then(function(modal) {
		$scope.modal = modal;
		$scope.modal.show();
	});

	$scope.openModal = function() {
		$scope.modal.show();
	};
	$scope.closeModal = function() {
		$scope.modal.hide();
		$state.go('skills')
	}
	//Cleanup the modal when we're done with it!
  	$scope.$on('$destroy', function() {
  		if (!!$scope.modal) {
	    	$scope.modal.remove();
	    }
  	});


	$scope.submit = function(session) {
		console.log("createSession clicked");

		var sessionResource = new mxSession();
		sessionResource = angular.extend(sessionResource, session);
		if ($scope.isNewSession) {
			sessionResource.$addNew({skillId: sessionResource.skillId}, successCallback, errorCallback);
		}
		else {
			sessionResource.$edit({id: sessionResource._id}, successCallback, errorCallback);
		}
		function successCallback(response) {
			if (response.msg === '') {			//empty = sucessful
				$scope.closeModal();	
			}
			else {
				alert("Error: " + response.msg);
			}
		};
		function errorCallback(error) {
			//TODO: test this at some point ;)
			alert("An error occurred trying to save this session - please try again")			
		}
	}
});