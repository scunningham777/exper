application.factory('xpSession', function($resource) {
	var SessionResource = $resource('/:prefix/:skillId/sessions/:action/:id', {}, {
		listForSkill: {method: 'GET', params:{prefix: 'skills', skillId: '@skillId'}, isArray:true},
		getById: {method: 'GET', params:{id: '@id'}, isArray: false},
		addNew: {method: 'POST', params:{prefix: 'skills', skillId: '@skillId', action: 'addsession'}, isArray:false},
		edit: {method: 'POST', params:{action: 'editsession', id: '@id'}, isArray:false},
		deleteById: {method: 'DELETE', params:{action: 'deletesession', id: '@id'}, isArray: false}
	});

	return SessionResource;
})