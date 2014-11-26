var superNamespaceSafeProductivityTrackerEditModeIsActive = false;


// DOM Ready =============================================================
$(document).ready(function() {

    //Add Skill button click
    $('#btnAddSkill').on('click', addSkill);

    //Edit Skills button click?
    //Edit skill button click
    $('#skillList table tbody').on('click', '.editable .editskill', editSkill);
    //Delete skill button click
    $('#skillList table tbody').on('click', '.deletable a.deleteskill', deleteSkill);
    //Edit session button click
    $('#skillList table tbody').on('click', '.editable a.editsession', editSession);
    //Delete session button click
    $('#skillList table tbody').on('click', '.deletable a.deletesession', deleteSession);

    //Click on a skill name to add new session for that skill
    $('#skillList table tbody').on('click', 'td a.linkaddtoskill', handleNewSessionEvent);
    //Click on a total duration value to vew session list for that skill
    $('#skillList table tbody').on('click', 'td a.linkexpandskill', showSessionListForSkill);

    //Click to open new session form
    $('#btnNewSession').on('click', handleNewSessionEvent);

    //Toggle Edit Mode
    $('#btnToggleEditMode').on('click', toggleEditMode);
 
    //Add Session button click
    $('#btnCancelAddSession').on('click', populateSkillTable);
    $('#btnSubmitAddSession').on('click', submitNewSession);

    // default to add new session view, which will redirect to skills list if no skills exist for user
    handleNewSessionEvent();
//    populateSkillTable();

});

// Functions =============================================================

// Fill table with data
function populateSkillTable() {

    hideAllViews();
    $('#skillListView').show();

    // Empty content string
    var tableContent = '';

    // jQuery AJAX call for JSON
    $.getJSON( '/skills/listwithduration', function( data ) {

        if (data.length > 0){
            // For each item in our JSON, add a table row and cells to the content string
            $.each(data, function(){
                tableContent += '<tr class="skillListRow">';
                tableContent += '<td class="deletable" style="display:none"><a href="" class="deleteskill" rel="' + this._id + '" title="Delete Skill">X</a></td>';
                tableContent += '<td><a href="" class="linkaddtoskill" rel="' + this._id + '" title="Add Session">' + this.name + '</a></td>';
                tableContent += '<td><a href="" class="linkexpandskill" rel="' + this._id + '" title="Show Session List">' + this.totalDuration + '</a></td>';
    //            tableContent += '<td><a href="#" class="linkdeleteuser" rel="' + this._id + '">delete</a></td>';
                tableContent += '</tr>';
            });
        }
        else {
            tableContent = '<tr style="color:red"><td>No Skills yet!</td><td>Add a new one below</td></tr>';
        }

        // Inject the whole content string into our existing HTML table
        $('#skillList table tbody').html(tableContent);
    });
};

// Add Skill
function addSkill(event) {
    event.preventDefault();

    //check to make sure the input value is not empty
    if ($('#addSkill input').val() !== '') {
        var newSkill = {
            'name': $('#addSkill input#inputSkillName').val()
        };

        //use AJAX to post the object to our addSkill service
        $.ajax({
            type: 'POST',
            data: newSkill,
            url: '/skills/addskill',
            dataType: 'JSON'
        }).done(function( response ) {

            //check for successful (blank) response
            if (response.msg === '') {

                //Clear form inputs
                $('#addSkill input').val('');

                //update the table
                populateSkillTable();
            }
            else {
                 // If something goes wrong, alert the error message that our service returned
                alert('Error: ' + response.msg);

            }
        });
    }
    else {
        // If errorCount is more than 0, error out
        alert('Please fill in all fields');
        return false;
    }
}

function handleNewSessionEvent(event) {
    if (event != null) {
        event.preventDefault();
    }

/*    hideAllViews();
    $('#inputSessionDuration').val(0);
    var now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    var sessionDateField = $('#inputSessionDate').get(0)
    sessionDateField.valueAsDate = now;
    $('#addSessionView').show();

    // Empty content string
    var formContent = '';
*/
    var sessionParams = {};
    if (event !== null && $(this).attr('rel') !== null) {
        sessionParams.skillId = $(this).attr('rel');
    }

    openSessionView(sessionParams);

    // jQuery AJAX call for JSON
/*    $.getJSON( '/skills', function( data ) {
        if (data == null || data.length <= 0) {
            populateSkillTable();
            return;
        }
        // For each item in our JSON, add a table row and cells to the content string
        $.each(data, function(){
            formContent += '<option value="' + this._id + '"';
            if (selectedSkillId == this._id) {
                formContent += ' selected';
            }
            formContent += '>' + this.name + '</option>'
        });

        // Inject the whole content string into our existing HTML table
        $('#selectPrimaryAssociatedSkill').html(formContent);
    });
*/

}

function openSessionView(sessionParams) {
    //hide everything
    hideAllViews();

    //reset blank form
    $('#sessionIdField').val(0);
    $('#inputSessionDuration').val(0);
    var now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    var sessionDateField = $('#inputSessionDate').get(0)
    sessionDateField.valueAsDate = now;

    //insert values if passed in sessionParams
    if (sessionParams.sessionId !== null) {
        $('#sessionIdField').val(sessionParams.sessionId);
    }
    if (sessionParams.sessionDuration !== null) {
        $('#inputSessionDuration').val(sessionParams.sessionDuration);
    }
    if (sessionParams.sessionDate !== null) {
        now = new Date(sessionParams.sessionDate);
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
        sessionDateField.valueAsDate = now;
    }
    //this one can only really be set during the ajax callback below
    var selectedSkillId = ''; 
    if (sessionParams.skillId != null) {
        selectedSkillId = sessionParams.skillId;
    }

    //**********************
    //Populate skill options
    //**********************
    var formContent = '';

    // jQuery AJAX call for JSON
    $.getJSON( '/skills', function( data ) {
        if (data == null || data.length <= 0) {
            populateSkillTable();
            return;
        }
        // For each item in our JSON, add a table row and cells to the content string
        $.each(data, function(){
            formContent += '<option value="' + this._id + '"';
            if (selectedSkillId == this._id) {
                formContent += ' selected';
            }
            formContent += '>' + this.name + '</option>'
        });

        // Inject the whole content string into our existing HTML table
        $('#selectPrimaryAssociatedSkill').html(formContent);
    });    

    //display the session view
    $('#addSessionView').show();

}

function submitNewSession(event) {
    event.preventDefault();

    //check to make sure the duration value is not negative
    if ($('#inputSessionDuration').val() > '0') { 
        if ($('#inputSessionDuration').val() <= 10 || confirm("Are you sure you practiced this skill for " + $('#inputSessionDuration').val() + " hours?")) {
            var adjustedSessionDate = new Date($('#inputSessionDate').val());
            adjustedSessionDate.setMinutes(adjustedSessionDate.getMinutes() + adjustedSessionDate.getTimezoneOffset());

            var newSession = {
                'duration': $('#inputSessionDuration').val(),
                'date': adjustedSessionDate
            };

            var urlString = '';
            if ($('#sessionIdField').val() > '0') {
                urlString = '/sessions/editsession/' + $('#sessionIdField').val();
                newSession.skillId = $('#selectPrimaryAssociatedSkill').val();
            }
            else {
                urlString = '/skills/' + $('#selectPrimaryAssociatedSkill').val() + '/sessions/addsession';
            }

            //use AJAX to post the object to our addSkill service
            $.ajax({
                type: 'POST',
                data: newSession,
                url: urlString,
                dataType: 'JSON'
            }).done(function( response ) {

                //check for successful (blank) response
                if (response.msg === '') {

                    //Return to skill list
                    populateSkillTable();
                }
                else {
                     // If something goes wrong, alert the error message that our service returned
                    alert('Error: ' + response.msg);

                }
            });
        }
    }
    else {
        // If errorCount is more than 0, error out
        alert('Please enter a duration greater than 0');
        return false;
    }

}

function showSessionListForSkill(event) {
    if(event != null) {
        event.preventDefault();
    }

    var listAlreadyVisible = false;

    if ($(this).parents('tr.skillListRow').next('tr.sessionListWrapper').length){
        listAlreadyVisible = true;
    }

    //hide any previously opened session lists
    $('.sessionListWrapper').remove();

    if (listAlreadyVisible == false && $(this).attr('rel') != null) {
        generateAndAttachSessionListForSkill($(this).attr('rel'), $(this).parents('tr.skillListRow'));
    }
}

function generateAndAttachSessionListForSkill(selectedSkillId, parentElement) {
    //hide any previously opened session lists
    $('.sessionListWrapper').remove();

    $.getJSON('skills/' + selectedSkillId + '/sessions')
        .done(function (data) {
            var sessionListContent = '';
            if (data.length <= 0) {
                sessionListContent += '<tr class="sessionListWrapper"><td colspan=3>No Sessions for this Skill yet!</td></tr>';
            }
            else {
                var editModeStyleString = '';
                if (superNamespaceSafeProductivityTrackerEditModeIsActive == false) {
                    editModeStyleString = 'style="display:none"';
                }
                sessionListContent += '<tr class="sessionListWrapper"><td colspan=3>';
                sessionListContent += '<table class="inner">';
                sessionListContent += '<thead><tr><th class="deletable" ' + editModeStyleString + '>Del</th><th class="editable" ' + editModeStyleString + '>Edit</th><th>Date</th><th>Duration</th></tr></thead>';
                sessionListContent += '<tbody>';
                $.each(data, function() {
                    var prettyDate = new Date(this.date).toDateString();
                    sessionListContent += '<tr>';
                    sessionListContent += '<td class="deletable" ' + editModeStyleString + '><a href="" class="deletesession" rel="' + this._id + '" title="Delete Session">X</a></td>';
                    sessionListContent += '<td class="editable" ' + editModeStyleString + '><a href="" class="editsession" rel="' + this._id + '" title="Edit Session">E</a></td>';
                    sessionListContent += '<td>' + prettyDate + '</td><td>' + this.duration + '</td></tr>';
                });
                sessionListContent += '</tbody></table>';
            }

            sessionListContent += '</td></tr>';

            parentElement.after(sessionListContent);
        })
        .fail(function (jqxhr, textStatus, error) {
            var err = textStatus + ", " + error;
            console.log('Request Failed: ' + err);
        });

}

function editSkill(event){
    if (event != null) {
        event.preventDefault();
    }

    var selectedSkillId = '';
    if (event !== null && $(this).attr('rel') !== null) {
        selectedSkillId = $(this).attr('rel');
    }

}

function deleteSkill(event){
    if (event != null) {
        event.preventDefault();
    }

    var selectedSkillId = '';
    if (event !== null && $(this).attr('rel') !== null) {
        selectedSkillId = $(this).attr('rel');
    }

    if (confirm('Are you sure you want to delete this skill?')) {
        $.ajax({
            type: 'DELETE',
            url: '/skills/deleteskill/' + selectedSkillId
        }).done(function(response) {
            if (response.msg === '') {
                //update the table
                populateSkillTable();
            }
            else {
                Window.alert('Error: ' + response.msg);
            }
        })
    }
    else {
        return false;
    }
}

function editSession(event){
    if (event != null) {
        event.preventDefault();
    }

}

function deleteSession(event){
    if (event != null) {
        event.preventDefault();
    }

    var selectedSessionId = '';
    if (event !== null && $(this).attr('rel') !== null) {
        selectedSessionId = $(this).attr('rel');
        if (confirm('Are you sure you want to delete this session?')) {
            $.ajax({
                type: 'DELETE',
                url: '/sessions/deletesession/' + selectedSessionId
            }).done(function(response) {
                if (response.msg === '') {
                    //update the table
                    //need to update the full skill table to make sure duration totals get updated
                    populateSkillTable();
//                    generateAndAttachSessionListForSkill(selectedSessionId, $(this).parents('tr.sessionListWrapper').prev());
                }
                else {
                    Window.alert('Error: ' + response.msg);
                }
            })
        }
        else {
            return false;
        }
    }
    else {
        return false;
    }

}

function toggleEditMode() {
    if (superNamespaceSafeProductivityTrackerEditModeIsActive == false) {
        switchEditModeOn();
    }
    else {
        switchEditModeOff();
    }
}

function switchEditModeOn() {
    $('.editable').show();
    $('.deletable').show();
    $('.noeditmode').hide();
    superNamespaceSafeProductivityTrackerEditModeIsActive = true;
}

function switchEditModeOff() {
    $('.editable').hide();
    $('.deletable').hide();
    $('.noeditmode').show();
    superNamespaceSafeProductivityTrackerEditModeIsActive = false;
}



function hideAllViews() {
    $('#skillListView').hide();
    $('#addSessionView').hide();
    switchEditModeOff();
}