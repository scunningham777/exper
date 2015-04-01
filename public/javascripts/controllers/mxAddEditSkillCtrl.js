'use strict';

application.controller('mxAddEditSkillCtrl', function($scope, $state, $ionicModal) {
	$ionicModal.fromTemplateUrl('addEditSkillModal.html', {
		scope: $scope,
//		animation: 'slide-in-up'
	}).then(function(modal) {
		$scope.modal = modal;
		$scope.modal.show();
	});

	$scope.openModal = function() {
		$scope.modal.show();
	};
	$scope.closeModal = function() {
		$scope.modal.hide();
	}
	//Cleanup the modal when we're done with it!
  	$scope.$on('$destroy', function() {
    	$scope.modal.remove();
  	});


	$scope.createSkill = function(newSkill) {
		if (newSkill.name==null || newSkill.name=='') {
			alert("Can't create skill with new name!");
			return;
		}

		alert("Adding new Skill " + newSkill.name);
	}
});