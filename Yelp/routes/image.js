var database_nosql = require('../lib/database_nosql');
var fs = require('fs');
var mongodb = require('mongodb');
var type = 'image/jpeg';
var user;

function post(req, res) {
	user = request.session.username;

	fs.readFile(req.files.displayImage.path, function(err, data) {
		console.log(data);
		database_nosql.insert('image', {
			imageName : 'profile',
			imageContent : data,
			imageType : type,
			userName : user
		}, function(result) {
		});

	});
}

function get(request, respond) {
	var downloadImage;
	database_nosql.find('image', {
		userName : user
	}, function(result) {
		downloadImage = result[0].imageContent;
		var imagePath = "./public/images/" + user + ".jpg";
		var fileName = user + ".jpg";
		fs.writeFile(imagePath, downloadImage.buffer,
				function(err) {
					respond.render('image.jade', {
						name : fileName
					});
				});
	});

}

exports.get = get;
exports.post = post;