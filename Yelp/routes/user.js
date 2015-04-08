var database = require('../lib/database');
var APP_USERS = require('../lib/table').APP_USERS;
var alphanumeric = require('../lib/string.js').alphanumeric;
var getPath = require('../lib/string').getPath;

function get(request, respond) {
	var userName = getPath(request.params[0]);

	if (request.session.username === userName) {
		if (alphanumeric(userName)) {
//			database.select(APP_USERS, {
//				schema : APP_USERS.primaryKey,
//				data : [ userName ]
//			}, function(err, results) {
//				if (err === null) {
//					console.log(results);
//					respond.render('user.jade', {
//						title : userName,
//						user : results[0]
//					});
//				}
//			});
			var queryBatch = [];
			var userQuery = "SELECT * FROM APP_USERS WHERE USER_NAME_ID =" + "'" + userName + "'"; 
			var favoriteBuziQuery = "SELECT * FROM BUSINESSES WHERE BUSINESSES.BUSINESS_ID IN " +
					"( SELECT BUSINESS_ID FROM FAVORITES WHERE USER_NAME_ID = " + "'" + userName + "')" ;
			var friends = "SELECT * FROM APP_USERS WHERE USER_NAME_ID IN ( SELECT USER_NAME_ID2 " +
					"FROM APP_USER_FRIENDS WHERE USER_NAME_ID1 = " + "'" + userName + "')" ;

			queryBatch.push(userQuery);
			queryBatch.push(favoriteBuziQuery);
			queryBatch.push(friends);
			database.executeBatch(queryBatch, function(errArray, resultsArray){
				if (errArray === null) {
					console.log(resultsArray[0]);
					console.log(resultsArray[1]);
					console.log(resultsArray[2]);
					respond.render('user.jade', {
						title : userName,
						user : resultsArray[0][0],
						business_list: resultsArray[1],
						friends_list: resultsArray[2]
					});
				}
			});

		}
	} else {
		respond.redirect('/login');
	}
}

exports.get = get;
