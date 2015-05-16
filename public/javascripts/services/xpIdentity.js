application.factory("xpIdentity", function($window) {
    var currentUserId;
    if (!!$window.bootstrappedExperCurrentUserId) {
        currentUserId = $window.bootstrappedExperCurrentUserId;
    }
    return {
        currentUserId: currentUserId,
        isAuthenticated: function() {
            return !!this.currentUserId;
        }
    }
})
