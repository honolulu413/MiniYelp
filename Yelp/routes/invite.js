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
		var query = "SELECT BUSINESS_ID FROM FAVORITES WHERE " +
				"USER_NAME_ID = " + "'" +  userIDs[i] + "'";
		batch.push(query);
	}
	
	database.executeBatch(batch, function(err, results) {
		if (err === null) {
			console.log(results);
			var rank = {};
			for (var result in results) {
				for (var business in result) {
					var businessID = business["BUSINESS_ID"];
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
			console.log("rank");
			console.log(rank);
			var rankedArray = $.map(rank, function(value, index) {
			    return [value];
			});
			
			var sorted = rankedArray.slice().sort(function(a, b){return b.number-a.number});
			console.log("sorted");
			console.log(sorted);
			
			var finalResult = [];
			for (var entry in sorted) {
				var business = entry['business'];
				finalResult.push(business);
			}
			
			res.render('invite.jade', {	
				'business_list': finalResult
			});
			
//			console.log(results[0]);
//			console.log(results[1]);
//			console.log(results[0].length);
//			console.log(results[1].length);
//			console.log(results[2]);
		}
	});	
	
	
	
	
	
//	database.insert(FAVORITES, row, function(err, results) {
//		if (err === null) {
//			console.log("add to favorite succeed");	
//			res.redirect('/user/' + userName);
//
//		}
//	});

};


