# Yelp
yelp project

# API in ./lib

# database.js

- execute(sql, handleResults)
 
Will execute sql and call handleResults(err, results). If there's no err, err will be null.
 
- insert(table, row, handleResults)

Will insert row into table, and call handleResults(err, results). If there's no err, err will be null.
 
table is some objects from ./lib/table, for example:

```javascript
var APP_USERS = require('../lib/table').APP_USERS;
```

row is an object with two attributes, schema and data, which value are arrays:

```javascript
var row = {
  schema : ['USER_NAME_ID', 'PASSWORD'],
  data : ['foo', 123]
  };
```

- select(table, row, handleResults)

Will select all columns from table, and results will satisfy the conditions set by row. Will call handleResults(err, results). If there's no err, err will be null.

For example, if query is like this:

```javascript
var database = require('../lib/database');
var APP_USERS = require('../lib/table').APP_USERS;

var row = {
  schema : ['USER_NAME_ID', 'PASSWORD'],
  data : ['foo', 123]
  };
  
database.select(APP_USERS, row, function(err, results){});
```

It's like we use this SQL:

```sql
SELECT *
FROM APP_USERS
WHERE USER_NAME_ID = 'foo'
  AND PASSWORD = 123;
```


- exist(table, row, handleResults)

Will check if row is in the database by row's primary key.
Will call handleResults(err, results). If there's no err, err will be null. 
Else, if the row exists will call handleResults(null, true), if not call handleResults(null, false)


# table.js

- table

I've only defined APP_USERS. need more code.

- project(row, newSchema)

like the project in relational algebra.
newSchema is an array.

# row.js

- getData(row, columnName)

help programmer extract data from any row.

```javascript
var getData = require('../lib/getData');

var row = {
  schema : ['USER_NAME_ID', 'PASSWORD'],
  data : ['foo', 123]
  };

getData(row, 'USER_NAME_ID')    // will return 'foo'
```

# string.js

- alphanumeric(str)

return true if str contains only of letters, numbers, underscores.






