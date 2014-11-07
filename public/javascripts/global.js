
// DOM Ready =============================================================
$(document).ready(function() {

    //Add Skill button click
    $('#btnAddSkill').on('click', addSkill);

    //Edit Skills button click?
    //Edit specific skill button click
    //Delete skill button click

    //Click on a skill name
    $('#skillList table tbody').on('click', 'td a.linkexpandskill', openNewSessionView);

    //Click to open new session form
    $('#btnNewSession').on('click', openNewSessionView);
 
    //Add Session button click
    $('#btnCancelAddSession').on('click', populateSkillTable);
    $('#btnSubmitAddSession').on('click', submitNewSession);

    // default to add new session view, which will redirect to skills list if no skills exist for user
    openNewSessionView();

});

// Functions =============================================================

// Fill table with data
function populateSkillTable() {

    hideAllViews();
    $('#skillListView').show();

    // Empty content string
    var tableContent = '';

    // jQuery AJAX call for JSON
    $.getJSON( '/skills', function( data ) {

        if (data.length > 0){
            // For each item in our JSON, add a table row and cells to the content string
            $.each(data, function(){
                tableContent += '<tr>';
                tableContent += '<td><a href="" class="linkexpandskill" rel="' + this.name + '" title="Show Details">' + this.name + '</a></td>';
                tableContent += '<td>' + this.totalDuration + '</td>';
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
            'name': $('#addSkill fieldset input#inputSkillName').val()
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
                $('#addSkill fieldset input').val('');

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
    document.getElementById('inputSessionDate').valueAsDate = now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    $('#addSessionView').show();

    // Empty content string
    var formContent = '';

    var selectedUser = '';
    if (event !== null && $(this).attr('rel') !== null) {
        selectedUser = $(this).attr('rel');
    }

    // jQuery AJAX call for JSON
    $.getJSON( '/skills', function( data ) {
        if (data == null || data.length <= 0) {
            populateSkillTable();
            return;
        }
        // For each item in our JSON, add a table row and cells to the content string
        $.each(data, function(){
            formContent += '<option value="' + this.name + '"';
            if (selectedUser == this.name) {
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
            var newSession = {
                'duration': $('#inputSessionDuration').val(),
                'date': new Date($('#inputSessionDate').val())
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



function hideAllViews() {
    $('#skillListView').hide();
    $('#addSessionView').hide();
}