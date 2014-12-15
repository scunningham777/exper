/*
 * GET all sessions for the selected skill
 */
exports.listForSkill = function(req, res) {
    var db = req.db;
    var skill_id = req.params.skill_id;

    db.collection('sessioncollection').find({'skill_id': skill_id}).toArray(function(err, result) {
        res.json(result);
    });
};

/*
 * POST to add new session
 */
exports.add = function(req, res) {
    var db = req.db;
    var newSession = req.body;
    newSession.skill_id = req.params.skill_id;
    newSession.user_id = req.session.currentUserId;
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
        res.send(
            (err === null) ? { msg: '' } : { msg: err }
        );

    });
}