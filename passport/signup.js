var LocalStrategy   = require('passport-local').Strategy;
var bCrypt = require('bcrypt-nodejs');

module.exports = function(passport) {
	passport.use('signup', new LocalStrategy({
	        passReqToCallback : true
	    },
	    function(req, username, password, done) {
	        findOrCreateUser = function(){
	          // find a user in Mongo with provided username
	          req.db.collection('usercollection').findOne({'username':username}, 
	            function(err, user) {
	                // In case of any error return
	                if (err){
	                    console.info('Error in SignUp: ' + err);
	                    return done(err);
	                }
	                // already exists
	                if (user) {
	                    console.info('User already exists');
	                    return done(null, false, req.flash('message','User Already Exists'));
	                } else {
	                  // if there is no user with that username
	                  // create the user
	                    req.db.collection('usercollection').insert({username:username, password:createHash(password), email:req.param(email)}, function(err, result){
	                        if (err){
	                          console.info('Error in Saving user: ' + err);  
	                          throw err;  
	                        }
	                        console.info('User Registration succesful');    
	                        console.info(result);
	                        return done(null, result[0]);
	                    });            

	                }
	            });
	        };

		    //simple form validation
		    if (username == null || username == "" || password == null || password == "" || req.param(email) == null || req.param(email) == "") {
		    	console.info('Invalid User information given');
		    	done(null, false, req.flash('error', 'Invalid User info provided');
		    }
		     
		    // Delay the execution of findOrCreateUser and execute 
		    // the method in the next tick of the event loop
		    process.nextTick(findOrCreateUser);
		    })
	    }
	);

	// Generates hash using bCrypt
	var createHash = function(password){
	    return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
	}
}