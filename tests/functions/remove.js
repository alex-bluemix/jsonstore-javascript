/*global module, JSON, asyncTest, ok, start, deepEqual, notDeepEqual*/
(function () {

	'use strict';

	module('remove');

	//111count222 is a special identifier so we can filter these tests

	asyncTest('Test removing all documents from a collection', 4, function () {

		var collections = {
			customers: {
				searchFields : {name: 'string', age: 'integer'}
			}
		};

		var data = [
			{name: 'carlos', age: 1},
			{name: 'dgonz', age: 2},
			{name: 'carlos', age: 3}
		];

		JSONStore.destroy()

		.then(function (res) {
			deepEqual(res, 0, 'destroy');
			return JSONStore.init(collections);
		})

		.then(function (res) {
			deepEqual(res.customers.name, 'customers');
			return JSONStore.get('customers').add(data);
		})

		.then(function (res) {
			deepEqual(res, 3, 'add');
			return JSONStore.get('customers').find({});
		})

		.then(function (res) {
			return JSONStore.get('customers').remove(res);
		})

		.then(function () {
			return JSONStore.get('customers').find({});
        })

        .then(function (res) {
			deepEqual([], res, 'Removed all documents from the collection. Result: ' + res);
			start();
        })
        .fail(function (err) {
			ok(false, 'Should not have failed: should have removed all documents. Error: ' + err);
			start();
        });

	});

}(JSON, asyncTest, ok, start, deepEqual, notDeepEqual));