var requestQueryParser = require('../lib/requestQueryParser');
var APP_USERS = require('../lib/table').APP_USERS;
var database = require('../lib/database');
var getData = require('../lib/row.js').getData;

function post (request, respond) {
	var rowPost = requestQueryParser.parse(request, APP_USERS.schema);

	if (!APP_USERS.checkLegalData(rowPost)) {
		console.log("post data invalid!");
		return;
	}

	database.exist(APP_USERS, rowPost, function(err, results) {
		if (err !== null) {
			console.log("server error");
			respond.render('signup.jade', { 
				message: 'something bad happend..',
				  schema: APP_USERS.schema,
				  label: APP_USERS.label
			  });

		} else {
			if (results === false) {
				// user name not exist. could register
				database.insert(APP_USERS, rowPost, function(err, results) {
					if (err === null) {
						console.log("register succeed");
						// successfully registered. redirect to homepage
						request.session.username = getData(rowPost, "USER_NAME_ID");

						respond.writeHead(302, {
							  'Location': '/user/' + getData(rowPost, 'USER_NAME_ID')
						});
						respond.end();						
					}
				});
			} else {
				// duplicate name. 
				console.log("fail to register");
				respond.render('signup.jade', { 
					  message: 'fail to register. please choose another name',
					  schema: APP_USERS.schema,
					  label: APP_USERS.label
				  });
				
			}
		}
	});	
}

exports.post = post;