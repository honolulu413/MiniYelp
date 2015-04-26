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
                
                
            	async.parallel([function(callback) {
            		database.execute(goodReview, callback);
            	},
            	function(callback) {
            		database.execute(badReview, callback);
            	},
            	recommend_similar_business.getTask(null, businessInfo),
            	function(callback) {
            		database.execute(favorateBusinessQuery, callback);
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
                        
                        if (resultsArray[3].length == 0) {
                        	var isFavorate = false;
                        } else {
                        	var isFavorate = true;
                        }
                        
                        respond.render('business.jade', {   
                            business: businessList,
                            goodRievew : resultsArray[0],
                            badReview : resultsArray[1],
                            userName: currentUser,
                            similar_business_list: similarBusinessList,
                            is_favorate : isFavorate
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
