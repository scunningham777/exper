application.config(function($stateProvider, $urlRouterProvider) {

	$urlRouterProvider.otherwise("/");

	$stateProvider.state('skills', {
		url: "/",
		templateUrl: "partials/skills.html",
		location:"false"
	});

	$stateProvider.state('addEditSession', {
		templateUrl: "partials/addEditSession.html",
		location:"false"
	});

	$stateProvider.state('addEditSkill', {
		url:'/editSkill/:skillId'
		templateUrl: "partials/addEditSkill.html",
		location:"false"
	});
})