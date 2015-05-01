var database_nosql = require('../lib/database_nosql');
var fs = require('fs');
var mongodb = require('mongodb');

function get(request, respond) {
	var path = "images.jpeg"
	var data = fs.readFileSync(path);
	var imageBinary = new mongodb.Binary(data);
	
	var mime = require('mime');

	var type = mime.lookup('path');
	
	database_nosql.insert('image', {
		name : 'img1',
		image : imageBinary,
		mime : type
	}, function(result) {
	});
	
	respond.contentType(type);
	respond.write(imageBinary.buffer, "binary");

}

exports.get = get;