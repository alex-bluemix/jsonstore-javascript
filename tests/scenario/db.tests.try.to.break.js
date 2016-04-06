/*global module, deepEqual, ok, start, deepEqual, test, stop*/
(function() {

	'use strict';

	//Dependencies:
	var MODEL = JSONStore;
	var CONST = constant;

	var GLOBAL = {

		name : 'trytobreak',

		failure : function (err) {
			ok(false, 'Failed with: ' + err + ' ' + MODEL.getErrorMessage(err));
			start();
		},

		expectedFailure : function (err) {
			ok(true, 'Failed as expected: ' + err  + ' ' + MODEL.getErrorMessage(err));
			start();
		},

		expectedSuccess : function (data) {
			ok(true, 'data: '+ data  + ' ' + MODEL.getErrorMessage(data));
			start();
		}

	};

	module('Try to Break');

	test('_id integer', 1, function () {
		stop();

		var schema = {};
		schema[CONST.ID_KEY] = 'integer';

		MODEL.initCollection(GLOBAL.name, schema, { onFailure: GLOBAL.expectedFailure,
													onSuccess: GLOBAL.failure,
													dropCollection: true });
	});

	test('_id number', 1, function () {
		stop();

		var schema = {};
		schema[CONST.ID_KEY] = 'number';

		MODEL.initCollection(GLOBAL.name, schema, { onFailure: GLOBAL.expectedFailure,
													onSuccess: GLOBAL.failure,
													dropCollection: true });
	});

	test('_operation string', 1, function () {
		stop();

		var schema = {};
		schema[CONST.OPERATION_KEY] = 'string';

		MODEL.initCollection(GLOBAL.name, schema, { onFailure: GLOBAL.expectedFailure,
													onSuccess: GLOBAL.failure,
													dropCollection: true });
	});

	test('json string', 1, function () {
		stop();

		var schema = {};
		schema[CONST.JSON_DATA_KEY] = 'string';

		MODEL.initCollection(GLOBAL.name, schema, { onFailure: GLOBAL.expectedFailure,
													onSuccess: GLOBAL.failure,
													dropCollection: true });
	});

	test('_dirty string', 1, function () {
		stop();

		var schema = {'_dirty' : 'string'};

		MODEL.initCollection(GLOBAL.name, schema, { onFailure: GLOBAL.expectedFailure,
													onSuccess: GLOBAL.failure,
													dropCollection: true });
	});

	test('_deleted string', 1, function () {
		stop();

		var schema = {'_deleted' : 'string'};

		MODEL.initCollection(GLOBAL.name, schema, { onFailure: GLOBAL.expectedFailure,
													onSuccess: GLOBAL.failure,
													dropCollection: true });
	});

	test('city string', 1, function () {
		stop();

		var schema = {'city' : 'string'};

		MODEL.initCollection(GLOBAL.name, schema, { onFailure: GLOBAL.failure,
													onSuccess: GLOBAL.expectedSuccess,
													dropCollection: true });
	});

	test('address.city string', 1, function () {
		stop();

		var schema = {'address.city' : 'string'};

		MODEL.initCollection(GLOBAL.name, schema, { onFailure: GLOBAL.failure,
													onSuccess: GLOBAL.expectedSuccess,
													dropCollection: true });
	});

	test('define schema as int, pass a string', 3, function () {
		stop();

		var mI;

		var findAgeWithStringOne = function (data) {
			deepEqual(data.length, 1, 'Should get 1 document in the collection.');
			start();
		};

		var storeSuccessful = function (count) {
			deepEqual(count, 2, 'You should get 2, got: ' + count);
			mI.find({age: 'one'}, {onFailure: GLOBAL.failure, onSuccess: findAgeWithStringOne});
		};

		var initCollectionSuccess = function (data) {
			deepEqual(data, 0, 'new collection');
			mI.store([{age: 'one'}, {age: 1}], {onFailure: GLOBAL.failure, onSuccess: storeSuccessful });
		};

		mI = MODEL.initCollection(GLOBAL.name, {age: 'integer'}, { onFailure: GLOBAL.failure,
																	onSuccess: initCollectionSuccess,
																	dropCollection: true });
	});


	test('define schema as int, make age hit twice', 4, function () {
		stop();

		var mI;

		var foundDashWhileSearching = function (data) {
			if(typeof JSONStoreUtil.browser === 'object'){
				deepEqual(data.length, 0, 'browser does not smash all fields into a single field');
			}else{
				deepEqual(data.length, 1, 'found 1 document that matched because 2-@-3 is in the db');
			}
			start();
		};

		var findAgeWithStringOne = function (data) {
			deepEqual(data.length, 1, 'Should get 1 document in the collection.');
			mI.find({'arr.age': '-'}, {onFailure: GLOBAL.failure, onSuccess: foundDashWhileSearching});
		};

		var storeSuccessful = function (count) {
			deepEqual(count, 1, 'You should get 1, got: ' + count);
			mI.find({'arr.age': 2}, {onFailure: GLOBAL.failure, onSuccess: findAgeWithStringOne});
		};

		var initCollectionSuccess = function (data) {
			deepEqual(data, 0, 'new collection');
			mI.store({arr: [{age: 2}, {age: 3}]}, {onFailure: GLOBAL.failure, onSuccess: storeSuccessful});
		};

		mI = MODEL.initCollection(GLOBAL.name, {'arr.age': 'integer'}, { onFailure: GLOBAL.failure, onSuccess: initCollectionSuccess,
			dropCollection: true });
	});


	test('try to search the bad-normal case for \'address.city\'', 4, function () {
		stop();

		var mI;

		var findAddressCitySuccess = function (data) {

			if (typeof data === 'undefined' || data === null || data.length < 1 ) {

				GLOBAL.failure('data was empty:'+JSON.stringify(data));

			} else {

				deepEqual(data.length, 1, 'Should get 1 document in the collection.');
				deepEqual(data[0].json['address.city'], 'austin', 'found the right city');

				start();
			}

		};

		var storeSuccessful = function (count) {
			deepEqual(count, 1, 'You should get 1, got: ' + count);
			mI.find({'address.city': 'austin'}, {onFailure: GLOBAL.failure, onSuccess: findAddressCitySuccess});
		};

		var initCollectionSuccess = function (data) {
			deepEqual(data, 0, 'new collection');
			mI.store({ 'address.city' : 'austin' }, {onFailure: GLOBAL.failure, onSuccess: storeSuccessful});
		};

		mI = MODEL.initCollection(GLOBAL.name, {'address.city': 'string'}, { onFailure: GLOBAL.failure,
																			onSuccess: initCollectionSuccess,
																			dropCollection: true });
	});


	test('try to search for \'address.city\'', 6, function () {
		stop();

		var mI;

		var findAddressCitySuccessObj = function (data) {
			deepEqual(data.length, 1, 'found 1 as expected.');
			deepEqual(data[0].json.address.city, 'seattle', 'found the right city');
			start();
		};

		var findAddressCitySuccess = function (data) {
			if (typeof data === 'undefined' || data === null || data.length < 1 ) {
				GLOBAL.failure('data was empty:'+JSON.stringify(data));

			} else {
				deepEqual(data.length, 1, 'Should get 1 document in the collection.');
				deepEqual(data[0].json['address.city'], 'austin', 'found the right city');
				mI.find({'address.city': 'seattle'}, {onFailure: GLOBAL.failure, onSuccess: findAddressCitySuccessObj});
			}
		};

		var storeSuccessful = function (count) {
			deepEqual(count, 1, 'You should get 1, got: ' + count);
			mI.find({'address.city': 'austin'}, {onFailure: GLOBAL.failure, onSuccess: findAddressCitySuccess});
		};

		var initCollectionSuccess = function (data) {
			deepEqual(data, 0, 'new collection');
			var dataToStore = { 'address.city' : 'austin', address: {city: 'seattle'} };
			mI.store(dataToStore, {onFailure: GLOBAL.failure, onSuccess: storeSuccessful});
		};

		mI = MODEL.initCollection(GLOBAL.name, {'address.city': 'string'}, { onFailure: GLOBAL.failure,
																	onSuccess: initCollectionSuccess,
																	dropCollection: true });
	}
	);


	test('try to search for \'a.b.address.city\'', 6, function () {
		stop();

		var mI;

		var findAddressCitySuccessObj = function (data) {
			deepEqual(data.length, 1, 'found 1 as expected.');
			deepEqual(data[0].json.a.b.address.city, 'seattle', 'found the right city');
			start();
		};

		var findAddressCitySuccess = function (data) {
			if (typeof data === 'undefined' || data === null || data.length < 1 ) {

				GLOBAL.failure('data was empty:'+JSON.stringify(data));
			} else {

				deepEqual(data.length, 1, 'Should get 1 document in the collection.');
				deepEqual(data[0].json.a.b['address.city'], 'austin', 'found the right city');
				mI.find({'a.b.address.city': 'seattle'}, {onFailure: GLOBAL.failure, onSuccess: findAddressCitySuccessObj});
			}

		};

		var storeSuccessful = function (count) {
			deepEqual(count, 1, 'You should get 1, got: ' + count);
			mI.find({'a.b.address.city': 'austin'}, {onFailure: GLOBAL.failure, onSuccess: findAddressCitySuccess});
		};

		var initCollectionSuccess = function (data) {
			deepEqual(data, 0, 'new collection');
			var dataToStore = {a: {b: { 'address.city' : 'austin', address: {city: 'seattle'} }} };
			mI.store(dataToStore, {onFailure: GLOBAL.failure, onSuccess: storeSuccessful });
		};


		mI = MODEL.initCollection(GLOBAL.name, {'a.b.address.city': 'string'}, { onFailure: GLOBAL.failure,
			onSuccess: initCollectionSuccess, dropCollection: true });
	});

	test('try using \'a.b: address.city\'', 6, function () {
		stop();

		var mI;

		var findAddressCitySuccessObj = function (data) {
			deepEqual(data.length, 1, 'found 1 as expected.');
			deepEqual(data[0].json['a.b'].address.city, 'seattle', 'found the right city');
			start();
		};

		var findAddressCitySuccess = function (data) {
			if (typeof data === 'undefined' || data === null || data.length < 1 ) {

				GLOBAL.failure('data was empty:'+JSON.stringify(data));
			} else {

				deepEqual(data.length, 1, 'Should get 1 document in the collection.');
				deepEqual(data[0].json['a.b']['address.city'], 'austin', 'found the right city');
				mI.find({'a.b.address.city': 'seattle'}, {onFailure: GLOBAL.failure, onSuccess: findAddressCitySuccessObj});
			}

		};

		var storeSuccessful = function (count) {
			deepEqual(count, 1, 'You should get 1, got: ' + count);
			mI.find({'a.b.address.city': 'austin'}, {onFailure: GLOBAL.failure, onSuccess: findAddressCitySuccess});
		};

		var initCollectionSuccess = function (data) {
			deepEqual(data, 0, 'new collection');
			var dataToStore = {'a.b': { 'address.city' : 'austin', address: {city: 'seattle'} } };
			mI.store(dataToStore, {onFailure: GLOBAL.failure, onSuccess: storeSuccessful });
		};


		mI = MODEL.initCollection(GLOBAL.name, {'a.b.address.city': 'string'}, { onFailure: GLOBAL.failure,
			onSuccess: initCollectionSuccess, dropCollection: true });
	});

})();