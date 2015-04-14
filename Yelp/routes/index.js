
/*
 * GET home page, which is specified in Jade.
 */
var database = require('../lib/database');
var database_nosql = require('../lib/database_nosql');
var APP_USERS = require('../lib/table').APP_USERS;

exports.do_work = function(req, res){

	
	database_nosql.insert('message', {
		name:'abc',
		text:'123'
	}, function(err, results){});
	
	database_nosql.find('message', {
		name:'abc'
	}, function(results){
		console.log("============");
		console.log(results);
	});


};
