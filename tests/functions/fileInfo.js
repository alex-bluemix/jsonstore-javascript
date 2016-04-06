
/* JavaScript content from tests/functions/fileInfo.js in folder common */
/*global module, JSONStore_, JSON, asyncTest, ok, start, deepEqual, notDeepEqual*/
(function () {

  'use strict';

  module('FileInfo');

  var browser = JSONStoreUtil.browser;

  asyncTest('No JSONStore fileInfo', 2, function () {

    JSONStore.destroy()

    .then(function (res) {
      deepEqual(res, 0, 'destroy');
      return JSONStore.fileInfo();
    })

    .then(function (res) {
      deepEqual(res, [], 'check no file info');
      start();
    })

    .fail(function (err) {
      ok(false, 'Failure is not an option: ' + JSON.stringify(err));
      start();
    });

  });

  asyncTest('Basic file info test', 10, function () {

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
      return JSONStore.fileInfo();
    })

    .then(function (res) {

      deepEqual(res.length, 1, 'check length');

      deepEqual(typeof res[0].name, 'string', 'check file name type');
      deepEqual(res[0].name, 'jsonstore', 'check file name');

      deepEqual(typeof res[0].size, 'number', 'check size type');
      if(browser){
        ok(res[0].size < 5242880 && res[0].size > 200, 'jsonstore', 'check size');
        
      } else {
        ok(res[0].size < 5000 && res[0].size > 3000, 'jsonstore', 'check size');
      }
      
      deepEqual(typeof res[0].isEncrypted, 'boolean', 'check isEncrypted type');
      deepEqual(res[0].isEncrypted, false, 'check isEncrypted value');

      start();
    })

    .fail(function (err) {
      ok(false, 'Failure is not an option: ' + JSON.stringify(err));
      start();
    });

  });


  asyncTest('Basic file info test with 2 files', 18, function () {

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
      deepEqual(res.customers.name, 'customers', 'init');
      return JSONStore.get('customers').add(data);
    })

    .then(function (res) {
      deepEqual(res, 3, 'add');
      return JSONStore.closeAll();
    })

    .then(function (res) {

      deepEqual(res, 0, 'closeAll');

      var collections2 = {
        people : {
          searchFields : {}
        }
      };

      var options = {
        username : 'carlos',
        password : '123'
      };

      return JSONStore.init(collections2, options);
    })

    .then(function (res) {
      deepEqual(res.people.name, 'people', 'init');
      return JSONStore.fileInfo();
    })

    .then(function (res) {

      res = JSONStore_.sortBy(res, 'name');
      deepEqual(res.length, 2, 'check length');

      //First file

      deepEqual(typeof res[0].name, 'string', 'check file name type');
      deepEqual(res[0].name, 'carlos', 'check file name');

      deepEqual(typeof res[0].size, 'number', 'check size type');
      deepEqual(typeof res[0].isEncrypted, 'boolean', 'check isEncrypted type');
   
      if(browser){
        deepEqual(res[0].isEncrypted, false, 'check isEncrypted value');
        ok(res[0].size < 5242880 && res[0].size > 200, 'carlos', 'check size');
      } else {
        deepEqual(res[0].isEncrypted, true, 'check isEncrypted value');
        ok(res[0].size < 5000 && res[0].size > 3000, 'carlos', 'check size');
      }
      
     
      //Second file

      deepEqual(typeof res[1].name, 'string', 'check file name type');
      deepEqual(res[1].name, 'jsonstore', 'check file name');

      deepEqual(typeof res[1].size, 'number', 'check size type');
      deepEqual(typeof res[1].isEncrypted, 'boolean', 'check isEncrypted type');


      if(browser){
        deepEqual(res[1].isEncrypted, false, 'check is isEncrypted value');
        ok(res[1].size < 5242880 && res[1].size > 200, 'jsonstore');
      } else {
        deepEqual(res[1].isEncrypted, false, 'check isEncrypted value');
        ok(res[1].size < 5000 && res[1].size > 3000, 'jsonstore', 'check size');
      }

      start();
    })

    .fail(function (err) {
      ok(false, 'Failure is not an option: ' + JSON.stringify(err));
      start();
    });

  });

}(JSON, asyncTest, ok, start, deepEqual, notDeepEqual));