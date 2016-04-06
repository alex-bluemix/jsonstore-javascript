/*global module, JSON, asyncTest, ok, start, deepEqual, notDeepEqual*/
(function () {

	'use strict';

	module('countQuery');

	asyncTest('Exact true', 4, function () {

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
			return JSONStore.get('customers').count({name: 'carlos'}, {exact: true});
		})

		.then(function (res) {
			deepEqual(res, 2, 'count result is = ' + res);
			start();
		})

		.fail(function (err) {
			ok(false, err.toString());
			start();
		});

	});

	asyncTest('Exact false', 4, function () {

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
			return JSONStore.get('customers').count({name: 'carlos'}, {exact: false});
		})

		.then(function (res) {
			deepEqual(res, 2, 'count result is = ' + res);
			start();
		})

		.fail(function (err) {
			ok(false, err.toString());
			start();
		});

	});

	asyncTest('Exact false with carlos and carlos2 should find 2', 4, function () {

		var collections = {
			customers: {
				searchFields : {name: 'string', age: 'integer'}
			}
		};

		var data = [
			{name: 'carlos', age: 1},
			{name: 'dgonz', age: 2},
			{name: 'carlos2', age: 3}
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
			return JSONStore.get('customers').count({name: 'carlos'}, {exact: false});
		})

		.then(function (res) {
			deepEqual(res, 2, 'count result is = ' + res);
			start();
		})

		.fail(function (err) {
			ok(false, err.toString());
			start();
		});

	});

	asyncTest('Exact true with carlos and carlos2 should find 1', 4, function () {

		var collections = {
			customers: {
				searchFields : {name: 'string', age: 'integer'}
			}
		};

		var data = [
			{name: 'carlos', age: 1},
			{name: 'dgonz', age: 2},
			{name: 'carlos2', age: 3}
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
			return JSONStore.get('customers').count({name: 'carlos'}, {exact: true});
		})

		.then(function (res) {
			deepEqual(res, 1, 'count result is = ' + res);
			start();
		})

		.fail(function (err) {
			ok(false, err.toString());
			start();
		});

	});

	asyncTest('Not passing the options object, assumes exact false', 4, function () {

		var collections = {
			customers: {
				searchFields : {name: 'string', age: 'integer'}
			}
		};

		var data = [
			{name: 'carlos', age: 1},
			{name: 'dgonz', age: 2},
			{name: 'carlos2', age: 3}
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
			return JSONStore.get('customers').count({name: 'carlos'});
		})

		.then(function (res) {
			deepEqual(res, 2, 'count result is = ' + res);
			start();
		})

		.fail(function (err) {
			ok(false, err.toString());
			start();
		});

	});

	asyncTest('Passing null as the options, exact should be assumed false', 4, function () {

		var collections = {
			customers: {
				searchFields : {name: 'string', age: 'integer'}
			}
		};

		var data = [
			{name: 'carlos', age: 1},
			{name: 'dgonz', age: 2},
			{name: 'carlos2', age: 3}
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
			return JSONStore.get('customers').count({name: 'carlos'}, null);
		})

		.then(function (res) {
			deepEqual(res, 2, 'count result is = ' + res);
			start();
		})

		.fail(function (err) {
			ok(false, err.toString());
			start();
		});

	});

	asyncTest('Passing null as the query, should count everything', 4, function () {

		var collections = {
			customers: {
				searchFields : {name: 'string', age: 'integer'}
			}
		};

		var data = [
			{name: 'carlos', age: 1},
			{name: 'dgonz', age: 2},
			{name: 'carlos2', age: 3}
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
			return JSONStore.get('customers').count(null);
		})

		.then(function (res) {
			deepEqual(res, 3, 'count result is = ' + res);
			start();
		})

		.fail(function (err) {
			ok(false, err.toString());
			start();
		});

	});

	asyncTest('Doing a count on two search fields 1', 4, function () {

		var collections = {
			customers: {
				searchFields : {name: 'string', age: 'integer'}
			}
		};

		var data = [
			{name: 'carlos', age: 1},
			{name: 'dgonz', age: 2},
			{name: 'carlos2', age: 3}
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
			return JSONStore.get('customers').count({name: 'carlos', age: 1});
		})

		.then(function (res) {
			deepEqual(res, 1, 'count result is = ' + res);
			start();
		})

		.fail(function (err) {
			ok(false, err.toString());
			start();
		});

	});

	asyncTest('Doing a count on two search fields 2 fuzzy', 4, function () {

		var collections = {
			customers: {
				searchFields : {name: 'string', age: 'integer'}
			}
		};

		var data = [
			{name: 'carlos222222', age: 33},
			{name: 'dgonz', age: 2},
			{name: 'carlos2', age: 33}
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
			return JSONStore.get('customers').count({name: 'car', age: 3});
		})

		.then(function (res) {
			deepEqual(res, 2, 'count result is = ' + res);
			start();
		})

		.fail(function (err) {
			ok(false, err.toString());
			start();
		});

	});

	asyncTest('Doing a count on two search fields 2 exact', 4, function () {

		var collections = {
			customers: {
				searchFields : {name: 'string', age: 'integer'}
			}
		};

		var data = [
			{name: 'carlos222222', age: 333},
			{name: 'dgonz', age: 2},
			{name: 'carlos2', age: 33}
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
			return JSONStore.get('customers').count({name: 'carlos2', age: 33}, {exact: true});
		})

		.then(function (res) {
			deepEqual(res, 1, 'count result is = ' + res);
			start();
		})

		.fail(function (err) {
			ok(false, err.toString());
			start();
		});

	});

	asyncTest('Count on intenger + exact true', 4, function () {

		var collections = {
			customers: {
				searchFields : {name: 'string', age: 'integer'}
			}
		};

		var data = [
			{name: 'carlos222222', age: 333},
			{name: 'dgonz', age: 2},
			{name: 'carlos2', age: 33}
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
			return JSONStore.get('customers').count({age: 33}, {exact: true});
		})

		.then(function (res) {
			deepEqual(res, 1, 'count result is = ' + res);
			start();
		})

		.fail(function (err) {
			ok(false, err.toString());
			start();
		});

	});

	asyncTest('Count on number + exact true', 4, function () {

		var collections = {
			customers: {
				searchFields : {name: 'string', age: 'number'}
			}
		};

		var data = [
			{name: 'carlos222222', age: 3.0},
			{name: 'dgonz', age: 2},
			{name: 'carlos2', age: 3}
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
			return JSONStore.get('customers').count({age: 3}, {exact: true});
		})

		.then(function (res) {
			deepEqual(res, 2, 'count result is = ' + res);
			start();
		})

		.fail(function (err) {
			ok(false, err.toString());
			start();
		});

	});

	asyncTest('Count on number + exact false', 4, function () {

		var collections = {
			customers: {
				searchFields : {name: 'string', age: 'number'}
			}
		};

		var data = [
			{name: 'carlos222222', age: 3.0},
			{name: 'dgonz', age: 23},
			{name: 'carlos2', age: 3}
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
			return JSONStore.get('customers').count({age: 3}, {exact: false});
		})

		.then(function (res) {
			deepEqual(res, 3, 'count result is = ' + res);
			start();
		})

		.fail(function (err) {
			ok(false, err.toString());
			start();
		});

	});

	asyncTest('Count on boolean + exact true', 4, function () {

		var collections = {
			customers: {
				searchFields : {name: 'string', age: 'number', active: 'boolean'}
			}
		};

		var data = [
			{name: 'carlos222222', age: 3.0, active: true},
			{name: 'dgonz', age: 23, active: false},
			{name: 'carlos2', age: 3, active: true}
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
			return JSONStore.get('customers').count({active: true}, {exact: true});
		})

		.then(function (res) {
			deepEqual(res, 2, 'count result is = ' + res);
			start();
		})

		.fail(function (err) {
			ok(false, err.toString());
			start();
		});
	});

	asyncTest('Count on boolean + exact false', 4, function () {

		var collections = {
			customers: {
				searchFields : {name: 'string', age: 'number', active: 'boolean'}
			}
		};

		var data = [
			{name: 'carlos222222', age: 3.0, active: true},
			{name: 'dgonz', age: 23, active: false},
			{name: 'carlos2', age: 3, active: true}
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
			return JSONStore.get('customers').count({active: true}, {exact: false});
		})

		.then(function (res) {
			deepEqual(res, 2, 'count result is = ' + res);
			start();
		})

		.fail(function (err) {
			ok(false, err.toString());
			start();
		});

	});

	asyncTest('Count on boolean + exact true + search for num 1 instead of true', 4, function () {

		var collections = {
			customers: {
				searchFields : {name: 'string', age: 'number', active: 'boolean'}
			}
		};

		var data = [
			{name: 'carlos222222', age: 3.0, active: true},
			{name: 'dgonz', age: 23, active: false},
			{name: 'carlos2', age: 3, active: true}
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
			return JSONStore.get('customers').count({active: 1}, {exact: true});
		})

		.then(function (res) {
			deepEqual(res, 2, 'count result is = ' + res);
			start();
		})

		.fail(function (err) {
			ok(false, err.toString());
			start();
		});

	});

	asyncTest('Count on boolean + exact false + search for num 1 instead of true', 4, function () {

		var collections = {
			customers: {
				searchFields : {name: 'string', age: 'number', active: 'boolean'}
			}
		};

		var data = [
			{name: 'carlos222222', age: 3.0, active: true},
			{name: 'dgonz', age: 23, active: false},
			{name: 'carlos2', age: 3, active: true}
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
			return JSONStore.get('customers').count({active: 1}, {exact: false});
		})

		.then(function (res) {
			deepEqual(res, 2, 'count result is = ' + res);
			start();
		})

		.fail(function (err) {
			ok(false, err.toString());
			start();
		});

	});

	asyncTest('Use onSuccess and onFailure callbacks', 4, function () {

		var collections = {
			customers: {
				searchFields : {name: 'string', age: 'number', active: 'boolean'}
			}
		};

		var data = [
			{name: 'carlos222222', age: 3.0, active: true},
			{name: 'dgonz', age: 23, active: false},
			{name: 'carlos', age: 3, active: true}
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
			JSONStore.get('customers').count({ name: 'carlos',  onSuccess: function (res) { deepEqual(res, 2); start(); }
			}, {exact: false});
		})


		.fail(function (err) {
			ok(false, err.toString());
			start();
		});

	});

	asyncTest('Test case sensitivity', 5, function () {

		var collections = {
			customers: {
				searchFields : {name: 'string', age: 'number', active: 'boolean'}
			}
		};

		var data = [
			{name: 'carlos222222', age: 3.0, active: true},
			{name: 'dgonz', age: 23, active: false},
			{name: 'carlos', age: 3, active: true}
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
			return JSONStore.get('customers').find({ name: 'Carlos'}, {exact: false});
		})


		.then(function (res){
			deepEqual(2, res.length, 'Testing case sensitivity with exact=false result: ' + JSON.stringify(res));
			return JSONStore.get('customers').find({ name: 'Carlos'}, {exact: true});
		})


		.then(function (res){
			deepEqual(0, res.length, 'Testing case sensitivity with exact=true result: ' + JSON.stringify(res));
			start();
		})

		.fail(function (err) {
			ok(false, err.toString());
			start();
		});

	});

	asyncTest('Test count with non-top level query', 4, function () {

		var collections = {
			customers: {
				searchFields : {name: 'string', age: 'integer', 'orders.status': 'string'}
			}
		};

		var data = [
			{name: 'carlos', age: 1, orders:[{status:'true'},{status:'false'},{status:'true'}]},
			{name: 'dgonz', age: 2, orders:[{status:'false'},{status:'true'},{status:'false'}]},
			{name: 'carlos', age: 3, orders:[{status:'false'},{status:'false'},{status:'false'}]}
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
			return JSONStore.get('customers').count({'orders.status': 'true'}, {exact: false});
		})

		.then(function (res) {
			deepEqual(res, 2, 'count result is = ' + res);
			start();
		})

		.fail(function (err) {
			ok(false, err.toString());
			start();
		});

	});


}(WL, JSON, asyncTest, ok, start, deepEqual, notDeepEqual));