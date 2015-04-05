var database = require('../lib/database');
var APP_USERS = require('../lib/table').APP_USERS;
var alphanumeric = require('../lib/string.js').alphanumeric;
var getPath = require('../lib/string').getPath;

function get(request, respond) {
	var userName = getPath(request.params[0]);
	
	if (alphanumeric(userName)) {
		database.select(APP_USERS,
				{schema : APP_USERS.primaryKey,
				data : [userName]},
				function(err, results) {
					if (err === null) {
						console.log(results);
						respond.render('user.jade', {
							title : userName,
							user : results[0]
						});
					}
				});
	}
}

exports.get = get;
