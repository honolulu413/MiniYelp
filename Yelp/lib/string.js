function alphanumeric(str) {
	if(typeof str === 'undefined') {
		return false;
	}
	return /^\w+$/.test(str);
}

function getPath(path) {
	return /^\/([^\/]+)/.exec(path)[1];
}

exports.alphanumeric = alphanumeric;
exports.getPath = getPath