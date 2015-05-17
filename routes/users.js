var express = require('express');
var router = express.Router();

var isAuthed = require('./isAuthenticated');

/*
 * GET userlist.
 */
router.get('/userlist', function(req, res) {
    var db = req.db;
    db.collection('usercollection').find().toArray(function (err, items) {
        res.json(items);
    });
});

/*
 * GET user by user ID
 */
router.get('/:userId', isAuthed, function(req, res) {
	var db = req.db;
	db.collection('usercollection').findById(req.params.userId, function(err, result) {
		res.json({_id: result._id, username: result.username, email: result.email})
	})
});

router.post('/:userId', isAuthed, function(req, res) {
	var db = req.db;
	console.dir(req.body);
	db.collection('usercollection').updateById(req.params.userId, {$set:{username: req.body.username, email: req.body.email}}, function(err, result) {
		res.send(
			(err === null) ? { msg: '' } : { msg: err }
		);
	})
});

/*
 * user login and signup now handled by passport (see routes/index.js)
 */


module.exports = router;
