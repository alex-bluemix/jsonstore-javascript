/*global module, JSON, asyncTest, ok, start, deepEqual, notDeepEqual*/
(function () {

  'use strict';

  module('Clean');

  asyncTest('Clean all dirty documents', 10, function () {

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
      return JSONStore.get('customers').change(data, {markDirty: true, addNew: true});
    })

    .then(function (res) {

      deepEqual(res, 3, 'add');
      return JSONStore.get('customers').findAll();
    })

    .then(function (res) {

      deepEqual(res.length, 3, 'length 1');

      deepEqual(res[0].json.name, 'carlos', 'name1');
      deepEqual(res[1].json.name, 'dgonz', 'name2');
      deepEqual(res[2].json.name, 'mike', 'name3');

      return JSONStore.get('customers').getAllDirty();
    })

    .then(function (res) {

      deepEqual(res.length, 3, 'all dirty');
      return JSONStore.get('customers').markClean(res);
    })

    .then(function (res) {

      deepEqual(res, 3, 'clean');
      return JSONStore.get('customers').countAllDirty();
    })

    .then(function (res) {

      deepEqual(res, 0, 'none dirty');
      start();
    })

    .fail(function (err) {

      ok(false, 'Failure is not an option: ' + err.toString());
      start();
    });

  });

  asyncTest('Clean with empty data', 4, function () {
     var collections = {
      customers: {
        searchFields : {name: 'string', age: 'integer'}
      }
    };

    JSONStore.destroy()

    .then(function (res) {

      deepEqual(res, 0, 'destroy');
      return JSONStore.init(collections);
    })

    .then(function (res) {

      deepEqual(res.customers.name, 'customers');
      return JSONStore.get('customers').markClean([{}]);
    })
    .then(function (err) {
     ok(false, 'Should fail since there should a document ' + err.toString());
      start();
    })
    .fail(function (err) {
       deepEqual(err.msg, 'BAD_PARAMETER_EXPECTED_ARRAY_OF_CLEAN_DOCUMENTS', 'Failed as expected with msg: ' + err.msg);
    deepEqual(err.err, 31, 'Failed as expected with err code:' + err.err);
      start();
    });

  });

  asyncTest('Clean with empty array', 3, function () {
   var collections = {
    customers: {
      searchFields : {name: 'string', age: 'integer'}
    }
  };

  JSONStore.destroy()

  .then(function (res) {

    deepEqual(res, 0, 'destroy');
    return JSONStore.init(collections);
  })

  .then(function (res) {

    deepEqual(res.customers.name, 'customers');
    return JSONStore.get('customers').markClean([]);
  })
  .then(function (res) {
    deepEqual(res, 0, 'none clean');
    start();
  })
  .fail(function (err) {
    ok(false, 'Failure is not an option: ' + err.toString());
    start();
  });

  });

  asyncTest('Clean some dirty documents', 10, function () {

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
      return JSONStore.get('customers').change(data, {markDirty: true, addNew: true});
    })

    .then(function (res) {

      deepEqual(res, 3, 'add');
      return JSONStore.get('customers').findAll();
    })

    .then(function (res) {

      deepEqual(res.length, 3, 'length 1');

      deepEqual(res[0].json.name, 'carlos', 'name1');
      deepEqual(res[1].json.name, 'dgonz', 'name2');
      deepEqual(res[2].json.name, 'mike', 'name3');

      return JSONStore.get('customers').getAllDirty();
    })

    .then(function (res) {

      deepEqual(res.length, 3, 'all dirty');
      var partial = [res[0], res[1]];
      return JSONStore.get('customers').markClean(partial);
    })

    .then(function (res) {

      deepEqual(res, 2, 'clean');
      return JSONStore.get('customers').countAllDirty();
    })

    .then(function (res) {

      deepEqual(res, 1, 'one still dirty');
      start();
    })

    .fail(function (err) {

      ok(false, 'Failure is not an option: ' + err.toString());
      start();
    });

  });
  asyncTest('Attempt to clean an invalid document', 15, function () {

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
      return JSONStore.get('customers').change(data, {markDirty: true, addNew: true});
    })

    .then(function (res) {

      deepEqual(res, 3, 'add');
      return JSONStore.get('customers').findAll();
    })

    .then(function (res) {

      deepEqual(res.length, 3, 'length 1');

      deepEqual(res[0].json.name, 'carlos', 'name1');
      deepEqual(res[1].json.name, 'dgonz', 'name2');
      deepEqual(res[2].json.name, 'mike', 'name3');

      return JSONStore.get('customers').getAllDirty();
    })

    .then(function (res) {

      deepEqual(res.length, 3, 'all dirty');
      return JSONStore.get('customers').markClean('invalidDocument');
    })

    .then(function (res) {
      ok(false, 'Should fail since it is not a valid clean document: ' + JSON.stringify(res));
      start();
    })
    .fail(function (err) {
      deepEqual(err.col, 'customers', 'col');
      deepEqual(err.doc, {}, 'invalid doc caused the failure');
      deepEqual(err.err, 31, 'BAD_PARAMETER_EXPECTED_ARRAY_OF_CLEAN_DOCUMENTS');
      deepEqual(JSONStore.getErrorMessage(err.err), 'BAD_PARAMETER_EXPECTED_ARRAY_OF_CLEAN_DOCUMENTS', 'err msg');
      deepEqual(err.res, {}, 'not a server issue');
      deepEqual(err.usr, 'jsonstore', 'default user');
      deepEqual(err.src, 'markClean', 'markClean caused the issue');
      start();
    });

  });

}(JSON, asyncTest, ok, start, deepEqual, notDeepEqual));