var requestQueryParser = require('../lib/requestQueryParser');
var database = require('../lib/database');
var getPath = require('../lib/string').getPath;
var rowArrayWithLabel = require('../lib/row').rowArrayWithLabel;
var recommend_good_business_for_party = require('../lib/recommend/recommend_good_business_for_party');
var async = require('async');

exports.post = function(req, res) {
  var userName = req.session.username;

  var batch = [];
  var userList = req.param('friends_list');
  if (typeof userList !== 'undefined') {
	  async.parallel([recommend_good_business_for_party.getTask(userList)],
			  		function(err, results) {
				        var businessList = rowArrayWithLabel(results[0], ['BUSINESS_ID',  'NAME', 'FULL_ADDRESS', 'CITY', 'STAR'], ['.url', 'name', 'address', 'city', 'star']);
				        // adjust business url format
				        for(var i = 0; i < businessList.length; i++) {
				            businessList[i].data[0] = '/business/' + businessList[i].data[0];
				        }
				        res.render('invite.jade', {
				          'userName':userName,
				          'business_list' : businessList
				        });
				  });
  }
};
