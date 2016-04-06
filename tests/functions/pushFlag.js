/*global module, deepEqual, ok, start, sinon, asyncTest*/
(function () {

	'use strict';

	var len = 0,
		STORE_DEPRECATED = '[Deprecated] collection.store(doc), use collection.add(doc, {push: false}) instead.',
		REFRESH_DEPRECATED = '[Deprecated] collection.refresh(doc), use collection.replace(doc, {push: false}) instead.',
		ERASE_DEPRECATED = '[Deprecated] collection.erase(doc), use collection.remove(doc, {push: false}) instead.';
	var genericFailure = function (err) {

		ok(false, 'Error: ' + err.toString());
		console.log(err.toString());
		start();
	};

	module('Push Flags');

	asyncTest('Store', 9, function () {

		var c;

		JSONStore.destroy().then(function (res) {
			deepEqual(res, 0, 'destroy');

			c = JSONStore.initCollection('col68776', {fn: 'string'});
			return c.promise;
		})

		.then(function (res) {
			deepEqual(res, 0, 'init');
			return c.store({fn: 'carlos'});
		})

		.then(function (res) {
			deepEqual(res, 1, 'store');
			return c.pushRequiredCount();
		})

		.then(function (res) {
			deepEqual(res, 0, 'pushRequiredCount');
			return c.add({fn: 'tim'}, {push: false});
		})

		.then(function (res) {
			deepEqual(res, 1, 'add with push false');
			return c.pushRequiredCount();
		})

		.then(function (res) {
			deepEqual(res, 0, 'pushRequiredCount');
			return c.findAll();
		})

		.then(function (res) {
			deepEqual(res.length, 2, 'two docs in db');
			deepEqual(res[0].json.fn, 'carlos', 'find carlos');
			deepEqual(res[1].json.fn, 'tim', 'find tim');
			start();
		})

		.fail(genericFailure);

	});//end

	asyncTest('Refresh', 10, function () {

		var c;

		JSONStore.destroy().then(function (res) {
			deepEqual(res, 0, 'destroy');

			c = JSONStore.initCollection('col32412', {fn: 'string'});
			return c.promise;
		})

		.then(function (res) {
			deepEqual(res, 0, 'init');
			return c.add([{fn: 'carlos'}, {fn: 'tim'}], {push: false});
		})

		.then(function (res) {
			deepEqual(res, 2, 'add');
			return c.refresh(JSONStore.documentify(1, {fn: 'carlitos'}));
		})

		.then(function (res) {

			deepEqual(res, 1, 'refreshed');
			return c.pushRequiredCount();
		})

		.then(function (res) {

			deepEqual(res, 0, 'pushRequiredCount');
			return c.replace(JSONStore.documentify(2, {fn: 'timothy'}), {push: false});
		})

		.then (function (res) {

			deepEqual(res, 1, 'replace with push true');
			return c.pushRequiredCount();
		})

		.then(function (res) {

			deepEqual(res, 0, 'pushRequiredCount');
			return c.findAll();
		})

		.then(function (res) {
			deepEqual(res.length, 2, 'findAll');
			deepEqual(res[0].json.fn, 'carlitos', 'found carlitos');
			deepEqual(res[1].json.fn, 'timothy', 'found timothy');
			start();
		})

		.fail(genericFailure);

	});//end

	asyncTest('Erase', 8, function () {

		var c;

		JSONStore.destroy().then(function (res) {
			deepEqual(res, 0, 'destroy');

			c = JSONStore.initCollection('col34324', {fn: 'string'});
			return c.promise;
		})

		.then(function (res) {
			deepEqual(res, 0, 'init');
			return c.add([{fn: 'carlos'}, {fn: 'tim'}], {push: false});
		})

		.then(function (res) {
			deepEqual(res, 2, 'add');
			return c.erase({fn: 'carlos'});
		})

		.then(function (res) {

			deepEqual(res, 1, 'erase');
			return c.pushRequiredCount();
		})

		.then(function (res) {

			deepEqual(res, 0, 'pushRequiredCount');
			return c.remove({fn: 'tim'}, {push: false});
		})

		.then (function (res) {

			deepEqual(res, 1, 'removed with push true');
			return c.pushRequiredCount();
		})

		.then(function (res) {

			deepEqual(res, 0, 'pushRequiredCount');
			return c.count();
		})

		.then(function (res) {
			deepEqual(res, 0, 'count');
			start();
		})

		.fail(genericFailure);

	});//end

}());