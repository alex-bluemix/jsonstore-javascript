/*global module, deepEqual, ok, start, deepEqual, asyncTest*/
(function() {

	'use strict';

	//Dependencies:
	var model = JSONStore;

	function fail(err) {
		ok(false, 'Failed with: ' + err + ' ' + model.getErrorMessage(err));
		start();
	}

	module('Status Codes');

	asyncTest('initCollection', 8, function () {
		var modelInstance;

		var invalidCollectionInvalidSchemaNumber = function (err) {

			//ERROR[6] = "BAD_PARAMETER_EXPECTED_SIMPLE_OBJECT";
			deepEqual(err, 6, 'invalidCollectionInvalidSchemaNumber');
			deepEqual(typeof modelInstance, 'undefined', 'invalidCollectionInvalidSchemaNumber-undefined');
			start();
		};


		var invalidCollectionInvalidSchemaString = function (err) {

			//ERROR[6] = "BAD_PARAMETER_EXPECTED_SIMPLE_OBJECT";
			deepEqual(err, 6, 'invalidCollectionInvalidSchemaString');
			deepEqual(typeof modelInstance, 'undefined', 'invalidCollectionInvalidSchemaString-undefined');

			modelInstance = model.initCollection('validCollectionName', 23423, {onFailure: invalidCollectionInvalidSchemaNumber, onSuccess: fail});

		};

		var invalidCollectionNameInt = function (err) {

			//ERROR[4] = "BAD_PARAMETER_EXPECTED_ALPHANUMERIC_STRING";
			deepEqual(err, 4, 'invalidCollectionNameInt');
			deepEqual(typeof modelInstance, 'undefined', 'invalidCollectionNameInt-undefined');
			
			modelInstance = model.initCollection('validCollectionName', 'schema', {onFailure: invalidCollectionInvalidSchemaString, onSuccess: fail});
		};

		var invalidCollectionNameEmptyString = function (err) {

			//ERROR[4] = "BAD_PARAMETER_EXPECTED_ALPHANUMERIC_STRING";
			deepEqual(err, 4, 'invalidCollectionNameEmptyString');
			deepEqual(typeof modelInstance, 'undefined', 'invalidCollectionNameEmptyString-undefined');
			
			modelInstance = model.initCollection(3543, {fn: 'string'}, {onFailure: invalidCollectionNameInt, onSuccess: fail});

		};

		modelInstance = model.initCollection('', {fn: 'string'}, {onFailure: invalidCollectionNameEmptyString, onSuccess: fail});
	});


	asyncTest('initCollection with invalid username', 2, function () {
		var mI;
		
		var expectedFail2 = function (err) {
			deepEqual(err, -7, 'INVALID_USERNAME');
			start();
		};
		
		var expectedFail1 = function (err) {
			deepEqual(err, -7, 'INVALID_USERNAME');
			mI = JSONStore.initCollection('invalidUsername', {fn: 'string'},
					{username: 'JSONStoreKey', onFailure: expectedFail2, onSuccess: fail});
		};
		
		mI = JSONStore.initCollection('invalidUsername', {fn: 'string'},
				{username: 'jsonstore', onFailure: expectedFail1, onSuccess: fail});
		
	});

})();