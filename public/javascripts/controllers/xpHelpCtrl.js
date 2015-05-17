'use strict';

application.controller('xpHelpCtrl', function($scope, $state, $ionicModal) {
    $ionicModal.fromTemplateUrl('../../partials/help.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.modal = modal;
        $scope.modal.show();
    });

    $scope.openModal = function () {
        $scope.modal.show();
    };
    $scope.closeModal = function () {
        $scope.modal.hide();
        $state.go('skills')
    }
    //Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function () {
        $scope.modal.remove();
    });

})
