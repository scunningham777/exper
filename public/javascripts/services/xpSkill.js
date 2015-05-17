application.factory('xpSkill', function($resource) {
	var SkillResource = $resource('/skills/:action/:id', {}, {
		listWithDuration: {method: 'GET', params:{action: 'listwithduration'}, isArray:true},
		addNew: {method: 'POST', params:{action: 'addskill'}, isArray:false},
		edit: {method: 'POST', params:{action: 'editskill', id: '@id'}, isArray:false},
		deleteById: {method: 'DELETE', params:{action: 'deleteskill', id: '@id'}, isArray: false}
	});

	return SkillResource;
})