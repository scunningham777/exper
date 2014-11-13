var express = require('express');
var async = require('async');

var router = express.Router();

/***********************************
 * FOR NOW, ALL DB OPERATIONS
 * SHOULD USE THE FOLLOWING USER ID:
 * 544d8ff19216375f8f23fade
 ***********************************/

/*Kind of a hack for now, but redirect any "sessions" calls to the sessions route*/
//router.all('/skills/:skillname/sessions', sessions);


/*
 * GET all skills. 
 */
router.get('/', function(req, res) {
    var db = req.db;
    db.collection('skillcollection').find({user_id:'544d8ff19216375f8f23fade'}).toArray(function (err, items) {
        res.json(items);
    });
});


/*
 * GET all skills with durations added.
 */
router.get('/listwithduration', function(req, res) {
    var db = req.db;
    db.collection('skillcollection').find({user_id:'544d8ff19216375f8f23fade'}).toArray(function (err, items) {
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
router.post('/addskill', function(req, res) {
	var db = req.db;
    var requestedSkillAlreadyExists = false;
    db.collection('skillcollection').find({user_id:'544d8ff19216375f8f23fade', name:req.body.name}, function(err, result) {
        if (result.length > 0) {
            requestedSkillAlreadyExists = true;
            res.send( {msg: 'Skill with same name already exists'});
        }
    })
    if (requestedSkillAlreadyExists == false){
        db.collection('skillcollection').insert({user_id:'544d8ff19216375f8f23fade', name:req.body.name}, function(err, result){
            res.send(
                (err === null) ? { msg: '' } : { msg: err }
            );
        });
    }
})


/*
 * PUT to update existing skills
 */
router.put('/editskill/:id', function(req, res) {
    var db = req.db;
    var skillToUpdate = req.params.id;
    db.collection('skillcollection').updateById(skillToUpdate, {$set: {name: req.body.name}}, function(err, result) {
        res.send(
            (result === 1) ? {msg:''} : {msg:'error: ' + err}
        );
    });
})

router.delete('/deleteskill/:id', function(req, res) {
    var db = req.db;
    var skillToDelete = req.params.id;
    db.collection('skillcollection').removeById(skillToDelete, function(err, result) {
        res.send(
            (result === 1) ? {msg: ''} : {msg: 'error: ' + err}
        );
    });
})

module.exports = router;