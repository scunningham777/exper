//var express = require('express');
//var router = express.Router();

/***********************************
 * FOR NOW, ALL DB OPERATIONS
 * SHOULD USE THE FOLLOWING USER ID:
 * 544d8ff19216375f8f23fade
 ***********************************/

/*
 * GET all sessions for the selected skill
 */
/*exports.listForSkill = function(req, res) {
	var db = req.db;
	var skillName = req.params.skillname;

	db.collection('usercollection').findOne({_id: db.toObjectID('544d8ff19216375f8f23fade'), 'skills.name': skillName}, {'skills.$': 1}, function(err, result) {
//    db.collection('usercollection').findOne({_id: db.toObjectID('544d92099216375f8f23fae0'), 'skills.name': skillName}, {'skills.$': 1}, function(err, result) {
		res.json(result.skills[0].sessions);
	});
};*/

/*
 * POST to add new session 
 */
/*exports.add = function(req, res) {
    var db = req.db;
    var skillName = req.params.skillname;
    var userId = '544d8ff19216375f8f23fade';
//    var userId = '544d92099216375f8f23fae0';
    db.collection('usercollection').update({_id: db.toObjectID(userId), 'skills.name': skillName}, {'$push': {"skills.$.sessions": req.body}}, function(err, result){
        res.send(
            (err === null) ? { msg: '' } : { msg: err }
        );
    });
};*/




/*
 * GET all sessions for the selected skill **SEPARATE DOCUMENT FOR SKILLS**
 */
exports.listForSkill = function(req, res) {
    var db = req.db;
    var skill_id = req.params.skill_id;

    db.collection('sessioncollection').find({'skill_id': skill_id}).toArray(function(err, result) {
        res.json(result);
    });
};

/*
 * POST to add new session **SEPARATE DOCUMENT FOR SKILLS**
 */
exports.add = function(req, res) {
    var db = req.db;
    var newSession = req.body;
    newSession.skill_id = req.params.skill_id;
    newSession.user_id = '544d8ff19216375f8f23fade';
    newSession.duration = parseFloat(req.body.duration);
    db.collection('sessioncollection').insert(newSession, function(err, result) {
            res.send(
                (err === null) ? { msg: '' } : { msg: err }
            );
    });
};

/*
 * GET single session by session id alone
 */
exports.getById = function(req, res) {
    var db = req.db;
    db.collection('sessioncollection').findById(req.params.session_id, function(err, result) {
        res.json(result);
    });
}


exports.deleteSession = function(req, res) {
    var db = req.db;
    db.collection('sessioncollection').removeById(req.params.session_id, function(err, result) {
        res.send(
            (result === 1) ? {msg: ''} : {msg: 'error: ' + err}
        );
    });

}

exports.editSession = function(req, res) {
    var db = req.db;
    var session = req.body;
    var newSessionDuration = parseFloat(session.duration);
    db.collection('sessioncollection').updateById(req.params.session_id, {$set:{skill_id : session.skillId, date : session.date, duration : newSessionDuration}}, function(err, result) {
//        if (!err) console.info('Session Updated Successfully');
        res.send(
            (err === null) ? { msg: '' } : { msg: err }
        );

    });
}