/* global JQ, sinon, start, module, deepEqual, ok, asyncTest, test */

(function(jQuery) {

	'use strict';

	var $ = jQuery;

	module('Promise');

	asyncTest('Running all of the instance methods', 16, function () {

		var c = JSONStore.initCollection('col', {fn: 'string'});

		c.promise

		.then(function (res) {
			deepEqual(res, 0, 'init');
			return c.store({fn: 'carlos'});
		})

		.then(function (res) {
			deepEqual(res, 1, 'store obj');
			return c.findById(1);
		})

		.then(function (res) {
			deepEqual(res.length, 1, 'findById1');
			deepEqual(res[0].json.fn, 'carlos', 'findById2');
			return c.store([{fn: 'tim'}, {fn: 'jeremy'}]);
		})

		.then(function (res) {
			deepEqual(res, 2, 'store array');
			return c.findAll();
		})

		.then(function (res) {
			deepEqual(res.length, 3, 'store1');
			deepEqual(res[0].json.fn, 'carlos', 'store2');
			deepEqual(res[1].json.fn, 'tim', 'store3');
			deepEqual(res[2].json.fn, 'jeremy', 'store4');
			return c.replace(JSONStore.documentify(1, {fn: 'carlitos'}));
		})

		.then(function (res) {
			deepEqual(res, 1, 'replace');
			return c.findById(1);
		})

		.then(function (res) {
			deepEqual(res.length, 1, 'findById1');
			deepEqual(res[0].json.fn, 'carlitos', 'findById2');
			return c.remove({fn: 'tim'});
		})

		.then(function (res) {
			deepEqual(res, 1, 'remove query');
			return c.find({fn : 'tim'});
		})

		.then(function (res) {
			deepEqual(res.length, 0, 'find');
			return c.remove(1);
		})

		.then(function (res) {
			deepEqual(res, 1, 'remove by id');
			return c.find({fn: 'carlitos'});
		})

		.then(function (res) {
			deepEqual(res.length, 0, 'find');
			start();
		})

		.fail(function (obj) {
			ok(false, 'failure is not an option ' + obj.toString());
			start();
		});

	});//async test end


	/*
  //Note - cnandreu: Commented/removed because we no longer enforce this level of sync behavior
	asyncTest('Running initCollection with when', 3, function () {
        JSONStore.destroy();
		var c = JSONStore.initCollection('col', {fn: 'string'}),
			c2 = JSONStore.initCollection('col2', {ln: 'string'}),
			c3 = JSONStore.initCollection('col3', {mn: 'string'});

		JSONStore.initCollection('col4', {xn: 'string'}),
		JSONStore.initCollection('col5', {ln: 'string'}),
		JSONStore.initCollection('col6', {ln: 'string'}),
		JSONStore.initCollection('col7', {ln: 'string'}),
		JSONStore.initCollection('col8', {ln: 'string'}),
		JSONStore.initCollection('col9', {ln: 'string'}),
		JSONStore.initCollection('col10', {ln: 'string'}),
		JSONStore.initCollection('col11', {ln: 'string'}),
		JSONStore.initCollection('col12', {ln: 'string'});

		$.when(c.promise, c2.promise, c3.promise)

		.then( function(res, res2, res3){

			deepEqual(res[0], 0, 'init c should be 0');
			deepEqual(res2[0], 0, 'init c2 should be 0');
			deepEqual(res3[0], 0, 'init c3 should be 0');
			start();
		});

	});//async test end

  //Note - cnandreu: Commented/removed because we no longer enforce this level of sync behavior
	asyncTest('Running initCollection with when and security', 12, function () {

        JSONStore.destroy();
		var c = JSONStore.initCollection('xcol', {fn: 'string'}),
			c2 = JSONStore.initCollection('xcol2', {ln: 'string'}),
			c3 = JSONStore.initCollection('xcol3', {mn: 'string'});

		JSONStore.initCollection('xcol4', {xn: 'string'}),
		JSONStore.initCollection('xcol5', {ln: 'string'}),
		JSONStore.initCollection('xcol6', {ln: 'string'}),
		JSONStore.initCollection('xcol7', {ln: 'string'}),
		JSONStore.initCollection('xcol8', {ln: 'string'}),
		JSONStore.initCollection('xcol9', {ln: 'string'}),
		JSONStore.initCollection('xcol10', {ln: 'string'}),
		JSONStore.initCollection('xcol11', {ln: 'string'}),
		JSONStore.initCollection('xcol12', {ln: 'string'});

		$.when(c.promise, c2.promise, c3.promise)

		.then( function(res, res2, res3){

			deepEqual(res[0], 0, 'init c should be 0');
			deepEqual(res2[0], 0, 'init c2 should be 0');
			deepEqual(res3[0], 0, 'init c3 should be 0');
			deepEqual(res[0], 0, 'init c4 should be 0');
			deepEqual(res[0], 0, 'init c5 should be 0');
			deepEqual(res[0], 0, 'init c6 should be 0');
			deepEqual(res[0], 0, 'init c7 should be 0');
			deepEqual(res[0], 0, 'init c8 should be 0');
			deepEqual(res[0], 0, 'init c9 should be 0');
			deepEqual(res[0], 0, 'init c10 should be 0');
			deepEqual(res[0], 0, 'init c11 should be 0');
			deepEqual(res[0], 0, 'init c12 should be 0');
			start();
		});

	});//async test end
*/

	asyncTest('fail for findById ', 6, function () {

		var name = 'col29',
			c = JSONStore.initCollection(name, {fn: 'string'});

		c.promise

		.then(function (res) {
			deepEqual(res, 0, 'init');
			return c.store({fn: 'carlos'});
		})

		.then(function (res) {
			deepEqual(res, 1, 'store obj');
			return c.findById('abc');
		})
		.fail(function(error){
			deepEqual(error.err, 27, 'expecting 27');
			deepEqual(error.src, 'findById', 'expecting findById');
			deepEqual(error.col, name, 'expecting ' + name);
			deepEqual(error.usr, 'jsonstore', 'expecting default user');
			start();
		});

	});//async test end

	asyncTest('fail for find ', 6, function () {
		var name = 'col3',
			c = JSONStore.initCollection(name, {fn: 'string'});

		c.promise

		.then(function (res) {
			deepEqual(res, 0, 'init');
			return c.store({fn: 'carlos'});
		})

		.then(function (res) {
			deepEqual(res, 1, 'store obj');
			return c.find(1);
		})
		.fail(function(error){
			deepEqual(error.err, 6, 'expecting 6');
			deepEqual(error.src, 'find', 'expecting find');
			deepEqual(error.col, name, 'expecting ' + name);
			deepEqual(error.usr, 'jsonstore', 'expecting default user');
			start();
		});

	});//async test end


	asyncTest('fail for store', 5, function () {
		var name = 'col4',
			c = JSONStore.initCollection(name, {fn: 'string'});

		c.promise

		.then(function (res) {
			deepEqual(res, 0, 'init');
			return c.store('abc');
		})

		.fail(function(error){
			deepEqual(error.err, 10, 'expecting 10');
			deepEqual(error.src, 'store', 'expecting store');
			deepEqual(error.col, name, 'expecting ' + name);
			deepEqual(error.usr, 'jsonstore', 'expecting default user');
			start();
		});

	});//async test end

	asyncTest('fail for store1', 5, function () {
		var name = 'col5',
			c = JSONStore.initCollection(name, {fn: 'string'});

		c.promise

		.then(function (res) {
			deepEqual(res, 0, 'init');
			return c.store(1);
		})

		.fail(function(error){
			deepEqual(error.err, 10, 'expecting 10');
			deepEqual(error.src, 'store', 'expecting store');
			deepEqual(error.col, name, 'expecting ' + name);
			deepEqual(error.usr, 'jsonstore', 'expecting default user');
			start();
		});

	});//async test end

	asyncTest('fail for replace', 6, function () {
		var name = 'col6',
			c = JSONStore.initCollection(name, {fn: 'string'});

		c.promise

		.then(function (res) {
			deepEqual(res, 0, 'init');
			return c.store({fn: 'tim'});
		})

		.then(function (res) {
			deepEqual(res, 1, 'store 1');
			return c.replace({fn: 'tim'});
		})

		.fail(function(error){

			deepEqual(error.err, 10, 'expecting 10');
			deepEqual(error.src, 'replace', 'expecting store');
			deepEqual(error.col, name, 'expecting ' + name);
			deepEqual(error.usr, 'jsonstore', 'expecting default user');
			start();
		});

	});//async test end


	asyncTest('fail for remove fail', 6, function () {
		var name = 'col7',
			c = JSONStore.initCollection(name, {fn: 'string'});

		c.promise

		.then(function (res) {
			deepEqual(res, 0, 'init');
			return c.store({fn: 'tim'});
		})

		.then(function (res) {
			deepEqual(res, 1, 'store 1');
			return c.remove('abc');
		})

		.fail(function(error){
			deepEqual(error.err, 10, 'expecting 10');
			deepEqual(error.src, 'remove', 'expecting store');
			deepEqual(error.col, name, 'expecting ' + name);
			deepEqual(error.usr, 'jsonstore', 'expecting default user');
			start();
		});

	});//async test end


	//Ensure you can get to a bunch-o-collections assuming the first
	//one is opened with a password

	asyncTest('open first collecition with pw, rest without', 4, function(){
		var opts = {username: 'tjr', password: 'seekrit'},
		c1,
		c2;

		JSONStore.destroy().then(function(){
			opts = {username: 'tjr', password: 'seekrit', localKeyGen: true};
			c1 = JSONStore.initCollection('pwTst1', {fn: 'string'}, opts);
			return c1.promise;
		})

		.then(function(res){
			deepEqual(res, 0, 'provisioned new collection');
			delete opts.password; //remove the password object
			deepEqual(typeof opts.password, 'undefined', 'opts should no longer have a password field!');
			c2 = JSONStore.initCollection('pwTst2', {fn: 'string'}, opts );
			return c2.promise;
		})

		.then(function(res){
			deepEqual(res, 0, 'provisioned new collection c2');
			return JSONStore.closeAll();
		})

		.then(function(res){
			deepEqual(res, 0, 'closeAll worked');
			start();
		})

		.fail(function(err){
			ok(false, 'should not get error callback!' + err.toString());
      start();
		});


	}); //end asyncTest

})(JQ);