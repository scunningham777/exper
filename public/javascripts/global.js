var superNamespaceSafeProductivityTrackerEditModeIsActivate = false;


// DOM Ready =============================================================
$(document).ready(function() {

    //Add Skill button click
    $('#btnAddSkill').on('click', addSkill);

    //Edit Skills button click?
    //Edit skill button click
    $('.editable.editSkill').on('click', editSkill);
    //Delete skill button click
    $('.deletable.deleteSkill').on('click', deleteSkill);
    //Edit session button click
    $('.editable.editSession').on('click', editSession);
    //Delete session button click
    $('.deletable.deleteSession').on('click', deleteSession);

    //Click on a skill name to add new session for that skill
    $('#skillList table tbody').on('click', 'td a.linkaddtoskill', openNewSessionView);
    //Click on a total duration value to vew session list for that skill
    $('#skillList table tbody').on('click', 'td a.linkexpandskill', showSessionListForSkill);

    //Click to open new session form
    $('#btnNewSession').on('click', openNewSessionView);

    //Toggle Edit Mode
    $('#btnToggleEditMode').on('click', toggleEditMode);
 
    //Add Session button click
    $('#btnCancelAddSession').on('click', populateSkillTable);
    $('#btnSubmitAddSession').on('click', submitNewSession);

    // default to add new session view, which will redirect to skills list if no skills exist for user
    openNewSessionView();
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

function openNewSessionView(event) {
    if (event != null) {
        event.preventDefault();
    }

    hideAllViews();
    $('#inputSessionDuration').val(0);
    var now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    var sessionDateField = $('#inputSessionDate').get(0)
    sessionDateField.valueAsDate = now;
    $('#addSessionView').show();

    // Empty content string
    var formContent = '';

    var selectedSkillId = '';
    if (event !== null && $(this).attr('rel') !== null) {
        selectedSkillId = $(this).attr('rel');
    }

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

            var urlString = '/skills/' + $('#selectPrimaryAssociatedSkill').val() + '/sessions/addsession';

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
    event.preventDefault();

    var listAlreadyVisible = false;

    if ($(this).parents('tr.skillListRow').next('tr.sessionListWrapper').length){
        listAlreadyVisible = true;
    }


    //hide any previously opened session lists
    $('.sessionListWrapper').remove();


    var sessionListContent = '';

    var clickedElement = this;

    if (listAlreadyVisible == false && event != null && $(clickedElement).attr('rel') != null) {
        $.getJSON('skills/' + $(clickedElement).attr('rel') + '/sessions')
            .done(function (data) {
                if (data.length <= 0) {
                    sessionListContent += '<tr class="sessionListWrapper"><td colspan=2>No Sessions for this Skill yet!</td></tr>';
                }
                else {
                    sessionListContent += '<tr class="sessionListWrapper"><td colspan=2>';
                    sessionListContent += '<table class="inner">';
                    sessionListContent += '<thead><tr><th>Date</th><th>Duration</th></tr></thead>';
                    sessionListContent += '<tbody>';
                    $.each(data, function() {
                        var prettyDate = new Date(this.date).toDateString();
                        sessionListContent += '<tr><td>' + prettyDate + '</td><td>' + this.duration + '</td></tr>';
                    });
                    sessionListContent += '</tbody></table>';
                }

                sessionListContent += '</td></tr>';

                $(clickedElement).parents('tr.skillListRow').after(sessionListContent);
            })
            .fail(function (jqxhr, textStatus, error) {
                var err = textStatus + ", " + error;
                sessionListContent += ('<tr class="sessionListWrapper"><td colspan=2>Request Failed: ' + err + '</td><tr>');
            });
    }
}

function editSkill(event){

}

function deleteSkill(event){

}
function editSession(event){

}

function deleteSession(event){

}

function toggleEditMode() {
    if (superNamespaceSafeProductivityTrackerEditModeIsActivate == false) {
        switchEditModeOn();
    }
    else {
        switchEditModeOff();
    }
}

function switchEditModeOn() {
    $('.editable').show();
    $('.deletable').show();
    superNamespaceSafeProductivityTrackerEditModeIsActivate = true;
}

function switchEditModeOff() {
    $('.editable').hide();
    $('.deletable').hide();
    superNamespaceSafeProductivityTrackerEditModeIsActivate = false;
}



function hideAllViews() {
    $('#skillListView').hide();
    $('#addSessionView').hide();
    switchEditModeOff();
}