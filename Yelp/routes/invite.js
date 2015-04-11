var requestQueryParser = require('../lib/requestQueryParser');
var database = require('../lib/database');
var getPath = require('../lib/string').getPath;

exports.post = function(req, res){
//	var row = requestQueryParser.parse(req, ["current_user", "friends_list"]);
	var userName = req.session.username;
	
	var values1 = req.param('friends_list')[0];
	var values2 = req.param('friends_list')[1];
	var values3 = req.param('friends_list')[2];

	
//	console.log("value1 is " + values1);
//	console.log("value2 is " + values2);
//	console.log("value3 is " + values3);


	console.log("invite name is " + req.param('friends_list'));

	
	
	
	
	
//	database.insert(FAVORITES, row, function(err, results) {
//		if (err === null) {
//			console.log("add to favorite succeed");	
//			res.redirect('/user/' + userName);
//
//		}
//	});

};


