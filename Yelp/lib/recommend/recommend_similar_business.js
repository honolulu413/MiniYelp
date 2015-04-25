var database = require('../database');

var recommendNumber = 3;

function getTask(currentUser, currentBusiness) {
	return function(callback) {
        var sql = "SELECT * FROM ( SELECT * FROM BUSINESSES WHERE BUSINESS_ID IN ( SELECT BUSINESS_ID " +
        "FROM BUSINESS_CATEGORIES WHERE CATEGORY IN ( SELECT CATEGORY FROM BUSINESS_CATEGORIES WHERE " +
        "BUSINESS_ID = " + "'" + currentBusiness.BUSINESS_ID + "'" + " ) ) AND CITY = " + "'" + currentBusiness.CITY + "'" +" AND " +
                "STATE= " + "'" + currentBusiness.STATE + "'"  + " ORDER BY STAR DESC) WHERE ROWNUM <= " + recommendNumber;

        
//		var sql = " SELECT * FROM APP_USERS  " + 
//			" WHERE LOCATION_CITY = '" + currentBusiness.LOCATION_CITY + "'" +
//			" AND LOCATION_STATE = '" +  currentBusiness.LOCATION_STATE + "'" + 
//			" AND USER_NAME_ID <> '" + currentBusiness.USER_NAME_ID + "'" +
//			" AND USER_NAME_ID IN " +
//			" (SELECT USER_NAME_ID2 FROM APP_USER_FRIENDS " +
//			" WHERE USER_NAME_ID1 = '" + currentBusiness.USER_NAME_ID + "'" +
//			" UNION " +
//			" SELECT USER_NAME_ID1 FROM APP_USER_FRIENDS " +
//			" WHERE USER_NAME_ID2 = '" + currentBusiness.USER_NAME_ID + "') " + 
//			" AND ROWNUM < " + recommendNumber;
		
		database.execute(sql, callback);
	}
}

exports.getTask = getTask;