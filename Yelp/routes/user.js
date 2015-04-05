var database = require('../lib/database');
var APP_USERS = require('../lib/table').APP_USERS;
var alphanumeric = require('../lib/string.js').alphanumeric;

function get(request, respond) {
	console.log(/^\/([^\/]+)/.exec(request.params[0]));
	var userName = /^\/([^\/]+)/.exec(request.params[0])[1];

	console.log(userName);
//	console.log(request.session.username);
//	console.log(userName);
//	console.log(request.session.username === userName);
	if (request.session.username === userName) {
		if (alphanumeric(userName)) {
			database.select(APP_USERS, {
				schema : APP_USERS.primaryKey,
				data : [ userName ]
			}, function(err, results) {
				if (err === null) {
					console.log(results);
					respond.render('user.jade', {
						title : userName,
						user : results[0]
					});
				}
			});
		}
	} else {
		respond.redirect('/login');
	}

}

exports.get = get;
