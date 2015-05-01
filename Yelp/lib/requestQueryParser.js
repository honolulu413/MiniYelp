//function parse(request, pattern) {
//	var value = {};
//	for(var i = 0; i < pattern.length; i++) {
//		value[pattern[i]] = request.query[pattern[i]];
//	}
//	return value;
//}

function parse(request, pattern) {
	var data = [];
	for(var i = 0; i < pattern.length; i++) {
		data.push(request.body[pattern[i]]);
	}
	
	return {
		schema : pattern,
		data : data
	};
}

exports.parse = parse;


