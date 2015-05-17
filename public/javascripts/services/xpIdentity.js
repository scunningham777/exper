application.factory("xpIdentity", function($window, $q) {
    var currentUserId;
    if (!!$window.bootstrappedExperCurrentUserId) {
        currentUserId = $window.bootstrappedExperCurrentUserId;
    }
    return {
        currentUserId: currentUserId,
        isLoggedIn: function() {
            if (!!this.currentUserId) {
                return true;
            }
            else{
                return $q.reject('not authenticated');
            }
        },
        logOut: function() {
            this.currentUserId = undefined;
            window.location.assign("/signout");
        }
    }
})
