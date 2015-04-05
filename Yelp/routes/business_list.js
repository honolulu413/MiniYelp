var database = require('../lib/database');
var BUSINESSES = require('../lib/table').BUSINESSES;
var object2Row = require('../lib/row').object2Row;
var alphanumeric = require('../lib/string.js').alphanumeric;


function get(request, respond) {
	var url_parts = require('url').parse(request.url, true);
	var query = url_parts.query;
	var rowQuery = object2Row(query);
	
	// clean data
	if (!BUSINESSES.checkLegalData(rowQuery)) {
		console.log("data invalid!");
		return;
	}
		
	database.select(BUSINESSES, rowQuery, function(err, results) {
		if(err === null) {
			respond.render('business_list.jade', {
				title : BUSINESSES.name,
				business_list : results.slice(0, 10),
				detalLink : null
			});
		}
	});
	
}

exports.get = get;
