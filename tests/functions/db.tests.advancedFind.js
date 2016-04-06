/* JavaScript content from tests/functions/db.tests.advancedfind.js in folder common */
/*global module, ok, asyncTest, deepEqual, start, */
/*jshint maxparams: 7*/
/*jshint -W100*/

(function() {

  'use strict';
  //Dependencies:

  module('Advanced Find');

  asyncTest('Like Simple Test', 4, function() {

    var collections = {
      customers: {
        searchFields: {
          name: 'string',
          age: 'integer'
        }
      }
    };

    var data = [{
      name: 'carlos',
      age: 1
    }, {
      name: 'dgonz',
      age: 2
    }, {
      name: 'jeff',
      age: 2
    }, {
      name: 'mike',
      age: 3
    }, {
      name: 'nana',
      age: 4
    }];

    JSONStore.destroy()

    .then(function(res) {
      deepEqual(res, 0, 'destroy');
      return JSONStore.init(collections);
    })

    .then(function(res) {
      deepEqual(res.customers.name, 'customers');
      return JSONStore.get('customers').add(data);
    })

    .then(function() {
      /**
          select *
            from 'customers'
            where
              [name] = 'na' OR [name] LIKE '%-@-na-@-%' OR [name] LIKE '%-@-na' OR [name] LIKE 'na-@-%'
      */

      var query = [{
        like: [{
          name: 'na'
        }]
      }];

      return JSONStore.get('customers').advancedFind(query);

    })

    .then(function(data) {
      deepEqual(data.length, 1, 'Result length');
      deepEqual(data[0].json.name, 'nana', 'Result element test Nana');
      start();
    })

    .fail(function(err) {
      ok(false, err.toString());
      start();
    });
  });

  asyncTest('Like Simple Test using multiple types for searchFields', 4, function() {

    var collections = {
      customers: {
        searchFields: {
          name: 'string',
          gpa: 'number',
          ssn: 'integer',
          active: 'boolean'
        }
      }
    };

    var data = [{
      name: 'carlos',
      gpa: 1.0,
      ssn: 123,
      active: true
    }, {
      name: 'dgonz',
      gpa: 2.2,
      ssn: 345,
      active: false
    }, {
      name: 'jeff',
      gpa: 2.4,
      ssn: 567,
      active: true
    }, {
      name: 'mike',
      gpa: 3.6,
      ssn: 789,
      active: false
    }, {
      name: 'nana',
      gpa: 4.8,
      ssn: 987,
      active: true
    }];

    JSONStore.destroy()

    .then(function(res) {
      deepEqual(res, 0, 'destroy');
      return JSONStore.init(collections);
    })

    .then(function(res) {
      deepEqual(res.customers.name, 'customers');
      return JSONStore.get('customers').add(data);
    })

    .then(function() {
      /**
          select *
            from 'customers'
            where
              [gpa] = '.2' OR [name] LIKE '%-@-.2-@-%' OR [name] LIKE '%-.2-na' OR [name] LIKE '.2-@-%'
      */

      var query = [{
        like: [{
          gpa: '.2'
        }]
      }];

      return JSONStore.get('customers').advancedFind(query);

    })

    .then(function(data) {
      deepEqual(data.length, 1, 'Result length');
      deepEqual(data[0].json.name, 'dgonz', 'Result element test Nana');
      start();
    })

    .fail(function(err) {
      ok(false, err.toString());
      start();
    });
  });

  asyncTest('Not Like Simple Test', 7, function() {

    var collections = {
      customers: {
        searchFields: {
          name: 'string',
          age: 'integer'
        }
      }
    };

    var data = [{
      name: 'carlos',
      age: 1
    }, {
      name: 'dgonz',
      age: 2
    }, {
      name: 'jeff',
      age: 2
    }, {
      name: 'mike',
      age: 3
    }, {
      name: 'nana',
      age: 4
    }];

    JSONStore.destroy()

    .then(function(res) {
      deepEqual(res, 0, 'destroy');
      return JSONStore.init(collections);
    })

    .then(function(res) {
      deepEqual(res.customers.name, 'customers');
      return JSONStore.get('customers').add(data);
    })

    .then(function() {
      /*
          select *
            from 'customers'
            where
              [name] != 'na' OR [name] LIKE '%-@-na-@-%' OR [name] LIKE '%-@-na' OR [name] LIKE 'na-@-%'
      */

      var query = [{
        notLike: [{
          name: 'na'
        }]
      }];

      return JSONStore.get('customers').advancedFind(query);

    })

    .then(function(data) {
      deepEqual(data.length, 4, 'Result length');
      deepEqual(data[0].json.name, 'carlos', 'Result element test carlos');
      deepEqual(data[1].json.name, 'dgonz', 'Result element test dgonz');
      deepEqual(data[2].json.name, 'jeff', 'Result element test jeff');
      deepEqual(data[3].json.name, 'mike', 'Result element test mike');
      start();
    })

    .fail(function(err) {
      ok(false, err.toString());
      start();
    });
  });

  asyncTest('Like Simple Test with Additional SearchFields', 8, function() {

    var collections = {
      customers: {
        searchFields: {
          name: 'string',
          age: 'integer'
        },
        additionalSearchFields: {
          lol: 'string'
        }
      }
    };

    var data = [{
      name: 'carlos',
      age: 1
    }, {
      name: 'dgonz',
      age: 2
    }, {
      name: 'jeff',
      age: 2
    }, {
      name: 'mike',
      age: 3
    }, {
      name: 'nana',
      age: 4
    }];

    JSONStore.destroy()

    .then(function(res) {
      deepEqual(res, 0, 'destroy');
      return JSONStore.init(collections);
    })

    .then(function(res) {
      deepEqual(res.customers.name, 'customers');
      return JSONStore.get('customers').add(data, {
        additionalSearchFields: {
          lol: 'hey'
        }
      });
    })

    .then(function() {
      /*
          select *
            from 'customers'
            where
              [lol] = 'hey' OR [name] LIKE '%-@-hey-@-%' OR [name] LIKE '%-@-hey' OR [name] LIKE 'hey-@-%'
      */

      var query = [{
        like: [{
          lol: 'hey'
        }]
      }];

      return JSONStore.get('customers').advancedFind(query);

    })

    .then(function(data) {
      deepEqual(data.length, 5, 'Result length');
      deepEqual(data[0].json.name, 'carlos', 'Result element test carlos');
      deepEqual(data[1].json.name, 'dgonz', 'Result element test dgonz');
      deepEqual(data[2].json.name, 'jeff', 'Result element test jeff');
      deepEqual(data[3].json.name, 'mike', 'Result element test mike');
      deepEqual(data[4].json.name, 'nana', 'Result element test nanaxs');
      start();
    })

    .fail(function(err) {
      ok(false, err.toString());
      start();
    });
  });

  asyncTest('Like No Results', 3, function() {

    var collections = {
      customers: {
        searchFields: {
          name: 'string',
          age: 'integer'
        }
      }
    };

    var data = [{
      name: 'carlos',
      age: 1
    }, {
      name: 'dgonz',
      age: 2
    }, {
      name: 'jeff',
      age: 2
    }, {
      name: 'mike',
      age: 3
    }, {
      name: 'nana',
      age: 4
    }];

    JSONStore.destroy()

    .then(function(res) {
      deepEqual(res, 0, 'destroy');
      return JSONStore.init(collections);
    })

    .then(function(res) {
      deepEqual(res.customers.name, 'customers');
      return JSONStore.get('customers').add(data);
    })

    .then(function() {

      /*
          select *
            from 'customers'
            where
              [name] = 'x' OR [name] LIKE '%-@-x-@-%' OR [name] LIKE '%-@-x' OR [name] LIKE 'x-@-%'
      */

      var query = [{
        like: [{
          name: 'x'
        }]
      }];

      return JSONStore.get('customers').advancedFind(query);

    })

    .then(function(data) {
      deepEqual(data.length, 0, 'Result length');
      start();
    })

    .fail(function(err) {
      ok(false, err.toString());
      start();
    });
  });

  asyncTest('Like All Results', 8, function() {

    var collections = {
      customers: {
        searchFields: {
          name: 'string',
          age: 'integer'
        }
      }
    };

    var data = [{
      name: 'Carlos',
      age: 1
    }, {
      name: 'CArlos',
      age: 2
    }, {
      name: 'CARlos',
      age: 2
    }, {
      name: 'CARLos',
      age: 3
    }, {
      name: 'CARLOs',
      age: 4
    }];

    JSONStore.destroy()

    .then(function(res) {
      deepEqual(res, 0, 'destroy');
      return JSONStore.init(collections);
    })

    .then(function(res) {
      deepEqual(res.customers.name, 'customers');
      return JSONStore.get('customers').add(data);
    })

    .then(function() {

      /*
          select *
            from 'customers'
            where
              [name] = 'carlos' OR [name] LIKE '%-@-carlos-@-%' OR [name] LIKE '%-@-carlos' OR [name] LIKE 'carlos-@-%'
      */

      var query = [{
        like: [{
          name: 'carlos'
        }]
      }];

      return JSONStore.get('customers').advancedFind(query);

    })

    .then(function(data) {
      deepEqual(data.length, 5, 'Result length');
      deepEqual(data[0].json.name, 'Carlos', 'Result element test Carlos');
      deepEqual(data[1].json.name, 'CArlos', 'Result element test CArlos');
      deepEqual(data[2].json.name, 'CARlos', 'Result element test CARlos');
      deepEqual(data[3].json.name, 'CARLos', 'Result element test CARLos');
      deepEqual(data[4].json.name, 'CARLOs', 'Result element test CARLOs');

      start();
    })

    .fail(function(err) {
      ok(false, err.toString());
      start();
    });
  });

  asyncTest('Like Multiple', 5, function() {

    var collections = {
      customers: {
        searchFields: {
          fn: 'string',
          ln: 'string',
          age: 'integer',
          ssn: 'integer'
        }
      }
    };

    var data = [{
      fn: 'carlos',
      ln: 'anderu',
      age: 1,
      ssn: 12
    }, {
      fn: 'daniel',
      ln: 'gonzalez',
      age: 2,
      ssn: 345
    }, {
      fn: 'jeff',
      ln: 'barret',
      age: 2,
      ssn: 56
    }, {
      fn: 'mike',
      ln: 'ortman',
      age: 3,
      ssn: 789
    }, {
      fn: 'nana',
      ln: 'amfo',
      age: 4,
      ssn: 91
    }];

    JSONStore.destroy()

    .then(function(res) {
      deepEqual(res, 0, 'destroy');
      return JSONStore.init(collections);
    })

    .then(function(res) {
      deepEqual(res.customers.name, 'customers');
      return JSONStore.get('customers').add(data);
    })

    .then(function() {
      /*
          select *
            from 'customers'
            where
              [fn] = 'mi' OR [name] LIKE '%-@-mi-@-%' OR [name] LIKE '%-@-mi' OR [name] LIKE 'mi-@-%'
            AND
              [ln] = 'man' OR [name] LIKE '%-@-man-@-%' OR [name] LIKE '%-@-man' OR [name] LIKE 'man-@-%'
      */

      var query = [{
        like: [{
          fn: 'mi'
        }, {
          ln: 'man'
        }]
      }];

      return JSONStore.get('customers').advancedFind(query);

    })

    .then(function(data) {
      deepEqual(data.length, 1, 'Result length');

      deepEqual(data[0].json.fn, 'mike', 'Result element test mike');
      deepEqual(data[0].json.ln, 'ortman', 'Result element test ortman');
      start();
    })

    .fail(function(err) {
      ok(false, err.toString());
      start();
    });
  });

  asyncTest('Like Multiple (Single Object)', 5, function() {

    var collections = {
      customers: {
        searchFields: {
          fn: 'string',
          ln: 'string',
          age: 'integer',
          ssn: 'integer'
        }
      }
    };

    var data = [{
      fn: 'carlos',
      ln: 'anderu',
      age: 1,
      ssn: 12
    }, {
      fn: 'daniel',
      ln: 'gonzalez',
      age: 2,
      ssn: 345
    }, {
      fn: 'jeff',
      ln: 'barret',
      age: 2,
      ssn: 56
    }, {
      fn: 'mike',
      ln: 'ortman',
      age: 3,
      ssn: 789
    }, {
      fn: 'nana',
      ln: 'amfo',
      age: 4,
      ssn: 91
    }];

    JSONStore.destroy()

    .then(function(res) {
      deepEqual(res, 0, 'destroy');
      return JSONStore.init(collections);
    })

    .then(function(res) {
      deepEqual(res.customers.name, 'customers');
      return JSONStore.get('customers').add(data);
    })

    .then(function() {
      /*
          select *
            from 'customers'
            where
              [fn] = 'mi' OR [name] LIKE '%-@-mi-@-%' OR [name] LIKE '%-@-mi' OR [name] LIKE 'mi-@-%'
            AND
              [ln] = 'man' OR [name] LIKE '%-@-man-@-%' OR [name] LIKE '%-@-man' OR [name] LIKE 'man-@-%'
      */

      var query = [{
        like: [{
          fn: 'mi',
          ln: 'man'
        }]
      }];

      return JSONStore.get('customers').advancedFind(query);

    })

    .then(function(data) {
      deepEqual(data.length, 1, 'Result length');

      deepEqual(data[0].json.fn, 'mike', 'Result element test mike');
      deepEqual(data[0].json.ln, 'ortman', 'Result element test ortman');
      start();
    })

    .fail(function(err) {
      ok(false, err.toString());
      start();
    });
  });

  asyncTest('Right Like Simple Test', 7, function() {

    var collections = {
      customers: {
        searchFields: {
          name: 'string',
          age: 'integer'
        }
      }
    };

    var data = [{
      name: 'carlosdgonz',
      age: 1
    }, {
      name: 'carlos',
      age: 2
    }, {
      name: 'Carlos',
      age: 2
    }, {
      name: 'carlosAnderu',
      age: 3
    }, {
      name: 'nana',
      age: 4
    }];

    JSONStore.destroy()

    .then(function(res) {
      deepEqual(res, 0, 'destroy');
      return JSONStore.init(collections);
    })

    .then(function(res) {
      deepEqual(res.customers.name, 'customers');
      return JSONStore.get('customers').add(data);
    })

    .then(function() {
      /*
          select *
            from 'customers'
            where
              [name] LIKE 'carlos-@-%'
        */

      var query = [{
        rightLike: [{
          name: 'carlos'
        }]
      }];

      return JSONStore.get('customers').advancedFind(query);

    })

    .then(function(data) {
      deepEqual(data.length, 4, 'Result length');
      deepEqual(data[0].json.name, 'carlosdgonz', 'Result element test carlosdgonz');
      deepEqual(data[1].json.name, 'carlos', 'Result element test carlos');
      deepEqual(data[2].json.name, 'Carlos', 'Result element test carlos');
      deepEqual(data[3].json.name, 'carlosAnderu', 'Result element test carlosAnderu');
      start();
    })

    .fail(function(err) {
      ok(false, err.toString());
      start();
    });
  });

  asyncTest('Right Like Simple Test using multiple types for searchFields', 4, function() {

    var collections = {
      customers: {
        searchFields: {
          name: 'string',
          gpa: 'number',
          ssn: 'integer',
          active: 'boolean'
        }
      }
    };

    var data = [{
      name: 'carlos',
      gpa: 1.0,
      ssn: 123,
      active: true
    }, {
      name: 'dgonz',
      gpa: 2.2,
      ssn: 345,
      active: false
    }, {
      name: 'jeff',
      gpa: 2.4,
      ssn: 567,
      active: true
    }, {
      name: 'mike',
      gpa: 3.6,
      ssn: 789,
      active: false
    }, {
      name: 'nana',
      gpa: 4.8,
      ssn: 987,
      active: true
    }];

    JSONStore.destroy()

    .then(function(res) {
      deepEqual(res, 0, 'destroy');
      return JSONStore.init(collections);
    })

    .then(function(res) {
      deepEqual(res.customers.name, 'customers');
      return JSONStore.get('customers').add(data);
    })

    .then(function() {
      /*
          select *
            from 'customers'
            where
              [gpa] LIKE '3.-@-%'
        */

      var query = [{
        rightLike: [{
          gpa: '3.'
        }]
      }];

      return JSONStore.get('customers').advancedFind(query);

    })

    .then(function(data) {
      deepEqual(data.length, 1, 'Result length');
      deepEqual(data[0].json.name, 'mike', 'Result element test Nana');
      start();
    })

    .fail(function(err) {
      ok(false, err.toString());
      start();
    });
  });

  asyncTest('Right Like Simple Test with AdditonalSearchFields', 9, function() {

    var collections = {
      customers: {
        searchFields: {
          name: 'string',
          age: 'integer'
        },
        additionalSearchFields: {
          lol: 'string'
        }
      }
    };

    var data = [{
      name: 'carlosdgonz',
      age: 1
    }, {
      name: 'carlos',
      age: 2
    }, {
      name: 'Carlos',
      age: 2
    }, {
      name: 'carlosAnderu',
      age: 3
    }, {
      name: 'nana',
      age: 4
    }];

    JSONStore.destroy()

    .then(function(res) {
      deepEqual(res, 0, 'destroy');
      return JSONStore.init(collections);
    })

    .then(function(res) {
      deepEqual(res.customers.name, 'customers');
      return JSONStore.get('customers').add([data[0], data[1], data[2], data[3]], {
        additionalSearchFields: {
          lol: 'hey'
        }
      });
    })

    .then(function(res) {
      deepEqual(res, 4, 'added with additionalSearchFields');
      return JSONStore.get('customers').add([data[4]]);

    })

    .then(function(res) {
      deepEqual(res, 1, 'added without additionalSearchFields');
      /*
            select *
              from 'customers'
              where
                [lol] LIKE 'he-@-%'
          */

      var query = [{
        rightLike: [{
          lol: 'he'
        }]
      }];

      return JSONStore.get('customers').advancedFind(query);

    })

    .then(function(data) {
      deepEqual(data.length, 4, 'Result length');
      deepEqual(data[0].json.name, 'carlosdgonz', 'Result element test carlosdgonz');
      deepEqual(data[1].json.name, 'carlos', 'Result element test carlos');
      deepEqual(data[2].json.name, 'Carlos', 'Result element test Carlos');
      deepEqual(data[3].json.name, 'carlosAnderu', 'Result element test carlosAnderu');
      start();
    })

    .fail(function(err) {
      ok(false, err.toString());
      start();
    });
  });

  asyncTest('Not Right Like Simple Test', 4, function() {

    var collections = {
      customers: {
        searchFields: {
          name: 'string',
          age: 'integer'
        }
      }
    };

    var data = [{
      name: 'carlosdgonz',
      age: 1
    }, {
      name: 'carlos',
      age: 2
    }, {
      name: 'Carlos',
      age: 2
    }, {
      name: 'carlosAnderu',
      age: 3
    }, {
      name: 'nana',
      age: 4
    }];

    JSONStore.destroy()

    .then(function(res) {
      deepEqual(res, 0, 'destroy');
      return JSONStore.init(collections);
    })

    .then(function(res) {
      deepEqual(res.customers.name, 'customers');
      return JSONStore.get('customers').add(data);
    })

    .then(function() {
      /*
            select *
              from 'customers'
              where
                [name] NOT LIKE 'carlos-@-%'
          */

      var query = [{
        notRightLike: [{
          name: 'carlos'
        }]
      }];

      return JSONStore.get('customers').advancedFind(query);

    })

    .then(function(data) {
      deepEqual(data.length, 1, 'Result length');
      deepEqual(data[0].json.name, 'nana', 'Result element test nana');
      start();
    })

    .fail(function(err) {
      ok(false, err.toString());
      start();
    });
  });

  asyncTest('Right Like No Results', 3, function() {

    var collections = {
      customers: {
        searchFields: {
          name: 'string',
          age: 'integer'
        }
      }
    };

    var data = [{
      name: 'eAnderucarlos',
      age: 1
    }, {
      name: 'dCarlos',
      age: 2
    }, {
      name: 'cjeff',
      age: 2
    }, {
      name: 'bcarloS',
      age: 3
    }, {
      name: 'aCARLOS',
      age: 4
    }];

    JSONStore.destroy()

    .then(function(res) {
      deepEqual(res, 0, 'destroy');
      return JSONStore.init(collections);
    })

    .then(function(res) {
      deepEqual(res.customers.name, 'customers');
      return JSONStore.get('customers').add(data);
    })

    .then(function() {
      /*
          select *
            from 'customers'
            where
              [name] LIKE 'carlos-@-%'
        */

      var query = [{
        rightLike: [{
          name: 'carlos'
        }]
      }];

      return JSONStore.get('customers').advancedFind(query);

    })

    .then(function(data) {
      deepEqual(data.length, 0, 'Result length');
      start();
    })

    .fail(function(err) {
      ok(false, err.toString());
      start();
    });
  });

  asyncTest('Right Like Simple Test with AdditonalSearchFields', 8, function() {

    var collections = {
      customers: {
        searchFields: {
          name: 'string',
          age: 'integer'
        },
        additionalSearchFields: {
          lol: 'string'
        }
      }
    };

    var data = [{
      name: 'carlosdgonz',
      age: 1
    }, {
      name: 'carlos',
      age: 2
    }, {
      name: 'Carlos',
      age: 2
    }, {
      name: 'carlosAnderu',
      age: 3
    }, {
      name: 'nana',
      age: 4
    }];

    JSONStore.destroy()

    .then(function(res) {
      deepEqual(res, 0, 'destroy');
      return JSONStore.init(collections);
    })

    .then(function(res) {
      deepEqual(res.customers.name, 'customers');
      return JSONStore.get('customers').add([data[0], data[1], data[2]], {
        additionalSearchFields: {
          lol: 'hey'
        }
      });
    })

    .then(function(res) {
      deepEqual(res, 3, 'added with additionalSearchFields');
      return JSONStore.get('customers').add([data[3], data[4]]);

    })

    .then(function(res) {
      deepEqual(res, 2, 'added without additionalSearchFields');
      /*
          select *
            from 'customers'
            where
              [lol] LIKE 'he-@-%'
        */

      var query = [{
        rightLike: [{
          lol: 'he'
        }]
      }];

      return JSONStore.get('customers').advancedFind(query);

    })

    .then(function(data) {
      deepEqual(data.length, 3, 'Result length');
      deepEqual(data[0].json.name, 'carlosdgonz', 'Result element test carlosdgonz');
      deepEqual(data[1].json.name, 'carlos', 'Result element test carlos');
      deepEqual(data[2].json.name, 'Carlos', 'Result element test Carlos');
      start();
    })

    .fail(function(err) {
      ok(false, err.toString());
      start();
    });
  });

  asyncTest('Right Like All Results', 8, function() {

    var collections = {
      customers: {
        searchFields: {
          name: 'string',
          age: 'integer'
        }
      }
    };

    var data = [{
      name: 'carlosanderu',
      age: 1
    }, {
      name: 'carlos',
      age: 2
    }, {
      name: 'carlosA',
      age: 2
    }, {
      name: 'carlos is a coder',
      age: 3
    }, {
      name: 'carlosAnderu',
      age: 4
    }];

    JSONStore.destroy()

    .then(function(res) {
      deepEqual(res, 0, 'destroy');
      return JSONStore.init(collections);
    })

    .then(function(res) {
      deepEqual(res.customers.name, 'customers');
      return JSONStore.get('customers').add(data);
    })

    .then(function() {
      /*
          select *
            from 'customers'
            where
              [name] LIKE 'carlos-@-%'
        */
      var query = [{
        rightLike: [{
          name: 'carlos'
        }]
      }];

      return JSONStore.get('customers').advancedFind(query);

    })

    .then(function(data) {
      deepEqual(data.length, 5, 'Result length');
      deepEqual(data[0].json.name, 'carlosanderu', 'Result element test carlosanderu');
      deepEqual(data[1].json.name, 'carlos', 'Result element test carlos');
      deepEqual(data[2].json.name, 'carlosA', 'Result element test carlosA');
      deepEqual(data[3].json.name, 'carlos is a coder', 'Result element test carlos is a coder');
      deepEqual(data[4].json.name, 'carlosAnderu', 'Result element test carlosAnderu');

      start();
    })

    .fail(function(err) {
      ok(false, err.toString());
      start();
    });
  });

  asyncTest('Right Like Multiple', 5, function() {

    var collections = {
      customers: {
        searchFields: {
          front: 'string',
          back: 'string',
          age: 'integer'
        }
      }
    };

    var data = [{
      front: 'carlosanderu',
      back: 'anderucarlos',
      age: 10
    }, {
      front: 'carlos',
      back: 'solrac',
      age: 20
    }, {
      front: 'carlosA',
      back: 'Asolrac',
      age: 20
    }, {
      front: 'carlos is a coder',
      back: 'redoc a si solrac',
      age: 30
    }, {
      front: 'carlosAnderu',
      back: 'urednAsolrac',
      age: 40
    }];

    JSONStore.destroy()

    .then(function(res) {
      deepEqual(res, 0, 'destroy');
      return JSONStore.init(collections);
    })

    .then(function(res) {
      deepEqual(res.customers.name, 'customers');
      return JSONStore.get('customers').add(data);
    })

    .then(function() {
      /*
          select *
            from 'customers'
            where
              [front] LIKE 'carlos-@-%'
            AND
              [age] LIKE '1-@-%'
        */
      var query = [{
        rightLike: [{
          front: 'carlos'
        }, {
          age: 1
        }]
      }];

      return JSONStore.get('customers').advancedFind(query);

    })

    .then(function(data) {
      deepEqual(data.length, 1, 'Result length');
      deepEqual(data[0].json.front, 'carlosanderu', 'Result element test carlosanderu');
      deepEqual(data[0].json.back, 'anderucarlos', 'Result element test andercarlos');

      start();
    })

    .fail(function(err) {
      ok(false, err.toString());
      start();
    });
  });

  asyncTest('Left Like Simple Test', 6, function() {

    var collections = {
      customers: {
        searchFields: {
          name: 'string',
          age: 'integer'
        }
      }
    };

    var data = [{
      name: 'nanacarlos',
      age: 1
    }, {
      name: 'carlos',
      age: 2
    }, {
      name: 'CarlosAnderu',
      age: 2
    }, {
      name: 'nana is a coder so is carlos',
      age: 3
    }, {
      name: 'mikenana',
      age: 4
    }];

    JSONStore.destroy()

    .then(function(res) {
      deepEqual(res, 0, 'destroy');
      return JSONStore.init(collections);
    })

    .then(function(res) {
      deepEqual(res.customers.name, 'customers');
      return JSONStore.get('customers').add(data);
    })

    .then(function() {
      /*
          select *
            from 'customers'
            where
              [name] LIKE '%-@-carlos'
        */

      var query = [{
        leftLike: [{
          name: 'carlos'
        }]
      }];

      return JSONStore.get('customers').advancedFind(query);

    })

    .then(function(data) {
      deepEqual(data.length, 3, 'Result length');
      deepEqual(data[0].json.name, 'nanacarlos', 'Result element test nanacarlos');
      deepEqual(data[1].json.name, 'carlos', 'Result element test carlos');
      deepEqual(data[2].json.name, 'nana is a coder so is carlos', 'Result element test nana is a coder os is carlos');
      start();
    })

    .fail(function(err) {
      ok(false, err.toString());
      start();
    });
  });

  asyncTest('Left Like Simple Test using multiple types for searchFields', 4, function() {

    var collections = {
      customers: {
        searchFields: {
          name: 'string',
          gpa: 'number',
          ssn: 'integer',
          active: 'boolean'
        }
      }
    };

    var data = [{
      name: 'carlos',
      gpa: 1.0,
      ssn: 123,
      active: true
    }, {
      name: 'dgonz',
      gpa: 2.2,
      ssn: 345,
      active: false
    }, {
      name: 'jeff',
      gpa: 2.4,
      ssn: 567,
      active: true
    }, {
      name: 'mike',
      gpa: 3.6,
      ssn: 789,
      active: false
    }, {
      name: 'nana',
      gpa: 4.8,
      ssn: 987,
      active: true
    }];

    JSONStore.destroy()

    .then(function(res) {
      deepEqual(res, 0, 'destroy');
      return JSONStore.init(collections);
    })

    .then(function(res) {
      deepEqual(res.customers.name, 'customers');
      return JSONStore.get('customers').add(data);
    })

    .then(function() {
      /*
          select *
            from 'customers'
            where
              [gpa] LIKE '%-@-.8'
      */

      var query = [{
        leftLike: [{
          gpa: '.8'
        }]
      }];

      return JSONStore.get('customers').advancedFind(query);

    })

    .then(function(data) {
      deepEqual(data.length, 1, 'Result length');
      deepEqual(data[0].json.name, 'nana', 'Result element test Nana');
      start();
    })

    .fail(function(err) {
      ok(false, err.toString());
      start();
    });
  });

  asyncTest('Left Like Simple Test with AdditonalSearchFields', 7, function() {

    var collections = {
      customers: {
        searchFields: {
          name: 'string',
          age: 'integer'
        },
        additionalSearchFields: {
          lol: 'string'
        }
      }
    };

    var data = [{
      name: 'carlosdgonz',
      age: 1
    }, {
      name: 'carlos',
      age: 2
    }, {
      name: 'Carlos',
      age: 2
    }, {
      name: 'carlosAnderu',
      age: 3
    }, {
      name: 'nana',
      age: 4
    }];

    JSONStore.destroy()

    .then(function(res) {
      deepEqual(res, 0, 'destroy');
      return JSONStore.init(collections);
    })

    .then(function(res) {
      deepEqual(res.customers.name, 'customers');
      return JSONStore.get('customers').add([data[0], data[1]], {
        additionalSearchFields: {
          lol: 'hey'
        }
      });
    })

    .then(function(res) {
      deepEqual(res, 2, 'added with additionalSearchFields');
      return JSONStore.get('customers').add([data[2], data[3], data[4]]);

    })

    .then(function(res) {
      deepEqual(res, 3, 'added without additionalSearchFields');
      /*
          select *
            from 'customers'
            where
              [lol] LIKE '%-@-hey'
        */

      var query = [{
        leftLike: [{
          lol: 'hey'
        }]
      }];

      return JSONStore.get('customers').advancedFind(query);

    })

    .then(function(data) {
      deepEqual(data.length, 2, 'Result length');
      deepEqual(data[0].json.name, 'carlosdgonz', 'Result element test carlosdgonz');
      deepEqual(data[1].json.name, 'carlos', 'Result element test carlos');
      start();
    })

    .fail(function(err) {
      ok(false, err.toString());
      start();
    });
  });

  asyncTest('Not Left Like Simple Test', 5, function() {

    var collections = {
      customers: {
        searchFields: {
          name: 'string',
          age: 'integer'
        }
      }
    };

    var data = [{
      name: 'nanacarlos',
      age: 1
    }, {
      name: 'carlos',
      age: 2
    }, {
      name: 'CarlosAnderu',
      age: 2
    }, {
      name: 'nana is a coder so is carlos',
      age: 3
    }, {
      name: 'mikenana',
      age: 4
    }];

    JSONStore.destroy()

    .then(function(res) {
      deepEqual(res, 0, 'destroy');
      return JSONStore.init(collections);
    })

    .then(function(res) {
      deepEqual(res.customers.name, 'customers');
      return JSONStore.get('customers').add(data);
    })

    .then(function() {
      /*
          select *
            from 'customers'
            where
              [name] NOT LIKE '%-@-carlos'
        */

      var query = [{
        notLeftLike: [{
          name: 'carlos'
        }]
      }];

      return JSONStore.get('customers').advancedFind(query);

    })

    .then(function(data) {
      deepEqual(data.length, 2, 'Result length');
      deepEqual(data[0].json.name, 'CarlosAnderu', 'Result element test CarlosAnderu');
      deepEqual(data[1].json.name, 'mikenana', 'Result element test mikenana');
      start();
    })

    .fail(function(err) {
      ok(false, err.toString());
      start();
    });
  });

  asyncTest('Left Like No Results', 3, function() {

    var collections = {
      customers: {
        searchFields: {
          name: 'string',
          age: 'integer'
        }
      }
    };

    var data = [{
      name: 'AnderucarloSa',
      age: 1
    }, {
      name: 'Carlosb',
      age: 2
    }, {
      name: 'cjeff',
      age: 2
    }, {
      name: 'carloSd',
      age: 3
    }, {
      name: 'CARLOSe',
      age: 4
    }];

    JSONStore.destroy()

    .then(function(res) {
      deepEqual(res, 0, 'destroy');
      return JSONStore.init(collections);
    })

    .then(function(res) {
      deepEqual(res.customers.name, 'customers');
      return JSONStore.get('customers').add(data);
    })

    .then(function() {
      /*
          select *
            from 'customers'
            where
              [name] LIKE '%-@-carlos'
      */
      var query = [{
        leftLike: [{
          name: 'carlos'
        }]
      }];

      return JSONStore.get('customers').advancedFind(query);

    })

    .then(function(data) {
      deepEqual(data.length, 0, 'Result length');
      start();
    })

    .fail(function(err) {
      ok(false, err.toString());
      start();
    });
  });

  asyncTest('Left Like All Results', 8, function() {

    var collections = {
      customers: {
        searchFields: {
          name: 'string',
          age: 'integer'
        }
      }
    };

    var data = [{
      name: 'mikeortman',
      age: 1
    }, {
      name: 'Mikeortman',
      age: 2
    }, {
      name: 'mortman',
      age: 2
    }, {
      name: 'mncdortman',
      age: 3
    }, {
      name: 'ortman',
      age: 4
    }];

    JSONStore.destroy()

    .then(function(res) {
      deepEqual(res, 0, 'destroy');
      return JSONStore.init(collections);
    })

    .then(function(res) {
      deepEqual(res.customers.name, 'customers');
      return JSONStore.get('customers').add(data);
    })

    .then(function() {
      /*
          select *
            from 'customers'
            where
              [name] LIKE '%-@-carlos'
      */
      var query = [{
        leftLike: [{
          name: 'ortman'
        }]
      }];

      return JSONStore.get('customers').advancedFind(query);

    })

    .then(function(data) {
      deepEqual(data.length, 5, 'Result length');
      deepEqual(data[0].json.name, 'mikeortman', 'Result element test mikeortman');
      deepEqual(data[1].json.name, 'Mikeortman', 'Result element test Mikeortman');
      deepEqual(data[2].json.name, 'mortman', 'Result element test mortman');
      deepEqual(data[3].json.name, 'mncdortman', 'Result element test mncdortman');
      deepEqual(data[4].json.name, 'ortman', 'Result element test ortman');

      start();
    })

    .fail(function(err) {
      ok(false, err.toString());
      start();
    });
  });

  asyncTest('Left Like Multiple', 5, function() {

    var collections = {
      customers: {
        searchFields: {
          name: 'string',
          age: 'integer'
        }
      }
    };

    var data = [{
      name: 'mikeortman',
      age: 10
    }, {
      name: 'spiderman',
      age: 20
    }, {
      name: 'batman',
      age: 2
    }, {
      name: 'mncdortman',
      age: 3
    }, {
      name: 'ortman',
      age: 4
    }];

    JSONStore.destroy()

    .then(function(res) {
      deepEqual(res, 0, 'destroy');
      return JSONStore.init(collections);
    })

    .then(function(res) {
      deepEqual(res.customers.name, 'customers');
      return JSONStore.get('customers').add(data);
    })

    .then(function() {
      /*
          select *
            from 'customers'
            where
              [name] LIKE '%-@-carlos'
            AND
              [age] LIKE '%-@-0'
      */
      var query = [{
        leftLike: [{
          name: 'man'
        }, {
          age: 0
        }]
      }];

      return JSONStore.get('customers').advancedFind(query);

    })

    .then(function(data) {
      deepEqual(data.length, 2, 'Result length');
      deepEqual(data[0].json.name, 'mikeortman', 'Result element test mikeortman');
      deepEqual(data[1].json.name, 'spiderman', 'Result element test Mikeortman');

      start();
    })

    .fail(function(err) {
      ok(false, err.toString());
      start();
    });
  });

  asyncTest('Less Than Simple Test', 6, function() {

    var collections = {
      customers: {
        searchFields: {
          name: 'string',
          age: 'integer'
        }
      }
    };

    var data = [{
      name: 'carlos',
      age: 1
    }, {
      name: 'dgonz',
      age: 2
    }, {
      name: 'jeff',
      age: 2
    }, {
      name: 'mike',
      age: 3
    }, {
      name: 'nana',
      age: 4
    }];

    JSONStore.destroy()

    .then(function(res) {
      deepEqual(res, 0, 'destroy');
      return JSONStore.init(collections);
    })

    .then(function(res) {
      deepEqual(res.customers.name, 'customers');
      return JSONStore.get('customers').add(data);
    })

    .then(function() {
      /*
          select *
            from 'customers'
            where
              [age] < 3
      */

      var query = [{
        lessThan: [{
          age: 3
        }]
      }];

      return JSONStore.get('customers').advancedFind(query);

    })

    .then(function(data) {
      deepEqual(data.length, 3, 'Result length');
      if (data.length === 3) {
        deepEqual(data[0].json.name, 'carlos', 'Result element test Carlos');
        deepEqual(data[1].json.name, 'dgonz', 'Result element test Dgonz');
        deepEqual(data[2].json.name, 'jeff', 'Result element test Jeff');
      }

      start();
    })

    .fail(function(err) {
      ok(false, err.toString());
      start();
    });
  });

  asyncTest('Less Than Simple Test using multiple types for searchFields', 6, function() {

    var collections = {
      customers: {
        searchFields: {
          name: 'string',
          gpa: 'number',
          ssn: 'integer',
          active: 'boolean'
        }
      }
    };

    var data = [{
      name: 'carlos',
      gpa: 1.0,
      ssn: 123,
      active: true
    }, {
      name: 'dgonz',
      gpa: 2.2,
      ssn: 345,
      active: false
    }, {
      name: 'jeff',
      gpa: 2.4,
      ssn: 567,
      active: true
    }, {
      name: 'mike',
      gpa: 3.6,
      ssn: 789,
      active: false
    }, {
      name: 'nana',
      gpa: 4.8,
      ssn: 987,
      active: true
    }];

    JSONStore.destroy()

    .then(function(res) {
      deepEqual(res, 0, 'destroy');
      return JSONStore.init(collections);
    })

    .then(function(res) {
      deepEqual(res.customers.name, 'customers');
      return JSONStore.get('customers').add(data);
    })

    .then(function() {
      /*
          select *
            from 'customers'
            where
              [age] < 3.5
      */
      var query = [{
        lessThan: [{
          gpa: 3.5
        }]
      }];

      return JSONStore.get('customers').advancedFind(query);

    })

    .then(function(data) {
      deepEqual(data.length, 3, 'Result length');
      deepEqual(data[0].json.name, 'carlos', 'Result element test carlos');
      deepEqual(data[1].json.name, 'dgonz', 'Result element test dgonz');
      deepEqual(data[2].json.name, 'jeff', 'Result element test jeff');
      start();
    })

    .fail(function(err) {
      ok(false, err.toString());
      start();
    });
  });

  asyncTest('Less Than Simple Test with AdditonalSearchFields', 9, function() {

    var collections = {
      customers: {
        searchFields: {
          name: 'string',
          age: 'integer'
        },
        additionalSearchFields: {
          lol: 'integer'
        }
      }
    };

    var data = [{
      name: 'carlosdgonz',
      age: 1
    }, {
      name: 'carlos',
      age: 2
    }, {
      name: 'Carlos',
      age: 2
    }, {
      name: 'carlosAnderu',
      age: 3
    }, {
      name: 'nana',
      age: 4
    }];

    JSONStore.destroy()

    .then(function(res) {
      deepEqual(res, 0, 'destroy');
      return JSONStore.init(collections);
    })

    .then(function(res) {
      deepEqual(res.customers.name, 'customers');
      return JSONStore.get('customers').add([data[0], data[1], data[2], data[3]], {
        additionalSearchFields: {
          lol: 42
        }
      });
    })

    .then(function(res) {
      deepEqual(res, 4, 'added with additionalSearchFields');
      return JSONStore.get('customers').add([data[4]]);

    })

    .then(function(res) {
      deepEqual(res, 1, 'added without additionalSearchFields');
      /*
          select *
            from 'customers'
            where
              [lol] < 50
        */
      var query = [{
        lessThan: [{
          lol: 50
        }]
      }];

      return JSONStore.get('customers').advancedFind(query);

    })

    .then(function(data) {
      deepEqual(data.length, 4, 'Result length');
      deepEqual(data[0].json.name, 'carlosdgonz', 'Result element test carlosdgonz');
      deepEqual(data[1].json.name, 'carlos', 'Result element test carlos');
      deepEqual(data[2].json.name, 'Carlos', 'Result element test Carlos');
      deepEqual(data[3].json.name, 'carlosAnderu', 'Result element test carlosAnderu');
      start();
    })

    .fail(function(err) {
      ok(false, err.toString());
      start();
    });
  });

  asyncTest('Less Than Multiple', 5, function() {

    var collections = {
      customers: {
        searchFields: {
          name: 'string',
          age: 'integer',
          ssn: 'integer'
        }
      }
    };

    var data = [{
      name: 'carlos',
      age: 1,
      ssn: 12
    }, {
      name: 'dgonz',
      age: 2,
      ssn: 345
    }, {
      name: 'jeff',
      age: 2,
      ssn: 56
    }, {
      name: 'mike',
      age: 3,
      ssn: 789
    }, {
      name: 'nana',
      age: 4,
      ssn: 91
    }];

    JSONStore.destroy()

    .then(function(res) {
      deepEqual(res, 0, 'destroy');
      return JSONStore.init(collections);
    })

    .then(function(res) {
      deepEqual(res.customers.name, 'customers');
      return JSONStore.get('customers').add(data);
    })

    .then(function() {
      /*
          select *
            from 'customers'
            where
              [age] < 3
            AND
              [ssn] < 100
      */

      var query = [{
        lessThan: [{
          age: 3
        }, {
          ssn: 100
        }]
      }];

      return JSONStore.get('customers').advancedFind(query);

    })

    .then(function(data) {
      deepEqual(data.length, 2, 'Result length');

      deepEqual(data[0].json.name, 'carlos', 'Result element test Carlos');
      deepEqual(data[1].json.name, 'jeff', 'Result element test Jeff');
      start();
    })

    .fail(function(err) {
      ok(false, err.toString());
      start();
    });
  });

  asyncTest('Less Than No Results', 3, function() {

    var collections = {
      customers: {
        searchFields: {
          name: 'string',
          age: 'integer'
        }
      }
    };

    var data = [{
      name: 'carlos',
      age: 1
    }, {
      name: 'dgonz',
      age: 2
    }, {
      name: 'jeff',
      age: 2
    }, {
      name: 'mike',
      age: 3
    }, {
      name: 'nana',
      age: 4
    }];

    JSONStore.destroy()

    .then(function(res) {
      deepEqual(res, 0, 'destroy');
      return JSONStore.init(collections);
    })

    .then(function(res) {
      deepEqual(res.customers.name, 'customers');
      return JSONStore.get('customers').add(data);
    })

    .then(function() {
      /*
          select *
            from 'customers'
            where
              [age] < 1
      */
      var query = [{
        lessThan: [{
          age: 1
        }]
      }];

      return JSONStore.get('customers').advancedFind(query);

    })

    .then(function(data) {
      deepEqual(data.length, 0, 'Result length');
      start();
    })

    .fail(function(err) {
      ok(false, err.toString());
      start();
    });
  });

  asyncTest('Less Than All Results', 8, function() {

    var collections = {
      customers: {
        searchFields: {
          name: 'string',
          age: 'integer'
        }
      }
    };

    var data = [{
      name: 'carlos',
      age: 1
    }, {
      name: 'dgonz',
      age: 2
    }, {
      name: 'jeff',
      age: 2
    }, {
      name: 'mike',
      age: 3
    }, {
      name: 'nana',
      age: 4
    }];

    JSONStore.destroy()

    .then(function(res) {
      deepEqual(res, 0, 'destroy');
      return JSONStore.init(collections);
    })

    .then(function(res) {
      deepEqual(res.customers.name, 'customers');
      return JSONStore.get('customers').add(data);
    })

    .then(function() {
      /*
          select *
            from 'customers'
            where
              [age] < 5
      */
      var query = [{
        lessThan: [{
          age: 5
        }]
      }];

      return JSONStore.get('customers').advancedFind(query);

    })

    .then(function(data) {
      deepEqual(data.length, 5, 'Result length');

      if (data.length === 5) {
        deepEqual(data[0].json.name, 'carlos', 'Result element test Nana');
        deepEqual(data[1].json.name, 'dgonz', 'Result element test Dgonz');
        deepEqual(data[2].json.name, 'jeff', 'Result element test Jeff');
        deepEqual(data[3].json.name, 'mike', 'Result element test Mike');
        deepEqual(data[4].json.name, 'nana', 'Result element test Nana');
      }
      start();
    })

    .fail(function(err) {
      ok(false, err.toString());
      start();
    });
  });

  asyncTest('Less Than Equals Simple Test', 7, function() {

    var collections = {
      customers: {
        searchFields: {
          name: 'string',
          age: 'integer'
        }
      }
    };

    var data = [{
      name: 'carlos',
      age: 1
    }, {
      name: 'dgonz',
      age: 2
    }, {
      name: 'jeff',
      age: 2
    }, {
      name: 'mike',
      age: 3
    }, {
      name: 'nana',
      age: 4
    }];

    JSONStore.destroy()

    .then(function(res) {
      deepEqual(res, 0, 'destroy');
      return JSONStore.init(collections);
    })

    .then(function(res) {
      deepEqual(res.customers.name, 'customers');
      return JSONStore.get('customers').add(data);
    })

    .then(function() {
      /*
          select *
            from 'customers'
            where
              [age] <= 3
      */

      var query = [{
        lessOrEqualThan: [{
          age: 3
        }]
      }];

      return JSONStore.get('customers').advancedFind(query);

    })

    .then(function(data) {
      deepEqual(data.length, 4, 'Result length');

      if (data.length === 4) {
        deepEqual(data[0].json.name, 'carlos', 'Result element test Carlos');
        deepEqual(data[1].json.name, 'dgonz', 'Result element test Dgonz');
        deepEqual(data[2].json.name, 'jeff', 'Result element test Jeff');
        deepEqual(data[3].json.name, 'mike', 'Result element test Mike');
      }
      start();
    })

    .fail(function(err) {
      ok(false, err.toString());
      start();
    });
  });

  asyncTest('Less Than Equals Simple Test using multiple types for searchFields', 6, function() {

    var collections = {
      customers: {
        searchFields: {
          name: 'string',
          gpa: 'number',
          ssn: 'integer',
          active: 'boolean'
        }
      }
    };

    var data = [{
      name: 'carlos',
      gpa: 1.0,
      ssn: 123,
      active: true
    }, {
      name: 'dgonz',
      gpa: 2.2,
      ssn: 345,
      active: false
    }, {
      name: 'jeff',
      gpa: 2.4,
      ssn: 567,
      active: true
    }, {
      name: 'mike',
      gpa: 3.6,
      ssn: 789,
      active: false
    }, {
      name: 'nana',
      gpa: 4.8,
      ssn: 987,
      active: true
    }];

    JSONStore.destroy()

    .then(function(res) {
      deepEqual(res, 0, 'destroy');
      return JSONStore.init(collections);
    })

    .then(function(res) {
      deepEqual(res.customers.name, 'customers');
      return JSONStore.get('customers').add(data);
    })

    .then(function() {
      /*
          select *
            from 'customers'
            where
              [gpa] <= 2.4
      */
      var query = [{
        lessOrEqualThan: [{
          gpa: 2.4
        }]
      }];

      return JSONStore.get('customers').advancedFind(query);

    })

    .then(function(data) {
      deepEqual(data.length, 3, 'Result length');
      deepEqual(data[0].json.name, 'carlos', 'Result element test carlos');
      deepEqual(data[1].json.name, 'dgonz', 'Result element test dgonz');
      deepEqual(data[2].json.name, 'jeff', 'Result element test jeff');
      start();
    })

    .fail(function(err) {
      ok(false, err.toString());
      start();
    });
  });

  asyncTest('Less Than Equals Simple Test with AdditonalSearchFields', 9, function() {

    var collections = {
      customers: {
        searchFields: {
          name: 'string',
          age: 'integer'
        },
        additionalSearchFields: {
          lol: 'integer'
        }
      }
    };

    var data = [{
      name: 'carlosdgonz',
      age: 1
    }, {
      name: 'carlos',
      age: 2
    }, {
      name: 'Carlos',
      age: 2
    }, {
      name: 'carlosAnderu',
      age: 3
    }, {
      name: 'nana',
      age: 4
    }];

    JSONStore.destroy()

    .then(function(res) {
      deepEqual(res, 0, 'destroy');
      return JSONStore.init(collections);
    })

    .then(function(res) {
      deepEqual(res.customers.name, 'customers');
      return JSONStore.get('customers').add([data[0], data[1], data[2], data[3]], {
        additionalSearchFields: {
          lol: 77
        }
      });
    })

    .then(function(res) {
      deepEqual(res, 4, 'added with additionalSearchFields');
      return JSONStore.get('customers').add([data[4]]);

    })

    .then(function(res) {
      deepEqual(res, 1, 'added without additionalSearchFields');
      /*
          select *
            from 'customers'
            where
              [lol] <= 88
        */
      var query = [{
        lessOrEqualThan: [{
          lol: 88
        }]
      }];

      return JSONStore.get('customers').advancedFind(query);

    })

    .then(function(data) {
      deepEqual(data.length, 4, 'Result length');
      deepEqual(data[0].json.name, 'carlosdgonz', 'Result element test carlosdgonz');
      deepEqual(data[1].json.name, 'carlos', 'Result element test carlos');
      deepEqual(data[2].json.name, 'Carlos', 'Result element test Carlos');
      deepEqual(data[3].json.name, 'carlosAnderu', 'Result element test carlosAnderu');
      start();
    })

    .fail(function(err) {
      ok(false, err.toString());
      start();
    });
  });

  asyncTest('Less Than Equals No Results Test', 3, function() {

    var collections = {
      customers: {
        searchFields: {
          name: 'string',
          age: 'integer'
        }
      }
    };

    var data = [{
      name: 'carlos',
      age: 1
    }, {
      name: 'dgonz',
      age: 2
    }, {
      name: 'jeff',
      age: 2
    }, {
      name: 'mike',
      age: 3
    }, {
      name: 'nana',
      age: 4
    }];

    JSONStore.destroy()

    .then(function(res) {
      deepEqual(res, 0, 'destroy');
      return JSONStore.init(collections);
    })

    .then(function(res) {
      deepEqual(res.customers.name, 'customers');
      return JSONStore.get('customers').add(data);
    })

    .then(function() {
      /*
          select *
            from 'customers'
            where
              [age] <= 0
      */
      var query = [{
        lessOrEqualThan: [{
          age: 0
        }]
      }];

      return JSONStore.get('customers').advancedFind(query);

    })

    .then(function(data) {
      deepEqual(data.length, 0, 'Result length');
      start();
    })

    .fail(function(err) {
      ok(false, err.toString());
      start();
    });
  });

  asyncTest('Less Than Equals Multiple', 4, function() {

    var collections = {
      customers: {
        searchFields: {
          name: 'string',
          age: 'integer',
          ssn: 'integer'
        }
      }
    };

    var data = [{
      name: 'carlos',
      age: 1,
      ssn: 50
    }, {
      name: 'dgonz',
      age: 2,
      ssn: 345
    }, {
      name: 'jeff',
      age: 2,
      ssn: 56
    }, {
      name: 'mike',
      age: 3,
      ssn: 789
    }, {
      name: 'nana',
      age: 4,
      ssn: 91
    }];

    JSONStore.destroy()

    .then(function(res) {
      deepEqual(res, 0, 'destroy');
      return JSONStore.init(collections);
    })

    .then(function(res) {
      deepEqual(res.customers.name, 'customers');
      return JSONStore.get('customers').add(data);
    })

    .then(function() {
      /*
          select *
            from 'customers'
            where
              [age] <= 3
            AND
              [ssn] <= 50
      */

      var query = [{
        lessOrEqualThan: [{
          age: 3
        }, {
          ssn: 50
        }]
      }];

      return JSONStore.get('customers').advancedFind(query);

    })

    .then(function(data) {
      deepEqual(data.length, 1, 'Result length');

      deepEqual(data[0].json.name, 'carlos', 'Result element test Carlos');
      start();
    })

    .fail(function(err) {
      ok(false, err.toString());
      start();
    });
  });

  asyncTest('Less Than Equals All Results', 8, function() {

    var collections = {
      customers: {
        searchFields: {
          name: 'string',
          age: 'integer'
        }
      }
    };

    var data = [{
      name: 'carlos',
      age: 1
    }, {
      name: 'dgonz',
      age: 2
    }, {
      name: 'jeff',
      age: 2
    }, {
      name: 'mike',
      age: 3
    }, {
      name: 'nana',
      age: 4
    }];

    JSONStore.destroy()

    .then(function(res) {
      deepEqual(res, 0, 'destroy');
      return JSONStore.init(collections);
    })

    .then(function(res) {
      deepEqual(res.customers.name, 'customers');
      return JSONStore.get('customers').add(data);
    })

    .then(function() {
      /*
          select *
            from 'customers'
            where
              [age] <= 4
      */
      var query = [{
        lessOrEqualThan: [{
          age: 4
        }]
      }];

      return JSONStore.get('customers').advancedFind(query);

    })

    .then(function(data) {
      deepEqual(data.length, 5, 'Result length');

      if (data.length === 5) {
        deepEqual(data[0].json.name, 'carlos', 'Result element test Nana');
        deepEqual(data[1].json.name, 'dgonz', 'Result element test Dgonz');
        deepEqual(data[2].json.name, 'jeff', 'Result element test Jeff');
        deepEqual(data[3].json.name, 'mike', 'Result element test Mike');
        deepEqual(data[4].json.name, 'nana', 'Result element test Nana');
      }
      start();
    })

    .fail(function(err) {
      ok(false, err.toString());
      start();
    });
  });

  asyncTest('Greater Than Simple Test', 5, function() {

    var collections = {
      customers: {
        searchFields: {
          name: 'string',
          age: 'integer'
        }
      }
    };

    var data = [{
      name: 'carlos',
      age: 1
    }, {
      name: 'dgonz',
      age: 2
    }, {
      name: 'jeff',
      age: 2
    }, {
      name: 'mike',
      age: 3
    }, {
      name: 'nana',
      age: 4
    }];

    JSONStore.destroy()

    .then(function(res) {
      deepEqual(res, 0, 'destroy');
      return JSONStore.init(collections);
    })

    .then(function(res) {
      deepEqual(res.customers.name, 'customers');
      return JSONStore.get('customers').add(data);
    })

    .then(function() {
      /*
          select *
            from 'customers'
            where
              [age] > 2
      */

      var query = [{
        greaterThan: [{
          age: 2
        }]
      }];

      return JSONStore.get('customers').advancedFind(query);

    })

    .then(function(data) {
      deepEqual(data.length, 2, 'Result length');

      if (data.length === 2) {
        deepEqual(data[0].json.name, 'mike', 'Result element test Mike');
        deepEqual(data[1].json.name, 'nana', 'Result element test Nana');
      }

      start();
    })

    .fail(function(err) {
      ok(false, err.toString());
      start();
    });
  });

  asyncTest('Greater Than Simple Test using multiple types for searchFields', 5, function() {

    var collections = {
      customers: {
        searchFields: {
          name: 'string',
          gpa: 'number',
          ssn: 'integer',
          active: 'boolean'
        }
      }
    };

    var data = [{
      name: 'carlos',
      gpa: 1.0,
      ssn: 123,
      active: true
    }, {
      name: 'dgonz',
      gpa: 2.2,
      ssn: 345,
      active: false
    }, {
      name: 'jeff',
      gpa: 2.4,
      ssn: 567,
      active: true
    }, {
      name: 'mike',
      gpa: 3.6,
      ssn: 789,
      active: false
    }, {
      name: 'nana',
      gpa: 4.8,
      ssn: 987,
      active: true
    }];

    JSONStore.destroy()

    .then(function(res) {
      deepEqual(res, 0, 'destroy');
      return JSONStore.init(collections);
    })

    .then(function(res) {
      deepEqual(res.customers.name, 'customers');
      return JSONStore.get('customers').add(data);
    })

    .then(function() {
      /*
          select *
            from 'customers'
            where
              [age] > 2.5
      */

      var query = [{
        greaterThan: [{
          gpa: 2.5
        }]
      }];

      return JSONStore.get('customers').advancedFind(query);

    })

    .then(function(data) {
      deepEqual(data.length, 2, 'Result length');
      deepEqual(data[0].json.name, 'mike', 'Result element test mike');
      deepEqual(data[1].json.name, 'nana', 'Result element test nana');
      start();
    })

    .fail(function(err) {
      ok(false, err.toString());
      start();
    });
  });

  asyncTest('Greater Than Simple Test with AdditonalSearchFields', 9, function() {

    var collections = {
      customers: {
        searchFields: {
          name: 'string',
          age: 'integer'
        },
        additionalSearchFields: {
          lol: 'integer'
        }
      }
    };

    var data = [{
      name: 'carlosdgonz',
      age: 1
    }, {
      name: 'carlos',
      age: 2
    }, {
      name: 'Carlos',
      age: 2
    }, {
      name: 'carlosAnderu',
      age: 3
    }, {
      name: 'nana',
      age: 4
    }];

    JSONStore.destroy()

    .then(function(res) {
      deepEqual(res, 0, 'destroy');
      return JSONStore.init(collections);
    })

    .then(function(res) {
      deepEqual(res.customers.name, 'customers');
      return JSONStore.get('customers').add([data[0], data[1], data[2], data[3]], {
        additionalSearchFields: {
          lol: 44
        }
      });
    })

    .then(function(res) {
      deepEqual(res, 4, 'added with additionalSearchFields');
      return JSONStore.get('customers').add([data[4]]);

    })

    .then(function(res) {
      deepEqual(res, 1, 'added without additionalSearchFields');
      /*
          select *
            from 'customers'
            where
              [lol] > 42
        */

      var query = [{
        greaterThan: [{
          lol: 42
        }]
      }];

      return JSONStore.get('customers').advancedFind(query);

    })

    .then(function(data) {
      deepEqual(data.length, 4, 'Result length');
      deepEqual(data[0].json.name, 'carlosdgonz', 'Result element test carlosdgonz');
      deepEqual(data[1].json.name, 'carlos', 'Result element test carlos');
      deepEqual(data[2].json.name, 'Carlos', 'Result element test Carlos');
      deepEqual(data[3].json.name, 'carlosAnderu', 'Result element test carlosAnderu');
      start();
    })

    .fail(function(err) {
      ok(false, err.toString());
      start();
    });
  });

  asyncTest('Greater Than Multiple', 4, function() {

    var collections = {
      customers: {
        searchFields: {
          name: 'string',
          age: 'integer',
          ssn: 'integer'
        }
      }
    };

    var data = [{
      name: 'carlos',
      age: 1,
      ssn: 12
    }, {
      name: 'dgonz',
      age: 2,
      ssn: 345
    }, {
      name: 'jeff',
      age: 2,
      ssn: 156
    }, {
      name: 'mike',
      age: 3,
      ssn: 789
    }, {
      name: 'nana',
      age: 4,
      ssn: 191
    }];

    JSONStore.destroy()

    .then(function(res) {
      deepEqual(res, 0, 'destroy');
      return JSONStore.init(collections);
    })

    .then(function(res) {
      deepEqual(res.customers.name, 'customers');
      return JSONStore.get('customers').add(data);
    })

    .then(function() {
      /*
          select *
            from 'customers'
            where
              [age] > 3
            AND
              [ssn] > 100
      */

      var query = [{
        greaterThan: [{
          age: 3
        }, {
          ssn: 100
        }]
      }];

      return JSONStore.get('customers').advancedFind(query);

    })

    .then(function(data) {
      deepEqual(data.length, 1, 'Result length');
      deepEqual(data[0].json.name, 'nana', 'Result element test Carlos');
      start();
    })

    .fail(function(err) {
      ok(false, err.toString());
      start();
    });
  });

  asyncTest('Greater Than No Results', 3, function() {

    var collections = {
      customers: {
        searchFields: {
          name: 'string',
          age: 'integer'
        }
      }
    };

    var data = [{
      name: 'carlos',
      age: 1
    }, {
      name: 'dgonz',
      age: 2
    }, {
      name: 'jeff',
      age: 2
    }, {
      name: 'mike',
      age: 3
    }, {
      name: 'nana',
      age: 4
    }];

    JSONStore.destroy()

    .then(function(res) {
      deepEqual(res, 0, 'destroy');
      return JSONStore.init(collections);
    })

    .then(function(res) {
      deepEqual(res.customers.name, 'customers');
      return JSONStore.get('customers').add(data);
    })

    .then(function() {
      /*
          select *
            from 'customers'
            where
              [age] > 4
      */
      var query = [{
        greaterThan: [{
          age: 4
        }]
      }];

      return JSONStore.get('customers').advancedFind(query);

    })

    .then(function(data) {
      deepEqual(data.length, 0, 'Result length');
      start();
    })

    .fail(function(err) {
      ok(false, err.toString());
      start();
    });
  });

  asyncTest('Greater Than All Results', 8, function() {

    var collections = {
      customers: {
        searchFields: {
          name: 'string',
          age: 'integer'
        }
      }
    };

    var data = [{
      name: 'carlos',
      age: 1
    }, {
      name: 'dgonz',
      age: 2
    }, {
      name: 'jeff',
      age: 2
    }, {
      name: 'mike',
      age: 3
    }, {
      name: 'nana',
      age: 4
    }];

    JSONStore.destroy()

    .then(function(res) {
      deepEqual(res, 0, 'destroy');
      return JSONStore.init(collections);
    })

    .then(function(res) {
      deepEqual(res.customers.name, 'customers');
      return JSONStore.get('customers').add(data);
    })

    .then(function() {
      /*
          select *
            from 'customers'
            where
              [age] > 0
      */
      var query = [{
        greaterThan: [{
          age: 0
        }]
      }];

      return JSONStore.get('customers').advancedFind(query);

    })

    .then(function(data) {
      deepEqual(data.length, 5, 'Result length');

      if (data.length === 5) {
        deepEqual(data[0].json.name, 'carlos', 'Result element test Nana');
        deepEqual(data[1].json.name, 'dgonz', 'Result element test Dgonz');
        deepEqual(data[2].json.name, 'jeff', 'Result element test Jeff');
        deepEqual(data[3].json.name, 'mike', 'Result element test Mike');
        deepEqual(data[4].json.name, 'nana', 'Result element test Nana');
      }
      start();
    })

    .fail(function(err) {
      ok(false, err.toString());
      start();
    });
  });

  asyncTest('Greater Than Equals Simple Test', 7, function() {

    var collections = {
      customers: {
        searchFields: {
          name: 'string',
          age: 'integer'
        }
      }
    };

    var data = [{
      name: 'carlos',
      age: 1
    }, {
      name: 'dgonz',
      age: 2
    }, {
      name: 'jeff',
      age: 2
    }, {
      name: 'mike',
      age: 3
    }, {
      name: 'nana',
      age: 4
    }];

    JSONStore.destroy()

    .then(function(res) {
      deepEqual(res, 0, 'destroy');
      return JSONStore.init(collections);
    })

    .then(function(res) {
      deepEqual(res.customers.name, 'customers');
      return JSONStore.get('customers').add(data);
    })

    .then(function() {
      /*
          select *
            from 'customers'
            where
              [age] >= 2
      */
      var query = [{
        greaterOrEqualThan: [{
          age: 2
        }]
      }];

      return JSONStore.get('customers').advancedFind(query);

    })

    .then(function(data) {
      deepEqual(data.length, 4, 'Result length');

      if (data.length === 4) {
        deepEqual(data[0].json.name, 'dgonz', 'Result element test Dgonz');
        deepEqual(data[1].json.name, 'jeff', 'Result element test Jeff');
        deepEqual(data[2].json.name, 'mike', 'Result element test Mike');
        deepEqual(data[3].json.name, 'nana', 'Result element test Nana');
      }
      start();
    })

    .fail(function(err) {
      ok(false, err.toString());
      start();
    });
  });

  asyncTest('Greater Than Equals Simple Test using multiple types for searchFields', 5, function() {

    var collections = {
      customers: {
        searchFields: {
          name: 'string',
          gpa: 'number',
          ssn: 'integer',
          active: 'boolean'
        }
      }
    };

    var data = [{
      name: 'carlos',
      gpa: 1.0,
      ssn: 123,
      active: true
    }, {
      name: 'dgonz',
      gpa: 2.2,
      ssn: 345,
      active: false
    }, {
      name: 'jeff',
      gpa: 2.4,
      ssn: 567,
      active: true
    }, {
      name: 'mike',
      gpa: 3.6,
      ssn: 789,
      active: false
    }, {
      name: 'nana',
      gpa: 4.8,
      ssn: 987,
      active: true
    }];

    JSONStore.destroy()

    .then(function(res) {
      deepEqual(res, 0, 'destroy');
      return JSONStore.init(collections);
    })

    .then(function(res) {
      deepEqual(res.customers.name, 'customers');
      return JSONStore.get('customers').add(data);
    })

    .then(function() {
      /*
          select *
            from 'customers'
            where
              [gpa] >= 3.6
      */

      var query = [{
        greaterOrEqualThan: [{
          gpa: 3.6
        }]
      }];

      return JSONStore.get('customers').advancedFind(query);

    })

    .then(function(data) {
      deepEqual(data.length, 2, 'Result length');
      deepEqual(data[0].json.name, 'mike', 'Result element test mike');
      deepEqual(data[1].json.name, 'nana', 'Result element test nana');
      start();
    })

    .fail(function(err) {
      ok(false, err.toString());
      start();
    });
  });

  asyncTest('Greater Than Equals Simple Test with AdditonalSearchFields', 9, function() {

    var collections = {
      customers: {
        searchFields: {
          name: 'string',
          age: 'integer'
        },
        additionalSearchFields: {
          lol: 'integer'
        }
      }
    };

    var data = [{
      name: 'carlosdgonz',
      age: 1
    }, {
      name: 'carlos',
      age: 2
    }, {
      name: 'Carlos',
      age: 2
    }, {
      name: 'carlosAnderu',
      age: 3
    }, {
      name: 'nana',
      age: 4
    }];

    JSONStore.destroy()

    .then(function(res) {
      deepEqual(res, 0, 'destroy');
      return JSONStore.init(collections);
    })

    .then(function(res) {
      deepEqual(res.customers.name, 'customers');
      return JSONStore.get('customers').add([data[0], data[1], data[2], data[3]], {
        additionalSearchFields: {
          lol: 77
        }
      });
    })

    .then(function(res) {
      deepEqual(res, 4, 'added with additionalSearchFields');
      return JSONStore.get('customers').add([data[4]]);

    })

    .then(function(res) {
      deepEqual(res, 1, 'added without additionalSearchFields');
      /*
          select *
            from 'customers'
            where
              [lol] >= 33
        */

      var query = [{
        greaterOrEqualThan: [{
          lol: 33
        }]
      }];

      return JSONStore.get('customers').advancedFind(query);

    })

    .then(function(data) {
      deepEqual(data.length, 4, 'Result length');
      deepEqual(data[0].json.name, 'carlosdgonz', 'Result element test carlosdgonz');
      deepEqual(data[1].json.name, 'carlos', 'Result element test carlos');
      deepEqual(data[2].json.name, 'Carlos', 'Result element test Carlos');
      deepEqual(data[3].json.name, 'carlosAnderu', 'Result element test carlosAnderu');
      start();
    })

    .fail(function(err) {
      ok(false, err.toString());
      start();
    });
  });

  asyncTest('Greater Than Equals No Results', 3, function() {

    var collections = {
      customers: {
        searchFields: {
          name: 'string',
          age: 'integer'
        }
      }
    };

    var data = [{
      name: 'carlos',
      age: 1
    }, {
      name: 'dgonz',
      age: 2
    }, {
      name: 'jeff',
      age: 2
    }, {
      name: 'mike',
      age: 3
    }, {
      name: 'nana',
      age: 4
    }];

    JSONStore.destroy()

    .then(function(res) {
      deepEqual(res, 0, 'destroy');
      return JSONStore.init(collections);
    })

    .then(function(res) {
      deepEqual(res.customers.name, 'customers');
      return JSONStore.get('customers').add(data);
    })

    .then(function() {
      /*
          select *
            from 'customers'
            where
              [age] >= 5
      */
      var query = [{
        greaterOrEqualThan: [{
          age: 5
        }]
      }];

      return JSONStore.get('customers').advancedFind(query);

    })

    .then(function(data) {
      deepEqual(data.length, 0, 'Result length');
      start();
    })

    .fail(function(err) {
      ok(false, err.toString());
      start();
    });
  });

  asyncTest('Greater Than Equals Multiple', 5, function() {

    var collections = {
      customers: {
        searchFields: {
          name: 'string',
          age: 'integer',
          ssn: 'integer'
        }
      }
    };

    var data = [{
      name: 'carlos',
      age: 1,
      ssn: 12
    }, {
      name: 'dgonz',
      age: 2,
      ssn: 345
    }, {
      name: 'jeff',
      age: 2,
      ssn: 56
    }, {
      name: 'mike',
      age: 3,
      ssn: 789
    }, {
      name: 'nana',
      age: 4,
      ssn: 91
    }];

    JSONStore.destroy()

    .then(function(res) {
      deepEqual(res, 0, 'destroy');
      return JSONStore.init(collections);
    })

    .then(function(res) {
      deepEqual(res.customers.name, 'customers');
      return JSONStore.get('customers').add(data);
    })

    .then(function() {
      /*
          select *
            from 'customers'
            where
              [age] >= 3
            AND
              [ssn] >= 90
      */

      var query = [{
        greaterOrEqualThan: [{
          age: 3
        }, {
          ssn: 90
        }]
      }];

      return JSONStore.get('customers').advancedFind(query);

    })

    .then(function(data) {
      deepEqual(data.length, 2, 'Result length');

      deepEqual(data[0].json.name, 'mike', 'Result element test mike');
      deepEqual(data[1].json.name, 'nana', 'Result element test nana');
      start();
    })

    .fail(function(err) {
      ok(false, err.toString());
      start();
    });
  });

  asyncTest('Greater Than Equals All Results', 8, function() {

    var collections = {
      customers: {
        searchFields: {
          name: 'string',
          age: 'integer'
        }
      }
    };

    var data = [{
      name: 'carlos',
      age: 1
    }, {
      name: 'dgonz',
      age: 2
    }, {
      name: 'jeff',
      age: 2
    }, {
      name: 'mike',
      age: 3
    }, {
      name: 'nana',
      age: 4
    }];

    JSONStore.destroy()

    .then(function(res) {
      deepEqual(res, 0, 'destroy');
      return JSONStore.init(collections);
    })

    .then(function(res) {
      deepEqual(res.customers.name, 'customers');
      return JSONStore.get('customers').add(data);
    })

    .then(function() {
      /*
          select *
            from 'customers'
            where
              [age] >= 1
      */
      var query = [{
        greaterOrEqualThan: [{
          age: 1
        }]
      }];

      return JSONStore.get('customers').advancedFind(query);

    })

    .then(function(data) {
      deepEqual(data.length, 5, 'Result length');

      if (data.length === 5) {
        deepEqual(data[0].json.name, 'carlos', 'Result element test Nana');
        deepEqual(data[1].json.name, 'dgonz', 'Result element test Dgonz');
        deepEqual(data[2].json.name, 'jeff', 'Result element test Jeff');
        deepEqual(data[3].json.name, 'mike', 'Result element test Mike');
        deepEqual(data[4].json.name, 'nana', 'Result element test Nana');
      }
      start();
    })

    .fail(function(err) {
      ok(false, err.toString());
      start();
    });
  });

  asyncTest('Integer Equals Simple Test', 5, function() {

    var collections = {
      customers: {
        searchFields: {
          name: 'string',
          age: 'integer'
        }
      }
    };

    var data = [{
      name: 'carlos',
      age: 1
    }, {
      name: 'dgonz',
      age: 2
    }, {
      name: 'jeff',
      age: 2
    }, {
      name: 'mike',
      age: 3
    }, {
      name: 'nana',
      age: 4
    }];

    JSONStore.destroy()

    .then(function(res) {
      deepEqual(res, 0, 'destroy');
      return JSONStore.init(collections);
    })

    .then(function(res) {
      deepEqual(res.customers.name, 'customers');
      return JSONStore.get('customers').add(data);
    })

    .then(function() {
      /*
          select *
            from 'customers'
            where
              [age] = 2
      */
      var query = [{
        equal: [{
          age: 2
        }]
      }];

      return JSONStore.get('customers').advancedFind(query);

    })

    .then(function(data) {
      deepEqual(data.length, 2, 'Result length');

      if (data.length === 2) {
        deepEqual(data[0].json.name, 'dgonz', 'Result element test Dgonz');
        deepEqual(data[1].json.name, 'jeff', 'Result element test Jeff');
      }
      start();
    })

    .fail(function(err) {
      ok(false, err.toString());
      start();
    });
  });

  asyncTest('Equals Simple Test using multiple types for searchFields', 4, function() {

    var collections = {
      customers: {
        searchFields: {
          name: 'string',
          gpa: 'number',
          ssn: 'integer',
          active: 'boolean'
        }
      }
    };

    var data = [{
      name: 'carlos',
      gpa: 1.0,
      ssn: 123,
      active: true
    }, {
      name: 'dgonz',
      gpa: 2.2,
      ssn: 345,
      active: false
    }, {
      name: 'jeff',
      gpa: 2.4,
      ssn: 567,
      active: true
    }, {
      name: 'mike',
      gpa: 3.6,
      ssn: 789,
      active: false
    }, {
      name: 'nana',
      gpa: 4.8,
      ssn: 987,
      active: true
    }];

    JSONStore.destroy()

    .then(function(res) {
      deepEqual(res, 0, 'destroy');
      return JSONStore.init(collections);
    })

    .then(function(res) {
      deepEqual(res.customers.name, 'customers');
      return JSONStore.get('customers').add(data);
    })

    .then(function() {
      /*
          select *
            from 'customers'
            where
              [gpa] = 3.6
      */

      var query = [{
        equal: [{
          gpa: 3.6
        }]
      }];

      return JSONStore.get('customers').advancedFind(query);

    })

    .then(function(data) {
      deepEqual(data.length, 1, 'Result length');
      deepEqual(data[0].json.name, 'mike', 'Result element test mike');
      start();
    })

    .fail(function(err) {
      ok(false, err.toString());
      start();
    });
  });

  asyncTest('Equal Simple Test with AdditonalSearchFields', 8, function() {

    var collections = {
      customers: {
        searchFields: {
          name: 'string',
          age: 'integer'
        },
        additionalSearchFields: {
          lol: 'integer'
        }
      }
    };

    var data = [{
      name: 'carlosdgonz',
      age: 1
    }, {
      name: 'carlos',
      age: 2
    }, {
      name: 'Carlos',
      age: 2
    }, {
      name: 'carlosAnderu',
      age: 3
    }, {
      name: 'nana',
      age: 4
    }];

    JSONStore.destroy()

    .then(function(res) {
      deepEqual(res, 0, 'destroy');
      return JSONStore.init(collections);
    })

    .then(function(res) {
      deepEqual(res.customers.name, 'customers');
      return JSONStore.get('customers').add([data[0], data[1]], {
        additionalSearchFields: {
          lol: 44
        }
      });
    })

    .then(function(res) {
      deepEqual(res, 2, 'added with additionalSearchFields');
      return JSONStore.get('customers').add([data[2], data[3], data[4]], {
        additionalSearchFields: {
          lol: 33
        }
      });

    })

    .then(function(res) {
      deepEqual(res, 3, 'added with additionalSearchFields');
      /*
          select *
            from 'customers'
            where
              [lol] = 33
        */
      var query = [{
        equal: [{
          lol: 33
        }]
      }];

      return JSONStore.get('customers').advancedFind(query);

    })

    .then(function(data) {
      deepEqual(data.length, 3, 'Result length');
      deepEqual(data[0].json.name, 'Carlos', 'Result element test Carlos');
      deepEqual(data[1].json.name, 'carlosAnderu', 'Result element test carlosAnderu');
      deepEqual(data[2].json.name, 'nana', 'Result element test Carlos');
      start();
    })

    .fail(function(err) {
      ok(false, err.toString());
      start();
    });
  });

  asyncTest('Equals Multiple', 5, function() {

    var collections = {
      customers: {
        searchFields: {
          name: 'string',
          age: 'integer',
          ssn: 'integer'
        }
      }
    };

    var data = [{
      name: 'carlos',
      age: 3,
      ssn: 12
    }, {
      name: 'dgonz',
      age: 2,
      ssn: 345
    }, {
      name: 'jeff',
      age: 3,
      ssn: 12
    }, {
      name: 'mike',
      age: 2,
      ssn: 789
    }, {
      name: 'nana',
      age: 4,
      ssn: 91
    }];

    JSONStore.destroy()

    .then(function(res) {
      deepEqual(res, 0, 'destroy');
      return JSONStore.init(collections);
    })

    .then(function(res) {
      deepEqual(res.customers.name, 'customers');
      return JSONStore.get('customers').add(data);
    })

    .then(function() {
      /*
          select *
            from 'customers'
            where
              [age] = 3
            AND
              [ssn] = 12
      */

      var query = [{
        equal: [{
          age: 3
        }, {
          ssn: 12
        }]
      }];

      return JSONStore.get('customers').advancedFind(query);

    })

    .then(function(data) {
      deepEqual(data.length, 2, 'Result length');

      deepEqual(data[0].json.name, 'carlos', 'Result element test Carlos');
      deepEqual(data[1].json.name, 'jeff', 'Result element test Jeff');
      start();
    })

    .fail(function(err) {
      ok(false, err.toString());
      start();
    });
  });

  asyncTest('String Equals Simple Test', 4, function() {

    var collections = {
      customers: {
        searchFields: {
          name: 'string',
          age: 'integer'
        }
      }
    };

    var data = [{
      name: 'carlos',
      age: 1
    }, {
      name: 'dgonz',
      age: 2
    }, {
      name: 'dgonzfailure',
      age: 2
    }, {
      name: 'failuredgonz',
      age: 2
    }, {
      name: 'jeff',
      age: 2
    }, {
      name: 'mike',
      age: 3
    }, {
      name: 'nana',
      age: 4
    }];

    JSONStore.destroy()

    .then(function(res) {
      deepEqual(res, 0, 'destroy');
      return JSONStore.init(collections);
    })

    .then(function(res) {
      deepEqual(res.customers.name, 'customers');
      return JSONStore.get('customers').add(data);
    })

    .then(function() {
      /*
          SELECT *
            FROM 'customers'
            WHERE
              [name] = 'dgonz'
      */
      var query = [{
        equal: [{
          name: 'dgonz'
        }]
      }];

      return JSONStore.get('customers').advancedFind(query);

    })

    .then(function(data) {
      deepEqual(data.length, 1, 'Result length');

      if (data.length === 1) {
        deepEqual(data[0].json.name, 'dgonz', 'Result element test Dgonz');
      }

      start();
    })

    .fail(function(err) {
      ok(false, err.toString());
      start();
    });
  });

  asyncTest('String Equal Simple Test with AdditonalSearchFields', 8, function() {

    var collections = {
      customers: {
        searchFields: {
          name: 'string',
          age: 'integer'
        },
        additionalSearchFields: {
          lol: 'string'
        }
      }
    };

    var data = [{
      name: 'carlosdgonz',
      age: 1
    }, {
      name: 'carlos',
      age: 2
    }, {
      name: 'Carlos',
      age: 2
    }, {
      name: 'carlosAnderu',
      age: 3
    }, {
      name: 'nana',
      age: 4
    }];

    JSONStore.destroy()

    .then(function(res) {
      deepEqual(res, 0, 'destroy');
      return JSONStore.init(collections);
    })

    .then(function(res) {
      deepEqual(res.customers.name, 'customers');
      return JSONStore.get('customers').add([data[0], data[1]], {
        additionalSearchFields: {
          lol: 'hey'
        }
      });
    })

    .then(function(res) {
      deepEqual(res, 2, 'added with additionalSearchFields');
      return JSONStore.get('customers').add([data[2], data[3], data[4]], {
        additionalSearchFields: {
          lol: 'hi'
        }
      });

    })

    .then(function(res) {
      deepEqual(res, 3, 'added with additionalSearchFields');
      /*
          SELECT *
            FROM 'customers'
            WHERE
              [lol] = 'hi'
        */
      var query = [{
        equal: [{
          lol: 'hi'
        }]
      }];

      return JSONStore.get('customers').advancedFind(query);

    })

    .then(function(data) {
      deepEqual(data.length, 3, 'Result length');
      deepEqual(data[0].json.name, 'Carlos', 'Result element test Carlos');
      deepEqual(data[1].json.name, 'carlosAnderu', 'Result element test carlosAnderu');
      deepEqual(data[2].json.name, 'nana', 'Result element test Carlos');
      start();
    })

    .fail(function(err) {
      ok(false, err.toString());
      start();
    });
  });

  asyncTest('String Equals Multiple', 5, function() {

    var collections = {
      customers: {
        searchFields: {
          fn: 'string',
          ln: 'string',
          age: 'integer',
          ssn: 'integer'
        }
      }
    };

    var data = [{
      fn: 'carlos',
      ln: 'anderu',
      age: 1,
      ssn: 12
    }, {
      fn: 'daniel',
      ln: 'gonzales',
      age: 2,
      ssn: 345
    }, {
      fn: 'jeff',
      ln: 'barret',
      age: 2,
      ssn: 56
    }, {
      fn: 'carlos',
      ln: 'anderu',
      age: 3,
      ssn: 789
    }, {
      fn: 'nana',
      ln: 'amfo',
      age: 4,
      ssn: 91
    }];

    JSONStore.destroy()

    .then(function(res) {
      deepEqual(res, 0, 'destroy');
      return JSONStore.init(collections);
    })

    .then(function(res) {
      deepEqual(res.customers.name, 'customers');
      return JSONStore.get('customers').add(data);
    })

    .then(function() {
      /*
          SELECT *
            FROM 'customers'
            WHERE
              [fn] = 'carlos'
            AND
              [ln] = 'anderu'
      */

      var query = [{
        equal: [{
          fn: 'carlos'
        }, {
          ln: 'anderu'
        }]
      }];

      return JSONStore.get('customers').advancedFind(query);

    })

    .then(function(data) {
      deepEqual(data.length, 2, 'Result length');

      deepEqual(data[0].json.fn, 'carlos', 'Result element test carlos');
      deepEqual(data[1].json.fn, 'carlos', 'Result element test carlos');
      start();
    })

    .fail(function(err) {
      ok(false, err.toString());
      start();
    });
  });

  asyncTest('Integer Equals No Results', 3, function() {

    var collections = {
      customers: {
        searchFields: {
          name: 'string',
          age: 'integer'
        }
      }
    };

    var data = [{
      name: 'carlos',
      age: 1
    }, {
      name: 'dgonz',
      age: 2
    }, {
      name: 'dgonzfailure',
      age: 2
    }, {
      name: 'failuredgonz',
      age: 2
    }, {
      name: 'jeff',
      age: 2
    }, {
      name: 'mike',
      age: 3
    }, {
      name: 'nana',
      age: 4
    }];

    JSONStore.destroy()

    .then(function(res) {
      deepEqual(res, 0, 'destroy');
      return JSONStore.init(collections);
    })

    .then(function(res) {
      deepEqual(res.customers.name, 'customers');
      return JSONStore.get('customers').add(data);
    })

    .then(function() {
      /*
          SELECT *
            FROM 'customers'
            WHERE
              [age] = 0
      */
      var query = [{
        equal: [{
          age: 0
        }]
      }];

      return JSONStore.get('customers').advancedFind(query);

    })

    .then(function(data) {
      deepEqual(data.length, 0, 'Result length');
      start();
    })

    .fail(function(err) {
      ok(false, err.toString());
      start();
    });
  });

  asyncTest('Integer Equals All Results', 8, function() {

    var collections = {
      customers: {
        searchFields: {
          name: 'string',
          age: 'integer'
        }
      }
    };

    var data = [{
      name: 'carlos',
      age: 2
    }, {
      name: 'dgonz',
      age: 2
    }, {
      name: 'jeff',
      age: 2
    }, {
      name: 'mike',
      age: 2
    }, {
      name: 'nana',
      age: 2
    }];

    JSONStore.destroy()

    .then(function(res) {
      deepEqual(res, 0, 'destroy');
      return JSONStore.init(collections);
    })

    .then(function(res) {
      deepEqual(res.customers.name, 'customers');
      return JSONStore.get('customers').add(data);
    })

    .then(function() {
      /*
          SELECT *
            FROM 'customers'
            WHERE
              [age] = 2
      */
      var query = [{
        equal: [{
          age: 2
        }]
      }];

      return JSONStore.get('customers').advancedFind(query);

    })

    .then(function(data) {
      deepEqual(data.length, 5, 'Result length');

      if (data.length === 5) {
        deepEqual(data[0].json.name, 'carlos', 'Result element test Nana');
        deepEqual(data[1].json.name, 'dgonz', 'Result element test Dgonz');
        deepEqual(data[2].json.name, 'jeff', 'Result element test Jeff');
        deepEqual(data[3].json.name, 'mike', 'Result element test Mike');
        deepEqual(data[4].json.name, 'nana', 'Result element test Nana');
      }
      start();
    })

    .fail(function(err) {
      ok(false, err.toString());
      start();
    });
  });

  asyncTest('Integer Not Equals Simple Test', 6, function() {

    var collections = {
      customers: {
        searchFields: {
          name: 'string',
          age: 'integer'
        }
      }
    };

    var data = [{
      name: 'carlos',
      age: 1
    }, {
      name: 'dgonz',
      age: 2
    }, {
      name: 'jeff',
      age: 2
    }, {
      name: 'mike',
      age: 3
    }, {
      name: 'nana',
      age: 4
    }];

    JSONStore.destroy()

    .then(function(res) {
      deepEqual(res, 0, 'destroy');
      return JSONStore.init(collections);
    })

    .then(function(res) {
      deepEqual(res.customers.name, 'customers');
      return JSONStore.get('customers').add(data);
    })

    .then(function() {
      /*
          SELECT *
            FROM 'customers'
            WHERE
              [age] != 2
      */
      var query = [{
        notEqual: [{
          age: 2
        }]
      }];

      return JSONStore.get('customers').advancedFind(query);

    })

    .then(function(data) {
      deepEqual(data.length, 3, 'Result length');

      if (data.length === 3) {
        deepEqual(data[0].json.name, 'carlos', 'Result element test Carlos');
        deepEqual(data[1].json.name, 'mike', 'Result element test Mike');
        deepEqual(data[2].json.name, 'nana', 'Result element test Nana');
      }
      start();
    })

    .fail(function(err) {
      ok(false, err.toString());
      start();
    });
  });

  asyncTest('Not Equals Simple Test using multiple types for searchFields', 7, function() {

    var collections = {
      customers: {
        searchFields: {
          name: 'string',
          gpa: 'number',
          ssn: 'integer',
          active: 'boolean'
        }
      }
    };

    var data = [{
      name: 'carlos',
      gpa: 1.0,
      ssn: 123,
      active: true
    }, {
      name: 'dgonz',
      gpa: 2.2,
      ssn: 345,
      active: false
    }, {
      name: 'jeff',
      gpa: 2.4,
      ssn: 567,
      active: true
    }, {
      name: 'mike',
      gpa: 3.6,
      ssn: 789,
      active: false
    }, {
      name: 'nana',
      gpa: 4.8,
      ssn: 987,
      active: true
    }];

    JSONStore.destroy()

    .then(function(res) {
      deepEqual(res, 0, 'destroy');
      return JSONStore.init(collections);
    })

    .then(function(res) {
      deepEqual(res.customers.name, 'customers');
      return JSONStore.get('customers').add(data);
    })

    .then(function() {
      /*
          SELECT *
            FROM 'customers'
            WHERE
              [age] != 2.2
      */
      var query = [{
        notEqual: [{
          gpa: 2.2
        }]
      }];

      return JSONStore.get('customers').advancedFind(query);

    })

    .then(function(data) {
      deepEqual(data.length, 4, 'Result length');
      deepEqual(data[0].json.name, 'carlos', 'Result element test carlos');
      deepEqual(data[1].json.name, 'jeff', 'Result element test jeff');
      deepEqual(data[2].json.name, 'mike', 'Result element test mike');
      deepEqual(data[3].json.name, 'nana', 'Result element test nana');
      start();
    })

    .fail(function(err) {
      ok(false, err.toString());
      start();
    });
  });

  asyncTest('Not Equal Simple Test with AdditonalSearchFields', 8, function() {

    var collections = {
      customers: {
        searchFields: {
          name: 'string',
          age: 'integer'
        },
        additionalSearchFields: {
          lol: 'integer'
        }
      }
    };

    var data = [{
      name: 'carlosdgonz',
      age: 1
    }, {
      name: 'carlos',
      age: 2
    }, {
      name: 'Carlos',
      age: 2
    }, {
      name: 'carlosAnderu',
      age: 3
    }, {
      name: 'nana',
      age: 4
    }];

    JSONStore.destroy()

    .then(function(res) {
      deepEqual(res, 0, 'destroy');
      return JSONStore.init(collections);
    })

    .then(function(res) {
      deepEqual(res.customers.name, 'customers');
      return JSONStore.get('customers').add([data[0], data[1]], {
        additionalSearchFields: {
          lol: 44
        }
      });
    })

    .then(function(res) {
      deepEqual(res, 2, 'added with additionalSearchFields');
      return JSONStore.get('customers').add([data[2], data[3], data[4]], {
        additionalSearchFields: {
          lol: 33
        }
      });

    })

    .then(function(res) {
      deepEqual(res, 3, 'added with additionalSearchFields');
      /*
          SELECT *
            FROM 'customers'
            WHERE
              [lol] != 44
        */
      var query = [{
        notEqual: [{
          lol: 44
        }]
      }];

      return JSONStore.get('customers').advancedFind(query);

    })

    .then(function(data) {
      deepEqual(data.length, 3, 'Result length');
      deepEqual(data[0].json.name, 'Carlos', 'Result element test Carlos');
      deepEqual(data[1].json.name, 'carlosAnderu', 'Result element test carlosAnderu');
      deepEqual(data[2].json.name, 'nana', 'Result element test Carlos');
      start();
    })

    .fail(function(err) {
      ok(false, err.toString());
      start();
    });
  });

  asyncTest('String Not Equals Multiple', 5, function() {

    var collections = {
      customers: {
        searchFields: {
          name: 'string',
          age: 'integer',
          ssn: 'integer'
        }
      }
    };

    var data = [{
      name: 'carlos',
      age: 1,
      ssn: 12
    }, {
      name: 'dgonz',
      age: 2,
      ssn: 345
    }, {
      name: 'jeff',
      age: 2,
      ssn: 56
    }, {
      name: 'mike',
      age: 3,
      ssn: 789
    }, {
      name: 'nana',
      age: 4,
      ssn: 91
    }];

    JSONStore.destroy()

    .then(function(res) {
      deepEqual(res, 0, 'destroy');
      return JSONStore.init(collections);
    })

    .then(function(res) {
      deepEqual(res.customers.name, 'customers');
      return JSONStore.get('customers').add(data);
    })

    .then(function() {
      /*
          SELECT *
            FROM 'customers'
            where
              [name] != 'dgonz'
            AND
              [name] != 'nana'
            AND
              [name] != 'mike'
      */
      var query = [{
        notEqual: [{
          name: 'dgonz'
        }, {
          name: 'nana'
        }, {
          name: 'mike'
        }]
      }];

      return JSONStore.get('customers').advancedFind(query);

    })

    .then(function(data) {
      deepEqual(data.length, 2, 'Result length');

      deepEqual(data[0].json.name, 'carlos', 'Result element test Carlos');
      deepEqual(data[1].json.name, 'jeff', 'Result element test Jeff');
      start();
    })

    .fail(function(err) {
      ok(false, err.toString());
      start();
    });
  });

  asyncTest('String Not Equals Simple Test', 7, function() {

    var collections = {
      customers: {
        searchFields: {
          name: 'string',
          age: 'integer'
        }
      }
    };

    var data = [{
      name: 'carlos',
      age: 1
    }, {
      name: 'dgonz',
      age: 2
    }, {
      name: 'jeff',
      age: 2
    }, {
      name: 'mike',
      age: 3
    }, {
      name: 'nana',
      age: 4
    }];

    JSONStore.destroy()

    .then(function(res) {
      deepEqual(res, 0, 'destroy');
      return JSONStore.init(collections);
    })

    .then(function(res) {
      deepEqual(res.customers.name, 'customers');
      return JSONStore.get('customers').add(data);
    })

    .then(function() {
      /*
          SELECT *
            FROM 'customers'
            WHERE
              [name] != 'dgonz'
      */
      var query = [{
        notEqual: [{
          name: 'dgonz'
        }]
      }];

      return JSONStore.get('customers').advancedFind(query);

    })

    .then(function(data) {
      deepEqual(data.length, 4, 'Result length');

      if (data.length === 4) {
        deepEqual(data[0].json.name, 'carlos', 'Result element test Carlos');
        deepEqual(data[1].json.name, 'jeff', 'Result element test Jeff');
        deepEqual(data[2].json.name, 'mike', 'Result element test Mike');
        deepEqual(data[3].json.name, 'nana', 'Result element test Nana');
      }
      start();
    })

    .fail(function(err) {
      ok(false, err.toString());
      start();
    });
  });

  asyncTest('Not Equal Simple Test with AdditonalSearchFields', 8, function() {

    var collections = {
      customers: {
        searchFields: {
          name: 'string',
          age: 'integer'
        },
        additionalSearchFields: {
          lol: 'integer'
        }
      }
    };

    var data = [{
      name: 'carlosdgonz',
      age: 1
    }, {
      name: 'carlos',
      age: 2
    }, {
      name: 'Carlos',
      age: 2
    }, {
      name: 'carlosAnderu',
      age: 3
    }, {
      name: 'nana',
      age: 4
    }];

    JSONStore.destroy()

    .then(function(res) {
      deepEqual(res, 0, 'destroy');
      return JSONStore.init(collections);
    })

    .then(function(res) {
      deepEqual(res.customers.name, 'customers');
      return JSONStore.get('customers').add([data[0], data[1]], {
        additionalSearchFields: {
          lol: 44
        }
      });
    })

    .then(function(res) {
      deepEqual(res, 2, 'added with additionalSearchFields');
      return JSONStore.get('customers').add([data[2], data[3], data[4]], {
        additionalSearchFields: {
          lol: 33
        }
      });

    })

    .then(function(res) {
      deepEqual(res, 3, 'added with additionalSearchFields');
      /*
          SELECT *
            FROM 'customers'
            WHERE
              [lol] != 44
        */
      var query = [{
        notEqual: [{
          lol: 44
        }]
      }];

      return JSONStore.get('customers').advancedFind(query);

    })

    .then(function(data) {
      deepEqual(data.length, 3, 'Result length');
      deepEqual(data[0].json.name, 'Carlos', 'Result element test Carlos');
      deepEqual(data[1].json.name, 'carlosAnderu', 'Result element test carlosAnderu');
      deepEqual(data[2].json.name, 'nana', 'Result element test Carlos');
      start();
    })

    .fail(function(err) {
      ok(false, err.toString());
      start();
    });
  });

  asyncTest('Integer Not Equals No Results', 3, function() {

    var collections = {
      customers: {
        searchFields: {
          name: 'string',
          age: 'integer'
        }
      }
    };

    var data = [{
      name: 'dgonz',
      age: 2
    }, {
      name: 'jeff',
      age: 2
    }];

    JSONStore.destroy()

    .then(function(res) {
      deepEqual(res, 0, 'destroy');
      return JSONStore.init(collections);
    })

    .then(function(res) {
      deepEqual(res.customers.name, 'customers');
      return JSONStore.get('customers').add(data);
    })

    .then(function() {
      /*
          SELECT *
            FROM 'customers'
            WHERE
              [age] != 2
      */
      var query = [{
        notEqual: [{
          age: 2
        }]
      }];

      return JSONStore.get('customers').advancedFind(query);

    })

    .then(function(data) {
      deepEqual(data.length, 0, 'Result length');
      start();
    })

    .fail(function(err) {
      ok(false, err.toString());
      start();
    });
  });

  asyncTest('Integer Not Equals All Results', 8, function() {

    var collections = {
      customers: {
        searchFields: {
          name: 'string',
          age: 'integer'
        }
      }
    };

    var data = [{
      name: 'carlos',
      age: 1
    }, {
      name: 'dgonz',
      age: 2
    }, {
      name: 'jeff',
      age: 3
    }, {
      name: 'mike',
      age: 4
    }, {
      name: 'nana',
      age: 5
    }];

    JSONStore.destroy()

    .then(function(res) {
      deepEqual(res, 0, 'destroy');
      return JSONStore.init(collections);
    })

    .then(function(res) {
      deepEqual(res.customers.name, 'customers');
      return JSONStore.get('customers').add(data);
    })

    .then(function() {
      /*
          SELECT *
            FROM 'customers'
            WHERE
              [age] != 0
      */
      var query = [{
        notEqual: [{
          age: 0
        }]
      }];

      return JSONStore.get('customers').advancedFind(query);

    })

    .then(function(data) {
      deepEqual(data.length, 5, 'Result length');
      if (data.length === 5) {
        deepEqual(data[0].json.name, 'carlos', 'Result element test Nana');
        deepEqual(data[1].json.name, 'dgonz', 'Result element test Dgonz');
        deepEqual(data[2].json.name, 'jeff', 'Result element test Jeff');
        deepEqual(data[3].json.name, 'mike', 'Result element test Mike');
        deepEqual(data[4].json.name, 'nana', 'Result element test Nana');
      }
      start();
    })

    .fail(function(err) {
      ok(false, err.toString());
      start();
    });
  });

  asyncTest('Integer In Simple Test', 6, function() {

    var collections = {
      customers: {
        searchFields: {
          name: 'string',
          age: 'integer'
        }
      }
    };

    var data = [{
      name: 'carlos',
      age: 1
    }, {
      name: 'dgonz',
      age: 2
    }, {
      name: 'jeff',
      age: 2
    }, {
      name: 'mike',
      age: 3
    }, {
      name: 'nana',
      age: 4
    }];

    JSONStore.destroy()

    .then(function(res) {
      deepEqual(res, 0, 'destroy');
      return JSONStore.init(collections);
    })

    .then(function(res) {
      deepEqual(res.customers.name, 'customers');
      return JSONStore.get('customers').add(data);
    })

    .then(function() {
      /*
          SELECT *
            FROM 'customers'
            WHERE
              [age] IN (2, 3)
      */
      var query = [{
        inside: [{
          age: [2, 3]
        }]
      }];

      return JSONStore.get('customers').advancedFind(query);

    })

    .then(function(data) {
      deepEqual(data.length, 3, 'Result length');
      if (data.length === 3) {
        deepEqual(data[0].json.name, 'dgonz', 'Result element test Dgonz');
        deepEqual(data[1].json.name, 'jeff', 'Result element test Jeff');
        deepEqual(data[2].json.name, 'mike', 'Result element test Mike');
      }
      start();
    })

    .fail(function(err) {
      ok(false, err.toString());
      start();
    });
  });

  asyncTest('In Simple Test using multiple types for searchFields', 6, function() {

    var collections = {
      customers: {
        searchFields: {
          name: 'string',
          gpa: 'number',
          ssn: 'integer',
          active: 'boolean'
        }
      }
    };

    var data = [{
      name: 'carlos',
      gpa: 1.0,
      ssn: 123,
      active: true
    }, {
      name: 'dgonz',
      gpa: 2.2,
      ssn: 345,
      active: false
    }, {
      name: 'jeff',
      gpa: 2.4,
      ssn: 567,
      active: true
    }, {
      name: 'mike',
      gpa: 3.6,
      ssn: 789,
      active: false
    }, {
      name: 'nana',
      gpa: 4.8,
      ssn: 987,
      active: true
    }];

    JSONStore.destroy()

    .then(function(res) {
      deepEqual(res, 0, 'destroy');
      return JSONStore.init(collections);
    })

    .then(function(res) {
      deepEqual(res.customers.name, 'customers');
      return JSONStore.get('customers').add(data);
    })

    .then(function() {
      /*
          SELECT *
            FROM 'customers'
            WHERE
              [gpa] IN (2.6, 1.0, 2.2)
      */
      var query = [{
        inside: [{
          gpa: [3.6, 1.0, 2.2]
        }]
      }];

      return JSONStore.get('customers').advancedFind(query);

    })

    .then(function(data) {
      deepEqual(data.length, 3, 'Result length');
      deepEqual(data[0].json.name, 'carlos', 'Result element test carlos');
      deepEqual(data[1].json.name, 'dgonz', 'Result element test dgonz');
      deepEqual(data[2].json.name, 'mike', 'Result element test mike');
      start();
    })

    .fail(function(err) {
      ok(false, err.toString());
      start();
    });
  });

  asyncTest('In Simple Test with AdditonalSearchFields', 10, function() {

    var collections = {
      customers: {
        searchFields: {
          name: 'string',
          age: 'integer'
        },
        additionalSearchFields: {
          lol: 'integer'
        }
      }
    };

    var data = [{
      name: 'carlosdgonz',
      age: 1
    }, {
      name: 'carlos',
      age: 2
    }, {
      name: 'Carlos',
      age: 2
    }, {
      name: 'carlosAnderu',
      age: 3
    }, {
      name: 'nana',
      age: 4
    }];

    JSONStore.destroy()

    .then(function(res) {
      deepEqual(res, 0, 'destroy');
      return JSONStore.init(collections);
    })

    .then(function(res) {
      deepEqual(res.customers.name, 'customers');
      return JSONStore.get('customers').add([data[0], data[1]], {
        additionalSearchFields: {
          lol: 44
        }
      });
    })

    .then(function(res) {
      deepEqual(res, 2, 'added with additionalSearchFields');
      return JSONStore.get('customers').add([data[2], data[3], data[4]], {
        additionalSearchFields: {
          lol: 33
        }
      });

    })

    .then(function(res) {
      deepEqual(res, 3, 'added with additionalSearchFields');
      /*
          SELECT *
            FROM 'customers'
            WHERE
              [lol] IN (33, 44)
        */

      var query = [{
        inside: [{
          lol: [33, 44]
        }]
      }];

      return JSONStore.get('customers').advancedFind(query);

    })

    .then(function(data) {
      deepEqual(data.length, 5, 'Result length');
      deepEqual(data[0].json.name, 'carlosdgonz', 'Result element test carlosdgonz');
      deepEqual(data[1].json.name, 'carlos', 'Result element test carlos');
      deepEqual(data[2].json.name, 'Carlos', 'Result element test Carlos');
      deepEqual(data[3].json.name, 'carlosAnderu', 'Result element test carlosAnderu');
      deepEqual(data[4].json.name, 'nana', 'Result element test nana');
      start();
    })

    .fail(function(err) {
      ok(false, err.toString());
      start();
    });
  });

  asyncTest('Integer In Multiple', 5, function() {

    var collections = {
      customers: {
        searchFields: {
          name: 'string',
          age: 'integer',
          ssn: 'integer'
        }
      }
    };

    var data = [{
      name: 'carlos',
      age: 1,
      ssn: 12
    }, {
      name: 'dgonz',
      age: 2,
      ssn: 345
    }, {
      name: 'jeff',
      age: 2,
      ssn: 56
    }, {
      name: 'mike',
      age: 3,
      ssn: 789
    }, {
      name: 'nana',
      age: 4,
      ssn: 91
    }];

    JSONStore.destroy()

    .then(function(res) {
      deepEqual(res, 0, 'destroy');
      return JSONStore.init(collections);
    })

    .then(function(res) {
      deepEqual(res.customers.name, 'customers');
      return JSONStore.get('customers').add(data);
    })

    .then(function() {
      /*
          SELECT *
            FROM 'customers'
            WHERE
              [age] IN (2, 3)
            AND
              [ssn] IN (789, 345)
      */

      var query = [{
        inside: [{
          age: [2, 3]
        }, {
          ssn: [789, 345]
        }]
      }];

      return JSONStore.get('customers').advancedFind(query);

    })

    .then(function(data) {
      deepEqual(data.length, 2, 'Result length');

      deepEqual(data[0].json.name, 'dgonz', 'Result element test dgonz');
      deepEqual(data[1].json.name, 'mike', 'Result element test mike');
      start();
    })

    .fail(function(err) {
      ok(false, err.toString());
      start();
    });
  });

  asyncTest('Integer In No Results', 3, function() {

    var collections = {
      customers: {
        searchFields: {
          name: 'string',
          age: 'integer'
        }
      }
    };

    var data = [{
      name: 'carlos',
      age: 1
    }, {
      name: 'dgonz',
      age: 2
    }, {
      name: 'jeff',
      age: 2
    }, {
      name: 'mike',
      age: 3
    }, {
      name: 'nana',
      age: 4
    }];

    JSONStore.destroy()

    .then(function(res) {
      deepEqual(res, 0, 'destroy');
      return JSONStore.init(collections);
    })

    .then(function(res) {
      deepEqual(res.customers.name, 'customers');
      return JSONStore.get('customers').add(data);
    })

    .then(function() {
      /*
          SELECT *
            FROM 'customers'
            WHERE
              [age] IN (5, 6)
      */
      var query = [{
        inside: [{
          age: [5, 6]
        }]
      }];

      return JSONStore.get('customers').advancedFind(query);

    })

    .then(function(data) {
      deepEqual(data.length, 0, 'Result length');
      start();
    })

    .fail(function(err) {
      ok(false, err.toString());
      start();
    });
  });

  asyncTest('Integer In All Results', 8, function() {

    var collections = {
      customers: {
        searchFields: {
          name: 'string',
          age: 'integer'
        }
      }
    };

    var data = [{
      name: 'carlos',
      age: 1
    }, {
      name: 'dgonz',
      age: 2
    }, {
      name: 'jeff',
      age: 2
    }, {
      name: 'mike',
      age: 3
    }, {
      name: 'nana',
      age: 4
    }];

    JSONStore.destroy()

    .then(function(res) {
      deepEqual(res, 0, 'destroy');
      return JSONStore.init(collections);
    })

    .then(function(res) {
      deepEqual(res.customers.name, 'customers');
      return JSONStore.get('customers').add(data);
    })

    .then(function() {
      /*
          SELECT *
            FROM 'customers'
            WHERE
              [age] IN (1, 2, 3, 4)
      */
      var query = [{
        inside: [{
          age: [1, 2, 3, 4]
        }]
      }];

      return JSONStore.get('customers').advancedFind(query);

    })

    .then(function(data) {
      deepEqual(data.length, 5, 'Result length');
      if (data.length === 5) {
        deepEqual(data[0].json.name, 'carlos', 'Result element test Carlos');
        deepEqual(data[1].json.name, 'dgonz', 'Result element test Dgonz');
        deepEqual(data[2].json.name, 'jeff', 'Result element test Jeff');
        deepEqual(data[3].json.name, 'mike', 'Result element test Mike');
        deepEqual(data[4].json.name, 'nana', 'Result element test Nana');
      }
      start();
    })

    .fail(function(err) {
      ok(false, err.toString());
      start();
    });
  });

  asyncTest('Integer In Handle Dupes', 8, function() {

    var collections = {
      customers: {
        searchFields: {
          name: 'string',
          age: 'integer'
        }
      }
    };

    var data = [{
      name: 'carlos',
      age: 1
    }, {
      name: 'dgonz',
      age: 2
    }, {
      name: 'jeff',
      age: 2
    }, {
      name: 'mike',
      age: 3
    }, {
      name: 'nana',
      age: 4
    }];

    JSONStore.destroy()

    .then(function(res) {
      deepEqual(res, 0, 'destroy');
      return JSONStore.init(collections);
    })

    .then(function(res) {
      deepEqual(res.customers.name, 'customers');
      return JSONStore.get('customers').add(data);
    })

    .then(function() {
      /*
          SELECT *
            FROM 'customers'
            WHERE
              [age] IN (1, 2, 2, 2, 3, 3, 4, 4, 4)
      */
      var query = [{
        inside: [{
          age: [1, 1, 2, 2, 3, 3, 4, 4, 4]
        }]
      }];

      return JSONStore.get('customers').advancedFind(query);

    })

    .then(function(data) {
      deepEqual(data.length, 5, 'Result length');
      if (data.length === 5) {
        deepEqual(data[0].json.name, 'carlos', 'Result element test Carlos');
        deepEqual(data[1].json.name, 'dgonz', 'Result element test Dgonz');
        deepEqual(data[2].json.name, 'jeff', 'Result element test Jeff');
        deepEqual(data[3].json.name, 'mike', 'Result element test Mike');
        deepEqual(data[4].json.name, 'nana', 'Result element test Nana');
      }
      start();
    })

    .fail(function(err) {
      ok(false, err.toString());
      start();
    });
  });

  asyncTest('String In Simple Test', 6, function() {

    var collections = {
      customers: {
        searchFields: {
          name: 'string',
          age: 'integer'
        }
      }
    };

    var data = [{
      name: 'carlos',
      age: 1
    }, {
      name: 'dgonz',
      age: 2
    }, {
      name: 'jeff',
      age: 2
    }, {
      name: 'mike',
      age: 3
    }, {
      name: 'nana',
      age: 4
    }];

    JSONStore.destroy()

    .then(function(res) {
      deepEqual(res, 0, 'destroy');
      return JSONStore.init(collections);
    })

    .then(function(res) {
      deepEqual(res.customers.name, 'customers');
      return JSONStore.get('customers').add(data);
    })

    .then(function() {
      /*
          SELECT *
            FROM 'customers'
            WHERE
              [name] IN ('dgonz', 'jeff', 'mike')
      */
      var query = [{
        inside: [{
          name: ['dgonz', 'jeff', 'mike']
        }]
      }];

      return JSONStore.get('customers').advancedFind(query);

    })

    .then(function(data) {
      deepEqual(data.length, 3, 'Result length');
      if (data.length === 3) {
        deepEqual(data[0].json.name, 'dgonz', 'Result element test Dgonz');
        deepEqual(data[1].json.name, 'jeff', 'Result element test Jeff');
        deepEqual(data[2].json.name, 'mike', 'Result element test Mike');
      }
      start();
    })

    .fail(function(err) {
      ok(false, err.toString());
      start();
    });
  });

  asyncTest('String In No Results', 3, function() {

    var collections = {
      customers: {
        searchFields: {
          name: 'string',
          age: 'integer'
        }
      }
    };

    var data = [{
      name: 'carlos',
      age: 1
    }, {
      name: 'dgonz',
      age: 2
    }, {
      name: 'jeff',
      age: 2
    }, {
      name: 'mike',
      age: 3
    }, {
      name: 'nana',
      age: 4
    }];

    JSONStore.destroy()

    .then(function(res) {
      deepEqual(res, 0, 'destroy');
      return JSONStore.init(collections);
    })

    .then(function(res) {
      deepEqual(res.customers.name, 'customers');
      return JSONStore.get('customers').add(data);
    })

    .then(function() {
      /*
          SELECT *
            FROM 'customers'
            WHERE
              [name] IN ('raj')
      */
      var query = [{
        inside: [{
          name: ['raj']
        }]
      }];

      return JSONStore.get('customers').advancedFind(query);

    })

    .then(function(data) {
      deepEqual(data.length, 0, 'Result length');
      start();
    })

    .fail(function(err) {
      ok(false, err.toString());
      start();
    });
  });

  asyncTest('String In All Results', 8, function() {

    var collections = {
      customers: {
        searchFields: {
          name: 'string',
          age: 'integer'
        }
      }
    };

    var data = [{
      name: 'carlos',
      age: 1
    }, {
      name: 'dgonz',
      age: 2
    }, {
      name: 'jeff',
      age: 2
    }, {
      name: 'mike',
      age: 3
    }, {
      name: 'nana',
      age: 4
    }];

    JSONStore.destroy()

    .then(function(res) {
      deepEqual(res, 0, 'destroy');
      return JSONStore.init(collections);
    })

    .then(function(res) {
      deepEqual(res.customers.name, 'customers');
      return JSONStore.get('customers').add(data);
    })

    .then(function() {
      /*
          SELECT *
            FROM 'customers'
            WHERE
              [name] IN ('carlos', 'dgonz', 'jeff', 'mike', 'nana')
      */
      var query = [{
        inside: [{
          name: ['carlos', 'dgonz', 'jeff', 'mike', 'nana']
        }]
      }];

      return JSONStore.get('customers').advancedFind(query);

    })

    .then(function(data) {
      deepEqual(data.length, 5, 'Result length');
      if (data.length === 5) {
        deepEqual(data[0].json.name, 'carlos', 'Result element test Carlos');
        deepEqual(data[1].json.name, 'dgonz', 'Result element test Dgonz');
        deepEqual(data[2].json.name, 'jeff', 'Result element test Jeff');
        deepEqual(data[3].json.name, 'mike', 'Result element test Mike');
        deepEqual(data[4].json.name, 'nana', 'Result element test Nana');
      }
      start();
    })

    .fail(function(err) {
      ok(false, err.toString());
      start();
    });
  });

  asyncTest('String Not In Simple Test', 5, function() {

    var collections = {
      customers: {
        searchFields: {
          name: 'string',
          age: 'integer'
        }
      }
    };

    var data = [{
      name: 'carlos',
      age: 1
    }, {
      name: 'dgonz',
      age: 2
    }, {
      name: 'jeff',
      age: 2
    }, {
      name: 'mike',
      age: 3
    }, {
      name: 'nana',
      age: 4
    }];

    JSONStore.destroy()

    .then(function(res) {
      deepEqual(res, 0, 'destroy');
      return JSONStore.init(collections);
    })

    .then(function(res) {
      deepEqual(res.customers.name, 'customers');
      return JSONStore.get('customers').add(data);
    })

    .then(function() {
      /*
          SELECT *
            FROM 'customers'
            WHERE
              [age] NOT IN ('dgonz', 'jeff', 'mike')
      */
      var query = [{
        notInside: [{
          name: ['dgonz', 'jeff', 'mike']
        }]
      }];

      return JSONStore.get('customers').advancedFind(query);

    })

    .then(function(data) {
      deepEqual(data.length, 2, 'Result length');
      deepEqual(data[0].json.name, 'carlos', 'Result element test Carlos');
      deepEqual(data[1].json.name, 'nana', 'Result element test Nana');

      start();
    })

    .fail(function(err) {
      ok(false, err.toString());
      start();
    });
  });

  asyncTest('String Not In Multiple', 4, function() {

    var collections = {
      customers: {
        searchFields: {
          name: 'string',
          age: 'integer',
          ssn: 'integer'
        }
      }
    };

    var data = [{
      name: 'carlos',
      age: 1,
      ssn: 12
    }, {
      name: 'dgonz',
      age: 2,
      ssn: 345
    }, {
      name: 'jeff',
      age: 2,
      ssn: 56
    }, {
      name: 'mike',
      age: 3,
      ssn: 789
    }, {
      name: 'nana',
      age: 4,
      ssn: 91
    }];

    JSONStore.destroy()

    .then(function(res) {
      deepEqual(res, 0, 'destroy');
      return JSONStore.init(collections);
    })

    .then(function(res) {
      deepEqual(res.customers.name, 'customers');
      return JSONStore.get('customers').add(data);
    })

    .then(function() {
      /*
          SELECT *
            FROM 'customers'
            WHERE
              [age] IN (2, 4)
            AND
              [ssn] IN (12)
      */

      var query = [{
        notInside: [{
          age: [2, 4]
        }, {
          ssn: [12]
        }]
      }];

      return JSONStore.get('customers').advancedFind(query);

    })

    .then(function(data) {
      deepEqual(data.length, 1, 'Result length');

      deepEqual(data[0].json.name, 'mike', 'Result element test mike');
      start();
    })

    .fail(function(err) {
      ok(false, err.toString());
      start();
    });
  });

  asyncTest('String In No Results', 3, function() {

    var collections = {
      customers: {
        searchFields: {
          name: 'string',
          age: 'integer'
        }
      }
    };

    var data = [{
      name: 'carlos',
      age: 1
    }, {
      name: 'dgonz',
      age: 2
    }, {
      name: 'jeff',
      age: 2
    }, {
      name: 'mike',
      age: 3
    }, {
      name: 'nana',
      age: 4
    }];

    JSONStore.destroy()

    .then(function(res) {
      deepEqual(res, 0, 'destroy');
      return JSONStore.init(collections);
    })

    .then(function(res) {
      deepEqual(res.customers.name, 'customers');
      return JSONStore.get('customers').add(data);
    })

    .then(function() {
      /*
          SELECT *
            FROM 'customers'
            WHERE
              [age] NOT IN ('carlos', 'dgonz', 'jeff', 'mike', 'nana')
      */
      var query = [{
        notInside: [{
          name: ['carlos', 'dgonz', 'jeff', 'mike', 'nana']
        }]
      }];

      return JSONStore.get('customers').advancedFind(query);

    })

    .then(function(data) {
      deepEqual(data.length, 0, 'Result length');
      start();
    })

    .fail(function(err) {
      ok(false, err.toString());
      start();
    });
  });

  asyncTest('String Not In All Results', 8, function() {

    var collections = {
      customers: {
        searchFields: {
          name: 'string',
          age: 'integer'
        }
      }
    };

    var data = [{
      name: 'carlos',
      age: 1
    }, {
      name: 'dgonz',
      age: 2
    }, {
      name: 'jeff',
      age: 2
    }, {
      name: 'mike',
      age: 3
    }, {
      name: 'nana',
      age: 4
    }];

    JSONStore.destroy()

    .then(function(res) {
      deepEqual(res, 0, 'destroy');
      return JSONStore.init(collections);
    })

    .then(function(res) {
      deepEqual(res.customers.name, 'customers');
      return JSONStore.get('customers').add(data);
    })

    .then(function() {
      /*
          SELECT *
            FROM 'customers'
            WHERE
              [age] NOT IN ('raj')
      */
      var query = [{
        notInside: [{
          name: ['raj']
        }]
      }];

      return JSONStore.get('customers').advancedFind(query);

    })

    .then(function(data) {
      deepEqual(data.length, 5, 'Result length');
      if (data.length === 5) {
        deepEqual(data[0].json.name, 'carlos', 'Result element test Carlos');
        deepEqual(data[1].json.name, 'dgonz', 'Result element test Dgonz');
        deepEqual(data[2].json.name, 'jeff', 'Result element test Jeff');
        deepEqual(data[3].json.name, 'mike', 'Result element test Mike');
        deepEqual(data[4].json.name, 'nana', 'Result element test Nana');
      }
      start();
    })

    .fail(function(err) {
      ok(false, err.toString());
      start();
    });
  });

  asyncTest('Between Simple Test', 7, function() {

    var collections = {
      customers: {
        searchFields: {
          name: 'string',
          age: 'integer'
        }
      }
    };

    var data = [{
      name: 'carlos',
      age: 1
    }, {
      name: 'dgonz',
      age: 2
    }, {
      name: 'jeff',
      age: 2
    }, {
      name: 'mike',
      age: 3
    }, {
      name: 'nana',
      age: 4
    }];

    JSONStore.destroy()

    .then(function(res) {
      deepEqual(res, 0, 'destroy');
      return JSONStore.init(collections);
    })

    .then(function(res) {
      deepEqual(res.customers.name, 'customers');
      return JSONStore.get('customers').add(data);
    })

    .then(function() {
      /*
          SELECT *
            FROM 'customers'
            WHERE
              [age] BETWEEN 2 AND 4
      */
      var query = [{
        between: [{
          age: [2, 4]
        }]
      }];

      return JSONStore.get('customers').advancedFind(query);

    })

    .then(function(data) {
      deepEqual(data.length, 4, 'Result length');
      if (data.length === 4) {
        deepEqual(data[0].json.name, 'dgonz', 'Result element test Dgonz');
        deepEqual(data[1].json.name, 'jeff', 'Result element test Jeff');
        deepEqual(data[2].json.name, 'mike', 'Result element test Mike');
        deepEqual(data[3].json.name, 'nana', 'Result element test Nana');
      }
      start();
    })

    .fail(function(err) {
      ok(false, err.toString());
      start();
    });
  });

  asyncTest('Between Simple Test Backwards', 4, function() {

    var collections = {
      customers: {
        searchFields: {
          name: 'string',
          age: 'integer'
        }
      }
    };

    var data = [{
      name: 'carlos',
      age: 1
    }, {
      name: 'dgonz',
      age: 2
    }, {
      name: 'jeff',
      age: 2
    }, {
      name: 'mike',
      age: 3
    }, {
      name: 'nana',
      age: 4
    }];

    JSONStore.destroy()

    .then(function(res) {
      deepEqual(res, 0, 'destroy');
      return JSONStore.init(collections);
    })

    .then(function(res) {
      deepEqual(res.customers.name, 'customers');
      return JSONStore.get('customers').add(data);
    })

    .then(function(res) {

      deepEqual(res, 5, 'add');
      /*
          SELECT *
            FROM 'customers'
            WHERE
              [age] BETWEEN 2 AND 4
      */
      var query = [{
        between: [{
          age: [4, 2]
        }]
      }];

      return JSONStore.get('customers').advancedFind(query);

    })

    .then(function(data) {
      deepEqual(data.length, 0, 'Result length');
      start();
    })

    .fail(function(err) {
      ok(false, err.toString());
      start();
    });
  });

  asyncTest('Between Simple Test', 8, function() {

    var collections = {
      customers: {
        searchFields: {
          name: 'string',
          age: 'integer'
        }
      }
    };

    var data = [{
      name: 'carlos',
      age: 1
    }, {
      name: 'dgonz',
      age: 2
    }, {
      name: 'jeff',
      age: 2
    }, {
      name: 'mike',
      age: 3
    }, {
      name: 'nana',
      age: 4
    }];

    JSONStore.destroy()

    .then(function(res) {
      deepEqual(res, 0, 'destroy');
      return JSONStore.init(collections);
    })

    .then(function(res) {
      deepEqual(res.customers.name, 'customers');
      return JSONStore.get('customers').add(data);
    })

    .then(function(res) {
      deepEqual(res, 5, 'add');
      /*
          SELECT *
            FROM 'customers'
            WHERE
              [age] BETWEEN 2 AND 4
      */
      var query = [{
        between: [{
          age: [2, 4]
        }]
      }];

      return JSONStore.get('customers').advancedFind(query);

    })

    .then(function(data) {
      deepEqual(data.length, 4, 'Result length');
      if (data.length === 4) {
        deepEqual(data[0].json.name, 'dgonz', 'Result element test Dgonz');
        deepEqual(data[1].json.name, 'jeff', 'Result element test Jeff');
        deepEqual(data[2].json.name, 'mike', 'Result element test Mike');
        deepEqual(data[3].json.name, 'nana', 'Result element test Nana');
      }
      start();
    })

    .fail(function(err) {
      ok(false, err.toString());
      start();
    });
  });

  asyncTest('Between Test using multiple types for searchFields', 5, function() {

    var collections = {
      customers: {
        searchFields: {
          name: 'string',
          gpa: 'number',
          ssn: 'integer',
          active: 'boolean'
        }
      }
    };

    var data = [{
      name: 'carlos',
      gpa: 1.0,
      ssn: 123,
      active: true
    }, {
      name: 'dgonz',
      gpa: 2.2,
      ssn: 345,
      active: false
    }, {
      name: 'jeff',
      gpa: 2.4,
      ssn: 567,
      active: true
    }, {
      name: 'mike',
      gpa: 3.6,
      ssn: 789,
      active: false
    }, {
      name: 'nana',
      gpa: 4.8,
      ssn: 987,
      active: true
    }];

    JSONStore.destroy()

    .then(function(res) {
      deepEqual(res, 0, 'destroy');
      return JSONStore.init(collections);
    })

    .then(function(res) {
      deepEqual(res.customers.name, 'customers');
      return JSONStore.get('customers').add(data);
    })

    .then(function() {
      /*
          SELECT *
            FROM 'customers'
            WHERE
              [gpa] BETWEEN 2.0 AND 3.0
      */
      var query = [{
        between: [{
          gpa: [2.0, 3.0]
        }]
      }];

      return JSONStore.get('customers').advancedFind(query);

    })

    .then(function(data) {
      deepEqual(data.length, 2, 'Result length');
      deepEqual(data[0].json.name, 'dgonz', 'Result element test dgonz');
      deepEqual(data[1].json.name, 'jeff', 'Result element test jeff');
      start();
    })

    .fail(function(err) {
      ok(false, err.toString());
      start();
    });
  });

  asyncTest('Between Simple Test with AdditonalSearchFields', 8, function() {

    var collections = {
      customers: {
        searchFields: {
          name: 'string',
          age: 'integer'
        },
        additionalSearchFields: {
          lol: 'integer'
        }
      }
    };

    var data = [{
      name: 'carlosdgonz',
      age: 1
    }, {
      name: 'carlos',
      age: 2
    }, {
      name: 'Carlos',
      age: 2
    }, {
      name: 'carlosAnderu',
      age: 3
    }, {
      name: 'nana',
      age: 4
    }];

    JSONStore.destroy()

    .then(function(res) {
      deepEqual(res, 0, 'destroy');
      return JSONStore.init(collections);
    })

    .then(function(res) {
      deepEqual(res.customers.name, 'customers');
      return JSONStore.get('customers').add([data[0], data[1]], {
        additionalSearchFields: {
          lol: 44
        }
      });
    })

    .then(function(res) {
      deepEqual(res, 2, 'added with additionalSearchFields');
      return JSONStore.get('customers').add([data[2], data[3], data[4]], {
        additionalSearchFields: {
          lol: 33
        }
      });

    })

    .then(function(res) {
      deepEqual(res, 3, 'added with additionalSearchFields');
      /*
          SELECT *
            FROM 'customers'
            WHERE
              [lol] BETWEEN 20 AND 40
        */

      var query = [{
        between: [{
          lol: [20, 40]
        }]
      }];

      return JSONStore.get('customers').advancedFind(query);

    })

    .then(function(data) {
      deepEqual(data.length, 3, 'Result length');
      deepEqual(data[0].json.name, 'Carlos', 'Result element test Carlos');
      deepEqual(data[1].json.name, 'carlosAnderu', 'Result element test carlosAnderu');
      deepEqual(data[2].json.name, 'nana', 'Result element test nana');
      start();
    })

    .fail(function(err) {
      ok(false, err.toString());
      start();
    });
  });

  asyncTest('Between Multiple', 5, function() {

    var collections = {
      customers: {
        searchFields: {
          name: 'string',
          age: 'integer',
          ssn: 'integer'
        }
      }
    };

    var data = [{
      name: 'carlos',
      age: 1,
      ssn: 12
    }, {
      name: 'dgonz',
      age: 2,
      ssn: 345
    }, {
      name: 'jeff',
      age: 2,
      ssn: 56
    }, {
      name: 'mike',
      age: 3,
      ssn: 789
    }, {
      name: 'nana',
      age: 4,
      ssn: 91
    }];

    JSONStore.destroy()

    .then(function(res) {
      deepEqual(res, 0, 'destroy');
      return JSONStore.init(collections);
    })

    .then(function(res) {
      deepEqual(res.customers.name, 'customers');
      return JSONStore.get('customers').add(data);
    })

    .then(function() {
      /*
          SELECT *
            FROM 'customers'
            WHERE
              [age] BETWEEN 1 AND 3
            AND
              [ssn] BETWEEN 300 AND 800
      */

      var query = [{
        between: [{
          age: [1, 3]
        }, {
          ssn: [300, 800]
        }]
      }];

      return JSONStore.get('customers').advancedFind(query);

    })

    .then(function(data) {
      deepEqual(data.length, 2, 'Result length');

      deepEqual(data[0].json.name, 'dgonz', 'Result element test dgonz');
      deepEqual(data[1].json.name, 'mike', 'Result element test mike');
      start();
    })

    .fail(function(err) {
      ok(false, err.toString());
      start();
    });
  });

  asyncTest('Integer Between No Results', 3, function() {

    var collections = {
      customers: {
        searchFields: {
          name: 'string',
          age: 'integer'
        }
      }
    };

    var data = [{
      name: 'carlos',
      age: 1
    }, {
      name: 'dgonz',
      age: 2
    }, {
      name: 'jeff',
      age: 2
    }, {
      name: 'mike',
      age: 3
    }, {
      name: 'nana',
      age: 4
    }];

    JSONStore.destroy()

    .then(function(res) {
      deepEqual(res, 0, 'destroy');
      return JSONStore.init(collections);
    })

    .then(function(res) {
      deepEqual(res.customers.name, 'customers');
      return JSONStore.get('customers').add(data);
    })

    .then(function() {
      /*
          SELECT *
            FROM 'customers'
            WHERE
              [age] BETWEEN 5 AND 20
      */
      var query = [{
        between: [{
          age: [5, 20]
        }]
      }];

      return JSONStore.get('customers').advancedFind(query);

    })

    .then(function(data) {
      deepEqual(data.length, 0, 'Result length');
      start();
    })

    .fail(function(err) {
      ok(false, err.toString());
      start();
    });
  });

  asyncTest('Integer Between All Results', 8, function() {

    var collections = {
      customers: {
        searchFields: {
          name: 'string',
          age: 'integer'
        }
      }
    };

    var data = [{
      name: 'carlos',
      age: 1
    }, {
      name: 'dgonz',
      age: 2
    }, {
      name: 'jeff',
      age: 2
    }, {
      name: 'mike',
      age: 3
    }, {
      name: 'nana',
      age: 4
    }];

    JSONStore.destroy()

    .then(function(res) {
      deepEqual(res, 0, 'destroy');
      return JSONStore.init(collections);
    })

    .then(function(res) {
      deepEqual(res.customers.name, 'customers');
      return JSONStore.get('customers').add(data);
    })

    .then(function() {
      /*
          SELECT *
            FROM 'customers'
            WHERE
              [age] BETWEEN 0 AND 5
      */
      var query = [{
        between: [{
          age: [0, 5]
        }]
      }];

      return JSONStore.get('customers').advancedFind(query);

    })

    .then(function(data) {
      deepEqual(data.length, 5, 'Result length');
      if (data.length === 5) {
        deepEqual(data[0].json.name, 'carlos', 'Result element test Carlos');
        deepEqual(data[1].json.name, 'dgonz', 'Result element test Dgonz');
        deepEqual(data[2].json.name, 'jeff', 'Result element test Jeff');
        deepEqual(data[3].json.name, 'mike', 'Result element test Mike');
        deepEqual(data[4].json.name, 'nana', 'Result element test Nana');
      }
      start();
    })

    .fail(function(err) {
      ok(false, err.toString());
      start();
    });
  });

  asyncTest('Not Between Simple Test', 4, function() {

    var collections = {
      customers: {
        searchFields: {
          name: 'string',
          age: 'integer'
        }
      }
    };

    var data = [{
      name: 'carlos',
      age: 1
    }, {
      name: 'dgonz',
      age: 2
    }, {
      name: 'jeff',
      age: 2
    }, {
      name: 'mike',
      age: 3
    }, {
      name: 'nana',
      age: 4
    }];

    JSONStore.destroy()

    .then(function(res) {
      deepEqual(res, 0, 'destroy');
      return JSONStore.init(collections);
    })

    .then(function(res) {
      deepEqual(res.customers.name, 'customers');
      return JSONStore.get('customers').add(data);
    })

    .then(function() {
      /*
          SELECT *
            FROM 'customers'
            WHERE
              [age] NOT BETWEEN 2 AND 4
      */
      var query = [{
        notBetween: [{
          age: [2, 4]
        }]
      }];

      return JSONStore.get('customers').advancedFind(query);

    })

    .then(function(data) {
      deepEqual(data.length, 1, 'Result length');
      if (data.length === 1) {
        deepEqual(data[0].json.name, 'carlos', 'Result element test Carlos');
      }
      start();
    })

    .fail(function(err) {
      ok(false, err.toString());
      start();
    });
  });

  asyncTest('Not Between Multiple', 4, function() {

    var collections = {
      customers: {
        searchFields: {
          name: 'string',
          age: 'integer',
          ssn: 'integer'
        }
      }
    };

    var data = [{
      name: 'carlos',
      age: 1,
      ssn: 12
    }, {
      name: 'dgonz',
      age: 2,
      ssn: 345
    }, {
      name: 'jeff',
      age: 2,
      ssn: 56
    }, {
      name: 'mike',
      age: 3,
      ssn: 789
    }, {
      name: 'nana',
      age: 4,
      ssn: 91
    }];

    JSONStore.destroy()

    .then(function(res) {
      deepEqual(res, 0, 'destroy');
      return JSONStore.init(collections);
    })

    .then(function(res) {
      deepEqual(res.customers.name, 'customers');
      return JSONStore.get('customers').add(data);
    })

    .then(function() {
      /*
          SELECT *
            FROM 'customers'
            WHERE
              [age] NOT BETWEEN 2 AND 3
            AND
              [ssn] NOT BETWEEN 50 AND 100
      */

      var query = [{
        notBetween: [{
          age: [2, 3]
        }, {
          ssn: [50, 100]
        }]
      }];

      return JSONStore.get('customers').advancedFind(query);

    })

    .then(function(data) {
      deepEqual(data.length, 1, 'Result length');

      deepEqual(data[0].json.name, 'carlos', 'Result element test Carlos');
      start();
    })

    .fail(function(err) {
      ok(false, err.toString());
      start();
    });
  });

  asyncTest('Integer Not Between No Results', 3, function() {

    var collections = {
      customers: {
        searchFields: {
          name: 'string',
          age: 'integer'
        }
      }
    };

    var data = [{
      name: 'carlos',
      age: 1
    }, {
      name: 'dgonz',
      age: 2
    }, {
      name: 'jeff',
      age: 2
    }, {
      name: 'mike',
      age: 3
    }, {
      name: 'nana',
      age: 4
    }];

    JSONStore.destroy()

    .then(function(res) {
      deepEqual(res, 0, 'destroy');
      return JSONStore.init(collections);
    })

    .then(function(res) {
      deepEqual(res.customers.name, 'customers');
      return JSONStore.get('customers').add(data);
    })

    .then(function() {
      var query = [{
        notBetween: [{
          age: [1, 4]
        }]
      }];

      return JSONStore.get('customers').advancedFind(query);

    })

    .then(function(data) {
      deepEqual(data.length, 0, 'Result length');
      start();
    })

    .fail(function(err) {
      ok(false, err.toString());
      start();
    });
  });

  asyncTest('Integer Not Between All Results', 8, function() {

    var collections = {
      customers: {
        searchFields: {
          name: 'string',
          age: 'integer'
        }
      }
    };

    var data = [{
      name: 'carlos',
      age: 1
    }, {
      name: 'dgonz',
      age: 2
    }, {
      name: 'jeff',
      age: 2
    }, {
      name: 'mike',
      age: 3
    }, {
      name: 'nana',
      age: 4
    }];

    JSONStore.destroy()

    .then(function(res) {
      deepEqual(res, 0, 'destroy');
      return JSONStore.init(collections);
    })

    .then(function(res) {
      deepEqual(res.customers.name, 'customers');
      return JSONStore.get('customers').add(data);
    })

    .then(function() {
      var query = [{
        notBetween: [{
          age: [5, 20]
        }]
      }];

      return JSONStore.get('customers').advancedFind(query);

    })

    .then(function(data) {
      deepEqual(data.length, 5, 'Result length');
      if (data.length === 5) {
        deepEqual(data[0].json.name, 'carlos', 'Result element test Carlos');
        deepEqual(data[1].json.name, 'dgonz', 'Result element test Dgonz');
        deepEqual(data[2].json.name, 'jeff', 'Result element test Jeff');
        deepEqual(data[3].json.name, 'mike', 'Result element test Mike');
        deepEqual(data[4].json.name, 'nana', 'Result element test Nana');
      }
      start();
    })

    .fail(function(err) {
      ok(false, err.toString());
      start();
    });
  });

  asyncTest('advancedFind using nested searchFields', 8, function() {

    var collections = {
      customers: {
        searchFields: {
          name: 'string',
          age: 'integer',
          'order.name': 'string'
        }
      }
    };

    var data = [{
      name: 'carlos',
      age: 1,
      order: [{
        name: 'hey'
      }, {
        name: 'hello'
      }, {
        name: 'hola'
      }]
    }];

    JSONStore.destroy()

    .then(function(res) {
      deepEqual(res, 0, 'destroy');
      return JSONStore.init(collections);
    })

    .then(function(res) {
      deepEqual(res.customers.name, 'customers');
      return JSONStore.get('customers').add(data);
    })

    .then(function(res) {
      deepEqual(res, 1, 'add');
      return JSONStore.get('customers').advancedFind([{
        like: [{
          'order.name': 'hey'
        }]
      }]);
    })

    .then(function(res) {
      deepEqual(res.length, 1);
      deepEqual(res[0].json.order.length, 3, 'orders');
      deepEqual(res[0].json.order[0].name, 'hey', 'order1');
      deepEqual(res[0].json.order[1].name, 'hello', 'order2');
      deepEqual(res[0].json.order[2].name, 'hola', 'order3');
      start();
    })

    .fail(function(err) {
      ok(false, 'Should not fail, result: ' + JSON.stringify(err));
      start();
    });
  });

  asyncTest('Complete advancedFind by nested searchfield(GVT) + sf and use limit, offset, filter and sort', 9, function() {
    var collections = {
      customers: {
        searchFields: {
          'name.first': 'string',
          '地震に関する編': 'integer',
          'bool': 'boolean'
        },
        additionalSearchFields: {
          lol: 'string'
        }
      }
    };

    var data = [{
      name: {
        first: 'mikeortman'
      },
      '地震に関する編': 1,
      bool: true
    }, {
      name: {
        first: 'batman1'
      },
      '地震に関する編': 2,
      bool: false
    }, {
      name: {
        first: 'batman2'
      },
      '地震に関する編': 3,
      bool: false
    }, {
      name: {
        first: 'batman3'
      },
      '地震に関する編': 4,
      bool: true
    }];

    JSONStore.destroy()

    .then(function(res) {
      deepEqual(res, 0, 'destroy');
      return JSONStore.init(collections);
    })

    .then(function(res) {
      deepEqual(res.customers.name, 'customers');
      return JSONStore.get('customers').add(data, {
        additionalSearchFields: {
          lol: 'hey'
        }
      });
    })

    .then(function(res) {
      deepEqual(res, 4, 'add');
      return JSONStore.get('customers').advancedFind([{
        rightLike: [{
          'name.first': 'bat'
        }]
      }], {
        filter: ['name.first', 'bool'],
        limit: 2,
        offset: 1,
        sort: [{
          'name.first': 'DESC'
        }]
      });
    })

    .then(function(res) {

      deepEqual(res.length, 2, 'length of the results');
      deepEqual(_.keys(res[0]).sort(), ['name.first', 'bool'].sort());

      deepEqual(res[0]['name.first'], 'batman2', 'name.first 1');
      deepEqual(res[0].bool, '0', 'bool 1');

      deepEqual(res[1]['name.first'], 'batman1', 'name.first 2');
      deepEqual(res[1].bool, '0', 'bool 2');
      start();
    })

    .fail(function(err) {
      ok(false, 'Should not fail, result: ' + JSON.stringify(err));
      start();
    });

  });

  asyncTest('advancedFind using equal, less than, like, sort, offset, and limit', 7, function() {
    var collections = {
      customers: {
        searchFields: {
          'name.first': 'string',
          'name.last': 'string',
          '地震に関する編': 'integer',
          'gpa': 'number',
          'age': 'integer'
        },
        additionalSearchFields: {
          lol: 'string'
        }
      }
    };

    var data = [{
      name: {
        first: 'mike',
        last: 'ortman'
      },
      gpa: 3.8,
      age: 74,
      '地震に関する編': 1
    }, {
      name: {
        first: 'carlos',
        last: 'anderu'
      },
      gpa: 2.9,
      age: 38,
      '地震に関する編': 2
    }, {
      name: {
        first: 'daniel',
        last: 'gonzalez'
      },
      gpa: 3.5,
      age: 35,
      '地震に関する編': 3
    }, {
      name: {
        first: 'nana',
        last: 'amfo'
      },
      gpa: 2.8,
      age: 39,
      '地震に関する編': 4
    }];

    JSONStore.destroy()

    .then(function(res) {
      deepEqual(res, 0, 'destroy');
      return JSONStore.init(collections);
    })

    .then(function(res) {
      deepEqual(res.customers.name, 'customers');
      return JSONStore.get('customers').add(data, {
        additionalSearchFields: {
          lol: 'hey'
        }
      });
    })

    .then(function(res) {
      deepEqual(res, 4, 'add');
      return JSONStore.get('customers').advancedFind(

        [{
            equal: [{
              'name.first': 'carlos'
            }],
            rightLike: [{
              'name.last': 'and'
            }],
            lessThan: [{
              age: 100
            }, {
              gpa: 3.5
            }]
          }, {
            between: [{
              age: [40, 50]
            }]
          }

        ], {
          filter: ['name.first', 'age'],
          limit: 2,
          offset: 0,
          sort: [{
            'name.first': 'ASC'
          }, {
            'age': 'DESC'
          }]
        });
    })

    .then(function(res) {

      deepEqual(res.length, 1, 'length of the results');
      deepEqual(_.keys(res[0]).sort(), ['name.first', 'age'].sort());

      deepEqual(res[0]['name.first'], 'carlos', 'name.first 1');
      deepEqual(res[0].age, '38', 'age 1');
      start();
    })

    .fail(function(err) {
      ok(false, 'Should not fail, result: ' + JSON.stringify(err));
      start();
    });
  });

  asyncTest('advancedFind api using queryParts', 7, function() {

    var collections = {
      customers: {
        searchFields: {
          'name': 'string',
          'grade': 'string',
          'age': 'integer',
          'gpa': 'number',
          'jsskill': 'integer',
          'greeting': 'string',
          'score': 'integer'
        }
      }
    };

    var data = [{
      name: 'mike',
      grade: 'A',
      age: 74,
      jsskill: 7,
      gpa: 2.3,
      score: 10,
      greeting: 'hola'
    }, {
      name: 'carlos',
      grade: 'A',
      age: 5,
      jsskill: 8,
      gpa: 3.0,
      score: 8,
      greeting: 'hello'
    }, {
      name: 'daniel',
      grade: 'A',
      age: 4,
      jsskill: 7,
      gpa: 3.0,
      score: 9,
      greeting: 'hey'
    }, {
      name: 'nana',
      grade: 'A',
      age: 3,
      jsskill: 7,
      gpa: 2.8,
      score: 8,
      greeting: 'hola'
    }];

    JSONStore.destroy()

    .then(function(res) {
      deepEqual(res, 0, 'destroy');
      return JSONStore.init(collections);
    })
      .then(function(res) {
        deepEqual(res.customers.name, 'customers');
        return JSONStore.get('customers').add(data);
      })

    .then(function(res) {
      deepEqual(res, 4, 'added');
      var queryPart1 = JSONStore.QueryPart()
        .like('name', 'carlos')
        .rightLike('grade', 'A')
        .lessThan('age', 5)
        .lessThan('gpa', 3.00)
        .between('jsskill', [5, 10]);

      var queryPart2 = JSONStore.QueryPart()
        .like('greeting', 'ello')
        .greaterThan('score', 5);

      var options = {
        limit: 10,
        offset: 0,
        filter: ['name', 'grade'],
        sort: [{
          name: 'DESC'
        }, {
          age: 'ASC'
        }]
      };

      return JSONStore.get('customers').advancedFind([queryPart1, queryPart2], options);
    })

    .then(function(res) {
      deepEqual(res.length, 1, 'length of the results');
      deepEqual(_.keys(res[0]).sort(), ['name', 'grade'].sort());

      deepEqual(res[0].name, 'carlos', 'name.first 1');
      deepEqual(res[0].grade, 'A', 'grade 1');
      start();
    })
      .fail(function(err) {
        ok(false, 'Should not fail, result: ' + JSON.stringify(err));
        start();
      });

  });

  asyncTest('Less Than Type Safety Test', 7, function() {

    var collections = {
      customers: {
        searchFields: {
          active: 'boolean',
          notActive: 'boolean',
          otherString: 'string',
          otherNumber: 'number',
          otherInteger: 'integer'
        }
      }
    };

    var data = [{
      active: true,
      notActive: false,
      otherString: 'other1',
      otherNumber: 1.1,
      otherInteger: 1
    }, {
      active: true,
      notActive: false,
      otherString: 'other2',
      otherNumber: 2.1,
      otherInteger: 2
    }, {
      active: true,
      notActive: false,
      otherString: 'other3',
      otherNumber: 3.1,
      otherInteger: 3
    }];

    JSONStore.destroy()

    .then(function(res) {
      deepEqual(res, 0, 'destroy');
      return JSONStore.init(collections);
    })

    .then(function(res) {
      deepEqual(res.customers.name, 'customers');
      return JSONStore.get('customers').add(data);
    })

    .then(function(res) {
      deepEqual(res, 3, 'Add');
      var queryPart1 = JSONStore.QueryPart()
        .lessThan('notActive', '0');

      return JSONStore.get('customers').advancedFind([queryPart1]);

    })

    .then(function(data) {
      deepEqual(data.length, 0, 'Result length string');

      var queryPart1 = JSONStore.QueryPart()
        .lessThan('notActive', 0);

      return JSONStore.get('customers').advancedFind([queryPart1]);
    })

    .then(function(data) {
      deepEqual(data.length, 0, 'Result length int');

      var queryPart1 = JSONStore.QueryPart()
        .lessThan('notActive', 0.0);

      return JSONStore.get('customers').advancedFind([queryPart1]);
    })

    .then(function(data) {
      deepEqual(data.length, 0, 'Result length number');

      var queryPart1 = JSONStore.QueryPart()
        .lessThan('notActive', false);

      return JSONStore.get('customers').advancedFind([queryPart1]);
    })

    .then(function(data) {
      deepEqual(data.length, 0, 'Result length bool');
      start();
    })

    .fail(function(err) {
      ok(false, err.toString());
      start();
    });
  });

  asyncTest('Less Than Or Equal Type Safety Test', 71, function() {

    var collections = {
      customers: {
        searchFields: {
          active: 'boolean',
          notActive: 'boolean',
          otherString: 'string',
          otherNumber: 'number',
          otherInteger: 'integer'
        }
      }
    };

    var data = [{
      active: true,
      notActive: false,
      otherString: 'other1',
      otherNumber: 1.1,
      otherInteger: 1
    }, {
      active: true,
      notActive: false,
      otherString: 'other2',
      otherNumber: 2.1,
      otherInteger: 2
    }, {
      active: true,
      notActive: false,
      otherString: 'other3',
      otherNumber: 3.1,
      otherInteger: 3
    }];

    JSONStore.destroy()

    .then(function(res) {
      deepEqual(res, 0, 'destroy');
      return JSONStore.init(collections);
    })

    .then(function(res) {
      deepEqual(res.customers.name, 'customers');
      return JSONStore.get('customers').add(data);
    })

    .then(function(res) {
      deepEqual(res, 3, 'Add');
      var queryPart1 = JSONStore.QueryPart()
        .lessOrEqualThan('notActive', '0');

      return JSONStore.get('customers').advancedFind([queryPart1]);

    })

    .then(function(data) {
      deepEqual(data.length, 3, 'Result length string');

      deepEqual(_.keys(data[0]).sort(), ['_id', 'json'].sort(), 'keys');

      deepEqual(data[0].json.active, true, 'active');
      deepEqual(data[0].json.notActive, false, 'not active');
      deepEqual(data[0].json.otherString, 'other1', 'other string');
      deepEqual(data[0].json.otherNumber, 1.1, 'other number');
      deepEqual(data[0].json.otherInteger, 1, 'other integer');

      deepEqual(data[1].json.active, true, 'active');
      deepEqual(data[1].json.notActive, false, 'not active');
      deepEqual(data[1].json.otherString, 'other2', 'other string');
      deepEqual(data[1].json.otherNumber, 2.1, 'other number');
      deepEqual(data[1].json.otherInteger, 2, 'other integer');

      deepEqual(data[2].json.active, true, 'active');
      deepEqual(data[2].json.notActive, false, 'not active');
      deepEqual(data[2].json.otherString, 'other3', 'other string');
      deepEqual(data[2].json.otherNumber, 3.1, 'other number');
      deepEqual(data[2].json.otherInteger, 3, 'other integer');

      var queryPart1 = JSONStore.QueryPart()
        .lessOrEqualThan('notActive', 0);

      return JSONStore.get('customers').advancedFind([queryPart1]);
    })

    .then(function(data) {
      deepEqual(data.length, 3, 'Result length int');

      deepEqual(_.keys(data[0]).sort(), ['_id', 'json'].sort(), 'keys');

      deepEqual(data[0].json.active, true, 'active');
      deepEqual(data[0].json.notActive, false, 'not active');
      deepEqual(data[0].json.otherString, 'other1', 'other string');
      deepEqual(data[0].json.otherNumber, 1.1, 'other number');
      deepEqual(data[0].json.otherInteger, 1, 'other integer');

      deepEqual(data[1].json.active, true, 'active');
      deepEqual(data[1].json.notActive, false, 'not active');
      deepEqual(data[1].json.otherString, 'other2', 'other string');
      deepEqual(data[1].json.otherNumber, 2.1, 'other number');
      deepEqual(data[1].json.otherInteger, 2, 'other integer');

      deepEqual(data[2].json.active, true, 'active');
      deepEqual(data[2].json.notActive, false, 'not active');
      deepEqual(data[2].json.otherString, 'other3', 'other string');
      deepEqual(data[2].json.otherNumber, 3.1, 'other number');
      deepEqual(data[2].json.otherInteger, 3, 'other integer');

      var queryPart1 = JSONStore.QueryPart()
        .lessOrEqualThan('notActive', 0.0);

      return JSONStore.get('customers').advancedFind([queryPart1]);
    })

    .then(function(data) {
      deepEqual(data.length, 3, 'Result length number');

      deepEqual(_.keys(data[0]).sort(), ['_id', 'json'].sort(), 'keys');

      deepEqual(data[0].json.active, true, 'active');
      deepEqual(data[0].json.notActive, false, 'not active');
      deepEqual(data[0].json.otherString, 'other1', 'other string');
      deepEqual(data[0].json.otherNumber, 1.1, 'other number');
      deepEqual(data[0].json.otherInteger, 1, 'other integer');

      deepEqual(data[1].json.active, true, 'active');
      deepEqual(data[1].json.notActive, false, 'not active');
      deepEqual(data[1].json.otherString, 'other2', 'other string');
      deepEqual(data[1].json.otherNumber, 2.1, 'other number');
      deepEqual(data[1].json.otherInteger, 2, 'other integer');

      deepEqual(data[2].json.active, true, 'active');
      deepEqual(data[2].json.notActive, false, 'not active');
      deepEqual(data[2].json.otherString, 'other3', 'other string');
      deepEqual(data[2].json.otherNumber, 3.1, 'other number');
      deepEqual(data[2].json.otherInteger, 3, 'other integer');

      var queryPart1 = JSONStore.QueryPart()
        .lessOrEqualThan('notActive', false);

      return JSONStore.get('customers').advancedFind([queryPart1]);
    })

    .then(function(data) {
      deepEqual(data.length, 3, 'Result length bool');

      deepEqual(_.keys(data[0]).sort(), ['_id', 'json'].sort(), 'keys');

      deepEqual(data[0].json.active, true, 'active');
      deepEqual(data[0].json.notActive, false, 'not active');
      deepEqual(data[0].json.otherString, 'other1', 'other string');
      deepEqual(data[0].json.otherNumber, 1.1, 'other number');
      deepEqual(data[0].json.otherInteger, 1, 'other integer');

      deepEqual(data[1].json.active, true, 'active');
      deepEqual(data[1].json.notActive, false, 'not active');
      deepEqual(data[1].json.otherString, 'other2', 'other string');
      deepEqual(data[1].json.otherNumber, 2.1, 'other number');
      deepEqual(data[1].json.otherInteger, 2, 'other integer');

      deepEqual(data[2].json.active, true, 'active');
      deepEqual(data[2].json.notActive, false, 'not active');
      deepEqual(data[2].json.otherString, 'other3', 'other string');
      deepEqual(data[2].json.otherNumber, 3.1, 'other number');
      deepEqual(data[2].json.otherInteger, 3, 'other integer');

      start();
    })

    .fail(function(err) {
      ok(false, err.toString());
      start();
    });
  });

  asyncTest('Greater Than Type Safety Test', 7, function() {

    var collections = {
      customers: {
        searchFields: {
          active: 'boolean',
          notActive: 'boolean',
          otherString: 'string',
          otherNumber: 'number',
          otherInteger: 'integer'
        }
      }
    };

    var data = [{
      active: true,
      notActive: false,
      otherString: 'other1',
      otherNumber: 1.1,
      otherInteger: 1
    }, {
      active: true,
      notActive: false,
      otherString: 'other2',
      otherNumber: 2.1,
      otherInteger: 2
    }, {
      active: true,
      notActive: false,
      otherString: 'other3',
      otherNumber: 3.1,
      otherInteger: 3
    }];

    JSONStore.destroy()

    .then(function(res) {
      deepEqual(res, 0, 'destroy');
      return JSONStore.init(collections);
    })

    .then(function(res) {
      deepEqual(res.customers.name, 'customers');
      return JSONStore.get('customers').add(data);
    })

    .then(function(res) {
      deepEqual(res, 3, 'Add');
      var queryPart1 = JSONStore.QueryPart()
        .greaterThan('notActive', '0');

      return JSONStore.get('customers').advancedFind([queryPart1]);

    })

    .then(function(data) {
      deepEqual(data.length, 0, 'Result length string');

      var queryPart1 = JSONStore.QueryPart()
        .greaterThan('notActive', 0);

      return JSONStore.get('customers').advancedFind([queryPart1]);
    })

    .then(function(data) {
      deepEqual(data.length, 0, 'Result length int');

      var queryPart1 = JSONStore.QueryPart()
        .greaterThan('notActive', 0.0);

      return JSONStore.get('customers').advancedFind([queryPart1]);
    })

    .then(function(data) {
      deepEqual(data.length, 0, 'Result length number');

      var queryPart1 = JSONStore.QueryPart()
        .greaterThan('notActive', false);

      return JSONStore.get('customers').advancedFind([queryPart1]);
    })

    .then(function(data) {
      deepEqual(data.length, 0, 'Result length bool');
      start();
    })

    .fail(function(err) {
      ok(false, err.toString());
      start();
    });
  });

  asyncTest('Greater Than Or Equal Type Safety Test', 71, function() {

    var collections = {
      customers: {
        searchFields: {
          active: 'boolean',
          notActive: 'boolean',
          otherString: 'string',
          otherNumber: 'number',
          otherInteger: 'integer'
        }
      }
    };

    var data = [{
      active: true,
      notActive: false,
      otherString: 'other1',
      otherNumber: 1.1,
      otherInteger: 1
    }, {
      active: true,
      notActive: false,
      otherString: 'other2',
      otherNumber: 2.1,
      otherInteger: 2
    }, {
      active: true,
      notActive: false,
      otherString: 'other3',
      otherNumber: 3.1,
      otherInteger: 3
    }];

    JSONStore.destroy()

    .then(function(res) {
      deepEqual(res, 0, 'destroy');
      return JSONStore.init(collections);
    })

    .then(function(res) {
      deepEqual(res.customers.name, 'customers');
      return JSONStore.get('customers').add(data);
    })

    .then(function(res) {
      deepEqual(res, 3, 'Add');
      var queryPart1 = JSONStore.QueryPart()
        .greaterOrEqualThan('notActive', '0');

      return JSONStore.get('customers').advancedFind([queryPart1]);

    })

    .then(function(data) {
      deepEqual(data.length, 3, 'Result length string');

      deepEqual(_.keys(data[0]).sort(), ['_id', 'json'].sort(), 'keys');

      deepEqual(data[0].json.active, true, 'active');
      deepEqual(data[0].json.notActive, false, 'not active');
      deepEqual(data[0].json.otherString, 'other1', 'other string');
      deepEqual(data[0].json.otherNumber, 1.1, 'other number');
      deepEqual(data[0].json.otherInteger, 1, 'other integer');

      deepEqual(data[1].json.active, true, 'active');
      deepEqual(data[1].json.notActive, false, 'not active');
      deepEqual(data[1].json.otherString, 'other2', 'other string');
      deepEqual(data[1].json.otherNumber, 2.1, 'other number');
      deepEqual(data[1].json.otherInteger, 2, 'other integer');

      deepEqual(data[2].json.active, true, 'active');
      deepEqual(data[2].json.notActive, false, 'not active');
      deepEqual(data[2].json.otherString, 'other3', 'other string');
      deepEqual(data[2].json.otherNumber, 3.1, 'other number');
      deepEqual(data[2].json.otherInteger, 3, 'other integer');

      var queryPart1 = JSONStore.QueryPart()
        .greaterOrEqualThan('notActive', 0);

      return JSONStore.get('customers').advancedFind([queryPart1]);
    })

    .then(function(data) {
      deepEqual(data.length, 3, 'Result length int');

      deepEqual(_.keys(data[0]).sort(), ['_id', 'json'].sort(), 'keys');

      deepEqual(data[0].json.active, true, 'active');
      deepEqual(data[0].json.notActive, false, 'not active');
      deepEqual(data[0].json.otherString, 'other1', 'other string');
      deepEqual(data[0].json.otherNumber, 1.1, 'other number');
      deepEqual(data[0].json.otherInteger, 1, 'other integer');

      deepEqual(data[1].json.active, true, 'active');
      deepEqual(data[1].json.notActive, false, 'not active');
      deepEqual(data[1].json.otherString, 'other2', 'other string');
      deepEqual(data[1].json.otherNumber, 2.1, 'other number');
      deepEqual(data[1].json.otherInteger, 2, 'other integer');

      deepEqual(data[2].json.active, true, 'active');
      deepEqual(data[2].json.notActive, false, 'not active');
      deepEqual(data[2].json.otherString, 'other3', 'other string');
      deepEqual(data[2].json.otherNumber, 3.1, 'other number');
      deepEqual(data[2].json.otherInteger, 3, 'other integer');

      var queryPart1 = JSONStore.QueryPart()
        .greaterOrEqualThan('notActive', 0.0);

      return JSONStore.get('customers').advancedFind([queryPart1]);
    })

    .then(function(data) {
      deepEqual(data.length, 3, 'Result length number');

      deepEqual(_.keys(data[0]).sort(), ['_id', 'json'].sort(), 'keys');

      deepEqual(data[0].json.active, true, 'active');
      deepEqual(data[0].json.notActive, false, 'not active');
      deepEqual(data[0].json.otherString, 'other1', 'other string');
      deepEqual(data[0].json.otherNumber, 1.1, 'other number');
      deepEqual(data[0].json.otherInteger, 1, 'other integer');

      deepEqual(data[1].json.active, true, 'active');
      deepEqual(data[1].json.notActive, false, 'not active');
      deepEqual(data[1].json.otherString, 'other2', 'other string');
      deepEqual(data[1].json.otherNumber, 2.1, 'other number');
      deepEqual(data[1].json.otherInteger, 2, 'other integer');

      deepEqual(data[2].json.active, true, 'active');
      deepEqual(data[2].json.notActive, false, 'not active');
      deepEqual(data[2].json.otherString, 'other3', 'other string');
      deepEqual(data[2].json.otherNumber, 3.1, 'other number');
      deepEqual(data[2].json.otherInteger, 3, 'other integer');

      var queryPart1 = JSONStore.QueryPart()
        .greaterOrEqualThan('notActive', false);

      return JSONStore.get('customers').advancedFind([queryPart1]);
    })

    .then(function(data) {
      deepEqual(data.length, 3, 'Result length bool');

      deepEqual(_.keys(data[0]).sort(), ['_id', 'json'].sort(), 'keys');

      deepEqual(data[0].json.active, true, 'active');
      deepEqual(data[0].json.notActive, false, 'not active');
      deepEqual(data[0].json.otherString, 'other1', 'other string');
      deepEqual(data[0].json.otherNumber, 1.1, 'other number');
      deepEqual(data[0].json.otherInteger, 1, 'other integer');

      deepEqual(data[1].json.active, true, 'active');
      deepEqual(data[1].json.notActive, false, 'not active');
      deepEqual(data[1].json.otherString, 'other2', 'other string');
      deepEqual(data[1].json.otherNumber, 2.1, 'other number');
      deepEqual(data[1].json.otherInteger, 2, 'other integer');

      deepEqual(data[2].json.active, true, 'active');
      deepEqual(data[2].json.notActive, false, 'not active');
      deepEqual(data[2].json.otherString, 'other3', 'other string');
      deepEqual(data[2].json.otherNumber, 3.1, 'other number');
      deepEqual(data[2].json.otherInteger, 3, 'other integer');

      start();
    })

    .fail(function(err) {
      ok(false, err.toString());
      start();
    });
  });

  asyncTest('Less Than Or Equal Type Safety Test with Filter', 71, function() {

    var collections = {
      customers: {
        searchFields: {
          active: 'boolean',
          notActive: 'boolean',
          otherString: 'string',
          otherNumber: 'number',
          otherInteger: 'integer'
        }
      }
    };

    var data = [{
      active: true,
      notActive: false,
      otherString: 'other1',
      otherNumber: 1.1,
      otherInteger: 1
    }, {
      active: true,
      notActive: false,
      otherString: 'other2',
      otherNumber: 2.1,
      otherInteger: 2
    }, {
      active: true,
      notActive: false,
      otherString: 'other3',
      otherNumber: 3.1,
      otherInteger: 3
    }];

    JSONStore.destroy()

    .then(function(res) {
      deepEqual(res, 0, 'destroy');
      return JSONStore.init(collections);
    })

    .then(function(res) {
      deepEqual(res.customers.name, 'customers');
      return JSONStore.get('customers').add(data);
    })

    .then(function(res) {
      deepEqual(res, 3, 'Add');
      var queryPart1 = JSONStore.QueryPart()
        .lessOrEqualThan('notActive', '0');

      return JSONStore.get('customers').advancedFind([queryPart1], {
        filter: ['active', 'notActive', 'otherString', 'otherNumber', 'otherInteger']
      });

    })

    .then(function(data) {
      deepEqual(data.length, 3, 'Result length string');

      deepEqual(_.keys(data[0]).sort(), ['active', 'notactive', 'otherstring', 'othernumber', 'otherinteger'].sort(), 'keys');

      deepEqual(data[0].active, '1', 'active');
      deepEqual(data[0].notactive, '0', 'not active');
      deepEqual(data[0].otherstring, 'other1', 'other string');
      deepEqual(data[0].othernumber, '1.1', 'other number');
      deepEqual(data[0].otherinteger, '1', 'other integer');

      deepEqual(data[1].active, '1', 'active');
      deepEqual(data[1].notactive, '0', 'not active');
      deepEqual(data[1].otherstring, 'other2', 'other string');
      deepEqual(data[1].othernumber, '2.1', 'other number');
      deepEqual(data[1].otherinteger, '2', 'other integer');

      deepEqual(data[2].active, '1', 'active');
      deepEqual(data[2].notactive, '0', 'not active');
      deepEqual(data[2].otherstring, 'other3', 'other string');
      deepEqual(data[2].othernumber, '3.1', 'other number');
      deepEqual(data[2].otherinteger, '3', 'other integer');

      var queryPart1 = JSONStore.QueryPart()
        .lessOrEqualThan('notActive', 0);

      return JSONStore.get('customers').advancedFind([queryPart1], {
        filter: ['active', 'notActive', 'otherString', 'otherNumber', 'otherInteger']
      });
    })

    .then(function(data) {
      deepEqual(data.length, 3, 'Result length int');

      deepEqual(_.keys(data[0]).sort(), ['active', 'notactive', 'otherstring', 'othernumber', 'otherinteger'].sort(), 'keys');

      deepEqual(data[0].active, '1', 'active');
      deepEqual(data[0].notactive, '0', 'not active');
      deepEqual(data[0].otherstring, 'other1', 'other string');
      deepEqual(data[0].othernumber, '1.1', 'other number');
      deepEqual(data[0].otherinteger, '1', 'other integer');

      deepEqual(data[1].active, '1', 'active');
      deepEqual(data[1].notactive, '0', 'not active');
      deepEqual(data[1].otherstring, 'other2', 'other string');
      deepEqual(data[1].othernumber, '2.1', 'other number');
      deepEqual(data[1].otherinteger, '2', 'other integer');

      deepEqual(data[2].active, '1', 'active');
      deepEqual(data[2].notactive, '0', 'not active');
      deepEqual(data[2].otherstring, 'other3', 'other string');
      deepEqual(data[2].othernumber, '3.1', 'other number');
      deepEqual(data[2].otherinteger, '3', 'other integer');

      var queryPart1 = JSONStore.QueryPart()
        .lessOrEqualThan('notActive', 0.0);

      return JSONStore.get('customers').advancedFind([queryPart1], {
        filter: ['active', 'notActive', 'otherString', 'otherNumber', 'otherInteger']
      });
    })

    .then(function(data) {
      deepEqual(data.length, 3, 'Result length number');

      deepEqual(_.keys(data[0]).sort(), ['active', 'notactive', 'otherstring', 'othernumber', 'otherinteger'].sort(), 'keys');

      deepEqual(data[0].active, '1', 'active');
      deepEqual(data[0].notactive, '0', 'not active');
      deepEqual(data[0].otherstring, 'other1', 'other string');
      deepEqual(data[0].othernumber, '1.1', 'other number');
      deepEqual(data[0].otherinteger, '1', 'other integer');

      deepEqual(data[1].active, '1', 'active');
      deepEqual(data[1].notactive, '0', 'not active');
      deepEqual(data[1].otherstring, 'other2', 'other string');
      deepEqual(data[1].othernumber, '2.1', 'other number');
      deepEqual(data[1].otherinteger, '2', 'other integer');

      deepEqual(data[2].active, '1', 'active');
      deepEqual(data[2].notactive, '0', 'not active');
      deepEqual(data[2].otherstring, 'other3', 'other string');
      deepEqual(data[2].othernumber, '3.1', 'other number');
      deepEqual(data[2].otherinteger, '3', 'other integer');

      var queryPart1 = JSONStore.QueryPart()
        .lessOrEqualThan('notActive', false);

      return JSONStore.get('customers').advancedFind([queryPart1], {
        filter: ['active', 'notActive', 'otherString', 'otherNumber', 'otherInteger']
      });
    })

    .then(function(data) {
      deepEqual(data.length, 3, 'Result length bool');

      deepEqual(_.keys(data[0]).sort(), ['active', 'notactive', 'otherstring', 'othernumber', 'otherinteger'].sort(), 'keys');

      deepEqual(data[0].active, '1', 'active');
      deepEqual(data[0].notactive, '0', 'not active');
      deepEqual(data[0].otherstring, 'other1', 'other string');
      deepEqual(data[0].othernumber, '1.1', 'other number');
      deepEqual(data[0].otherinteger, '1', 'other integer');

      deepEqual(data[1].active, '1', 'active');
      deepEqual(data[1].notactive, '0', 'not active');
      deepEqual(data[1].otherstring, 'other2', 'other string');
      deepEqual(data[1].othernumber, '2.1', 'other number');
      deepEqual(data[1].otherinteger, '2', 'other integer');

      deepEqual(data[2].active, '1', 'active');
      deepEqual(data[2].notactive, '0', 'not active');
      deepEqual(data[2].otherstring, 'other3', 'other string');
      deepEqual(data[2].othernumber, '3.1', 'other number');
      deepEqual(data[2].otherinteger, '3', 'other integer');

      start();
    })

    .fail(function(err) {
      ok(false, err.toString());
      start();
    });
  });

  asyncTest('Equal Type Safety Test', 71, function() {

    var collections = {
      customers: {
        searchFields: {
          active: 'boolean',
          notActive: 'boolean',
          otherString: 'string',
          otherNumber: 'number',
          otherInteger: 'integer'
        }
      }
    };

    var data = [{
      active: true,
      notActive: false,
      otherString: 'other1',
      otherNumber: 1.1,
      otherInteger: 1
    }, {
      active: true,
      notActive: false,
      otherString: 'other2',
      otherNumber: 2.1,
      otherInteger: 2
    }, {
      active: true,
      notActive: false,
      otherString: 'other3',
      otherNumber: 3.1,
      otherInteger: 3
    }];

    JSONStore.destroy()

    .then(function(res) {
      deepEqual(res, 0, 'destroy');
      return JSONStore.init(collections);
    })

    .then(function(res) {
      deepEqual(res.customers.name, 'customers');
      return JSONStore.get('customers').add(data);
    })

    .then(function(res) {
      deepEqual(res, 3, 'Add');
      var queryPart1 = JSONStore.QueryPart()
        .equal('notActive', '0');

      return JSONStore.get('customers').advancedFind([queryPart1]);

    })

    .then(function(data) {
      deepEqual(data.length, 3, 'Result length string');

      deepEqual(_.keys(data[0]).sort(), ['_id', 'json'].sort(), 'keys');

      deepEqual(data[0].json.active, true, 'active');
      deepEqual(data[0].json.notActive, false, 'not active');
      deepEqual(data[0].json.otherString, 'other1', 'other string');
      deepEqual(data[0].json.otherNumber, 1.1, 'other number');
      deepEqual(data[0].json.otherInteger, 1, 'other integer');

      deepEqual(data[1].json.active, true, 'active');
      deepEqual(data[1].json.notActive, false, 'not active');
      deepEqual(data[1].json.otherString, 'other2', 'other string');
      deepEqual(data[1].json.otherNumber, 2.1, 'other number');
      deepEqual(data[1].json.otherInteger, 2, 'other integer');

      deepEqual(data[2].json.active, true, 'active');
      deepEqual(data[2].json.notActive, false, 'not active');
      deepEqual(data[2].json.otherString, 'other3', 'other string');
      deepEqual(data[2].json.otherNumber, 3.1, 'other number');
      deepEqual(data[2].json.otherInteger, 3, 'other integer');

      var queryPart1 = JSONStore.QueryPart()
        .equal('notActive', 0);

      return JSONStore.get('customers').advancedFind([queryPart1]);
    })

    .then(function(data) {
      deepEqual(data.length, 3, 'Result length int');

      deepEqual(_.keys(data[0]).sort(), ['_id', 'json'].sort(), 'keys');

      deepEqual(data[0].json.active, true, 'active');
      deepEqual(data[0].json.notActive, false, 'not active');
      deepEqual(data[0].json.otherString, 'other1', 'other string');
      deepEqual(data[0].json.otherNumber, 1.1, 'other number');
      deepEqual(data[0].json.otherInteger, 1, 'other integer');

      deepEqual(data[1].json.active, true, 'active');
      deepEqual(data[1].json.notActive, false, 'not active');
      deepEqual(data[1].json.otherString, 'other2', 'other string');
      deepEqual(data[1].json.otherNumber, 2.1, 'other number');
      deepEqual(data[1].json.otherInteger, 2, 'other integer');

      deepEqual(data[2].json.active, true, 'active');
      deepEqual(data[2].json.notActive, false, 'not active');
      deepEqual(data[2].json.otherString, 'other3', 'other string');
      deepEqual(data[2].json.otherNumber, 3.1, 'other number');
      deepEqual(data[2].json.otherInteger, 3, 'other integer');

      var queryPart1 = JSONStore.QueryPart()
        .equal('notActive', 0.0);

      return JSONStore.get('customers').advancedFind([queryPart1]);
    })

    .then(function(data) {
      deepEqual(data.length, 3, 'Result length number');

      deepEqual(_.keys(data[0]).sort(), ['_id', 'json'].sort(), 'keys');

      deepEqual(data[0].json.active, true, 'active');
      deepEqual(data[0].json.notActive, false, 'not active');
      deepEqual(data[0].json.otherString, 'other1', 'other string');
      deepEqual(data[0].json.otherNumber, 1.1, 'other number');
      deepEqual(data[0].json.otherInteger, 1, 'other integer');

      deepEqual(data[1].json.active, true, 'active');
      deepEqual(data[1].json.notActive, false, 'not active');
      deepEqual(data[1].json.otherString, 'other2', 'other string');
      deepEqual(data[1].json.otherNumber, 2.1, 'other number');
      deepEqual(data[1].json.otherInteger, 2, 'other integer');

      deepEqual(data[2].json.active, true, 'active');
      deepEqual(data[2].json.notActive, false, 'not active');
      deepEqual(data[2].json.otherString, 'other3', 'other string');
      deepEqual(data[2].json.otherNumber, 3.1, 'other number');
      deepEqual(data[2].json.otherInteger, 3, 'other integer');

      var queryPart1 = JSONStore.QueryPart()
        .equal('notActive', false);

      return JSONStore.get('customers').advancedFind([queryPart1]);
    })

    .then(function(data) {
      deepEqual(data.length, 3, 'Result length bool');

      deepEqual(_.keys(data[0]).sort(), ['_id', 'json'].sort(), 'keys');

      deepEqual(data[0].json.active, true, 'active');
      deepEqual(data[0].json.notActive, false, 'not active');
      deepEqual(data[0].json.otherString, 'other1', 'other string');
      deepEqual(data[0].json.otherNumber, 1.1, 'other number');
      deepEqual(data[0].json.otherInteger, 1, 'other integer');

      deepEqual(data[1].json.active, true, 'active');
      deepEqual(data[1].json.notActive, false, 'not active');
      deepEqual(data[1].json.otherString, 'other2', 'other string');
      deepEqual(data[1].json.otherNumber, 2.1, 'other number');
      deepEqual(data[1].json.otherInteger, 2, 'other integer');

      deepEqual(data[2].json.active, true, 'active');
      deepEqual(data[2].json.notActive, false, 'not active');
      deepEqual(data[2].json.otherString, 'other3', 'other string');
      deepEqual(data[2].json.otherNumber, 3.1, 'other number');
      deepEqual(data[2].json.otherInteger, 3, 'other integer');

      start();
    })

    .fail(function(err) {
      ok(false, err.toString());
      start();
    });
  });

  asyncTest('Not Equal Type Safety Test', 7, function() {

    var collections = {
      customers: {
        searchFields: {
          active: 'boolean',
          notActive: 'boolean',
          otherString: 'string',
          otherNumber: 'number',
          otherInteger: 'integer'
        }
      }
    };

    var data = [{
      active: true,
      notActive: false,
      otherString: 'other1',
      otherNumber: 1.1,
      otherInteger: 1
    }, {
      active: true,
      notActive: false,
      otherString: 'other2',
      otherNumber: 2.1,
      otherInteger: 2
    }, {
      active: true,
      notActive: false,
      otherString: 'other3',
      otherNumber: 3.1,
      otherInteger: 3
    }];

    JSONStore.destroy()

    .then(function(res) {
      deepEqual(res, 0, 'destroy');
      return JSONStore.init(collections);
    })

    .then(function(res) {
      deepEqual(res.customers.name, 'customers');
      return JSONStore.get('customers').add(data);
    })

    .then(function(res) {
      deepEqual(res, 3, 'Add');
      var queryPart1 = JSONStore.QueryPart()
        .notEqual('notActive', '0');

      return JSONStore.get('customers').advancedFind([queryPart1]);

    })

    .then(function(data) {
      deepEqual(data.length, 0, 'Result length string');

      var queryPart1 = JSONStore.QueryPart()
        .notEqual('notActive', 0);

      return JSONStore.get('customers').advancedFind([queryPart1]);
    })

    .then(function(data) {
      deepEqual(data.length, 0, 'Result length int');

      var queryPart1 = JSONStore.QueryPart()
        .notEqual('notActive', 0.0);

      return JSONStore.get('customers').advancedFind([queryPart1]);
    })

    .then(function(data) {
      deepEqual(data.length, 0, 'Result length number');

      var queryPart1 = JSONStore.QueryPart()
        .notEqual('notActive', false);

      return JSONStore.get('customers').advancedFind([queryPart1]);
    })

    .then(function(data) {
      deepEqual(data.length, 0, 'Result length bool');
      start();
    })

    .fail(function(err) {
      ok(false, err.toString());
      start();
    });
  });

  asyncTest('Equal Type Safety Test with Filter', 71, function() {

    var collections = {
      customers: {
        searchFields: {
          active: 'boolean',
          notActive: 'boolean',
          otherString: 'string',
          otherNumber: 'number',
          otherInteger: 'integer'
        }
      }
    };

    var data = [{
      active: true,
      notActive: false,
      otherString: 'other1',
      otherNumber: 1.1,
      otherInteger: 1
    }, {
      active: true,
      notActive: false,
      otherString: 'other2',
      otherNumber: 2.1,
      otherInteger: 2
    }, {
      active: true,
      notActive: false,
      otherString: 'other3',
      otherNumber: 3.1,
      otherInteger: 3
    }];

    JSONStore.destroy()

    .then(function(res) {
      deepEqual(res, 0, 'destroy');
      return JSONStore.init(collections);
    })

    .then(function(res) {
      deepEqual(res.customers.name, 'customers');
      return JSONStore.get('customers').add(data);
    })

    .then(function(res) {
      deepEqual(res, 3, 'Add');
      var queryPart1 = JSONStore.QueryPart()
        .equal('notActive', '0');

      return JSONStore.get('customers').advancedFind([queryPart1], {
        filter: ['active', 'notActive', 'otherString', 'otherNumber', 'otherInteger']
      });

    })

    .then(function(data) {
      deepEqual(data.length, 3, 'Result length string');

      deepEqual(_.keys(data[0]).sort(), ['active', 'notactive', 'otherstring', 'othernumber', 'otherinteger'].sort(), 'keys');

      deepEqual(data[0].active, '1', 'active');
      deepEqual(data[0].notactive, '0', 'not active');
      deepEqual(data[0].otherstring, 'other1', 'other string');
      deepEqual(data[0].othernumber, '1.1', 'other number');
      deepEqual(data[0].otherinteger, '1', 'other integer');

      deepEqual(data[1].active, '1', 'active');
      deepEqual(data[1].notactive, '0', 'not active');
      deepEqual(data[1].otherstring, 'other2', 'other string');
      deepEqual(data[1].othernumber, '2.1', 'other number');
      deepEqual(data[1].otherinteger, '2', 'other integer');

      deepEqual(data[2].active, '1', 'active');
      deepEqual(data[2].notactive, '0', 'not active');
      deepEqual(data[2].otherstring, 'other3', 'other string');
      deepEqual(data[2].othernumber, '3.1', 'other number');
      deepEqual(data[2].otherinteger, '3', 'other integer');

      var queryPart1 = JSONStore.QueryPart()
        .equal('notActive', 0);

      return JSONStore.get('customers').advancedFind([queryPart1], {
        filter: ['active', 'notActive', 'otherString', 'otherNumber', 'otherInteger']
      });
    })

    .then(function(data) {
      deepEqual(data.length, 3, 'Result length int');

      deepEqual(_.keys(data[0]).sort(), ['active', 'notactive', 'otherstring', 'othernumber', 'otherinteger'].sort(), 'keys');

      deepEqual(data[0].active, '1', 'active');
      deepEqual(data[0].notactive, '0', 'not active');
      deepEqual(data[0].otherstring, 'other1', 'other string');
      deepEqual(data[0].othernumber, '1.1', 'other number');
      deepEqual(data[0].otherinteger, '1', 'other integer');

      deepEqual(data[1].active, '1', 'active');
      deepEqual(data[1].notactive, '0', 'not active');
      deepEqual(data[1].otherstring, 'other2', 'other string');
      deepEqual(data[1].othernumber, '2.1', 'other number');
      deepEqual(data[1].otherinteger, '2', 'other integer');

      deepEqual(data[2].active, '1', 'active');
      deepEqual(data[2].notactive, '0', 'not active');
      deepEqual(data[2].otherstring, 'other3', 'other string');
      deepEqual(data[2].othernumber, '3.1', 'other number');
      deepEqual(data[2].otherinteger, '3', 'other integer');

      var queryPart1 = JSONStore.QueryPart()
        .equal('notActive', 0.0);

      return JSONStore.get('customers').advancedFind([queryPart1], {
        filter: ['active', 'notActive', 'otherString', 'otherNumber', 'otherInteger']
      });
    })

    .then(function(data) {
      deepEqual(data.length, 3, 'Result length number');

      deepEqual(_.keys(data[0]).sort(), ['active', 'notactive', 'otherstring', 'othernumber', 'otherinteger'].sort(), 'keys');

      deepEqual(data[0].active, '1', 'active');
      deepEqual(data[0].notactive, '0', 'not active');
      deepEqual(data[0].otherstring, 'other1', 'other string');
      deepEqual(data[0].othernumber, '1.1', 'other number');
      deepEqual(data[0].otherinteger, '1', 'other integer');

      deepEqual(data[1].active, '1', 'active');
      deepEqual(data[1].notactive, '0', 'not active');
      deepEqual(data[1].otherstring, 'other2', 'other string');
      deepEqual(data[1].othernumber, '2.1', 'other number');
      deepEqual(data[1].otherinteger, '2', 'other integer');

      deepEqual(data[2].active, '1', 'active');
      deepEqual(data[2].notactive, '0', 'not active');
      deepEqual(data[2].otherstring, 'other3', 'other string');
      deepEqual(data[2].othernumber, '3.1', 'other number');
      deepEqual(data[2].otherinteger, '3', 'other integer');

      var queryPart1 = JSONStore.QueryPart()
        .equal('notActive', false);

      return JSONStore.get('customers').advancedFind([queryPart1], {
        filter: ['active', 'notActive', 'otherString', 'otherNumber', 'otherInteger']
      });
    })

    .then(function(data) {
      deepEqual(data.length, 3, 'Result length bool');

      deepEqual(_.keys(data[0]).sort(), ['active', 'notactive', 'otherstring', 'othernumber', 'otherinteger'].sort(), 'keys');

      deepEqual(data[0].active, '1', 'active');
      deepEqual(data[0].notactive, '0', 'not active');
      deepEqual(data[0].otherstring, 'other1', 'other string');
      deepEqual(data[0].othernumber, '1.1', 'other number');
      deepEqual(data[0].otherinteger, '1', 'other integer');

      deepEqual(data[1].active, '1', 'active');
      deepEqual(data[1].notactive, '0', 'not active');
      deepEqual(data[1].otherstring, 'other2', 'other string');
      deepEqual(data[1].othernumber, '2.1', 'other number');
      deepEqual(data[1].otherinteger, '2', 'other integer');

      deepEqual(data[2].active, '1', 'active');
      deepEqual(data[2].notactive, '0', 'not active');
      deepEqual(data[2].otherstring, 'other3', 'other string');
      deepEqual(data[2].othernumber, '3.1', 'other number');
      deepEqual(data[2].otherinteger, '3', 'other integer');

      start();
    })

    .fail(function(err) {
      ok(false, err.toString());
      start();
    });
  });

  asyncTest('Like Type Safety Test', 71, function() {

    var collections = {
      customers: {
        searchFields: {
          active: 'boolean',
          notActive: 'boolean',
          otherString: 'string',
          otherNumber: 'number',
          otherInteger: 'integer'
        }
      }
    };

    var data = [{
      active: true,
      notActive: false,
      otherString: 'other1',
      otherNumber: 1.1,
      otherInteger: 1
    }, {
      active: true,
      notActive: false,
      otherString: 'other2',
      otherNumber: 2.1,
      otherInteger: 2
    }, {
      active: true,
      notActive: false,
      otherString: 'other3',
      otherNumber: 3.1,
      otherInteger: 3
    }];

    JSONStore.destroy()

    .then(function(res) {
      deepEqual(res, 0, 'destroy');
      return JSONStore.init(collections);
    })

    .then(function(res) {
      deepEqual(res.customers.name, 'customers');
      return JSONStore.get('customers').add(data);
    })

    .then(function(res) {
      deepEqual(res, 3, 'Add');
      var queryPart1 = JSONStore.QueryPart()
        .like('notActive', '0');

      return JSONStore.get('customers').advancedFind([queryPart1]);

    })

    .then(function(data) {
      deepEqual(data.length, 3, 'Result length string');

      deepEqual(_.keys(data[0]).sort(), ['_id', 'json'].sort(), 'keys');

      deepEqual(data[0].json.active, true, 'active');
      deepEqual(data[0].json.notActive, false, 'not active');
      deepEqual(data[0].json.otherString, 'other1', 'other string');
      deepEqual(data[0].json.otherNumber, 1.1, 'other number');
      deepEqual(data[0].json.otherInteger, 1, 'other integer');

      deepEqual(data[1].json.active, true, 'active');
      deepEqual(data[1].json.notActive, false, 'not active');
      deepEqual(data[1].json.otherString, 'other2', 'other string');
      deepEqual(data[1].json.otherNumber, 2.1, 'other number');
      deepEqual(data[1].json.otherInteger, 2, 'other integer');

      deepEqual(data[2].json.active, true, 'active');
      deepEqual(data[2].json.notActive, false, 'not active');
      deepEqual(data[2].json.otherString, 'other3', 'other string');
      deepEqual(data[2].json.otherNumber, 3.1, 'other number');
      deepEqual(data[2].json.otherInteger, 3, 'other integer');

      var queryPart1 = JSONStore.QueryPart()
        .like('notActive', 0);

      return JSONStore.get('customers').advancedFind([queryPart1]);
    })

    .then(function(data) {
      deepEqual(data.length, 3, 'Result length int');

      deepEqual(_.keys(data[0]).sort(), ['_id', 'json'].sort(), 'keys');

      deepEqual(data[0].json.active, true, 'active');
      deepEqual(data[0].json.notActive, false, 'not active');
      deepEqual(data[0].json.otherString, 'other1', 'other string');
      deepEqual(data[0].json.otherNumber, 1.1, 'other number');
      deepEqual(data[0].json.otherInteger, 1, 'other integer');

      deepEqual(data[1].json.active, true, 'active');
      deepEqual(data[1].json.notActive, false, 'not active');
      deepEqual(data[1].json.otherString, 'other2', 'other string');
      deepEqual(data[1].json.otherNumber, 2.1, 'other number');
      deepEqual(data[1].json.otherInteger, 2, 'other integer');

      deepEqual(data[2].json.active, true, 'active');
      deepEqual(data[2].json.notActive, false, 'not active');
      deepEqual(data[2].json.otherString, 'other3', 'other string');
      deepEqual(data[2].json.otherNumber, 3.1, 'other number');
      deepEqual(data[2].json.otherInteger, 3, 'other integer');

      var queryPart1 = JSONStore.QueryPart()
        .like('notActive', 0.0);

      return JSONStore.get('customers').advancedFind([queryPart1]);
    })

    .then(function(data) {
      deepEqual(data.length, 3, 'Result length number');

      deepEqual(_.keys(data[0]).sort(), ['_id', 'json'].sort(), 'keys');

      deepEqual(data[0].json.active, true, 'active');
      deepEqual(data[0].json.notActive, false, 'not active');
      deepEqual(data[0].json.otherString, 'other1', 'other string');
      deepEqual(data[0].json.otherNumber, 1.1, 'other number');
      deepEqual(data[0].json.otherInteger, 1, 'other integer');

      deepEqual(data[1].json.active, true, 'active');
      deepEqual(data[1].json.notActive, false, 'not active');
      deepEqual(data[1].json.otherString, 'other2', 'other string');
      deepEqual(data[1].json.otherNumber, 2.1, 'other number');
      deepEqual(data[1].json.otherInteger, 2, 'other integer');

      deepEqual(data[2].json.active, true, 'active');
      deepEqual(data[2].json.notActive, false, 'not active');
      deepEqual(data[2].json.otherString, 'other3', 'other string');
      deepEqual(data[2].json.otherNumber, 3.1, 'other number');
      deepEqual(data[2].json.otherInteger, 3, 'other integer');

      var queryPart1 = JSONStore.QueryPart()
        .like('notActive', false);

      return JSONStore.get('customers').advancedFind([queryPart1]);
    })

    .then(function(data) {
      deepEqual(data.length, 3, 'Result length bool');

      deepEqual(_.keys(data[0]).sort(), ['_id', 'json'].sort(), 'keys');

      deepEqual(data[0].json.active, true, 'active');
      deepEqual(data[0].json.notActive, false, 'not active');
      deepEqual(data[0].json.otherString, 'other1', 'other string');
      deepEqual(data[0].json.otherNumber, 1.1, 'other number');
      deepEqual(data[0].json.otherInteger, 1, 'other integer');

      deepEqual(data[1].json.active, true, 'active');
      deepEqual(data[1].json.notActive, false, 'not active');
      deepEqual(data[1].json.otherString, 'other2', 'other string');
      deepEqual(data[1].json.otherNumber, 2.1, 'other number');
      deepEqual(data[1].json.otherInteger, 2, 'other integer');

      deepEqual(data[2].json.active, true, 'active');
      deepEqual(data[2].json.notActive, false, 'not active');
      deepEqual(data[2].json.otherString, 'other3', 'other string');
      deepEqual(data[2].json.otherNumber, 3.1, 'other number');
      deepEqual(data[2].json.otherInteger, 3, 'other integer');

      start();
    })

    .fail(function(err) {
      ok(false, err.toString());
      start();
    });
  });

  asyncTest('Not Like Type Safety Test', 7, function() {

    var collections = {
      customers: {
        searchFields: {
          active: 'boolean',
          notActive: 'boolean',
          otherString: 'string',
          otherNumber: 'number',
          otherInteger: 'integer'
        }
      }
    };

    var data = [{
      active: true,
      notActive: false,
      otherString: 'other1',
      otherNumber: 1.1,
      otherInteger: 1
    }, {
      active: true,
      notActive: false,
      otherString: 'other2',
      otherNumber: 2.1,
      otherInteger: 2
    }, {
      active: true,
      notActive: false,
      otherString: 'other3',
      otherNumber: 3.1,
      otherInteger: 3
    }];

    JSONStore.destroy()

    .then(function(res) {
      deepEqual(res, 0, 'destroy');
      return JSONStore.init(collections);
    })

    .then(function(res) {
      deepEqual(res.customers.name, 'customers');
      return JSONStore.get('customers').add(data);
    })

    .then(function(res) {
      deepEqual(res, 3, 'Add');
      var queryPart1 = JSONStore.QueryPart()
        .notLike('notActive', '0');

      return JSONStore.get('customers').advancedFind([queryPart1]);

    })

    .then(function(data) {
      deepEqual(data.length, 0, 'Result length string');

      var queryPart1 = JSONStore.QueryPart()
        .notLike('notActive', 0);

      return JSONStore.get('customers').advancedFind([queryPart1]);
    })

    .then(function(data) {
      deepEqual(data.length, 0, 'Result length int');

      var queryPart1 = JSONStore.QueryPart()
        .notLike('notActive', 0.0);

      return JSONStore.get('customers').advancedFind([queryPart1]);
    })

    .then(function(data) {
      deepEqual(data.length, 0, 'Result length number');

      var queryPart1 = JSONStore.QueryPart()
        .notLike('notActive', false);

      return JSONStore.get('customers').advancedFind([queryPart1]);
    })

    .then(function(data) {
      deepEqual(data.length, 0, 'Result length bool');
      start();
    })

    .fail(function(err) {
      ok(false, err.toString());
      start();
    });
  });

  asyncTest('Like Type Safety Test with Filter', 71, function() {

    var collections = {
      customers: {
        searchFields: {
          active: 'boolean',
          notActive: 'boolean',
          otherString: 'string',
          otherNumber: 'number',
          otherInteger: 'integer'
        }
      }
    };

    var data = [{
      active: true,
      notActive: false,
      otherString: 'other1',
      otherNumber: 1.1,
      otherInteger: 1
    }, {
      active: true,
      notActive: false,
      otherString: 'other2',
      otherNumber: 2.1,
      otherInteger: 2
    }, {
      active: true,
      notActive: false,
      otherString: 'other3',
      otherNumber: 3.1,
      otherInteger: 3
    }];

    JSONStore.destroy()

    .then(function(res) {
      deepEqual(res, 0, 'destroy');
      return JSONStore.init(collections);
    })

    .then(function(res) {
      deepEqual(res.customers.name, 'customers');
      return JSONStore.get('customers').add(data);
    })

    .then(function(res) {
      deepEqual(res, 3, 'Add');
      var queryPart1 = JSONStore.QueryPart()
        .like('notActive', '0');

      return JSONStore.get('customers').advancedFind([queryPart1], {
        filter: ['active', 'notActive', 'otherString', 'otherNumber', 'otherInteger']
      });

    })

    .then(function(data) {
      deepEqual(data.length, 3, 'Result length string');

      deepEqual(_.keys(data[0]).sort(), ['active', 'notactive', 'otherstring', 'othernumber', 'otherinteger'].sort(), 'keys');

      deepEqual(data[0].active, '1', 'active');
      deepEqual(data[0].notactive, '0', 'not active');
      deepEqual(data[0].otherstring, 'other1', 'other string');
      deepEqual(data[0].othernumber, '1.1', 'other number');
      deepEqual(data[0].otherinteger, '1', 'other integer');

      deepEqual(data[1].active, '1', 'active');
      deepEqual(data[1].notactive, '0', 'not active');
      deepEqual(data[1].otherstring, 'other2', 'other string');
      deepEqual(data[1].othernumber, '2.1', 'other number');
      deepEqual(data[1].otherinteger, '2', 'other integer');

      deepEqual(data[2].active, '1', 'active');
      deepEqual(data[2].notactive, '0', 'not active');
      deepEqual(data[2].otherstring, 'other3', 'other string');
      deepEqual(data[2].othernumber, '3.1', 'other number');
      deepEqual(data[2].otherinteger, '3', 'other integer');

      var queryPart1 = JSONStore.QueryPart()
        .like('notActive', 0);

      return JSONStore.get('customers').advancedFind([queryPart1], {
        filter: ['active', 'notActive', 'otherString', 'otherNumber', 'otherInteger']
      });
    })

    .then(function(data) {
      deepEqual(data.length, 3, 'Result length int');

      deepEqual(_.keys(data[0]).sort(), ['active', 'notactive', 'otherstring', 'othernumber', 'otherinteger'].sort(), 'keys');

      deepEqual(data[0].active, '1', 'active');
      deepEqual(data[0].notactive, '0', 'not active');
      deepEqual(data[0].otherstring, 'other1', 'other string');
      deepEqual(data[0].othernumber, '1.1', 'other number');
      deepEqual(data[0].otherinteger, '1', 'other integer');

      deepEqual(data[1].active, '1', 'active');
      deepEqual(data[1].notactive, '0', 'not active');
      deepEqual(data[1].otherstring, 'other2', 'other string');
      deepEqual(data[1].othernumber, '2.1', 'other number');
      deepEqual(data[1].otherinteger, '2', 'other integer');

      deepEqual(data[2].active, '1', 'active');
      deepEqual(data[2].notactive, '0', 'not active');
      deepEqual(data[2].otherstring, 'other3', 'other string');
      deepEqual(data[2].othernumber, '3.1', 'other number');
      deepEqual(data[2].otherinteger, '3', 'other integer');

      var queryPart1 = JSONStore.QueryPart()
        .like('notActive', 0.0);

      return JSONStore.get('customers').advancedFind([queryPart1], {
        filter: ['active', 'notActive', 'otherString', 'otherNumber', 'otherInteger']
      });
    })

    .then(function(data) {
      deepEqual(data.length, 3, 'Result length number');

      deepEqual(_.keys(data[0]).sort(), ['active', 'notactive', 'otherstring', 'othernumber', 'otherinteger'].sort(), 'keys');

      deepEqual(data[0].active, '1', 'active');
      deepEqual(data[0].notactive, '0', 'not active');
      deepEqual(data[0].otherstring, 'other1', 'other string');
      deepEqual(data[0].othernumber, '1.1', 'other number');
      deepEqual(data[0].otherinteger, '1', 'other integer');

      deepEqual(data[1].active, '1', 'active');
      deepEqual(data[1].notactive, '0', 'not active');
      deepEqual(data[1].otherstring, 'other2', 'other string');
      deepEqual(data[1].othernumber, '2.1', 'other number');
      deepEqual(data[1].otherinteger, '2', 'other integer');

      deepEqual(data[2].active, '1', 'active');
      deepEqual(data[2].notactive, '0', 'not active');
      deepEqual(data[2].otherstring, 'other3', 'other string');
      deepEqual(data[2].othernumber, '3.1', 'other number');
      deepEqual(data[2].otherinteger, '3', 'other integer');

      var queryPart1 = JSONStore.QueryPart()
        .like('notActive', false);

      return JSONStore.get('customers').advancedFind([queryPart1], {
        filter: ['active', 'notActive', 'otherString', 'otherNumber', 'otherInteger']
      });
    })

    .then(function(data) {
      deepEqual(data.length, 3, 'Result length bool');

      deepEqual(_.keys(data[0]).sort(), ['active', 'notactive', 'otherstring', 'othernumber', 'otherinteger'].sort(), 'keys');

      deepEqual(data[0].active, '1', 'active');
      deepEqual(data[0].notactive, '0', 'not active');
      deepEqual(data[0].otherstring, 'other1', 'other string');
      deepEqual(data[0].othernumber, '1.1', 'other number');
      deepEqual(data[0].otherinteger, '1', 'other integer');

      deepEqual(data[1].active, '1', 'active');
      deepEqual(data[1].notactive, '0', 'not active');
      deepEqual(data[1].otherstring, 'other2', 'other string');
      deepEqual(data[1].othernumber, '2.1', 'other number');
      deepEqual(data[1].otherinteger, '2', 'other integer');

      deepEqual(data[2].active, '1', 'active');
      deepEqual(data[2].notactive, '0', 'not active');
      deepEqual(data[2].otherstring, 'other3', 'other string');
      deepEqual(data[2].othernumber, '3.1', 'other number');
      deepEqual(data[2].otherinteger, '3', 'other integer');

      start();
    })

    .fail(function(err) {
      ok(false, err.toString());
      start();
    });
  });

  asyncTest('Between Type Safety Test', 71, function() {

    var collections = {
      customers: {
        searchFields: {
          active: 'boolean',
          notActive: 'boolean',
          otherString: 'string',
          otherNumber: 'number',
          otherInteger: 'integer'
        }
      }
    };

    var data = [{
      active: true,
      notActive: false,
      otherString: 'other1',
      otherNumber: 1.1,
      otherInteger: 1
    }, {
      active: true,
      notActive: false,
      otherString: 'other2',
      otherNumber: 2.1,
      otherInteger: 2
    }, {
      active: true,
      notActive: false,
      otherString: 'other3',
      otherNumber: 3.1,
      otherInteger: 3
    }];

    JSONStore.destroy()

    .then(function(res) {
      deepEqual(res, 0, 'destroy');
      return JSONStore.init(collections);
    })

    .then(function(res) {
      deepEqual(res.customers.name, 'customers');
      return JSONStore.get('customers').add(data);
    })

    .then(function(res) {
      deepEqual(res, 3, 'Add');
      var queryPart1 = JSONStore.QueryPart()
        .between('notActive', ['0', '1']);

      return JSONStore.get('customers').advancedFind([queryPart1]);

    })

    .then(function(data) {
      deepEqual(data.length, 3, 'Result length string');

      if (data.length >= 3) {
        deepEqual(_.keys(data[0]).sort(), ['_id', 'json'].sort(), 'keys');

        deepEqual(data[0].json.active, true, 'active');
        deepEqual(data[0].json.notActive, false, 'not active');
        deepEqual(data[0].json.otherString, 'other1', 'other string');
        deepEqual(data[0].json.otherNumber, 1.1, 'other number');
        deepEqual(data[0].json.otherInteger, 1, 'other integer');

        deepEqual(data[1].json.active, true, 'active');
        deepEqual(data[1].json.notActive, false, 'not active');
        deepEqual(data[1].json.otherString, 'other2', 'other string');
        deepEqual(data[1].json.otherNumber, 2.1, 'other number');
        deepEqual(data[1].json.otherInteger, 2, 'other integer');

        deepEqual(data[2].json.active, true, 'active');
        deepEqual(data[2].json.notActive, false, 'not active');
        deepEqual(data[2].json.otherString, 'other3', 'other string');
        deepEqual(data[2].json.otherNumber, 3.1, 'other number');
        deepEqual(data[2].json.otherInteger, 3, 'other integer');
      }

      var queryPart1 = JSONStore.QueryPart()
        .between('notActive', [0, 1]);

      return JSONStore.get('customers').advancedFind([queryPart1]);
    })

    .then(function(data) {
      deepEqual(data.length, 3, 'Result length int');

      if (data.length >= 3) {
        deepEqual(_.keys(data[0]).sort(), ['_id', 'json'].sort(), 'keys');

        deepEqual(data[0].json.active, true, 'active');
        deepEqual(data[0].json.notActive, false, 'not active');
        deepEqual(data[0].json.otherString, 'other1', 'other string');
        deepEqual(data[0].json.otherNumber, 1.1, 'other number');
        deepEqual(data[0].json.otherInteger, 1, 'other integer');

        deepEqual(data[1].json.active, true, 'active');
        deepEqual(data[1].json.notActive, false, 'not active');
        deepEqual(data[1].json.otherString, 'other2', 'other string');
        deepEqual(data[1].json.otherNumber, 2.1, 'other number');
        deepEqual(data[1].json.otherInteger, 2, 'other integer');

        deepEqual(data[2].json.active, true, 'active');
        deepEqual(data[2].json.notActive, false, 'not active');
        deepEqual(data[2].json.otherString, 'other3', 'other string');
        deepEqual(data[2].json.otherNumber, 3.1, 'other number');
        deepEqual(data[2].json.otherInteger, 3, 'other integer');
      }

      var queryPart1 = JSONStore.QueryPart()
        .between('notActive', [0.0, 1.0]);

      return JSONStore.get('customers').advancedFind([queryPart1]);
    })

    .then(function(data) {
      deepEqual(data.length, 3, 'Result length number');

      if (data.length >= 3) {
        deepEqual(_.keys(data[0]).sort(), ['_id', 'json'].sort(), 'keys');

        deepEqual(data[0].json.active, true, 'active');
        deepEqual(data[0].json.notActive, false, 'not active');
        deepEqual(data[0].json.otherString, 'other1', 'other string');
        deepEqual(data[0].json.otherNumber, 1.1, 'other number');
        deepEqual(data[0].json.otherInteger, 1, 'other integer');

        deepEqual(data[1].json.active, true, 'active');
        deepEqual(data[1].json.notActive, false, 'not active');
        deepEqual(data[1].json.otherString, 'other2', 'other string');
        deepEqual(data[1].json.otherNumber, 2.1, 'other number');
        deepEqual(data[1].json.otherInteger, 2, 'other integer');

        deepEqual(data[2].json.active, true, 'active');
        deepEqual(data[2].json.notActive, false, 'not active');
        deepEqual(data[2].json.otherString, 'other3', 'other string');
        deepEqual(data[2].json.otherNumber, 3.1, 'other number');
        deepEqual(data[2].json.otherInteger, 3, 'other integer');
      }

      var queryPart1 = JSONStore.QueryPart()
        .between('notActive', [false, true]);

      return JSONStore.get('customers').advancedFind([queryPart1]);
    })

    .then(function(data) {
      deepEqual(data.length, 3, 'Result length bool');

      if (data.length >= 3) {
        deepEqual(_.keys(data[0]).sort(), ['_id', 'json'].sort(), 'keys');

        deepEqual(data[0].json.active, true, 'active');
        deepEqual(data[0].json.notActive, false, 'not active');
        deepEqual(data[0].json.otherString, 'other1', 'other string');
        deepEqual(data[0].json.otherNumber, 1.1, 'other number');
        deepEqual(data[0].json.otherInteger, 1, 'other integer');

        deepEqual(data[1].json.active, true, 'active');
        deepEqual(data[1].json.notActive, false, 'not active');
        deepEqual(data[1].json.otherString, 'other2', 'other string');
        deepEqual(data[1].json.otherNumber, 2.1, 'other number');
        deepEqual(data[1].json.otherInteger, 2, 'other integer');

        deepEqual(data[2].json.active, true, 'active');
        deepEqual(data[2].json.notActive, false, 'not active');
        deepEqual(data[2].json.otherString, 'other3', 'other string');
        deepEqual(data[2].json.otherNumber, 3.1, 'other number');
        deepEqual(data[2].json.otherInteger, 3, 'other integer');
      }

      start();
    })

    .fail(function(err) {
      ok(false, err.toString());
      start();
    });
  });

  asyncTest('Not Between Type Safety Test', 7, function() {

    var collections = {
      customers: {
        searchFields: {
          active: 'boolean',
          notActive: 'boolean',
          otherString: 'string',
          otherNumber: 'number',
          otherInteger: 'integer'
        }
      }
    };

    var data = [{
      active: true,
      notActive: false,
      otherString: 'other1',
      otherNumber: 1.1,
      otherInteger: 1
    }, {
      active: true,
      notActive: false,
      otherString: 'other2',
      otherNumber: 2.1,
      otherInteger: 2
    }, {
      active: true,
      notActive: false,
      otherString: 'other3',
      otherNumber: 3.1,
      otherInteger: 3
    }];

    JSONStore.destroy()

    .then(function(res) {
      deepEqual(res, 0, 'destroy');
      return JSONStore.init(collections);
    })

    .then(function(res) {
      deepEqual(res.customers.name, 'customers');
      return JSONStore.get('customers').add(data);
    })

    .then(function(res) {
      deepEqual(res, 3, 'Add');
      var queryPart1 = JSONStore.QueryPart()
        .notBetween('notActive', ['0', '1']);

      return JSONStore.get('customers').advancedFind([queryPart1]);

    })

    .then(function(data) {
      deepEqual(data.length, 0, 'Result length string');

      var queryPart1 = JSONStore.QueryPart()
        .notBetween('notActive', [0, 1]);

      return JSONStore.get('customers').advancedFind([queryPart1]);
    })

    .then(function(data) {
      deepEqual(data.length, 0, 'Result length int');

      var queryPart1 = JSONStore.QueryPart()
        .notBetween('notActive', [0.0, 1.0]);

      return JSONStore.get('customers').advancedFind([queryPart1]);
    })

    .then(function(data) {
      deepEqual(data.length, 0, 'Result length number');

      var queryPart1 = JSONStore.QueryPart()
        .notBetween('notActive', [false, true]);

      return JSONStore.get('customers').advancedFind([queryPart1]);
    })

    .then(function(data) {
      deepEqual(data.length, 0, 'Result length bool');
      start();
    })

    .fail(function(err) {
      ok(false, err.toString());
      start();
    });
  });

  asyncTest('Between more than 2 in range', 9, function() {

    var collections = {
      customers: {
        searchFields: {
          name: 'string',
          age: 'integer'
        }
      }
    };

    var data = [{
      name: 'carlos',
      age: 1
    }, {
      name: 'dgonz',
      age: 2
    }, {
      name: 'jeff',
      age: 2
    }, {
      name: 'mike',
      age: 3
    }, {
      name: 'nana',
      age: 4
    }];

    JSONStore.destroy()

    .then(function(res) {
      deepEqual(res, 0, 'destroy');
      return JSONStore.init(collections);
    })

    .then(function(res) {
      deepEqual(res.customers.name, 'customers');
      return JSONStore.get('customers').add(data);
    })

    .then(function(res) {
      deepEqual(res, 5, 'add');

      var queryPart1 = JSONStore.QueryPart()
        .between('age', [1, 2, 3]);

      return JSONStore.get('customers').advancedFind([queryPart1]);

    })

    .then(function(data) {
      //Returns 5 because we ignore the invalid between array since it has more than 2 items
      deepEqual(data.length, 5, 'Result length');
      if (data.length === 5) {
        deepEqual(data[0].json.name, 'carlos', 'Result element test Dgonz');
        deepEqual(data[1].json.name, 'dgonz', 'Result element test Jeff');
        deepEqual(data[2].json.name, 'jeff', 'Result element test Mike');
        deepEqual(data[3].json.name, 'mike', 'Result element test Nana');
        deepEqual(data[4].json.name, 'nana', 'Result element test Nana');
      }
      start();
    })

    .fail(function(err) {
      ok(false, err.toString());
      start();
    });
  });

  asyncTest('Not Between more than 2 in range', 9, function() {

    var collections = {
      customers: {
        searchFields: {
          name: 'string',
          age: 'integer'
        }
      }
    };

    var data = [{
      name: 'carlos',
      age: 1
    }, {
      name: 'dgonz',
      age: 2
    }, {
      name: 'jeff',
      age: 2
    }, {
      name: 'mike',
      age: 3
    }, {
      name: 'nana',
      age: 4
    }];

    JSONStore.destroy()

    .then(function(res) {
      deepEqual(res, 0, 'destroy');
      return JSONStore.init(collections);
    })

    .then(function(res) {
      deepEqual(res.customers.name, 'customers');
      return JSONStore.get('customers').add(data);
    })

    .then(function(res) {
      deepEqual(res, 5, 'add');

      var queryPart1 = JSONStore.QueryPart()
        .notBetween('age', [1, 2, 3]);

      return JSONStore.get('customers').advancedFind([queryPart1]);

    })

    .then(function(data) {
      //Returns 5 because we ignore the invalid between array since it has more than 2 items
      deepEqual(data.length, 5, 'Result length');
      if (data.length === 5) {
        deepEqual(data[0].json.name, 'carlos', 'Result element test Dgonz');
        deepEqual(data[1].json.name, 'dgonz', 'Result element test Jeff');
        deepEqual(data[2].json.name, 'jeff', 'Result element test Mike');
        deepEqual(data[3].json.name, 'mike', 'Result element test Nana');
        deepEqual(data[4].json.name, 'nana', 'Result element test Nana');
      }
      start();
    })

    .fail(function(err) {
      ok(false, err.toString());
      start();
    });
  });

  asyncTest('Between less than 2 in range', 9, function() {

    var collections = {
      customers: {
        searchFields: {
          name: 'string',
          age: 'integer'
        }
      }
    };

    var data = [{
      name: 'carlos',
      age: 1
    }, {
      name: 'dgonz',
      age: 2
    }, {
      name: 'jeff',
      age: 2
    }, {
      name: 'mike',
      age: 3
    }, {
      name: 'nana',
      age: 4
    }];

    JSONStore.destroy()

    .then(function(res) {
      deepEqual(res, 0, 'destroy');
      return JSONStore.init(collections);
    })

    .then(function(res) {
      deepEqual(res.customers.name, 'customers');
      return JSONStore.get('customers').add(data);
    })

    .then(function(res) {
      deepEqual(res, 5, 'add');

      var queryPart1 = JSONStore.QueryPart()
        .between('age', [1]);

      return JSONStore.get('customers').advancedFind([queryPart1]);

    })

    .then(function(data) {
      //Returns 5 because we ignore the invalid between array since it has more than 2 items
      deepEqual(data.length, 5, 'Result length');
      if (data.length === 5) {
        deepEqual(data[0].json.name, 'carlos', 'Result element test Dgonz');
        deepEqual(data[1].json.name, 'dgonz', 'Result element test Jeff');
        deepEqual(data[2].json.name, 'jeff', 'Result element test Mike');
        deepEqual(data[3].json.name, 'mike', 'Result element test Nana');
        deepEqual(data[4].json.name, 'nana', 'Result element test Nana');
      }
      start();
    })

    .fail(function(err) {
      ok(false, err.toString());
      start();
    });
  });

  asyncTest('Not Between less than 2 in range', 9, function() {

    var collections = {
      customers: {
        searchFields: {
          name: 'string',
          age: 'integer'
        }
      }
    };

    var data = [{
      name: 'carlos',
      age: 1
    }, {
      name: 'dgonz',
      age: 2
    }, {
      name: 'jeff',
      age: 2
    }, {
      name: 'mike',
      age: 3
    }, {
      name: 'nana',
      age: 4
    }];

    JSONStore.destroy()

    .then(function(res) {
      deepEqual(res, 0, 'destroy');
      return JSONStore.init(collections);
    })

    .then(function(res) {
      deepEqual(res.customers.name, 'customers');
      return JSONStore.get('customers').add(data);
    })

    .then(function(res) {
      deepEqual(res, 5, 'add');

      var queryPart1 = JSONStore.QueryPart()
        .notBetween('age', [1]);

      return JSONStore.get('customers').advancedFind([queryPart1]);

    })

    .then(function(data) {
      //Returns 5 because we ignore the invalid between array since it has more than 2 items
      deepEqual(data.length, 5, 'Result length');
      if (data.length === 5) {
        deepEqual(data[0].json.name, 'carlos', 'Result element test Dgonz');
        deepEqual(data[1].json.name, 'dgonz', 'Result element test Jeff');
        deepEqual(data[2].json.name, 'jeff', 'Result element test Mike');
        deepEqual(data[3].json.name, 'mike', 'Result element test Nana');
        deepEqual(data[4].json.name, 'nana', 'Result element test Nana');
      }
      start();
    })

    .fail(function(err) {
      ok(false, err.toString());
      start();
    });
  });

  asyncTest('Inside with boolean', 16, function() {

    var collections = {
      customers: {
        searchFields: {
          name: 'string',
          age: 'integer',
          ssn: 'integer',
          active: 'boolean'
        }
      }
    };

    var data = [{
      name: 'carlos',
      age: 1,
      ssn: 12,
      active: true
    }, {
      name: 'dgonz',
      age: 2,
      ssn: 345,
      active: false
    }, {
      name: 'jeff',
      age: 2,
      ssn: 56
    }, {
      name: 'mike',
      age: 3,
      ssn: 789
    }, {
      name: 'nana',
      age: 4,
      ssn: 91
    }];

    JSONStore.destroy()

    .then(function(res) {
      deepEqual(res, 0, 'destroy');
      return JSONStore.init(collections);
    })

    .then(function(res) {
      deepEqual(res.customers.name, 'customers');
      return JSONStore.get('customers').add(data);
    })

    .then(function(res) {
      deepEqual(res, 5, 'add');

      var queryPart1 = JSONStore.QueryPart()
        .inside('active', ['true', 'false', 'zero', 'one']);

      return JSONStore.get('customers').advancedFind([queryPart1]);

    })

    .then(function(data) {
      deepEqual(data.length, 0, 'Result length string true');

      var queryPart1 = JSONStore.QueryPart()
        .inside('active', [0, 1]);

      return JSONStore.get('customers').advancedFind([queryPart1]);
    })

    .then(function(data) {
      deepEqual(data.length, 2, 'Result length number zero');

      if (data.length >= 2) {
        deepEqual(data[0].json.name, 'carlos', 'check name');
        deepEqual(data[1].json.name, 'dgonz', 'check name');
      }

      var queryPart1 = JSONStore.QueryPart()
        .inside('active', ['0', '1']);

      return JSONStore.get('customers').advancedFind([queryPart1]);
    })

    .then(function(data) {
      deepEqual(data.length, 2, 'Result length string zero');

      if (data.length >= 2) {
        deepEqual(data[0].json.name, 'carlos', 'check name');
        deepEqual(data[1].json.name, 'dgonz', 'check name');
      }

      var queryPart1 = JSONStore.QueryPart()
        .inside('active', [true, false]);

      return JSONStore.get('customers').advancedFind([queryPart1]);
    })

    .then(function(data) {
      deepEqual(data.length, 2, 'Result length string zero');

      if (data.length >= 2) {
        deepEqual(data[0].json.name, 'carlos', 'check name');
        deepEqual(data[1].json.name, 'dgonz', 'check name');
      }

      var queryPart1 = JSONStore.QueryPart()
        .inside('active', [0.0, 1.0]);

      return JSONStore.get('customers').advancedFind([queryPart1]);
    })

    .then(function(data) {
      deepEqual(data.length, 2, 'Result length string zero');

      if (data.length >= 2) {
        deepEqual(data[0].json.name, 'carlos', 'check name');
        deepEqual(data[1].json.name, 'dgonz', 'check name');
      }

      start();
    })

    .fail(function(err) {
      ok(false, err.toString());
      start();
    });
  });

  asyncTest('Inside with no parameters', 4, function() {

    var collections = {
      customers: {
        searchFields: {
          name: 'string',
          age: 'integer',
          ssn: 'integer',
          active: 'boolean'
        }
      }
    };

    var data = [{
      name: 'carlos',
      age: 1,
      ssn: 12,
      active: true
    }, {
      name: 'dgonz',
      age: 2,
      ssn: 345,
      active: false
    }, {
      name: 'jeff',
      age: 2,
      ssn: 56
    }, {
      name: 'mike',
      age: 3,
      ssn: 789
    }, {
      name: 'nana',
      age: 4,
      ssn: 91
    }];

    JSONStore.destroy()

    .then(function(res) {
      deepEqual(res, 0, 'destroy');
      return JSONStore.init(collections);
    })

    .then(function(res) {
      deepEqual(res.customers.name, 'customers', 'init');
      return JSONStore.get('customers').add(data);
    })

    .then(function(res) {
      deepEqual(res, 5, 'add');

      var queryPart1 = JSONStore.QueryPart()
        .inside('active', []);

      return JSONStore.get('customers').advancedFind([queryPart1]);

    })

    .then(function(data) {
      deepEqual(data.length, 0, 'Result length string true');

      start();
    })

    .fail(function(err) {
      ok(false, err.toString());
      start();
    });
  });


/*****  ***/


asyncTest('Find Empty Object', 4, function() {

    var collections = {
      customers: {
        searchFields: {
          name: 'string',
          age: 'integer'
        }
      }
    };

    var data = [{
      name: 'carlos',
      age: 1
    }, {
      name: 'dgonz',
      age: 2
    }, {
      name: 'jeff',
      age: 2
    }, {
      name: 'mike',
      age: 3
    }, {
      name: 'nana',
      age: 4
    }];

    JSONStore.destroy()

    .then(function(res) {
      deepEqual(res, 0, 'destroy');
      return JSONStore.init(collections);
    })

    .then(function(res) {
      deepEqual(res.customers.name, 'customers');
      return JSONStore.get('customers').add(data);
    })

    .then(function(res) {
    deepEqual(res, 5, 'added');
      var query = {};

      return JSONStore.get('customers').find(query);

    })

    .then(function(data) {
      deepEqual(data.length, 5, 'Result length');
      start();
    })

    .fail(function(err) {
      ok(false, err.toString());
      start();
    });
  });

  
asyncTest('Find Empty Array', 4, function() {

    var collections = {
      customers: {
        searchFields: {
          name: 'string',
          age: 'integer'
        }
      }
    };

    var data = [{
      name: 'carlos',
      age: 1
    }, {
      name: 'dgonz',
      age: 2
    }, {
      name: 'jeff',
      age: 2
    }, {
      name: 'mike',
      age: 3
    }, {
      name: 'nana',
      age: 4
    }];

    JSONStore.destroy()

    .then(function(res) {
      deepEqual(res, 0, 'destroy');
      return JSONStore.init(collections);
    })

    .then(function(res) {
      deepEqual(res.customers.name, 'customers');
      return JSONStore.get('customers').add(data);
    })

    .then(function(res) {
    deepEqual(res, 5, 'added');
      var query = [];

      return JSONStore.get('customers').find(query);

    })

    .then(function(data) {
      deepEqual(data.length, 0, 'Result length');
      start();
    })

    .fail(function(err) {
      ok(false, err.toString());
      start();
    });
  });

  
asyncTest('Find Empty Array with Empty Object', 4, function() {

    var collections = {
      customers: {
        searchFields: {
          name: 'string',
          age: 'integer'
        }
      }
    };

    var data = [{
      name: 'carlos',
      age: 1
    }, {
      name: 'dgonz',
      age: 2
    }, {
      name: 'jeff',
      age: 2
    }, {
      name: 'mike',
      age: 3
    }, {
      name: 'nana',
      age: 4
    }];

    JSONStore.destroy()

    .then(function(res) {
      deepEqual(res, 0, 'destroy');
      return JSONStore.init(collections);
    })

    .then(function(res) {
      deepEqual(res.customers.name, 'customers');
      return JSONStore.get('customers').add(data);
    })

    .then(function(res) {
    deepEqual(res, 5, 'added');
      var query = [{}];

      return JSONStore.get('customers').find(query);

    })

    .then(function(data) {
      deepEqual(data.length, 5, 'Result length');
      start();
    })

    .fail(function(err) {
      ok(false, err.toString());
      start();
    });
  });

asyncTest('Advanced Find Empty Object', 4, function() {

    var collections = {
      customers: {
        searchFields: {
          name: 'string',
          age: 'integer'
        }
      }
    };

    var data = [{
      name: 'carlos',
      age: 1
    }, {
      name: 'dgonz',
      age: 2
    }, {
      name: 'jeff',
      age: 2
    }, {
      name: 'mike',
      age: 3
    }, {
      name: 'nana',
      age: 4
    }];

    JSONStore.destroy()

    .then(function(res) {
      deepEqual(res, 0, 'destroy');
      return JSONStore.init(collections);
    })

    .then(function(res) {
      deepEqual(res.customers.name, 'customers');
      return JSONStore.get('customers').add(data);
    })

    .then(function(res) {
      deepEqual(res, 5, 'added');
      var query = {};

      return JSONStore.get('customers').advancedFind(query);

    })

    .then(function(data) {
      deepEqual(data.length, 5, 'Result length');
      start();
    })

    .fail(function(err) {
      ok(false, err.toString());
      start();
    });
  });

  
asyncTest('Advanced Find Empty Array', 4, function() {

    var collections = {
      customers: {
        searchFields: {
          name: 'string',
          age: 'integer'
        }
      }
    };

    var data = [{
      name: 'carlos',
      age: 1
    }, {
      name: 'dgonz',
      age: 2
    }, {
      name: 'jeff',
      age: 2
    }, {
      name: 'mike',
      age: 3
    }, {
      name: 'nana',
      age: 4
    }];

    JSONStore.destroy()

    .then(function(res) {
      deepEqual(res, 0, 'destroy');
      return JSONStore.init(collections);
    })

    .then(function(res) {
      deepEqual(res.customers.name, 'customers');
      return JSONStore.get('customers').add(data);
    })

    .then(function(res) {
      deepEqual(res, 5, 'added');
      var query = [];

      return JSONStore.get('customers').advancedFind(query);

    })

    .then(function(data) {
      deepEqual(data.length, 5, 'Result length');
      start();
    })

    .fail(function(err) {
      ok(false, err.toString());
      start();
    });
  });

  
asyncTest('Advanced Find Empty Array with Empty Object', 4, function() {

    var collections = {
      customers: {
        searchFields: {
          name: 'string',
          age: 'integer'
        }
      }
    };

    var data = [{
      name: 'carlos',
      age: 1
    }, {
      name: 'dgonz',
      age: 2
    }, {
      name: 'jeff',
      age: 2
    }, {
      name: 'mike',
      age: 3
    }, {
      name: 'nana',
      age: 4
    }];

    JSONStore.destroy()

    .then(function(res) {
      deepEqual(res, 0, 'destroy');
      return JSONStore.init(collections);
    })

    .then(function(res) {
      deepEqual(res.customers.name, 'customers');
      return JSONStore.get('customers').add(data);
    })

    .then(function(res) {
      deepEqual(res, 5, 'added');
      var query = [{}];

      return JSONStore.get('customers').advancedFind(query);

    })

    .then(function(data) {
      deepEqual(data.length, 5, 'Result length');
      start();
    })

    .fail(function(err) {
      ok(false, err.toString());
      start();
    });
  });



})();
