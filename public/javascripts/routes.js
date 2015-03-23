application.config(function($stateProvider, $urlRouterProvider) {

	$urlRouterProvider.otherwise("/");

	$stateProvider.state('skills', {
		url: "/",
		templateUrl: "partials/skills.html"
	});

	$stateProvider.state('addEditSession', {
		templateUrl: "partials/addEditSession.html"
	});
})