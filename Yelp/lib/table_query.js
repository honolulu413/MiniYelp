var database = require("./database");
var APP_USER_FRIENDS = require("./table").APP_USER_FRIENDS;

function isFriend(userNameID1, userNameID2, handleResults) {
	var sql = "SELECT * FROM APP_USER_FRIENDS WHERE (USER_NAME_ID1 = '" + userNameID1 + 
	"' AND USER_NAME_ID2 = '" + userNameID2 + 
	"') OR (USER_NAME_ID2 = '" + userNameID1 + 
	"' AND USER_NAME_ID1 = '" + userNameID2 + "')";
	
	database.execute(sql, function(err, results) {
		if (err !== null) {
			handleResults(err, null);
		} else {
			if (results.length > 0) {
				handleResults(null, true);
			} else {
				handleResults(null, false);
			}				
		}
	});
}

exports.isFriend = isFriend;