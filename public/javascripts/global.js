// Userlist data array for filling in info box
var userListData = [];

// DOM Ready =============================================================
$(document).ready(function() {

    //Add Skill button click
    $('#btnAddSkill').on('click', addSkill);

    //Edit Skills button click?
    //Edit specific skill button click
    //Delete skill button click

    //Click on a skill name
    $('#skillList table tbody').on('click', 'td a.linkexpandskill', openNewSessionView);
 
    //Add Session button click
    $('#btnCancelAddSession').on('click', populateSkillTable);
    $('#btnSubmitAddSession').on('click', submitNewSession);

    // Populate the user table on initial page load
    populateSkillTable();

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

        // For each item in our JSON, add a table row and cells to the content string
        $.each(data, function(){
            tableContent += '<tr>';
            tableContent += '<td><a href="" class="linkexpandskill" rel="' + this.name + '" title="Show Details">' + this.name + '</a></td>';
            tableContent += '<td>' + this.totalDuration + '</td>';
//            tableContent += '<td><a href="#" class="linkdeleteuser" rel="' + this._id + '">delete</a></td>';
            tableContent += '</tr>';
        });

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
    event.preventDefault();

    hideAllViews();
    $('#addSessionView').show();

    // Empty content string
    var formContent = '';

    var selectedUser = '';
    if ($(this).attr('rel') !== null) {
        selectedUser = $(this).attr('rel');
    }

    // jQuery AJAX call for JSON
    $.getJSON( '/skills', function( data ) {

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
        var newSession = {
            'duration': $('#inputSessionDuration').val(),
            'date': new Date()
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