/*global module, JSON, asyncTest, ok, start, deepEqual, notDeepEqual*/

(function () {

	'use strict';

	module('localStorage Destroy');
	
	asyncTest('Destroy only jsonstore key/pairs', 2, function() {
		var flag = false;

		localStorage.setItem('CONSTANT_DATA', 'DATA');
		JSONStore.destroy()
		.then(function (res) {
			deepEqual(res, 0, 'db cleared');
			flag = (localStorage.getItem('CONSTANT_DATA') ? true : false);
			ok(flag, 'localStorage keys maintained');
			if(flag) {
				localStorage.removeItem('CONSTANT_DATA');
			}
			start();
		})
		.fail(function (err) {
			ok(false, 'Failure is not an option: ' + err.toString());
			start();
		});
	});


	asyncTest('Dont destroy collection like key', 7, function () {
		var collection = {
			people : {
				searchFields : {name : 'string'}
			}
		};
		var flag = false;

		JSONStore.destroy()
		.then(function (res) {
			deepEqual(res, 0, 'db cleared');
			return JSONStore.init(collection);
		})
		.then(function (res) {
			deepEqual(res.people.name, 'people', 'init');
			return JSONStore.get('people').add({name : 'nana'});
		})
		.then(function (res) {
			deepEqual(res, 1, 'add');
			return JSONStore.get('people').findAll();
		})
		.then(function (res) {
			deepEqual(res.length, 1, 'findAll');
			deepEqual(res[0].json.name, 'nana', 'name1');
			localStorage.setItem('nana.collection', 'NOT A JSONSTORE COLLECTION');
			return JSONStore.destroy();
		})
		.then(function (res) {
			deepEqual(res, 0, 'db cleared');
			flag = (localStorage.getItem('nana.collection') ? true : false);
			ok(flag, 'localStorage maintained');
			if(flag) {
				localStorage.removeItem('nana.collection');
			}
			start();

		})
		.fail(function (err) {
			ok(false, 'Falure is not an option: ' + err.toString());
			start();
		});
	});

asyncTest('Dont destroy metadata like key', 7, function () {
	var collection = {
		people : {
			searchFields : {name: 'string'}
		}
	};
	var flag = false;

	JSONStore.destroy()
	.then(function (res) {
		deepEqual(res, 0, 'db cleared');
		return JSONStore.init(collection);
	})
	.then(function (res) {
		deepEqual(res.people.name, 'people', 'init');
		return JSONStore.get('people').add({name: 'mike'});
	})
	.then(function (res) {
		deepEqual(res, 1, 'add');
		return JSONStore.get('people').findAll();
	})
	.then(function (res) {
		deepEqual(res.length, 1, 'findAll');
		deepEqual(res[0].json.name, 'mike', 'name1');
		localStorage.setItem('mike.#dgonz.metadata', 'NOT METADATA');
		return JSONStore.destroy();
	})
	.then(function (res) {
		deepEqual(res, 0, 'db cleared');
		flag = (localStorage.getItem('mike.#dgonz.metadata') ? true : false);
		ok(flag, 'localStorage maintained');
		if(flag) {
			localStorage.removeItem('mike.#dgonz.metadata');
		}
		start();

	})
	.fail(function (err) {
		ok(false, 'Falure is not an option: ' + err.toString());
		start();
	});
});


asyncTest('Destroy Defined DBs', 22, function () {

	var collections = {
		orders: {
			searchFields : {name: 'string', age: 'integer'}
		}
	};

	var collections2 = {
		people : {
			searchFields: {name: 'string', age: 'integer'}
		}
	};

	var storeOptions = {
		username : 'carlos',
		password: '123',
		localKeyGen : true
	};

	var data = [
	{name: 'carlos', age: 1},
	{name: 'dgonz', age: 2},
	{name: 'carlos', age: 3}
	];

	var data2 = [
	{name: 'anthony', age: 1},
	{name: 'erika', age: 2},
	{name: 'harrison', age: 3}
	];

	JSONStore.destroy()

	.then(function (res) {
		deepEqual(res, 0, 'destroy');
		return JSONStore.init(collections);
	})
	.then(function (res) {
		deepEqual(res.orders.name, 'orders', 'init');
		return JSONStore.get('orders').add(data);
	})
	.then(function (res) {
		deepEqual(res, 3, 'added');
		return JSONStore.get('orders').findAll();
	})
	.then(function (res) {
		deepEqual(res.length, 3, 'findAll');
		deepEqual(res[0].json.name, 'carlos', 'name1');
		deepEqual(res[0].json.age, 1, 'age1');
		deepEqual(res[1].json.name, 'dgonz', 'name2');
		deepEqual(res[1].json.age, 2, 'age2');
		deepEqual(res[2].json.name, 'carlos', 'name3');
		deepEqual(res[2].json.age, 3, 'age3');
		return JSONStore.closeAll();

	})
	.then(function (res) {
		deepEqual(res, 0, 'closeAll');
		return JSONStore.init(collections2,storeOptions);

	})

	.then(function (res) {
		deepEqual(res.people.name, 'people', 'init');
		return JSONStore.get('people').add(data2);
	})
	.then(function (res) {
		deepEqual(res, 3, 'added');
		return JSONStore.get('people').findAll();
	})
	.then(function (res) {
		deepEqual(res.length, 3, 'findAll2');
		deepEqual(res[0].json.name, 'anthony', 'name1b');
		deepEqual(res[0].json.age, 1, 'age1b');
		deepEqual(res[1].json.name, 'erika', 'name2b');
		deepEqual(res[1].json.age, 2, 'age2');
		deepEqual(res[2].json.name, 'harrison', 'name3b');
		deepEqual(res[2].json.age, 3, 'age3b');
		return JSONStore.destroy('carlos');
	})
	.then(function (res) {
		deepEqual(res, 0, 'destroy');
		storeOptions.password = '222';
		return JSONStore.init(collections2, storeOptions);
	})
	.then(function (res) {
		ok(true, 'Should work, res: ' + JSON.stringify(res));
		start();
	})
	.fail(function (err) {
		deepEqual(err.msg, 'USERNAME_MISMATCH_DETECTED', 'Failed as expected with msg: ' + err.msg);
		deepEqual(err.err, -6, 'Failed as expected with err code:' + err.err);
		start();
	});

});

asyncTest('Destroy all using defined names', 25, function () {

	var collections = {
		orders: {
			searchFields : {name: 'string', age: 'integer'}
		}
	};

	var collections2 = {
		people : {
			searchFields: {name: 'string', age: 'integer'}
		}
	};

	var options = {
		username : 'carlos',
		password: '123',
		localKeyGen : true
	};

	var data = [
	{name: 'carlos', age: 1},
	{name: 'dgonz', age: 2},
	{name: 'carlos', age: 3}
	];

	var data2 = [
	{name: 'anthony', age: 1},
	{name: 'erika', age: 2},
	{name: 'harrison', age: 3}
	];

	JSONStore.destroy()

	.then(function (res) {
		deepEqual(res, 0, 'destroy');
		return JSONStore.init(collections);
	})
	.then(function (res) {
		deepEqual(res.orders.name, 'orders', 'init');
		return JSONStore.get('orders').add(data);
	})
	.then(function (res) {
		deepEqual(res, 3, 'added');
		return JSONStore.get('orders').findAll();
	})
	.then(function (res) {
		deepEqual(res.length, 3, 'findAll');
		deepEqual(res[0].json.name, 'carlos', 'name1');
		deepEqual(res[0].json.age, 1, 'age1');
		deepEqual(res[1].json.name, 'dgonz', 'name2');
		deepEqual(res[1].json.age, 2, 'age2');
		deepEqual(res[2].json.name, 'carlos', 'name3');
		deepEqual(res[2].json.age, 3, 'age3');
		return JSONStore.closeAll();
	})
	.then(function (res) {
		deepEqual(res, 0, 'closeAll');
		return JSONStore.init(collections2,options);
	})
	.then(function (res) {
		deepEqual(res.people.name, 'people', 'init');
		return JSONStore.get('people').add(data2);
	})
	.then(function (res) {
		deepEqual(res, 3, 'added');
		return JSONStore.get('people').findAll();
	})
	.then(function (res) {
		deepEqual(res.length, 3, 'findAll2');
		deepEqual(res[0].json.name, 'anthony', 'name1b');
		deepEqual(res[0].json.age, 1, 'age1b');
		deepEqual(res[1].json.name, 'erika', 'name2b');
		deepEqual(res[1].json.age, 2, 'age2');
		deepEqual(res[2].json.name, 'harrison', 'name3b');
		deepEqual(res[2].json.age, 3, 'age3b');
		return JSONStore.destroy('carlos');
	})
	.then(function (res) {
		deepEqual(res, 0, 'destroy');
		options.password = '111';
		return JSONStore.init(collections2, options);
	})
	.then(function (res) {
		ok(true, 'Should work, res: ' + JSON.stringify(res));
		return JSONStore.destroy('jsonstore');
	})
	.then(function (res) {
		deepEqual(res, 0, 'destroy');
		return JSONStore.init(collections);
	})
	.then(function (res) {
		ok(true, 'Should word, res: ' + JSON.stringify(res));
			return JSONStore.destroy(); //clean up
		})
	.then(function (res) {
		deepEqual(res, 0, 'destroy');
		start();
	})
	.fail(function (err) {
		ok(false, 'Should not fail, result: ' + JSON.stringify(err));
		start();
	});

});

}(JSON, asyncTest, ok, start, deepEqual, notDeepEqual));