var project = require("./table").project;

function getData(row, columnName) {
	var indexInRow = row.schema.indexOf(columnName);
	return row.data[indexInRow];
}

function object2Row(obj, newSchema) {
	var row = {
			schema : [],
			data : []
	};
	
	for(var key in obj) {
		if(typeof obj[key] !== 'undefined') {
			row.schema.push(key);
			row.data.push(obj[key]);			
		}
	}
	
	if (typeof newSchema !== 'undefined') {
		return project(row, newSchema);
	} else {
		return row;
	}
}

// results : search results returned by database
// newSchema : the new schema we want, e.g. ['USER_NAME_ID', 'CITY']
// label : add label to this data, e.g. ['name', 'id']
// return : [ {label:['name', 'id'],data:['shu', '123']}, {}, ...]
function rowArrayWithLabel(results, newSchema, label) {
	var rowArray = [];
	
	for (var i = 0; i < results.length; i++) {
		var row = {
				label : [],
				data : []
		};
		
		for(var j = 0; j < newSchema.length; j++) {
			row.label.push(label[j]);
			row.data.push(results[i][newSchema[j]]);
		}
		
		rowArray.push(row);
	}
	return rowArray;
}



exports.getData = getData;
exports.object2Row = object2Row;
exports.rowArrayWithLabel = rowArrayWithLabel;