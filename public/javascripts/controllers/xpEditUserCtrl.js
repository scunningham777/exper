'use strict';

application.controller('xpEditUserCtrl', function($scope, $state, $ionicModal, xpIdentity, $http, $log) {
    $ionicModal.fromTemplateUrl('../../partials/editUser.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.modal = modal;
        $scope.modal.show();
    });

    $http.get("/users/" + xpIdentity.currentUserId).
        success(function(data, status, headers, config) {
            $scope.curUser = data;
        }).
        error(function(data, status, headers, config){
            $log.log("User request failed");
            $scope.closeModal();
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


    $scope.submit = function (skill) {
        $http.post("/users/" + xpIdentity.currentUserId, $scope.curUser).
            success(function(data, status, headers, config) {
                $scope.closeModal();
            }).
            error(function(data, status, headers, config) {
                $log.log("Error submitting User edits: " + data.msg);
            });
    }
})

