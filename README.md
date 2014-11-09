Simple app for tracking time spent developing user-defined skills.

You will need a MongoDB server - link to this in line 9 of app.js:
<code>var db = mongo.db('mongodb://localhost:27017/productivity-tracker', {native_parser:true});</code>

Currently the db requires a root collection called "usercollection", and the user's _id is hard-wired in the code. Be sure to enter your user's _id in all of the route files (currently skills.js and sessions.js). All of this should be remedied soon, right after I finish adding full CRUD capabilities for skills and sessions.
