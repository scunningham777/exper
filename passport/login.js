var LocalStrategy   = require('passport-local').Strategy;
var bCrypt = require('bcrypt-nodejs');

module.exports = function(passport) {
	passport.use('login', new LocalStrategy({
	        passReqToCallback : true
	    }, 
	    function(req, username, password, done) {
	        // check in mongo if a user with username exists or not
	        req.db.collection('usercollection').findOne({ 'username' :  username }, 
	          function(err, user) {
	            // In case of any error, return using the done method
	            if (err)
	              return done(err);
	            // Username does not exist, log error & redirect back
	            if (!user){
	              console.info('User Not Found with username ' + username);
	              return done(null, false,  req.flash('message', 'User Not found.'));                 
	            }
	            // User exists but wrong password, log the error 
	            if (!isValidPassword(user, password)){
	              console.info('Invalid Password');
	              return done(null, false, req.flash('message', 'Invalid Password'));
	            }
	            // User and password both match, return user from 
	            // done method which will be treated like success
	            req.session.currentUserId = user._id;
	            return done(null, user);
	          }
	        );
	    })
	);

	var isValidPassword = function(user, password){
        try {
            return bCrypt.compareSync(password, user.password);
        }
        catch(e) {
           console.info(e); 
           return false;
        }
    }
}