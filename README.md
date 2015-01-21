Simple app for tracking time spent developing user-defined skills.

You will need a MongoDB server - link to this in line 13 of app.js:
<code>var db = mongo.db('mongodb://localhost:27017/productivity-tracker', {native_parser:true});</code>

Also be sure to enter proper credentials for your SMTP service of choice in routes/index.js (currently entered in two places; also currently doesn't work :-/ )

Updates to watch for:
<ol>
<li>Reset password email working</li>
<li>Angular/Ionic front end</li>
<li>Switch to Mongoose to handle DB schemas & models</li>
</ol>
