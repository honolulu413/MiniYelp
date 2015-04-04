function alphanumeric(str) {
	if(typeof str === 'undefined') {
		return false;
	}
	return /^\w+$/.test(str);
}

exports.alphanumeric = alphanumeric;