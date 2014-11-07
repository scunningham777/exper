var express = require('express');
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
//    db.collection('usercollection').findById('544d8ff19216375f8f23fade', function (err, result) {
    db.collection('usercollection').findById('544d92099216375f8f23fae0', function (err, result) {    
        var convertedResults = [];
        var currentSkill;
        var skillDuration;

        if (result.skills != null && result.skills.length > 0){
            result.skills.forEach(function(value, index, array) {
                currentSkill = {'name': value.name};
                skillDuration = 0;
                if (value.sessions != null && value.sessions.length > 0){
                    value.sessions.forEach(function(value, index, array) {
                        skillDuration += parseFloat(value.duration);
                    })
                    currentSkill.totalDuration = skillDuration;
                }
                else {
                    currentSkill.totalDuration = 0;
                }
                convertedResults.push(currentSkill);
            })
        }
        res.json(convertedResults);
    });
});

/*
 * POST to add new skill 
 */
//TODO: only push if a skill with the same name does not exist already!
router.post('/addskill', function(req, res) {
    var db = req.db;
//    db.collection('usercollection').updateById('544d8ff19216375f8f23fade', {'$push': {skills: req.body}}, function(err, result){
    db.collection('usercollection').updateById('544d92099216375f8f23fae0', {'$push': {skills: req.body}}, function(err, result){
        res.send(
            (err === null) ? { msg: '' } : { msg: err }
        );
    });
});








/*
 * GET all skills. **SEPARATE DOCUMENT FOR SKILLS**
 */
/*router.get('/', function(req, res) {
    var db = req.db;
    db.collection('skillcollection').find().toArray(function (err, items) {
        res.json(items);
    });
});
*/

/*
 * POST to add new skill **SEPARATE DOCUMENT FOR SKILLS**
 */
/*router.post('/addskill', function(req, res) {
	var db = req.db;
    db.collection('skillcollection').insert(req.body, function(err, result){
        res.send(
            (err === null) ? { msg: '' } : { msg: err }
        );
    });
})
*/

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