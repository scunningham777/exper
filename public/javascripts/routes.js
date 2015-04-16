application.config(function($stateProvider, $urlRouterProvider) {

	$urlRouterProvider.otherwise("/");

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
		templateUrl: "partials/addEditSession.html",
		location:"false"
	});

	$stateProvider.state('addEditSkill', {
		templateUrl: "partials/addEditSkill.html",
		params: {
			skillId: null,
			skillName: null
		},
		location:"false"
	});
})