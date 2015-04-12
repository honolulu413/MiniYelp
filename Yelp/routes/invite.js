var requestQueryParser = require('../lib/requestQueryParser');
var database = require('../lib/database');
var getPath = require('../lib/string').getPath;

exports.post = function(req, res){
//	var row = requestQueryParser.parse(req, ["current_user", "friends_list"]);
	var userName = req.session.username;
	var batch = [];
	var userIDs = req.param('friends_list');
	var num = userIDs.length;
	for (var i = 0; i < userIDs.length; i++) {
		var query = "SELECT * FROM BUSINESSES WHERE BUSINESS_ID IN " +
				"( SELECT BUSINESS_ID FROM FAVORITES WHERE USER_NAME_ID" +
				" = " + "'" +  userIDs[i] + "'" + ")"
		batch.push(query);
	}
	
	database.executeBatch(batch, function(err, results) {
		if (err === null) {
			console.log(results);
			var rank = {};
			for (var i in results) {
				var result = results[i];
				for (var j in result) {
					var business = result[j];
					var businessID = business["BUSINESS_ID"];
					console.log('businessID is: ' + businessID );
					if (typeof rank[businessID] !== 'undefined') {
						rank[businessID]['number'] += 1;
					} else {
						rank[businessID] = {
							'business': business,
							'number': 1
						}
					}
				}
			}
			
			var rankedArray = Object.keys(rank).map(function (key) {return rank[key]});
			var sorted = rankedArray.slice().sort(function(a, b){return b.number-a.number});
			
			var sortedBusiness = [];
			for (var i in sorted) {
				var business = sorted[i]['business'];
				sortedBusiness.push(business);
			}
			console.log(sortedBusiness);
			res.render('invite.jade', {	
				'business_list': sortedBusiness
			});
			
			
			
//			console.log(results[0]);
//			console.log(results[1]);
//			console.log(results[0].length);
//			console.log(results[1].length);
//			console.log(results[2]);
		}
	});	

	
//	console.log("value1 is " + values1);
//	console.log("value2 is " + values2);
//	console.log("value3 is " + values3);


};


