'use strict';

application.controller('mxHeaderButtonCtrl', function($scope, $http, $ionicPopover, $state) {

    $scope.links = [
        {text: 'Log Out', onClick: 'confirmSignout'},
        {text: 'Edit Account', onClick: "goToEditUser"}
    ];

    var template = '<ion-popover-view class="popover-fit">' +
        '<div class="list" style="margin-top:20px;">' +
            '<a class="item" ng-repeat="link in links" ng-click={{link.onClick}}()>' +
                '{{link.text}}' +
            '</a>' +
        '</div>' +
        '</ion-popover-view>';

    $scope.popover = $ionicPopover.fromTemplate(template, {
        scope: $scope
    });

    $scope.confirmSignout = function() {
        if (confirm('Are you sure you want to log out?')){
            window.location.assign("/signout");
        }
    };

    $scope.goToEditUser = function() {
        $scope.closePopover();
        $state.go('editUser');
    }

    $scope.openPopover = function($event) {
        $scope.popover.show($event);
    };
    $scope.closePopover = function() {
        $scope.popover.hide();
    };
    //Cleanup the popover when we're done with it!
    $scope.$on('$destroy', function() {
        $scope.popover.remove();
    });
    // Execute action on hide popover
    $scope.$on('popover.hidden', function() {
        // Execute action
    });
    // Execute action on remove popover
    $scope.$on('popover.removed', function() {
        // Execute action
    });
});

