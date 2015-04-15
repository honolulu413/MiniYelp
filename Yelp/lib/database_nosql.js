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


function insertDocuments(collectionName, document, callback) {
	connect(function(db){
		// Get the documents collection
		var collection = db.collection(collectionName);
		// Insert some documents
		collection.insert(document, function(err, result) {
			callback(result);
		});
	});
}

function removeDocument(collectionName, document, callback) {
	connect(function(db){
		// Get the documents collection
		var collection = db.collection(collectionName);
		// Insert some documents
		collection.remove(document, function(err, result) {
			callback(result);
		});
	});
}


function findDocument(collectionName, document, callback) {
	connect(function(db){
		// Get the documents collection
		var collection = db.collection(collectionName);
		// Insert some documents
		collection.find(document).toArray(function(err, docs) {
			callback(docs);
		});
	});
}


exports.connect = connect;
exports.insert = insertDocuments;
exports.remove = removeDocument;
exports.find= findDocument;
