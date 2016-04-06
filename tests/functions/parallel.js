
/* JavaScript content from tests/functions/wl.db.tests.advancedfind.js in folder common */
/*global WL, module, ok, asyncTest, deepEqual, start */
/*jshint maxparams: 7*/

if(!WL.browser) {

(function() {


	'use strict';
	//Dependencies:


	module('Parallel');

	asyncTest('Remove using parallel promises', 13 , function () {

		var data = [],
		totalData = 10,
		collections = {
			people: {
				searchFields: {name: 'string'}
			}
		};

		while(totalData--) {
			data.push({name: '' + Math.random()});
		}

		WL.JSONStore.destroy()

		.then(function (res) {
			deepEqual(res, 0, 'destroy');
			return WL.JSONStore.init(collections);
		})

		.then(function (res) {
			deepEqual(res.people.name, 'people', 'init');
			return WL.JSONStore.get('people').add(data);
		})

		.then(function (res) {
			deepEqual(res, 10, 'added');
			var promisesArr = [];
			while(res--) {
				promisesArr.push(WL.JSONStore.get('people').remove(data[res]));
			}

			return $.when.apply($, promisesArr);
		})

		.then(function () {
			var args = Array.prototype.slice.call(arguments, 0);
			var len = args.length;
			for(var i = 0; i < len; i++) {
				deepEqual(args[i][0], 1, 'removed ' + i);
			}
			start();
		})
		.fail(function (err) {
			ok(false, 'Failure is not an option: ' + JSON.stringify(err));
			start();
		});
	});

	asyncTest('Add with parallel promises', 12, function () {
		var data = [],
		totalData = 10,
		collections = {
			people: {
				searchFields: {name: 'string'}
			}
		},
		randomStr = function(){
			var abc = '0123456789abcdefghijklmnopqrstuvwxyz';
			var res = '';

			for(var j = 0; j < 5; j++){
				res += abc[(Math.random()*abc.length)];
			}
			return res;
		};

		for(var i = 0; i < 10; i++)
		{
				data.push({name: randomStr()});
		}

		WL.JSONStore.destroy()

		.then(function (res) {
			deepEqual(res, 0, 'destroy');
			return WL.JSONStore.init(collections);
		})

		.then(function (res) {
			var promisesArr = [];
			deepEqual(res.people.name, 'people', 'init');
			while(totalData--) {
				promisesArr.push(WL.JSONStore.get('people').add(data[totalData]));
			}

			return $.when.apply($, promisesArr);
		})

		.then(function () {
			var args = Array.prototype.slice.call(arguments, 0);
			var len = args.length;
			for(var i = 0; i < len; i++) {
				deepEqual(args[i][0], 1, 'added ' + i);
			}
			start();
		})

		.fail(function (err) {
			ok(false, 'Failure is not an option: ' + JSON.stringify(err));
			start();
		});

	});

	asyncTest('Replace with parallel promises', 13, function () {
		var data = [],
		totalData = 10,
		collections = {
			people: {
				searchFields: {name: 'string'}
			}
		},
		randomStr = function(){
			var abc = '0123456789abcdefghijklmnopqrstuvwxyz';
			var res = '';

			for(var j = 0; j < 5; j++){
				res += abc[Math.floor((Math.random()*abc.length))];
			}
			return res;
		};

		for(var i = 0; i < 10; i++)
		{
			var value = randomStr();
				data.push({name: value});
		}

		WL.JSONStore.destroy()

		.then(function (res) {
			deepEqual(res, 0, 'destroy');
			return WL.JSONStore.init(collections);
		})

		.then(function (res) {
			deepEqual(res.people.name, 'people', 'init');
			return WL.JSONStore.get('people').add(data);
		})

		.then(function (res) {
			var promisesArr = [];
			deepEqual(res, 10, 'added');
			for(var i = 1; i <= totalData; i++) {
				promisesArr.push(WL.JSONStore.get('people').replace({_id: i, json:  data[i-1]}));
			}

			return $.when.apply($, promisesArr);
		})

		.then(function () {
			var args = Array.prototype.slice.call(arguments, 0);
			var len = args.length;
			for(var i = 0; i < len; i++) {
				deepEqual(args[i][0], 1, 'replaced ' + i);
			}
			start();
		})

		.fail(function (err) {
			ok(false, 'Failure is not an option: ' + JSON.stringify(err));
			start();
		});

	});

	asyncTest('Change with parallel promises', 13, function () {
		var data = [],
		totalData = 10,
		collections = {
			people: {
				searchFields: {name: 'string'}
			}
		},
		randomStr = function(){
			var abc = '0123456789abcdefghijklmnopqrstuvwxyz';
			var res = '';

			for(var j = 0; j < 5; j++){
				res += abc[Math.floor((Math.random()*abc.length))];
			}
			return res;
		};

		for(var i = 0; i < 10; i++){
			data.push({name: randomStr()});
		}

		WL.JSONStore.destroy()

		.then(function (res) {
			deepEqual(res, 0, 'destroy');
			return WL.JSONStore.init(collections);
		})

		.then(function (res) {
			deepEqual(res.people.name, 'people', 'init');
			return WL.JSONStore.get('people').add(data);
		})

		.then(function (res) {
			var promisesArr = [];
			deepEqual(res, 10, 'added');
			for(var i = 1; i <= totalData; i++) {
				promisesArr.push(WL.JSONStore.get('people').change(data));
			}

			return $.when.apply($, promisesArr);
		})

		.then(function () {
			var args = Array.prototype.slice.call(arguments, 0);
			var len = args.length;
			for(var i = 0; i < len; i++) {
				deepEqual(args[i][0], 10, 'changed ' + i);
			}
			start();
		})

		.fail(function (err) {
			ok(false, 'Failure is not an option: ' + JSON.stringify(err));
			start();
		});

	});

	asyncTest('Count with parallel promises', 13, function () {
		var data = [],
		totalData = 10,
		collections = {
			people: {
				searchFields: {name: 'string'}
			}
		};

		for(var i = 0; i < 10; i++){
			data.push({name: 'nana'});
		}

		WL.JSONStore.destroy()

		.then(function (res) {
			deepEqual(res, 0, 'destroy');
			return WL.JSONStore.init(collections);
		})

		.then(function (res) {
			deepEqual(res.people.name, 'people', 'init');
			return WL.JSONStore.get('people').add(data);
		})

		.then(function (res) {
			var promisesArr = [];
			deepEqual(res, 10, 'added');
			for(var i = 1; i <= totalData; i++) {
				promisesArr.push(WL.JSONStore.get('people').count({name: 'nana'}, {exact: true}));
			}

			return $.when.apply($, promisesArr);
		})

		.then(function () {
			var args = Array.prototype.slice.call(arguments, 0);
			var len = args.length;
			for(var i = 0; i < len; i++) {
				deepEqual(args[i][0], 10, 'count ' + i);
			}
			start();
		})

		.fail(function (err) {
			ok(false, 'Failure is not an option: ' + JSON.stringify(err));
			start();
		});

	});


	asyncTest('Advanced Find with parallel promises', 13, function () {
		var data = [],
		totalData = 10,
		collections = {
			people: {
				searchFields: {id: 'integer'}
			}
		};

		for(var i = 1; i <= 10; i++){
			data.push({id: i});
		}

		WL.JSONStore.destroy()

		.then(function (res) {
			deepEqual(res, 0, 'destroy');
			return WL.JSONStore.init(collections);
		})

		.then(function (res) {
			deepEqual(res.people.name, 'people', 'init');
			return WL.JSONStore.get('people').add(data);
		})

		.then(function (res) {
			var promisesArr = [];
			deepEqual(res, 10, 'added');
			for(var i = 1; i <= totalData; i++) {
				promisesArr.push(WL.JSONStore.get('people').advancedFind([{greaterThanEquals: [{id: 5}]}]));
			}

			return $.when.apply($, promisesArr);
		})

		.then(function () {
			var args = Array.prototype.slice.call(arguments, 0);
			var len = args.length;
			for(var i = 0; i < len; i++) {
				deepEqual(args[i][0].length, 6, 'advancedFind ' + i);
			}
			start();
		})

		.fail(function (err) {
			ok(false, 'Failure is not an option: ' + JSON.stringify(err));
			start();
		});

	});

	asyncTest('Erase with parallel promises', 13, function () {
		var data = [],
		totalData = 10,
		collections = {
			people: {
				searchFields: {id: 'integer'}
			}
		};

		for(var i = 1; i <= 10; i++){
			data.push({_id: i, json: {id: i}});
		}

		WL.JSONStore.destroy()

		.then(function (res) {
			deepEqual(res, 0, 'destroy');
			return WL.JSONStore.init(collections);
		})

		.then(function (res) {
			deepEqual(res.people.name, 'people', 'init');
			return WL.JSONStore.get('people').add(data);
		})

		.then(function (res) {
			var promisesArr = [];
			deepEqual(res, 10, 'added');
			for(var i = 0; i < totalData; i++) {
				promisesArr.push(WL.JSONStore.get('people').erase(data[i]));
			}

			return $.when.apply($, promisesArr);
		})

		.then(function () {
			var args = Array.prototype.slice.call(arguments, 0);
			var len = args.length;
			for(var i = 0; i < len; i++) {
				deepEqual(args[i][0], 1, 'erase ' + i);
			}
			start();
		})

		.fail(function (err) {
			ok(false, 'Failure is not an option: ' + JSON.stringify(err));
			start();
		});

	});

	asyncTest('Find with parallel promises', 13, function () {
		var data = [],
		totalData = 10,
		collections = {
			people: {
				searchFields: {id: 'integer'}
			}
		};

		for(var i = 1; i <= 10; i++){
			data.push({id: i});
		}

		WL.JSONStore.destroy()

		.then(function (res) {
			deepEqual(res, 0, 'destroy');
			return WL.JSONStore.init(collections);
		})

		.then(function (res) {
			deepEqual(res.people.name, 'people', 'init');
			return WL.JSONStore.get('people').add(data);
		})

		.then(function (res) {
			var promisesArr = [];
			deepEqual(res, 10, 'added');
			for(var i = 0; i < totalData; i++) {
				promisesArr.push(WL.JSONStore.get('people').find({id: 1}, {exact: true}));
			}

			return $.when.apply($, promisesArr);
		})

		.then(function () {
			var args = Array.prototype.slice.call(arguments, 0);
			var len = args.length;
			for(var i = 0; i < len; i++) {
				deepEqual(args[i][0].length, 1, 'find ' + i);
			}
			start();
		})

		.fail(function (err) {
			ok(false, 'Failure is not an option: ' + JSON.stringify(err));
			start();
		});

	});

	asyncTest('FindById with parallel promises', 13, function () {
		var data = [],
		totalData = 10,
		collections = {
			people: {
				searchFields: {id: 'integer'}
			}
		};

		for(var i = 1; i <= 10; i++){
			data.push({id: i});
		}

		WL.JSONStore.destroy()

		.then(function (res) {
			deepEqual(res, 0, 'destroy');
			return WL.JSONStore.init(collections);
		})

		.then(function (res) {
			deepEqual(res.people.name, 'people', 'init');
			return WL.JSONStore.get('people').add(data);
		})

		.then(function (res) {
			var promisesArr = [];
			deepEqual(res, 10, 'added');
			for(var i = 0; i < totalData; i++) {
				promisesArr.push(WL.JSONStore.get('people').findById(i+1));
			}

			return $.when.apply($, promisesArr);
		})

		.then(function () {
			var args = Array.prototype.slice.call(arguments, 0);
			var len = args.length;
			for(var i = 0; i < len; i++) {
				deepEqual(args[i][0].length, 1, 'find ' + i);
			}
			start();
		})

		.fail(function (err) {
			ok(false, 'Failure is not an option: ' + JSON.stringify(err));
			start();
		});

	});

	asyncTest('Init with parallel promises', 4, function () {
		var data = [],
		totalData = 3,
		collection1 = {
			people: {
				searchFields: {id: 'integer'}
			}
		},
		collection2 = {
			orders: {
				searchFields: {id: 'integer'}
			}
		},
		collection3 = {
			customers: {
				searchFields: {id: 'integer'}
			}
		};


		data.push(collection1);
		data.push(collection2);
		data.push(collection3);

		WL.JSONStore.destroy()

		.then(function (res) {
			deepEqual(res, 0, 'destroy');
			var promisesArr = [];
			for(var i = 0; i < totalData; i++) {
				promisesArr.push(WL.JSONStore.init(data[i]));
			}

			return $.when.apply($, promisesArr);
		})

		.then(function (res1, res2, res3) {
			deepEqual(res1.people.name, 'people', 'init1');
			deepEqual(res2.orders.name, 'orders', 'init2');
			deepEqual(res3.customers.name, 'customers', 'init3');
			start();
		})

		.fail(function (err) {
			ok(false, 'Failure is not an option: ' + JSON.stringify(err));
			start();
		});

	});
/*
	asyncTest('Transactions (Commit) with parallel promises ', 18, function () {
		var data = [
			{name: 'carlos', age: 1},
			{name: 'dgonz', age: 2},
			{name: 'mike', age: 3}
		],
		totalData = 3,
		collections = {
			customers: {
				searchFields : {name: 'string', age: 'integer'}
			}
		};


		WL.JSONStore.destroy()

		.then(function (res) {
			deepEqual(res, 0, 'destroy');
			return WL.JSONStore.init(collections);
		})

		.then(function (res) {
			var promisesArr = [];
			deepEqual(res.customers.name, 'customers', 'init');
			promisesArr.push(WL.JSONStore.startTransaction());
			promisesArr.push(WL.JSONStore.get('customers').add(data));
			promisesArr.push(WL.JSONStore.get('customers').findAll());
			promisesArr.push(WL.JSONStore.get('customers').remove({_id: 1, json: {name: 'carlos', age: 1}}));
			promisesArr.push(WL.JSONStore.get('customers').findAll());
			return $.when.apply($, promisesArr);
		})

		.then(function () {
			var args = Array.prototype.slice.call(arguments, 0);
			deepEqual(args[0][0], 0, 'startTransaction');
			deepEqual(args[1][0], 3, 'added');
			deepEqual(args[2][0].length, 3, 'findAll1');
			deepEqual(args[2][0][0].json.name, 'carlos', 'name1a');
			deepEqual(args[2][0][1].json.name, 'dgonz', 'name2a');
			deepEqual(args[2][0][2].json.name, 'mike', 'name3a');
			deepEqual(args[2][0][0].json.age, 1, 'age1a');
			deepEqual(args[2][0][1].json.age, 2, 'age2a');
			deepEqual(args[2][0][2].json.age, 3, 'age3a');
			deepEqual(args[3][0], 1, 'removed');
			deepEqual(args[4][0].length, 2, 'findAll2');
			deepEqual(args[4][0][0].json.name, 'dgonz', 'name2b');
			deepEqual(args[4][0][1].json.name, 'mike', 'name3b');
			deepEqual(args[4][0][0].json.age, 2, 'age2b');
			deepEqual(args[4][0][1].json.age, 3, 'age3b');

			return WL.JSONStore.commitTransaction();
		})

		.then(function (res) {
			deepEqual(res, 0, 'commitTransaction');
			start();
		})

		.fail(function (err) {
			ok(false, 'Failure is not an option: ' + JSON.stringify(err));
			start();
		});

	});
*/

	/*
		RollbackTransactions uses mulitiple parallel promises (too messy)
	asyncTest('Transactions (Rollback) with parallel promises', 18, function () {
		var data = [
			{name: 'carlos', age: 1},
			{name: 'dgonz', age: 2},
			{name: 'mike', age: 3}
		],
		totalData = 3,
		collections = {
			customers: {
				searchFields : {name: 'string', age: 'integer'}
			}
		};


		WL.JSONStore.destroy()

		.then(function (res) {
			deepEqual(res, 0, 'destroy');
			return WL.JSONStore.init(collections);
		})

		.then(function (res) {
			var promisesArr = [];
			deepEqual(res.customers.name, 'customers', 'init');
			promisesArr.push(WL.JSONStore.startTransaction());
			promisesArr.push(WL.JSONStore.get('customers').add(data));
			promisesArr.push(WL.JSONStore.get('customers').findAll());
			promisesArr.push(WL.JSONStore.get('customers').remove({_id: 1, json: {name: 'carlos', age: 1}}));
			promisesArr.push(WL.JSONStore.get('customers').findAll());


			return $.when.apply($, promisesArr);
		})

		.then(function () {
			var args = Array.prototype.slice.call(arguments, 0);
			deepEqual(args[0][0], 0, 'startTransaction');
			deepEqual(args[1][0], 3, 'added');
			deepEqual(args[2][0].length, 3, 'findAll1');
			deepEqual(args[2][0][0].json.name, 'carlos', 'name1a');
			deepEqual(args[2][0][1].json.name, 'dgonz', 'name2a');
			deepEqual(args[2][0][2].json.name, 'mike', 'name3a');
			deepEqual(args[2][0][0].json.age, 1, 'age1a');
			deepEqual(args[2][0][1].json.age, 2, 'age2a');
			deepEqual(args[2][0][2].json.age, 3, 'age3a');
			deepEqual(args[3][0], 1, 'removed');
			deepEqual(args[4][0].length, 2, 'findAll2');
			deepEqual(args[4][0][0].json.name, 'dgonz', 'name2b');
			deepEqual(args[4][0][1].json.name, 'mike', 'name3b');
			deepEqual(args[4][0][0].json.age, 2, 'age2b');
			deepEqual(args[4][0][1].json.age, 3, 'age3b');

			return WL.JSONStore.rollbackTransaction();
		})

		.then(function (res) {
			deepEqual(res, 0, 'rollbackTransaction');
			return WL.JSONStore.get('customers').findAll();
		})

		.then(function (res) {
			deepEqual(res.length, 0, 'findAll3');
			start();
		})

		.fail(function (err) {
			ok(false, 'Failure is not an option: ' + JSON.stringify(err));
			start();
		});

	});

*/


/*
	Pending until JS only Implementation for FileInfo is done
	asyncTest('FileInfo with parallel promieses', 3, function () {
		var data = [],
		totalData = 10,
		collections = {
			people: {
				searchFields: {id: 'integer'}
			}
		};

		for(var i = 1; i <= 10; i++){
			data.push({id: i});
		}

		WL.JSONStore.destroy()

		.then(function (res) {
			deepEqual(res, 0, 'destroy');
			return WL.JSONStore.init(collections);
		})

		.then(function (res) {
			var promisesArr = [];
			promisesArr.push(WL.JSONStore.get('people').add(data));
			promisesArr.push(WL.JSONStore.fileInfo());

			return $.when.apply($, promisesArr);
		})

		.then(function (res1, res2) {
			deepEqual(res1[0], 10, 'added');
			deepEqual(res2[0].length, 1, 'check length');
			deepEqual(typeof res2[0][0].name, 'string', 'check file name type');
			deepEqual(res2[0][0].name, 'jsonstore.sqlite', 'check file name');
			deepEqual(typeof res2[0][0].size, 'number', 'check size type');
			ok(res2[0][0].size < 4000 && res2[0][0].size > 3000, 'jsonstore.sqlite', 'check size');
			deepEqual(typeof res2[0][0].isEncrypted, 'boolean', 'check isEncrypted type');
			deepEqual(res2[0][0].isEncrypted, false, 'check isEncrypted value');
			start();
		})

		.fail(function (err) {
			ok(false, 'Failure is not an option: ' + JSON.stringify(err));
			start();
		});

	});
*/






})();
}