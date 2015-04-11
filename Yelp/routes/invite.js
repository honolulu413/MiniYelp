var requestQueryParser = require('../lib/requestQueryParser');
var database = require('../lib/database');
var getPath = require('../lib/string').getPath;

exports.post = function(req, res){
//	var row = requestQueryParser.parse(req, ["current_user", "friends_list"]);
	var userName = req.session.username;
	
	var values1 = req.param('friends_list')[0];
	var values2 = req.param('friends_list')[1];

	console.log(values1);
	console.log(values2);


	console.log("invite name is " + userName);

	
	
	
	
	
//	database.insert(FAVORITES, row, function(err, results) {
//		if (err === null) {
//			console.log("add to favorite succeed");	
//			res.redirect('/user/' + userName);
//
//		}
//	});

};


