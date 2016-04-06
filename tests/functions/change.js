/*global module, JSON, asyncTest, ok, start, deepEqual, notDeepEqual*/

	(function () {

		'use strict';

		module('change / smartReplace');

		asyncTest('Basic change test', 34, function () {

			var collections = {
				customers: {
					searchFields : {id: 'integer'}
				}
			};

			var data = [
			{id: 1, name: 'carlos', age: 1},
			{id: 2, name: 'dgonz', age: 2},
			{id: 3, name: 'mike', age: 3}
			];

			JSONStore.destroy()

			.then(function (res) {
				deepEqual(res, 0, 'destroy');
				return JSONStore.init(collections);
			})

			.then(function (res) {
				deepEqual(res.customers.name, 'customers', 'init');
				return JSONStore.get('customers').add(data);
			})

			.then(function (res) {
				deepEqual(res, 3, 'add');

				return JSONStore.get('customers').findAll();
			})

			.then(function (res) {

				deepEqual(res.length, 3, 'data in collection');

				deepEqual(res[0]._id, 1, '_id1');
				deepEqual(res[1]._id, 2, '_id2');
				deepEqual(res[2]._id, 3, '_id3');

				deepEqual(res[0].json.name, 'carlos', 'name1');
				deepEqual(res[1].json.name, 'dgonz', 'name2');
				deepEqual(res[2].json.name, 'mike', 'name3');

				deepEqual(res[0].json.age, 1, 'age1');
				deepEqual(res[1].json.age, 2, 'age2');
				deepEqual(res[2].json.age, 3, 'age3');

				deepEqual(res[0].json.id, 1, 'id1');
				deepEqual(res[1].json.id, 2, 'id2');
				deepEqual(res[2].json.id, 3, 'id3');

				var newData = [
				{id: 1, name: 'carlos', age: 1},
				{id: 2, name: '#dgonz', age: 2},
				{id: 3, name: 'michael', age: 5},
				{id: 5, name: 'HEYOO', age: 4}
				];

				return JSONStore.get('customers').change(newData, {addNew: true, markDirty: true, replaceCriteria:['id']});
			})

			.then(function (res) {
				deepEqual(res, 4, 'change');

				return JSONStore.get('customers').findAll();
			})

			.then(function (res) {

				deepEqual(res.length, 4, 'data in collection');

				deepEqual(res[0]._id, 1, '_id1');
				deepEqual(res[1]._id, 2, '_id2');
				deepEqual(res[2]._id, 3, '_id3');
				deepEqual(res[3]._id, 4, '_id4');

				deepEqual(res[0].json.name, 'carlos', 'name1');
				deepEqual(res[1].json.name, '#dgonz', 'name2');
				deepEqual(res[2].json.name, 'michael', 'name3');
				deepEqual(res[3].json.name, 'HEYOO', 'name4');

				deepEqual(res[0].json.age, 1, 'age1');
				deepEqual(res[1].json.age, 2, 'age2');
				deepEqual(res[2].json.age, 5, 'age3');
				deepEqual(res[3].json.age, 4, 'age4');

				deepEqual(res[0].json.id, 1, 'id1');
				deepEqual(res[1].json.id, 2, 'id2');
				deepEqual(res[2].json.id, 3, 'id3');
				deepEqual(res[3].json.id, 5, 'id4');


				start();
			})

			.fail(function (err) {
				ok(false, 'Failure is not an option: ' + err.toString());
				start();
			});

		});

asyncTest('test change with multiple replaceCriteria', 43, function () {

	var collections = {
		customers: {
			searchFields : {id: 'integer', ssn: 'string', name: 'string', active: 'boolean', age: 'integer'}
		}
	};

	var data = [
	{ id: 0, name: 'YOLO', age: 10, ssn: '111-22-3333', gpa: 3.8, active: true },
	{ id: 1, name: 'mike', age: 11, ssn: '111-44-3333', gpa: 3.9, active: false },
	{ id: 2, name: 'dgonz', age: 12, ssn: '111-55-3333', gpa: 3.7, active: true }
	];

	JSONStore.destroy()

	.then(function (res) {
		deepEqual(res, 0, 'destroy');
		return JSONStore.init(collections);
	})

	.then(function (res) {
		deepEqual(res.customers.name, 'customers', 'init');
		return JSONStore.get('customers').add(data);
	})

	.then(function (res) {
		deepEqual(res, 3, 'add');
		return JSONStore.get('customers').findAll();
	})

	.then(function (res) {
		deepEqual(res.length, 3, 'length');
		deepEqual(res[0].json.name, 'YOLO', 'first name - YOLO');
		deepEqual(res[0].json.id, 0, 'id1');
		deepEqual(res[0].json.age, 10, 'age1');
		deepEqual(res[0].json.ssn, '111-22-3333', 'ssn1');
		deepEqual(res[0].json.gpa, 3.8, 'gpa1');
		deepEqual(res[0].json.active, true, 'active1');
		deepEqual(res[1].json.name, 'mike', 'second name - mike');
		deepEqual(res[1].json.id, 1, 'id2');
		deepEqual(res[1].json.age, 11, 'age2');
		deepEqual(res[1].json.ssn, '111-44-3333', 'ssn2');
		deepEqual(res[1].json.gpa, 3.9, 'gpa2');
		deepEqual(res[2].json.name, 'dgonz', 'third name - dgonz');
		deepEqual(res[2].json.id, 2, 'id3');
		deepEqual(res[2].json.age, 12, 'age3');
		deepEqual(res[2].json.ssn, '111-55-3333', 'ssn3');
		deepEqual(res[2].json.gpa, 3.7, 'gpa3');

		var newData = [
		{ id: 0, name: 'CARLOS', age: 10, ssn: '111-22-3333', gpa: 3.5, active: true},
		{ id: 1, name: 'DGONZ', age: 11, ssn: '111-44-3333', gpa: 3.4, active: true },
		{ id: 2, name: 'NANA', age: 12, ssn: '111-55-3333', gpa: 3.3, active: true },
		{ id: 3, name: 'ANAN', age: 1, ssn: '123-66-3333', gpa: 3.2, active: false}
		];
		return JSONStore.get('customers').change(newData, {addNew: true, markDirty: false, replaceCriteria: ['id', 'ssn']});
	})

.then(function (res) {
	deepEqual(res, 4, 'change');
	return JSONStore.get('customers').findAll();
})

.then(function (res) {
	deepEqual(res.length, 4, 'length');
	deepEqual(res[0].json.name, 'CARLOS', 'first name - CARLOS');
	deepEqual(res[0].json.id, 0, 'id1');
	deepEqual(res[0].json.age, 10, 'age1');
	deepEqual(res[0].json.ssn, '111-22-3333', 'ssn1');
	deepEqual(res[0].json.gpa, 3.5, 'gpa1');
	deepEqual(res[0].json.active, true, 'active1');
	deepEqual(res[1].json.name, 'DGONZ', 'second name - DGONZ');
	deepEqual(res[1].json.id, 1, 'id2');
	deepEqual(res[1].json.age, 11, 'age2');
	deepEqual(res[1].json.ssn, '111-44-3333', 'ssn2');
	deepEqual(res[1].json.gpa, 3.4, 'gpa2');
	deepEqual(res[2].json.name, 'NANA', 'third name - NANA');
	deepEqual(res[2].json.id, 2, 'id3');
	deepEqual(res[2].json.age, 12, 'age3');
	deepEqual(res[2].json.ssn, '111-55-3333', 'ssn3');
	deepEqual(res[2].json.gpa, 3.3, 'gpa3');
	deepEqual(res[3].json.name, 'ANAN', 'fourth name - ANAN');
	deepEqual(res[3].json.id, 3, 'id4');
	deepEqual(res[3].json.age, 1, 'age4');
	deepEqual(res[3].json.ssn, '123-66-3333', 'ssn4');
	deepEqual(res[3].json.gpa, 3.2, 'gpa4');

	start();
})

.fail(function (err) {
	ok(false, 'Should not fail, result: ' + JSON.stringify(err));
	start();
});

});

asyncTest('test change as an glorified add i.e. use it with empty collection', 7, function () {

	var collections = {
		customers: {
			searchFields : {id: 'string'}
		}
	};

	var data = [
	{id: 1, name: 'carlos', age: 1},
	{id: 2, name: 'dgonz', age: 2},
	{id: 3, name: 'mike', age: 3}
	];

	JSONStore.destroy()

	.then(function (res) {
		deepEqual(res, 0, 'destroy');
		return JSONStore.init(collections);
	})

	.then(function (res) {
		deepEqual(res.customers.name, 'customers', 'init');
		return JSONStore.get('customers').change(data, {replaceCriteria:['id'], addNew:true});
	})

	.then(function (res) {
		deepEqual(res, 3, 'faux add');
		return JSONStore.get('customers').findAll();
	})

	.then(function (res) {

		deepEqual(res.length, 3, 'length');

		deepEqual(res[0].json.name, 'carlos', 'first name - carlos');
		deepEqual(res[1].json.name, 'dgonz', 'second name - dgonz');
		deepEqual(res[2].json.name, 'mike', 'third name - mike');

		start();
	})

	.fail(function (err) {
		ok(false, 'Should not fail, result: ' + JSON.stringify(err));
		start();
	});

});



asyncTest('add new false', 4, function () {

	var collections = {
		customers: {
			searchFields : {id: 'string'}
		}
	};

	var data = [
	{id: 1, name: 'carlos', age: 1},
	{id: 2, name: 'dgonz', age: 2},
	{id: 3, name: 'mike', age: 3}
	];

	JSONStore.destroy()

	.then(function (res) {
		deepEqual(res, 0, 'destroy');
		return JSONStore.init(collections);
	})

	.then(function (res) {
		deepEqual(res.customers.name, 'customers', 'init');
		return JSONStore.get('customers').change(data, {replaceCriteria:['id'], addNew:false});
	})

	.then(function (res) {
		deepEqual(res, 0, 'faux add');
		return JSONStore.get('customers').findAll();
	})

	.then(function (res) {

		deepEqual(res.length, 0, 'length');

		start();
	})

	.fail(function (err) {
		ok(false, 'Should not fail, result: ' + JSON.stringify(err));
		start();
	});

});

asyncTest('implicit add new false -- addNew is not passed', 4, function () {

	var collections = {
		customers: {
			searchFields : {id: 'string'}
		}
	};

	var data = [
	{id: 1, name: 'carlos', age: 1},
	{id: 2, name: 'dgonz', age: 2},
	{id: 3, name: 'mike', age: 3}
	];

	JSONStore.destroy()

	.then(function (res) {
		deepEqual(res, 0, 'destroy');
		return JSONStore.init(collections);
	})

	.then(function (res) {
		deepEqual(res.customers.name, 'customers', 'init');
		return JSONStore.get('customers').change(data, {replaceCriteria:['id']});
	})

	.then(function (res) {
		deepEqual(res, 0, 'faux add');
		return JSONStore.get('customers').findAll();
	})

	.then(function (res) {

		deepEqual(res.length, 0, 'length');

		start();
	})

	.fail(function (err) {
		ok(false, 'Should not fail, result: ' + JSON.stringify(err));
		start();
	});

});

asyncTest('test markDirty true', 4, function () {

	var collections = {
		customers: {
			searchFields : {id: 'string'}
		}
	};

	var data = [
	{id: 1, name: 'carlos', age: 1},
	{id: 2, name: 'dgonz', age: 2},
	{id: 3, name: 'mike', age: 3}
	];

	JSONStore.destroy()

	.then(function (res) {
		deepEqual(res, 0, 'destroy');
		return JSONStore.init(collections);
	})

	.then(function (res) {
		deepEqual(res.customers.name, 'customers', 'init');
		return JSONStore.get('customers').change(data, {replaceCriteria:['id'], addNew: true, markDirty: true});
	})

	.then(function (res) {
		deepEqual(res, 3, 'faux add');
		return JSONStore.get('customers').countAllDirty();
	})

	.then(function (res) {

		deepEqual(res, 3, 'dirty docs');
		start();
	})

	.fail(function (err) {
		ok(false, 'Should not fail, result: ' + JSON.stringify(err));
		start();
	});

});

asyncTest('test markDirty false', 4, function () {

	var collections = {
		customers: {
			searchFields : {id: 'string'}
		}
	};

	var data = [
	{id: 1, name: 'carlos', age: 1},
	{id: 2, name: 'dgonz', age: 2},
	{id: 3, name: 'mike', age: 3}
	];

	JSONStore.destroy()

	.then(function (res) {
		deepEqual(res, 0, 'destroy');
		return JSONStore.init(collections);
	})

	.then(function (res) {
		deepEqual(res.customers.name, 'customers', 'init');
		return JSONStore.get('customers').change(data, {replaceCriteria:['id'], addNew: true, markDirty: false});
	})

	.then(function (res) {
		deepEqual(res, 3, 'faux add');
		return JSONStore.get('customers').countAllDirty();
	})

	.then(function (res) {

		deepEqual(res, 0, 'dirty docs');
		start();
	})

	.fail(function (err) {
		ok(false, 'Should not fail, result: ' + JSON.stringify(err));
		start();
	});

});

asyncTest('test implicit markDirty false -- mark dirty not passed', 4, function () {

	var collections = {
		customers: {
			searchFields : {id: 'string'}
		}
	};

	var data = [
	{id: 1, name: 'carlos', age: 1},
	{id: 2, name: 'dgonz', age: 2},
	{id: 3, name: 'mike', age: 3}
	];

	JSONStore.destroy()

	.then(function (res) {
		deepEqual(res, 0, 'destroy');
		return JSONStore.init(collections);
	})

	.then(function (res) {
		deepEqual(res.customers.name, 'customers', 'init');
		return JSONStore.get('customers').change(data, {replaceCriteria:['id'], addNew: true});
	})

	.then(function (res) {
		deepEqual(res, 3, 'faux add');
		return JSONStore.get('customers').countAllDirty();
	})

	.then(function (res) {

		deepEqual(res, 0, 'dirty docs');
		start();
	})

	.fail(function (err) {
		ok(false, 'Should not fail, result: ' + JSON.stringify(err));
		start();
	});

});

asyncTest('test default replaceCriteria, default is to use all searchFields', 4, function () {

	var collections = {
		customers: {
			searchFields : {id: 'string'}
		}
	};

	var data = [
	{id: 1, name: 'carlos', age: 1},
	{id: 2, name: 'dgonz', age: 2},
	{id: 3, name: 'mike', age: 3}
	];

	JSONStore.destroy()

	.then(function (res) {
		deepEqual(res, 0, 'destroy');
		return JSONStore.init(collections);
	})

	.then(function (res) {
		deepEqual(res.customers.name, 'customers', 'init');

		data.push({
			id: 4,
			name: 'test',
			age: 5
		});

		return JSONStore.get('customers').change(data, {addNew: true});
	})

	.then(function (res) {
		deepEqual(res, 4, 'faux add');
		return JSONStore.get('customers').count();
	})

	.then(function (res) {

		deepEqual(res, 4, 'all doc count');
		start();
	})

	.fail(function (err) {
		ok(false, 'Should not fail, result: ' + JSON.stringify(err));
		start();
	});

});

asyncTest('test default replaceCriteria, with no searchFields', 4, function () {

  var collections = {
    customers: {
      searchFields : {}
    }
  };

  var data = [
  {id: 1, name: 'carlos', age: 1},
  {id: 2, name: 'dgonz', age: 2},
  {id: 3, name: 'mike', age: 3}
  ];

  JSONStore.destroy()

  .then(function (res) {
    deepEqual(res, 0, 'destroy');
    return JSONStore.init(collections);
  })

  .then(function (res) {
    deepEqual(res.customers.name, 'customers', 'init');

    data.push({
      id: 4,
      name: 'test',
      age: 5
    });

    return JSONStore.get('customers').change(data, {addNew: true});
  })

  .then(function (res) {
    deepEqual(res, 4, 'faux add');
    return JSONStore.get('customers').count();
  })

  .then(function (res) {

    deepEqual(res, 4, 'all doc count');
    start();
  })

  .fail(function (err) {
    ok(false, 'Should not fail, result: ' + JSON.stringify(err));
    start();
  });

});


asyncTest('test change with empty array', 4, function () {

	var collections = {
		customers: {
			searchFields : {id: 'string'}
		}
	};

	var data = [
	{id: 1, name: 'carlos', age: 1},
	{id: 2, name: 'dgonz', age: 2},
	{id: 3, name: 'mike', age: 3}
	];

	JSONStore.destroy()

	.then(function (res) {
		deepEqual(res, 0, 'destroy');
		return JSONStore.init(collections);
	})

	.then(function (res) {
		deepEqual(res.customers.name, 'customers', 'init');
		return JSONStore.get('customers').add(data);
	})

	.then(function (res) {
		deepEqual(res, 3, 'add');
		var newData = [];
		return JSONStore.get('customers').change(newData, {addNew: false, replaceCriteria: ['id']});
	})

	.then(function (res) {

		deepEqual(res, 0, 'change');
		start();
	})

	.fail(function (err) {
		ok(false, 'Should not fail, result: ' + JSON.stringify(err));
		start();
	});

});

asyncTest('test change with empty replaceCriteria w/ AddNew false', 4, function () {
	var collections = {
		customers : {
			searchFields : {id : 'string'}
		}
	};

	var data = [
		{id: 1, name: 'carlos', age: 1},
		{id: 2, name: 'dgonz', age: 2},
		{id: 3, name: 'nana', age: 3}
	];

	JSONStore.destroy()
	.then(function (res) {
		deepEqual(res, 0, 'destroy');
		return JSONStore.init(collections);
	})
	.then(function (res) {
		deepEqual(res.customers.name, 'customers', 'init');
		return JSONStore.get('customers').add(data);
	})
	.then(function (res) {
		deepEqual(res, 3, 'add');
		var newData = [
			{id: 1, name: 'carlos', age: 1},
			{id: 2, name: '#dgonz', age: 2},
			{id: 3, name: 'nana', age: 5},
			{id: 5, name: 'mike', age: 4}
		];
		return JSONStore.get('customers').change(newData, {addNew: false});
	})
	.then(function (res) {
		deepEqual(res, 0, 'change');
		start();
	})
	.fail(function (err) {
		ok(false, 'Should not fail, resutl: ' + JSON.stringify(err));
	});
});


asyncTest('test change with empty replaceCriteria w/ AddNew true', 17, function () {
	var collections = {
		customers : {
			searchFields : {id : 'string'}
		}
	};

	var data = [
		{id: 1, name: 'carlos', age: 1},
		{id: 2, name: 'dgonz', age: 2}
	];

	JSONStore.destroy()
	.then(function (res) {
		deepEqual(res, 0, 'destroy');
		return JSONStore.init(collections);
	})
	.then(function (res) {
		deepEqual(res.customers.name, 'customers', 'init');
		return JSONStore.get('customers').add(data);
	})
	.then(function (res) {
		deepEqual(res, 2, 'add');
		var newData = [
			{id: 3, name: 'mike', age: 3},
			{id: 4, name: 'nana', age: 4}
		];
		return JSONStore.get('customers').change(newData, {addNew: true});
	})
	.then(function (res) {
		deepEqual(res, 2, 'change');
		return JSONStore.get('customers').findAll();
	})
	.then(function (res) {
		deepEqual(res.length, 4, 'docs');
		deepEqual(res[0].json.id, 1, 'id1');
		deepEqual(res[0].json.name, 'carlos', 'name1');
		deepEqual(res[0].json.age, 1, 'age1');
		deepEqual(res[1].json.id, 2, 'id2');
		deepEqual(res[1].json.name, 'dgonz', 'name2');
		deepEqual(res[1].json.age, 2, 'age2');
		deepEqual(res[2].json.id, 3, 'id3');
		deepEqual(res[2].json.name, 'mike', 'name3');
		deepEqual(res[2].json.age, 3, 'age3');
		deepEqual(res[3].json.id, 4, 'id4');
		deepEqual(res[3].json.name, 'nana', 'name4');
		deepEqual(res[3].json.age, 4, 'age4');
		start();
	})
	.fail(function (err) {
		ok(false, 'Should not fail, result: ' + JSON.stringify(err));
	});
});

asyncTest('test change with muliple same documents', 14, function () {
	var collections = {
		customers : {
			searchFields : {id : 'string'}
		}
	};

	var data = [
		{id : 1, name: 'carlos', age: 1},
		{id: 1, name: 'dgonz', age: 2},
		{id: 2, name: 'mike', age: 4}
	];

	JSONStore.destroy()
	.then(function (res) {
		deepEqual(res, 0, 'destroy');
		return JSONStore.init(collections);
	})
	.then(function (res) {
		deepEqual(res.customers.name, 'customers', 'init');
		return JSONStore.get('customers').add(data);
	})
	.then(function (res) {
		deepEqual(res, 3, 'add');
		var newData = [
			{id: 1, name: 'nana', age: 3},
			{id: 2, name: 'mike', age: 4}
		];
		return JSONStore.get('customers').change(newData, {replaceCriteria: ['id']});
	})
	.then(function (res) {
		deepEqual(res, 3, 'change');
		return JSONStore.get('customers').findAll();
	})
	.then(function (res) {
		deepEqual(res.length, 3, 'docs');
		deepEqual(res[0].json.id, 1, 'id1');
		deepEqual(res[0].json.name, 'nana', 'name1');
		deepEqual(res[0].json.age, 3, 'age1');
		deepEqual(res[1].json.id, 1, 'id2');
		deepEqual(res[1].json.name, 'nana', 'name2');
		deepEqual(res[1].json.age, 3, 'age2');
		deepEqual(res[2].json.id, 2, 'id3');
		deepEqual(res[2].json.name, 'mike', 'name3');
		deepEqual(res[2].json.age, 4, 'age3');
		start();
	})
	.fail(function (err) {
		ok(false, 'Should not fail, result: ' + JSON.stringify(err));
	});
});

asyncTest('test change with upper case SF w/AddNew false', 14, function () {
	var collections =  {
		customers : {
			searchFields : {NAME : 'string', ID : 'integer', AGE: 'integer'}
		}
	};

	var data = [
		{ID : 1, NAME : 'carlos', AGE : 1},
		{ID : 2, NAME : 'dgonz', AGE : 2},
		{ID : 3, NAME : 'mike', AGE : 3}
	];

	JSONStore.destroy()
	.then(function (res) {
		deepEqual(res, 0, 'destroy');
		return JSONStore.init(collections);
	})
	.then(function (res) {
		deepEqual(res.customers.name, 'customers', 'init');
		return JSONStore.get('customers').add(data);
	})
	.then(function (res) {
		deepEqual(res, 3, 'add');
		var newData = [
			{ID : 1, NAME : 'Canderu', AGE: 4},
			{ID : 2, NAME : 'nana', AGE: 5},
			{ID : 3, NAME : 'MIKE', AGE: 6}
		];

		return JSONStore.get('customers').change(newData, {replaceCriteria: ['ID']});
	})
	.then(function (res) {
		deepEqual(res, 3, 'change');
		return JSONStore.get('customers').findAll();
	})
	.then(function (res) {
		deepEqual(res.length, 3, 'docs');
		deepEqual(res[0].json.ID, 1, 'id1');
		deepEqual(res[0].json.NAME, 'Canderu', 'name1');
		deepEqual(res[0].json.AGE, 4, 'age1');

		deepEqual(res[1].json.ID, 2, 'id2');
		deepEqual(res[1].json.NAME, 'nana', 'name2');
		deepEqual(res[1].json.AGE, 5, 'age2');

		deepEqual(res[2].json.ID, 3, 'id3');
		deepEqual(res[2].json.NAME, 'MIKE', 'name3');
		deepEqual(res[2].json.AGE, 6, 'age3');
		start();
	})
	.fail(function (err) {
		ok(false, 'Should not fail, result: ' + JSON.stringify(err));
	});
});

asyncTest('test change with upper case SF w/AddNew true', 17, function () {
	var collections =  {
		customers : {
			searchFields : {NAME : 'string', ID : 'integer', AGE: 'integer'}
		}
	};

	var data = [
		{ID : 1, NAME : 'carlos', AGE : 1},
		{ID : 2, NAME : 'dgonz', AGE : 2},
		{ID : 3, NAME : 'mike', AGE : 3}
	];

	JSONStore.destroy()
	.then(function (res) {
		deepEqual(res, 0, 'destroy');
		return JSONStore.init(collections);
	})
	.then(function (res) {
		deepEqual(res.customers.name, 'customers', 'init');
		return JSONStore.get('customers').add(data);
	})
	.then(function (res) {
		deepEqual(res, 3, 'add');
		var newData = [
			{ID : 1, NAME : 'Canderu', AGE: 4},
			{ID : 2, NAME : 'nana', AGE: 5},
			{ID : 3, NAME : 'MIKE', AGE: 6},
			{ID : 4, NAME : 'dgonz', AGE : 2}
		];

		return JSONStore.get('customers').change(newData, {replaceCriteria: ['ID'], addNew : true});
	})
	.then(function (res) {
		deepEqual(res, 4, 'change');
		return JSONStore.get('customers').findAll();
	})
	.then(function (res) {
		deepEqual(res.length, 4, 'docs');
		deepEqual(res[0].json.ID, 1, 'id1');
		deepEqual(res[0].json.NAME, 'Canderu', 'name1');
		deepEqual(res[0].json.AGE, 4, 'age1');

		deepEqual(res[1].json.ID, 2, 'id2');
		deepEqual(res[1].json.NAME, 'nana', 'name2');
		deepEqual(res[1].json.AGE, 5, 'age2');

		deepEqual(res[2].json.ID, 3, 'id3');
		deepEqual(res[2].json.NAME, 'MIKE', 'name3');
		deepEqual(res[2].json.AGE, 6, 'age3');

		deepEqual(res[3].json.ID, 4, 'id4');
		deepEqual(res[3].json.NAME, 'dgonz', 'name4');
		deepEqual(res[3].json.AGE, 2, 'age4');
		start();

	})
	.fail(function (err) {
		ok(false, 'Should not fail, result: ' + JSON.stringify(err));
	});
});


// asyncTest('test change with invalid replaceCriteria', 11, function () {

//   var collections = {
//     customers: {
//       searchFields : {id: 'string'}
//     }
//   };

//   var data = [
//     {id: 1, name: 'carlos', age: 1},
//     {id: 2, name: 'dgonz', age: 2},
//     {id: 3, name: 'mike', age: 3}
//   ];

//   JSONStore.destroy()

//   .then(function (res) {
//     deepEqual(res, 0, 'destroy');
//     return JSONStore.init(collections);
//   })

//   .then(function (res) {
//     deepEqual(res.customers.name, 'customers');
//     return JSONStore.get('customers').add(data);
//   })

//   .then(function (res) {
//     deepEqual(res, 3, 'add');
//     return JSONStore.get('customers').count();
//   })

//   .then(function (res) {

//     deepEqual(res, 3, 'all doc count');
//     var newData = [
//       {id: 1, name: 'CARLOS', age: 1},
//       {id: 2, name: 'DGONZ', age: 2},
//       {id: 3, name: 'NANA', age: 3}
//     ];
//     return JSONStore.get('customers').change(newData, {replaceCriteria: ['_id', '_deleted', '_dirty', '_json'], addNew: true, markDirty: true});
//   })

//   .then(function (res) {
//     ok(false, 'Should not work since using invalid searchCriteria: ' + JSON.stringify(res));
//     start();
//   })

//   .fail(function (err) {

//       deepEqual(err.col, 'customers', 'col');
//       deepEqual(err.doc, {}, 'invalid doc caused the failure');
//       deepEqual(err.err, 32, 'BAD_PARAMETER_WRONG_SEARCH_CRITERIA');
//       deepEqual(JSONStore.getErrorMessage(err.err), 'BAD_PARAMETER_WRONG_SEARCH_CRITERIA', 'err msg');
//       deepEqual(err.res, {}, 'not a server issue');
//       deepEqual(err.usr, 'jsonstore', 'default user');
//       deepEqual(err.src, 'change', 'change caused the issue');
//       start();
//   });

// });

/*
asyncTest('test change with invalid data', 11, function () {

	var collections = {
		customers: {
			searchFields : {id: 'integer'}
		}
	};

	var data = [
		{id: 1, name: 'carlos', age: 1},
		{id: 2, name: 'dgonz', age: 2},
		{id: 3, name: 'mike', age: 3}
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
		return JSONStore.get('customers').count();
	})

	.then(function (res) {

		deepEqual(res, 3, 'all doc count');
		var newData = [
			{_id: 1, id: 1, name: 'CARLOS', age: 1},
			{_id: 3, id: 2, name: 'DGONZ', age: 2},
			{_id: 5, id: 3, name: 'NANA', age: 3}
		];
		return JSONStore.get('customers').change(newData, {replaceCriteria: ['id'], addNew: true, markDirty: true});
	})

	.then(function (res) {
		ok(false, 'Should not work since using invalid data: ' + JSON.stringify(res));
		start();
	})

	.fail(function (err) {

			deepEqual(err.col, 'customers', 'col');
			deepEqual(err.doc, {}, 'invalid doc caused the failure');
			deepEqual(err.err, 10, 'BAD_PARAMETER_EXPECTED_DOCUMENT_OR_ARRAY_OF_DOCUMENTS');
			deepEqual(JSONStore.getErrorMessage(err.err), 'BAD_PARAMETER_EXPECTED_DOCUMENT_OR_ARRAY_OF_DOCUMENTS', 'err msg');
			deepEqual(err.res, {}, 'not a server issue');
			deepEqual(err.usr, 'jsonstore', 'default user');
			deepEqual(err.src, 'change', 'change caused the issue');
			start();
	});

});*/

}(WL, JSON, asyncTest, ok, start, deepEqual, notDeepEqual));
