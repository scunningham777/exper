application.config(function($stateProvider, $urlRouterProvider) {

/*	$urlRouterProvider.when("/signout", function() {
		window.location.reload();
	});
*/	$urlRouterProvider.otherwise("/");

	$stateProvider.state('skills', {
		url: "/",
		templateUrl: "partials/skills.html",
		location:"false"
	});

	$stateProvider.state('addEditSession', {
		params: {
			sessionId: null,
			sessionDuration: null,
			sessionDate: null,
			skillId: null
		},
		controller: "mxAddEditSessionCtrl",
		resolve: {
			skills: function(mxSkill) {
				return mxSkill.query().$promise;
			}
		},
		location:"false"
	});

	$stateProvider.state('addEditSkill', {
		controller: "mxAddEditSkillCtrl",
		params: {
			skillId: null,
			skillName: null
		},
		location:"false"
	});
});