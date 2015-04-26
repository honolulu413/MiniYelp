
/*
 * GET home page, which is specified in Jade.
 */
var database = require('../lib/database');
var database_nosql = require('../lib/database_nosql');
var APP_USERS = require('../lib/table').APP_USERS;
var async = require('async');

exports.do_work = function(req, res){
	console.log("123123");
	async.series([
	              function(callback){
	            	  while(true){}
	                  // do some stuff ...
	                  callback(null, 'one');
	              },
	              function(callback){
	                  // do some more stuff ...
	                  callback(null, 'two');
	              }
	          ],
	          // optional callback
	          function(err, results){
		console.log("====================");
	              // results is now equal to ['one', 'two']
	          });

	console.log("++++++++++++++++++++");
	
	
	
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
