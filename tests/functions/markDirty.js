/*global module, JSON, asyncTest, ok, start, deepEqual, notDeepEqual, JSONStore_*/
(function () {

  'use strict';

  module('MarkDirty');

  asyncTest('test add with markDirty true', 16, function () {

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
      return JSONStore.get('customers').add(data, {markDirty: true});
    })

    .then(function (res) {
      deepEqual(res, 3, 'add');
      return JSONStore.get('customers').getAllDirty();
    })

    .then(function (res) {

      deepEqual(JSONStore_.keys(res[0]).sort(), ['_id', 'json', '_dirty', '_operation'].sort());

      deepEqual(typeof res[0], 'object', 'should be an obj');
      ok(typeof res[0]._dirty !== 'undefined', 'should be defined');
      deepEqual(typeof res[0]._id, 'number', 'should be an num');
      deepEqual(typeof res[0]._operation, 'string', 'should be a string');
      deepEqual(typeof res[0].json, 'object', 'should be an obj');

      deepEqual(res.length, 3, 'dirty doc length');

      deepEqual(res[0].json.name, 'carlos', 'name1');
      deepEqual(res[1].json.name, 'dgonz', 'name2');
      deepEqual(res[2].json.name, 'mike', 'name3');

      deepEqual(res[0].json.age, 1, 'age1');
      deepEqual(res[1].json.age, 2, 'age2');
      deepEqual(res[2].json.age, 3, 'age3');

      start();
    })

    .fail(function (err) {
      ok(false, 'Failure is not an option: ' + err.toString());
      start();
    });

  });

  asyncTest('test add with markDirty false', 11, function () {

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
      return JSONStore.get('customers').add(data, {markDirty: false});
    })

    .then(function (res) {
      deepEqual(res, 3, 'add');
      return JSONStore.get('customers').getAllDirty();
    })

    .then(function (res) {

      deepEqual(res.length, 0, 'dirty doc length');

      return JSONStore.get('customers').findAll();
    })

    .then(function (res) {

      deepEqual(res.length, 3, 'dirty doc length');

      deepEqual(res[0].json.name, 'carlos', 'name1');
      deepEqual(res[1].json.name, 'dgonz', 'name2');
      deepEqual(res[2].json.name, 'mike', 'name3');

      deepEqual(res[0].json.age, 1, 'age1');
      deepEqual(res[1].json.age, 2, 'age2');
      deepEqual(res[2].json.age, 3, 'age3');

      start();
    })

    .fail(function (err) {
      ok(false, 'Failure is not an option: ' + err.toString());
      start();
    });

  });

  asyncTest('test replace with markDirty true', 9, function () {

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
      return JSONStore.get('customers').add(data, {markDirty: false});
    })

    .then(function (res) {
      deepEqual(res, 3, 'add');
      return JSONStore.get('customers').getAllDirty();
    })

    .then(function (res) {

      deepEqual(res.length, 0, 'dirty doc length 1');

      return JSONStore.get('customers').replace({_id: 1, json: {name: 'CARLOSANDREU', age: 99}}, {markDirty: true});
    })

    .then(function (res) {

      deepEqual(res, 1, 'num of replacements');

      return JSONStore.get('customers').getAllDirty();
    })

    .then(function (res) {

      deepEqual(res.length, 1, 'dirty doc length 2');
      deepEqual(JSONStore_.keys(res[0]).sort(), ['_id', 'json', '_dirty', '_operation'].sort());

      deepEqual(res[0].json.name, 'CARLOSANDREU', 'check name');
      deepEqual(res[0].json.age, 99, 'check age');

      start();
    })

    .fail(function (err) {
      ok(false, 'Failure is not an option: ' + err.toString());
      start();
    });

  });

  asyncTest('test replace with markDirty false', 13, function () {

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
      return JSONStore.get('customers').add(data, {markDirty: false});
    })

    .then(function (res) {
      deepEqual(res, 3, 'add');
      return JSONStore.get('customers').getAllDirty();
    })

    .then(function (res) {

      deepEqual(res.length, 0, 'dirty doc length 1');

      return JSONStore.get('customers').replace({_id: 1, json: {name: 'CARLOSANDREU', age: 99}}, {markDirty: false});
    })

    .then(function (res) {

      deepEqual(res, 1, 'num of replacements');

      return JSONStore.get('customers').getAllDirty();
    })

    .then(function (res) {

      deepEqual(res.length, 0, 'dirty doc length 1');

      return JSONStore.get('customers').findAll();
    })

    .then(function (res) {

      deepEqual(res.length, 3, 'length of findAll results');

      deepEqual(res[0].json.name, 'CARLOSANDREU', 'check name');
      deepEqual(res[0].json.age, 99, 'check age');

      deepEqual(res[1].json.name, 'dgonz', 'check name');
      deepEqual(res[1].json.age, 2, 'check age');

      deepEqual(res[2].json.name, 'mike', 'check name');
      deepEqual(res[2].json.age, 3, 'check age');

      start();
    })

    .fail(function (err) {
      ok(false, 'Failure is not an option: ' + err.toString());
      start();
    });

  });

  asyncTest('test remove with markDirty true', 13, function () {

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
      return JSONStore.get('customers').add(data, {markDirty: false});
    })

    .then(function (res) {
      deepEqual(res, 3, 'add');
      return JSONStore.get('customers').getAllDirty();
    })

    .then(function (res) {

      deepEqual(res.length, 0, 'dirty doc length 1');

      return JSONStore.get('customers').remove({_id: 1, json: {name: 'carlos', age: 1}}, {markDirty: true});
    })

    .then(function (res) {

      deepEqual(res, 1, 'num removed');

      return JSONStore.get('customers').getAllDirty();
    })

    .then(function (res) {

      deepEqual(res.length, 1, 'dirty doc length 1');

      deepEqual(res[0].json.name, 'carlos', 'check name');
      deepEqual(res[0].json.age, 1, 'check age');

      return JSONStore.get('customers').findAll();
    })

    .then(function (res) {

      deepEqual(res.length, 2, 'length of findAll results');

      deepEqual(res[0].json.name, 'dgonz', 'check name');
      deepEqual(res[0].json.age, 2, 'check age');

      deepEqual(res[1].json.name, 'mike', 'check name');
      deepEqual(res[1].json.age, 3, 'check age');

      start();
    })

    .fail(function (err) {
      ok(false, 'Failure is not an option: ' + err.toString());
      start();
    });

  });

  asyncTest('test remove with markDirty false', 11, function () {

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
      return JSONStore.get('customers').add(data, {markDirty: false});
    })

    .then(function (res) {
      deepEqual(res, 3, 'add');
      return JSONStore.get('customers').getAllDirty();
    })

    .then(function (res) {

      deepEqual(res.length, 0, 'dirty doc length 1');

      return JSONStore.get('customers').remove({_id: 1, json: {name: 'carlos', age: 1}}, {markDirty: false});
    })

    .then(function (res) {

      deepEqual(res, 1, 'num removed');

      return JSONStore.get('customers').getAllDirty();
    })

    .then(function (res) {

      deepEqual(res.length, 0, 'dirty doc length 1');

      return JSONStore.get('customers').findAll();
    })

    .then(function (res) {

      deepEqual(res.length, 2, 'length of findAll results');

      deepEqual(res[0].json.name, 'dgonz', 'check name');
      deepEqual(res[0].json.age, 2, 'check age');

      deepEqual(res[1].json.name, 'mike', 'check name');
      deepEqual(res[1].json.age, 3, 'check age');

      start();
    })

    .fail(function (err) {
      ok(false, 'Failure is not an option: ' + err.toString());
      start();
    });

  });

  asyncTest('Remove dirty doc', 9, function () {

    var collections = {
      people: {
        searchFields : {name: 'string'}
      }
    };

    JSONStore.destroy()

    .then(function (res) {
      deepEqual(res, 0, 'destroy');
      return JSONStore.init(collections);
    })

    .then(function (res) {
      deepEqual(res.people.name, 'people');
      return JSONStore.get('people').store({name: 'carlos'});
    })

    .then(function (res) {
      deepEqual(res, 1, 'add');
      return JSONStore.get('people').remove({_id: 1, json: {name: 'carlos'}}, {markDirty: true});
    })

    .then(function (res) {
      deepEqual(res, 1, 'remove');
      return JSONStore.get('people').findAll();
    })

    .then(function (res) {
      deepEqual(res.length, 0, 'no docs');
      return JSONStore.get('people').getAllDirty();
    })

    .then(function (dirtyDocs) {

      deepEqual(dirtyDocs.length, 1, 'dirty doc length 1');
      return JSONStore.get('people').remove(dirtyDocs, {markDirty: false});
    })

    .then(function (res) {
      deepEqual(res, 0, 'remove');
      return JSONStore.get('people').findAll();
    })

    .then(function (res) {
      deepEqual(res.length, 0, 'no docs');
      return JSONStore.get('people').getAllDirty();
    })
    .then(function (dirtyDocs) {
      deepEqual(dirtyDocs.length, 1, 'no dirty docs');
      start();
    })

    .fail(function (err) {
      ok(false, 'Failure is not an option: ' + err.toString());
      start();
    });


});

}(JSON, asyncTest, ok, start, deepEqual, notDeepEqual, JSONStore_));