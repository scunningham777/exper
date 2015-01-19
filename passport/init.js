var login = require('./login');
var signup = require('./signup');

module.exports = function(passport, db){
	passport.serializeUser(function(user, done) {
	  done(null, user._id);
	});
	 
	passport.deserializeUser(function(id, done) {
	  db.collection('usercollection').findById(id, function(err, user) {
	    done(err, user);
	  });
	});

	login(passport);
	signup(passport);
}