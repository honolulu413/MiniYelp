var database = require('../lib/database');
var BUSINESSES = require('../lib/table').BUSINESSES;
var getPath = require('../lib/string').getPath;

//function get(request, respond) {
//	var businessID = /^\/([^\/]+)/.exec(request.params[0])[1];
//	var a
//		database.select(BUSINESSES,
//				{schema : BUSINESSES.primaryKey,
//				data : [businessID]},
//				function(err, results) {
//					if (err === null) {
//						console.log(results);
//						respond.render('business.jade', {
//							title : results[0]["NAME"],
//							business : results[0],
//							label: BUSINESSES.label
//						});
//					}
//				});
//	
//}

function get(request, respond) {

	var businessID = getPath(request.params[0]);
	var businessInfo;
 	var currentUser = request.session.username;

 	console.log(businessID);
 	
	if (currentUser) {
//		database.select(BUSINESSES, {
//			schema : BUSINESSES.primaryKey,
//			data : [ businessID ]
//		}, function(err, results) {
//			if (err === null) {
//				console.log(results);
//				businessInfo = results[0];
//				businessTitle = businessInfo["NAME"];
//			}
//		});

		
		var batchQuery = [];
		
		var businessInfo = "SELECT * FROM BUSINESSES WHERE BUSINESS_ID='" + businessID + "'";
		
		var goodReview = "SELECT * FROM (SELECT * FROM REVIEWS WHERE REVIEWS.STAR>=4 AND REVIEWS.BUSINESS_ID="
				+ "'" + businessID + "'"
				+ " ORDER BY REVIEWS.USEFUL_VOTE_NUMBER DESC) WHERE ROWNUM<=3";

		var badReview = "SELECT * FROM (SELECT *FROM REVIEWS WHERE REVIEWS.STAR<=3 AND REVIEWS.BUSINESS_ID="
				+ "'" + businessID + "'"
				+ " ORDER BY REVIEWS.USEFUL_VOTE_NUMBER DESC) WHERE ROWNUM<=3";

		batchQuery.push(businessInfo);
		batchQuery.push(goodReview);
		batchQuery.push(badReview);

		database.executeBatch(batchQuery, function(err, results) {
			if (err === null) {
				respond.render('business.jade', {
 					business: results[0],
					goodRievew : results[1],
					badReview : results[2],
					userName: currentUser
				});


			}
		});	
	} else {
		respond.redirect('/login');
	} 
	
	

	
}


exports.get = get;
