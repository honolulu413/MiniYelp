var database = require('../lib/database');
var APP_USERS = require('../lib/table').APP_USERS;
var alphanumeric = require('../lib/string.js').alphanumeric;
var getPath = require('../lib/string').getPath;

function get(request, respond) {
	var userName = getPath(request.params[0]);

	
	var currentUser;
	
	console.log("userName: " + userName);
	
	if (request.session.username === userName) {
		if (alphanumeric(userName)) {
			database.select(APP_USERS, {
				schema : APP_USERS.primaryKey,
				data : [ userName ]
			}, function(err, results) {
				if (err === null) {
					currentUser = results[0];
					var queryBatch = [];
					
					console.log("currentUser is:" + currentUser);

					console.log("current name is:" + currentUser.USER_NAME_ID);
					console.log("current city is:" + currentUser.LOCATION_CITY);
					
					var similarUserQuery = "SELECT * FROM APP_USERS WHERE LOCATION_CITY = '" + currentUser.LOCATION_CITY + "' AND LOCATION_STATE = '" + currentUser.LOCATION_STATE + "'" + " AND USER_NAME_ID <> " + "'" + currentUser.USER_NAME_ID + "'" + " AND ROWNUM < 3";			
//					var userQuery = "SELECT * FROM APP_USERS WHERE USER_NAME_ID =" + "'" + userName + "'"; 
					var favoriteBuziQuery = "SELECT * FROM BUSINESSES WHERE BUSINESSES.BUSINESS_ID IN " +
							"( SELECT BUSINESS_ID FROM FAVORITES WHERE USER_NAME_ID = " + "'" + userName + "')" ;
					var friends = "SELECT * FROM APP_USERS WHERE USER_NAME_ID IN ( SELECT USER_NAME_ID2 " +
							"FROM APP_USER_FRIENDS WHERE USER_NAME_ID1 = " + "'" + userName + "')" ;

					
 					
					queryBatch.push(similarUserQuery);
					queryBatch.push(favoriteBuziQuery);
					queryBatch.push(friends);
					database.executeBatch(queryBatch, function(errArray, resultsArray){
						if (errArray === null) {
							respond.render('user.jade', {
								title : userName,
								similar_user : resultsArray[0],
								business_list: resultsArray[1],
								friends_list: resultsArray[2],
								current_user: currentUser
							
							});
						}
					});

					
				}
			});
			
 


		}
	} else {
		respond.redirect('/login');
	}
}

exports.get = get;
