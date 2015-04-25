var requestQueryParser = require('../lib/requestQueryParser');
var database = require('../lib/database');
var getPath = require('../lib/string').getPath;
var rowArrayWithLabel = require('../lib/row').rowArrayWithLabel;

exports.post = function(req, res) {
  var userName = req.session.username;
  var batch = [];
  var userIDs = req.param('friends_list');
  if (typeof userIDs !== 'undefined') {
    var num = userIDs.length;
    for ( var i = 0; i < userIDs.length; i++) {
      var query = "SELECT * FROM BUSINESSES WHERE BUSINESS_ID IN "
          + "( SELECT BUSINESS_ID FROM FAVORITES WHERE USER_NAME_ID" + " = "
          + "'" + userIDs[i] + "'" + ")"
      batch.push(query);
    }

    database.executeBatch(batch, function(err, results) {
      if (err === null) {
        console.log(results);
        var rank = {};
        for ( var i in results) {
          var result = results[i];
          for ( var j in result) {
            var business = result[j];
            var businessID = business["BUSINESS_ID"];
            console.log('businessID is: ' + businessID);
            if (typeof rank[businessID] !== 'undefined') {
              rank[businessID]['number'] += 1;
            } else {
              rank[businessID] = {
                'business' : business,
                'number' : 1
              }
            }
          }
        }

        var rankedArray = Object.keys(rank).map(function(key) {
          return rank[key]
        });
        var sorted = rankedArray.slice().sort(function(a, b) {
          return b.number - a.number
        });

        var sortedBusiness = [];
        for ( var i in sorted) {
          var business = sorted[i]['business'];
          sortedBusiness.push(business);
        }
        console.log(sortedBusiness);
        var businessList = rowArrayWithLabel(sortedBusiness, ['BUSINESS_ID',  'NAME', 'FULL_ADDRESS', 'CITY', 'STAR'], ['.url', 'name', 'address', 'city', 'star']);
        // adjust business url format
        for(var i = 0; i < businessList.length; i++) {
            businessList[i].data[0] = '/business/' + businessList[i].data[0];
        }
        res.render('invite.jade', {
          'userName':userName,
          'business_list' : businessList
        });
      }
    });
  }
};
