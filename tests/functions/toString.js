/*global module, deepEqual, ok, start, asyncTest*/
(function () {

	'use strict';

	var genericFailure = function (err) {

		ok(false, 'error'+err.toString());
		console.log(err.toString());
		start();
	};

	module('toString');

	asyncTest('toString(0)', 7, function () {

		var c;
		JSONStore.destroy().then(function (res) {
			deepEqual(res, 0, 'destroy');

			c = JSONStore.initCollection('col', {fn: 'string'});
			return c.promise;
		})

		.then(function (res) {
			deepEqual(res, 0, 'init');
			return c.store({fn: 'carlos'});
		})

		.then(function (res) {
			deepEqual(res, 1, 'store');

			c.toString(0).then(function (res) {

				deepEqual(res.collection.name, 'col', 'name');
				deepEqual(res.collection.username, 'jsonstore', 'username');
				deepEqual(res.collection.searchFields, {_id: 'number', fn: 'string'}, 'searchFields');
				deepEqual(res.collection.additionalSearchFields, {}, 'additionalSearchFields');
				start();
			});

		})

		.fail(genericFailure);

	});//end toString(0)

	asyncTest('toString(\'hello\')', 8, function () {

		var c;
		JSONStore.destroy().then(function (res) {
			deepEqual(res, 0, 'destroy');

			c = JSONStore.initCollection('col2', {fn: 'string'}, {username: 'tim'});
			return c.promise;
		})

		.then(function (res) {
			deepEqual(res, 0, 'init');
			return c.store([{fn: 'carlos'}, {fn: 'tim'}]);
		})

		.then(function (res) {
			deepEqual(res, 2, 'store');

			c.toString('hello').then(function (res) {

				deepEqual(res.collection.name, 'col2', 'name');
				deepEqual(res.collection.username, 'tim', 'username');
				deepEqual(res.collection.searchFields, {_id: 'number', fn: 'string'}, 'searchFields');
				deepEqual(res.collection.additionalSearchFields, {}, 'additionalSearchFields');
				deepEqual(res.docs.length, 2, 'docs length, docs:'+JSON.stringify(res.docs));
				start();
			});

		})

		.fail(genericFailure);

	});//end toString('hello')

	asyncTest('toString()', 11, function () {

		var c;
		JSONStore.destroy().then(function (res) {
			deepEqual(res, 0, 'destroy');

			c = JSONStore.initCollection('collection',
			{fn: 'string', age: 'number'}, {username: 'carlos'});
			return c.promise;
		})

		.then(function (res) {
			deepEqual(res, 0, 'init');

			var arr = [],
				len = 105;
			while(len--){
				arr.push({fn: 'carlos', age: len});
			}

			return c.store(arr);
		})

		.then(function (res) {
			deepEqual(res, 105, 'store');

			c.toString().then(function (res) {

				deepEqual(res.collection.name, 'collection', 'name');
				deepEqual(res.collection.username, 'carlos', 'username');
				deepEqual(res.collection.searchFields, {_id: 'number', fn: 'string', age: 'number'}, 'searchFields');
				deepEqual(res.collection.additionalSearchFields, {}, 'additionalSearchFields');
				deepEqual(res.docs.length, 100, '100 docs is the limit for toString()');
				deepEqual(res.docs[0]._id, 1, 'check _id for the first doc');
				deepEqual(res.docs[0].json.fn, 'carlos', 'check the first doc - name');
				deepEqual(res.docs[0].json.age, 104, 'check the first doc - age, we loop backwards');
				start();
			});

		})

		.fail(genericFailure);

	});//end toString()

	asyncTest('toString(2)', 12, function () {

		var c;
		JSONStore.destroy().then(function (res) {
			deepEqual(res, 0, 'destroy');

			c = JSONStore.initCollection('c1234',
			{fn: 'string', age: 'number'}, {username: 'carlos'});
			return c.promise;
		})

		.then(function (res) {
			deepEqual(res, 0, 'init');

			return c.store([{fn: 'carlos'}, {fn: 'tim'}, {fn: 'mike'}]);
		})

		.then(function (res) {
			deepEqual(res, 3, 'store');

			c.toString(2).then(function (res) {

				deepEqual(res.collection.name, 'c1234', 'name');
				deepEqual(res.collection.username, 'carlos', 'username');
				deepEqual(res.collection.searchFields, {_id: 'number', fn: 'string', age: 'number'}, 'searchFields');
				deepEqual(res.collection.additionalSearchFields, {}, 'additionalSearchFields');
				deepEqual(res.docs.length, 2, '2 docs is the limit for toString()');
				deepEqual(res.docs[0]._id, 1, 'check _id for the first doc');
				deepEqual(res.docs[0].json.fn, 'carlos', 'check the first doc - name');
				deepEqual(res.docs[1]._id, 2, 'check _id for the second doc');
				deepEqual(res.docs[1].json.fn, 'tim', 'check the second doc - name');
				start();
			});

		})

		.fail(genericFailure);

	});//end toString(2)

	asyncTest('toString(-2)', 12, function () {

		var c;
		JSONStore.destroy().then(function (res) {
			deepEqual(res, 0, 'destroy');

			c = JSONStore.initCollection('collection123',
			{fn: 'string', age: 'number'});
			return c.promise;
		})

		.then(function (res) {
			deepEqual(res, 0, 'init');

			return c.store([{fn: 'carlos'}, {fn: 'tim'}, {fn: 'mike'}]);
		})

		.then(function (res) {
			deepEqual(res, 3, 'store');

			c.toString(-2).then(function (res) {

				deepEqual(res.collection.name, 'collection123', 'name');
				deepEqual(res.collection.username, 'jsonstore', 'username');
				deepEqual(res.collection.searchFields, {_id: 'number', fn: 'string', age: 'number'}, 'searchFields');
				deepEqual(res.collection.additionalSearchFields, {}, 'additionalSearchFields');
				deepEqual(res.docs.length, 2, '2 docs is the limit for toString()');
				deepEqual(res.docs[0]._id, 3, 'check _id for the first doc');
				deepEqual(res.docs[0].json.fn, 'mike', 'check the first doc - name');
				deepEqual(res.docs[1]._id, 2, 'check _id for the second doc');
				deepEqual(res.docs[1].json.fn, 'tim', 'check the second doc - name');
				start();
			});

		})

		.fail(genericFailure);

	});//end toString(-2)

	asyncTest('toString(2,1)', 12, function () {

		var c;
		JSONStore.destroy().then(function (res) {
			deepEqual(res, 0, 'destroy');

			c = JSONStore.initCollection('collection123567',
			{fn: 'string', age: 'number'}, {username: 'carlos'});
			return c.promise;
		})

		.then(function (res) {
			deepEqual(res, 0, 'init');

			return c.store([{fn: 'carlos'}, {fn: 'tim'}, {fn: 'mike'}]);
		})

		.then(function (res) {
			deepEqual(res, 3, 'store');

			c.toString(-2).then(function (res) {

				deepEqual(res.collection.name, 'collection123567', 'name');
				deepEqual(res.collection.username, 'carlos', 'username');
				deepEqual(res.collection.searchFields, {_id: 'number', fn: 'string', age: 'number'}, 'searchFields');
				deepEqual(res.collection.additionalSearchFields, {}, 'additionalSearchFields');
				deepEqual(res.docs.length, 2, '2 docs is the limit for toString()');
				deepEqual(res.docs[0]._id, 3, 'check _id for the first doc');
				deepEqual(res.docs[0].json.fn, 'mike', 'check the first doc - name');
				deepEqual(res.docs[1]._id, 2, 'check _id for the second doc');
				deepEqual(res.docs[1].json.fn, 'tim', 'check the second doc - name');
				start();
			});

		})

		.fail(genericFailure);

	});//end toString(2,1)
}());