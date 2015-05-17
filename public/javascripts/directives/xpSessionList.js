'use strict'

application.directive('xpSessionList', function() {
    return {
        restrict: 'E',
        template: '<ion-item class="item-accordian padding-horizontal" ng-repeat="session in skill.sessions">
    {{stringifyDate(session.date)}}
    <button class="badge badge-light" style="background-color:#D0DCEB; border-width:1px">{{session.duration}} hrs</button>
<ion-delete-button class="ion-minus-circled" ng-click="deleteSession(session)">
    </ion-delete-button>
    <ion-option-button class="button-assertive" ng-click="editSession(session); $event.stopPropagation();">
    Edit
    </ion-option-button>
    </ion-item>
    ',
        scope:{
            skill: '='
        }
    }
})