/*global module, JSON, asyncTest, ok, start, deepEqual, notDeepEqual*/
(function () {

  'use strict';

  module('Transactions');

  asyncTest('Start Transaction, Add, Remove, Commit Transaction', 16, function () {

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
      return JSONStore.startTransaction();
    })

    .then(function (res) {

      deepEqual(res, 0, 'startTransaction');
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

      return JSONStore.get('customers').remove({_id: 1, json: {name: 'carlos', age: 1}});
    })

    .then(function (res) {

      deepEqual(res, 1, 'remove');
      return JSONStore.get('customers').findAll();
    })

    .then(function (res) {

      deepEqual(res.length, 2, 'length 2');

      deepEqual(res[0].json.name, 'dgonz', 'name2');
      deepEqual(res[1].json.name, 'mike', 'name3');

      return JSONStore.commitTransaction();
    })

    .then(function (res) {

      deepEqual(res, 0, 'commitTransaction');
      return JSONStore.get('customers').findAll();
    })

    .then(function (res) {

      deepEqual(res.length, 2, 'length 2');

      deepEqual(res[0].json.name, 'dgonz', 'name2');
      deepEqual(res[1].json.name, 'mike', 'name3');

      start();
    })

    .fail(function (err) {

      ok(false, 'Failure is not an option: ' + err.toString());
      start();
    });

  });

  asyncTest('Start Transaction, Add, Remove, Rollback Transaction', 10, function () {

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
      return JSONStore.startTransaction();
    })

    .then(function (res) {

      deepEqual(res, 0, 'startTransaction');
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

      return JSONStore.rollbackTransaction();
    })

    .then(function (res) {

      deepEqual(res, 0, 'rollbackTransaction');
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

  asyncTest('Start Transaction with DB closed', 10, function () {

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
      return JSONStore.closeAll();
    })

    .then(function (res) {

      deepEqual(res, 0, 'closeAll');
      return JSONStore.startTransaction();
    })

    .then(function (res) {

      ok(false, 'should not work because db is closed' + JSON.stringify(res));
      start();
    })

    .fail(function (err) {

      deepEqual(err.col, '', 'no col because it is a db level operation');
      deepEqual(err.doc, {}, 'no doc caused the failure');
      deepEqual(err.err, -50, 'db not open');
      deepEqual(JSONStore.getErrorMessage(err.err), 'PERSISTENT_STORE_NOT_OPEN', 'err msg');
      deepEqual(err.res, {}, 'not a server issue');
      deepEqual(err.usr, 'jsonstore', 'default user');
      deepEqual(err.src, 'startTransaction', 'startTransaction caused the issue');

      start();
    });

  });

  asyncTest('Commit Transaction with DB closed', 10, function () {

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
      return JSONStore.closeAll();
    })

    .then(function (res) {

      deepEqual(res, 0, 'closeAll');
      return JSONStore.commitTransaction();
    })

    .then(function (res) {

      ok(false, 'should not work because db is closed'+ JSON.stringify(res));
      start();
    })

    .fail(function (err) {

      deepEqual(err.col, '', 'no col because it is a db level operation');
      deepEqual(err.doc, {}, 'no doc caused the failure');
      deepEqual(err.err, -50, 'db not open');
      deepEqual(JSONStore.getErrorMessage(err.err), 'PERSISTENT_STORE_NOT_OPEN', 'err msg');
      deepEqual(err.res, {}, 'not a server issue');
      deepEqual(err.usr, 'jsonstore', 'default user');
      deepEqual(err.src, 'commitTransaction', 'commitTransaction caused the issue');

      start();
    });

  });

  asyncTest('Rollback Transaction with DB closed', 10, function () {

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
      return JSONStore.closeAll();
    })

    .then(function (res) {

      deepEqual(res, 0, 'closeAll');
      return JSONStore.rollbackTransaction();
    })

    .then(function (res) {

      ok(false, 'should not work because db is closed'+ JSON.stringify(res));
      start();
    })

    .fail(function (err) {

      deepEqual(err.col, '', 'no col because it is a db level operation');
      deepEqual(err.doc, {}, 'no doc caused the failure');
      deepEqual(err.err, -50, 'db not open');
      deepEqual(JSONStore.getErrorMessage(err.err), 'PERSISTENT_STORE_NOT_OPEN', 'err msg');
      deepEqual(err.res, {}, 'not a server issue');
      deepEqual(err.usr, 'jsonstore', 'default user');
      deepEqual(err.src, 'rollbackTransaction', 'rollbackTransaction caused the issue');

      start();
    });

  });

  asyncTest('Can not call init while a transaction is in progress', 10, function () {

    var collections = {
      customers: {
        searchFields : {name: 'string', age: 'integer'}
      }
    };

    var collections2 = {
      orders: {
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
      return JSONStore.startTransaction();
    })

    .then(function (res) {

      deepEqual(res, 0, 'startTransaction');
      return JSONStore.init(collections2);
    })

    .then(function (res) {
      ok(false, 'should not work because db is closed, res:' + JSON.stringify(res));
      start();
    })

    .fail(function (err) {

      //clean up the transaction
      JSONStore.rollbackTransaction()
      .always(function () {
        deepEqual(err.col, 'orders', 'last collection');
        deepEqual(err.doc, {}, 'no doc caused the failure');
        deepEqual(err.err, -44, 'TRANSACTION_FAILURE_DURING_INIT');
        deepEqual(JSONStore.getErrorMessage(err.err), 'TRANSACTION_FAILURE_DURING_INIT', 'err msg');
        deepEqual(err.res, {}, 'not a server issue');
        deepEqual(err.usr, 'jsonstore', 'default user');
        deepEqual(err.src, 'initCollection', 'initCollection caused the issue');

        start();
      });

    });

  });

  asyncTest('Call startTransaction twice', 10, function () {

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
      return JSONStore.startTransaction();
    })

    .then(function (res) {

      deepEqual(res, 0, 'startTransaction');
      return JSONStore.startTransaction();
    })

    .then(function (res) {

      ok(false, 'should not work because there is a transaction in progress'+ JSON.stringify(res));
      start();
    })

    .fail(function (err) {

      //Clean up
      JSONStore.rollbackTransaction()
      .always(function () {
        deepEqual(err.col, '', 'no col because it is a db level operation');
        deepEqual(err.doc, {}, 'no doc caused the failure');
        deepEqual(err.err, -41, 'TRANSACTION_IN_PROGRESS');
        deepEqual(JSONStore.getErrorMessage(err.err), 'TRANSACTION_IN_PROGRESS', 'err msg');
        deepEqual(err.res, {}, 'not a server issue');
        deepEqual(err.usr, 'jsonstore', 'default user');
        deepEqual(err.src, 'startTransaction', 'startTransaction caused the issue');

        start();
      });

    });

  });

  asyncTest('Call commitTransaction without a transaction running', 9, function () {

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
      return JSONStore.commitTransaction();
    })

    .then(function (res) {

      ok(false, 'should not work because there is a transaction in progress'+ JSON.stringify(res));
      start();
    })

    .fail(function (err) {

      deepEqual(err.col, '', 'no col because it is a db level operation');
      deepEqual(err.doc, {}, 'no doc caused the failure');
      deepEqual(err.err, -42, 'NO_TRANSACTION_IN_PROGRESS');
      deepEqual(JSONStore.getErrorMessage(err.err), 'NO_TRANSACTION_IN_PROGRESS', 'err msg');
      deepEqual(err.res, {}, 'not a server issue');
      deepEqual(err.usr, 'jsonstore', 'default user');
      deepEqual(err.src, 'commitTransaction', 'commitTransaction caused the issue');

      start();
    });

  });

  asyncTest('Call rollbackTransaction without a transaction running', 9, function () {

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
      return JSONStore.rollbackTransaction();
    })

    .then(function (res) {

      ok(false, 'should not work because there is a transaction in progress'+ JSON.stringify(res));
      start();
    })

    .fail(function (err) {

      deepEqual(err.col, '', 'no col because it is a db level operation');
      deepEqual(err.doc, {}, 'no doc caused the failure');
      deepEqual(err.err, -42, 'NO_TRANSACTION_IN_PROGRESS');
      deepEqual(JSONStore.getErrorMessage(err.err), 'NO_TRANSACTION_IN_PROGRESS', 'check err msg');
      deepEqual(err.res, {}, 'not a server issue');
      deepEqual(err.usr, 'jsonstore', 'default user');
      deepEqual(err.src, 'rollbackTransaction', 'rollbackTransaction caused the issue');

      start();
    });

  });

  asyncTest('Call closeAll when a transaction is running', 10, function () {

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
      return JSONStore.startTransaction();
    })

    .then(function (res) {

      deepEqual(res, 0, 'startTransaction');
      return JSONStore.closeAll();
    })

    .then(function (res) {
      ok(false, 'should not have worked, res: ' + JSON.stringify(res));
    })

    .fail(function (err) {

      //Clean up running transaction
      JSONStore.rollbackTransaction()
      .then(function () {

        deepEqual(err.col, '', 'no col because it is a db level operation');
        deepEqual(err.doc, {}, 'no doc caused the failure');
        deepEqual(err.err, -45, 'TRANSACTION_FAILURE_DURING_CLOSE_ALL');
        deepEqual(JSONStore.getErrorMessage(err.err), 'TRANSACTION_FAILURE_DURING_CLOSE_ALL', 'err msg');
        deepEqual(err.res, {}, 'not a server issue');
        deepEqual(err.usr, 'jsonstore', 'default user');
        deepEqual(err.src, 'closeAll', 'closeAll caused the issue');

        start();
      });

    });

  });

  asyncTest('Call destroy when a transaction is running', 10, function () {

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
      return JSONStore.startTransaction();
    })

    .then(function (res) {

      deepEqual(res, 0, 'startTransaction');
      return JSONStore.destroy();
    })

    .then(function (res) {
      ok(false, 'should not have worked, res: ' + JSON.stringify(res));
    })

    .fail(function (err) {

      //Clean up running transaction
      JSONStore.rollbackTransaction()
      .then(function () {

        deepEqual(err.col, '', 'no col because it is a db level operation');
        deepEqual(err.doc, {}, 'no doc caused the failure');
        deepEqual(err.err, -46, 'TRANSACTION_FAILURE_DURING_DESTROY');
        deepEqual(JSONStore.getErrorMessage(err.err), 'TRANSACTION_FAILURE_DURING_DESTROY', 'err msg');
        deepEqual(err.res, {}, 'not a server issue');
        deepEqual(err.usr, 'jsonstore', 'default user');
        deepEqual(err.src, 'destroy', 'destroy caused the issue');

        start();
      });

    });

  });

  asyncTest('Call removeCollection when a transaction is running', 10, function () {

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
      return JSONStore.startTransaction();
    })

    .then(function (res) {

      deepEqual(res, 0, 'startTransaction');
      return JSONStore.get('customers').removeCollection();
    })

    .then(function (res) {
      ok(false, 'should not have worked, res: ' + JSON.stringify(res));
    })

    .fail(function (err) {

      //Clean up running transaction
      JSONStore.rollbackTransaction()
      .then(function () {

        deepEqual(err.col, 'customers', 'col');
        deepEqual(err.doc, {}, 'no doc caused the failure');
        deepEqual(err.err, -47, 'TRANSACTION_FAILURE_DURING_REMOVE_COLLECTION');
        deepEqual(JSONStore.getErrorMessage(err.err), 'TRANSACTION_FAILURE_DURING_REMOVE_COLLECTION', 'err msg');
        deepEqual(err.res, {}, 'not a server issue');
        deepEqual(err.usr, 'jsonstore', 'default user');
        deepEqual(err.src, 'removeCollection', 'removeCollection caused the issue');

        start();
      });

    });

  });


  asyncTest('Call clear when a transaction is running', 8, function () {

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
      return JSONStore.startTransaction();
    })

    .then(function (res) {

      deepEqual(res, 0, 'startTransaction');
      return JSONStore.get('customers').add(data);
    })

    .then(function (res) {

      deepEqual(res, 3, 'add');
      return JSONStore.get('customers').count();
    })

    .then(function (res) {

      deepEqual(res, 3, 'count');
      return JSONStore.get('customers').clear();
    })

    .then(function (res) {

      deepEqual(0, res, 'clear');
      return JSONStore.get('customers').findAll();
    })

    .then(function (res) {

      deepEqual(res.length, 0, 'findAll');
      return JSONStore.commitTransaction();
    })

    .then(function (res) {

      deepEqual(res, 0, 'commitTransaction');
      start();
    })

    .fail(function (err) {
      //Clean up running transaction
      JSONStore.rollbackTransaction()
      .then(function () {
        ok(false, 'Failure is not an option: ' + err.toString());
        start();
      });
    });

  });

  asyncTest('Run a transaction on multiple collections', 11, function () {

    var collections = {
      customers: {
        searchFields : {name: 'string', age: 'integer'}
      }
    };

    var collections2 = {
      orders: {
        searchFields: {name: 'string', id: 'integer'}
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
      return JSONStore.init(collections2);
    })

    .then(function (res) {
      deepEqual(res.orders.name, 'orders');
      return JSONStore.startTransaction();
    })

    .then(function (res) {
      deepEqual(res, 0, 'startTransaction');
      return JSONStore.get('customers').add(data);
    })

    .then(function (res) {

      deepEqual(res, 3, 'add1');
      return JSONStore.get('customers').count();
    })

    .then(function (res) {
      deepEqual(res, 3, 'count1');
      return JSONStore.get('orders').add(data2);
    })

    .then(function (res) {

      deepEqual(res, 2, 'add2');
      return JSONStore.get('orders').count();
      //return JSONStore.commitTransaction();
    })

    .then(function (res) {
      deepEqual(res, 2, 'count2');
      return JSONStore.get('orders').clear();
    })

    .then(function (res){
      deepEqual(res, 0, 'clear');
      return JSONStore.get('orders').findAll();
    })

    .then(function (res){
      deepEqual(res.length, 0, 'findAll');
      return JSONStore.commitTransaction();
    })

    .then(function (res) {

      deepEqual(res, 0, 'commitTransaction');
      start();
    })

    .fail(function (err) {
      //Clean up running transaction
      JSONStore.rollbackTransaction()
      .then(function () {
        ok(false, 'Failure is not an option: ' + err.toString());
        start();
      });
    });

  });

  asyncTest('Run a transaction on multiple collections then rollback', 13, function () {

    var collections = {
      customers: {
        searchFields : {name: 'string', age: 'integer'}
      }
    };

    var collections2 = {
      orders: {
        searchFields: {name: 'string', id: 'integer'}
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
      return JSONStore.init(collections2);
    })

    .then(function (res) {
      deepEqual(res.orders.name, 'orders');
      return JSONStore.startTransaction();
    })

    .then(function (res) {
      deepEqual(res, 0, 'startTransaction');
      return JSONStore.get('customers').add(data);
    })

    .then(function (res) {

      deepEqual(res, 3, 'add1');
      return JSONStore.get('customers').count();
    })

    .then(function (res) {
      deepEqual(res, 3, 'count1');
      return JSONStore.get('orders').add(data2);
    })

    .then(function (res) {

      deepEqual(res, 2, 'add2');
      return JSONStore.get('orders').count();
      //return JSONStore.commitTransaction();
    })

    .then(function (res) {
      deepEqual(res, 2, 'count2');
      return JSONStore.get('orders').clear();
    })

    .then(function (res){
      deepEqual(res, 0, 'clear');
      return JSONStore.get('orders').findAll();
    })

    .then(function (res){
      deepEqual(res.length, 0, 'findAll');
      return JSONStore.rollbackTransaction();
    })

    .then(function (res) {

      deepEqual(res, 0, 'rollbackTransaction');
      return JSONStore.get('customers').findAll();
    })

    .then(function (res){
      deepEqual(res.length, 0, 'findAll1');
      return JSONStore.get('orders').findAll();
    })

    .then(function (res){
      deepEqual(res.length, 0, 'findAll2');
      start();
    })

    .fail(function (err) {
      //Clean up running transaction
      JSONStore.rollbackTransaction()
      .then(function () {
        ok(false, 'Failure is not an option: ' + err.toString());
        start();
      });
    });

  });

  asyncTest('Run add operation before doing a transaction then do a rollback', 9, function () {

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
      return JSONStore.get('customers').count();
    })

    .then(function (res) {
      deepEqual(res, 3, 'count1');
      return JSONStore.startTransaction();
    })


    .then(function (res) {
      deepEqual(res, 0, 'startTransaction');
      return JSONStore.get('customers').clear();
    })

    .then(function (res) {

      deepEqual(res, 0, 'clear');
      return JSONStore.get('customers').findAll();
    })

    .then(function (res) {
      deepEqual(res.length, 0, 'findAll');
      return JSONStore.rollbackTransaction();
    })

    .then(function (res) {

      deepEqual(res, 0, 'rollbackTransaction');
      return JSONStore.get('customers').count();
    })

    .then(function (res) {
      deepEqual(res, 3, 'count2');
      start();
    })

    .fail(function (err) {
      //Clean up running transaction
      JSONStore.rollbackTransaction()
      .then(function () {
        ok(false, 'Failure is not an option: ' + err.toString());
        start();
      });
    });

  });


}(JSON, asyncTest, ok, start, deepEqual, notDeepEqual));