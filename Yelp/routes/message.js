var database_nosql = require('../lib/database_nosql');

function post(request, response) {
	console.log('new message');
	
	var current_user_id = request.body['current_user_id'];
	var stranger_id = request.body['stranger_id'];
	var new_message = request.body['message'];
	
	database_nosql.insert('message', {
		sender : current_user_id,
		receiver : stranger_id,
		text : new_message
	}, function(result){}
	);
	
	response.writeHead(302, {
		  'Location': '/user/' + stranger_id
	});
	response.end();		
}

exports.post = post;
