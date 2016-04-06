/*global module, WL, deepEqual, ok, start, asyncTest, test, stop*/
/*jshint camelcase: false*/
(function() {

	'use strict';

	//Dependencies:
	var model = JSONStore;

	var modelInstance;

	var SCHEMA = {};
	var COLLECTION = '';
	var DATA = [];
	var UPDATE_DATA = [];

	function fail(err){
		ok(false, 'Failed with: ' + err + ' ' + model.getErrorMessage(err));
		start();
	}

	function failNotImplemented(errMsg){
		ok(false, errMsg);
		start();
	}

	function generateJSON(numObjects){
		var obj1 = {'lastcalldate':'2012-07-17','lastname':'Stres','customerId':'6ccac24d-3ecf-426c-a1e4-4350ca7d9241',
		'firstname':'Bala','address':{'city':'dallas','state':'as','localphone':'3252990'}};
		var arr = [];

		for(var i=0; i<numObjects; i++){
			arr.push(obj1);
		}

		return arr;
	}

	//TODO: replace adds with stores
	/************************************************
	Basic tests with addIndexes (STORE, REPLACE and FIND)
	*************************************************/

	module('Replace');

	asyncTest('Basic tests with addIndexes (STORE, REPLACE and FIND)', 5, function(){

		var mI;

		var s = {'fn': 'string', 'ln' : 'string', 'age' : 'integer'};
		var ai = {'orderId': 'string'};
		var d = [{fn: 'carlos', ln: 'andreu', age: 13}, {fn: 'jeremy', ln: 'nortey', age: 14}];

		var createSuccessful = function (data) {
			deepEqual(data, 0, 'Created new collection');
			mI.store(d, {additionalSearchFields: {'orderId': 'abc123'}, onSuccess: finishedStoring, onFailure: fail});
		};

		var finishedStoring = function (data) {
			deepEqual(data, 2, 'Expected should match 2 stores:' + data);
			mI.replace( {_id:1 , json:{'fn': 'carlitos', 'age': 99} },
			{onSuccess: finishedReplaceSuccesfully, onFailure: fail});
		};

		var finishedReplaceSuccesfully = function (data) {
			deepEqual(data, 1, '1 document modified');
			mI.find({'orderId': 'abc123', 'fn': 'carlitos'}, {onSuccess: findSucc, onFailure: fail});
		};

		var findSucc = function(data){
			if (typeof data === 'undefined' || data === null || data.length < 1 ) {

				fail('ANDRIOD NOT IMPLEMENTED: data was empty:'+JSON.stringify(data));

			} else {
				deepEqual(data.length, 1,'Expected 1 record');
				deepEqual(data[0].json.fn, 'carlitos', 'Should found world');
				start();
			}
		};


		var options = { onSuccess: createSuccessful, onFailure: fail, dropCollection: true, additionalSearchFields: ai};
		mI = JSONStore.initCollection('addIndexesTestRemove', s, options);
	});

	/************************************************
	Basic tests with addIndexes (STORE, REFRESH and FIND)
	*************************************************/

	test('Basic tests with addIndexes (STORE, REFRESH and FIND)', 5, function(){
		stop();

		// create a new collection, then store 2 items from var d with
		// addtionalSearchFields, refresh 1 document, then try to search
		// with the refreshed value AND the old search field
		
		var mI;

		var s = {'fn': 'string', 'ln' : 'string', 'age' : 'integer'};
		var ai = {'orderId': 'string'};
		var d = [{fn: 'carlos', ln: 'andreu', age: 13}, {fn: 'jeremy', ln: 'nortey', age: 14}];

		var createSuccessful = function (data) {
			deepEqual(data, 0, 'collection created');
			mI.store(d, {additionalSearchFields: {'orderId': 'abc123' }, onSuccess: finishedStoring, onFailure: fail});
		};

		var finishedStoring = function (data) {
			deepEqual(data, 2, 'Expected should match 2 stores:' + data);
			mI.refresh({_id:1 , json:{'orderId': 'abc123', 'fn': 'helloworld' }}, {onSuccess: finishedReplaceSuccesfully, onFailure: fail});
		};

		var finishedReplaceSuccesfully = function (data) {
			deepEqual(data, 1, '1 document modified');
			mI.find({'orderId': 'abc123', 'fn': 'helloworld'}, {onSuccess: findSucc, onFailure: fail});
		};

		var findSucc = function(data){
			if (typeof data === 'undefined' || data === null || data.length < 1 ) {

				fail('ANDRIOD NOT IMPLEMENTED: data was empty:'+JSON.stringify(data));

			} else {
				deepEqual(data.length, 1,'Expected 1 record');
				deepEqual(data[0].json.fn, 'helloworld', 'Should found world');
				start();
			}
		};

		var options = { onSuccess: createSuccessful, onFailure: fail, dropCollection: true, additionalSearchFields: ai};
		mI = JSONStore.initCollection('addIndexesTestRemove2', s, options);
	});

	/******************************************************************************************
											DB LEVEL TESTS
	/******************************************************************************************/

	/************************************************
	Basic update test
	*************************************************/

	test('First Assign Variables, Create and add', 2, function() {
		stop();

		var addSuccessful = function (data) {
			deepEqual(data, 2, 'Data successfully added');
			start();
		};

		var createSuccessful = function (data) {
			deepEqual(data, 0, 'new collection');

			DATA = [{fn: 'carlos', ln: 'andreu', age: 13}, {fn: 'jeremy', ln: 'nortey', age: 14}];
			modelInstance.add(DATA, {onSuccess: addSuccessful, onFailure: fail});
		};

		var options = { onSuccess: createSuccessful, onFailure: fail, dropCollection: true};

		SCHEMA = {'fn': 'string', 'ln' : 'string', 'age' : 'integer'};
		COLLECTION = 'collection';
		modelInstance = JSONStore.initCollection(COLLECTION, SCHEMA, options);
	});

	test('Basic Replace', 1, function() {
		stop();

		var replaceSuccessful = function(data){
			deepEqual(data, 1, 'Expected should match 1 replace:' + data);
			start();
		};

		UPDATE_DATA = {fn: 'KARL', ln: 'ANDREU', age: 99};
		modelInstance.replace({_id: 1, json: UPDATE_DATA}, {onSuccess: replaceSuccessful, onFailure: fail});
	});

	test('Attempt to replace with empty array', 1, function () {
		stop();

		var replaceSuccessful = function(data) {
			deepEqual(data, 0, 'Nothing should have been replaced');
			start();
		};

		modelInstance.replace([], {onSuccess: replaceSuccessful, onFailure: fail});
	});

	test('Basic find should not exist', 1, function() {
		stop();

		var findFinished = function(data){
			deepEqual(data.length, 0, 'Expected should match 0 items, got:' + data.length);
			start();
		};

		modelInstance.find({fn: 'carlos'}, {onSuccess: findFinished, onFailure: fail});
	});

	test('Basic find should exist', 3, function() {

		stop();

		var findFinished = function(data){
			var item = data[0];
			deepEqual(item.json.age, UPDATE_DATA.age, 'Expected should match: ' + UPDATE_DATA.age + ' Actual: ' + item.json.age);
			deepEqual(item.json.fn, UPDATE_DATA.fn, 'Expected should match: ' + UPDATE_DATA.fn + ' Actual: ' + item.json.fn);
			deepEqual(item.json.ln, UPDATE_DATA.ln, 'Expected should match: ' + UPDATE_DATA.ln + ' Actual: ' + item.json.ln);
			start();
		};

		modelInstance.find({fn: 'KARL'}, {onSuccess: findFinished, onFailure: fail});
	});

	/************************************************
	Replace single document
	*************************************************/
	test('Second Assign Variables, Create and add', 2, function() {
		stop();

		SCHEMA = {'lastcalldate': 'string', 'address.city' : 'string'};
		COLLECTION = 'updateByID';
		DATA = [{'lastcalldate':'2012-07-10','firstname':'Bala','lastname':'Addar','products':['GE Dryer','Sony Mixer','GE Utrawave'],
		'address':{'city':'custer','state':'al','localphone':'5026741'},'customerId':'5f63cd63-01a0-49f2-bcdb-44f433af387c'},
		{'lastcalldate':'2012-06-14','firstname':'Molar','lastname':'Addar','products':['GE Utrawave','GE Dryer','Frigidaire'],
		'address':{'city':'austin','state':'as','localphone':'5026741'},'customerId':'ba854b9d-05f9-4cbc-ae52-5c18095fd56e'},
		{'lastcalldate':'2012-05-16','firstname':'Diana','lastname':'Kwo','products':['Whirpool Dishwasher'],'address':
		{'city':'woods','state':'pa','localphone':'2959331'},'customerId':'4e2dc78a-7b65-4af9-9594-f3d82c43680b'},
		{'lastcalldate':'2012-06-03','firstname':'Diana','lastname':'Gikil','products':['Frigidaire','GE Utrawave','GE Utrawave'],
		'address':{'city':'custer','state':'ar','localphone':'2703825'},'customerId':'f7bc78aa-1050-4ac9-a500-455a30031810'},
		{'lastcalldate':'2012-07-26','firstname':'Bala','lastname':'Stres','products':['Whirpool Dishwasher','GE Dryer'],'address':
		{'city':'dallas','state':'tn','localphone':'1368500'},'customerId':'2e106165-e75f-406a-b9af-821600b1e446'},
		{'lastcalldate':'2012-06-04','firstname':'Molar','lastname':'Gikil','products':['GE Dryer','Frigidaire'],'address':
		{'city':'dallas','state':'al','localphone':'4110441'},'customerId':'34b62fc2-5662-42d9-9f40-36fe50c6fdc4'},
		{'lastcalldate':'2012-06-07','firstname':'Molar','lastname':'Gikil','products':['Whirpool Dishwasher'],'address':
		{'city':'austin','state':'ar','localphone':'4229777'},'customerId':'374f00d6-7570-4c7f-aace-9c1f5ab7d68b'},
		{'lastcalldate':'2012-06-11','firstname':'Athena','lastname':'Kwo','products':['Frigidaire','Whirlpool Washer'],'address':
		{'city':'woods','state':'ar','localphone':'6971171'},'customerId':'5b01a94a-7939-406e-bc1f-5f2c2454f27a'},
		{'lastcalldate':'2012-06-01','firstname':'Fama','lastname':'Kwo','products':['Whirlpool Washer','GE Utrawave','GE Utrawave'],
		'address':{'city':'custer','state':'tn','localphone':'4796763'},'customerId':'d490c15e-d0f3-4b6d-a8d0-7a60c752cc32'},
		{'lastcalldate':'2012-07-05','firstname':'Molar','lastname':'Gikil','products':['GE Dryer'],'address':
		{'city':'dallas','state':'ar','localphone':'7278994'},'customerId':'e4129219-957d-4abe-a127-457b594eac0f'}];
		UPDATE_DATA = {data1: 'test1', data2: 'test2'};

		var addSuccessful = function (data) {
			deepEqual(data, 10, 'Data successfully added');
			start();
		};

		var createSuccessful = function (data) {
			deepEqual(data, 0, 'new collection');
			modelInstance.add(DATA, {onSuccess: addSuccessful, onFailure: fail});
		};

		var options = { onSuccess: createSuccessful, onFailure: fail, dropCollection: true};
		modelInstance = JSONStore.initCollection(COLLECTION, SCHEMA, options);
	});


	test('Update single document', 1, function() {
		stop();

		var replaceSuccessful = function(data){
			deepEqual(data, 1, 'Expected should match 1 item:' + data);
			start();
		};

		modelInstance.replace({_id: 1, json: UPDATE_DATA}, {onSuccess: replaceSuccessful, onFailure: fail});
	});

	test('Find single document', 2, function() {
		stop();

		var findFinished = function(data){
			var item = data[0];
			deepEqual(item.json.data1, UPDATE_DATA.data1, 'Expected should match: ' + UPDATE_DATA.data1 + ' Actual: ' + item.json.data1);
			deepEqual(item.json.data2, UPDATE_DATA.data2, 'Expected should match: ' + UPDATE_DATA.data2 + ' Actual: ' + item.json.data2);
			start();
		};

		modelInstance.findAll({onSuccess: findFinished, onFailure: fail});
	});

	test('First Test local count', 1, function() {
		stop();

		var pushRequiredCountSuccess = function(data){
			deepEqual(data, 10, 'Expected should match: 10 Actual: ' + data);
			start();
		};

		modelInstance.pushRequiredCount({onSuccess: pushRequiredCountSuccess, onFailure: fail});
	});

	test('Test count', 1, function() {
		stop();

		var countSuccess = function(data){
			deepEqual(data, 10, 'Expected should match: 10 Actual: ' + data);
			start();
		};

		modelInstance.count({onSuccess: countSuccess, onFailure: fail});
	});

	/************************************************
	Replace individual documents by ID
	*************************************************/

	asyncTest('Third Assign Variables, Create and add', 3, function() {

		SCHEMA = {'lastcalldate': 'string', 'address.city' : 'string'};
		COLLECTION = 'updateByID';
		DATA = [{'lastcalldate':'2012-07-10','firstname':'Bala','lastname':'Addar','products':['GE Dryer','Sony Mixer','GE Utrawave'],
		'address':{'city':'custer','state':'al','localphone':'5026741'},'customerId':'5f63cd63-01a0-49f2-bcdb-44f433af387c'},
		{'lastcalldate':'2012-06-14','firstname':'Molar','lastname':'Addar','products':['GE Utrawave','GE Dryer','Frigidaire'],'address':
		{'city':'austin','state':'as','localphone':'5026741'},'customerId':'ba854b9d-05f9-4cbc-ae52-5c18095fd56e'},
		{'lastcalldate':'2012-05-16','firstname':'Diana','lastname':'Kwo','products':['Whirpool Dishwasher'],'address':
		{'city':'woods','state':'pa','localphone':'2959331'},'customerId':'4e2dc78a-7b65-4af9-9594-f3d82c43680b'},
		{'lastcalldate':'2012-06-03','firstname':'Diana','lastname':'Gikil','products':['Frigidaire','GE Utrawave','GE Utrawave'],
		'address':{'city':'custer','state':'ar','localphone':'2703825'},'customerId':'f7bc78aa-1050-4ac9-a500-455a30031810'},
		{'lastcalldate':'2012-07-26','firstname':'Bala','lastname':'Stres','products':['Whirpool Dishwasher','GE Dryer'],'address':
		{'city':'dallas','state':'tn','localphone':'1368500'},'customerId':'2e106165-e75f-406a-b9af-821600b1e446'},
		{'lastcalldate':'2012-06-04','firstname':'Molar','lastname':'Gikil','products':['GE Dryer','Frigidaire'],'address':
		{'city':'dallas','state':'al','localphone':'4110441'},'customerId':'34b62fc2-5662-42d9-9f40-36fe50c6fdc4'},
		{'lastcalldate':'2012-06-07','firstname':'Molar','lastname':'Gikil','products':['Whirpool Dishwasher'],'address':
		{'city':'austin','state':'ar','localphone':'4229777'},'customerId':'374f00d6-7570-4c7f-aace-9c1f5ab7d68b'},
		{'lastcalldate':'2012-06-11','firstname':'Athena','lastname':'Kwo','products':['Frigidaire','Whirlpool Washer'],'address':
		{'city':'woods','state':'ar','localphone':'6971171'},'customerId':'5b01a94a-7939-406e-bc1f-5f2c2454f27a'},
		{'lastcalldate':'2012-06-01','firstname':'Fama','lastname':'Kwo','products':['Whirlpool Washer','GE Utrawave','GE Utrawave'],
		'address':{'city':'custer','state':'tn','localphone':'4796763'},'customerId':'d490c15e-d0f3-4b6d-a8d0-7a60c752cc32'},
		{'lastcalldate':'2012-07-05','firstname':'Molar','lastname':'Gikil','products':['GE Dryer'],'address':
		{'city':'dallas','state':'ar','localphone':'7278994'},'customerId':'e4129219-957d-4abe-a127-457b594eac0f'}];
		UPDATE_DATA = {lastname: 'Pools', 'address.city': 'mootown'};

		var options = { dropCollection: true};

		JSONStore.destroy()

		.then(function(rc){
			deepEqual(rc, 0, 'destroy collection worked');
			modelInstance = JSONStore.initCollection(COLLECTION, SCHEMA, options);
			return modelInstance.promise;
		})
		.then(function(data){
			deepEqual(data, 0, 'new collection');
			return modelInstance.add(DATA);
		})

		.then(function(data){
			deepEqual(data, 10, 'Data successfully added');
			start();
		})

		.fail(function(err){
			ok(false, 'failure cb not expected' + err.toString());
			start();
		});

	});

	asyncTest('Perform Find all and replace individually by ID', 24, function() {

		var num_finds = 0;

		var findReplacedSuccess = function(data){
			deepEqual(typeof data, 'object', 'got an object back');
			deepEqual(data.length, 10, 'expected 10 items from find');
			num_finds++;

			for(var i=0; i<data.length; i++){
				var item = data[0];
				deepEqual(item.json.lastname, UPDATE_DATA.lastname,
					'Expected should match: ' + UPDATE_DATA.lastname + ' Actual: ' + item.json.lastname);
				deepEqual(item.json.address.city, UPDATE_DATA['address.city'],
					'Expected should match: ' + UPDATE_DATA['address.city'] + ' Actual: ' + item.json.address.city);
			}

			start();
		};

		var replaceSuccessful = function(data){
			deepEqual(data, 10, '10 doc replaced successfully');
			modelInstance.findAll({onSuccess: findReplacedSuccess, onFailure: fail});
		};

		var findSuccessful = function(data){
			deepEqual(data.length, DATA.length, 'Expected should match ' + DATA.length + ' items. Actual: ' + data.length);

			for(var i=0; i<data.length; i++){
				var item = data[i];

				item.json.lastname = UPDATE_DATA.lastname;
				item.json.address.city = UPDATE_DATA['address.city'];
			}
			modelInstance.replace(data, {onSuccess: replaceSuccessful, onFailure: fail});
		};

		modelInstance.find({}, {onSuccess: findSuccessful, onFailure: fail});
	});

	test('Second Test local count', 1, function() {
		stop();

		var pushRequiredCountSuccess = function(data){
			deepEqual(data, 10, 'Expected should match: 10 Actual: ' + data);
			start();
		};

		modelInstance.pushRequiredCount({onSuccess: pushRequiredCountSuccess, onFailure: fail});
	});

	/************************************************
	Update with invalid ID
	*************************************************/
	test('Fourth Assign Variables, Create and add', 2, function() {
		stop();

		SCHEMA = {'fn': 'string', 'ln' : 'string', 'age' : 'integer'};
		COLLECTION = 'invalidId';
		DATA = [{fn: 'carlos', ln: 'andreu', age: 13}, {fn: 'jeremy', ln: 'nortey', age: 14}];
		UPDATE_DATA = [{'firstname':'John','lastname':'Mann','interests':[[{'sports':['soccer','football','tennis','basketball']},
		{'hobbies':['collecting','running','movies','jogging',{'movies':['Mystery Men','Undercover brother','Gone With the Wind']}]}]]},
		{'firstname':'Stacy','lastname':'Mueller','interests':[[{'sports':['volleyball','tennis']},{'hobbies':['dolls','makeup','movies','jogging',
		{'movies':['Legally blonde','Some Chick Flick']}]}]]},{'firstname':'Stan','lastname':'Marsh','interests':[[{'sports':['soccer','tennis']},
		{'hobbies':['school','food','movies','jogging',{'movies':['Super 8','Godzilla']}]}]]}];
		UPDATE_DATA = {lastname: 'Pools', 'address.city': 'mootown'};

		var addSuccessful = function (data) {
			deepEqual(data, 2, 'Data successfully added');
			start();
		};

		var createSuccessful = function (data) {
			deepEqual(data, 0, 'new collection');
			modelInstance.store(DATA, {onSuccess: addSuccessful, onFailure: fail});
		};

		var options = { onSuccess: createSuccessful, onFailure: fail, dropCollection: true};
		modelInstance = JSONStore.initCollection(COLLECTION, SCHEMA, options);
	});

	/**
	 * Validate that replace with an invalid id works, and the document
	 * we tried to replace is returned to the error CB
	 */
	asyncTest('Replace with invalid id', 2, function() {

		var doc = {_id: 15, json: UPDATE_DATA};
		 
		var replaceFail = function(data){
			if (typeof data === 'undefined' || data === null || data.length < 1 ) {
				failNotImplemented('data was empty:'+JSON.stringify(data));
			}else{
				deepEqual(data.length, 1, 'expecting an array.length == 1 in failure CB');
				deepEqual(data[0], doc, 'failure should return document passed in');
				start();
			}
		};
		//should call the error cb
		modelInstance.replace(doc, {onSuccess: fail, onFailure: replaceFail});
	});

	/**
	 * Validate that replace with an invalid id works, and the document
	 * we tried to replace is returned to the error CB
	 */
	test('Replace with large invalid id', 2, function() {
		stop();
		var doc = {_id: '99999999', json: UPDATE_DATA};
		 
		var replaceFail = function(data){
			if (typeof data === 'undefined' || data === null || data.length < 1 ) {
				failNotImplemented('data was empty:'+JSON.stringify(data));
			}else{
				deepEqual(data.length, 1, 'expecting an array.length == 1 in failure CB');
				deepEqual(data[0], doc, 'failure should return document passed in');
				start();
			}
		};
		
		//Should call the error cb
		modelInstance.replace(doc, {onSuccess: fail, onFailure: replaceFail});
	});

	test('Third Test local count', 1, function() {
		stop();

		var pushRequiredCountSuccess = function(data){
			deepEqual(data, 0, 'Expected should match: 0 Actual: ' + data);
			start();
		};

		modelInstance.pushRequiredCount({onSuccess: pushRequiredCountSuccess, onFailure: fail});
	});

	/************************************************
	Update with Empty data
	*************************************************/

	test('Replace with Empty data', 2, function() {
		stop();

		var findSuccessful = function(data){
			var item = data[0];
			deepEqual({}, item.json, 'Expected should match {}. Actual: ' + JSON.stringify(item.json));
			start();
		};

		var replaceSuccessful = function(data){
			deepEqual(data, 1, 'Expected should match 1 stores. Actual:' + data);
			modelInstance.findAll({onSuccess: findSuccessful, onFailure: fail});
		};

		modelInstance.replace({_id: 1, json: {}}, {onSuccess: replaceSuccessful, onFailure: fail});
	});

	test('Replace with null', 1, function() {
		stop();

		var replaceFailed = function(data){
			//ERROR[10] = 'BAD_PARAMETER_EXPECTED_DOCUMENT_OR_ARRAY_OF_DOCUMENTS';
			deepEqual(data, 10, 'Replace successfully failed');
			start();
		};

		modelInstance.replace(null, {onSuccess: fail, onFailure: replaceFailed});
	});


	test('Replace with simple object, non-Document', 1, function() {
		stop();
			
		var replaceFail = function(data){
			deepEqual(data, 10, 'Replace successfully failed with BAD_PARAMETER_EXPECTED_DOCUMENT_OR_ARRAY_OF_DOCUMENTS');
			start();
			
		};
		
		modelInstance.replace({fn: 'carlos'}, {onSuccess: fail, onFailure: replaceFail});
	});



	/************************************************
	Update large single JSON document
	*************************************************/

	test('Update with large JSON document', 1, function() {
		stop();

		var replaceSuccessful = function(data){
			deepEqual(data, 1, 'Expected should match 1 stores. Actual:' + data);
			start();
		};

		var new_data = generateJSON(20);
		modelInstance.replace({_id: 1, json: {'data': new_data} }, {onSuccess: replaceSuccessful, onFailure: fail});
	});

	test('Fourth Test local count', 1, function() {
		stop();

		var pushRequiredCountSuccess = function(data){
			deepEqual(data, 1, 'Expected should match: 1 Actual: ' + data);
			start();
		};

		modelInstance.pushRequiredCount({onSuccess: pushRequiredCountSuccess, onFailure: fail});
	});


	/************************************************
	Update large amount of individual JSON documents
	*************************************************/

	test('Assign Variables, Provision and Store 20 entries', 2, function() {
		stop();

		var storeSuccess = function(data){
			deepEqual(data, 20, 'Expected should match 20 stores:' + data);
			start();
		};

		var createSuccessful = function(data){
			deepEqual(data, 0, 'new collection');

			DATA = generateJSON(20);
			modelInstance.store(DATA, {onSuccess: storeSuccess, onFailure: fail});
		};

		SCHEMA = {'fn': 'string', 'ln' : 'string', 'age' : 'integer'};
		COLLECTION = 'updateLargeIndividual';

		var options = { onSuccess: createSuccessful, onFailure: fail, dropCollection: true};
		modelInstance = JSONStore.initCollection(COLLECTION, SCHEMA, options);
	});

	test('Fifth Test local count', 1, function() {
		stop();

		var pushRequiredCountSuccess = function(data){
			deepEqual(data, 0, 'Expected should match: 0 Actual: ' + data);
			start();
		};

		modelInstance.pushRequiredCount({onSuccess: pushRequiredCountSuccess, onFailure: fail});
	});

	asyncTest('Perform Find all and update individually by ID', 2, function() {
		//20 documents * 1 assertion each + 1 findSuccess assertion = 21

		var replaceSuccessful = function(data){
			deepEqual(data, 20, '20 doc replaced');
			start();
		};

		var findSuccess = function(data){
			deepEqual(data.length, DATA.length, 'Expected should match ' + DATA.length + ' items. Actual: ' + data.length);

			for(var i=0; i<data.length; i++){
				data[i].json = {};
			}
			modelInstance.replace(data, {onSuccess: replaceSuccessful, onFailure: fail});
		};

		modelInstance.find({}, {onSuccess: findSuccess, onFailure: fail});
	});


	asyncTest('Sixth Test local count', 1, function() {

		var pushRequiredCountSuccess = function(data){
			deepEqual(data, 20, 'Expected should match: 20 Actual: ' + data);
			start();
		};

		modelInstance.pushRequiredCount({onSuccess: pushRequiredCountSuccess, onFailure: fail});
	});


	/** ROLLBACK TESTING:
	Add 12 first names -> find all -> remove the last document
	-> change the first name in all 12 documents to 'heyhey'
	Expected: error, you're trying to replace a document that does not exist anymore (the last one)
	The replace operation (that updates all the first names to 'heyhey') should be rolled back
	When we search for {fn: 'heyhey'} we should get an empty array back (that operation was rolled back)
	When we search for {fn: 'carlos'} we should get back [{_id: 1, json: {fn: 'carlos'}}]
	**/
	asyncTest('test rollback', 7, function () {

		var mI,
		DATA = [{fn: 'carlos'}, {fn: 'tim'}, {fn: 'jeff'},
				{fn: 'raj'}, {fn: 'jeremy'}, {fn: 'bill'},
				{fn: 'lizet'}, {fn: 'mike'}, {fn: 'jeremy'},
				{fn: 'paul'}, {fn: 'curtiss'}, {fn: 'barbara'}]; //len: 12

		var findCarlos = function (data) {

			if (!Array.isArray(data) || data.length < 1) {
				fail('findCarlos did not return an array or the length of the array was 0');
			} else {
				deepEqual(data[0].json.fn, 'carlos', 'findCarlos');
				start();
			}
		};

		var findHeyhey = function (data) {

			deepEqual(data, [], 'findHeyhey');

			mI.find({fn: 'carlos'}, {onFailure: fail, onSuccess: findCarlos});
		};

		var expectedFailure = function (data) {

			deepEqual(data, [{_id: 12, json: {fn: 'heyhey'}}]);

			mI.find({fn: 'heyhey'}, {onFailure: fail, onSuccess: findHeyhey});
		};

		var removeWin = function (count) {

			var arr = [];
			deepEqual(count, 1, 'removeWin');

			// var DATA2 = JSON.stringify(DATA);
			// DATA = JSON.parse(DATA2);

			for(var i=0; i<DATA.length; i++){

				DATA[i].fn = 'heyhey';
				arr.push( JSONStore.documentify(i+1, DATA[i]));
			}

			mI.replace(arr, {onFailure: expectedFailure, onSuccess: fail});
		};

		var findWin = function (data) {

			if(!Array.isArray(data)){
				fail('data is not an array in findWin');
			}else {
				deepEqual(data.length, DATA.length, 'findWin');
				mI.remove(data[DATA.length-1], {onFailure: fail, onSuccess: removeWin});
			}

		};

		var storeWin = function (count) {

			deepEqual(count, DATA.length, 'storeWin');

			mI.findAll({onFailure: fail, onSuccess: findWin});
		};

		var initWin = function (status) {

			deepEqual(status, 0, 'initWin');
			mI.store(DATA, {onFailure: fail, onSuccess: storeWin});
		};

		mI = model.initCollection('roobackTest', {fn: 'string'},
			{dropCollection: true, onFailure: fail, onSuccess: initWin});

	});


	//Rollback testing, but now, with promises! same test as above, but using promises
	asyncTest('test rollback promise', 9, function () {

		var name = 'rollback191',
		c = JSONStore.initCollection(name, {fn: 'string'});
		
		c.promise

		.then(function (res) {
			var adds = [];
			deepEqual(res, 0, 'init');
			for(var i = 1; i <= 10; i++){
				adds.push({fn: 'tim'});
			}
			return c.add(adds);
		})
		.then(function (res) {
			deepEqual(res, 10, 'added 10 docs');
			return c.remove(10);
		})

		.then(function (res) {
			deepEqual(res, 1, 'removed 1 doc');
			return c.findAll();
		})
		
		.then(function (res) {
			deepEqual(res.length, 9, 'found all 9');
			for (var i = res.length - 1; i >= 0; i--) {
				res[i].json.fn = 'heyhey';
			}
			res.push({_id: 10, json: {fn: 'heyhey'}});
			return c.replace(res);
		})
		
		.then(function () {
			ok(false, 'should have gone to error callback for replace removed document');
			start();
		})

		.fail( function(error) {
						
			deepEqual(error.err, -11, 'expecting -11');
			deepEqual(error.src, 'replace', 'expecting replace');
			deepEqual(error.col, name, 'expecting ' + name);
			deepEqual(error.usr, 'jsonstore', 'expecting default user');
			deepEqual(error.doc, [{_id: 10, json:{fn: 'heyhey'}}], 'mismatch for expected doc that caused failure');
			
			start();

		});

	}); //end test


})();