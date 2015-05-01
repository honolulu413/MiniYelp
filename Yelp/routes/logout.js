exports.get = function(req, res){
	req.session.username = null;
	res.redirect('/login');	
};