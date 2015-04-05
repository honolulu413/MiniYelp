
/*
 * GET home page, which is specified in Jade.
 */
var database = require('../lib/database');
var APP_USERS = require('../lib/table').APP_USERS;

exports.do_work = function(req, res){	
//	var row = {
//			schema : ["USER_NAME_ID", "PASSWORD", "FIRST_NAME", "LAST_NAME"],
//			data : ["foo", "123.0.0", "foo", "bar"]
//	};
//	
//	var x = APP_USERS.checkLegalData(row);
//	console.log(x);
	
	var sqlArray = ['SELECT COUNT(*) FROM APP_USERS',
	                'SELECT COUNT(*) FROM BUSINESSES'];
	database.executeBatch(sqlArray, function(errArray, resultsArray) {
		console.log(errArray);
		console.log(resultsArray);
	});
	
	res.render('index.jade', { 
	  title: 'HW3' 
  });
};
