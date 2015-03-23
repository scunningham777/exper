application.factory('mxSkill', function($resource) {
	var SkillResource = $resource('/skills/:action/:id', {}, {
		listWithDuration: {method: 'GET', params:{action: 'listwithduration'}, isArray:true},
		addNew: {method: 'POST', params:{action: 'addskill'}, isArray:false}
	});

	return SkillResource;
})