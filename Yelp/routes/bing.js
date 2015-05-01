var acctKey = 'UBlqBGw8Ex3KxCeFgjh21Wv81/dCV9QX9OFZRKtA+DM';
var rootUri = 'https://api.datamarket.azure.com/Bing/Search';
var rowArrayWithLabel = require('../lib/row').rowArrayWithLabel;

var auth    = new Buffer([ acctKey, acctKey ].join(':')).toString('base64');
var request = require('request').defaults({
  headers : {
    'Authorization' : 'Basic ' + auth
  }
});

exports.post = function(req, res){
	
	var businessName = req.param('BUSINESS_NAME');
	var city = req.param('BUSINESS_CITY');
	var state = req.param('BUSINESS_STATE');
	  var userName = req.session.username;
	
		  var service_op  = 'Web';
		  var query = businessName + ' ' + city + ' ' + state;
		  
		  request.get({
			    url : rootUri + '/' + service_op,
			    qs  : {
			      $format : 'json',
			      Query   : "'" + query + "'", // the single quotes are required!
			    }
			  }, function(err, response, body) {
 			    if (err) {
			      console.log("error");
				  return res.send(500, err.message);

			    }
			    if (response.statusCode !== 200) {
				      console.log("not 200 " +  response.statusCode);
				      return res.send(500, response.body);
			    }
			    var results = JSON.parse(response.body);
			    console.log("=============================");
			    var businessList = rowArrayWithLabel(results.d.results, ['Url',  'Title', 'Description'], ['.url', 'name', 'description']);
	              console.log(businessList);

			    // adjust business url format
		     
				res.render('bing.jade', {
					searchResults : businessList,
					userName : userName
				});
			    
//			    res.send(results.d.results);
			  });
		  

}
