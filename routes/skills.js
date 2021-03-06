var express = require('express');
var async = require('async');

var isAuthed = require('./isAuthenticated');

var router = express.Router();

/*
 * GET all skills. 
 */
router.get('/', isAuthed, function(req, res) {
    var db = req.db;
    db.collection('skillcollection').find({user_id:req.session.currentUserId}).toArray(function (err, items) {
        res.json(items);
    });
});


/*
 * GET all skills with durations added.
 */
router.get('/listwithduration', isAuthed, function(req, res) {
    var db = req.db;
    db.collection('skillcollection').find({user_id:req.session.currentUserId}).toArray(function (err, items) {
        if (err) {console.info(err)};
        var convertedResults = [];

        async.each(items, function(currentSkill, cb) {
            db.collection('sessioncollection').aggregate([
                    {$match:{'skill_id': currentSkill._id.toString()}},
                    {$group:{_id: '$skill_id', 'totalDuration': {$sum: '$duration'}}}
                ], function(err, result) {
                    if (err) {console.info(err)};

                    if (result != null && result.length > 0 && result[0].totalDuration != null) {
                        currentSkill.totalDuration = result[0].totalDuration;
                    }
                    else {
                        currentSkill.totalDuration = 0;
                    }

                    convertedResults.push(currentSkill);
                    cb(err);
                });

        }, function(error) {
            res.json(convertedResults);
        });
    });
});


/*
 * POST to add new skill 
 */
router.post('/addskill', isAuthed, function(req, res) {
	var db = req.db;
    var requestedSkillAlreadyExists = false;
    db.collection('skillcollection').find({user_id:req.session.currentUserId, name:req.body.name}).toArray(function(err, result) {
        if (result.length > 0) {
            requestedSkillAlreadyExists = true;
            console.info('Skill with same name already exists');
            res.send( {msg: 'Skill with same name already exists'});
        }
        else {
            db.collection('skillcollection').insert({user_id:req.session.currentUserId, name:req.body.name}, function(err, result){
                res.send(
                    (err === null) ? { msg: '' } : { msg: err }
                );
            });            
        }
    })
})


/*
 * POST to update existing skills
 */
router.post('/editskill/:id', isAuthed, function(req, res) {
    var db = req.db;
    var skillToUpdate = req.params.id;
    db.collection('skillcollection').updateById(skillToUpdate, {$set: {name: req.body.name}}, function(err, result) {
        res.send(
            (result === 1) ? {msg:''} : {msg:'error: ' + err}
        );
    });
})

router.delete('/deleteskill/:id', isAuthed, function(req, res) {
    var db = req.db;
    var skillToDelete = req.params.id;
    db.collection('skillcollection').removeById(skillToDelete, function(err, result) {
        res.send(
            (result === 1) ? {msg: ''} : {msg: 'error: ' + err}
        );
    });
})

module.exports = router;