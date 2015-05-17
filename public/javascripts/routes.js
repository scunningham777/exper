application.config(function($stateProvider, $urlRouterProvider) {

	$urlRouterProvider.otherwise("/");

	$stateProvider.state('skills', {
		url: "/",
		templateUrl: "partials/skills.html",
		resolve: {auth: function(xpIdentity) {
			xpIdentity.isLoggedIn();
		}},
		location:"false"
	});

	$stateProvider.state('addEditSession', {
		params: {
			sessionId: null,
			sessionDuration: null,
			sessionDate: null,
			skillId: null
		},
		controller: "xpAddEditSessionCtrl",
		resolve: {
			skills: function(xpSkill) {
				return xpSkill.query().$promise;
			}
		},
		location:"false"
	});

	$stateProvider.state('addEditSkill', {
		controller: "xpAddEditSkillCtrl",
		params: {
			skillId: null,
			skillName: null
		},
		location:"false"
	});

	$stateProvider.state('editUser', {
		controller: "xpEditUserCtrl",
		location:"false"
	});

	$stateProvider.state('help', {
		controller: "xpHelpCtrl",
		location:"false"
	});
});

application.run(function($rootScope) {
	$rootScope.$on('$routeChangeError', function(evt, current, previous, rejection) {
		if (rejection === 'not authenticated') {
			window.location.assign("/signout");
		}
	})
})