/**
 * Simple Homework 3 application for CIS 550
 * 
 * zives
 */

/**
 * Module dependencies.
 */
var express = require('express')
 , routes = require('./routes')
 , register = require('./routes/register')
 , login = require('./routes/login')
 , signup = require('./routes/signup')
 , facebook_login = require('./routes/facebook_login')
 , user = require('./routes/user')
 , http = require('http')
 , path = require('path')
 , stylus = require("stylus")
 , nib = require("nib")
 , business_list = require('./routes/business_list')
 , businesses = require('./routes/business')
 , logout = require('./routes/logout')
 , favorite = require('./routes/favorite')
 , invite = require('./routes/invite')
 , add_friend = require('./routes/add_friend')
 , message = require('./routes/message')
 , search_user = require('./routes/search_user')
 , google = require('./routes/google')
 , facebook = require('./routes/facebook')
 , image = require('./routes/image')
 , edit = require('./routes/edit')
 , index = require('./routes/index')
 ;
var bing = require('./routes/bing');
var session = require('express-session');

// Initialize express
var app = express();
// .. and our app
init_app(app);

// When we get a request for {app}/ we should call routes/index.js
app.get('/login', login.get);
app.get('/user/*/edit', edit.get);
app.get('/user*', user.get);
app.get('/business_list', business_list.get);
app.get('/business*', businesses.get);
app.get('/logout', logout.get);
app.get('/favorite', favorite.get);
app.get('/signup',signup.do_work);
app.get('/google', google.do_work);
app.get('/facebook', facebook.do_work);
app.get('/search_user', search_user.get);

app.get('/', login.get);


app.post('/invite', invite.post);
app.post('/bing', bing.post);
app.post('/register', register.post);
app.post('/login', login.post);
app.post('/facebook_login', facebook_login.post);
app.post('/favorite', favorite.post);
app.post('/user/add_friend', add_friend.post);
app.post('/user/send_message', message.post);
app.get('/facebook', facebook.do_work);

app.get('/search_user', search_user.get);
app.get('/image', image.get);
app.post('/image', image.post);


app.get('/', login.get);
app.post('/user/*/edit', edit.post);

// Listen on the port we specify
http.createServer(app).listen(app.get('port'), function() {
	console.log('Express server listening on port ' + app.get('port'));
});

// /////////////////
// This function compiles the stylus CSS files, etc.
function compile(str, path) {
	return stylus(str).set('filename', path).use(nib());
}

// ////
// This is app initialization code
function init_app() {
	// all environments
	app.use(express.cookieParser());

	app.use(express.session({
		secret : '1234567890ASECRETTOKEN'
	}));

	app.set('port', process.env.PORT || 8080);

	// Use Jade to do views
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');

	app.use(express.favicon());
	// Set the express logger: log to the console in dev mode
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(app.router);
	// Use Stylus, which compiles .styl --> CSS
	app.use(stylus.middleware({
		src : __dirname + '/public',
		compile : compile
	}));
	app.use(express.static(path.join(__dirname, 'public')));

	// development only
	if ('development' == app.get('env')) {
		app.use(express.errorHandler());
	}

}
