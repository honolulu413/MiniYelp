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
	var businessTitle;

	var currentUser = request.session.username;

	if (currentUser) {
		database.select(BUSINESSES, {
			schema : BUSINESSES.primaryKey,
			data : [ businessID ]
		}, function(err, results) {
			if (err === null) {
				console.log(results);
				businessInfo = results[0];
				businessTitle = businessInfo["NAME"];
				
//				respond.render('business.jade', {
//					title : results[0]["NAME"],
//					business : results[0],
//				});
			}
		});

		
		var batchQuery = [];
		var goodReview = "SELECT * FROM (SELECT * FROM REVIEWS WHERE REVIEWS.STAR>=4 AND REVIEWS.BUSINESS_ID="
				+ "'" + businessID + "'"
				+ " ORDER BY REVIEWS.USEFUL_VOTE_NUMBER DESC) WHERE ROWNUM<=3";

		var badReview = "SELECT * FROM (SELECT *FROM REVIEWS WHERE REVIEWS.STAR<=3 AND REVIEWS.BUSINESS_ID="
				+ "'" + businessID + "'"
				+ " ORDER BY REVIEWS.USEFUL_VOTE_NUMBER DESC) WHERE ROWNUM<=3";
		
		batchQuery.push(goodReview);
		batchQuery.push(badReview);

		database.executeBatch(batchQuery, function(err, results) {
			if (err === null) {
				respond.render('business.jade', {
					title: businessTitle,
					business: businessInfo,
					goodRievew : results[0],
					badReview : results[1],
					userName: currentUser
				});
				console.log(results[0]);
				console.log(results[1]);
				console.log(results[0].length);
				console.log(results[1].length);
			}
		});	
	} else {
		respond.redirect('/login');
	} 
	
}


exports.get = get;
