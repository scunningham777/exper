var express = require('express');
var router = express.Router();

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
 * POST user login
 */
router.post('/login', function(req, res) {
	var db = req.db;
    req.body.username = req.body.username.toLowerCase();
	db.collection('usercollection').findOne({username:req.body.username, password:req.body.password}, function (err, result) {
		if (err) {
			console.info(err);
			res.send({msg: 'error: ' + err});
		}
		if (result) {		
			req.session.currentUserId = result._id;
			res.send({user_id: result._id});
		}
		else {
			res.send({msg: 'invalid credentials'});
		}
	});
});

/*
 * POST user signup
 */
router.post('/adduniqueuser', function(req, res) {
	var db = req.db;
    req.body.username = req.body.username.toLowerCase();
    db.collection('usercollection').find({username:req.body.username, password:req.body.password}).toArray(function(err, result) {
        if (result.length > 0) {
            console.info('User Account with same username/password already exists');
            res.send( {msg: 'User Account with same username/password already exists'});
        }
        else {
            db.collection('usercollection').insert({username:req.body.username, password:req.body.password}, function(err, result){
            	if (err === null) {
					req.session.currentUserId = result._id;
					res.send({user_id: result._id});
            	}
                else {
                	res.send({ msg: err });
                }
            });            
        }
    })
})

module.exports = router;
