'use strict';

application.controller('mxAddEditSkillCtrl', function($scope, $state, $ionicModal, mxSkill) {
	$ionicModal.fromTemplateUrl('addEditSkillModal.html', {
		scope: $scope,
//		animation: 'slide-in-up'
	}).then(function(modal) {
		$scope.modal = modal;
		$scope.modal.show();
	});

	$scope.newSkill = {
		name:''
	};

	$scope.openModal = function() {
		$scope.modal.show();
	};
	$scope.closeModal = function() {
		$scope.modal.hide();
		$state.go('skills')
	}
	//Cleanup the modal when we're done with it!
  	$scope.$on('$destroy', function() {
    	$scope.modal.remove();
  	});


	$scope.createSkill = function(newSkill) {
		console.log("createSkill clicked");
		if (newSkill.name==='') {
			alert("Can't create skill with no name!");
			return;
		}

		var skillToBeAdded = new mxSkill();
		skillToBeAdded.name = newSkill.name;
		skillToBeAdded.$addNew(function() {
			//TODO: handle failure for duplicate skill
			$scope.closeModal();	
		})
	}
});