var database = require('../lib/database');
var APP_USER_FRIENDS = require('../lib/table').APP_USER_FRIENDS;
var alphanumeric = require('../lib/string.js').alphanumeric;
var getPath = require('../lib/string').getPath;
var project = require('../lib/table').project;

function post(request, response) {
	console.log('friend request');
	
	var current_user_id = request.body['current_user_id'];
	var stranger_id = request.body['stranger_id'];
	
	database.insert(APP_USER_FRIENDS, {
		schema : APP_USER_FRIENDS.primaryKey,
		data : [current_user_id, stranger_id]
	}, function(err, results) {
		if (err !== null) {
			response.writeHead(302, {
				  'Location': '/user/' + stranger_id
			});
			response.end();		
		}
	});
}

exports.post = post;
