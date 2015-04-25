var database = require('../database');

var recommendUserNumber = 3;

function getTask(currentUser) {
	return function(callback) {
		var sql = " SELECT * FROM APP_USERS  " + 
			" WHERE LOCATION_CITY = '" + currentUser.LOCATION_CITY + "'" +
			" AND LOCATION_STATE = '" +  currentUser.LOCATION_STATE + "'" + 
			" AND USER_NAME_ID <> '" + currentUser.USER_NAME_ID + "'" +
			" AND USER_NAME_ID IN " +
			" (SELECT USER_NAME_ID2 FROM APP_USER_FRIENDS " +
			" WHERE USER_NAME_ID1 = '" + currentUser.USER_NAME_ID + "'" +
			" UNION " +
			" SELECT USER_NAME_ID1 FROM APP_USER_FRIENDS " +
			" WHERE USER_NAME_ID2 = '" + currentUser.USER_NAME_ID + "') " + 
			" AND ROWNUM < " + recommendUserNumber;
		
		console.log("--------------------");
		console.log(sql);
	
		database.execute(sql, function(err, results_similar_user) {			
			
			if (err === null) {
				if (results_similar_user.length < recommendUserNumber) {
					var sql = "SELECT * FROM"
						+ " ( SELECT * FROM APP_USERS"
						+ " WHERE USER_NAME_ID <> '" + currentUser.USER_NAME_ID + "' "
						+ " ORDER BY dbms_random.value ) "
						+ " WHERE rownum < " + (recommendUserNumber - results_similar_user.length);
					database.execute(sql, function(err, results_random_user) {
						if (err === null) {
							callback(null, results_similar_user.concat(results_random_user));						
						} else {
							callback(err, null);
						}
					})
				} else {
					callback(null, results_similar_user);
				}
			} else {
				callback(err, null);
			}
		});
	}
}

exports.getTask = getTask;