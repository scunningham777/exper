var express = require('express');
var router = express.Router();

/* require authentication for all pages */
/*router.all('*', function(req, res, next) {
    next();
})
*/

/* GET home page. */
/*router.get('/', function(req, res) {
  res.render('index', { title: 'JQuery Productivity Tracker App!' });
});

module.exports = router;
*/

var isAuthenticated = function (req, res, next) {
    // if user is authenticated in the session, call the next() to call the next request handler 
    // Passport adds this method to request object. A middleware is allowed to add properties to
    // request and response objects
    if (req.isAuthenticated())
        return next();
    // if the user is not authenticated then redirect him to the login page
    res.redirect('/');
}

module.exports = function(passport){

    /* GET login page. */
    router.get('/', function(req, res) {
        // Display the Login page with any flash message, if any
//        res.render('index', { message: req.flash('message') });
       res.render('login', { message: req.flash('message'), title: 'ProductivityTracker - Login' });
    });

    // for completeness sake
    router.get('/login', function(req, res) {
        res.redirect('/');
    })

    /* Handle Login POST */
    router.post('/login', passport.authenticate('login', {
        successRedirect: '/home',
        failureRedirect: '/',
        failureFlash : true  
    }));

    /* GET Registration Page */
    router.get('/signup', function(req, res){
        res.render('newuser', {message: req.flash('message'), title: 'ProductivityTracker - New User Signup'});
    });

    /* Handle Registration POST */
    router.post('/signup', passport.authenticate('signup', {
        successRedirect: '/home',
        failureRedirect: '/signup',
        failureFlash : true  
    }));

    /* GET Home Page */
    router.get('/home', isAuthenticated, function(req, res){
        res.render('index', { user: req.user, title: 'ProductivityTracker' });
    });

    /* Handle Logout */
    router.get('/signout', function(req, res) {
        req.logout();
        req.session.currentUserId = 0;
        res.redirect('/');
    });

    return router;
}
