// Connect string to Oracle

var connectData = { 
		  "hostname": "yelpfundbinstance.cfvsrwydlnih.us-east-1.rds.amazonaws.com:1521/MYYELPDB", 
		  "user": "nevsaynev2012", 
		  "password": "xysykbjxhldtws", 
		  "INSTANCE_NAME": "cis550proj", 
		  "sid": "MYYELPDB",
		  "port": 1521};
var oracle =  require("oracle");
	
function execute(sql, handleResults) {
  console.log("about to execute sql:" + sql);
  oracle.connect(connectData, function(err, connection) {
    if ( err ) {
    	handleResults(err, null);
    } else {
	  	// selecting rows
	  	connection.execute(sql, 
	  			   [], 
	  			   function(err, results) {
	  	    if ( err ) {
	  	    	console.log(err);
	  	    	handleResults(err, null);
	  	    } else {
	  	    	handleResults(null, results);
	  	    	connection.close(); // done with the connection
	  	    }
	  	}); // end connection.execute
    }
  }); // end oracle.connect
}

function executeBatch(sqlBatch, handleResultsBatch) {
  console.log("about to execute sql:" + sqlBatch);
  var resultsArray = [];
  var errArray = [];
  var totalTaskNum = sqlBatch.length;
  var handleCompletedCount = 0;
  
  function handleGenerator(taskIndex) {
	var MyTaskIndex = taskIndex;
	// return handleResults function
	  return function (err, results) {
		  handleCompletedCount++;
	  	if (err === null) {
	  	  resultsArray[MyTaskIndex] = results;
	  	  // if handle has collected all the results
	  	  if (handleCompletedCount === totalTaskNum) {
	  		// if there is no err, set errArray to null (instead of empty array)
	  		var errNullCount = 0;
	  		for(var j = 0; j < sqlBatch.length; j++) {
	  			if(typeof errArray[j] === 'undefined') {
	  				errNullCount++;
	  			}
	  		}
	  		if (errNullCount === sqlBatch.length) {
	  			errArray = null;
	  		}
	  		// execute handler
	  	  	handleResultsBatch(errArray, resultsArray);
	  	  }
	  	} else {
	  		errArray[MyTaskIndex] = err;
	  	}
	  }
  }
  
  for(var i = 0; i < sqlBatch.length; i++) {
  	execute(sqlBatch[i], handleGenerator(i));
  }

}

function insert(table, row, handleResults) {
	if (table.checkLegalData(row) && table.checkPrimaryKey(row) && table.checkNotNull(row)) {
		var rowFormatted = adjustTypeFormat(table, row);

		var sql = "INSERT INTO " + table.name +
			" (" + rowFormatted.schema.join(", ") +
			") VALUES(" + rowFormatted.data.join(", ") + ")";
		execute(sql, handleResults);
	} else {
		handleResults("invalid row", null);
	}
}

// example:
// row = { schema : ['id', 'name'],
//		     data : ['1a', 'foo']
//       }
// the result is like:
// SELECT * FROM some_table WHERE id = '1a' AND name = 'foo';
function select(table, row, handleResults) {
	// remove empty data
	var newRow = {
			schema : [],
			data : []
	};
	
	for(var i = 0; i < row.schema.length; i++) {
		if(row.data[i] !== null && row.data[i] !== "") {
			newRow.schema.push(row.schema[i]);
			newRow.data.push(row.data[i]);
		}
	}

//	if (table.checkLegalData(newRow) && table.checkPrimaryKey(newRow)) {
	if (table.checkLegalData(newRow)) {
		// generate WHERE clause
		var rowFormatted = adjustTypeFormat(table, newRow);
		var where_clause = [];
		for(var i = 0; i < rowFormatted.schema.length; i++) {
			where_clause.push(rowFormatted.schema[i] + " = " + rowFormatted.data[i]);
		}
		// array -> where clause
		where_clause = " WHERE " + where_clause.join(" AND ");

		var sql = "SELECT " + "*" +
			" FROM " + table.name + where_clause;
		execute(sql, handleResults);
	} else {
		handleResults("invalid row", null);
	}
}

function lowerSelect(table, row, handleResults) {
	// remove empty data
	var newRow = {
			schema : [],
			data : []
	};
	
	for(var i = 0; i < row.schema.length; i++) {
		if(row.data[i] !== null && row.data[i] !== "") {
			newRow.schema.push(row.schema[i]);
			newRow.data.push(row.data[i].toLowerCase());
		}
	}

//	if (table.checkLegalData(newRow) && table.checkPrimaryKey(newRow)) {
	if (table.checkLegalData(newRow)) {
		// generate WHERE clause
		var rowFormatted = adjustTypeFormat(table, newRow);
		var where_clause = [];
		for(var i = 0; i < rowFormatted.schema.length; i++) {
			where_clause.push("lower(" + rowFormatted.schema[i] + ") = " + rowFormatted.data[i]);
		}
		// array -> where clause
		where_clause = " WHERE " + where_clause.join(" AND ");

		var sql = "SELECT " + "*" +
			" FROM " + table.name + where_clause;
		execute(sql, handleResults);
	} else {
		handleResults("invalid row", null);
	}
}

// if the primary key part of row exist, call handleResults().
// else, do nothing.
function exist(table, row, handleResults) {	
	if (table.checkLegalData(row) && table.checkPrimaryKey(row)) {
		var project = require('./table').project;

		var primaryColumn = project(row, table.primaryKey);
		
		select(table, primaryColumn, function(err, results) {
			if (err !== null) {
				handleResults(err, null);
			} else {
				if (results.length > 0) {
					handleResults(null, true);
				} else {
					handleResults(null, false);
				}				
			}
		});
	} else {
		handleResults("invalid row", null);
	}
}

//if the primary key part of row exist, call handleResults().
//else, do nothing.
function allExist(table, row, handleResults) {	
	console.log("row is: " + row);
	if (table.checkLegalData(row) && table.checkPrimaryKey(row)) {
		var project = require('./table').project;		
		select(table, row, function(err, results) {
			if (err !== null) {
				handleResults(err, null);
			} else {
				if (results.length > 0) {
					handleResults(null, true);
				} else {
					handleResults(null, false);
				}				
			}
		});
	} else {
		handleResults("invalid row", null);
	}
}

//add quote for strings. won't export
function adjustTypeFormat(table, row) {
	var newRow = {
			schema : [],
			data : []
	};
	
	for(var i = 0; i < row.schema.length; i++) {
		var columnName = row.schema[i];
		var columnType = table.getType(columnName);
		// if there is no type info, treat it as string.
		if (typeof columnType == 'undefined') {
			newRow.schema.push(columnName);
			newRow.data.push("'" + row.data[i] + "'");
		} else {
			// if type info is defined:
			columnType = columnType.toLowerCase();
			if (columnType == 'string') {
				// string
				newRow.schema.push(columnName);
				newRow.data.push("'" + row.data[i] + "'");
			} else if (columnType == 'int' || columnType == 'integer' || columnType == 'number') {
				// int. do nothing
				newRow.schema.push(columnName);
				newRow.data.push(row.data[i]);
			} else {
				console.log("unknow type? in database.js - select");
				return;
			}
		}
	}
	return newRow;
}


exports.execute = execute;
exports.executeBatch = executeBatch;
exports.insert = insert;
exports.select = select;
exports.exist = exist;
exports.allExist = allExist;
exports.lowerSelect = lowerSelect;




