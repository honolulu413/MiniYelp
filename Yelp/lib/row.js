function getData(row, columnName) {
	var indexInRow = row.schema.indexOf(columnName);
	return row.data[indexInRow];
}

function object2Row(obj) {
	var row = {
			schema : [],
			data : []
	}
	
	for(var key in obj) {
		if(typeof obj[key] !== 'undefined') {
			row.schema.push(key);
			row.data.push(obj[key]);			
		}
	}
	return row;
}

exports.getData = getData;
exports.object2Row = object2Row;