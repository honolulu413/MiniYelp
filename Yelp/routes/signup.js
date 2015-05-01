var APP_USERS = require('../lib/table').APP_USERS;

exports.do_work = function(req, res){
      res.render('signup.jade', { 
          title: 'hello',
          schema: APP_USERS.schema,
          label: APP_USERS.label
      });
    };