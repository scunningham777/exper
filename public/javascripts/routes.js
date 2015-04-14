application.config(function($stateProvider, $urlRouterProvider) {

	$urlRouterProvider.otherwise("/");

	$stateProvider.state('skills', {
		url: "/",
		templateUrl: "partials/skills.html",
		location:"false"
	});

	$stateProvider.state('addEditSession', {
/*		params: {
			sessionId: undefined,
			sessionDuration: undefined,
			sessionDate: undefined,
			skillId: undefined
		},*/
		templateUrl: "partials/addEditSession.html",
		location:"false"
	});

	$stateProvider.state('addEditSkill', {
		params: {
			skillId: undefined,
			skillName: undefined
		},
//		url:'/editSkill/:skillId',
		templateUrl: "partials/addEditSkill.html",
		resolve: "console.log('switching to state AddEditSkill')",
		location:"false"
	});
})