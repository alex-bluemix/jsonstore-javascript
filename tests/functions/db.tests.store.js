/*global module, WL, deepEqual, ok, start, test, stop*/
/*jshint -W100*/

(function() {

	'use strict';

	//Dependencies:
	var model = JSONStore;

	var modelInstance;

	var SCHEMA = {'fn': 'string', 'ln' : 'string', 'age' : 'integer'};
	var COLLECTION = 'basic_data';
	var DATA = [{fn: 'carlos', ln: 'andreu', age: 13}, {fn: 'jeremy', ln: 'nortey', age: 14}];

	var fail = function (err) {
		ok(false, 'Failed with: ' + err + ' ' + model.getErrorMessage(err));
		start();
	};

	// TODO get the objects back and verify that they were stored as floats
	module('Store');

	/************************************************
	Basic tests
	*************************************************/

	test('Basic create model and store', 2, function(){
		stop();

		SCHEMA = {'fn': 'string', 'ln' : 'string', 'age' : 'integer'};
		COLLECTION = 'basicApiTest';
		DATA = [{fn: 'carlos', ln: 'andreu', age: 13}, {fn: 'jeremy', ln: 'nortey', age: 14}];

		var createSuccessful = function (data) {
			deepEqual(data, 0, 'new collection');
			modelInstance.store(DATA, {onSuccess: finishedStoring, onFailure: fail});
		};

		var finishedStoring = function (data) {
			deepEqual(data, 2, 'Expected should match 2 stores:' + data);
			start();
		};

		var options = { onSuccess: createSuccessful, onFailure: fail, dropCollection: true};
		modelInstance = model.initCollection(COLLECTION, SCHEMA, options);
	});

	/************************************************
	Testing using the same key with searchFields and additionalSearchFields
	*************************************************/

	test('Same key for searchFields and additionalSearchFields', 1, function(){
		stop();

		var s = {'fn': 'string', 'ln' : 'string', 'age' : 'integer'};
		var ai = {'fn': 'string'};
		
		var expectedFailure = function (err) {

			deepEqual(err, 22, 'invalid search keys');
			start();
		};

		var options = { onSuccess: fail, onFailure: expectedFailure, dropCollection: true, additionalSearchFields: ai};
		modelInstance = model.initCollection('addIndexesTest', s, options);
	});

	/************************************************
	Basic tests with addIndexes (STORE and FIND)
	*************************************************/

	test('Basic tests with addIndexes (STORE and FIND)', 5, function(){
		stop();

		/**
		 * Store a simple document and apply additionalSearchFields, make sure
		 * we can retrieve the document using a combination of additionalSearchFields
		 * and regular search fields.  also validate that the additionalSearchFields
		 * are NOT added to the document. 
		 * 
		 */
		var s = {'fn': 'string', 'ln' : 'string', 'age' : 'integer'};
		var ai = {'orderId': 'string'};
		var d = [{fn: 'carlos', ln: 'andreu', age: 13}, {fn: 'jeremy', ln: 'nortey', age: 14}];
			

		var findSucc = function(data){
		 
			if (typeof data === 'undefined' || data === null || data.length < 1 ) {
		 
				fail('ANDRIOD NOT IMPLEMENTED: data was empty:'+JSON.stringify(data));
		 
			} else {
		 
				deepEqual(data.length, 1,'Expected 1 record');
				deepEqual(data[0].json.fn, 'jeremy', 'Should found jeremy');
				deepEqual(typeof data[0].json.orderId, 'undefined', 'orderId is an additionalSeachField and NOT added to document');
				start();
			}
		};
		 
		var finishedStoring = function (data) {
			deepEqual(data, 2, 'Expected should match 2 stores:' + data);
			modelInstance.find({'orderId': 'abc123', 'age': 14 }, {onSuccess: findSucc, onFailure: fail});
		};
		
		var createSuccessful = function (data) {
			deepEqual(data, 0, 'create new collection');
			modelInstance.store(d, {additionalSearchFields: {'orderId': 'abc123' }, onSuccess: finishedStoring, onFailure: fail});
			
		};
		 
		var options = { onSuccess: createSuccessful, onFailure: fail, dropCollection: true, additionalSearchFields: ai};
		modelInstance = model.initCollection('addIndexesTest', s, options);
	});

	/************************************************
	Basic tests with addIndexes (ADD and FIND)
	*************************************************/

	test('Basic tests with addIndexes (ADD and FIND)', 4, function(){
		stop();

		var s = {'fn': 'string', 'ln' : 'string', 'age' : 'integer'};
		var ai = {'orderId': 'string'};
		var d = [{fn: 'carlos', ln: 'andreu', age: 13}, {fn: 'jeremy', ln: 'nortey', age: 14}];

		var findSucc = function(data){

			if (typeof data === 'undefined' || data === null || data.length < 1 ) {

				fail('ANDRIOD NOT IMPLEMENTED: data was empty:'+JSON.stringify(data));

			} else {
			
				deepEqual(data.length, 1,'Expected 1 record');
				deepEqual(data[0].json.fn, 'jeremy', 'Should find jeremy');
				start();
			}
		};

		var createSuccessful = function (data) {
			deepEqual(data, 0, 'create new collection');
			modelInstance.add(d, {additionalSearchFields: {'orderId': 'abc123' }, onSuccess: finishedStoring, onFailure: fail});
			
		};

		var finishedStoring = function (data) {
			deepEqual(data, 2, 'Expected should match 2 stores:' + data);
			modelInstance.find({'orderId': 'abc123', 'age': 14 }, {onSuccess: findSucc, onFailure: fail});
		};

		var options = { onSuccess: createSuccessful,
				onFailure: fail,
				dropCollection: true,
				additionalSearchFields: ai
		};
		 
		modelInstance = model.initCollection('addIndexesTest', s, options);
	});

	/************************************************
	Array / Looping
	*************************************************/

	test('First Create model', 1, function() {
		SCHEMA = {'artist':'string', 'genre':'string', 'venue.localphone': 'integer'};
		COLLECTION = 'storingArrays';
		DATA = [{'artist':'SomeBand','genre':'rock','venue':{'city':'Austin','state':'Texas','localphone':'5026741'},
		'ticket_cost':'$500'},{'artist':'AnotherBand','genre':'pop','venue':{'city':'Dallas','state':'Texas','localphone':'123456'},
		'ticket_cost':'$500'},{'artist':'LastBand','genre':'folk','venue':{'city':'Seattle','state':'Washington','localphone':'123456'},
		'ticket_cost':'$500'},{'artist':'LastBand','genre':'folk','venue':{'city':'Seattle','state':'Washington','localphone':'123456'},
		'ticket_cost':'$500'},{'artist':'LastBand','genre':'folk','venue':{'city':'Seattle','state':'Washington','localphone':'123456'},
		'ticket_cost':'$500'},{'artist':'LastBand','genre':'folk','venue':{'city':'Seattle','state':'Washington','localphone':'123456'},
		'ticket_cost':'$500'},{'artist':'LastBand','genre':'folk','venue':{'city':'Seattle','state':'Washington','localphone':'123456'},
		'ticket_cost':'$500'},{'artist':'SomeBand','genre':'rock','venue':{'city':'Austin','state':'Texas','localphone':'5026741'},
		'ticket_cost':'$500'},{'artist':'AnotherBand','genre':'pop','venue':{'city':'Dallas','state':'Texas','localphone':'123456'},
		'ticket_cost':'$500'},{'artist':'LastBand','genre':'folk','venue':{'city':'Seattle','state':'Washington','localphone':'123456'},
		'ticket_cost':'$500'},{'artist':'LastBand','genre':'folk','venue':{'city':'Seattle','state':'Washington','localphone':'123456'},
		'ticket_cost':'$500'},{'artist':'LastBand','genre':'folk','venue':{'city':'Seattle','state':'Washington','localphone':'123456'},
		'ticket_cost':'$500'},{'artist':'LastBand','genre':'folk','venue':{'city':'Seattle','state':'Washington','localphone':'123456'},
		'ticket_cost':'$500'},{'artist':'LastBand','genre':'folk','venue':{'city':'Seattle','state':'Washington','localphone':'123456'},
		'ticket_cost':'$500'},{'artist':'LastBand','genre':'folk','venue':{'city':'Seattle','state':'Washington','localphone':'123456'},
		'ticket_cost':'$500'},{'artist':'LastBand','genre':'folk','venue':{'city':'Seattle','state':'Washington','localphone':'123456'},
		'ticket_cost':'$500'},{'artist':'LastBand','genre':'folk','venue':{'city':'Seattle','state':'Washington','localphone':'123456'},
		'ticket_cost':'$500'},{'artist':'LastBand','genre':'folk','venue':{'city':'Seattle','state':'Washington','localphone':'123456'},
		'ticket_cost':'$500'}];
		
		stop();

		var createSuccessful = function (data) {
			deepEqual(data, 0, 'new collection');
			start();
		};

		var options = { onSuccess: createSuccessful, onFailure: fail, dropCollection: true};
		modelInstance = model.initCollection(COLLECTION, SCHEMA, options);
	});

	test('Store array as individual objects', 1, function(){

		stop();

		var finishedStoring = function (data) {
			deepEqual(data, 18, 'Expected should match 18 stores. Actual: ' + data);
			start();
		};

		modelInstance.store(DATA, {onSuccess: finishedStoring, onFailure: fail});
	});


	/**********************************************
	Non ASCII Characters
	***********************************************/

	test('Store for non ascii characters', 5, function() {
		SCHEMA = {'你好我的名字是' : 'string', '我喜歡去' : 'string', '最喜歡的食物.關鍵' : 'string'};
		COLLECTION = 'NonAsciiCharacters';
		DATA = [{'你好我的名字是':'你好我的名字是','我喜歡去':'你好我的名字是','最喜歡的食物':['雞蛋','排骨和牛排','奶酪',{'關鍵':'值'}],'第一':'最後'},
			{'你好我的名字是':'你好我的名字是','我喜歡去':'你好我的名字是','最喜歡的食物':['雞蛋','排骨和牛排','奶酪',{'關鍵':'值'}],'第一':'最後'},
			{'你好我的名字是':'你好我的名字是','我喜歡去':'你好我的名字是','最喜歡的食物':['雞蛋','排骨和牛排','奶酪',{'關鍵':'值'}],'第一':'最後'}];
		stop();


		var finishedFinding = function (data) {

			deepEqual(data[0].json, DATA[0], 'finishedFinding1');
			deepEqual(data[1].json, DATA[1], 'finishedFinding2');
			deepEqual(data[2].json, DATA[2], 'finishedFinding3');
			start();
		};

		var finishedStoring = function(data){
			deepEqual(data, 3, 'Expected should match 3 stores:' + data);
			modelInstance.find({'我喜歡去':'你好我的名字是'}, {onFailure:fail, onSuccess:finishedFinding});
		};

		var createSuccessful = function(data){
			deepEqual(data, 0, 'new collection');
			modelInstance.store(DATA, {onSuccess: finishedStoring, onFailure: fail, isArray: false});
		};

		var options = { onSuccess: createSuccessful, onFailure: fail, dropCollection: true};
		modelInstance = model.initCollection(COLLECTION, SCHEMA, options);
	});

	/************************************************
	Empty Schema
	*************************************************/

	test('Second Create Model', 2, function() {
		stop();
		SCHEMA = {};
		COLLECTION = 'emptySchema';
		DATA = [{'artist':'SomeBand','genre':'rock','venue':{'city':'Austin','state':'Texas','localphone':'5026741'},'ticket_cost':'$500'},
			{'artist':'AnotherBand','genre':'pop','venue':{'city':'Dallas','state':'Texas','localphone':'123456'},'ticket_cost':'$500'},
			{'artist':'LastBand','genre':'folk','venue':{'city':'Seattle','state':'Washington','localphone':'123456'},'ticket_cost':'$500'}];

		var createSuccessful = function(data){
			deepEqual(data, 0, 'new collection');
			modelInstance.store(DATA, {onSuccess: finishedStoring, onFailure: fail});
		};

		var finishedStoring = function(data){
			deepEqual(data, 3, 'Expected should match 3 stores:' + data);
			start();
		};

		var options = { onSuccess: createSuccessful, onFailure: fail, dropCollection: true};
		modelInstance = model.initCollection(COLLECTION, SCHEMA, options);
	});

	/************************************************
	Invalid tests for error handling
	*************************************************/

	test('Third Create Model', 1, function() {
		stop();
		SCHEMA = {'a' : 'string', 'b': 'integer'};
		COLLECTION = 'errorHandling';

		var createSuccessful = function(data){
			deepEqual(data, 0, 'new collection');
			start();
		};

		var options = { onSuccess: createSuccessful, onFailure: fail, dropCollection: true};
		modelInstance = model.initCollection(COLLECTION, SCHEMA, options);
	});


	test('Try to store an integer', 1, function() {
		stop();
		DATA =  7;

		var expectedStoreFailed = function(data){
			//ERROR[10] = 'BAD_PARAMETER_EXPECTED_DOCUMENT_OR_ARRAY_OF_DOCUMENTS';
			deepEqual(data, 10, 'Invalid array given. Store successfully failed.');
			start();
		};

		modelInstance.store(DATA, {onSuccess: fail, onFailure: expectedStoreFailed});
	});

	test('Try to store a string', 1, function() {
		stop();
		DATA =  'Hello';

		var expectedStoreFailed = function(data){
			//ERROR[10] = 'BAD_PARAMETER_EXPECTED_DOCUMENT_OR_ARRAY_OF_DOCUMENTS';
			deepEqual(data, 10, 'Invalid array given. Store successfully failed.');
			start();
		};

		modelInstance.store(DATA, {onSuccess: fail, onFailure: expectedStoreFailed});
	});

	test('Try to store an array of valid items', 1, function() {
		stop();
		DATA =  [{data: 'this is valid'}, [{data: 'this should also be valid'}], [] ];

		var storeFailed = function(data){
			//ERROR[10] = 'BAD_PARAMETER_EXPECTED_DOCUMENT_OR_ARRAY_OF_DOCUMENTS';
			deepEqual(data, 10, 'Invalid array given. Store successfully failed.');
			start();
		};

		modelInstance.store(DATA, {onSuccess: fail, onFailure: storeFailed});
	});

	test('Try to store an array of simple objects', 1, function() {
		stop();
		DATA =  [0, 1, 5, 7, 10000000, 'world', -373945834, -1, 99999999999, 'hello'];

		var storeFailed = function(data){
			//ERROR[10] = 'BAD_PARAMETER_EXPECTED_DOCUMENT_OR_ARRAY_OF_DOCUMENTS';
			deepEqual(data, 10, 'Invalid array given. Store successfully failed.');
			start();
		};

		modelInstance.store(DATA, {onSuccess: fail, onFailure: storeFailed});
	});


	/************************************************
	Floating point numbers
	*************************************************/
	test('Fourth Create Model', 1, function() {
		SCHEMA = {'item': 'number'};
		COLLECTION = 'floatingPointNumbers';
		DATA = [{'item':1.0},{'item':0.0},{'item':5.66},{'item':6.66666},{'item':123.994},
			{'item':0.000008},{'item':-940.0003},{'item':-0.0003}];
		stop();

		var createSuccessful = function(data){
			deepEqual(data, 0, 'new collection');
			start();
		};

		var options = { onSuccess: createSuccessful, onFailure: fail, dropCollection: true};
		modelInstance = model.initCollection(COLLECTION, SCHEMA, options);
	});

	test('Store floating point numbers', 1, function() {
		stop();
		
		var storeSucceeded = function (data) {
			deepEqual(data, 8, 'Expected should match 8 stores. Actual: ' + data);
			start();
		};

		modelInstance.store(DATA, {onSuccess: storeSucceeded, onFailure: fail});
	});

	test('Find recently stored floating point numbers', 8, function() {
		stop();

		var findSuccess = function(data){
			for(var idx in data){
				if (true) {
					var val = data[idx].json.item;
					deepEqual(val, DATA[idx].item, 'Expected should match: ' + DATA[idx].item + ' Actual' + val);
				}
			}
			start();
		};

		modelInstance.find({}, {onSuccess: findSuccess, onFailure: fail});
	});

	/************************************************
	Special Characters
	*************************************************/

	test('Change Variables: Special Characters', 1, function() {
		SCHEMA = {'@name': 'string', 'lastname$' : 'string', '^city': 'string', 'state&' : 'string', '|hobby' : 'string', '>favorite-food' : 'string'};
		COLLECTION = 'specialCharacters';
		DATA = [{'@name':'(Jeremy)'},{'lastname$':'!@#$$%^'},{'^city':')(*&^%^'},{'state&':'=+-_'},
			{'|hobby':'~~``~'},{'haircolor;':'1234567890'},{'>favorite-food':'?Y8BNC0'}];
		
		stop();

		var createSuccessful = function(data){
			deepEqual(data, 0, 'new collection');
			start();
		};

		var options = { onSuccess: createSuccessful, onFailure: fail, dropCollection: true};
		modelInstance = model.initCollection(COLLECTION, SCHEMA, options);
	});

	test('Store for special characters', 1, function() {
		stop();
		
		var storeSucceeded = function(data){
			deepEqual(data, 7, 'Expected should match 7 stores:' + data);
			start();
		};

		modelInstance.store(DATA, {onSuccess: storeSucceeded, onFailure: fail});
	});

	/************************************************
	Schema with similar names
	*************************************************/

	test('Fifth Create Model', 1, function() {
		SCHEMA = {'name': 'string', 'location.name' : 'string', 'father.name': 'string', 'brother.name'
			: 'string', 'brother.birthplace.name': 'string'};
		COLLECTION = 'similarNames';
		DATA = [{'name':'SomeBand','location':[{'name':'Austin'},{'state':'Texas'},
		{'localphone':'5026741'}],'mother':[{'name':'ann'}],'father':[{'name':'john'}],'brother':
		[{'name':'mark'},{'birthplace':[{'name':'dallas'}]}]}];
		
		stop();

		var createSuccessful = function(data){
			deepEqual(data, 0, 'new collection');
			start();
		};

		var options = { onSuccess: createSuccessful, onFailure: fail, dropCollection: true};
		modelInstance = model.initCollection(COLLECTION, SCHEMA, options);
	});

	test('Store for similar schema names', 1, function() {
		stop();
		
		var storeSucceeded = function(data){
			deepEqual(data, 1, 'Expected should match 1 stores:' + data);
			start();
		};

		modelInstance.store(DATA, {onSuccess: storeSucceeded, onFailure: fail});
	});

})();