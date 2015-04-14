// Retrieve
var MongoClient = require('mongodb').MongoClient;

// Connect to the db
function connect(callback) {
	MongoClient.connect("mongodb://siyang:siyang@ds047581.mongolab.com:47581/yelp550", function(err, db) {
		if(!err) {
			callback(db);
		} else {
			console.log("error in connecting to mongodb");
			console.log(err);
		}
	});
}


var insertDocuments = function(collectionName, document, handleResults) {
	connect(function(db){
		// Get the documents collection
		var collection = db.collection(collectionName);
		// Insert some documents
		collection.insert(document, function(err, result) {
			handleResults(err, result);
		});
	});
}

exports.insert = insertDocuments;