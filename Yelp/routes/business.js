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
	var businessCity;
	var businessState;

	if (currentUser) {
		database.select(BUSINESSES, {
			schema : BUSINESSES.primaryKey,
			data : [ businessID ]
		}, function(err, results) {
			if (err === null) {
//				console.log(results);
				businessInfo = results[0];
				businessTitle = businessInfo["NAME"];
				businessCity = businessInfo["CITY"];
				businessState = businessInfo["STATE"];
				var batchQuery = [];
				
//				var businessInfo = "SELECT * FROM BUSINESSES WHERE BUSINESS_ID='" + businessID + "'";
				
				var goodReview = "SELECT * FROM (SELECT * FROM REVIEWS WHERE REVIEWS.STAR>=4 AND REVIEWS.BUSINESS_ID="
						+ "'" + businessID + "'"
						+ " ORDER BY REVIEWS.USEFUL_VOTE_NUMBER DESC) WHERE ROWNUM<=3";

				var badReview = "SELECT * FROM (SELECT *FROM REVIEWS WHERE REVIEWS.STAR<=3 AND REVIEWS.BUSINESS_ID="
						+ "'" + businessID + "'"
						+ " ORDER BY REVIEWS.USEFUL_VOTE_NUMBER DESC) WHERE ROWNUM<=3";
				
				var similarBusinesses = "SELECT * FROM ( SELECT * FROM BUSINESSES WHERE BUSINESS_ID IN ( SELECT BUSINESS_ID " +
						"FROM BUSINESS_CATEGORIES WHERE CATEGORY IN ( SELECT CATEGORY FROM BUSINESS_CATEGORIES WHERE " +
						"BUSINESS_ID = " + "'" + businessID + "'" + " ) ) AND CITY = " + "'" + businessCity + "'" +" AND " +
								"STATE= " + "'" + businessState + "'"  + " ORDER BY STAR DESC) WHERE ROWNUM <=3";
				batchQuery.push(goodReview);
				batchQuery.push(badReview);
				batchQuery.push(similarBusinesses);

				database.executeBatch(batchQuery, function(err, results) {
					if (err === null) {
						var businessList = [];
						businessList.push(businessInfo);
						respond.render('business.jade', {	
		 					business: businessList,
							goodRievew : results[0],
							badReview : results[1],
							userName: currentUser,
							similarBusinesses: results[2]
						});
						
//						console.log(results[0]);
//						console.log(results[1]);
//						console.log(results[0].length);
//						console.log(results[1].length);
//						console.log(results[2]);
					}
				});	
			}
		});

		
//		var batchQuery = [];
//		
//		var businessInfo = "SELECT * FROM BUSINESSES WHERE BUSINESS_ID='" + businessID + "'";
//		
//		var goodReview = "SELECT * FROM (SELECT * FROM REVIEWS WHERE REVIEWS.STAR>=4 AND REVIEWS.BUSINESS_ID="
//				+ "'" + businessID + "'"
//				+ " ORDER BY REVIEWS.USEFUL_VOTE_NUMBER DESC) WHERE ROWNUM<=3";
//
//		var badReview = "SELECT * FROM (SELECT *FROM REVIEWS WHERE REVIEWS.STAR<=3 AND REVIEWS.BUSINESS_ID="
//				+ "'" + businessID + "'"
//				+ " ORDER BY REVIEWS.USEFUL_VOTE_NUMBER DESC) WHERE ROWNUM<=3";
//		
//		var similarBusinesses = "SELECT * FROM BUSINESSES WHERE BUSINESS_ID IN ( SELECT BUSINESS_ID FROM " +
//				"BUSINESS_CATEGORIES WHERE CATEGORY IN ( SELECT CATEGORY FROM BUSINESS_CATEGORIES WHERE " +
//				"BUSINESS_ID = thisID ) ) AND CITY = thisCITY AND STATE=thisState";
//		batchQuery.push(businessInfo);
//		batchQuery.push(goodReview);
//		batchQuery.push(badReview);
//
//		database.executeBatch(batchQuery, function(err, results) {
//			if (err === null) {
//				respond.render('business.jade', {
// 					business: results[0],
//					goodRievew : results[1],
//					badReview : results[2],
//					userName: currentUser
//				});
//				console.log(results[0]);
//				console.log(results[1]);
//				console.log(results[0].length);
//				console.log(results[1].length);
//			}
//		});	
	} else {
		respond.redirect('/login');
	} 
	
}


exports.get = get;
