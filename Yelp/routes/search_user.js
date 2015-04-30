var database = require('../lib/database');
var APP_USERS = require('../lib/table').APP_USERS;

function get(request, respond) {

	var userName = request.query.stranger_id;
	console.log(userName);

	var query = "SELECT * FROM APP_USERS WHERE FIRST_NAME='" + userName
			+ "' OR " + "LAST_NAME='" + userName + "'";

	database.execute(query, function(err, results) {
		if (err === null) {
			console.log(results);
			respond.render('search_user.jade', {
				users : results
			});
		}
	})

}

exports.get = get;