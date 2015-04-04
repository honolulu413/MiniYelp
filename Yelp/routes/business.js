var database = require('../lib/database');
var BUSINESSES = require('../lib/table').BUSINESSES;


function get(request, respond) {
	var businessID = /\w+/.exec(request.params);
	console.log(businessID);
 
		database.select(BUSINESSES,
				{schema : BUSINESSES.primaryKey,
				data : [businessID]},
				function(err, results) {
					if (err === null) {
						console.log(results);
						respond.render('business.jade', {
							title : results[0]["NAME"],
							business : results[0],
							label: BUSINESSES.label
						});
					}
				});
	
}

exports.get = get;
