/*global module, deepEqual, ok, start, asyncTest, test, stop*/
(function() {

	'use strict';

	//Dependencies:
	var model = JSONStore;

	var SCHEMA = {'fn': 'string', 'ln' : 'string', 'age' : 'integer'};
	var COLLECTION = 'replace';
	var DATA = [{fn: 'carlos', ln: 'andreu', age: 13}, {fn: 'jeremy', ln: 'nortey', age: 14}];

	var fail = function(err){
		ok(false, 'Failed with: ' + err + ' ' + model.getErrorMessage(err));
		start();
	};

	function failNotImplemented(errMsg){
		ok(false, 'Not Implemented: ' + errMsg);
		start();
	}

	module('Remove');

	test('Store 2, remove 1, try to find removed', 5, function(){
		stop();
		var modelInstance;

		var countWin = function(data){
			deepEqual(data, 1, 'Modification count should be 1');
			start();
		};

		var finishedSearchingAge = function (data) {
			deepEqual([], data, 'Find should have returned an array with size 0');
			modelInstance.pushRequiredCount({onSuccess: countWin, onFailure: fail});
		};

		var removeSuc = function (data) {
			deepEqual(data, 1, 'removed 1 successfully');
			modelInstance.find({age: 13}, {onSuccess: finishedSearchingAge, onFailure: fail});
		};

		var finishedStoring = function (data) {
			deepEqual(data, 2, 'stored 2 item');
			modelInstance.remove({fn: 'carlos'},{onSuccess: removeSuc, onFailure: fail});
		};

		var initWin = function(data){
			deepEqual(data, 0, 'created collection');
			modelInstance.store(DATA, {onSuccess: finishedStoring, onFailure: fail});
		};

		modelInstance = model.initCollection(COLLECTION, SCHEMA, {dropCollection:true, onSuccess: initWin, onFailure: fail});
	});

	test('Attempt to remove empty data array then find and remove', 5, function(){
		var modelInstance;
		stop();

		var countWin = function (data) {
			deepEqual(data, 2, 'count should be 1');
			start();
		};
		var attemptRemove = function (data) {
			deepEqual(data, 0, 'nothing removed');
			modelInstance.pushRequiredCount({onSuccess: countWin, onFailure: fail});
		};
		var removeWin = function (data) {
			deepEqual(data, 1, 'We should have removed 1 item');
			modelInstance.remove([], {onSuccess: attemptRemove, onFailure: fail});
		};

		var finishedFind = function (data) {
			deepEqual(data.length, 1, 'Expected 1 result');
			modelInstance.remove(data[0], {onSuccess: removeWin, onFailure: fail});
		};

		var initWin = function(data){
			deepEqual(data, 1, 'got collection that already exists');
			modelInstance.find({fn: 'jeremy'}, {onSuccess: finishedFind, onFailure: fail});
		};

		//Get the same collection
		modelInstance = model.initCollection(COLLECTION, SCHEMA, {dropCollection:false, onSuccess: initWin, onFailure: fail});
	});

	/************************************************
	Basic tests with addIndexes (STORE, REMOVE and FIND)
	*************************************************/

	test('Basic tests with addIndexes (STORE, REMOVE and FIND)', 4, function(){
		stop();

		var mI;

		var findSucc = function(data){
			deepEqual(data, [], 'Expected 0 documents');
			start();
		};

		var finishedRemovedSuccesfully = function (data) {
			deepEqual(data, 1, '1 document removed');
			mI.find({'orderId': 'abc123', 'fn': 'carlos'}, {onSuccess: findSucc, onFailure: fail});
		};

		var finishedStoring = function (data) {
			deepEqual(data, 2, 'Expected should match 2 stores:' + data);
			mI.remove(1, {onSuccess: finishedRemovedSuccesfully, onFailure: fail});
		};

		var createSuccessful = function (data) {
			var dataArray = [{fn: 'carlos', ln: 'andreu', age: 13}, {fn: 'jeremy', ln: 'nortey', age: 14}];

			deepEqual(data, 0, 'create success');
			mI.store(dataArray, {addIndexes: {'orderId': 'abc123' }, onSuccess: finishedStoring, onFailure: fail});
		};

		var schema = {'fn': 'string', 'ln' : 'string', 'age' : 'integer', 'orderId': 'string'};
		var options = { onSuccess: createSuccessful, onFailure: fail, dropCollection: true};

		mI = JSONStore.initCollection('addIndexesTestRemove', schema, options);
	});

	/************************************************
	Basic tests with addIndexes (STORE, ERASE and FIND)
	*************************************************/

	test('Basic tests with addIndexes (STORE, ERASE and FIND)', 4, function(){
		stop();

		var mI;

		var findSucc = function(data){
			deepEqual(data, [], 'Expected 0 documents');
			start();
		};

		var finishedRemovedSuccesfully = function (data) {
			deepEqual(data, 1, '1 document removed');
			mI.find({'orderId': 'abc123', 'fn': 'carlos'}, {onSuccess: findSucc, onFailure: fail});
		};

		var finishedStoring = function (data) {
			deepEqual(data, 2, 'Expected should match 2 stores:' + data);
			mI.erase(1, {onSuccess: finishedRemovedSuccesfully, onFailure: fail});
		};

		var createSuccessful = function (data) {
			deepEqual(data, 0, 'create success');

			var dataArray = [{fn: 'carlos', ln: 'andreu', age: 13}, {fn: 'jeremy', ln: 'nortey', age: 14}];
			mI.store(dataArray, {addIndexes: {'orderId': 'abc123' }, onSuccess: finishedStoring, onFailure: fail});
		};

		var schema = {'fn': 'string', 'ln' : 'string', 'age' : 'integer', 'orderId': 'string'};
		var options = { onSuccess: createSuccessful, onFailure: fail, dropCollection: true};

		mI = JSONStore.initCollection('addIndexesTestRemove', schema, options);
	});

	test('Store 2, remove 1, try replace on removed', 5, function(){
		stop();

		var mI;

		var replaceFailure = function (data) {
			//Data will contain the object that failed to update.
			if (typeof data === 'undefined' || data === null || data.length < 1 ) {
				failNotImplemented('data was empty:'+JSON.stringify(data));
			}else{
				deepEqual(data.length, 1, 'Should not update the removed record');
				deepEqual(data[0], JSONStore.documentify(1, {fn: 'fnDeleted', ln: 'lnDeleted', age: 73}), 'check doc that caused replace error');
				start();
			}
		};

		var removedSuccess = function (data) {
			deepEqual(data, 1, 'remove success');

			var doc = JSONStore.documentify(1, {fn: 'fnDeleted', ln: 'lnDeleted', age: 73});
			//this should call the failure cb
			mI.replace(doc, {onSuccess: fail, onFailure: replaceFailure});
		};

		var finishedStoring = function (data) {
			deepEqual(data, 2, 'store success');

			mI.remove(1, {onSuccess: removedSuccess, onFailure: fail});
		};

		var createSuccessful = function (data) {
			deepEqual(data, 0, 'create success');

			var d = [{fn: 'carlos', ln: 'andreu', age: 13}, {fn: 'jeremy', ln: 'nortey', age: 14}];
			mI.store(d, {onSuccess: finishedStoring, onFailure: fail});
		};

		var s = {'fn': 'string', 'ln' : 'string', 'age' : 'integer'};
		var options = { onSuccess: createSuccessful, onFailure: fail, dropCollection: true};

		mI = JSONStore.initCollection('addIndexesTestRemove', s, options);
	});

	/************************************************
	Remove Collection Tests
	*************************************************/

	//Creates a new collection and then removes it with instance.removeCollection()
	//See: 14304: [Data Store] removeCollection function not worked on android side

	asyncTest('testing removeCollection on empty collection', 5, function () {

		var mI;

		//Note: before v6.2 it would return -1 (persistent store failure)
		var expectedFailAdd = function (data) {
			deepEqual(data, -50, 'failed as expected with correct error code');
			start();
		};

		var successRm = function(data) {
			//Returns: Boolean if the operation succeeded
			ok(true, 'the success callback was called');
			deepEqual(typeof data, 'number', 'got a number baack');
			deepEqual(data, 0, 'return code 0');
			mI.add({fn: 'carlos'}, {onFailure: expectedFailAdd, onSuccess: fail});
		};

		mI = JSONStore.initCollection('test6768', {fn: 'string'}, {onFailure: fail,
		onSuccess: function (status) {
			deepEqual(status, 0, 'new collection');
			mI.removeCollection({onSuccess: successRm, onFailure: fail});
		}});
	});

	// Creates a new collection, adds some data and then tries to remove the collection with instance.removeCollection()
	//See: 14304: [Data Store] removeCollection function not worked on android side

	asyncTest('testing removeCollection on empty collection', 7, function () {

		var mI;

		var findFailExpected = function (data) {
			//Note: before v6.2 it would return 22 ('INVALID_SEARCH_FIELD')
			deepEqual(data, -50, 'failed as expected with correct error code');
			start();
		};

		var expectedFailAdd = function (data) {
      //Note: before v6.2 it would return -1 (persistent store failure)
			deepEqual(data, -50, 'failed as expected with correct error code');
			mI.find({fn: 'carlos'}, {onFailure: findFailExpected, onSuccess: fail});
		};

		var successRm = function(data) {
			//Returns: Boolean if the operation succeeded
			ok(true, 'the success callback was called');
			deepEqual(typeof data, 'number', 'got a number baack');
			deepEqual(data, 0, 'return code 0');
			mI.add({fn: 'carlitos'}, {onFailure: expectedFailAdd, onSuccess: fail});
		};

		var addWin = function (data) {
			deepEqual(data,1 , 'add worked and returned: 1 as expected');
			mI.removeCollection({onSuccess: successRm, onFailure: fail});
		};

		mI = JSONStore.initCollection('test123123', {fn: 'string'}, {onFailure: fail,
		onSuccess: function (status) {
			deepEqual(status, 0, 'new collection');
			mI.add({fn: 'carlos'}, {onFailure: fail, onSuccess: addWin});
		}});
	});

	//Test for Defect 15238: JSONStore remove method not removing documents correctly
	//initCollection > Store 21 documents > delete document with _id = 1 > find document with _id=1 should not exist
	//find document with _id=11 should exists > find doc with _id=21 should exist

	asyncTest('testing remove with array of docs', 9, function () {

		var mI,
			DATA = [],
			TOTAL = 22;

		for (var i=1; i< TOTAL; i++) {
			DATA.push({fn: 'name'+i});
		}

		var find21Win = function (results) {
			deepEqual(results.length, 1, 'find21Win');
			deepEqual(results[0].json.fn, 'name21', 'find21Win2');
			start();
		};

		var find11Win = function (results) {
			deepEqual(results.length, 1, 'find11Win');
			deepEqual(results[0].json.fn, 'name11', 'find11Win2');
			mI.findById(21, {onFailure: fail, onSuccess: find21Win});
		};

		var winRemove = function (count) {
			deepEqual(count, 1, 'winRemove');
			mI.findById(11, {onFailure: fail, onSuccess: find11Win});
		};

		var winFind = function (results) {
			deepEqual(results.length, 1, 'winFind1');
			deepEqual(results[0].json.fn, 'name1', 'winFind2');
			mI.remove(results, {onFailure: fail, onSuccess: winRemove});
		};

		var winStore = function (count) {
			deepEqual(count, TOTAL-1, 'winStore');
			mI.findById(1, {onFailure: fail, onSuccess: winFind});
		};

		var winInit = function (status) {
			deepEqual(status, 0, 'winInit');
			mI.store(DATA, {onFailure: fail, onSuccess: winStore});
		};

		mI = JSONStore.initCollection('somecollection243467', {fn: 'string'},
				{onFailure: fail, onSuccess: winInit, dropCollection: true});

	});

	asyncTest('Testing exact match strings', 10, function () {

		var collections = {
			people : {
				searchFields : {name: 'string'}
			}
		};

		JSONStore.destroy()

		.then(function (rc) {
			deepEqual(rc, 0, 'destroy');
			return JSONStore.init(collections);
		})

		.then(function (res) {
			deepEqual(res.people.name, 'people', 'init');
			return res.people.add([{name: 'car'}, {name: 'ar'}, {name: 'carlos'}, {name: 'a'}]);
		})

		.then(function (res) {
			deepEqual(res, 4, 'add');
			return JSONStore.get('people').remove({name : 'a' }, {exact: true});
		})

		.then(function (res) {
			deepEqual(res, 1, 'remove 1 with exact match');
			return JSONStore.get('people').find({name : 'a'}, {exact: true});
		})

		.then(function (res) {
			deepEqual(res.length, 0, 'find after remove should return no matches');
			return JSONStore.get('people').find({}, {exact: true});
		})

		.then(function (res) {
			deepEqual(res.length, 3, 'all other records should exist');
			deepEqual(res[0].json.name, 'car', 'car');
			deepEqual(res[1].json.name, 'ar', 'ar');
			deepEqual(res[2].json.name, 'carlos', 'carlos');
			return JSONStore.get('people').count();
		})

		.then(function (res) {
			deepEqual(res, 3, 'count ok');
			start();
		})

		.fail(function (err) {
			ok(fail, err.toString());
			start();
		});

	});

	//Destroy tests for single username:
	asyncTest('Destroy one store', 19, function () {

		//First Store
		var collections1 = {
				people : {
					searchFields: {name: 'string'}
				}
		};


		var options1 = {
				username: 'carlos',
				password: '123',
				localKeyGen: true
		};


		//Second Store
		var collections2 = {
				orders: {
					searchFields: {item: 'string'}
				}
		};

		var options2 = {
				username: 'mike',
				password: '456',
				localKeyGen: true
		};

		JSONStore.destroy()

		.then(function (res) {

			deepEqual(res, 0, 'destroy1');

			return JSONStore.init(collections1, options1);
		})

		.then(function (res) {

			deepEqual(res.people.name, 'people', 'init1');

			return JSONStore.get('people').add({name: 'cesar'});
		})

		.then(function (res) {

			deepEqual(res, 1, 'add1');

			return JSONStore.get('people').findAll();
		})

		.then(function (res) {

			try {
				deepEqual(res.length, 1, 'findAll1-a');
				deepEqual(res[0].json.name, 'cesar', 'findAll1-b');
			} catch (e) {
				ok(false, '1Exception: ' + e.toString());
			}

			return JSONStore.closeAll();
		})

		.then(function (res) {
			deepEqual(res, 0, 'closeAll1');

			return JSONStore.init(collections2, options2);
		})

		.then(function (res) {
			deepEqual(res.orders.name, 'orders', 'init2');

			return JSONStore.get('orders').add({item: 'broom'});
		})

		.then(function (res) {
			deepEqual(res, 1, 'add2');

			return JSONStore.get('orders').findAll();
		})

		.then(function (res) {

			try {
				deepEqual(res.length, 1, 'findAll2-a');
				deepEqual(res[0].json.item, 'broom', 'findAll2-b');
			} catch (e) {
				ok(false, '2Exception: ' + e.toString());
			}

			return JSONStore.closeAll();
		})

		.then(function (res) {
			deepEqual(res, 0, 'closeAll2');

			return JSONStore.destroy('carlos');
		})

		.then(function (res) {
			deepEqual(res, 0, 'destroy carlos');

			options1.password = 'newPassword';
			return JSONStore.init(collections1, options1);
		})

		.then(function (res) {
			deepEqual(res.people.name, 'people', 'init-after-destroy');

			return JSONStore.get('people').findAll();
		})

		.then(function (res) {
			deepEqual(res, [], 'findAll-after-destroy');

			return JSONStore.closeAll();
		})

		.then(function (res) {
			deepEqual(res, 0, 'closeAll-after-destroy');

			return JSONStore.init(collections2, options2);
		})

		.then(function (res) {
			deepEqual(res.orders.name, 'orders', 'init2-after-destroy');

			return JSONStore.get('orders').findAll();
		})

		.then(function (res) {

			try {
				deepEqual(res.length, 1, 'findAll2-a-after-destroy');
				deepEqual(res[0].json.item, 'broom', 'findAll2-b-after-destroy');
			} catch (e) {
				ok(false, '3Exception: ' + e.toString());
			}

			return JSONStore.destroy();
		})

		.then(function (res) {
			deepEqual(res, 0, 'clean up destroy');
			start();
		})

		.fail(function (err) {
			ok(false, 'Failure is not an option: ' + JSON.stringify(err, null, ' '));
			start();
		});
	});

})();