/*global module, JSON, asyncTest, ok, start, deepEqual, notDeepEqual*/
(function () {

  'use strict';

  module('ClearCollection');

  asyncTest('Trying to clear a closed collection and failing', 4, function () {

    var collections = {
      customers: {
        searchFields : {name: 'string', age: 'integer'}
      }
    };

    var accessor;

    JSONStore.destroy()

    .then(function (res) {

      deepEqual(res, 0, 'destroy');
      return JSONStore.init(collections);
    })

    .then(function (res) {

      accessor = res.customers;
      deepEqual(accessor.name, 'customers');

      return JSONStore.closeAll();
    })

    .then(function (res) {

      deepEqual(res, 0, 'closeAll');
      return accessor.clear();
    })

    .then(function () {

      ok(false, 'should not work because the collection is closed');
      start();
    })

    .fail(function (err) {

      ok(true, 'failed as expected: ' + err.toString());
      start();
    });

  });

  asyncTest('Add data after clearing a collection', 23, function () {

    var collections = {
      customers: {
        searchFields: {name: 'string', age: 'integer'}
      }
    };

    var data = [
      {name: 'carlos', age: 1},
      {name: 'dgonz', age: 2},
      {name: 'mike', age: 3},
      {name: 'nana', age: 4}
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

    .then(function (res){
      deepEqual(res, 4, 'add');
      return JSONStore.get('customers').findAll();
    })

    .then(function (res) {
      deepEqual(res.length, 4, 'length1');

      deepEqual(res[0].json.name, 'carlos', 'name1');
      deepEqual(res[1].json.name, 'dgonz', 'name2');
      deepEqual(res[2].json.name, 'mike', 'name3');
      deepEqual(res[3].json.name, 'nana', 'name4');

      deepEqual(res[0].json.age, 1, 'age1');
      deepEqual(res[1].json.age, 2, 'age2');
      deepEqual(res[2].json.age, 3, 'age3');
      deepEqual(res[3].json.age, 4, 'age4');

      return JSONStore.get('customers').clear();
    })

    .then(function (res) {
      deepEqual(res, 0, 'clear worked');

      var newData = [
        {name: 'CARLOS', age: 4},
        {name: 'DANIEL', age: 5},
        {name: 'MICHAEL', age: 6},
        {name: 'NANA', age: 7}
      ];

      return JSONStore.get('customers').add(newData);
    })

    .then(function (res){
      deepEqual(res, 4, 'add');
      return JSONStore.get('customers').findAll();
    })

    .then(function (res) {
      deepEqual(res.length, 4, 'length2');

      deepEqual(res[0].json.name, 'CARLOS', 'name1');
      deepEqual(res[1].json.name, 'DANIEL', 'name2');
      deepEqual(res[2].json.name, 'MICHAEL', 'name3');
      deepEqual(res[3].json.name, 'NANA', 'name4');

      deepEqual(res[0].json.age, 4, 'age1');
      deepEqual(res[1].json.age, 5, 'age2');
      deepEqual(res[2].json.age, 6, 'age3');
      deepEqual(res[3].json.age, 7, 'age4');

      start();
    })
    .fail(function (err){
      ok(true, 'failed as expected: ' + err.toString());
      start();
    });

  });

  asyncTest('Attempt to clear a collection that has already been cleared', 11, function () {

    var collections = {
        customers: {
          searchFields: {name: 'string', age: 'integer'}
        }
      };

    var data = [
        {name: 'carlos', age: 1},
        {name: 'dgonz', age: 2},
        {name: 'mike', age: 3},
        {name: 'nana', age: 4}
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

    .then(function (res){
      deepEqual(res, 4, 'add');
      return JSONStore.get('customers').findAll();
    })

    .then(function (res) {
      deepEqual(res.length, 4, 'length 1');

      deepEqual(res[0].json.name, 'carlos', 'name1');
      deepEqual(res[1].json.name, 'dgonz', 'name2');
      deepEqual(res[2].json.name, 'mike', 'name3');

      return JSONStore.get('customers').clear();
    })

    .then(function (res) {
      deepEqual(res, 0, 'clear worked');
      return JSONStore.get('customers').findAll();
    })

    .then(function (res){
      deepEqual(res.length, 0, 'length1');
      return JSONStore.get('customers').clear();
    })

    .then(function (res){
      deepEqual(res, 0, 'clear worked again');
      return JSONStore.get('customers').findAll();
    })

    .then(function (res){
      deepEqual(res.length, 0, 'length2');
      start();
    })

    .fail(function (err) {
      ok(false, 'Failure is not an option: ' + err.toString());
      start();
    });

  });




  asyncTest('Happy path clear collection', 9, function () {

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
      return JSONStore.get('customers').findAll();
    })

    .then(function (res) {

      deepEqual(res.length, 3, 'length 1');

      deepEqual(res[0].json.name, 'carlos', 'name1');
      deepEqual(res[1].json.name, 'dgonz', 'name2');
      deepEqual(res[2].json.name, 'mike', 'name3');

      return JSONStore.get('customers').clear();
    })

    .then(function (res) {

      deepEqual(res, 0, 'clear worked');
      return JSONStore.get('customers').findAll();
    })

    .then(function (res) {

      deepEqual(res.length, 0, 'length 2');
      start();
    })

    .fail(function (err) {

      ok(false, 'Failure is not an option: ' + err.toString());
      start();
    });



  });

  asyncTest('Happy path clear multiple collections', 18, function () {

    var collections = {
      customers: {
        searchFields : {name: 'string', age: 'integer'}
      }
    };

    var collections2 = {
      orders: {
        searchFields: {name :'string', id: 'integer'}
      }
    };

    var data = [
      {name: 'carlos', age: 1},
      {name: 'dgonz', age: 2},
      {name: 'mike', age: 3}
    ];

    var data2 = [
      {name: 'JSONStore', id: 1},
      {name: 'Analytics', id: 2}
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
      return JSONStore.get('customers').findAll();
    })

  .then(function (res) {
      deepEqual(res.length, 3, 'length 1');
      deepEqual(res[0].json.name, 'carlos', 'name1');
      deepEqual(res[1].json.name, 'dgonz', 'name2');
      deepEqual(res[2].json.name, 'mike', 'name3');
      return JSONStore.get('customers').clear();
    })

  .then(function (res) {
      deepEqual(res, 0, 'clear worked');
      return JSONStore.get('customers').findAll();
    })

  .then(function (res) {
      deepEqual(res.length, 0, 'length 2');
      return JSONStore.init(collections2);
    })

  .then(function (res){
      deepEqual(res.orders.name, 'orders');
      return JSONStore.get('orders').add(data2);
    })

  .then(function (res){
      deepEqual(res, 2, 'add');
      return JSONStore.get('orders').findAll();
    })

  .then(function (res){
      deepEqual(res.length, 2, 'length 1');
      deepEqual(res[0].json.name, 'JSONStore', 'name1');
      deepEqual(res[1].json.name, 'Analytics', 'name2');

      deepEqual(res[0].json.id, 1, 'id1');
      deepEqual(res[1].json.id, 2, 'id2');

      return JSONStore.get('orders').clear();
    })

  .then(function (res) {
      deepEqual(res, 0, 'clear worked');
      return JSONStore.get('orders').findAll();
    })

  .then(function (res){
      deepEqual(res.length, 0, 'length3');
      start();
    })

  .fail(function (err) {
      ok(false, 'Failure is not an option: ' + err.toString());
      start();
    });
  });


  asyncTest('Happy path clear collection with (deprecated) callbacks', 9, function () {

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
      return JSONStore.get('customers').findAll();
    })

    .then(function (res) {

      deepEqual(res.length, 3, 'length 1');

      deepEqual(res[0].json.name, 'carlos', 'name1');
      deepEqual(res[1].json.name, 'dgonz', 'name2');
      deepEqual(res[2].json.name, 'mike', 'name3');

      return JSONStore.get('customers').clear({onSuccess: function (res) {
        deepEqual(res, 0, 'clear worked');

        JSONStore.get('customers').findAll({
          onSuccess : function (res) {
            deepEqual(res.length, 0, 'length 2');
            start();
          }
        });

      }});
    })

    .fail(function (err) {

      ok(false, 'Failure is not an option: ' + err.toString());
      start();
    });

  });

}(JSON, asyncTest, ok, start, deepEqual, notDeepEqual));