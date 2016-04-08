# JSONStore for Javascript 

JSONStore is a lightweight, document-oriented storage system that enables persistent storage of JSON documents for web applications.

# Features
* A simple API that allows developers to add, store, replace, search through documents without memorizing query syntax
* Ability to track local changes

# Setup
Include the following to your script tags. 
```HTML
<script src="libs/jquery.js"></script>
<script src="libs/jsonstore_lodash.js"></script>
<script src="libs/sjcl.min.js"></script>
<script src="libs/jsonstore_stub.js"></script>
<script src="jsonstore.js" data-cover></script>
```


	 
# Usage

#### Initialize and open connections, get an Accessor, and add data
```Javascript
var collectionName = 'people';

// Object that defines all the collections.
var collections = {

  // Object that defines the 'people' collection.
  people : {

    // Object that defines the Search Fields for the 'people' collection.
    searchFields : {name: 'string', age: 'integer'}
  }
};

// Optional options object.
var options = {

  // Optional username, default 'jsonstore'.
  username : 'akirasaito',

  // Optional password, default no password.
  password : 'mojo',
};

JSONStore.init(collections, options)

    .then(function () {

        // Data to add, you probably want to get
        // this data from a network call (e.g. MobileFirst Adapter).
        var data = [{name: 'kumogakure', age: 10}];

        // Optional options for add.
        var addOptions = {

            // Mark data as dirty (true = yes, false = no), default true.
            markDirty: true
        };

            // Get an accessor to the people collection and add data.
            return WL.JSONStore.get(collectionName).add(data, addOptions);
    })
    .then(function (numberOfDocumentsAdded) {
        // Add was successful.
    })

    .fail(function (errorObject) {
        // Handle failure for any of the previous JSONStore operations (init, add).
    });
```

#### Find - locate documents inside the Store
	
```Javascript
var collectionName = 'people';

// Find all documents that match the queries.
var queryPart1 = WL.JSONStore.QueryPart()
                   .equal('name', 'carlos')
                   .lessOrEqualThan('age', 10)

var options = {
  // Returns a maximum of 10 documents, default no limit.
  limit: 10,

  // Skip 0 documents, default no offset.
  offset: 0,

  // Search fields to return, default: ['_id', 'json'].
  filter: ['_id', 'json'],

  // How to sort the returned values, default no sort.
  sort: [{name: WL.constant.ASCENDING}, {age: WL.constant.DESCENDING}]
};

JSONStore.get(collectionName)

    // Alternatives:
    // - findById(1, options) which locates documents by their _id field
    // - findAll(options) which returns all documents
    // - find({'name': 'carlos', age: 10}, options) which finds all documents
    // that match the query.
    .advancedFind([queryPart1], options)

        .then(function (arrayResults) {
        // arrayResults = [{_id: 1, json: {name: 'carlos', age: 99}}]
    })

    .fail(function (errorObject) {
        // Handle failure.
    });
```

#### Replace - change the documents that are already stored inside a Collection
```Javascript
var collectionName = 'people';

// Documents will be located with their '_id' field 
// and replaced with the data in the 'json' field.
var docs = [{_id: 1, json: {name: 'kyo', age: 99}}];

var options = {

  // Mark data as dirty (true = yes, false = no), default true.
  markDirty: true
};

JSONStore.get(collectionName)

    .replace(docs, options)

        .then(function (numberOfDocumentsReplaced) {
            // Handle success.
        })

        .fail(function (errorObject) {
            // Handle failure.
        });
```

#### Remove - delete all documents that match the query

```Javascript
var collectionName = 'people';

// Remove all documents that match the queries.
var queries = [{_id: 1}];

var options = {

  // Exact match (true) or fuzzy search (false), default fuzzy search.
  exact: true,

  // Mark data as dirty (true = yes, false = no), default true.
  markDirty: true
};

JSONStore.get(collectionName)

    .remove(queries, options)

        .then(function (numberOfDocumentsRemoved) {
            // Handle success.
        })

        .fail(function (errorObject) {
            // Handle failure.
        });
```

	
#### Count - gets the total number of documents that match a query
```Javascript
var collectionName = 'people';

// Count all documents that match the query.
// The default query is '{}' which will 
// count every document in the collection.
var query = {name: 'carlos'}; 
var options = {

  // Exact match (true) or fuzzy search (false), default fuzzy search.
  exact: true
};

JSONStore.get(collectionName)

    .count(query, options)

        .then(function (numberOfDocumentsThatMatchedTheQuery) {
            // Handle success.
        })

        .fail(function (errorObject) {
            // Handle failure.
        });
```	

#### Destroy - wipes data for all users, destroys the internal storage, and clears security artifacts

```Javascript
JSONStore.destroy()

    .then(function () {
        // Handle success.
    })

    .fail(function (errorObject) {
        // Handle failure.
    });
```	

### Destroy - wipes data for a specific user
```Javascript
JSONStore.destroy('user1')

    .then(function () {
        // Handle success.
    })

    .fail(function (errorObject) {
        // Handle failure.
    });
```

#### Security - close access to all opened Collections for the current user
```Javascript
JSONStore.closeAll()

    .then(function () {
        // Handle success.
    })

    .fail(function (errorObject) {
        // Handle failure.
    });
```

#### Security - change the password that is used to access a Store
```Javascript
// The password should be user input. 
// It is hard-coded in the example for brevity.
// There is no clearPasswords method this is just an example for brevity. 
var oldPassword = '123';
var newPassword = '456';

var clearPasswords = function () {
  oldPassword = null;
  newPassword = null;
};

// Default username if none is passed is: 'jsonstore'.
var username = 'shin';

JSONStore.changePassword(oldPassword, newPassword, username)

.then(function () {

  // Make sure you do not leave the password(s) in memory.
  
  clearPasswords(); 

  // Handle success.
})

.fail(function (errorObject) {

  // Make sure you do not leave the password(s) in memory.
  clearPasswords();

  // Handle failure.
});
```

#### Push - get all documents that are marked as dirty, send them to a MobileFirst adapter, and mark them clean
```Javascript
//There is no sendToServer method this is just an example for brevity
var collectionName = 'people';
var dirtyDocs;

JSONStore.get(collectionName)

    .getAllDirty()

        .then(function (arrayOfDirtyDocuments) {
            // Handle getAllDirty success.

            dirtyDocs = arrayOfDirtyDocuments;

        //Send to dirtyDocs to server for processing
        return sendToServer(dirtyDocs)
    })

    .then(function (responseFromServer) {
        // Handle response from server

        // You may want to check the response from the adapter
        // and decide whether or not to mark documents as clean.
        return JSONStore.get(collectionName).markClean(dirtyDocs);
    })

    .then(function () {
        // Handle markClean success.
    })

    .fail(function (errorObject) {
        // Handle failure.
    });
```

#### Pull - get new data from a server and add to JSONStore
```Javascript
//There is not retrieveFromServer method this is just an example for breviety
var collectionName = 'people';

var invocationData = {
  adapter : 'adapter-name', 
  procedure : 'procedure-name-2', 
  parameters : [],
  compressResponse: true
};

retrieveFromServer()
    .then(function (responseFromServer) {
        // Handle invokeProcedure success.

        // The following example assumes that the adapter returns an arrayOfData, 
        // (which is not returned by default),
        // as part of the invocationResult object, 
        // with the data that you want to add to the collection.
        var data = responseFromServer.responseJSON

        // Example:
        // data = [{id: 1, ssn: '111-22-3333', name: 'kenshin'}];

        var changeOptions = {

            // The following example assumes that 'id' and 'ssn' are search fields, 
            // default will use all search fields
            // and are part of the data that is received.
            replaceCriteria : ['id', 'ssn'],

            // Data that does not exist in the Collection will be added, default false.
            addNew : true,

            // Mark data as dirty (true = yes, false = no), default false.
            markDirty : false
        };

        return JSONStore.get(collectionName).change(data, changeOptions);
    })

    .then(function () {
        // Handle change success.
    })

    .fail(function (errorObject) {
        // Handle failure.
    });

```
#### Check whether a document is dirty


```Javascript
	var collectionName = 'people';
    var doc = {_id: 1, json: {name: 'carlitos', age: 99}};

    JSONStore.get(collectionName)

        .isDirty(doc)

            .then(function (isDocumentDirty) {
            // Handle success.

            // isDocumentDirty - true if dirty, false otherwise.
        })

        .fail(function (errorObject) {
            // Handle failure.
        });
```

#### Check the number of dirty documents
```Javascript
var collectionName = 'people';

JSONStore.get(collectionName)

.countAllDirty()

    .then(function (numberOfDirtyDocuments) {
        // Handle success.
    })

    .fail(function (errorObject) {
        // Handle failure.
    });
```

#### Remove a Collection
```Javascript
var collectionName = 'people';

JSONStore.get(collectionName)

    .removeCollection()

        .then(function () {
            // Handle success.

            // Note: You must call the 'init' API to re-use the empty collection.
            // See the 'clear' API if you just want to remove all data that is inside.
        })

        .fail(function (errorObject) {
            // Handle failure.
        });
```

#### Clear all data that is inside a Collection
```Javascript
var collectionName = 'people';

JSONStore.get(collectionName)

    .clear()

        .then(function () {
            // Handle success.

            // Note: You might want to use the 'removeCollection' API
            // instead if you want to change the search fields.
        })

        .fail(function (errorObject) {
            // Handle failure.
        });
```
	
#### Start a transaction, add some data, remove a document, commit the transaction and roll back the transaction if there is a failure
	
```Javascript
JSONStore.startTransaction()

    .then(function () {
        // Handle startTransaction success.
        // You can call every JSONStore API method except:
        // init, destroy, removeCollection, and closeAll.

        var data = [{name: 'kitsune'}];

        return WL.JSONStore.get(collectionName).add(data);
    })

    .then(function () {

        var docs = [{_id: 1, json: {name: 'donatsu'}}];

        return WL.JSONStore.get(collectionName).remove(docs);
    })

    .then(function () {

        return WL.JSONStore.commitTransaction();
    })

    .fail(function (errorObject) {
        // Handle failure for any of the previous JSONStore operation.
        //(startTransaction, add, remove).

        JSONStore.rollbackTransaction()

            .then(function () {
                // Handle rollback success.
            })

            .fail(function () {
                // Handle rollback failure.
            })

    });
```


#### Get file information
```Javascript
JSONStore.fileInfo()
    .then(function (res) {
        //res => [{isEncrypted : false, name : carlos, size : 3072}]
    })

  .fail(function () {
        // Handle failure.
    });
```	

#### Search with like, rightLike, and leftLike
```Javascript
// Match all records that contain the search string on both sides.
// %searchString%
var arr1 = JSONStore.QueryPart().like('name', 'ca');  // returns {name: 'carlos', age: 10}
var arr2 = JSONStore.QueryPart().like('name', 'los');  // returns {name: 'carlos', age: 10}

// Match all records that contain the search string on the left side and anything on the right side.
// searchString%
var arr1 = JSONStore.QueryPart().rightLike('name', 'ca');  // returns {name: 'carlos', age: 10}
var arr2 = JSONStore.QueryPart().rightLike('name', 'los');  // returns nothing

// Match all records that contain the search string on the right side and anything on the left side.
// %searchString
var arr = JSONStore.QueryPart().leftLike('name', 'ca');  // returns nothing
var arr2 = JSONStore.QueryPart().leftLike('name', 'los');  // returns {name: 'carlos', age: 10}
```
	
# License

This project is licensed under the terms of the Apache 2 license.
> You can find the license [here](https://github.com/ibm-bluemix-mobile-services/jsonstore-javascript/blob/development/LICENSE).