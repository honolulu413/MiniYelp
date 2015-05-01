var database = require('../database');

//var recommendNumber = 3;

function getTask(userList) {
	return function(callback) {
		
		var batch = [];

		for ( var i = 0; i < userList.length; i++) {
	      var query = "SELECT * FROM BUSINESSES WHERE BUSINESS_ID IN "
	          + "( SELECT BUSINESS_ID FROM FAVORITES WHERE USER_NAME_ID" + " = "
	          + "'" + userList[i] + "'" + ")"
	      batch.push(query);
	    }

	    database.executeBatch(batch, function(err, results) {
	      if (err === null) {
	        var rank = {};
	        for ( var i in results) {
	          var result = results[i];
	          for ( var j in result) {
	            var business = result[j];
	            var businessID = business["BUSINESS_ID"];
//	            console.log('businessID is: ' + businessID);
	            if (typeof rank[businessID] !== 'undefined') {
	              rank[businessID]['number'] += 1;
	            } else {
	              rank[businessID] = {
	                'business' : business,
	                'number' : 1
	              }
	            }
	          }
	        }

	        var rankedArray = Object.keys(rank).map(function(key) {
	          return rank[key]
	        });
	        var sorted = rankedArray.slice().sort(function(a, b) {
	          return b.number - a.number
	        });

	        var sortedBusiness = [];
	        for ( var i in sorted) {
	          var business = sorted[i]['business'];
	          sortedBusiness.push(business);
	        }
//	        console.log(sortedBusiness);
	        callback(null, sortedBusiness);
	        
	      } else {
	    	  callback(err, null);
	      }
	    });
	}
}

exports.getTask = getTask;