var requestQueryParser = require('../lib/requestQueryParser');
var database = require('../lib/database');
var FAVORITES = require('../lib/table').FAVORITES;

exports.post = function(req, res){
	var row = requestQueryParser.parse(req, ["BUSINESS_ID", "USER_NAME_ID"]);
	var userName = req.session.username;
	
	database.insert(FAVORITES, row, function(err, results) {
		if (err === null) {
			console.log("add to favorite succeed");	
			res.redirect('/user/' + userName);

		}
	});

};

exports.get = function(req, res){
	res.redirect('/login');
}