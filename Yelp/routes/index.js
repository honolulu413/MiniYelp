
/*
 * GET home page, which is specified in Jade.
 */
var database = require('../lib/database');
var database_nosql = require('../lib/database_nosql');
var APP_USERS = require('../lib/table').APP_USERS;
var async = require('async');

exports.get = function(req, res){
	database.execute(
			" SELECT STAR, COUNT(*) STAR_COUNT " +
			" FROM REVIEWS r " +
			" WHERE r.BUSINESS_ID = 'tU-YtoW339PXJmUGSix_AQ' " +
			" GROUP BY r.STAR ",
			function(err, results) {
				if (err == null) {
					console.log(results);
					var star_array = [0, 0, 0, 0, 0];
					for (var i = 0; i < results.length; i++) {
						star_array[results[i].STAR - 1] = results[i].STAR_COUNT
					}
					console.log(star_array);
				}
			}
			);

};
