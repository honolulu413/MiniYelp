var database = require('../lib/database');
var APP_USERS = require('../lib/table').APP_USERS;
var alphanumeric = require('../lib/string.js').alphanumeric;

function get(request, respond) {
	var userName = /\w+/.exec(request.params);
	
	if (alphanumeric(userName)) {
		database.select(APP_USERS,
				{schema : APP_USERS.primaryKey,
				data : [userName]},
				function(err, results) {
					if (err === null) {
						respond.render('user.jade', {
							title : userName,
							user : results[0]
						});
					}
				});
	}
}

exports.get = get;
