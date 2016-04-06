/*global module,  deepEqual, ok, start, asyncTest,  sinon, notDeepEqual*/
/*jshint maxparams: 7*/



function iOSversion() {
	return /iP(hone|od|ad)/.test(navigator.platform)
}

(function () {

	'use strict';

	var jstore = JSONStore,
	check = JSONStoreUtil.check;


	var failureCallback = function (err) {
		ok(false, err.toString());
		start();
	};

	module('init');

	asyncTest('Init without user/pass', 12, function () {

		var collections = {

			customers : {
				searchFields : {fn: 'string', age: 'number'},
				adapter : {name: 'myAdapter'}
			},

			orders: {
				searchFields : {name: 'string', stock: 'boolean'}
			}

		};

		jstore.destroy()

		.then(function (res) {
			deepEqual(res, 0, 'destroy');

			return jstore.init(collections);
		})

		.then(function (res) {

			deepEqual(res.customers.name, 'customers', 'correct name customers');
			deepEqual(res.customers.adapter.name, 'myAdapter', 'correct adapter');
			deepEqual(res.orders.name, 'orders', 'correct name orders');
			deepEqual(typeof res.orders.adapter, 'undefined', 'correct adapter');

			return jstore.get('customers').add({fn: 'carlos'});
		})

		.then(function (res) {

			deepEqual(res, 1, 'stored 1');

			return jstore.get('orders').add([{name: 'hello'}, {name: 'hey'}]);
		})

		.then(function (res) {

			deepEqual(res, 2, 'stored 2');

			return jstore.get('customers').findAll();
		})

		.then(function (res) {
			deepEqual(res.length, 1, 'findAll');
			deepEqual(res[0].json.fn, 'carlos');

			return jstore.get('orders').findAll();
		})

		.then(function (res) {
			deepEqual(res.length, 2, 'findAll2');
			deepEqual(res[0].json.name, 'hello', 'findAll2-name1');
			deepEqual(res[1].json.name, 'hey', 'findAll2-name1');
			start();
		})

		.fail(failureCallback);

	});

	asyncTest('Init WITH user/pass', 14, function () {

		var collections = {

			customers : {
				searchFields : {fn: 'string', age: 'number'},
				adapter : {name: 'myAdapter'}
			},

			orders: {
				searchFields : {name: 'string', stock: 'boolean'}
			}

		};

		var options = {
			username: 'carlos',
			password: '123'
		};

		jstore.destroy()

		.then(function (res) {
			deepEqual(res, 0, 'destroy');
			return jstore.init(collections, options);
		})

		.then(function (res) {

			deepEqual(res.customers.name, 'customers', 'correct name customers');
			deepEqual(res.customers.adapter.name, 'myAdapter', 'correct adapter');
			deepEqual(res.orders.name, 'orders', 'correct name orders');
			deepEqual(typeof res.orders.adapter, 'undefined', 'correct adapter');

			return jstore.get('customers').add({fn: 'carlos'});
		})

		.then(function (res) {

			deepEqual(res, 1, 'stored 1');

			return jstore.get('orders').add([{name: 'hello'}, {name: 'hey'}]);
		})

		.then(function (res) {

			deepEqual(res, 2, 'stored 2');

			return jstore.get('customers').findAll();
		})

		.then(function (res) {
			deepEqual(res.length, 1, 'findAll');
			deepEqual(res[0].json.fn, 'carlos');

			return jstore.get('orders').findAll();
		})

		.then(function (res) {
			deepEqual(res.length, 2, 'findAll2');
			deepEqual(res[0].json.name, 'hello', 'findAll2-name1');
			deepEqual(res[1].json.name, 'hey', 'findAll2-name1');
			return jstore.get('customers').find({fn: 'carlos'});
		})

		.then(function (res) {
			deepEqual(res.length, 1, 'find');
			deepEqual(res[0].json.fn, 'carlos');
			start();
		})

		.fail(failureCallback);

	});

	asyncTest('Init with 1 collection', 6, function () {

		var collections = {

			customers : {
				searchFields : {fn: 'string', age: 'number'},
				adapter : {name: 'myAdapter'}
			}
		};

		var options = {
			username: 'carlos'
		};

		jstore.destroy()

		.then(function (res) {
			deepEqual(res, 0, 'destroy');
			return jstore.init(collections, options);
		})

		.then(function (res) {

			deepEqual(res.customers.name, 'customers', 'correct name customers');
			deepEqual(res.customers.adapter.name, 'myAdapter', 'correct adapter');

			return jstore.get('customers').add({fn: 'carlos'});
		})

		.then(function (res) {

			deepEqual(res, 1, 'stored 1');

			return jstore.get('customers').findAll();
		})

		.then(function (res) {
			deepEqual(res.length, 1, 'findAll');
			deepEqual(res[0].json.fn, 'carlos');

			start();
		})

		.fail(failureCallback);

	});


	asyncTest('Init with empty collection', 2, function () {

		var collections = {

		};

		jstore.destroy()

		.then(function (res) {
			deepEqual(res, 0, 'destroy');
			return jstore.init(collections);
		})

		.then(function (res) {

			deepEqual(res, {}, 'correct result');
			start();
		})

		.fail(failureCallback);
	});

	asyncTest('Init with empty col obj', 2, function () {

		var collections = {
			customers : {
			}
		};

		jstore.destroy()

		.then(function (res) {
			deepEqual(res, 0, 'destroy');
			return jstore.init(collections);
		})

		.then(function (res) {

			deepEqual(typeof res.searchFields, 'undefined', 'correct result');
			start();
		})

		.fail(failureCallback);
	});

	asyncTest('Init with empty searchFields', 2, function () {

		var collections = {
			customers : {
				searchFields: {}
			}
		};

		jstore.destroy()

		.then(function (res) {
			deepEqual(res, 0, 'destroy');
			return jstore.init(collections);
		})

		.then(function (res) {

			deepEqual(typeof res.searchFields, 'undefined', 'correct result');
			start();
		})

		.fail(failureCallback);
	});

	asyncTest('Init with invalid searchFields', 2, function () {

		var collections = {
			customers : {
				searchFields: {hello: 'string123'}
			}
		};

		jstore.destroy()

		.then(function (res) {
			deepEqual(res, 0, 'destroy');
			return jstore.init(collections);
		})

		.then(function () {

			ok(false, 'failed invalid searchFields tests');
			start();
		})

		.fail(function (res) {
			deepEqual(res.err, -12, '-12 error code');
			start();
		});
	});

	asyncTest('Init twice, clear true', 18, function () {

		var collections1 = {
			customers : {
				searchFields: {fn: 'string'}
			},
			orders : {
				searchFields: {name: 'string'}
			}
		};

		var collections2 = {
			games : {
				searchFields: {item: 'string'}
			},
			toys : {
				searchFields: {tag: 'string'}
			}
		};

		jstore.destroy()

		.then(function (res) {
			deepEqual(res, 0, 'destroy');
			return jstore.init(collections1);
		})

		.then(function (res) {
			deepEqual(res.customers.name, 'customers', 'right name customers');
			deepEqual(res.orders.name, 'orders', 'right name orders');

			return jstore.get('customers').add({fn: 'carlos'});
		})

		.then(function (res) {
			deepEqual(res, 1, 'added 1');

			return jstore.get('customers').findAll();
		})

		.then(function (res) {
			deepEqual(res.length, 1, 'findAll');
			deepEqual(res[0].json.fn, 'carlos', 'right data');

			return jstore.get('orders').add({name: 'myItem'});
		})

		.then(function (res) {
			deepEqual(res, 1, 'add');

			return jstore.get('orders').findById(1);
		})

		.then(function (res) {
			deepEqual(res.length, 1, 'found 1');
			deepEqual(res[0].json.name, 'myItem', 'right item name');

			return jstore.init(collections2, {clear: true});
		})

		.then(function (res) {
			deepEqual(res.games.name, 'games', 'right name games');
			deepEqual(res.toys.name, 'toys', 'right name toys');
			deepEqual(res.customers, undefined, 'collection cleared 1');
			deepEqual(res.orders, undefined, 'collection cleared 2');

			return jstore.get('games').add([{item: 'myGame'}]);
		})

		.then(function (res) {
			deepEqual(res, 1, '1 game stored');

			deepEqual(jstore.get('customers'), undefined, 'customers instance removed');
			deepEqual(jstore.get('orders'), undefined, 'orders instance removed');

			return jstore.get('games').find({item: 'myGame'});
		})

		.then(function (res) {
			deepEqual(res.length, 1, 'found 1 game');
			deepEqual(res[0].json.item, 'myGame', 'found the right game');

			start();
		})


		.fail(failureCallback);
	});

	asyncTest('Init twice, clear false', 20, function () {

		var collections1 = {
			customers : {
				searchFields: {fn: 'string'}
			},
			orders : {
				searchFields: {name: 'string'}
			}
		};

		var collections2 = {
			games : {
				searchFields: {item: 'string'}
			},
			toys : {
				searchFields: {tag: 'string'}
			}
		};

		jstore.destroy()

		.then(function (res) {
			deepEqual(res, 0, 'destroy');
			return jstore.init(collections1);
		})

		.then(function (res) {
			deepEqual(res.customers.name, 'customers', 'right name customers');
			deepEqual(res.orders.name, 'orders', 'right name orders');

			return jstore.get('customers').add({fn: 'carlos'});
		})

		.then(function (res) {
			deepEqual(res, 1, 'added 1');

			return jstore.get('customers').findAll();
		})

		.then(function (res) {
			deepEqual(res.length, 1, 'findAll');
			deepEqual(res[0].json.fn, 'carlos', 'right data');

			return jstore.get('orders').add({name: 'myItem'});
		})

		.then(function (res) {
			deepEqual(res, 1, 'add');

			return jstore.get('orders').findById(1);
		})

		.then(function (res) {
			deepEqual(res.length, 1, 'found 1');
			deepEqual(res[0].json.name, 'myItem', 'right item name');

			return jstore.init(collections2);
		})

		.then(function (res) {
			deepEqual(res.games.name, 'games', 'right name games');
			deepEqual(res.toys.name, 'toys', 'right name toys');
			deepEqual(res.customers.name, 'customers', 'collection cleared 1');
			deepEqual(res.orders.name, 'orders', 'collection cleared 2');

			return jstore.get('games').add([{item: 'myGame'}]);
		})

		.then(function (res) {
			deepEqual(res, 1, '1 game stored');

			deepEqual(jstore.get('customers').name, 'customers', 'customers instance found');
			deepEqual(jstore.get('orders').name, 'orders', 'orders instance found');

			return jstore.get('games').find({item: 'myGame'});
		})

		.then(function (res) {
			deepEqual(res.length, 1, 'found 1 game');
			deepEqual(res[0].json.item, 'myGame', 'found the right game');

			return jstore.get('customers').findAll();
		})

		.then(function (res) {
			deepEqual(res.length, 1, 'findAll');
			deepEqual(res[0].json.fn, 'carlos', 'right data');

			start();
		})

		.fail(failureCallback);
	});

	asyncTest('Check closeAll clears instances', 8, function () {

		var collections = {
			customers : {
				searchFields: {fn: 'string'}
			},
			orders : {
				searchFields: {active: 'boolean'}
			}
		};

		jstore.destroy()

		.then(function (res) {
			deepEqual(res, 0, 'destroy');
			return jstore.init(collections);
		})

		.then(function (res) {

			deepEqual(res.customers.name, 'customers', 'right name customers');
			deepEqual(res.orders.name, 'orders', 'right name orders');

			deepEqual(jstore.get('customers').name, 'customers', 'customers instance found');
			deepEqual(jstore.get('orders').name, 'orders', 'orders instance found');

			return jstore.closeAll();
		})

		.then(function (res) {

			deepEqual(res, 0, 'closeAll');
			deepEqual(jstore.get('customers'), undefined, 'customers instance removed');
			deepEqual(jstore.get('orders'), undefined, 'orders instance removed');

			start();
		})

		.fail(failureCallback);
	});

	asyncTest('Check destroy clears instances', 8, function () {

		var collections = {
			customers : {
				searchFields: {fn: 'string'}
			},
			orders : {
				searchFields: {active: 'boolean'}
			}
		};

		jstore.destroy()

		.then(function (res) {
			deepEqual(res, 0, 'destroy');
			return jstore.init(collections);
		})

		.then(function (res) {

			deepEqual(res.customers.name, 'customers', 'right name customers');
			deepEqual(res.orders.name, 'orders', 'right name orders');

			deepEqual(jstore.get('customers').name, 'customers', 'customers instance found');
			deepEqual(jstore.get('orders').name, 'orders', 'orders instance found');

			return jstore.destroy();
		})

		.then(function (res) {

			deepEqual(res, 0, 'destroy');
			deepEqual(jstore.get('customers'), undefined, 'customers instance removed');
			deepEqual(jstore.get('orders'), undefined, 'orders instance removed');

			start();
		})

		.fail(failureCallback);
	});

	asyncTest('Check compatibility with initCollection', 16, function () {

		var collections = {
			customers : {
				searchFields: {fn: 'string'}
			},
			orders : {
				searchFields: {active: 'boolean'}
			}
		};

		var usersCollection;

		jstore.destroy()

		.then(function (res) {
			deepEqual(res, 0, 'destroy');
			return jstore.init(collections);
		})

		.then(function (res) {

			deepEqual(res.customers.name, 'customers', 'right name customers');
			deepEqual(res.orders.name, 'orders', 'right name orders');

			deepEqual(jstore.get('customers').name, 'customers', 'customers instance found');
			deepEqual(jstore.get('orders').name, 'orders', 'orders instance found');

			usersCollection = jstore.initCollection('users', {id: 'number'});

			return usersCollection.promise;
		})

		.then(function (res) {

			deepEqual(res, 0, 'init collection');

			deepEqual(jstore.get('customers').name, 'customers', 'customers instance found');
			deepEqual(jstore.get('orders').name, 'orders', 'orders instance found');

			deepEqual(usersCollection.name, 'users', 'right users collection name');

			var p1 = usersCollection.add([{id: 999}, {id:123}]);
			var p2 = jstore.get('orders').add({active: false});

			return JQ.when(p1, p2);
		})

		.then(function (res1, res2) {

			deepEqual(res1[0], 2, 'add users');
			deepEqual(res2[0], 1, 'add orders');

			var p3 = usersCollection.findAll();
			var p4 = jstore.get('orders').find({active: false});

			return JQ.when(p3, p4);
		})

		.then(function (res1, res2) {
			deepEqual(res1[0].length, 2, 'two users');
			deepEqual(res1[0][0].json.id, 999, 'found right user 1');
			deepEqual(res1[0][1].json.id, 123, 'found right user 2');

			deepEqual(res2[0].length, 1, 'one order');
			deepEqual(res2[0][0].json.active, false, 'right active status');
			start();
		})

		.fail(failureCallback);
	});

	asyncTest('Pass no searchFields to the second collection', 7, function () {

		var collections = {
			customers : {
				searchFields: {fn: 'string'}
			},
			orders : {

			}
		};

		jstore.destroy()

		.then(function (res) {
			deepEqual(res, 0, 'destroy');
			return jstore.init(collections);
		})

		.then(function (res) {

			deepEqual(res.customers.name, 'customers', 'right name customers');
			deepEqual(res.orders.name, 'orders', 'right name orders');

			deepEqual(jstore.get('customers').name, 'customers', 'customers instance found');
			deepEqual(jstore.get('orders').name, 'orders', 'orders instance found');

			deepEqual(jstore.get('customers').searchFields, {fn: 'string'}, 'correct SF customers');
			deepEqual(jstore.get('orders').searchFields, {}, 'correct SF orders');

			start();
		})

		.fail(failureCallback);
	});

	asyncTest('Pass no-non obj to init', 8, function () {

		jstore.destroy()

		.then(function (res) {
			deepEqual(res, 0, 'destroy');
			return jstore.init(null);
		})

		.then(function (res) {

			deepEqual(res, {}, 'No collections init - null');
			return jstore.init(true);
		})

		.then(function (res) {

			deepEqual(res, {}, 'No collections init - bool');
			return jstore.init({});
		})

		.then(function (res) {

			deepEqual(res, {}, 'No collections init - empty obj');
			return jstore.init([]);
		})

		.then(function (res) {

			deepEqual(res, {}, 'No collections init - empty array');
			return jstore.init([1,2,3]);
		})

		.then(function (res) {

			deepEqual(res, {}, 'No collections init - populated array');
			return jstore.init(function(){return 'hello';});
		})

		.then(function (res) {

			deepEqual(res, {}, 'No collections init - function');
			return jstore.init(23423);
		})

		.then(function (res) {

			deepEqual(res, {}, 'No collections init - num');
			start();
		})

		.fail(failureCallback);
	});

	asyncTest('Valid addSF', 9, function () {

		var collections = {
			customers : {
				searchFields: {fn: 'string'},
				additionalSearchFields : {fnn: 'integer'}
			},
			orders : {
				searchFields: {name: 'string'},
				additionalSearchFields : {namee: 'number'}
			}
		};

		jstore.destroy()

		.then(function (res) {
			deepEqual(res, 0, 'destroy');
			return jstore.init(collections);
		})

		.then(function (res) {

			deepEqual(res.customers.name, 'customers', 'right name customers');
			deepEqual(res.orders.name, 'orders', 'right name orders');

			deepEqual(jstore.get('customers').name, 'customers', 'customers instance found');
			deepEqual(jstore.get('orders').name, 'orders', 'orders instance found');

			deepEqual(jstore.get('customers').searchFields, {fn: 'string'}, 'correct SF customers');
			deepEqual(jstore.get('orders').searchFields, {name: 'string'}, 'correct SF orders');

			deepEqual(jstore.get('customers').additionalSearchFields, {fnn: 'integer'}, 'correct ASF customers');
			deepEqual(jstore.get('orders').additionalSearchFields, {namee: 'number'}, 'correct ASF orders');

			start();
		})

		.fail(failureCallback);
	});

	asyncTest('same key for customer SF', 5, function () {

		var collections = {
			customers : {
				searchFields: {fn: 'string'},
				additionalSearchFields : {fn: 'integer'}
			},
			orders : {
				searchFields: {name: 'string'},
				additionalSearchFields : {namee: 'number'}
			}
		};

		jstore.destroy()

		.then(function (res) {
			deepEqual(res, 0, 'destroy');
			return jstore.init(collections);
		})

		.then(function (res) {

			ok(false, JSON.stringify(res));
			ok(false, 'failed becuase of duplicate searchFields+ASF');

			start();
		})

		.fail(function (res) {
			deepEqual(res.err, 22, 'err code');
			deepEqual(res.msg, 'INVALID_SEARCH_FIELD', 'msg');
			deepEqual(res.src, 'initCollection', 'src');
			deepEqual(res.usr, 'jsonstore', 'usr');
			start();
		});

	});

	asyncTest('Orders uses the same key for SF and ASF', 5, function () {

		var collections = {
			customers : {
				searchFields: {fn: 'string'},
				additionalSearchFields : {fnn: 'integer'}
			},
			orders : {
				searchFields: {name: 'string'},
				additionalSearchFields : {name: 'number'}
			}
		};

		jstore.destroy()

		.then(function (res) {
			deepEqual(res, 0, 'destroy');
			return jstore.init(collections);
		})

		.then(function (res) {

			ok(false, JSON.stringify(res));
			ok(false, 'failed becuase of duplicate searchFields+ASF');

			start();
		})

		.fail(function (res) {
			deepEqual(res.err, 22, 'err code');
			deepEqual(res.msg, 'INVALID_SEARCH_FIELD', 'msg');
			deepEqual(res.src, 'initCollection', 'src');
			deepEqual(res.usr, 'jsonstore', 'usr');
			start();
		});

	});

	asyncTest('Passing non simple obj to addSF', 5, function () {

		var collections = {
			customers : {
				searchFields: {fn: 'string'},
				additionalSearchFields : {fnn: 'integer'}
			},
			orders : {
				searchFields: {name: 'string'},
				additionalSearchFields : {name: 'number', hello: [12,3,42,{hey: 'fsdf'}]}
			}
		};

		jstore.destroy()

		.then(function (res) {
			deepEqual(res, 0, 'destroy');
			return jstore.init(collections);
		})

		.then(function (res) {

			ok(false, JSON.stringify(res));
			ok(false, 'failed becuase of duplicate searchFields+ASF');

			start();
		})

		.fail(function (res) {
			deepEqual(res.err, 6, 'err code');
			deepEqual(res.msg, 'BAD_PARAMETER_EXPECTED_SIMPLE_OBJECT', 'msg');
			deepEqual(res.src, 'initCollection', 'src');
			deepEqual(res.usr, 'jsonstore', 'usr');
			start();
		});

	});

	asyncTest('Calling init twice same collections', 11, function () {

		var collections = {
			customers : {
				searchFields: {fn: 'string'}
			},
			orders : {
				searchFields: {name: 'string'}
			}
		};

		jstore.destroy()

		.then(function (res) {
			deepEqual(res, 0, 'destroy');
			return jstore.init(collections);
		})

		.then(function (res) {

			deepEqual(res.customers.name, 'customers', 'right name customers');
			deepEqual(res.orders.name, 'orders', 'right name orders');

			deepEqual(jstore.get('customers').name, 'customers', 'customers instance found');
			deepEqual(jstore.get('orders').name, 'orders', 'orders instance found');

			deepEqual(check.countKeys(res), 2, 'right num of keys');

			return jstore.init(collections);
		})

		.then(function (res) {

			deepEqual(res.customers.name, 'customers', 'right name customers');
			deepEqual(res.orders.name, 'orders', 'right name orders');

			deepEqual(jstore.get('customers').name, 'customers', 'customers instance found');
			deepEqual(jstore.get('orders').name, 'orders', 'orders instance found');

			deepEqual(check.countKeys(res), 2, 'right num of keys');

			start();
		})

		.fail(failureCallback);

	});

	asyncTest('Calling init twice changing SF', 10, function () {

		var collections1 = {
			customers : {
				searchFields: {fn: 'string'}
			},
			orders : {
				searchFields: {name: 'string'}
			}
		};

		var collections2 = {
			customers : {
				searchFields: {hello: 'string'}
			},
			orders : {
				searchFields: {name: 'string'}
			}
		};

		jstore.destroy()

		.then(function (res) {
			deepEqual(res, 0, 'destroy');
			return jstore.init(collections1);
		})

		.then(function (res) {

			deepEqual(res.customers.name, 'customers', 'right name customers');
			deepEqual(res.orders.name, 'orders', 'right name orders');

			deepEqual(jstore.get('customers').name, 'customers', 'customers instance found');
			deepEqual(jstore.get('orders').name, 'orders', 'orders instance found');

			deepEqual(check.countKeys(res), 2, 'right num of keys');

			return jstore.init(collections2);
		})

		.then(function () {

			ok(false, 'should have failed because SF are different');

			start();
		})

		.fail(function (res) {
			deepEqual(res.err, -2, 'err code');
			deepEqual(res.msg, 'PROVISION_TABLE_SEARCH_FIELDS_MISMATCH', 'msg');
			deepEqual(res.src, 'initCollection', 'src');
			deepEqual(res.usr, 'jsonstore', 'usr');
			start();
		});

	});

	//16851: Unable to init() collections with similar names in JSONStore
	asyncTest('Making sure collection with similar names work', 6, function () {

		var collections = {
				'testCollection': {
					searchFields: {}
				},
				'testCollection2': {
					searchFields: {}
				}
			};

		jstore.destroy()

		.then(function (res) {
			deepEqual(res, 0, 'destroy');
			return jstore.init(collections);
		})

		.then(function (res) {

			deepEqual(res.testCollection.name, 'testCollection', 'right name testCollection');
			notDeepEqual(typeof res.testCollection2, 'undefined', 'right name testCollection2');

			deepEqual(jstore.get('testCollection').name, 'testCollection', 'testCollection instance found');
			notDeepEqual(typeof jstore.get('testCollection2'), 'undefined', 'testCollection2 instance found');

			deepEqual(check.countKeys(res), 2, 'right num of keys');
			start();
		})

		.fail(function (res) {
			ok(false, 'failed: ' + res.toString());
			start();
		});

	});

	//Testing if the second character can be a number
	asyncTest('init with non [a-z] collection name 0', 11, function () {

		var collections = {
			'h0aaa': {
				searchFields : {fn: 'string'}
			}
		};

		JSONStore.destroy()
		.then(function (res) {
			deepEqual(res, 0, 'destroy');
			return JSONStore.init(collections);
		})

		.then(function (res) {
			deepEqual(res['h0aaa'].name, 'h0aaa', 'right collection name');
			return res['h0aaa'].add({fn: '0carlos'});
		})
		.then(function (res) {
			deepEqual(res, 1, 'added 1');
			return JSONStore.get('h0aaa').findAll();
		})
		.then(function (res) {
			deepEqual(res.length, 1, 'right len');
			deepEqual(res[0].json.fn, '0carlos');
			res[0].json.fn = '_carlos';
			return JSONStore.get('h0aaa').replace(res);
		})
		.then(function (res) {
			deepEqual(res, 1, 'repalced one');
			return JSONStore.get('h0aaa').find({fn: '_carlos'});
		})
		.then(function (res) {
			deepEqual(res.length, 1, 'len');
			deepEqual(res[0].json.fn, '_carlos', 'right name');
			return JSONStore.get('h0aaa').count();
		})
		.then(function (res) {
			deepEqual(res, 1, '1 doc in the DB');
			return JSONStore.get('h0aaa').remove(1);
		})
		.then(function (res) {
			deepEqual(res, 1, 'removed 1');
			return JSONStore.closeAll();
		})
		.then(function (res) {
			deepEqual(res, 0, 'closeAll');
			start();
		})
		.fail(failureCallback);
	});

	//Testing if the first character of the first collection name is a number
	asyncTest('init with non [a-z] collection name 1', 10, function () {

		var collections = {
			'0aaa': {
				searchFields : {fn: 'string'}
			}
		};

		JSONStore.destroy()
		.then(function (res) {
			deepEqual(res, 0, 'destroy');
			return JSONStore.init(collections);
		})

		.then(function () {
			ok(false, 'should fail');
		})
		.fail(function (err) {
			deepEqual(err.src, 'initCollection', 'src');
			deepEqual(err.err, 4, 'err');
			deepEqual(err.msg, 'BAD_PARAMETER_EXPECTED_ALPHANUMERIC_STRING', 'msg');
			deepEqual(err.col, '0aaa', 'col');
			deepEqual(err.usr, 'jsonstore', 'usr');
			deepEqual(err.doc, {}, 'doc');
			deepEqual(err.res, {}, 'res');
			notDeepEqual(err.toString(), '[object Object]', 'not default obj toString');
			deepEqual(err.toString(), JSON.stringify(err, null, ' '), 'right toString:'+JSON.stringify(err));
			start();
		});
	});

	//Testing if the first character of the first collection is a symbol
	asyncTest('init with non [a-z] collection name 2', 10, function () {

		var collections = {
			'__aaa': {
				searchFields : {fn: 'string'}
			}
		};

		JSONStore.destroy()
		.then(function (res) {
			deepEqual(res, 0, 'destroy');
			return JSONStore.init(collections);
		})

		.then(function () {
			ok(false, 'should fail');
		})
		.fail(function (err) {
			deepEqual(err.src, 'initCollection', 'src');
			deepEqual(err.err, 4, 'err');
			deepEqual(err.msg, 'BAD_PARAMETER_EXPECTED_ALPHANUMERIC_STRING', 'msg');
			deepEqual(err.col, '__aaa', 'col');
			deepEqual(err.usr, 'jsonstore', 'usr');
			deepEqual(err.doc, {}, 'doc');
			deepEqual(err.res, {}, 'res');
			notDeepEqual(err.toString(), '[object Object]', 'not default obj toString');
			deepEqual(err.toString(), JSON.stringify(err, null, ' '), 'right toString:'+JSON.stringify(err));
			start();
		});
	});

	//testing the second collection is a symbol
	asyncTest('init with non [a-z] collection name 3', 10, function () {

		var collections = {
			'aaa': {
				searchFields : {fn: 'string'}
			},
			'$aaa': {
				searchFields : {fn: 'string'}
			}
		};

		JSONStore.destroy()
		.then(function (res) {
			deepEqual(res, 0, 'destroy');
			return JSONStore.init(collections);
		})

		.then(function () {
			ok(false, 'should fail');
		})
		.fail(function (err) {
			deepEqual(err.src, 'initCollection', 'src');
			deepEqual(err.err, 4, 'err');
			deepEqual(err.msg, 'BAD_PARAMETER_EXPECTED_ALPHANUMERIC_STRING', 'msg');
			deepEqual(err.col, '$aaa', 'col');
			deepEqual(err.usr, 'jsonstore', 'usr');
			deepEqual(err.doc, {}, 'doc');
			deepEqual(err.res, {}, 'res');
			notDeepEqual(err.toString(), '[object Object]', 'not default obj toString');
			deepEqual(err.toString(), JSON.stringify(err, null, ' '), 'right toString:'+JSON.stringify(err));
			start();
		});
	});

}());

//Error code testing


(function (JSON, asyncTest, ok, start, deepEqual, notDeepEqual) {

	'use strict';

	asyncTest('init error obj', 10, function () {

		var collections = {
			users: {
				searchFields : {fn: 'hellozzz'}
			}
		};

		JSONStore.destroy()
		.then(function (res) {
			deepEqual(res, 0, 'destroy');
			return JSONStore.init(collections);
		})
		.then(function () {
			ok(false, 'should fail');
			start();
		})
		.fail(function (err) {
			deepEqual(err.src, 'initCollection', 'src');
			deepEqual(err.err, -12, 'err');
			deepEqual(err.msg, 'INVALID_SEARCH_FIELD_TYPES', 'msg');
			deepEqual(err.col, 'users', 'col');
			deepEqual(err.usr, 'jsonstore', 'usr');
			deepEqual(err.doc, {}, 'doc');
			deepEqual(err.res, {}, 'res');
			notDeepEqual(err.toString(), '[object Object]', 'not default obj toString');
			deepEqual(err.toString(), JSON.stringify(err, null, ' '), 'right toString');
			start();
		});

	});

	asyncTest('error object outside init', 10, function () {

		var collections = {
			users: {
				searchFields : {fn: 'string'}
			},
			objects : {
				searchFields : {fn: 'xxxxx'}
			}
		};

		JSONStore.destroy()
		.then(function (res) {
			deepEqual(res, 0, 'destroy');
			return JSONStore.init(collections);
		})
		.then(function () {
			ok(false, 'should fail');
			start();
		})
		.fail(function (err) {
			deepEqual(err.src, 'initCollection', 'src');
			deepEqual(err.err, -12, 'err');
			deepEqual(err.msg, 'INVALID_SEARCH_FIELD_TYPES', 'msg');
			deepEqual(err.col, 'objects', 'col');
			deepEqual(err.usr, 'jsonstore', 'usr');
			deepEqual(err.doc, {}, 'doc');
			deepEqual(err.res, {}, 'res');
			notDeepEqual(err.toString(), '[object Object]', 'not default obj toString');
			deepEqual(err.toString(), JSON.stringify(err, null, ' '), 'right toString:'+JSON.stringify(err));
			start();
		});

	});


	asyncTest('error obj inside push', 11, function () {

		var collections = {
			lololol: {
				searchFields : {fn: 'string'}
			}
		};

		JSONStore.destroy()
		.then(function (res) {
			deepEqual(res, 0, 'destroy');
			return JSONStore.init(collections);
		})

		.then(function (res) {
			deepEqual(res.lololol.name, 'lololol', 'worked');

			return res.lololol.find({asdsadas: 'asdfsdfsd'});
		})
		.fail(function (err) {
			deepEqual(err.src, 'find', 'src');
			deepEqual(err.err, 22, 'err');
			deepEqual(err.msg, 'INVALID_SEARCH_FIELD', 'msg');
			deepEqual(err.col, 'lololol', 'col');
			deepEqual(err.usr, 'jsonstore', 'usr');
			deepEqual(err.doc, {}, 'doc');
			deepEqual(err.res, {}, 'res');
			notDeepEqual(err.toString(), '[object Object]', 'not default obj toString');
			deepEqual(err.toString(), JSON.stringify(err, null, ' '), 'right toString:'+JSON.stringify(err));
			start();
		});

	});

	asyncTest('error obj outside init', 11, function () {

		var collections = {
			heyhey123: {
				searchFields : {fn: 'string'}
			}
		};

		JSONStore.destroy()
		.then(function (res) {
			deepEqual(res, 0, 'destroy');
			return JSONStore.init(collections);
		})

		.then(function (res) {
			deepEqual(res.heyhey123.name, 'heyhey123', 'worked');

			return res.heyhey123.push({asdsadas: 'asdfsdfsd'});
		})
		.fail(function (err) {
			deepEqual(err.src, 'push', 'src');
			deepEqual(err.err, 9, 'err');
			deepEqual(err.msg, 'NO_ADAPTER_LINKED_TO_COLLECTION', 'msg');
			deepEqual(err.col, 'heyhey123', 'col');
			deepEqual(err.usr, 'jsonstore', 'usr');
			deepEqual(err.doc, {}, 'doc');
			deepEqual(err.res, {}, 'res');
			notDeepEqual(err.toString(), '[object Object]', 'not default obj toString');
			deepEqual(err.toString(), JSON.stringify(err, null, ' '), 'right toString:'+JSON.stringify(err));
			start();
		});

	});

	asyncTest('key with colons - init, add, find', 5, function () {

		var data = {
				'spi_wm:wogroup' : '150000263'
			};

		var collections = {
			NameOfTheCollection: {
				searchFields : {'spi_wm:wogroup': 'string'}
			}
		};

		JSONStore.destroy()
		.then(function (res) {
			deepEqual(res, 0, 'destroy');
			return JSONStore.init(collections);
		})

		.then(function (res) {
			deepEqual(res.NameOfTheCollection.name, 'NameOfTheCollection', 'worked');

			return JSONStore.get('NameOfTheCollection').add(data);
		})

		.then(function (res) {
			deepEqual(res, 1, 'added worked');

			return JSONStore.get('NameOfTheCollection').find({'spi_wm:wogroup': '150000263'});
		})

		.then(function (res) {

			try {
				deepEqual(res.length, 1, 'found 1');
				deepEqual(res[0].json['spi_wm:wogroup'], '150000263', 'found the right item');

			} catch (e) {
				ok(false, e.toString());
			}

			start();
		})

		.fail(function (err) {
			ok(false, err.toString());
			start();
		});

	});

	asyncTest('key with colons - init, add, replace, find', 6, function () {

		var data = {
				'spi_wm:wogroup' : '150000263'
			};

		var collections = {
			NameOfTheCollection: {
				searchFields : {'spi_wm:wogroup': 'string'}
			}
		};

		JSONStore.destroy()
		.then(function (res) {
			deepEqual(res, 0, 'destroy');
			return JSONStore.init(collections);
		})

		.then(function (res) {
			deepEqual(res.NameOfTheCollection.name, 'NameOfTheCollection', 'worked');

			return JSONStore.get('NameOfTheCollection').add(data);
		})

		.then(function (res) {
			deepEqual(res, 1, 'added worked');

			var doc = {_id: 1, json: {'spi_wm:wogroup': '10101010101'}};

			return JSONStore.get('NameOfTheCollection').replace(doc);
		})

		.then(function (res) {

			deepEqual(res, 1, 'replace worked');

			return JSONStore.get('NameOfTheCollection').find({'spi_wm:wogroup': '10101010101'});
		})

		.then(function (res) {

			try {
				deepEqual(res.length, 1, 'found 1');
				deepEqual(res[0].json['spi_wm:wogroup'], '10101010101', 'found the right item');

			} catch (e) {
				ok(false, e.toString());
			}

			start();
		})

		.fail(function (err) {
			ok(false, err.toString());
			start();
		});

	});

	asyncTest('key with colons - init, add, delete, find', 5, function () {

		var data = {
			'spi_wm:wogroup' : '150000263'
		};

		var collections = {
			NameOfTheCollection: {
				searchFields : {'spi_wm:wogroup': 'string'}
			}
		};

		JSONStore.destroy()
		.then(function (res) {
			deepEqual(res, 0, 'destroy');
			return JSONStore.init(collections);
		})

		.then(function (res) {
			deepEqual(res.NameOfTheCollection.name, 'NameOfTheCollection', 'worked');

			return JSONStore.get('NameOfTheCollection').add(data);
		})

		.then(function (res) {
			deepEqual(res, 1, 'added worked');

			var doc = {_id: 1, json: {'spi_wm:wogroup' : '150000263'} };

			return JSONStore.get('NameOfTheCollection').remove(doc);
		})

		.then(function (res) {

			deepEqual(res, 1, 'remove worked');

			return JSONStore.get('NameOfTheCollection').find({'spi_wm:wogroup': '150000263'});
		})

		.then(function (res) {

			deepEqual(res.length, 0, 'found 0 as expected');

			start();
		})

		.fail(function (err) {
			ok(false, err.toString());
			start();
		});

	});

	asyncTest('key with colons 2 - init, add, find', 5, function () {

		var data = {
			':spi_wm:wogr:oup:' : 'xxxxxx'
		};

		var collections = {
			NameOfTheCollection: {
				searchFields : {':spi_wm:wogr:oup:': 'string'}
			}
		};

		JSONStore.destroy()
		.then(function (res) {
			deepEqual(res, 0, 'destroy');
			return JSONStore.init(collections);
		})

		.then(function (res) {
			deepEqual(res.NameOfTheCollection.name, 'NameOfTheCollection', 'worked');

			return JSONStore.get('NameOfTheCollection').add(data);
		})

		.then(function (res) {
			deepEqual(res, 1, 'added worked');

			return JSONStore.get('NameOfTheCollection').find({':spi_wm:wogr:oup:': 'xxxxxx'});
		})

		.then(function (res) {

			try {
				deepEqual(res.length, 1, 'found 1');
				deepEqual(res[0].json[':spi_wm:wogr:oup:'], 'xxxxxx', 'found the right item');

			} catch (e) {
				ok(false, e.toString());
			}

			start();
		})

		.fail(function (err) {
			ok(false, err.toString());
			start();
		});

	});

	asyncTest('key with colons 2 - init, add, find data with colons', 10, function () {

		var data = {
			':spi_wm:wogr:oup:' : ':xx:xx:xx:'
		};

		var collections = {
			NameOfTheCollection: {
				searchFields : {':spi_wm:wogr:oup:': 'string'}
			}
		};

		JSONStore.destroy()
		.then(function (res) {
			deepEqual(res, 0, 'destroy');
			return JSONStore.init(collections);
		})

		.then(function (res) {
			deepEqual(res.NameOfTheCollection.name, 'NameOfTheCollection', 'worked');

			return JSONStore.get('NameOfTheCollection').add(data);
		})

		.then(function (res) {
			deepEqual(res, 1, 'added worked');

			return JSONStore.get('NameOfTheCollection').find({':spi_wm:wogr:oup:': ':xx:xx:xx:'});
		})

		.then(function (res) {

			try {
				deepEqual(res.length, 1, 'found 1');
				deepEqual(res[0].json[':spi_wm:wogr:oup:'], ':xx:xx:xx:', 'found the right item');

			} catch (e) {
				ok(false, e.toString());
				start();
			}

			res[0].json[':spi_wm:wogr:oup:'] = ':yy:yy:yy:';

			return JSONStore.get('NameOfTheCollection').replace(res);
		})

		.then(function (res) {
			deepEqual(res, 1, 'replace worked');

			return JSONStore.get('NameOfTheCollection').find({':spi_wm:wogr:oup:': ':yy:yy:yy:'});
		})

		.then(function (res) {

			try {
				deepEqual(res.length, 1, 'find worked');
				deepEqual(res[0].json[':spi_wm:wogr:oup:'], ':yy:yy:yy:', 'json data worked');
			}  catch(e) {
				ok(false, e.toString());
				start();
			}

			return JSONStore.get('NameOfTheCollection').remove({':spi_wm:wogr:oup:': ':yy:yy:yy:'});

		})

		.then(function (res) {

			deepEqual(res, 1, 'remove worked');

			return JSONStore.get('NameOfTheCollection').findAll();
		})

		.then(function (res) {
			deepEqual(res.length, 0, 'found nothing as expected');
			start();
		})

		.fail(function (err) {
			ok(false, err.toString());
			start();
		});

	});

	asyncTest('key with colons 2 - init, add, find data with colons -- exact', 10, function () {

		var data = {
			':spi_wm:wogr:oup:' : ':xx:xx:xx:'
		};

		var collections = {
			NameOfTheCollection: {
				searchFields : {':spi_wm:wogr:oup:': 'string'}
			}
		};

		JSONStore.destroy()
		.then(function (res) {
			deepEqual(res, 0, 'destroy');
			return JSONStore.init(collections);
		})

		.then(function (res) {
			deepEqual(res.NameOfTheCollection.name, 'NameOfTheCollection', 'worked');

			return JSONStore.get('NameOfTheCollection').add(data);
		})

		.then(function (res) {
			deepEqual(res, 1, 'added worked');

			return JSONStore.get('NameOfTheCollection').find({':spi_wm:wogr:oup:': ':xx:xx:xx:'}, {exact: true});
		})

		.then(function (res) {

			try {
				deepEqual(res.length, 1, 'found 1');
				deepEqual(res[0].json[':spi_wm:wogr:oup:'], ':xx:xx:xx:', 'found the right item');

			} catch (e) {
				ok(false, e.toString());
				start();
			}

			res[0].json[':spi_wm:wogr:oup:'] = ':yy:yy:yy:';

			return JSONStore.get('NameOfTheCollection').replace(res, {exact: true});
		})

		.then(function (res) {
			deepEqual(res, 1, 'replace worked');

			return JSONStore.get('NameOfTheCollection').find({':spi_wm:wogr:oup:': ':yy:yy:yy:'}, {exact: true});
		})

		.then(function (res) {

			try {
				deepEqual(res.length, 1, 'find worked');
				deepEqual(res[0].json[':spi_wm:wogr:oup:'], ':yy:yy:yy:', 'json data worked');
			}  catch(e) {
				ok(false, e.toString());
				start();
			}

			return JSONStore.get('NameOfTheCollection').remove({':spi_wm:wogr:oup:': ':yy:yy:yy:'}, {exact: true});

		})

		.then(function (res) {

			deepEqual(res, 1, 'remove worked');

			return JSONStore.get('NameOfTheCollection').findAll();
		})

		.then(function (res) {
			deepEqual(res.length, 0, 'found nothing as expected');
			start();
		})

		.fail(function (err) {
			ok(false, err.toString());
			start();
		});

	});

	asyncTest('key with colons 2 - init, add, find data with colons -- limit:1 and push:false', 10, function () {

		var data = {
			':spi_wm:wogr:oup:' : ':xx:xx:xx:'
		};

		var collections = {
			NameOfTheCollection: {
				searchFields : {':spi_wm:wogr:oup:': 'string'}
			}
		};

		JSONStore.destroy()
		.then(function (res) {
			deepEqual(res, 0, 'destroy');
			return JSONStore.init(collections);
		})

		.then(function (res) {
			deepEqual(res.NameOfTheCollection.name, 'NameOfTheCollection', 'worked');

			return JSONStore.get('NameOfTheCollection').add(data, {push: false});
		})

		.then(function (res) {
			deepEqual(res, 1, 'added worked');

			return JSONStore.get('NameOfTheCollection').find({':spi_wm:wogr:oup:': ':xx:xx:xx:'}, {limit: 1});
		})

		.then(function (res) {

			try {
				deepEqual(res.length, 1, 'found 1');
				deepEqual(res[0].json[':spi_wm:wogr:oup:'], ':xx:xx:xx:', 'found the right item');

			} catch (e) {
				ok(false, e.toString());
				start();
			}

			res[0].json[':spi_wm:wogr:oup:'] = ':yy:yy:yy:';

			return JSONStore.get('NameOfTheCollection').replace(res, {push: false});
		})

		.then(function (res) {
			deepEqual(res, 1, 'replace worked');

			return JSONStore.get('NameOfTheCollection').find({':spi_wm:wogr:oup:': ':yy:yy:yy:'}, {limit: 2, offset: 0});
		})

		.then(function (res) {

			try {
				deepEqual(res.length, 1, 'find worked');
				deepEqual(res[0].json[':spi_wm:wogr:oup:'], ':yy:yy:yy:', 'json data worked');
			}  catch(e) {
				ok(false, e.toString());
				start();
			}

			return JSONStore.get('NameOfTheCollection').remove({':spi_wm:wogr:oup:': ':yy:yy:yy:'}, {push: false});

		})

		.then(function (res) {

			deepEqual(res, 1, 'remove worked');

			return JSONStore.get('NameOfTheCollection').findAll();
		})

		.then(function (res) {
			deepEqual(res.length, 0, 'found nothing as expected');
			start();
		})

		.fail(function (err) {
			ok(false, err.toString());
			start();
		});

	});

	asyncTest('key with colons 2 - init, add, find data with colons -- limit:2, offset:1 and push:true', 12, function () {

		var data = [{':spi_wm:wogr:oup:' : ':xx:xx:xx:'},
			{':spi_wm:wogr:oup:' : 'hey:hey'}];

		var collections = {
			NameOfTheCollection: {
				searchFields : {':spi_wm:wogr:oup:': 'string'}
			}
		};

		JSONStore.destroy()
		.then(function (res) {
			deepEqual(res, 0, 'destroy');
			return JSONStore.init(collections);
		})

		.then(function (res) {
			deepEqual(res.NameOfTheCollection.name, 'NameOfTheCollection', 'init worked');

			return JSONStore.get('NameOfTheCollection').add(data, {push: true});
		})

		.then(function (res) {
			deepEqual(res, 2, 'add worked');

			return JSONStore.get('NameOfTheCollection').find({}, {limit: 2});
		})

		.then(function (res) {

			try {
				deepEqual(res.length, 2, 'found 2');
				deepEqual(res[0].json[':spi_wm:wogr:oup:'], ':xx:xx:xx:', 'found the right item 1');
				deepEqual(res[1].json[':spi_wm:wogr:oup:'], 'hey:hey', 'found the right item 2');

				res[1].json[':spi_wm:wogr:oup:'] = ':yy:yy:yy:';

			} catch (e) {
				ok(false, e.toString());
				start();
			}

			return JSONStore.get('NameOfTheCollection').replace(res, {push: true});
		})

		.then(function (res) {
			deepEqual(res, 2, 'replace worked');

			return JSONStore.get('NameOfTheCollection').find({':spi_wm:wogr:oup:': ':yy:yy:yy:'});
		})

		.then(function (res) {

			try {
				deepEqual(res.length, 1, 'find worked');
				deepEqual(res[0].json[':spi_wm:wogr:oup:'], ':yy:yy:yy:', 'json data worked');
			}  catch(e) {
				ok(false, e.toString());
				start();
			}

			return JSONStore.get('NameOfTheCollection').remove({':spi_wm:wogr:oup:': ':yy:yy:yy:'}, {push: true});

		})

		.then(function (res) {

			deepEqual(res, 1, 'remove worked');

			return JSONStore.get('NameOfTheCollection').findAll();
		})

		.then(function (res) {
			try{
				deepEqual(res.length, 1, 'found one as expected');
				deepEqual(res[0].json[':spi_wm:wogr:oup:'], ':xx:xx:xx:', 'found the right item 1');
			}catch(e){
				ok(false, e.toString());
				start();
			}

			start();
		})

		.fail(function (err) {
			ok(false, err.toString());
			start();
		});

	});

	asyncTest('key with colons 2 - additionalSearchFields and more data', 10, function () {

		var data = {':spi_wm:wogr:oup:' : ':xx:xx:xx:'};


		var collections = {
			NameOfTheCollection: {
				searchFields : {':spi_wm:wogr:oup:': 'string', ':spi_wm:wogr:oup222:' : 'number'},
				additionalSearchFields: {'key:key': 'string'}
			}
		};

		JSONStore.destroy()
		.then(function (res) {
			deepEqual(res, 0, 'destroy');
			return JSONStore.init(collections);
		})

		.then(function (res) {
			deepEqual(res.NameOfTheCollection.name, 'NameOfTheCollection', 'worked');

			return JSONStore.get('NameOfTheCollection').add(data, {push: false,
				additionalSearchFields: {'key:key' : 'hello:world' }});
		})

		.then(function (res) {
			deepEqual(res, 1, 'added worked');

			return JSONStore.get('NameOfTheCollection').find({'key:key': 'hello:world'}, {limit: 1});
		})

		.then(function (res) {

			try {
				deepEqual(res.length, 1, 'found 1');
				deepEqual(res[0].json[':spi_wm:wogr:oup:'], ':xx:xx:xx:', 'found the right item');
				res[0].json[':spi_wm:wogr:oup:'] = ':yy:yy:yy:';

			} catch (e) {
				ok(false, e.toString());
				start();
			}

			return JSONStore.get('NameOfTheCollection').replace(res, {push: false});
		})

		.then(function (res) {
			deepEqual(res, 1, 'replace worked');

			return JSONStore.get('NameOfTheCollection').find({'key:key': 'hello:world'});
		})

		.then(function (res) {

			try {
				deepEqual(res.length, 1, 'find worked');
				deepEqual(res[0].json[':spi_wm:wogr:oup:'], ':yy:yy:yy:', 'json data worked');
			}  catch(e) {
				ok(false, e.toString());
				start();
			}

			return JSONStore.get('NameOfTheCollection').remove({'key:key': 'hello:world'}, {push: true});

		})

		.then(function (res) {

			deepEqual(res, 1, 'remove worked');

			return JSONStore.get('NameOfTheCollection').findAll();
		})

		.then(function (res) {
			deepEqual(res.length, 0, 'found nothing as expected');
			start();
		})

		.fail(function (err) {
			ok(false, err.toString());
			start();
		});

	});


if(iOSversion()){

	asyncTest('Concurrency in jsonstore ios', 23, function () {


		var collections1 = {
			customers1: {
				searchFields : {name: 'string'}
			}
		};

		var collections2 = {
			customers2: {
				searchFields : {name: 'string'}
			}
		};

		var collections3 = {
			customers3: {
				searchFields : {name: 'string'}
			}
		};

		var collections4 = {
			customers4: {
				searchFields : {name: 'string'}
			}
		};

		var collections5 = {
			customers5: {
				searchFields : {name: 'string'}
			}
		};

		var collections6 = {
			customers6: {
				searchFields : {name: 'string'}
			}
		};

		JSONStore.destroy()

		.then(function (res) {
			deepEqual(res, 0, 'destroy');

			var p1 = JSONStore.init(collections1),
				p2 = JSONStore.init(collections2),
				p3 = JSONStore.init(collections3),
				p4 = JSONStore.init(collections4),
				p5 = JSONStore.init(collections5),
				p6 = JSONStore.init(collections6);

			return $.when.apply(this, [p1, p2, p3, p4, p5, p6]);
		})

		.then(function () {

			try {
				var lastInit = arguments[5];

				deepEqual(lastInit.customers1.name, JSONStore.get('customers1').name, lastInit.customers1.name);
				deepEqual(lastInit.customers2.name, JSONStore.get('customers2').name, lastInit.customers2.name);
				deepEqual(lastInit.customers3.name, JSONStore.get('customers3').name, lastInit.customers3.name);
				deepEqual(lastInit.customers4.name, JSONStore.get('customers4').name, lastInit.customers4.name);
				deepEqual(lastInit.customers5.name, JSONStore.get('customers5').name, lastInit.customers5.name);
				deepEqual(lastInit.customers6.name, JSONStore.get('customers6').name, lastInit.customers6.name);

				deepEqual(JSONStore.get('customers6').name, 'customers6', 'check name is correctly stored at the js layer');

			} catch (e) {
				ok(false, 'failed:' + e.toString());
			}

			var p1 = JSONStore.get('customers1').add({name: 'cust1'}),
				p2 = JSONStore.get('customers2').add({name: 'cust2'}),
				p3 = JSONStore.get('customers3').add({name: 'cust3'}),
				p4 = JSONStore.get('customers4').add({name: 'cust4'}),
				p5 = JSONStore.get('customers5').add({name: 'cust5'}),
				p6 = JSONStore.get('customers6').add({name: 'cust6'});

			var p7 = JSONStore.get('customers1').add([{name: 'cust100'}, {name: 'cust200'}]);

			return $.when.apply(this, [p1, p2, p3, p4, p5, p6, p7]);
		})

		.then(function () {

			try {
				deepEqual(arguments[0][0], 1, 'add1');
				deepEqual(arguments[1][0], 1, 'add2');
				deepEqual(arguments[2][0], 1, 'add3');
				deepEqual(arguments[3][0], 1, 'add4');
				deepEqual(arguments[4][0], 1, 'add5');
				deepEqual(arguments[5][0], 1, 'add6');
				deepEqual(arguments[6][0], 2, 'add7');

			} catch (e) {
				ok(false, 'failed:' + e.toString());
			}

			var p1 = JSONStore.get('customers1').find({}),
				p2 = JSONStore.get('customers2').find({}),
				p3 = JSONStore.get('customers3').find({}),
				p4 = JSONStore.get('customers4').find({}),
				p5 = JSONStore.get('customers5').find({}),
				p6 = JSONStore.get('customers6').find({});

			return $.when.apply(this, [p1, p2, p3, p4, p5, p6]);
		})

		.then(function () {

			try {
				deepEqual(arguments[0][0][0].json.name, 'cust1', 'find1');
				deepEqual(arguments[0][0][1].json.name, 'cust100', 'find1a');
				deepEqual(arguments[0][0][2].json.name, 'cust200', 'find1b');
				deepEqual(arguments[1][0][0].json.name, 'cust2', 'find2');
				deepEqual(arguments[2][0][0].json.name, 'cust3', 'find3');
				deepEqual(arguments[3][0][0].json.name, 'cust4', 'find4');
				deepEqual(arguments[4][0][0].json.name, 'cust5', 'find5');
				deepEqual(arguments[5][0][0].json.name, 'cust6', 'find6');

			} catch (e) {
				ok(false, 'failed:' + e.toString());
			}

			start();
		})

		.fail(function (err) {
			ok(false, 'Failure is not an option: ' + err.toString());
			start();
		});

	});
}

}(JSON, asyncTest, ok, start, deepEqual, notDeepEqual));