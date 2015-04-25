var database = require('../lib/database');
var database_nosql = require('../lib/database_nosql');
var APP_USERS = require('../lib/table').APP_USERS;
var alphanumeric = require('../lib/string.js').alphanumeric;
var getPath = require('../lib/string').getPath;
var project = require('../lib/table').project;
var getData = require('../lib/row').getData;
var rowArrayWithLabel = require('../lib/row').rowArrayWithLabel;

function get(request, respond) {
	var userName = getPath(request.params[0]);

	var currentUser;

	if (!alphanumeric(userName)) {
		respond.redirect('/login');
		return;
	}
	
	if (request.session.username === userName) {
		database.select(
						APP_USERS,
						{
							schema : APP_USERS.primaryKey,
							data : [ userName ]
						},
						function(err, results) {
							if (err === null) {
								var currentUser = results[0];
								var queryBatch = [];

								console.log("current user is:"
										+ currentUser.USER_NAME_ID);

//								var similarUserQuery = "SELECT * FROM APP_USERS WHERE LOCATION_CITY = '"
//										+ currentUser.LOCATION_CITY
//										+ "' AND LOCATION_STATE = '"
//										+ currentUser.LOCATION_STATE
//										+ "'"
//										+ " AND USER_NAME_ID <> "
//										+ "'"
//										+ currentUser.USER_NAME_ID
//										+ "'"
//										+ " AND ROWNUM < 3";
								var favoriteBuziQuery = "SELECT * FROM BUSINESSES WHERE BUSINESSES.BUSINESS_ID IN "
										+ "( SELECT BUSINESS_ID FROM FAVORITES WHERE USER_NAME_ID = "
										+ "'" + userName + "')";
								var friends = "SELECT * FROM APP_USERS WHERE USER_NAME_ID IN ( SELECT USER_NAME_ID2 "
										+ "FROM APP_USER_FRIENDS WHERE USER_NAME_ID1 = "
										+ "'" + userName + "')";

								queryBatch.push(similarUserQuery);
								queryBatch.push(favoriteBuziQuery);
								queryBatch.push(friends);
								
								database.executeBatch(queryBatch, function(
										errArray, resultsArray) {
									if (errArray === null) {
										
										var similarUserList = rowArrayWithLabel(resultsArray[0], ['USER_NAME_ID', 'USER_NAME_ID', 'FIRST_NAME', 'LAST_NAME'], ['.url', 'user id', 'first name', 'last name']);
										for(var i = 0; i < similarUserList.length; i++) {
											similarUserList[i].data[0] = '/user/' + similarUserList[i].data[0];
										}

										var businessList = rowArrayWithLabel(resultsArray[1], ['BUSINESS_ID',  'NAME', 'FULL_ADDRESS', 'CITY', 'STAR'], ['.url', 'name', 'address', 'city', 'star']);
										// adjust business url format
										for(var i = 0; i < businessList.length; i++) {
											businessList[i].data[0] = '/business/' + businessList[i].data[0];
										}
										var friendsList = rowArrayWithLabel(resultsArray[2], ['USER_NAME_ID', 'FIRST_NAME', 'LAST_NAME'], ['user id', 'first name', 'last name']);

										
										var currentUserRowWithLabel = {
												label : ['user id: ', 'name: ', 'city: ', 'state: '],
												data : [currentUser.USER_NAME_ID, currentUser.FIRST_NAME + " " + currentUser.LAST_NAME, currentUser.LOCATION_CITY, currentUser.LOCATION_STATE]
										};
										
										database_nosql.find('message', {receiver:userName}, function(results){
											var message = rowArrayWithLabel(results, ['sender', 'text'], ['sender', 'new message']);
											console.log(message);
											respond.render('user.jade', {
												title : userName,
												similar_user_list : similarUserList,
												business_list : businessList,
												friends_list : resultsArray[2],
												current_user : currentUserRowWithLabel,
												message : message

											});
										});
									}
								});

							}
						});
 	} else {
 		// not current user
		var currentUserID = request.session.username;
		var strangerID = getPath(request.params[0]);
		
		var isFriend = require("../lib/table_query").isFriend;
		
		isFriend(currentUserID, strangerID, function(err, results) {
			if (err !== null) {
				console.log("unknown error!");
				return;
			} 

			var favoriteBusinessSQL = "SELECT * FROM BUSINESSES WHERE BUSINESSES.BUSINESS_ID IN "
				+ "( SELECT BUSINESS_ID FROM FAVORITES WHERE USER_NAME_ID = "
				+ "'" + strangerID + "')";
			var userInfoSQL = "SELECT FIRST_NAME, LAST_NAME, LOCATION_CITY, LOCATION_STATE FROM APP_USERS WHERE USER_NAME_ID = '" + strangerID + "'";

			if (results === true) {
				// is friend
				
				var queryBatch = [];
				queryBatch.push(userInfoSQL);
				queryBatch.push(favoriteBusinessSQL);

				database.executeBatch(queryBatch, function(
						errArray, resultsArray) {
					if (errArray === null) {
						var businessList = rowArrayWithLabel(resultsArray[1], ['BUSINESS_ID',  'NAME', 'FULL_ADDRESS', 'CITY', 'STAR'], ['.url', 'name', 'address', 'city', 'star']);
						// adjust business url format
						for(var i = 0; i < businessList.length; i++) {
							businessList[i].data[0] = '/business/' + businessList[i].data[0];
						}
						respond.render('stranger.jade', {
							title : currentUserID,
							user_info : resultsArray[0][0],
							business_list : businessList,
							current_user_id : currentUserID,
							stranger_id : strangerID,
							is_friend : true
						});
					}
				});
			} else if (results === false) {
				// is not friend
				
				var queryBatch = [];
				queryBatch.push(userInfoSQL);

				database.executeBatch(queryBatch, function(
						errArray, resultsArray) {
					if (errArray === null) {
						respond.render('stranger.jade', {
							title : currentUserID,
							user_info : resultsArray[0][0],
							business_list : null,
							current_user_id : currentUserID,
							stranger_id : strangerID,
							is_friend : false
						});
					}
				});				
			}
		})
		

	}
}

exports.get = get;
