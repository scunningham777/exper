var express = require('express');
var router = express.Router();

/* require authentication for all pages */
router.all('*', function(req, res, next) {
    next();
})

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'JQuery Productivity Tracker App!' });
});

module.exports = router;
