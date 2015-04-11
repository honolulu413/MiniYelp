var database = require('../lib/database');
var APP_USERS = require('../lib/table').APP_USERS;
var alphanumeric = require('../lib/string.js').alphanumeric;
var getPath = require('../lib/string').getPath;
var project = require('../lib/table').project;
var getData = require('../lib/row').getData;

function get(request, respond) {
	var userName = getPath(request.params[0]);

	
	var currentUser;
	
	console.log("userName: " + userName);
	
	if (!alphanumeric(userName)) {
		respond.redirect('/login');
		return;
	}
	
	if (request.session.username === userName) {
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
			
 	} else {
 		// not current user
		var currentUserID = request.session.username;
		var strangerID = getPath(request.params[0]);
		
		var rowFriendRelation = {schema : APP_USER_FRIENDS.primaryKey,
									data : [ currentUserID, strangerID]};
		
 		var object2Row = require('../lib/row').object2Row;
 		
		database.select(APP_USERS, {
			schema : APP_USERS.primaryKey,
			data : [ userName ]
		}, function(err, results) {
			if (err === null) {
				current_user_id = request.session.username;
				
				user_info = project(object2Row(results[0]), ['USER_NAME_ID', 'FIRST_NAME', 'LAST_NAME', 'LOCATION_CITY', 'LOCATION_STATE']);
				
				respond.render('stranger.jade', {
					user_info : user_info,
					current_user_id : current_user_id,
					stranger_id : getData(user_info, "USER_NAME_ID")
				});
			}

		});
 	}
}

exports.get = get;
