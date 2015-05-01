// Connect string to Oracle
var connectData = { 
  "hostname": "cis550hw1.cfoish237b6z.us-west-2.rds.amazonaws.com", 
  "user": "cis550students", 
  "password": "cis550hw1", 
  "database": "IMDB" };
var oracle =  require("oracle");

/////
// Query the oracle database, and call output_actors on the results
//
// res = HTTP result object sent back to the client
// name = Name to query for
function query_db(res,name) {
  oracle.connect(connectData, function(err, connection) {
    if ( err ) {
    	console.log(err);
    } else {
	  	// selecting rows
	  	connection.execute("SELECT * FROM directors D INNER JOIN movies_directors" +
	  			" md ON D.id=md.director_id INNER JOIN movies m ON md.movie_id=m.id " +
	  			"WHERE D.last_name = '"+ name + "' ORDER BY m.rank DESC", [],
	  			   function(err, results) {
	  	    if ( err ) {
	  	    	console.log(err);
	  	    } else {
	  	    	connection.close(); // done with the connection
	  	    	output_director(res, name, results);
	  	    }
	
	  	}); // end connection.execute
    }
  }); // end oracle.connect
}

/////
// Given a set of query results, output a table
//
// res = HTTP result object sent back to the client
// name = Name to query for
// results = List object of query results
function output_director(res,name,results) {
	res.render('director.jade',
		   { title: "Top 5 movies by " + name,
		     results: results }
	  );
}

/////
// This is what's called by the main app 
exports.do_work = function(req, res){
	query_db(res,req.query.name);
};
