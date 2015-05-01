exports.do_work = function(request, response){
	console.log(request.query);
	var address = request.query.address;
	var LATITUDE = request.query.LATITUDE;
	var LONGITUDE = request.query.LONGITUDE;
	response.render('google.jade', {
		address: address,
		LATITUDE: LATITUDE,
		LONGITUDE: LONGITUDE
	});
};