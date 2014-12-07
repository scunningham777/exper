var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var mongo = require('mongoskin');
var db = mongo.db('mongodb://localhost:27017/productivity-tracker', {native_parser:true});

var routes = require('./routes/index');
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
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

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
