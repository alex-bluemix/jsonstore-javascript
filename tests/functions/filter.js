/*global module, JSON, asyncTest, ok, start, deepEqual, notDeepEqual, JSONStore_*/
/*jshint -W100*/

/*
Some users, but not the build machines, were affected by jshint error:

  "This character may get silently deleted by one or more browsers."

Hence we have -W100 in th jshint rules.
*/

(function () {

'use strict';

module('Filter');

asyncTest('Happy path filter test 1 - filter by user provided searchfield: name', 11, function () {

    var collections = {
      customers: {
        searchFields : {name: 'string', age: 'integer'}
      }
    };

    var data = [
    {name: 'carlos', age: 1},
    {name: 'dgonz', age: 2},
    {name: 'mike', age: 3}
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
      return JSONStore.get('customers').findAll({filter: ['name']});
    })

    .then(function (res) {

    var undf; //undefined

    deepEqual(res.length, 3);
    deepEqual(JSONStore_.keys(res[0]), ['name']);

    deepEqual(res[0].name, 'carlos', 'first name - carlos');
    deepEqual(res[1].name, 'dgonz', 'second name - dgonz');
    deepEqual(res[2].name, 'mike', 'third name - mike');

    deepEqual(res[0].age, undf, 'first age - undefined');
    deepEqual(res[1].age, undf,   'second age - undefined');
    deepEqual(res[2].age, undf, 'third age - undefined');

    start();
  })

  .fail(function (err) {
    ok(false, 'Should not fail, result: ' + JSON.stringify(err));
    start();
  });

});

asyncTest('Happy path filter test 2 - filter by jsonstore created column _id', 8, function () {

  var collections = {
    customers: {
      searchFields : {name: 'string', age: 'integer'}
    }
  };

  var data = [
  {name: 'carlos', age: 1},
  {name: 'dgonz', age: 2},
  {name: 'mike', age: 3}
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
    return JSONStore.get('customers').findAll({filter: ['_id']});
  })

  .then(function (res) {

    deepEqual(res.length, 3);
    deepEqual(JSONStore_.keys(res[0]), ['_id']);

    deepEqual(res[0]._id, 1, 'first name - carlos');
    deepEqual(res[1]._id, 2, 'second name - dgonz');
    deepEqual(res[2]._id, 3, 'third name - mike');

    start();
  })

  .fail(function (err) {
    ok(false, 'Should not fail, result: ' + JSON.stringify(err));
    start();
  });

});

asyncTest('Happy path filter test 3 - filter by all jsonstore created columns', 21, function () {

  var collections = {
    customers: {
      searchFields : {name: 'string', age: 'integer'}
    }
  };

  var data = [
  {name: 'carlos', age: 1},
  {name: 'dgonz', age: 2},
  {name: 'mike', age: 3}
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
    return JSONStore.get('customers').findAll({filter: ['_id', 'json', '_dirty', '_deleted', '_operation']});
  })

  .then(function (res) {

    deepEqual(res.length, 3, 'check lenth');
    deepEqual(JSONStore_.keys(res[0]).sort(), ['_id', 'json', '_dirty', '_deleted', '_operation'].sort());

    deepEqual(res[0]._id, 1, '_id 1');
    deepEqual(res[1]._id, 2, '_id 2');
    deepEqual(res[2]._id, 3, '_id 3');

    deepEqual(res[0].json, {name: 'carlos', age: 1}, 'json 1');
    deepEqual(res[1].json, {name: 'dgonz', age: 2}, 'json 2');
    deepEqual(res[2].json, {name: 'mike', age: 3}, 'json 3');

    deepEqual(typeof res[0]._dirty, 'string', 'should be a string');
    ok(parseFloat(res[0]._dirty, 10) > 1, '_dirty 1');
    ok(parseFloat(res[1]._dirty, 10) > 1, '_dirty 2');
    ok(parseFloat(res[2]._dirty, 10) > 1, '_dirty 3');

    deepEqual(res[0]._deleted, '0', '_deleted 1');
    deepEqual(res[1]._deleted, '0', '_deleted 2');
    deepEqual(res[2]._deleted, '0', '_deleted 3');

    deepEqual(res[0]._operation, 'add', '_operation 1');
    deepEqual(res[1]._operation, 'add', '_operation 2');
    deepEqual(res[2]._operation, 'add', '_operation 3');

    start();
  })

  .fail(function (err) {
    ok(false, 'Should not fail, result: ' + JSON.stringify(err));
    start();
  });

});

asyncTest('Happy path filter test 4 - filter by additional search field', 6, function () {

  var collections = {
    customers: {
      searchFields : {name: 'string', age: 'integer'},
      additionalSearchFields: {lol: 'string'}
    }
  };

  var data = [
  {name: 'carlos', age: 1},
  {name: 'dgonz', age: 2},
  {name: 'mike', age: 3}
  ];

  JSONStore.destroy()

  .then(function (res) {
    deepEqual(res, 0, 'destroy');
    return JSONStore.init(collections);
  })

  .then(function (res) {
    deepEqual(res.customers.name, 'customers');
    return JSONStore.get('customers').add(data, {additionalSearchFields: {lol: 'hey'}});
  })

  .then(function (res) {
    deepEqual(res, 3, 'add');
    return JSONStore.get('customers').findAll({filter: ['lol']});
  })

  .then(function (res) {
    deepEqual(JSONStore_.keys(res[0]), ['lol']);

      deepEqual(res.length, 1, 'length is 1 because it is a set');
      deepEqual(res[0].lol, 'hey', 'lol 1');

      start();
  })

  .fail(function (err) {
    ok(false, 'Should not fail, result: ' + JSON.stringify(err));
    start();
  });

});

asyncTest('Happy path filter test 5 - filter by jsonstore created column + addSearchField', 11, function () {

  var collections = {
    customers: {
      searchFields : {name: 'string', age: 'integer'},
      additionalSearchFields: {lol: 'string'}
    }
  };

  var data = [
  {name: 'carlos', age: 1},
  {name: 'dgonz', age: 2},
  {name: 'mike', age: 3}
  ];

  JSONStore.destroy()

  .then(function (res) {
    deepEqual(res, 0, 'destroy');
    return JSONStore.init(collections);
  })

  .then(function (res) {
    deepEqual(res.customers.name, 'customers');
    return JSONStore.get('customers').add(data, {additionalSearchFields: {lol: 'hey'}});
  })

  .then(function (res) {
    deepEqual(res, 3, 'add');
    return JSONStore.get('customers').findAll({filter: ['_id', 'lol']});
  })

  .then(function (res) {

    deepEqual(res.length, 3, 'length is 1 because it is a set');
    deepEqual(JSONStore_.keys(res[0]).sort(), ['_id', 'lol'].sort());

    deepEqual(res[0]._id, 1, '_id 1');
    deepEqual(res[1]._id, 2, '_id 2');
    deepEqual(res[2]._id, 3, '_id 3');

    deepEqual(res[0].lol, 'hey', 'lol 1');
    deepEqual(res[1].lol, 'hey', 'lol 2');
    deepEqual(res[2].lol, 'hey', 'lol 3');

    start();
  })

  .fail(function (err) {
    ok(false, 'Should not fail, result: ' + JSON.stringify(err));
    start();
  });

});

asyncTest('Happy path filter test 6 - filtered by nested search field', 8, function () {

  var collections = {
    customers: {
      searchFields : {'name.first': 'string', age: 'integer'},
      additionalSearchFields: {lol: 'string'}
    }
  };

  var data = [
  {name: {first: 'carlos'}, age: 1},
  {name: {first: 'dgonz'}, age: 2},
  {name: {first: 'mike'}, age: 3}
  ];

  JSONStore.destroy()

  .then(function (res) {
    deepEqual(res, 0, 'destroy');
    return JSONStore.init(collections);
  })

  .then(function (res) {
    deepEqual(res.customers.name, 'customers');
    return JSONStore.get('customers').add(data, {additionalSearchFields: {lol: 'hey'}});
  })

  .then(function (res) {
    deepEqual(res, 3, 'add');
    return JSONStore.get('customers').findAll({filter: ['name.first']});
  })

  .then(function (res) {

    deepEqual(res.length, 3, 'length of the results');
    deepEqual(JSONStore_.keys(res[0]), ['name.first']);

    deepEqual(res[0]['name.first'], 'carlos', 'name.first 1');
    deepEqual(res[1]['name.first'], 'dgonz', 'name.first 2');
    deepEqual(res[2]['name.first'], 'mike', 'name.first 3');

    start();
  })

  .fail(function (err) {
    ok(false, 'Should not fail, result: ' + JSON.stringify(err));
    start();
  });

});

asyncTest('Happy path filter test 7 - filter by search field that starts with numbers', 9, function () {

  var collections = {
    customers: {
      searchFields : {'name.first': 'string', '22age': 'integer'},
      additionalSearchFields: {lol: 'string'}
    }
  };

  var data = [
  {name: {first: 'carlos'}, '22age': 1},
  {name: {first: 'dgonz'}, '22age': 2},
  {name: {first: 'mike'}, '22age': 3}
  ];

  JSONStore.destroy()

  .then(function (res) {
    deepEqual(res, 0, 'destroy');
    return JSONStore.init(collections);
  })

  .then(function (res) {
    deepEqual(res.customers.name, 'customers');
    return JSONStore.get('customers').add(data, {additionalSearchFields: {lol: 'hey'}});
  })

  .then(function (res) {
    deepEqual(res, 3, 'add');
    return JSONStore.get('customers').findAll({filter: ['22age']});
  })

  .then(function (res) {

    deepEqual(res.length, 3, 'length of the results');

    deepEqual(typeof res[0]['22age'], 'string', 'should be a string');

    deepEqual(JSONStore_.keys(res[0]), ['22age']);

    deepEqual(res[0]['22age'], '1', 'age 1');
    deepEqual(res[1]['22age'], '2', 'age 2');
    deepEqual(res[2]['22age'], '3', 'age 3');

    start();
  })

  .fail(function (err) {
    ok(false, 'Should not fail, result: ' + JSON.stringify(err));
    start();
  });

});

asyncTest('Happy path filter test 8 - filter by GVT-style search field', 9, function () {

  var collections = {
    customers: {
      searchFields : {'name.first': 'string', '地震に関する編': 'integer'},
      additionalSearchFields: {lol: 'string'}
    }
  };

  var data = [
  {name: {first: 'carlos'}, '地震に関する編': 1},
  {name: {first: 'dgonz'}, '地震に関する編': 2},
  {name: {first: 'mike'}, '地震に関する編': 3}
  ];

  JSONStore.destroy()

  .then(function (res) {
    deepEqual(res, 0, 'destroy');
    return JSONStore.init(collections);
  })

  .then(function (res) {
    deepEqual(res.customers.name, 'customers');
    return JSONStore.get('customers').add(data, {additionalSearchFields: {lol: 'hey'}});
  })

  .then(function (res) {
    deepEqual(res, 3, 'add');
    return JSONStore.get('customers').findAll({filter: ['地震に関する編']});
  })

  .then(function (res) {

    deepEqual(res.length, 3, 'length of the results');
    deepEqual(JSONStore_.keys(res[0]), ['地震に関する編']);

    deepEqual(typeof res[0]['地震に関する編'], 'string', 'should be string');

    deepEqual(res[0]['地震に関する編'], '1', '地震に関する編 1');
    deepEqual(res[1]['地震に関する編'], '2', '地震に関する編 2');
    deepEqual(res[2]['地震に関する編'], '3', '地震に関する編 3');

    start();
  })

  .fail(function (err) {
    ok(false, 'Should not fail, result: ' + JSON.stringify(err));
    start();
  });

});

asyncTest('Happy path filter test 9 - filter by search field that starts with numbers', 9, function () {

  var collections = {
    customers: {
      searchFields : {'name.first': 'string', '22age': 'integer'},
      additionalSearchFields: {lol: 'string'}
    }
  };

  var data = [
    {name: {first: 'carlos'}, '22age': 1},
    {name: {first: 'dgonz'}, '22age': 2},
    {name: {first: 'mike'}, '22age': 3}
  ];

  JSONStore.destroy()

  .then(function (res) {
    deepEqual(res, 0, 'destroy');
    return JSONStore.init(collections);
  })

  .then(function (res) {
    deepEqual(res.customers.name, 'customers');
    return JSONStore.get('customers').add(data, {additionalSearchFields: {lol: 'hey'}});
  })

  .then(function (res) {
    deepEqual(res, 3, 'add');
    return JSONStore.get('customers').findAll({filter: ['22age']});
  })

  .then(function (res) {

    deepEqual(res.length, 3, 'length of the results');
    deepEqual(JSONStore_.keys(res[0]), ['22age']);

    deepEqual(typeof res[0]['22age'], 'string', 'should be a string');

    deepEqual(res[0]['22age'], '1', 'age 1');
    deepEqual(res[1]['22age'], '2', 'age 2');
    deepEqual(res[2]['22age'], '3', 'age 3');

    start();
  })

  .fail(function (err) {
    ok(false, 'Should not fail, result: ' + JSON.stringify(err));
    start();
  });

});

asyncTest('Happy path filter test 10 - filter by search field + use limit', 7, function () {

  var collections = {
    customers: {
      searchFields : {'name.first': 'string', '地震に関する編': 'integer', 'bool' : 'boolean'},
      additionalSearchFields: {lol: 'string'}
    }
  };

  var data = [
  {name: {first: 'carlos'}, '地震に関する編': 1, bool: true},
  {name: {first: 'dgonz'}, '地震に関する編': 2, bool: false},
  {name: {first: 'mike'}, '地震に関する編': 3, bool: true}
  ];

  JSONStore.destroy()

  .then(function (res) {
    deepEqual(res, 0, 'destroy');
    return JSONStore.init(collections);
  })

  .then(function (res) {
    deepEqual(res.customers.name, 'customers');
    return JSONStore.get('customers').add(data, {additionalSearchFields: {lol: 'hey'}});
  })

  .then(function (res) {
    deepEqual(res, 3, 'add');
    return JSONStore.get('customers').findAll({filter: ['bool'], limit: 1});
  })

  .then(function (res) {

    deepEqual(res.length, 1, 'length of the results, 2 because it returns a set');
    deepEqual(JSONStore_.keys(res[0]), ['bool']);

    deepEqual(typeof res[0].bool, 'string', 'should be a string');
    deepEqual(res[0].bool, '1', 'bool 1');

    start();
  })

  .fail(function (err) {
    ok(false, 'Should not fail, result: ' + JSON.stringify(err));
    start();
  });

});

asyncTest('Happy path filter test 11 - filter by SF and use limit + sort', 10, function () {

  var collections = {
    customers: {
      searchFields : {'name.first': 'string', '地震に関する編': 'integer', 'bool' : 'boolean'},
      additionalSearchFields: {lol: 'string'}
    }
  };

  var data = [
  {name: {first: 'carlos'}, '地震に関する編': 1, bool: true},
  {name: {first: 'dgonz'}, '地震に関する編': 2, bool: false},
  {name: {first: 'mike'}, '地震に関する編': 3, bool: true}
  ];

  JSONStore.destroy()

  .then(function (res) {
    deepEqual(res, 0, 'destroy');
    return JSONStore.init(collections);
  })

  .then(function (res) {
    deepEqual(res.customers.name, 'customers');
    return JSONStore.get('customers').add(data, {additionalSearchFields: {lol: 'hey'}});
  })

  .then(function (res) {
    deepEqual(res, 3, 'add');
    return JSONStore.get('customers').findAll({filter: ['name.first', 'bool'], limit: 2, sort:[{'name.first': 'DESC'}]});
  })

  .then(function (res) {

    deepEqual(res.length, 2, 'length of the results');
    deepEqual(JSONStore_.keys(res[0]).sort(), ['name.first', 'bool'].sort());

    deepEqual(res[0]['name.first'], 'mike', 'name.first 1');
    deepEqual(res[1]['name.first'], 'dgonz', 'name.first 2');

    deepEqual(typeof res[0].bool, 'string', 'should be a string');
    deepEqual(res[0].bool, '1', 'bool 1');
    deepEqual(res[1].bool, '0', 'bool 2');

    start();
  })

  .fail(function (err) {
    ok(false, 'Should not fail, result: ' + JSON.stringify(err));
    start();
  });

});

asyncTest('Happy path filter test 12 - filter by nested searchfield + sf and use limit, offset and sort', 9, function () {

  var collections = {
    customers: {
      searchFields : {'name.first': 'string', '地震に関する編': 'integer', 'bool' : 'boolean'},
      additionalSearchFields: {lol: 'string'}
    }
  };

  var data = [
  {name: {first: 'carlos'}, '地震に関する編': 1, bool: true},
  {name: {first: 'dgonz'}, '地震に関する編': 2, bool: false},
  {name: {first: 'mike'}, '地震に関する編': 3, bool: true}
  ];

  JSONStore.destroy()

  .then(function (res) {
    deepEqual(res, 0, 'destroy');
    return JSONStore.init(collections);
  })

  .then(function (res) {
    deepEqual(res.customers.name, 'customers');
    return JSONStore.get('customers').add(data, {additionalSearchFields: {lol: 'hey'}});
  })

  .then(function (res) {
    deepEqual(res, 3, 'add');
    return JSONStore.get('customers').findAll({filter: ['name.first', 'bool'], limit: 2, offset: 1, sort:[{'name.first': 'DESC'}]});
  })

  .then(function (res) {

    deepEqual(res.length, 2, 'length of the results');
    deepEqual(JSONStore_.keys(res[0]).sort(), ['name.first', 'bool'].sort());

    deepEqual(res[0]['name.first'], 'dgonz', 'name.first 1');
    deepEqual(res[1]['name.first'], 'carlos', 'name.first 2');

    deepEqual(res[0].bool, '0', 'bool 1');
    deepEqual(res[1].bool, '1', 'bool 2');

    start();
  })

  .fail(function (err) {
    ok(false, 'Should not fail, result: ' + JSON.stringify(err));
    start();
  });

});

asyncTest('Happy path filter test 13 - check filter with empty collection', 4, function () {

  var collections = {
    customers: {
      searchFields : {'name.first': 'string', '地震に関する編': 'integer', 'bool' : 'boolean'},
      additionalSearchFields: {lol: 'string'}
    }
  };

  JSONStore.destroy()

  .then(function (res) {
    deepEqual(res, 0, 'destroy');
    return JSONStore.init(collections);
  })

  .then(function (res) {
    deepEqual(res.customers.name, 'customers');
    return JSONStore.get('customers').findAll({filter: ['bool']});
  })

  .then(function (res) {

    deepEqual(res.length, 0, 'length of the results');
    deepEqual(res, [], 'empty result set');

    start();
  })

  .fail(function (err) {
    ok(false, 'Should not fail, result: ' + JSON.stringify(err));
    start();
  });

});

asyncTest('Happy path filter test 14 - filter by nested SF and sort', 7, function () {

  var collections = {
    customers: {
      searchFields : {'name.first': 'string', '地震に関する編': 'integer', 'bool' : 'boolean'},
      additionalSearchFields: {lol: 'string'}
    }
  };

  var data = [
  {name: {first: 'carlos'}, '地震に関する編': 1, bool: true},
  {name: {first: 'dgonz'}, '地震に関する編': 2, bool: false},
  {name: {first: 'mike'}, '地震に関する編': 3, bool: true}
  ];

  JSONStore.destroy()

  .then(function (res) {
    deepEqual(res, 0, 'destroy');
    return JSONStore.init(collections);
  })

  .then(function (res) {
    deepEqual(res.customers.name, 'customers');
    return JSONStore.get('customers').add(data, {additionalSearchFields: {lol: 'hey'}});
  })

  .then(function (res) {
    deepEqual(res, 3, 'add');
    return JSONStore.get('customers').find({bool: true}, {filter: ['name.first'], sort:[{'name.first': 'DESC'}]});
  })

  .then(function (res) {

    deepEqual(res.length, 2, 'length of the results');
    deepEqual(JSONStore_.keys(res[0]), ['name.first']);

    deepEqual(res[0]['name.first'], 'mike', 'name.first 1');
    deepEqual(res[1]['name.first'], 'carlos', 'name.first 2');

    start();
  })

  .fail(function (err) {
    ok(false, 'Should not fail, result: ' + JSON.stringify(err));
    start();
  });

});

asyncTest('Happy path filter test 15 - filter by multiple nested SF, mulitple ASF and sort', 10, function () {

  var collections = {
    customers: {
     searchFields : {'name.last': 'string', 'name.first': 'string', '地震に関する編': 'integer', 'bool' : 'boolean'},
     additionalSearchFields: {lol: 'string', noob: 'string'}
    }
  };

  var data = [
  {name: {first: 'carlos'}, '地震に関する編': 1, bool: true},
  {name: {first: 'dgonz'}, '地震に関する編': 2, bool: false},
  {name: {first: 'mike'}, '地震に関する編': 3, bool: true}
  ];

  JSONStore.destroy()

  .then(function (res) {
    deepEqual(res, 0, 'destroy');
    return JSONStore.init(collections);
  })

  .then(function (res) {
    deepEqual(res.customers.name, 'customers');
    return JSONStore.get('customers').add(data, {additionalSearchFields: {lol: 'hey', noob: 'fine'}});
  })

  .then(function (res) {
    deepEqual(res, 3, 'add');
    return JSONStore.get('customers').find({bool: true}, {filter: ['name.first'], sort:[{'name.first': 'DESC'}]});
  })

  .then(function (res) {

    deepEqual(res.length, 2, 'length of the results');
    deepEqual(JSONStore_.keys(res[0]), ['name.first']);

    deepEqual(res[0]['name.first'], 'mike', 'name.first 1');
    deepEqual(res[1]['name.first'], 'carlos', 'name.first 2');

    return JSONStore.get('customers').findAll({filter: ['lol', 'noob']});

  })

  .then(function (res) {

    deepEqual(JSONStore_.keys(res[0]), ['lol', 'noob']);

    deepEqual(res[0].lol, 'hey', 'lol 1');
    deepEqual(res[0].noob, 'fine', 'noob 1');

    start();
  })

  .fail(function (err) {
    ok(false, 'Should not fail, result: ' + JSON.stringify(err));
    start();
  });

});

asyncTest('Happy path test 16 - passed symbol to SF', 8, function () {

  var collections = {
    customers: {
      searchFields : {'[name;': 'string', age: 'integer'}
    }
  };

  var data = [
  {'[name;': 'carlos', age: 1},
  {'[name;': 'dgonz', age: 2},
  {'[name;': 'mike', age: 3}
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
    return JSONStore.get('customers').findAll({filter: ['[name;']});
  })

  .then(function (res) {

    deepEqual(res.length, 3, 'res count');
    deepEqual(JSONStore_.keys(res[0]), ['[name;']);


    deepEqual(res[0]['[name;'], 'carlos', '[name; 1');
    deepEqual(res[1]['[name;'], 'dgonz', '[name; 2');
    deepEqual(res[2]['[name;'], 'mike', '[name; 2');

    start();
  })

  .fail(function (err) {
    ok(false, 'Should not fail, result: ' + JSON.stringify(err));
    start();
  });

});

asyncTest('Happy path filter test 17 - filter with nested indexing', 6, function () {

  var collections = {
    customers: {
      searchFields : {name: 'string', age: 'integer', 'order.name' : 'string'}
    }
  };

  var data = [
    {name: 'carlos', age: 1, order: [{name: 'hey'}, {name: 'hello'}, {name: 'hola'}] }
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
    deepEqual(res, 1, 'add');
    return JSONStore.get('customers').findAll({filter: ['order.name']});
  })

  .then(function (res) {

    deepEqual(res.length, 1);

    deepEqual(JSONStore_.keys(res[0]), ['order.name']);

    deepEqual(res[0]['order.name'].split('-@-').sort(), ['hey', 'hello', 'hola'].sort(), 'check results');

    start();
  })

  .fail(function (err) {
    ok(false, 'Should not fail, result: ' + JSON.stringify(err));
    start();
  });

});

asyncTest('Happy path filter test 18 - filter with nested indexing with more than one data item', 8, function () {

  var collections = {
    customers: {
      searchFields : {name: 'string', age: 'integer', 'order.name' : 'string'}
    }
  };

  var data = [
    {name: 'carlos', age: 1, order: [{name: 'hey'}, {name: 'hello'}, {name: 'hola'}] },
    {name: 'mike', age: 2, order: [{name: 'uno'}, {name: 'dos'}, {name: 'tres'}] },
    {name: 'nana', age: 3, order: [{name: 'one'}, {name: 'two'}, {name: 'three'}] }
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
    return JSONStore.get('customers').findAll({filter: ['order.name']});
  })

  .then(function (res) {

    deepEqual(res.length, 3);

    deepEqual(JSONStore_.keys(res[0]), ['order.name']);

    deepEqual(res[0]['order.name'].split('-@-').sort(), ['hey', 'hello', 'hola'].sort(), 'check results 1');
    deepEqual(res[1]['order.name'].split('-@-').sort(), ['uno', 'dos', 'tres'].sort(), 'check results 2');
    deepEqual(res[2]['order.name'].split('-@-').sort(), ['one', 'two', 'three'].sort(), 'check results 3');

    start();
  })

  .fail(function (err) {
    ok(false, 'Should not fail, result: ' + JSON.stringify(err));
    start();
  });

});

asyncTest('Fail path filter test 1 - undefined searchfield', 5, function () {

  var collections = {
    customers: {
      searchFields : {name: 'string', age: 'integer'}
    }
  };

  var data = [
  {name: 'carlos', age: 1},
  {name: 'dgonz', age: 2},
  {name: 'mike', age: 3}
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
    return JSONStore.get('customers').findAll({filter: ['undefinedSearchField']});
  })

  .then(function (res) {
    ok(false, 'Should not work, res: ' + JSON.stringify(res));
    start();
  })

  .fail(function (err) {
    deepEqual(err.msg, 'INVALID_FILTER_ARRAY', 'Failed as expected with msg: ' + err.msg);
    deepEqual(err.err, 29, 'Failed as expected with err code:' + err.err);
    start();
  });

});


asyncTest('Fail path filter test 2 - invalid type in filter array', 5, function () {

  var collections = {
    customers: {
      searchFields : {name: 'string', age: 'integer'}
    }
  };

  var data = [
  {name: 'carlos', age: 1},
  {name: 'dgonz', age: 2},
  {name: 'mike', age: 3}
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
    return JSONStore.get('customers').findAll({filter: [true]});
  })

  .then(function (res) {
    ok(false, 'Should not work, res: ' + JSON.stringify(res));
    start();
  })

  .fail(function (err) {
    deepEqual(err.msg, 'INVALID_FILTER_ARRAY', 'Failed as expected with msg: ' + err.msg);
    deepEqual(err.err, 29, 'Failed as expected with err code:' + err.err);
    start();
  });

});

asyncTest('Fail path filter test 3 - object instead of string inside filter array', 5, function () {

  var collections = {
    customers: {
      searchFields : {name: 'string', age: 'integer'}
    }
  };

  var data = [
  {name: 'carlos', age: 1},
  {name: 'dgonz', age: 2},
  {name: 'mike', age: 3}
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
    return JSONStore.get('customers').findAll({filter: [{hello: 'world'}]});
  })

  .then(function (res) {
    ok(false, 'Should not work, res: ' + JSON.stringify(res));
    start();
  })

  .fail(function (err) {
    deepEqual(err.msg, 'INVALID_FILTER_ARRAY', 'Failed as expected with msg: ' + err.msg);
    deepEqual(err.err, 29, 'Failed as expected with err code:' + err.err);
    start();
  });

});

asyncTest('Fail path filter test 3 - passed boolean instead of array to filter key', 5, function () {

  var collections = {
    customers: {
      searchFields : {name: 'string', age: 'integer'}
    }
  };

  var data = [
  {name: 'carlos', age: 1},
  {name: 'dgonz', age: 2},
  {name: 'mike', age: 3}
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
    return JSONStore.get('customers').findAll({filter: true});
  })

  .then(function (res) {
    ok(false, 'Should not work, res: ' + JSON.stringify(res));
    start();
  })

  .fail(function (err) {
    deepEqual(err.msg, 'INVALID_FILTER_ARRAY', 'Failed as expected with msg: ' + err.msg);
    deepEqual(err.err, 29, 'Failed as expected with err code:' + err.err);
    start();
  });

});

}(JSON, asyncTest, ok, start, deepEqual, notDeepEqual));