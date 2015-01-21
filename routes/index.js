var express = require('express');
var router = express.Router();
var async = require('async');
var crypto = require('crypto');

var isAuthenticated = require('./isAuthenticated');

module.exports = function(passport){

    /* GET login page. */
    router.get('/', function(req, res) {
        if (req.isAuthenticated()) {
            res.redirect('/home');
        }
        else {
            res.render('login', { message: req.flash('message'), title: 'ProductivityTracker - Login' });
        }
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

    /* User forgot password */
    router.get('/forgot', function(req, res) {
      res.render('forgot');
    });

    router.post('/forgot', function(req, res, next) {
        async.waterfall([
            function(done) {
              crypto.randomBytes(20, function(err, buf) {
                var token = buf.toString('hex');
                done(err, token);
              });
            },
            function(token, done) {
              var dbUsers = req.db.collection('userclollection');
              dbUsers.findOne({ username: req.body.username }, function(err, user) {
                if (!user) {
                  req.flash('message', 'No account with that username exists.');
                  return res.redirect('/forgot');
                }

                var resetPasswordToken = token;
                var resetPasswordExpires = Date.now() + 3600000; // 1 hour

                dbUsers.updateById(req.db.toObjectID(user._id), {$set: {resetPasswordToken: resetPasswordToken, resetPasswordExpires: resetPasswordExpires}}, function(err, result) {
                  done(err, token, user);
                });
              });
            },
            function(token, user, done) {
              var smtpTransport = nodemailer.createTransport('SMTP', {
                service: 'Gmail',
                auth: {
                  user: '!!Gmail username here!!',
                  pass: '!!Gmail password here!!'
                }
              });
              var mailOptions = {
                to: user.email,
                from: 'NO-REPLY@cunninghameditorial.com',
                subject: 'ProductivityTracker Password Reset',
                text: 'You are receiving this because you have (or someone else has) requested the reset of the password for your account on ProductivityTracker.\n\n' +
                  'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                  'http://' + req.headers.host + '/reset/' + token + '\n\n' +
                  'If you did not request this, please ignore this email and your password will remain unchanged.\n'
              };
              smtpTransport.sendMail(mailOptions, function(err) {
                req.flash('message', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
                done(err, 'done');
              });
            }
        ], function(err) {
            if (err) return next(err);
            res.redirect('/forgot');
        });
    });

    //user is resetting password
    router.get('/reset/:token', function(req, res) {
      req.db.collection('usercollection').findOne({resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
        if (!user) {
          req.flash('message', 'Password reset token is invalid or has expired.');
          return res.redirect('/forgot');
        }
        res.render('reset');
      });
    });

    router.post('/reset/:token', function(req, res) {
      async.waterfall([
        function(done) {
          req.db.collection('usercollection').findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
            if (!user) {
              req.flash('message', 'Password reset token is invalid or has expired.');
              return res.redirect('back');
            }

            user.password = bCrypt.hashSync(req.body.password, bCrypt.genSaltSync(10), null);
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;

            req.db.collection('usercollection').update({$set:{password:user.password, resetPasswordToken:undefined, resetPasswordExpires:undefined}}, function(err) {
              req.logIn(user, function(err) {
                done(err, user);
              });
            });
          });
        },
        function(user, done) {
          var smtpTransport = nodemailer.createTransport('SMTP', {
            service: 'Gmail',
            auth: {
              user: '!!Gmail username here!!',
              pass: '!!Gmail password here!!'
            }
          });
          var mailOptions = {
            to: user.email,
            from: 'NO-REPLY@cunninghameditorial.com',
            subject: 'Your ProductivityTracker password has been changed',
            text: 'Hello,\n\n' +
              'This is a confirmation that the password for your account ' + user.username + ' has just been changed.\n'
          };
          smtpTransport.sendMail(mailOptions, function(err) {
            req.flash('success', 'Success! Your password has been changed.');
            done(err);
          });
        }
      ], function(err) {
        res.redirect('/');
      });
    });


    return router;
}
