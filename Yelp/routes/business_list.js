var database = require('../lib/database');
var BUSINESSES = require('../lib/table').BUSINESSES;
var object2Row = require('../lib/row').object2Row;
var alphanumeric = require('../lib/string.js').alphanumeric;
var rowArrayWithLabel = require('../lib/row').rowArrayWithLabel;


function get(request, respond) {
	var url_parts = require('url').parse(request.url, true);
	var query = url_parts.query;
	var rowQuery = object2Row(query);    
    var userName = request.session.username;
	
	// clean data
	if (!BUSINESSES.checkLegalData(rowQuery)) {
		console.log("data invalid!");
		return;
	}

	database.lowerSelect(BUSINESSES, rowQuery, function(err, results) {
		if(err === null) {
			var businessList = rowArrayWithLabel(results.slice(0, 10), ['BUSINESS_ID',  'NAME', 'FULL_ADDRESS', 'CITY', 'STAR'], ['.url', 'name', 'address', 'city', 'star']);
			// adjust business url format
			for(var i = 0; i < businessList.length; i++) {
				businessList[i].data[0] = '/business/' + businessList[i].data[0];
			}

			respond.render('business_list.jade', {
			    userName : userName,
				title : BUSINESSES.name,
				business_list : businessList,
				detalLink : null
			});
		}
	});
	
}

exports.get = get;
