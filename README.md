Simple app for tracking time spent developing user-defined skills.

You will need a MongoDB server - link to this in app.js:
<code>var db = mongo.db('mongodb://localhost:27017/productivity-tracker', {native_parser:true});</code>
This can now be set based on the NODE_ENV environment variable (see ll. 11-25).

Also be sure to enter proper credentials for your SMTP service of choice in routes/index.js (currently imported through a gitignored utils/passwords.js file - see ll. 7-11 of index.js).

Updates to watch for:
<ol>
<li><s>Reset password email working</s></li>
<li>Angular/Ionic front end</li>
<li>Switch to Mongoose to handle DB schemas & models</li>
</ol>
