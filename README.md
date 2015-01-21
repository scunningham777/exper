Simple app for tracking time spent developing user-defined skills.

You will need a MongoDB server - link to this in line 13 of app.js:
<code>var db = mongo.db('mongodb://localhost:27017/productivity-tracker', {native_parser:true});</code>

Also be sure to enter proper credentials for your SMTP server of choice in routes/index.js (currently entered in two places; also currently doesn't work :-/ )
