var database = require('./database');
var getData = require('./row').getData;

var Table = function() {
};

// all data should contain only letters, numbers, underscore
Table.prototype.checkLegalData = function(row) {
	for ( var i = 0; i < row.schema.length; i++) {
		var columnName = row.schema[i];

		var type = this.getType(columnName);
		// if there is no type info, treat it as 'string'
		if (typeof type === 'undefined') {
			type = "string";
		}
		type = type.toLowerCase();

		if (type === 'string') {
			if (!/^[-0-9a-zA-Z_]*$/.test(row.data[i])) {
				console.log("some string contains non-letter!");
				return false;
			}
		} else if (type === 'number' || type === 'integer' || type === 'int') {
			if (!/^[0-9]+(\.[0-9]+)?$/.test(row.data[i])) {
				console.log("some number contains non-numbers!");
				return false;
			}
		} else {
			console.log("Undefined format");
			return false;
		}
	}
	return true;
};

// primary key constraint
Table.prototype.checkPrimaryKey = function(row) {
	if (this.primaryKey === undefined) {
		return true;
	}
	
	for ( var i = 0; i < this.primaryKey.length; i++) {
		var columnName = this.primaryKey[i];
		var indexInRow = row.schema.indexOf(columnName);

		if (typeof indexInRow === 'undefined') {
			console.log("primary key contraint violated!");
			return false;
		}

		var primaryKeyData = row.data[indexInRow];
		if (typeof primaryKeyData === 'undefined' || primaryKeyData === "") {
			console.log("primary key contraint violated!");
			return false;
		}
	}
	return true;
};

// not null constraint
Table.prototype.checkNotNull = function(row) {
	if (this.notNull === undefined) {
		return true;
	}
	
	for ( var i = 0; i < this.notNull.length; i++) {
		var columnName = this.notNull[i];
		var indexInRow = row.schema.indexOf(columnName);

		if (typeof indexInRow === 'undefined') {
			console.log("not null contraint violated!");
			return false;
		}

		var notNullData = row.data[indexInRow];
		if (typeof notNullData === 'undefined' || notNullData === "") {
			console.log("not null contraint violated!");
			return false;
		}
	}
	return true;
};

Table.prototype.rowExist = function(row, handleResults) {
	var primaryKeyRow = project(row, this.primaryKey);
};

Table.prototype.getType = function(columnName) {
	if (typeof this.type !== 'undefined')
		return this.type[this.schema.indexOf(columnName)];
	else {
		return undefined;
	}
};

Table.prototype.getLabel = function(columnName) {
	return this.label[this.schema.indexOf(columnName)];
};

function project(row, newSchema) {
	var schema = [];
	var data = [];

	for ( var i = 0; i < newSchema.length; i++) {
		var indexInRow = row.schema.indexOf(newSchema[i]);

		if (typeof indexInRow !== 'undefined') {
			schema.push(newSchema[i]);
			data.push(row.data[indexInRow]);
		}
	}

	return {
		schema : schema,
		data : data
	};
}

// The order of elements in schema, type, label does matter
// type could be 'string', 'int', 'integer', ..., and either uppercase or
// lowercase is fine.
// type could also be omitted, in this case, all fields are treated as 'string'

// APP_USERS
var APP_USERS = new Table();

APP_USERS.name = "APP_USERS";
APP_USERS.primaryKey = [ "USER_NAME_ID" ];
APP_USERS.notNull = [ "USER_NAME_ID", "PASSWORD", "FIRST_NAME", "LAST_NAME" ];

APP_USERS.schema = [ "USER_NAME_ID", "PASSWORD", "FIRST_NAME", "LAST_NAME",
		"LOCATION_CITY", "LOCATION_STATE" ];
APP_USERS.type = [ "string", "string", "string", "string", "string", "string" ];
APP_USERS.label = [ "name", "password", "first name", "last name", "city",
		"state" ];

// BUSINESSES
var BUSINESSES = new Table();

BUSINESSES.name = "BUSINESSES";
BUSINESSES.primaryKey = [ "BUSINESS_ID" ];

BUSINESSES.schema = [ "BUSINESS_ID", "NAME", "FULL_ADDRESS", "CITY", "STATE",
		"LATITUDE", "LONGTITUDE", "STAR", "REVIEW_COUNT" ];
BUSINESSES.type = [ "string", "string", "string", "string", "string", "int",
		"int", "int", "int" ];
BUSINESSES.label = [ "business ID", "name", "address", "city", "state",
		"latitude", "longitude", "star", "review count" ];

// FAVORITES
var FAVORITES = new Table();

FAVORITES.name = "FAVORITES";
FAVORITES.primaryKey = [ "BUSINESS_ID", "USER_NAME_ID" ];

FAVORITES.schema = [ "BUSINESS_ID", "USER_NAME_ID" ];
FAVORITES.type = [ "string", "string" ];
FAVORITES.label = [ "business ID", "name"];
FAVORITES.notNull = [ "BUSINESS_ID", "USER_NAME_ID" ];

//REVIEWS
var REVIEWS = new Table();

REVIEWS.name = "REVIEWS";
REVIEWS.primaryKey = ["BUSINESS_ID", "USER_ID"];
REVIEWS.schema = ["BUSINESS_ID", "USER_ID", "STAR", "REVIEW_TEXT", "REVIEW_DATE", "USEFUL_VOTE_NUMBER"];
REVIEWS.type = ["string", "string", "int", "string", "string", "int"];
REVIEWS.label = ["business ID", "name", "address", "city", "state", "latitude", "longitude", "star", "review count"];

// APP_USER_FRIENDS
var APP_USER_FRIENDS = new Table();

APP_USER_FRIENDS.name = "APP_USER_FRIENDS";
APP_USER_FRIENDS.primaryKey = ["USER_NAME_ID1", "USER_NAME_ID2"];
APP_USER_FRIENDS.schema = ["USER_NAME_ID1", "USER_NAME_ID2"];

exports.APP_USERS = APP_USERS;
exports.BUSINESSES = BUSINESSES;
exports.FAVORITES = FAVORITES;
exports.APP_USER_FRIENDS = APP_USER_FRIENDS;
exports.REVIEWS = REVIEWS;

exports.project = project;
