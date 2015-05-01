var database = require('../lib/database');
var BUSINESSES = require('../lib/table').BUSINESSES;
var getPath = require('../lib/string').getPath;
var rowArrayWithLabel = require('../lib/row').rowArrayWithLabel;
var recommend_similar_business = require('../lib/recommend/recommend_similar_business');
var async = require('async');

function get(request, respond) {

    var businessID = getPath(request.params[0]);
    var businessInfo;
    var businessTitle;
    var currentUser = request.session.username;
    var businessCity;
    var businessState;

    console.log(businessID);
    
    if (currentUser) {
        database.select(BUSINESSES, {
            schema : BUSINESSES.primaryKey,
            data : [ businessID ]
        }, function(err, results) {
            if (err === null) {

                businessInfo = results[0];
                businessTitle = businessInfo["NAME"];
                businessCity = businessInfo["CITY"];
                businessState = businessInfo["STATE"];
                                
                var goodReview = "SELECT * FROM (SELECT * FROM REVIEWS WHERE REVIEWS.STAR>=4 AND REVIEWS.BUSINESS_ID="
                        + "'" + businessID + "'"
                        + " ORDER BY REVIEWS.USEFUL_VOTE_NUMBER DESC) WHERE ROWNUM<=3";

                var badReview = "SELECT * FROM (SELECT *FROM REVIEWS WHERE REVIEWS.STAR<=3 AND REVIEWS.BUSINESS_ID="
                        + "'" + businessID + "'"
                        + " ORDER BY REVIEWS.USEFUL_VOTE_NUMBER DESC) WHERE ROWNUM<=3";
                                
                var favorateBusinessQuery = " SELECT * FROM FAVORITES  " +
                					" WHERE USER_NAME_ID = '" + currentUser + "' " + 
                					" AND BUSINESS_ID = '" +  businessID + "' ";
                var reviewArrayQuery = " SELECT STAR, COUNT(*) STAR_COUNT " +
    			" FROM REVIEWS r " +
    			" WHERE r.BUSINESS_ID = '" +   businessID + 
    			"' GROUP BY r.STAR ";
                
                
            	async.parallel([function(callback) {
            		database.execute(goodReview, callback);
            	},
            	function(callback) {
            		database.execute(badReview, callback);
            	},
            	recommend_similar_business.getTask(null, businessInfo),
            	function(callback) {
            		database.execute(favorateBusinessQuery, callback);
            	},
            	function(callback) {
            		database.execute(reviewArrayQuery, callback);
            	}
            	],
            	function(err, resultsArray) {

                    if (err == null) {
                    	var similarBusinessList = rowArrayWithLabel(resultsArray[2], ['BUSINESS_ID',  'NAME', 'FULL_ADDRESS', 'CITY', 'STAR'], ['.url', 'name', 'address', 'city', 'star']);
                    	// adjust business url format
						for(var i = 0; i < similarBusinessList.length; i++) {
							similarBusinessList[i].data[0] = '/business/' + similarBusinessList[i].data[0];
						}

						
                        var businessList = [];
                        businessList.push(businessInfo);
                        
                        var isFavorate;
                        if (resultsArray[3].length === 0) {
                        	isFavorate = false;
                        } else {
                        	isFavorate = true;
                        }
                        
    					var star_array = [0, 0, 0, 0, 0];
    					var maxReviewNumber = 0;
    					console.log(resultsArray[4]);
    					for (var i = 0; i < resultsArray[4].length; i++) {
    						var a = resultsArray[4][i].STAR_COUNT;
    						console.log(a);
    						star_array[5 - resultsArray[4][i].STAR] = a;
    						if (a > maxReviewNumber) maxReviewNumber = a;
    					}
    					console.log(star_array);
    					
//    					star_array[0]
//    					star_array[4]
                                          
                        respond.render('business.jade', {   
                            business: businessList,
                            goodRievew : resultsArray[0],
                            badReview : resultsArray[1],
                            userName: currentUser,
                            similar_business_list: similarBusinessList,
                            is_favorate : isFavorate,
                            reviewArray : star_array,
                            maxReviewNumber : maxReviewNumber
                        });
                        
                    }
            	});            	
            }
        });
 
    } else {
        respond.redirect('/login');
    } 
    
}


exports.get = get;
