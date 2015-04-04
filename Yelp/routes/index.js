
/*
 * GET home page, which is specified in Jade.
 */
var database = require('../lib/database');
var APP_USERS = require('../lib/table').APP_USERS;

exports.do_work = function(req, res){
//	database.execute('SELECT COUNT(*) FROM BUSINESSES', function(results){console.log(results);});
//	var row = {
//			schema : ['USER_NAME_ID'],
//			data : ['joe']
//	};

//	database.select(APP_USERS, row, function(results) { 
//		for(var i = 0; i < results.length; i++) {
//			console.log(results[i]); 
//		}
//	});
	
//	var row_insert = {
//			schema : ["USER_NAME_ID", "PASSWORD", "FIRST_NAME", "LAST_NAME"],
//			data : ["foo", "123", "foo", "bar"]
//	};
//	
//	database.insert(APP_USERS, row_insert, function(results) {
//		console.log("succeed");
//	});
	
//	database.exist(APP_USERS, row_insert, function() {
//		console.log("yes");
//	});

//	var x = require("../lib/table").project(row_insert, ["USER_NAME_ID"]);
//	console.log(x);
	
	res.render('index.jade', { 
	  title: 'HW3' 
  });
};
