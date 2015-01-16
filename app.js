var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session');
var bodyParser = require('body-parser');
var passport = require('passport');
var bCrypt = require('bcrypt-nodejs');
var LocalStrategy   = require('passport-local').Strategy;
var flash = require('connect-flash');

var mongo = require('mongoskin');
var db = mongo.db('mongodb://localhost:27017/productivity-tracker', {native_parser:true});

var routes = require('./routes/index')(passport);
var users = require('./routes/users');
var skills = require('./routes/skills');
var sessions = require('./routes/sessions');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser('w00dh3ng3'));
app.use(cookieSession({keys: ['key1']}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash());

// Make our db accessible to our router
app.use(function(req,res,next){
    db.toObjectID = mongo.helper.toObjectID;
    req.db = db;
    next();
});

app.use('/', routes);
app.use('/users', users);
app.use('/skills', skills);
app.get('/skills/:skill_id/sessions', sessions.listForSkill);
app.post('/skills/:skill_id/sessions/addsession', sessions.add);
app.get('/sessions/:session_id', sessions.getById);
app.delete('/sessions/deletesession/:session_id', sessions.deleteSession);
app.post('/sessions/editsession/:session_id', sessions.editSession);

/*app.get('/hashSeansPassword', function(req, res) {
    db.collection('usercollection').update({'username':'Sean'}, {$set:{'password':createHash('tallman44')}}, function(err, result){
        if (err) {
            res.render("Error");
        }
        else {
            res.render("Success");
        }
    });
});*/

//Login management
passport.serializeUser(function(user, done) {
  done(null, user._id);
});
 
passport.deserializeUser(function(id, done) {
  db.collection('usercollection').findById(id, function(err, user) {
    done(err, user);
  });
});

passport.use('login', new LocalStrategy({
        passReqToCallback : true
    }, 
    function(req, username, password, done) {
        // check in mongo if a user with username exists or not
        db.collection('usercollection').findOne({ 'username' :  username }, 
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
        //todo: gracefully handle user.password not being valid bCrypt hash
        try {
            return bCrypt.compareSync(password, user.password);
        }
        catch(e) {
           console.info(e); 
           return false;
        }
    }

passport.use('signup', new LocalStrategy({
        passReqToCallback : true
    },
    function(req, username, password, done) {
        findOrCreateUser = function(){
          // find a user in Mongo with provided username
          db.collection('usercollection').findOne({'username':username}, 
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
                    db.collection('usercollection').insert({username:username, password:createHash(password)}, function(err, result){
                        if (err){
                          console.info('Error in Saving user: ' + err);  
                          throw err;  
                        }
                        console.info('User Registration succesful');    
                        console.info(result);
                        return done(null, result[0]);
                    });            



    /*              var newUser = new User();
                  // set the user's local credentials
                  newUser.username = username;
                  newUser.password = createHash(password);
         
                  // save the user
                  newUser.save(function(err) {
                    if (err){
                      console.log('Error in Saving user: '+err);  
                      throw err;  
                    }
                    console.log('User Registration succesful');    
                    return done(null, newUser);
                  });
    */
                }
            });
        };
     
    // Delay the execution of findOrCreateUser and execute 
    // the method in the next tick of the event loop
    process.nextTick(findOrCreateUser);
    })
);

// Generates hash using bCrypt
var createHash = function(password){
    return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
}





/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;
