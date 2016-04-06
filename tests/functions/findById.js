/*global module, deepEqual, ok, start, QUnit, stop, asyncTest*/

(function() {

	'use strict';

	QUnit.testStart(function( details ) {
		// console.log( "Now running: ", details.module, details.name );
		if (details.module.indexOf('Find By Id') === 0) {
			stop();
			JSONStore.destroy().always(function () {
				// console.log('Destroy done!');
				start();
			});
		}
	});

	var modelInstance;

	//Dependencies:
	var model = JSONStore;
	var COLLECTION = 'findByIdCollection';
	var SCHEMA = {fn: 'string'};
	var DATA = [{fn: 'carlos'}, {fn: 'tim'}, {fn: 'jeff'},
	{fn: 'raj'}, {fn: 'jeremy'}, {fn: 'bill'},
	{fn: 'lizet'}, {fn: 'mike'}, {fn: 'jeremy'},
				{fn: 'paul'}, {fn: 'curtiss'}, {fn: 'barbara'}]; //len = 12

	var FIND_ALL_INVALID_PARAMETER = 27; //TODO: Put valid error code here

	var fail = function(err){
		ok(false, 'Failed with: ' + err + ' ' + model.getErrorMessage(err));
		start();
	};

	var checkValidDataArray = function (data) {

		return (typeof data === 'undefined' || data === null || !Array.isArray(data) || data.length < 1);
	};

	module('Find By Id');


	asyncTest('Invalid parameters', 8, function () {
		
		var  findByIdWithArrayIncludingFloatExpectedFailure  = function (data) {

			deepEqual(data, FIND_ALL_INVALID_PARAMETER, 'findByIdWithArrayIncludingFloatExpectedFailure');
			start();
		};

		var findIdByArrayWithNonIntegersExpectedFailure = function (data) {

			deepEqual(data, FIND_ALL_INVALID_PARAMETER, 'findIdByArrayWithNonIntegersExpectedFailure');
			modelInstance.findById([1,2,3.14,4,5], {onSuccess: fail, onFailure: findByIdWithArrayIncludingFloatExpectedFailure});
		};

		var findByIdEmptyArrayExpectedFailure = function (data) {

			deepEqual(data, FIND_ALL_INVALID_PARAMETER, 'findByIdEmptyArrayExpectedFailure');
			modelInstance.findById([1,2,'3',4,5], {onSuccess: fail, onFailure: findIdByArrayWithNonIntegersExpectedFailure});
		};

		var findByStringExpectedFailure = function (data) {

			deepEqual(data, FIND_ALL_INVALID_PARAMETER, 'findByIdObjExpectedFailure');
			modelInstance.findById([], {onSuccess: fail, onFailure: findByIdEmptyArrayExpectedFailure});
		};

		var findByIdObjExpectedFailure = function (data) {

			deepEqual(data, FIND_ALL_INVALID_PARAMETER, 'findByIdObjExpectedFailure');
			modelInstance.findById('1', {onSuccess: fail, onFailure: findByStringExpectedFailure});
		};

		var findByIdEmptyObjExpectedFailure = function (data) {

			deepEqual(data, FIND_ALL_INVALID_PARAMETER, 'findByIdEmptyObjExpectedFailure');
			modelInstance.findById({_id: 1}, {onSuccess: fail, onFailure: findByIdObjExpectedFailure});
		};

		var findByIdNullExpectedFailure = function (data) {

			deepEqual(data, FIND_ALL_INVALID_PARAMETER, 'findByIdNullExpectedFailure');
			modelInstance.findById({}, {onSuccess: fail, onFailure: findByIdEmptyObjExpectedFailure});
		};

		var initWin = function (data) {
			
			deepEqual(data, 0, 'initWin');

			if (typeof modelInstance.findById === 'undefined') {
				fail('not implemented');
			} else {
				modelInstance.findById(null, {onSuccess: fail, onFailure: findByIdNullExpectedFailure});
			}
			
		};
		
		var options = { onSuccess: initWin, onFailure: fail, dropCollection: true};
		modelInstance = model.initCollection(COLLECTION, SCHEMA, options);
	});


asyncTest('Valid parameters', 8, function() {

	var findByIdWithArray = function (data) {

		if(checkValidDataArray(data)){
			fail('findByIdNoArray did not get a valid data obj');
		}

		deepEqual(data.length, 3, 'findByIdWithArray.length');

		var j = 3;

			while (j--) { //j = 2, 1, 0
				deepEqual(data[j].json, DATA[j], 'findByIdWithArray'+j);
			}
			
			start();
		};

		var findByIdNoArray = function (data) {

			if(checkValidDataArray(data)){
				fail('findByIdNoArray did not get a valid data obj');
			}

			//Find by id 1 should return the first element in DATA (index 0)
			deepEqual(data[0].json, DATA[0], 'findByIdNoArray');
			modelInstance.findById([1,2,3], {onFailure: fail, onSuccess: findByIdWithArray});
		};

		var storeWin = function (data) {
			deepEqual(data, DATA.length, 'storeWin');
			
			if (typeof modelInstance.findById === 'undefined') {
				fail('not implemented');
			} else {
				modelInstance.findById(1, {onFailure: fail, onSuccess: findByIdNoArray});
			}
		};


		var findByIdEmptyCollection = function (data) {

			if (!Array.isArray(data)) {
				fail('findByIdEmptyCollection did not get a valid return value');
			}

			deepEqual(data.length, 0, 'findByIdEmptyCollection');

			modelInstance.store(DATA, {onFailure: fail, onSuccess: storeWin});
		};

		var initWin = function (data) {
			deepEqual(data, 0, 'initWin');

			if (typeof modelInstance.findById === 'undefined') {
				fail('not implemented');
			} else {
				modelInstance.findById(1, {onFailure: fail, onSuccess: findByIdEmptyCollection});
			}
			
		};

		var options = { onSuccess: initWin, onFailure: fail, dropCollection: true};
		modelInstance = model.initCollection(COLLECTION, SCHEMA, options);

	});


	//Testing Defect 15264: JSONStore findById returns documents that have been marked for deletion
	// initCollection > store > remove > findById(1) > it should not return the document that was removed

	asyncTest('testing find by id is working correctly', 4, function () {

		var mI;

		var findWin = function (docs) {
			deepEqual(docs.length, 0, 'findWin');
			start();
		};
		
		var removeWin = function (count) {
			deepEqual(count, 1, 'removeWin');
			mI.findById(1, {onFailure: fail, onSuccess: findWin});
		};
		
		var storeWin = function (count) {
			deepEqual(count, 1, 'storeWin');
			mI.remove({fn: 'carlos'}, {onFailure: fail, onSuccess: removeWin});
		};

		var initWin = function (status) {
			deepEqual(status, 0, 'initWin - new collection');
			mI.store({fn: 'carlos'}, {onFailure: fail, onSuccess: storeWin});
		};

		mI = model.initCollection('findTestIdColl12', {fn: 'string'},
			{onFailure: fail, onSuccess: initWin});

	});


	//We can only run records in chunks of 750, so test bigger, less than and equal to that amount
	asyncTest('Find with a large array ids', 4, function () {

		var c = JSONStore.initCollection('findBigArr1', {fn: 'string', myId : 'integer'}),
		objs = [],
		NUM_RECS=1009;

		//insert a bunch o docs
		for(var j = 0; j < NUM_RECS; j++){
			objs.push({fn: 'tim', myId: j});
		}

		c.promise

		.then(function (res) {
			deepEqual(res, 0, 'init');
			return c.add(objs, {push: false});
		})

		.then(function (res) {
			deepEqual(res, NUM_RECS, 'stored all ' + NUM_RECS);
			return c.count();
		})

		.then(function (res) {
			var findIds = [];
			for (var k = 1; k <= NUM_RECS; k++){
				findIds.push(k);
			}
			deepEqual(res, NUM_RECS, 'count should be ' + NUM_RECS);
			return c.findById(findIds);
		})

		.then(function (res) {
			deepEqual(res.length, NUM_RECS, 'found ' + NUM_RECS);
			//too many docs to validate each one
			start();
		})

		.fail(function (obj) {
			ok(false, 'failure is not an option' + obj.toString());
			start();
		});

	});//async test end


	asyncTest('Find with a large array ids 2', 4, function () {
		
		var c = JSONStore.initCollection('findBigArr2', {fn: 'string', myId : 'integer'}),
		objs = [],
		NUM_RECS=750;
		
		

		//insert a bunch o docs
		for(var j = 0; j < NUM_RECS; j++){
			objs.push({fn: 'tim', myId: j});
		}

		c.promise

		.then(function (res) {
			deepEqual(res, 0, 'init');
			return c.add(objs, {push: false});
		})

		.then(function (res) {
			deepEqual(res, NUM_RECS, 'stored all ' + NUM_RECS);
			return c.count();
		})

		.then(function (res) {
			var findIds = [];
			for (var k = 1; k <= NUM_RECS; k++){
				findIds.push(k);
			}
			deepEqual(res, NUM_RECS, 'count should be ' + NUM_RECS);
			return c.findById(findIds);
		})

		.then(function (res) {
			deepEqual(res.length, NUM_RECS, 'found ' + NUM_RECS);
			//too many docs to validate each one
			start();
			
		})

		.fail(function (obj) {
			ok(false, 'failure is not an option' + obj.toString());
			start();
		});

	});//async test end

	asyncTest('Find with a large array ids 3', 4, function () {
		
		var c = JSONStore.initCollection('findBigArr3', {fn: 'string', myId : 'integer'}),
		objs = [],
		NUM_RECS=749;
		

		//insert a bunch o docs
		for(var j = 0; j < NUM_RECS; j++){
			objs.push({fn: 'tim', myId: j});
		}

		c.promise

		.then(function (res) {
			deepEqual(res, 0, 'init');
			return c.add(objs, {push: false});
		})

		.then(function (res) {
			deepEqual(res, NUM_RECS, 'stored all ' + NUM_RECS);
			return c.count();
		})

		.then(function (res) {
			var findIds = [];
			for (var k = 1; k <= NUM_RECS; k++){
				findIds.push(k);
			}
			deepEqual(res, NUM_RECS, 'count should be ' + NUM_RECS);
			return c.findById(findIds);
		})

		.then(function (res) {
			deepEqual(res.length, NUM_RECS, 'found ' + NUM_RECS);
			//too many docs to validate each one
			start();

		})

		.fail(function (obj) {
			ok(false, 'failure is not an option' + obj.toString());
			start();
		});

	});//async test end


})();