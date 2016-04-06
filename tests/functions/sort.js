/*global module, WL, JSON, asyncTest, ok, start, deepEqual, notDeepEqual*/
(function () {

  'use strict';

  module('Sort');

  asyncTest('Invalid sort objects - pass something other than an array of objects', 4, function () {

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
      return JSONStore.get('customers').find({name: 'carlos'}, {sort: {invalidObj : 'invalid'}});
    })

    .then(function (res) {
      ok(false, 'Should have failed with invalid sort object. Result: ' + JSON.stringify(res));
      start();
    })

    .fail(function (err) {
      ok(true, 'Invalid sort object error caught properly. ' + err.toString());
      start();
    });

  });

  asyncTest('Invalid sort objects - pass an array of objects with more than one property', 4, function () {

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
      return JSONStore.get('customers').find({name: 'carlos'}, {sort: [{name : 'ASC', age : 'DESC'}] });
    })

    .then(function (res) {
      ok(false, 'Should have failed with invalid sort object with more than one property. Result: ' + JSON.stringify(res));
      start();
    })

    .fail(function (err) {
      ok(true, 'Invalid sort object error caught properly when having more than one property in the same object. ' + err.toString());
      start();
    });

  });

  asyncTest('Invalid sort objects - Pass strings other than ASC or DESC', 4, function () {

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
      return JSONStore.get('customers').find({name: 'carlos'}, {sort: [{name : 'wrongString'}] });
    })

    .then(function (res) {
      ok(false, 'Should have failed with invalid sort object. Result: ' + JSON.stringify(res));
      start();
    })

    .fail(function (err) {
      ok(true, 'Invalid sort object error caught properly when passing an object with a string other than ASC or DESC. ' + err.toString());
      start();
    });

  });

  asyncTest('Invalid sort objects - pass fields that are not part of the search fields: ', 4, function () {

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
      return JSONStore.get('customers').find({name: 'carlos'}, {sort: [ {name : 'ASC'}, {invalidProp : 'DESC'} ] });
    })

    .then(function (res) {
      ok(false, 'Should have failed with invalid sort object. Result: ' + JSON.stringify(res));
      start();
    })

    .fail(function (err) {
      ok(true, 'Invalid sort object error caught properly when sorting by a field that is not indexed. ' + err.toString());
      start();
    });

  });

  asyncTest('Valid sort object', 5, function () {

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
      return JSONStore.get('customers').find({name: 'carlos'}, {sort: [ {name : 'ASC'}, {age : 'DESC'} ] });
    })

    .then(function (res) {
      ok(true, 'Passed valid sort parameter. Result: ' + JSON.stringify(res));
      deepEqual(res, [{'_id':3,'json':{'name':'carlos','age':3}},{'_id':1,'json':{'name':'carlos','age':1}}], 'Find results should have age in descending order');
      start();
    })

    .fail(function (err) {
      ok(false, 'Should not have failed, it is a valid sort parameter. ' + err.toString());
      start();
    });

  });

  asyncTest('Sort strings are case insensitive', 5, function () {

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
      return JSONStore.get('customers').find({name: 'carlos'}, {sort: [ {name : 'AsC'}, {age : 'dEsc'} ] });
    })

    .then(function (res) {
      ok(true, 'Sort string is case insensitive. Result: ' + JSON.stringify(res));
      deepEqual(res, [{'_id':3,'json':{'name':'carlos','age':3}},{'_id':1,'json':{'name':'carlos','age':1}}], 'Find results should have age in descending order');
      start();
    })

    .fail(function (err) {
      ok(false, 'Sort strings are not being treated as case insensitive. Error: ' + err.toString());
      start();
    });

  });

  asyncTest('Sort by different fields', 5, function () {

    var collections = {
      customers: {
        searchFields : {name: 'string', age: 'integer', lastname: 'string'}
      }
    };

    var data = [
      {name: 'carlos', age: 1, lastname: 'andreu'},
      {name: 'dgonz', age: 2, lastname: 'gonz'},
      {name: 'carlos', age: 3, lastname: 'test'},
      {name: 'carlos', age: 4, lastname: 'test'}
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
      deepEqual(res, 4, 'add');
      return JSONStore.get('customers').find({name: 'carlos'}, {sort: [ {name : 'ASC'}, {lastname : 'ASC'}, {age : 'DESC'} ] });
    })

    .then(function (res) {
      ok(true, 'Passed valid sort parameter. Result: ' + JSON.stringify(res));
      deepEqual(res, [{'_id':1,'json':{'name':'carlos','age':1, 'lastname':'andreu'}},{'_id':4,'json':{'name':'carlos','age':4, 'lastname':'test'}}, {'_id':3,'json':{'name':'carlos','age':3, 'lastname':'test'}}], 'Find results should have last name in ascending order, age in descending order');
      start();
    })

    .fail(function (err) {
      ok(false, 'Should not have failed, it is a valid sort parameter. ' + err.toString());
      start();
    });

  });

  asyncTest('Sort without limit or offset', 5, function () {

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
      return JSONStore.get('customers').find({name: 'carlos'}, {sort: [ {age : 'ASC'} ] });
    })

    .then(function (res) {
      ok(true, 'Passed valid sort parameter. Result: ' + JSON.stringify(res));
      deepEqual(res, [{'_id':1,'json':{'name':'carlos','age':1}},{'_id':3,'json':{'name':'carlos','age':3}}], 'Find results should have age in ascending order');
      start();
    })

    .fail(function (err) {
      ok(false, 'Should not have failed, it is a valid sort parameter. ' + err.toString());
      start();
    });

  });

  asyncTest('Sort with exact', 5, function () {

    var collections = {
      customers: {
        searchFields : {name: 'string', age: 'integer'}
      }
    };

    var data = [
      {name: 'carlos', age: 1},
      {name: 'dgonz', age: 2},
      {name: 'carl0s', age: 3}
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
      return JSONStore.get('customers').find({name: 'carl'}, {sort: [ {name : 'ASC'}, {age : 'DESC'} ], exact: false });
    })

    .then(function (res) {
      ok(true, 'Passed valid sort parameter. Result: ' + JSON.stringify(res));
      deepEqual(res, [{'_id':3,'json':{'name':'carl0s','age':3}},{'_id':1,'json':{'name':'carlos','age':1}}], 'Find results should have age in descending order');
      start();
    })

    .fail(function (err) {
      ok(false, 'Should not have failed, it is a valid sort parameter. ' + err.toString());
      start();
    });

  });

  asyncTest('Sort with positive limit', 5, function () {

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
      return JSONStore.get('customers').find({name: 'carlos'}, {sort: [ {name : 'ASC'}, {age : 'DESC'} ], limit : 1 });
    })

    .then(function (res) {
      ok(true, 'Passed valid sort parameter. Result: ' + JSON.stringify(res));
      deepEqual(res, [{'_id':3,'json':{'name':'carlos','age':3}}], 'Find results should have age in descending order');
      start();
    })

    .fail(function (err) {
      ok(false, 'Should not have failed, it is a valid sort parameter. ' + err.toString());
      start();
    });

  });

  asyncTest('Sort with limit and offset', 5, function () {

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
      return JSONStore.get('customers').find({name: 'carlos'}, {sort: [ {name : 'ASC'}, {age : 'DESC'} ] , limit : 1, offset : 1});
    })

    .then(function (res) {
      ok(true, 'Passed valid sort parameter. Result: ' + JSON.stringify(res));
      deepEqual(res, [{'_id':1,'json':{'name':'carlos','age':1}}], 'Find results should have age in descending order');
      start();
    })

    .fail(function (err) {
      ok(false, 'Should not have failed, it is a valid sort parameter. ' + err.toString());
      start();
    });

  });

  asyncTest('Sort with findAll, no limit or offset', 5, function () {

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
      return JSONStore.get('customers').find({}, {sort: [ {name : 'ASC'}, {age : 'DESC'} ] });
    })

    .then(function (res) {
      ok(true, 'Passed valid sort parameter. Result: ' + JSON.stringify(res));
      deepEqual(res, [{'_id':3,'json':{'name':'carlos','age':3}},{'_id':1,'json':{'name':'carlos','age':1}},{'_id':2,'json':{'name':'dgonz','age':2}}], 'Find results should have age in descending order');
      start();
    })

    .fail(function (err) {
      ok(false, 'Should not have failed, it is a valid sort parameter. ' + err.toString());
      start();
    });

  });

  asyncTest('Sort with findAll, positive limit', 5, function () {

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
      return JSONStore.get('customers').find({}, {sort: [ {name : 'ASC'}, {age : 'DESC'} ], limit: 1 });
    })

    .then(function (res) {
      ok(true, 'Passed valid sort parameter. Result: ' + JSON.stringify(res));
      deepEqual(res, [{'_id':3,'json':{'name':'carlos','age':3}}], 'Find results should have age in descending order');
      start();
    })

    .fail(function (err) {
      ok(false, 'Should not have failed, it is a valid sort parameter. ' + err.toString());
      start();
    });

  });

  asyncTest('Sort with findAll, limit and offset', 5, function () {

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
      return JSONStore.get('customers').find({}, {sort: [ {name : 'ASC'}, {age : 'DESC'} ] , limit : 1, offset : 2});
    })

    .then(function (res) {
      ok(true, 'Passed valid sort parameter. Result: ' + JSON.stringify(res));
      deepEqual(res, [{'_id':2,'json':{'name':'dgonz','age':2}}], 'Find results should have age in descending order');
      start();
    })

    .fail(function (err) {
      ok(false, 'Should not have failed, it is a valid sort parameter. ' + err.toString());
      start();
    });

  });

  asyncTest('Sorting boolean values properly', 5, function () {

    var collections = {
      customers: {
        searchFields : {name: 'string', issmart: 'boolean'}
      }
    };

    var data = [
      {name: 'carlos', issmart: false},
      {name: 'dgonz', issmart: true},
      {name: 'carlos', issmart: true},
      {name: 'carlos', issmart: false}
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
      deepEqual(res, 4, 'add');
      return JSONStore.get('customers').find({name: 'carlos'}, {sort: [ {issmart: 'DESC'} ] });
    })

    .then(function (res) {
      ok(true, 'Sorted boolean values correctly. Result: ' + JSON.stringify(res));
      deepEqual(res, [{'_id':3,'json':{'name':'carlos','issmart':true}},{'_id':1,'json':{'name':'carlos','issmart':false}}, {'_id':4,'json':{'name':'carlos','issmart':false}}], 'Find results should have \'issmart\' in descending order');
      start();
    })

    .fail(function (err) {
      ok(false, 'Should not have failed, it is a valid sort parameter. ' + err.toString());
      start();
    });

  });

  asyncTest('Test offset greater than number of results', 5, function () {

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
      return JSONStore.get('customers').find({}, {sort: [ {name : 'ASC'}, {age : 'DESC'} ], limit: 1, offset:3 });
    })

    .then(function (res) {
      ok(true, 'Passed valid sort parameter. Result: ' + JSON.stringify(res));
      deepEqual(res, [], 'Find results should have age in descending order');
      start();
    })

    .fail(function (err) {
      ok(false, 'Should not have failed, it is a valid sort parameter. ' + err.toString());
      start();
    });

  });

  asyncTest('Sort using case insensitive SF', 7, function () {
      var collections = {
        people : {
          searchFields : {
            'ORDER' : 'string'
          }
        }
      };

      var data = [
      {'ORDER': 'D'},
      {'ORDER': 'X'},
      {'ORDER': 'A'}
      ];

      JSONStore.destroy()
        .then(function (res) {
          deepEqual(res, 0, 'destroy');
          return JSONStore.init(collections);
        })
        .then(function (res) {
          deepEqual(res.people.name, 'people', 'init');
          return JSONStore.get('people').add(data);
        })
        .then(function (res) {
          deepEqual(res, 3, 'added');
          return JSONStore.get('people').findAll({sort: [{'ORDER': 'ASC'}]});
        })
        .then(function (res) {
          deepEqual(res.length, 3, 'docs');
          deepEqual(res[0].json.ORDER, 'A', 'doc A');
          deepEqual(res[1].json.ORDER, 'D', 'doc D');
          deepEqual(res[2].json.ORDER, 'X', 'doc X');
          start();
        })
        .fail(function (err) {
          ok(false, err.toString());
          start();
        });
    });

}(WL, JSON, asyncTest, ok, start, deepEqual, notDeepEqual));