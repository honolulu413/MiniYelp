function alphanumeric(str) {
	if(typeof str === 'undefined') {
		return false;
	}
	return /^\w+$/.test(str);
}

function getPath(path) {
	var result = /^\/([^\/]+)/.exec(path);
	if (typeof result !== 'undefined' && result !== null && result.length > 0) {
		return result[1];
	} else {
		return "";
	}
}

exports.alphanumeric = alphanumeric;
exports.getPath = getPath