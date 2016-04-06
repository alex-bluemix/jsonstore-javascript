var WL = WL || {};
//When running on Windows 8 environments, we load qunit metro instead.
if (WL && WL.Client && WL.Client.getEnvironment && WL.Environment && WL.Environment.WINDOWS8 && (WL.Client.getEnvironment() === WL.Environment.WINDOWS8) ) {

/**
   * QUnit-Metro v0.4.0 - A Unit Testing Framework based on QUnit for WinJS Metro applications
   *
   * http://qunitmetro.github.com
   *
   * QUnitMetro
   * Copyright (c) 2012 Jeffrey T. Fritz, Jason A. Worley
   * Dual licensed under the MIT (MIT-LICENSE.txt)
   * or GPL (GPL-LICENSE.txt) licenses.
   *
   * Based on QUnit
   * Copyright (c) 2012 John Resig, Jörn Zaefferer
   * Dual licensed under the MIT (MIT-LICENSE.txt)
   * or GPL (GPL-LICENSE.txt) licenses.
   */

  // Metro startup
  (function () {

      // Define namespace to connect to AppBar
      WinJS.Namespace.define("QUnitMetro", {

          runTests: WinJS.Utilities.markSupportedForProcessing(function () {
              QUnit.start();
              var contain = document.getElementById("unitTestContainer");
              if (contain) {
                  contain.style.display = "block";
              }
          }),

          closeResults: WinJS.Utilities.markSupportedForProcessing(function () {
              var contain = document.getElementById("unitTestContainer");
              if (contain) {
                  contain.style.display = "none";
              }
          }),

          autoLoadTests: function (e) {
              var re = new RegExp("([^/]+\.html$)");
              var testUrl = e.detail.location.replace(re, QUnit.config.unitTestFileName);

              if (!QUnit.id(testUrl)) {
                  var scriptEl = document.createElement("script");
                  scriptEl.setAttribute("id", testUrl);
                  scriptEl.setAttribute("src", testUrl);
                  document.head.appendChild(scriptEl);
              }
          }

      });

      var app = WinJS.Application;
      var activation = Windows.ApplicationModel.Activation;

      app.addEventListener("activated", function (args) {
          if (args.detail.kind == activation.ActivationKind.launch) {
              if (QUnit.config.buildResultsUI &&
                  !document.getElementById("unitTestContainer")) {
                  var container = document.createElement("div");
                  container.setAttribute("id", "unitTestContainer");
                  container.innerHTML = window.toStaticHTML("<div id='qunit'/><div id='qunit-fixture'/>");
                  var closeBtn = document.createElement("button");
                  closeBtn.setAttribute("id", "closeTests");
                  closeBtn.textContent = "Close";
                  container.appendChild(closeBtn);
                  document.body.appendChild(container);
                  closeBtn.addEventListener("click", function () {
                      document.getElementById("unitTestContainer").style.display = "none";
                  });

                  var appBar = document.querySelector("[data-win-control='WinJS.UI.AppBar']");
                  if (!!appBar) {
                      var runBtn = document.createElement("button");
                      runBtn.setAttribute("data-win-control", "WinJS.UI.AppBarCommand");
                      runBtn.setAttribute("data-win-options", "{id:'runTestsAppBarCmd', label:'Run Tests', icon:'repair', section: 'global', onclick: QUnitMetro.runTests}");
                      appBar.appendChild(runBtn);
                  }
              }
              QUnit.load();
              args.setPromise(WinJS.UI.processAll());
          }
      });

      // Auto test loading
      WinJS.Navigation.addEventListener("navigated", QUnitMetro.autoLoadTests);

  })();

  (function (window) {

      var defined = {
          setTimeout: typeof window.setTimeout !== "undefined",
          sessionStorage: (function () {
              var x = "qunit-test-string";
              try {
                  sessionStorage.setItem(x, x);
                  sessionStorage.removeItem(x);
                  return true;
              } catch (e) {
                  return false;
              }
          }())
      };

      var testId = 0,
    toString = Object.prototype.toString,
    hasOwn = Object.prototype.hasOwnProperty;

      var Test = function (name, testName, expected, async, callback) {
          this.name = name;
          this.testName = testName;
          this.expected = expected;
          this.async = async;
          this.callback = callback;
          this.assertions = [];
          this.testId = ++Test.count;
      };

      Test.count = 0;

      Test.prototype = {
          init: function () {

              var tests = id("qunit-tests");
              if (tests) {
                  var b = document.createElement("strong");
                  b.innerHTML = window.toStaticHTML("Running " + this.name);
                  var li = document.createElement("li");
                  li.appendChild(b);
                  li.className = "running";
                  li.id = this.id = "test-output" + testId++;
                  tests.appendChild(li);
              }
          },
          setup: function () {
              if (this.module != config.previousModule) {
                  if (config.previousModule) {
                      runLoggingCallbacks('moduleDone', QUnit, {
                          name: config.previousModule,
                          failed: config.moduleStats.bad,
                          passed: config.moduleStats.all - config.moduleStats.bad,
                          total: config.moduleStats.all
                      });
                  }
                  config.previousModule = this.module;
                  config.moduleStats = { all: 0, bad: 0 };
                  runLoggingCallbacks('moduleStart', QUnit, {
                      name: this.module
                  });
              } else if (config.autorun) {
                  runLoggingCallbacks('moduleStart', QUnit, {
                      name: this.module
                  });
              }

              config.current = this;
              this.testEnvironment = extend({
                  setup: function () { },
                  teardown: function () { }
              }, this.moduleTestEnvironment);

              runLoggingCallbacks('testStart', QUnit, {
                  name: this.testName,
                  module: this.module,
                  id: this.testId
              });

              // allow utility functions to access the current test environment
              // TODO why??
              QUnit.current_testEnvironment = this.testEnvironment;

              if (!config.pollution) {
                  saveGlobal();
              }
              if (config.notrycatch) {
                  this.testEnvironment.setup.call(this.testEnvironment);
                  return;
              }
              try {
                  this.testEnvironment.setup.call(this.testEnvironment);
              } catch (e) {
                  QUnit.pushFailure("Setup failed on " + this.testName + ": " + e.message, extractStacktrace(e, 1));
              }

          },
          run: function () {
              config.current = this;

              var running = id("qunit-testresult");

              if (running) {
                  running.innerHTML = window.toStaticHTML("Running: <br/>" + this.name);
              }

              if (this.async) {
                  QUnit.stop();
              }

              if (config.notrycatch) {
                  this.callback.call(this.testEnvironment);
                  return;
              }
              try {
                  this.callback.call(this.testEnvironment);
              } catch (e) {
                  QUnit.pushFailure("Died on test #" + (this.assertions.length + 1) + ": " + e.message, extractStacktrace(e, 1));
                  // else next test will carry the responsibility
                  saveGlobal();

                  // Restart the tests if they're blocking
                  if (config.blocking) {
                      QUnit.start();
                  }
              }
          },
          teardown: function () {
              config.current = this;
              if (config.notrycatch) {
                  this.testEnvironment.teardown.call(this.testEnvironment);
                  return;
              } else {
                  try {
                      this.testEnvironment.teardown.call(this.testEnvironment);
                  } catch (e) {
                      QUnit.pushFailure("Teardown failed on " + this.testName + ": " + e.message, extractStacktrace(e, 1));
                  }
              }
              checkPollution();
          },
          finish: function () {
              config.current = this;
              if (this.expected != null && this.expected != this.assertions.length) {
                  QUnit.pushFailure("Expected " + this.expected + " assertions, but " + this.assertions.length + " were run");
              } else if (this.expected == null && !this.assertions.length) {
                  QUnit.pushFailure("Expected at least one assertion, but none were run - call expect(0) to accept zero assertions.");
              }

              var good = 0, bad = 0,
        li, i,
        tests = id("qunit-tests");

              config.stats.all += this.assertions.length;
              config.moduleStats.all += this.assertions.length;

              if (tests) {
                  var ol = document.createElement("ol");

                  for (i = 0; i < this.assertions.length; i++) {
                      var assertion = this.assertions[i];

                      li = document.createElement("li");
                      li.className = assertion.result ? "pass" : "fail";
                      li.innerHTML = window.toStaticHTML(assertion.message || (assertion.result ? "okay" : "failed"));
                      ol.appendChild(li);

                      if (assertion.result) {
                          good++;
                      } else {
                          bad++;
                          config.stats.bad++;
                          config.moduleStats.bad++;
                      }
                  }

                  // store result when possible
                  if (QUnit.config.reorder && defined.sessionStorage) {
                      if (bad) {
                          sessionStorage.setItem("qunit-test-" + this.module + "-" + this.testName, bad);
                      } else {
                          sessionStorage.removeItem("qunit-test-" + this.module + "-" + this.testName);
                      }
                  }

                  if (bad === 0) {
                      ol.style.display = "none";
                  }

                  var b = document.createElement("strong");
                  b.innerHTML = window.toStaticHTML(this.name + " <b class='counts'>(<b class='failed'>" + bad + "</b>, <b class='passed'>" + good + "</b>, " + this.assertions.length + ")</b>");

                  var a = document.createElement("a");
                  a.innerHTML = window.toStaticHTML("Rerun");
                  a.href = QUnit.url({ filter: getText([b]).replace(/\([^)]+\)$/, "").replace(/(^\s*|\s*$)/g, "") });

                  addEvent(a, "click", function (event) {
                      QUnit.stop();
                      QUnit.config.filter = getText([b]).replace(/\([^)]+\)$/, "").replace(/(^\s*|\s*$)/g, "");
                      QUnit.start();
                      event.preventDefault();
                      return false;
                  });

                  addEvent(b, "click", function () {
                      var next = b.nextSibling.nextSibling,
            display = next.style.display;
                      next.style.display = display === "none" ? "block" : "none";
                  });

                  addEvent(b, "dblclick", function (e) {
                      var target = e && e.target ? e.target : window.event.srcElement;
                      if (target.nodeName.toLowerCase() == "span" || target.nodeName.toLowerCase() == "b") {
                          target = target.parentNode;
                      }
                      QUnit.stop();
                      QUnit.config.filter = getText([b]).replace(/\([^)]+\)$/, "").replace(/(^\s*|\s*$)/g, "");
                      QUnit.start();
                  });

                  li = id(this.id);
                  li.className = bad ? "fail" : "pass";
                  li.removeChild(li.firstChild);
                  li.appendChild(b);
                  li.appendChild(a);
                  li.appendChild(ol);

              } else {
                  for (i = 0; i < this.assertions.length; i++) {
                      if (!this.assertions[i].result) {
                          bad++;
                          config.stats.bad++;
                          config.moduleStats.bad++;
                      }
                  }
              }

              QUnit.reset();

              runLoggingCallbacks('testDone', QUnit, {
                  name: this.testName,
                  module: this.module,
                  failed: bad,
                  id: this.testId,
                  passed: this.assertions.length - bad,
                  total: this.assertions.length
              });
          },

          queue: function () {
              var test = this;
              synchronize(function () {
                  test.init();
              });
              function run() {
                  // each of these can by async
                  synchronize(function () {
                      test.setup();
                  });
                  synchronize(function () {
                      test.run();
                  });
                  synchronize(function () {
                      test.teardown();
                  });
                  synchronize(function () {
                      test.finish();
                  });
              }
              // defer when previous test run passed, if storage is available
              var bad = QUnit.config.reorder && defined.sessionStorage && +sessionStorage.getItem("qunit-test-" + this.module + "-" + this.testName);
              if (bad) {
                  run();
              } else {
                  synchronize(run, true);
              }
          }

      };

      var QUnit = {

          // call on start of module test to prepend name to all tests
          module: function (name, testEnvironment) {
              config.currentModule = name;
              config.currentModuleTestEnviroment = testEnvironment;
          },

          asyncTest: function (testName, expected, callback) {
              if (arguments.length === 2) {
                  callback = expected;
                  expected = null;
              }

              QUnit.test(testName, expected, callback, true);
          },

          test: function (testName, expected, callback, async) {
              var name = '<span class="test-name">' + escapeInnerText(testName) + '</span>';

              if (arguments.length === 2) {
                  callback = expected;
                  expected = null;
              }

              if (config.currentModule) {
                  name = '<span class="module-name">' + config.currentModule + "</span>: " + name;
              }

              if (!validTest(config.currentModule + ": " + testName)) {
                  return;
              }

              var test = new Test(name, testName, expected, async, callback);
              test.module = config.currentModule;
              test.moduleTestEnvironment = config.currentModuleTestEnviroment;
              test.queue();
          },

          // Specify the number of expected assertions to gurantee that failed test (no assertions are run at all) don't slip through.
          expect: function (asserts) {
              config.current.expected = asserts;
          },

          // Asserts true.
          // @example ok( "asdfasdf".length > 5, "There must be at least 5 chars" );
          ok: function (result, msg) {
              if (!config.current) {
                  throw new Error("ok() assertion outside test context, was " + sourceFromStacktrace(2));
              }
              result = !!result;
              var details = {
                  result: result,
                  message: msg
              };
              msg = escapeInnerText(msg || (result ? "okay" : "failed"));
              if (!result) {
                  var source = sourceFromStacktrace(2);
                  if (source) {
                      details.source = source;
                      msg += '<table><tr class="test-source"><th>Source: </th><td><pre>' + escapeInnerText(source) + '</pre></td></tr></table>';
                  }
              }
              runLoggingCallbacks('log', QUnit, details);
              config.current.assertions.push({
                  result: result,
                  message: msg
              });
          },

          // Checks that the first two arguments are equal, with an optional message. Prints out both actual and expected values.
          // @example equal( format("Received {0} bytes.", 2), "Received 2 bytes." );
          equal: function (actual, expected, message) {
              QUnit.push(expected == actual, actual, expected, message);
          },

          notEqual: function (actual, expected, message) {
              QUnit.push(expected != actual, actual, expected, message);
          },

          deepEqual: function (actual, expected, message) {
              QUnit.push(QUnit.equiv(actual, expected), actual, expected, message);
          },

          notDeepEqual: function (actual, expected, message) {
              QUnit.push(!QUnit.equiv(actual, expected), actual, expected, message);
          },

          strictEqual: function (actual, expected, message) {
              QUnit.push(expected === actual, actual, expected, message);
          },

          notStrictEqual: function (actual, expected, message) {
              QUnit.push(expected !== actual, actual, expected, message);
          },

          raises: function (block, expected, message) {
              var actual, ok = false;

              if (typeof expected === 'string') {
                  message = expected;
                  expected = null;
              }

              try {
                  block.call(config.current.testEnvironment);
              } catch (e) {
                  actual = e;
              }

              if (actual) {
                  // we don't want to validate thrown error
                  if (!expected) {
                      ok = true;
                      // expected is a regexp
                  } else if (QUnit.objectType(expected) === "regexp") {
                      ok = expected.test(actual);
                      // expected is a constructor
                  } else if (actual instanceof expected) {
                      ok = true;
                      // expected is a validation function which returns true is validation passed
                  } else if (expected.call({}, actual) === true) {
                      ok = true;
                  }
              }

              QUnit.ok(ok, message);
          },

          start: function (count) {
              config.semaphore -= count || 1;
              if (config.semaphore > 0) {
                  // don't start until equal number of stop-calls
                  return;
              }
              if (config.semaphore < 0) {
                  // ignore if start is called more often then stop
                  config.semaphore = 0;
              }
              // A slight delay, to avoid any current callbacks
              if (defined.setTimeout) {
                  window.setTimeout(function () {
                      if (config.semaphore > 0) {
                          return;
                      }
                      if (config.timeout) {
                          clearTimeout(config.timeout);
                      }

                      config.blocking = false;
                      process(true);
                  }, 13);
              } else {
                  config.blocking = false;
                  process(true);
              }
          },

          stop: function (count) {
              config.semaphore += count || 1;
              config.blocking = true;

              if (config.testTimeout && defined.setTimeout) {
                  clearTimeout(config.timeout);
                  config.timeout = window.setTimeout(function () {
                      QUnit.ok(false, "Test timed out");
                      config.semaphore = 1;
                      QUnit.start();
                  }, config.testTimeout);
              }
          }
      };

      //We want access to the constructor's prototype
      (function () {
          function F() { }
          F.prototype = QUnit;
          QUnit = new F();
          //Make F QUnit's constructor so that we can add to the prototype later
          QUnit.constructor = F;
      }());

      // deprecated; still export them to window to provide clear error messages
      // next step: remove entirely
      QUnit.equals = function () {
          QUnit.push(false, false, false, "QUnit.equals has been deprecated since 2009 (e88049a0), use QUnit.equal instead");
      };
      QUnit.same = function () {
          QUnit.push(false, false, false, "QUnit.same has been deprecated since 2009 (e88049a0), use QUnit.deepEqual instead");
      };

      // Maintain internal state
      var config = {
          // The queue of tests to run
          queue: [],

          // block until document ready
          blocking: true,

          // when enabled, show only failing tests
          // gets persisted through sessionStorage and can be changed in UI via checkbox
          hidepassed: false,

          // by default, run previously failed tests first
          // very useful in combination with "Hide passed tests" checked
          reorder: true,

          // by default, modify document.title when suite is done
          altertitle: true,

          // by default, build the DOM elements to display test results
          buildResultsUI: true,

          // by default, the name of the unitTest script file
          unitTestFileName: "test.js",

          urlConfig: ['noglobals', 'notrycatch'],

          //logging callback queues
          begin: [],
          done: [],
          log: [],
          testStart: [],
          testDone: [],
          moduleStart: [],
          moduleDone: []
      };

      // Load paramaters
      (function () {

          var location = window.location || { search: "", protocol: "file:" },
      params = location.search.slice(1).split("&"),
      length = params.length,
      urlParams = {},
      current;

          if (params[0]) {
              for (var i = 0; i < length; i++) {
                  current = params[i].split("=");
                  current[0] = decodeURIComponent(current[0]);
                  // allow just a key to turn on a flag, e.g., test.html?noglobals
                  current[1] = current[1] ? decodeURIComponent(current[1]) : true;
                  urlParams[current[0]] = current[1];
              }
          }

          QUnit.urlParams = urlParams;
          config.filter = urlParams.filter;

          // Figure out if we're running the tests from a server or not
          QUnit.isLocal = location.protocol === 'file:';


      }());

      // Expose the API as global variables, unless an 'exports'
      // object exists, in that case we assume we're in CommonJS - export everything at the end
      if (typeof exports === "undefined" || typeof require === "undefined") {
          extend(window, QUnit);
          window.QUnit = QUnit;
      }

      // define these after exposing globals to keep them in these QUnit namespace only
      extend(QUnit, {
          config: config,

          // Initialize the configuration options
          init: function () {
              extend(config, {
                  stats: { all: 0, bad: 0 },
                  moduleStats: { all: 0, bad: 0 },
                  started: +new Date(),
                  updateRate: 1000,
                  blocking: false,
                  autostart: false,
                  autorun: false,
                  filter: "",
                  queue: [],
                  semaphore: 0
              });

              Test.count = 0;

              var qunit = id("qunit");

              if (qunit) {
                  qunit.innerHTML = window.toStaticHTML(
          '<h1 id="qunit-header">' + escapeInnerText(document.title) + '</h1>' +
          '<h2 id="qunit-banner"></h2>' +
          '<div id="qunit-testrunner-toolbar"></div>' +
          '<h2 id="qunit-userAgent"></h2>' +
          '<ol id="qunit-tests"></ol>');
              }

              var tests = id("qunit-tests"),
        banner = id("qunit-banner"),
        result = id("qunit-testresult");

              if (tests) {
                  tests.innerHTML = window.toStaticHTML("");
              }

              if (banner) {
                  banner.className = "";
              }

              if (result) {
                  result.parentNode.removeChild(result);
              }

              if (tests) {
                  result = document.createElement("p");
                  result.id = "qunit-testresult";
                  result.className = "result";
                  tests.parentNode.insertBefore(result, tests);
                  result.innerHTML = window.toStaticHTML('Running...<br/>&nbsp;');
              }
          },

          // Resets the test setup. Useful for tests that modify the DOM.
          // If jQuery is available, uses jQuery's html(), otherwise just innerHTML.
          reset: function () {
              if (window.jQuery) {
                  jQuery("#qunit-fixture").html(config.fixture);
              } else {
                  var main = id('qunit-fixture');
                  if (main) {
                      main.innerHTML = window.toStaticHTML(config.fixture);
                  }
              }
          },

          // Trigger an event on an element.
          // @example triggerEvent( document.body, "click" );
          triggerEvent: function (elem, type, event) {
              if (document.createEvent) {
                  event = document.createEvent("MouseEvents");
                  event.initMouseEvent(type, true, true, elem.ownerDocument.defaultView,
          0, 0, 0, 0, 0, false, false, false, false, 0, null);
                  elem.dispatchEvent(event);

              } else if (elem.fireEvent) {
                  elem.fireEvent("on" + type);
              }
          },

          // Safe object type checking
          is: function (type, obj) {
              return QUnit.objectType(obj) == type;
          },

          objectType: function (obj) {
              if (typeof obj === "undefined") {
                  return "undefined";

                  // consider: typeof null === object
              }
              if (obj === null) {
                  return "null";
              }

              var type = toString.call(obj).match(/^\[object\s(.*)\]$/)[1] || '';

              switch (type) {
                  case 'Number':
                      if (isNaN(obj)) {
                          return "nan";
                      }
                      return "number";
                  case 'String':
                  case 'Boolean':
                  case 'Array':
                  case 'Date':
                  case 'RegExp':
                  case 'Function':
                      return type.toLowerCase();
              }
              if (typeof obj === "object") {
                  return "object";
              }
              return undefined;
          },

          push: function (result, actual, expected, message) {
              if (!config.current) {
                  throw new Error("assertion outside test context, was " + sourceFromStacktrace());
              }
              var details = {
                  result: result,
                  message: message,
                  actual: actual,
                  expected: expected
              };

              message = escapeInnerText(message) || (result ? "okay" : "failed");
              message = '<span class="test-message">' + message + "</span>";
              var output = message;
              if (!result) {
                  expected = escapeInnerText(QUnit.jsDump.parse(expected));
                  actual = escapeInnerText(QUnit.jsDump.parse(actual));
                  output += '<table><tr class="test-expected"><th>Expected: </th><td><pre>' + expected + '</pre></td></tr>';
                  if (actual != expected) {
                      output += '<tr class="test-actual"><th>Result: </th><td><pre>' + actual + '</pre></td></tr>';
                      output += '<tr class="test-diff"><th>Diff: </th><td><pre>' + QUnit.diff(expected, actual) + '</pre></td></tr>';
                  }
                  var source = sourceFromStacktrace();
                  if (source) {
                      details.source = source;
                      output += '<tr class="test-source"><th>Source: </th><td><pre>' + escapeInnerText(source) + '</pre></td></tr>';
                  }
                  output += "</table>";
              }

              runLoggingCallbacks('log', QUnit, details);

              config.current.assertions.push({
                  result: !!result,
                  message: output
              });
          },

          pushFailure: function (message, source) {
              var details = {
                  result: false,
                  message: message
              };
              var output = escapeInnerText(message);
              if (source) {
                  details.source = source;
                  output += '<table><tr class="test-source"><th>Source: </th><td><pre>' + escapeInnerText(source) + '</pre></td></tr></table>';
              }
              runLoggingCallbacks('log', QUnit, details);
              config.current.assertions.push({
                  result: false,
                  message: output
              });
          },

          url: function (params) {
              params = extend(extend({}, QUnit.urlParams), params);
              var querystring = "?",
        key;
              for (key in params) {
                  if (!hasOwn.call(params, key)) {
                      continue;
                  }
                  querystring += encodeURIComponent(key) + "=" +
          encodeURIComponent(params[key]) + "&";
              }
              return window.location.pathname + querystring.slice(0, -1);
          },

          extend: extend,
          id: id,
          addEvent: addEvent
      });

      //QUnit.constructor is set to the empty F() above so that we can add to it's prototype later
      //Doing this allows us to tell if the following methods have been overwritten on the actual
      //QUnit object, which is a deprecated way of using the callbacks.
      extend(QUnit.constructor.prototype, {
          // Logging callbacks; all receive a single argument with the listed properties
          // run test/logs.html for any related changes
          begin: registerLoggingCallback('begin'),
          // done: { failed, passed, total, runtime }
          done: registerLoggingCallback('done'),
          // log: { result, actual, expected, message }
          log: registerLoggingCallback('log'),
          // testStart: { name }
          testStart: registerLoggingCallback('testStart'),
          // testDone: { name, failed, passed, total }
          testDone: registerLoggingCallback('testDone'),
          // moduleStart: { name }
          moduleStart: registerLoggingCallback('moduleStart'),
          // moduleDone: { name, failed, passed, total }
          moduleDone: registerLoggingCallback('moduleDone')
      });

      if (typeof document === "undefined" || document.readyState === "complete") {
          // config.autorun = true;
      }

      QUnit.load = function () {
          runLoggingCallbacks('begin', QUnit, {});

          // Initialize the config, saving the execution queue
          var oldconfig = extend({}, config);
          QUnit.init();
          extend(config, oldconfig);

          config.blocking = false;

          var urlConfigHtml = '', len = config.urlConfig.length;
          for (var i = 0, val; i < len; i++) {
              val = config.urlConfig[i];
              config[val] = QUnit.urlParams[val];
              urlConfigHtml += '<label><input id="' + val + '" type="checkbox"' + (config[val] ? ' checked="checked"' : '') + '>' + val + '</label>';
          }

          var userAgent = id("qunit-userAgent");
          if (userAgent) {
              userAgent.innerHTML = window.toStaticHTML(navigator.userAgent);
          }

          var banner = id("qunit-header");
          if (banner) {

              banner.innerHTML = window.toStaticHTML('<a href="' + QUnit.url({ filter: undefined }) + '"> ' + banner.innerHTML + '</a> ' + urlConfigHtml);
              addEvent(banner, "change", function (event) {
                  //var params = {};
                  //params[event.target.id] = event.target.checked ? true : undefined;
                  //window.location = QUnit.url(params);
                  QUnit.stop();
                  QUnit.config[event.target.id] = event.target.checked;
                  QUnit.start();
              });
              var appName = banner.getElementsByTagName("a")[0];
              addEvent(appName, "click", function (event) {
                  QUnit.stop();
                  QUnit.config.filter = "";
                  QUnit.start();
                  event.preventDefault();
                  return false;
              });
          }

          var toolbar = id("qunit-testrunner-toolbar");
          if (toolbar) {
              var filter = document.createElement("input");
              filter.type = "checkbox";
              filter.id = "qunit-filter-pass";
              addEvent(filter, "click", function () {
                  var ol = document.getElementById("qunit-tests");
                  if (filter.checked) {
                      ol.className = ol.className + " hidepass";
                  } else {
                      var tmp = " " + ol.className.replace(/[\n\t\r]/g, " ") + " ";
                      ol.className = tmp.replace(/ hidepass /, " ");
                  }
                  if (defined.sessionStorage) {
                      if (filter.checked) {
                          sessionStorage.setItem("qunit-filter-passed-tests", "true");
                      } else {
                          sessionStorage.removeItem("qunit-filter-passed-tests");
                      }
                  }
              });
              if (config.hidepassed || defined.sessionStorage && sessionStorage.getItem("qunit-filter-passed-tests")) {
                  filter.checked = true;
                  var ol = document.getElementById("qunit-tests");
                  ol.className = ol.className + " hidepass";
              }
              toolbar.appendChild(filter);

              var label = document.createElement("label");
              label.setAttribute("for", "qunit-filter-pass");
              label.innerHTML = window.toStaticHTML("Hide passed tests");
              toolbar.appendChild(label);
          }

          var main = id('qunit-fixture');
          if (main) {
              config.fixture = main.innerHTML;
          }

          if (config.autostart) {
              QUnit.start();
          }
      };

      //$().ready(QUnit.load);
      addEvent(window, "load", QUnit.load);

      // addEvent(window, "error") gives us a useless event object
      window.onerror = function (message, file, line) {
          if (QUnit.config.current) {
              QUnit.pushFailure(message, file + ":" + line);
          } else {
              QUnit.test("global failure", function () {
                  QUnit.pushFailure(message, file + ":" + line);
              });
          }
      };

      function done() {
          config.autorun = true;

          // Log the last module results
          if (config.currentModule) {
              runLoggingCallbacks('moduleDone', QUnit, {
                  name: config.currentModule,
                  failed: config.moduleStats.bad,
                  passed: config.moduleStats.all - config.moduleStats.bad,
                  total: config.moduleStats.all
              });
          }

          var banner = id("qunit-banner"),
      tests = id("qunit-tests"),
      runtime = +new Date() - config.started,
      passed = config.stats.all - config.stats.bad,
      html = [
        'Tests completed in ',
        runtime,
        ' milliseconds.<br/>',
        '<span class="passed">',
        passed,
        '</span> tests of <span class="total">',
        config.stats.all,
        '</span> passed, <span class="failed">',
        config.stats.bad,
        '</span> failed.'
      ].join('');

          if (banner) {
              banner.className = (config.stats.bad ? "qunit-fail" : "qunit-pass");
          }

          if (tests) {
              id("qunit-testresult").innerHTML = window.toStaticHTML(html);
          }

          if (config.altertitle && typeof document !== "undefined" && document.title) {
              // show ✖ for good, ✔ for bad suite result in title
              // use escape sequences in case file gets loaded with non-utf-8-charset
              document.title = [
        (config.stats.bad ? "\u2716" : "\u2714"),
        document.title.replace(/^[\u2714\u2716] /i, "")
              ].join(" ");
          }

          // clear own sessionStorage items if all tests passed
          if (config.reorder && defined.sessionStorage && config.stats.bad === 0) {
              var key;
              for (var i = 0; i < sessionStorage.length; i++) {
                  key = sessionStorage.key(i++);
                  if (key.indexOf("qunit-test-") === 0) {
                      sessionStorage.removeItem(key);
                  }
              }
          }

          runLoggingCallbacks('done', QUnit, {
              failed: config.stats.bad,
              passed: passed,
              total: config.stats.all,
              runtime: runtime
          });
      }

      function validTest(name) {
          var filter = config.filter,
      run = false;

          if (!filter) {
              return true;
          }

          var not = filter.charAt(0) === "!";
          if (not) {
              filter = filter.slice(1);
          }

          if (name.indexOf(filter) !== -1) {
              return !not;
          }

          if (not) {
              run = true;
          }

          return run;
      }

      // so far supports only Firefox, Chrome and Opera (buggy), Safari (for real exceptions)
      // Later Safari and IE10 are supposed to support error.stack as well
      // See also https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Error/Stack
      function extractStacktrace(e, offset) {
          offset = offset || 3;
          if (e.stacktrace) {
              // Opera
              return e.stacktrace.split("\n")[offset + 3];
          } else if (e.stack) {
              // Firefox, Chrome
              var stack = e.stack.split("\n");
              if (/^error$/i.test(stack[0])) {
                  stack.shift();
              }
              return stack[offset];
          } else if (e.sourceURL) {
              // Safari, PhantomJS
              // hopefully one day Safari provides actual stacktraces
              // exclude useless self-reference for generated Error objects
              if (/qunit.js$/.test(e.sourceURL)) {
                  return;
              }
              // for actual exceptions, this is useful
              return e.sourceURL + ":" + e.line;
          }
      }
      function sourceFromStacktrace(offset) {
          try {
              throw new Error();
          } catch (e) {
              return extractStacktrace(e, offset);
          }
      }

      function escapeInnerText(s) {
          if (!s) {
              return "";
          }
          s = s + "";
          return s.replace(/[\&<>]/g, function (s) {
              switch (s) {
                  case "&": return "&amp;";
                  case "<": return "&lt;";
                  case ">": return "&gt;";
                  default: return s;
              }
          });
      }

      function synchronize(callback, last) {
          config.queue.push(callback);

          if (config.autorun && !config.blocking) {
              process(last);
          }
      }

      function process(last) {
          function next() {
              process(last);
          }
          var start = new Date().getTime();
          config.depth = config.depth ? config.depth + 1 : 1;

          while (config.queue.length && !config.blocking) {
              if (!defined.setTimeout || config.updateRate <= 0 || ((new Date().getTime() - start) < config.updateRate)) {
                  config.queue.shift()();
              } else {
                  window.setTimeout(next, 13);
                  break;
              }
          }
          config.depth--;
          if (last && !config.blocking && !config.queue.length && config.depth === 0) {
              done();
          }
      }

      function saveGlobal() {
          config.pollution = [];

          if (config.noglobals) {
              for (var key in window) {
                  if (!hasOwn.call(window, key)) {
                      continue;
                  }
                  config.pollution.push(key);
              }
          }
      }

      function checkPollution(name) {
          var old = config.pollution;
          saveGlobal();

          var newGlobals = diff(config.pollution, old);
          if (newGlobals.length > 0) {
              QUnit.pushFailure("Introduced global variable(s): " + newGlobals.join(", "));
          }

          var deletedGlobals = diff(old, config.pollution);
          if (deletedGlobals.length > 0) {
              QUnit.pushFailure("Deleted global variable(s): " + deletedGlobals.join(", "));
          }
      }

      // returns a new Array with the elements that are in a but not in b
      function diff(a, b) {
          var result = a.slice();
          for (var i = 0; i < result.length; i++) {
              for (var j = 0; j < b.length; j++) {
                  if (result[i] === b[j]) {
                      result.splice(i, 1);
                      i--;
                      break;
                  }
              }
          }
          return result;
      }

      function extend(a, b) {
          for (var prop in b) {
              if (b[prop] === undefined) {
                  delete a[prop];

                  // Avoid "Member not found" error in IE8 caused by setting window.constructor
              } else if (prop !== "constructor" || a !== window) {
                  a[prop] = b[prop];
              }
          }

          return a;
      }

      function addEvent(elem, type, fn) {
          if (elem.addEventListener) {
              elem.addEventListener(type, fn, false);
          } else if (elem.attachEvent) {
              elem.attachEvent("on" + type, fn);
          } else {
              fn();
          }
      }

      function id(name) {
          return !!(typeof document !== "undefined" && document && document.getElementById) &&
      document.getElementById(name);
      }

      function registerLoggingCallback(key) {
          return function (callback) {
              config[key].push(callback);
          };
      }

      // Supports deprecated method of completely overwriting logging callbacks
      function runLoggingCallbacks(key, scope, args) {
          //debugger;
          var callbacks;
          if (QUnit.hasOwnProperty(key)) {
              QUnit[key].call(scope, args);
          } else {
              callbacks = config[key];
              for (var i = 0; i < callbacks.length; i++) {
                  callbacks[i].call(scope, args);
              }
          }
      }

      // Test for equality any JavaScript type.
      // Author: Philippe Rathé <prathe@gmail.com>
      QUnit.equiv = (function () {

          var innerEquiv; // the real equiv function
          var callers = []; // stack to decide between skip/abort functions
          var parents = []; // stack to avoiding loops from circular referencing

          // Call the o related callback with the given arguments.
          function bindCallbacks(o, callbacks, args) {
              var prop = QUnit.objectType(o);
              if (prop) {
                  if (QUnit.objectType(callbacks[prop]) === "function") {
                      return callbacks[prop].apply(callbacks, args);
                  } else {
                      return callbacks[prop]; // or undefined
                  }
              }
          }

          var getProto = Object.getPrototypeOf || function (obj) {
              return obj.__proto__;
          };

          var callbacks = (function () {

              // for string, boolean, number and null
              function useStrictEquality(b, a) {
                  if (b instanceof a.constructor || a instanceof b.constructor) {
                      // to catch short annotaion VS 'new' annotation of a
                      // declaration
                      // e.g. var i = 1;
                      // var j = new Number(1);
                      return a == b;
                  } else {
                      return a === b;
                  }
              }

              return {
                  "string": useStrictEquality,
                  "boolean": useStrictEquality,
                  "number": useStrictEquality,
                  "null": useStrictEquality,
                  "undefined": useStrictEquality,

                  "nan": function (b) {
                      return isNaN(b);
                  },

                  "date": function (b, a) {
                      return QUnit.objectType(b) === "date" && a.valueOf() === b.valueOf();
                  },

                  "regexp": function (b, a) {
                      return QUnit.objectType(b) === "regexp" &&
            // the regex itself
            a.source === b.source &&
            // and its modifers
            a.global === b.global &&
            // (gmi) ...
            a.ignoreCase === b.ignoreCase &&
            a.multiline === b.multiline;
                  },

                  // - skip when the property is a method of an instance (OOP)
                  // - abort otherwise,
                  // initial === would have catch identical references anyway
                  "function": function () {
                      var caller = callers[callers.length - 1];
                      return caller !== Object && typeof caller !== "undefined";
                  },

                  "array": function (b, a) {
                      var i, j, loop;
                      var len;

                      // b could be an object literal here
                      if (QUnit.objectType(b) !== "array") {
                          return false;
                      }

                      len = a.length;
                      if (len !== b.length) { // safe and faster
                          return false;
                      }

                      // track reference to avoid circular references
                      parents.push(a);
                      for (i = 0; i < len; i++) {
                          loop = false;
                          for (j = 0; j < parents.length; j++) {
                              if (parents[j] === a[i]) {
                                  loop = true;// dont rewalk array
                              }
                          }
                          if (!loop && !innerEquiv(a[i], b[i])) {
                              parents.pop();
                              return false;
                          }
                      }
                      parents.pop();
                      return true;
                  },

                  "object": function (b, a) {
                      var i, j, loop;
                      var eq = true; // unless we can proove it
                      var aProperties = [], bProperties = []; // collection of
                      // strings

                      // comparing constructors is more strict than using
                      // instanceof
                      if (a.constructor !== b.constructor) {
                          // Allow objects with no prototype to be equivalent to
                          // objects with Object as their constructor.
                          if (!((getProto(a) === null && getProto(b) === Object.prototype) ||
              (getProto(b) === null && getProto(a) === Object.prototype))) {
                  return false;
              }
                      }

                      // stack constructor before traversing properties
                      callers.push(a.constructor);
                      // track reference to avoid circular references
                      parents.push(a);

                      for (i in a) { // be strict: don't ensures hasOwnProperty
                          // and go deep
                          loop = false;
                          for (j = 0; j < parents.length; j++) {
                              if (parents[j] === a[i]) {
                                  // don't go down the same path twice
                                  loop = true;
                              }
                          }
                          aProperties.push(i); // collect a's properties

                          if (!loop && !innerEquiv(a[i], b[i])) {
                              eq = false;
                              break;
                          }
                      }

                      callers.pop(); // unstack, we are done
                      parents.pop();

                      for (i in b) {
                          bProperties.push(i); // collect b's properties
                      }

                      // Ensures identical properties name
                      return eq && innerEquiv(aProperties.sort(), bProperties.sort());
                  }
              };
          }());

          innerEquiv = function () { // can take multiple arguments
              var args = Array.prototype.slice.apply(arguments);
              if (args.length < 2) {
                  return true; // end transition
              }

              return (function (a, b) {
                  if (a === b) {
                      return true; // catch the most you can
                  } else if (a === null || b === null || typeof a === "undefined" ||
            typeof b === "undefined" ||
            QUnit.objectType(a) !== QUnit.objectType(b)) {
                return false; // don't lose time with error prone cases
            } else {
                return bindCallbacks(a, callbacks, [b, a]);
            }

                  // apply transition with (1..n) arguments
              }(args[0], args[1]) && arguments.callee.apply(this, args.splice(1, args.length - 1)));
          };

          return innerEquiv;

      }());

      /**
   * jsDump Copyright (c) 2008 Ariel Flesler - aflesler(at)gmail(dot)com |
   * http://flesler.blogspot.com Licensed under BSD
   * (http://www.opensource.org/licenses/bsd-license.php) Date: 5/15/2008
   *
   * @projectDescription Advanced and extensible data dumping for Javascript.
   * @version 1.0.0
   * @author Ariel Flesler
   * @link {http://flesler.blogspot.com/2008/05/jsdump-pretty-dump-of-any-javascript.html}
   */
      QUnit.jsDump = (function () {
          function quote(str) {
              return '"' + str.toString().replace(/"/g, '\\"') + '"';
          }
          function literal(o) {
              return o + '';
          }
          function join(pre, arr, post) {
              var s = jsDump.separator(),
        base = jsDump.indent(),
        inner = jsDump.indent(1);
              if (arr.join) {
                  arr = arr.join(',' + s + inner);
              }
              if (!arr) {
                  return pre + post;
              }
              return [pre, inner + arr, base + post].join(s);
          }
          function array(arr, stack) {
              var i = arr.length, ret = new Array(i);
              this.up();
              while (i--) {
                  ret[i] = this.parse(arr[i], undefined, stack);
              }
              this.down();
              return join('[', ret, ']');
          }

          var reName = /^function (\w+)/;

          var jsDump = {
              parse: function (obj, type, stack) { //type is used mostly internally, you can fix a (custom)type in advance
                  stack = stack || [];
                  var parser = this.parsers[type || this.typeOf(obj)];
                  type = typeof parser;
                  var inStack = inArray(obj, stack);
                  if (inStack != -1) {
                      return 'recursion(' + (inStack - stack.length) + ')';
                  }
                  //else
                  if (type == 'function') {
                      stack.push(obj);
                      var res = parser.call(this, obj, stack);
                      stack.pop();
                      return res;
                  }
                  // else
                  return (type == 'string') ? parser : this.parsers.error;
              },
              typeOf: function (obj) {
                  var type;
                  if (obj === null) {
                      type = "null";
                  } else if (typeof obj === "undefined") {
                      type = "undefined";
                  } else if (QUnit.is("RegExp", obj)) {
                      type = "regexp";
                  } else if (QUnit.is("Date", obj)) {
                      type = "date";
                  } else if (QUnit.is("Function", obj)) {
                      type = "function";
                  } else if (typeof obj.setInterval !== undefined && typeof obj.document !== "undefined" && typeof obj.nodeType === "undefined") {
                      type = "window";
                  } else if (obj.nodeType === 9) {
                      type = "document";
                  } else if (obj.nodeType) {
                      type = "node";
                  } else if (
                          // native arrays
          toString.call(obj) === "[object Array]" ||
                          // NodeList objects
          (typeof obj.length === "number" && typeof obj.item !== "undefined" && (obj.length ? obj.item(0) === obj[0] : (obj.item(0) === null && typeof obj[0] === "undefined")))
        ) {
            type = "array";
        } else {
            type = typeof obj;
        }
                  return type;
              },
              separator: function () {
                  return this.multiline ? this.HTML ? '<br />' : '\n' : this.HTML ? '&nbsp;' : ' ';
              },
              indent: function (extra) {// extra can be a number, shortcut for increasing-calling-decreasing
                  if (!this.multiline) {
                      return '';
                  }
                  var chr = this.indentChar;
                  if (this.HTML) {
                      chr = chr.replace(/\t/g, '   ').replace(/ /g, '&nbsp;');
                  }
                  return new Array(this._depth_ + (extra || 0)).join(chr);
              },
              up: function (a) {
                  this._depth_ += a || 1;
              },
              down: function (a) {
                  this._depth_ -= a || 1;
              },
              setParser: function (name, parser) {
                  this.parsers[name] = parser;
              },
              // The next 3 are exposed so you can use them
              quote: quote,
              literal: literal,
              join: join,
              //
              _depth_: 1,
              // This is the list of parsers, to modify them, use jsDump.setParser
              parsers: {
                  window: '[Window]',
                  document: '[Document]',
                  error: '[ERROR]', //when no parser is found, shouldn't happen
                  unknown: '[Unknown]',
                  'null': 'null',
                  'undefined': 'undefined',
                  'function': function (fn) {
                      var ret = 'function',
            name = 'name' in fn ? fn.name : (reName.exec(fn) || [])[1];//functions never have name in IE
                      if (name) {
                          ret += ' ' + name;
                      }
                      ret += '(';

                      ret = [ret, QUnit.jsDump.parse(fn, 'functionArgs'), '){'].join('');
                      return join(ret, QUnit.jsDump.parse(fn, 'functionCode'), '}');
                  },
                  array: array,
                  nodelist: array,
                  'arguments': array,
                  object: function (map, stack) {
                      var ret = [], keys, key, val, i;
                      QUnit.jsDump.up();
                      if (Object.keys) {
                          keys = Object.keys(map);
                      } else {
                          keys = [];
                          for (key in map) { keys.push(key); }
                      }
                      keys.sort();
                      for (i = 0; i < keys.length; i++) {
                          key = keys[i];
                          val = map[key];
                          ret.push(QUnit.jsDump.parse(key, 'key') + ': ' + QUnit.jsDump.parse(val, undefined, stack));
                      }
                      QUnit.jsDump.down();
                      return join('{', ret, '}');
                  },
                  node: function (node) {
                      var open = QUnit.jsDump.HTML ? '&lt;' : '<',
            close = QUnit.jsDump.HTML ? '&gt;' : '>';

                      var tag = node.nodeName.toLowerCase(),
            ret = open + tag;

                      for (var a in QUnit.jsDump.DOMAttrs) {
                          var val = node[QUnit.jsDump.DOMAttrs[a]];
                          if (val) {
                              ret += ' ' + a + '=' + QUnit.jsDump.parse(val, 'attribute');
                          }
                      }
                      return ret + close + open + '/' + tag + close;
                  },
                  functionArgs: function (fn) {//function calls it internally, it's the arguments part of the function
                      var l = fn.length;
                      if (!l) {
                          return '';
                      }

                      var args = new Array(l);
                      while (l--) {
                          args[l] = String.fromCharCode(97 + l);//97 is 'a'
                      }
                      return ' ' + args.join(', ') + ' ';
                  },
                  key: quote, //object calls it internally, the key part of an item in a map
                  functionCode: '[code]', //function calls it internally, it's the content of the function
                  attribute: quote, //node calls it internally, it's an html attribute value
                  string: quote,
                  date: quote,
                  regexp: literal, //regex
                  number: literal,
                  'boolean': literal
              },
              DOMAttrs: {//attributes to dump from nodes, name=>realName
                  id: 'id',
                  name: 'name',
                  'class': 'className'
              },
              HTML: false,//if true, entities are escaped ( <, >, \t, space and \n )
              indentChar: '  ',//indentation unit
              multiline: true //if true, items in a collection, are separated by a \n, else just a space.
          };

          return jsDump;
      }());

      // from Sizzle.js
      function getText(elems) {
          var ret = "", elem;

          for (var i = 0; elems[i]; i++) {
              elem = elems[i];

              // Get the text from text nodes and CDATA nodes
              if (elem.nodeType === 3 || elem.nodeType === 4) {
                  ret += elem.nodeValue;

                  // Traverse everything else, except comment nodes
              } else if (elem.nodeType !== 8) {
                  ret += getText(elem.childNodes);
              }
          }

          return ret;
      }

      //from jquery.js
      function inArray(elem, array) {
          if (array.indexOf) {
              return array.indexOf(elem);
          }

          for (var i = 0, length = array.length; i < length; i++) {
              if (array[i] === elem) {
                  return i;
              }
          }

          return -1;
      }

      /*
   * Javascript Diff Algorithm
   *  By John Resig (http://ejohn.org/)
   *  Modified by Chu Alan "sprite"
   *
   * Released under the MIT license.
   *
   * More Info:
   *  http://ejohn.org/projects/javascript-diff-algorithm/
   *
   * Usage: QUnit.diff(expected, actual)
   *
   * QUnit.diff("the quick brown fox jumped over", "the quick fox jumps over") == "the  quick <del>brown </del> fox <del>jumped </del><ins>jumps </ins> over"
   */
      QUnit.diff = (function () {
          function diff(o, n) {
              var ns = {};
              var os = {};
              var i;

              for (i = 0; i < n.length; i++) {
                  if (ns[n[i]] == null) {
                      ns[n[i]] = {
                          rows: [],
                          o: null
                      };
                  }
                  ns[n[i]].rows.push(i);
              }

              for (i = 0; i < o.length; i++) {
                  if (os[o[i]] == null) {
                      os[o[i]] = {
                          rows: [],
                          n: null
                      };
                  }
                  os[o[i]].rows.push(i);
              }

              for (i in ns) {
                  if (!hasOwn.call(ns, i)) {
                      continue;
                  }
                  if (ns[i].rows.length == 1 && typeof (os[i]) != "undefined" && os[i].rows.length == 1) {
                      n[ns[i].rows[0]] = {
                          text: n[ns[i].rows[0]],
                          row: os[i].rows[0]
                      };
                      o[os[i].rows[0]] = {
                          text: o[os[i].rows[0]],
                          row: ns[i].rows[0]
                      };
                  }
              }

              for (i = 0; i < n.length - 1; i++) {
                  if (n[i].text != null && n[i + 1].text == null && n[i].row + 1 < o.length && o[n[i].row + 1].text == null &&
        n[i + 1] == o[n[i].row + 1]) {
            n[i + 1] = {
                text: n[i + 1],
                row: n[i].row + 1
            };
            o[n[i].row + 1] = {
                text: o[n[i].row + 1],
                row: i + 1
            };
        }
              }

              for (i = n.length - 1; i > 0; i--) {
                  if (n[i].text != null && n[i - 1].text == null && n[i].row > 0 && o[n[i].row - 1].text == null &&
        n[i - 1] == o[n[i].row - 1]) {
            n[i - 1] = {
                text: n[i - 1],
                row: n[i].row - 1
            };
            o[n[i].row - 1] = {
                text: o[n[i].row - 1],
                row: i - 1
            };
        }
              }

              return {
                  o: o,
                  n: n
              };
          }

          return function (o, n) {
              o = o.replace(/\s+$/, '');
              n = n.replace(/\s+$/, '');
              var out = diff(o === "" ? [] : o.split(/\s+/), n === "" ? [] : n.split(/\s+/));

              var str = "";
              var i;

              var oSpace = o.match(/\s+/g);
              if (oSpace == null) {
                  oSpace = [" "];
              }
              else {
                  oSpace.push(" ");
              }
              var nSpace = n.match(/\s+/g);
              if (nSpace == null) {
                  nSpace = [" "];
              }
              else {
                  nSpace.push(" ");
              }

              if (out.n.length === 0) {
                  for (i = 0; i < out.o.length; i++) {
                      str += '<del>' + out.o[i] + oSpace[i] + "</del>";
                  }
              }
              else {
                  if (out.n[0].text == null) {
                      for (n = 0; n < out.o.length && out.o[n].text == null; n++) {
                          str += '<del>' + out.o[n] + oSpace[n] + "</del>";
                      }
                  }

                  for (i = 0; i < out.n.length; i++) {
                      if (out.n[i].text == null) {
                          str += '<ins>' + out.n[i] + nSpace[i] + "</ins>";
                      }
                      else {
                          var pre = "";

                          for (n = out.n[i].row + 1; n < out.o.length && out.o[n].text == null; n++) {
                              pre += '<del>' + out.o[n] + oSpace[n] + "</del>";
                          }
                          str += " " + out.n[i].text + nSpace[i] + pre;
                      }
                  }
              }

              return str;
          };
      }());

      // for CommonJS enviroments, export everything
      if (typeof exports !== "undefined" || typeof require !== "undefined") {
          extend(exports, QUnit);
      }

      //QUnit.init();

      // get at whatever the global object is, like window in browsers
  }((function () { return this; }.call())));

  /**
  $().ready(function () {

      $("#runTests").click(function () {

          RunTests();
          $("#unitTestContainer").show();

      });

      $("#closeTests").click(function () {
          $("#unitTestContainer").hide();
      });

  });
  **/

} else {

(function(l){function I(a){r(this,a);this.assertions=[];this.testNumber=++I.count}function P(a){var c=d.filter&&d.filter.toLowerCase(),b=d.module&&d.module.toLowerCase(),j=(a.module+": "+a.testName).toLowerCase();if(a.callback&&a.callback.validTest===P)return delete a.callback.validTest,!0;if(d.testNumber)return a.testNumber===d.testNumber;if(b&&(!a.module||a.module.toLowerCase()!==b))return!1;if(!c)return!0;(a="!"!==c.charAt(0))||(c=c.slice(1));return-1!==j.indexOf(c)?a:!a}function J(a,c){c=void 0===
c?3:c;var b,d,e;if(a.stacktrace)return a.stacktrace.split("\n")[c+3];if(a.stack){b=a.stack.split("\n");/^error$/i.test(b[0])&&b.shift();if(V){d=[];for(e=c;e<b.length&&-1===b[e].indexOf(V);e++)d.push(b[e]);if(d.length)return d.join("\n")}return b[c]}if(a.sourceURL&&!/qunit.js$/.test(a.sourceURL))return a.sourceURL+":"+a.line}function w(a){try{throw Error();}catch(c){return J(c,a)}}function n(a){return!a?"":(a+"").replace(/['"<>&]/g,function(a){switch(a){case "'":return"&#039;";case '"':return"&quot;";
case "<":return"&lt;";case ">":return"&gt;";case "&":return"&amp;"}})}function C(a,c){d.queue.push(a);d.autorun&&!d.blocking&&K(c)}function K(a){function c(){K(a)}var b=(new s).getTime();for(d.depth=d.depth?d.depth+1:1;d.queue.length&&!d.blocking;)if(!x.setTimeout||0>=d.updateRate||(new s).getTime()-b<d.updateRate)d.queue.shift()();else{l.setTimeout(c,13);break}d.depth--;if(a&&!d.blocking&&!d.queue.length&&0===d.depth){d.autorun=!0;d.currentModule&&t("moduleDone",e,{name:d.currentModule,failed:d.moduleStats.bad,
passed:d.moduleStats.all-d.moduleStats.bad,total:d.moduleStats.all});var j,h;j=p("qunit-banner");h=p("qunit-tests");var b=+new s-d.started,f=d.stats.all-d.stats.bad,g=["Tests completed in ",b," milliseconds.<br/><span class='passed'>",f,"</span> assertions of <span class='total'>",d.stats.all,"</span> passed, <span class='failed'>",d.stats.bad,"</span> failed."].join("");j&&(j.className=d.stats.bad?"qunit-fail":"qunit-pass");h&&(p("qunit-testresult").innerHTML=g);d.altertitle&&("undefined"!==typeof document&&
document.title)&&(document.title=[d.stats.bad?"\u2716":"\u2714",document.title.replace(/^[\u2714\u2716] /i,"")].join(" "));if(d.reorder&&x.sessionStorage&&0===d.stats.bad)for(j=0;j<sessionStorage.length;j++)h=sessionStorage.key(j++),0===h.indexOf("qunit-test-")&&sessionStorage.removeItem(h);l.scrollTo&&l.scrollTo(0,0);t("done",e,{failed:d.stats.bad,passed:f,total:d.stats.all,runtime:b})}}function Q(){d.pollution=[];if(d.noglobals)for(var a in l)u.call(l,a)&&!/^qunit-test-output/.test(a)&&d.pollution.push(a)}
function W(a,c){var b,d,e=a.slice();for(b=0;b<e.length;b++)for(d=0;d<c.length;d++)if(e[b]===c[d]){e.splice(b,1);b--;break}return e}function r(a,c){for(var b in c)u.call(c,b)&&("constructor"===b&&a===l||(void 0===c[b]?delete a[b]:a[b]=c[b]));return a}function A(a,c,b){a.addEventListener?a.addEventListener(c,b,!1):a.attachEvent("on"+c,b)}function R(a,c){return-1<(" "+a.className+" ").indexOf(" "+c+" ")}function S(a,c){R(a,c)||(a.className+=(a.className?" ":"")+c)}function X(a,c){for(var b=" "+a.className+
" ";-1<b.indexOf(" "+c+" ");)b=b.replace(" "+c+" "," ");a.className=l.jQuery?jQuery.trim(b):b.trim?b.trim():b}function p(a){return!!("undefined"!==typeof document&&document&&document.getElementById)&&document.getElementById(a)}function B(a){return function(c){d[a].push(c)}}function t(a,c,b){var j;if(e.hasOwnProperty(a))e[a].call(c,b);else{j=d[a];for(a=0;a<j.length;a++)j[a].call(c,b)}}var e,m,d,T,Z=0,V=(w(0)||"").replace(/(:\d+)+\)?/,"").replace(/.+\//,""),Y=Object.prototype.toString,u=Object.prototype.hasOwnProperty,
s=l.Date;m="undefined"!==typeof l.setTimeout;var q;try{sessionStorage.setItem("qunit-test-string","qunit-test-string"),sessionStorage.removeItem("qunit-test-string"),q=!0}catch(ca){q=!1}var x={setTimeout:m,sessionStorage:q},$=function(a){var c;c=a.toString();return"[object"===c.substring(0,7)?(c=a.name?a.name.toString():"Error",a=a.message?a.message.toString():"",c&&a?c+": "+a:c?c:a?a:"Error"):c},F=function(a){var c,b,d=e.is("array",a)?[]:{};for(c in a)u.call(a,c)&&(b=a[c],d[c]=b===Object(b)?F(b):
b);return d};I.count=0;I.prototype={init:function(){var a,c,b,d=p("qunit-tests");d&&(c=document.createElement("strong"),c.innerHTML=this.nameHtml,a=document.createElement("a"),a.innerHTML="Rerun",a.href=e.url({testNumber:this.testNumber}),b=document.createElement("li"),b.appendChild(c),b.appendChild(a),b.className="running",b.id=this.id="qunit-test-output"+Z++,d.appendChild(b))},setup:function(){if(this.module!==d.previousModule||!u.call(d,"previousModule"))u.call(d,"previousModule")&&t("moduleDone",
e,{name:d.previousModule,failed:d.moduleStats.bad,passed:d.moduleStats.all-d.moduleStats.bad,total:d.moduleStats.all}),d.previousModule=this.module,d.moduleStats={all:0,bad:0},t("moduleStart",e,{name:this.module});d.current=this;this.testEnvironment=r({setup:function(){},teardown:function(){}},this.moduleTestEnvironment);this.started=+new s;t("testStart",e,{name:this.testName,module:this.module});e.current_testEnvironment=this.testEnvironment;d.pollution||Q();if(d.notrycatch)this.testEnvironment.setup.call(this.testEnvironment);
else try{this.testEnvironment.setup.call(this.testEnvironment)}catch(a){e.pushFailure("Setup failed on "+this.testName+": "+(a.message||a),J(a,1))}},run:function(){d.current=this;var a=p("qunit-testresult");a&&(a.innerHTML="Running: <br/>"+this.nameHtml);this.async&&e.stop();this.callbackStarted=+new s;if(d.notrycatch)this.callback.call(this.testEnvironment,e.assert),this.callbackRuntime=+new s-this.callbackStarted;else try{this.callback.call(this.testEnvironment,e.assert),this.callbackRuntime=+new s-
this.callbackStarted}catch(c){this.callbackRuntime=+new s-this.callbackStarted,e.pushFailure("Died on test #"+(this.assertions.length+1)+" "+this.stack+": "+(c.message||c),J(c,0)),Q(),d.blocking&&e.start()}},teardown:function(){d.current=this;if(d.notrycatch)"undefined"===typeof this.callbackRuntime&&(this.callbackRuntime=+new s-this.callbackStarted),this.testEnvironment.teardown.call(this.testEnvironment);else{try{this.testEnvironment.teardown.call(this.testEnvironment)}catch(a){e.pushFailure("Teardown failed on "+
this.testName+": "+(a.message||a),J(a,1))}var c,b=d.pollution;Q();c=W(d.pollution,b);0<c.length&&e.pushFailure("Introduced global variable(s): "+c.join(", "));c=W(b,d.pollution);0<c.length&&e.pushFailure("Deleted global variable(s): "+c.join(", "))}},finish:function(){d.current=this;d.requireExpects&&null===this.expected?e.pushFailure("Expected number of assertions to be defined, but expect() was not called.",this.stack):null!==this.expected&&this.expected!==this.assertions.length?e.pushFailure("Expected "+
this.expected+" assertions, but "+this.assertions.length+" were run",this.stack):null===this.expected&&!this.assertions.length&&e.pushFailure("Expected at least one assertion, but none were run - call expect(0) to accept zero assertions.",this.stack);var a,c,b,j,h,f,g=this,k=b=0;h=p("qunit-tests");this.runtime=+new s-this.started;d.stats.all+=this.assertions.length;d.moduleStats.all+=this.assertions.length;if(h){f=document.createElement("ol");f.className="qunit-assert-list";for(a=0;a<this.assertions.length;a++)c=
this.assertions[a],h=document.createElement("li"),h.className=c.result?"pass":"fail",h.innerHTML=c.message||(c.result?"okay":"failed"),f.appendChild(h),c.result?b++:(k++,d.stats.bad++,d.moduleStats.bad++);e.config.reorder&&x.sessionStorage&&(k?sessionStorage.setItem("qunit-test-"+this.module+"-"+this.testName,k):sessionStorage.removeItem("qunit-test-"+this.module+"-"+this.testName));0===k&&S(f,"qunit-collapsed");j=document.createElement("strong");j.innerHTML=this.nameHtml+" <b class='counts'>(<b class='failed'>"+
k+"</b>, <b class='passed'>"+b+"</b>, "+this.assertions.length+")</b>";A(j,"click",function(){var a=j.parentNode.lastChild;(R(a,"qunit-collapsed")?X:S)(a,"qunit-collapsed")});A(j,"dblclick",function(a){a=a&&a.target?a.target:l.event.srcElement;if("span"===a.nodeName.toLowerCase()||"b"===a.nodeName.toLowerCase())a=a.parentNode;l.location&&"strong"===a.nodeName.toLowerCase()&&(l.location=e.url({testNumber:g.testNumber}))});a=document.createElement("span");a.className="runtime";a.innerHTML=this.runtime+
" ms";h=p(this.id);h.className=k?"fail":"pass";h.removeChild(h.firstChild);b=h.firstChild;h.appendChild(j);h.appendChild(b);h.appendChild(a);h.appendChild(f)}else for(a=0;a<this.assertions.length;a++)this.assertions[a].result||(k++,d.stats.bad++,d.moduleStats.bad++);t("testDone",e,{name:this.testName,module:this.module,failed:k,passed:this.assertions.length-k,total:this.assertions.length,duration:this.runtime});e.reset();d.current=void 0},queue:function(){function a(){C(function(){c.setup()});C(function(){c.run()});
C(function(){c.teardown()});C(function(){c.finish()})}var c=this;C(function(){c.init()});e.config.reorder&&x.sessionStorage&&+sessionStorage.getItem("qunit-test-"+this.module+"-"+this.testName)?a():C(a,!0)}};e={module:function(a,c){d.currentModule=a;d.currentModuleTestEnvironment=c;d.modules[a]=!0},asyncTest:function(a,c,b){2===arguments.length&&(b=c,c=null);e.test(a,c,b,!0)},test:function(a,c,b,e){var h;h="<span class='test-name'>"+n(a)+"</span>";2===arguments.length&&(b=c,c=null);d.currentModule&&
(h="<span class='module-name'>"+n(d.currentModule)+"</span>: "+h);h=new I({nameHtml:h,testName:a,expected:c,async:e,callback:b,module:d.currentModule,moduleTestEnvironment:d.currentModuleTestEnvironment,stack:w(2)});P(h)&&h.queue()},expect:function(a){if(1===arguments.length)d.current.expected=a;else return d.current.expected},start:function(a){void 0===d.semaphore?e.begin(function(){setTimeout(function(){e.start(a)})}):(d.semaphore-=a||1,0<d.semaphore||(0>d.semaphore?(d.semaphore=0,e.pushFailure("Called start() while already started (QUnit.config.semaphore was 0 already)",
null,w(2))):x.setTimeout?l.setTimeout(function(){0<d.semaphore||(d.timeout&&clearTimeout(d.timeout),d.blocking=!1,K(!0))},13):(d.blocking=!1,K(!0))))},stop:function(a){d.semaphore+=a||1;d.blocking=!0;d.testTimeout&&x.setTimeout&&(clearTimeout(d.timeout),d.timeout=l.setTimeout(function(){e.ok(!1,"Test timed out");d.semaphore=1;e.start()},d.testTimeout))}};m={ok:function(a,c){if(!d.current)throw Error("ok() assertion outside test context, was "+w(2));a=!!a;c=c||(a?"okay":"failed");var b,j={module:d.current.module,
name:d.current.testName,result:a,message:c};c="<span class='test-message'>"+n(c)+"</span>";if(!a&&(b=w(2)))j.source=b,c+="<table><tr class='test-source'><th>Source: </th><td><pre>"+n(b)+"</pre></td></tr></table>";t("log",e,j);d.current.assertions.push({result:a,message:c})},equal:function(a,c,b){e.push(c==a,a,c,b)},notEqual:function(a,c,b){e.push(c!=a,a,c,b)},propEqual:function(a,c,b){a=F(a);c=F(c);e.push(e.equiv(a,c),a,c,b)},notPropEqual:function(a,c,b){a=F(a);c=F(c);e.push(!e.equiv(a,c),a,c,b)},
deepEqual:function(a,c,b){e.push(e.equiv(a,c),a,c,b)},notDeepEqual:function(a,c,b){e.push(!e.equiv(a,c),a,c,b)},strictEqual:function(a,c,b){e.push(c===a,a,c,b)},notStrictEqual:function(a,c,b){e.push(c!==a,a,c,b)},"throws":function(a,c,b){var j,h=c,f=!1;"string"===typeof c&&(b=c,c=null);d.current.ignoreGlobalErrors=!0;try{a.call(d.current.testEnvironment)}catch(g){j=g}d.current.ignoreGlobalErrors=!1;j?(c?"regexp"===e.objectType(c)?f=c.test($(j)):j instanceof c?f=!0:!0===c.call({},j)&&(h=null,f=!0):
(f=!0,h=null),e.push(f,j,h,b)):e.pushFailure(b,null,"No exception was thrown.")}};r(e,m);e.raises=m["throws"];e.equals=function(){e.push(!1,!1,!1,"QUnit.equals has been deprecated since 2009 (e88049a0), use QUnit.equal instead")};e.same=function(){e.push(!1,!1,!1,"QUnit.same has been deprecated since 2009 (e88049a0), use QUnit.deepEqual instead")};q=function(){};q.prototype=e;e=new q;e.constructor=q;d={queue:[],blocking:!0,hidepassed:!1,reorder:!0,altertitle:!0,requireExpects:!1,urlConfig:[{id:"noglobals",
label:"Check for Globals",tooltip:"Enabling this will test if any test introduces new properties on the `window` object. Stored as query-strings."},{id:"notrycatch",label:"No try-catch",tooltip:"Enabling this will run tests outside of a try-catch block. Makes debugging exceptions in IE reasonable. Stored as query-strings."}],modules:{},begin:[],done:[],log:[],testStart:[],testDone:[],moduleStart:[],moduleDone:[]};"undefined"===typeof exports&&(r(l,e.constructor.prototype),l.QUnit=e);var D=l.location||
{search:"",protocol:"file:"},U=D.search.slice(1).split("&"),aa=U.length,G={},y;if(U[0])for(q=0;q<aa;q++)y=U[q].split("="),y[0]=decodeURIComponent(y[0]),y[1]=y[1]?decodeURIComponent(y[1]):!0,G[y[0]]=y[1];e.urlParams=G;d.filter=G.filter;d.module=G.module;d.testNumber=parseInt(G.testNumber,10)||null;e.isLocal="file:"===D.protocol;r(e,{assert:m,config:d,init:function(){r(d,{stats:{all:0,bad:0},moduleStats:{all:0,bad:0},started:+new s,updateRate:1E3,blocking:!1,autostart:!0,autorun:!1,filter:"",queue:[],
semaphore:1});var a,c,b;if(a=p("qunit"))a.innerHTML="<h1 id='qunit-header'>"+n(document.title)+"</h1><h2 id='qunit-banner'></h2><div id='qunit-testrunner-toolbar'></div><h2 id='qunit-userAgent'></h2><ol id='qunit-tests'></ol>";a=p("qunit-tests");c=p("qunit-banner");b=p("qunit-testresult");a&&(a.innerHTML="");c&&(c.className="");b&&b.parentNode.removeChild(b);a&&(b=document.createElement("p"),b.id="qunit-testresult",b.className="result",a.parentNode.insertBefore(b,a),b.innerHTML="Running...<br/>&nbsp;")},
reset:function(){var a=p("qunit-fixture");a&&(a.innerHTML=d.fixture)},triggerEvent:function(a,c,b){document.createEvent?(b=document.createEvent("MouseEvents"),b.initMouseEvent(c,!0,!0,a.ownerDocument.defaultView,0,0,0,0,0,!1,!1,!1,!1,0,null),a.dispatchEvent(b)):a.fireEvent&&a.fireEvent("on"+c)},is:function(a,c){return e.objectType(c)===a},objectType:function(a){if("undefined"===typeof a)return"undefined";if(null===a)return"null";var c=Y.call(a).match(/^\[object\s(.*)\]$/),c=c&&c[1]||"";switch(c){case "Number":return isNaN(a)?
"nan":"number";case "String":case "Boolean":case "Array":case "Date":case "RegExp":case "Function":return c.toLowerCase()}if("object"===typeof a)return"object"},push:function(a,c,b,j){if(!d.current)throw Error("assertion outside test context, was "+w());var h={module:d.current.module,name:d.current.testName,result:a,message:j,actual:c,expected:b};j=n(j)||(a?"okay":"failed");j="<span class='test-message'>"+j+"</span>";if(!a){b=n(e.jsDump.parse(b));c=n(e.jsDump.parse(c));j+="<table><tr class='test-expected'><th>Expected: </th><td><pre>"+
b+"</pre></td></tr>";c!==b&&(j=j+("<tr class='test-actual'><th>Result: </th><td><pre>"+c+"</pre></td></tr>")+("<tr class='test-diff'><th>Diff: </th><td><pre>"+e.diff(b,c)+"</pre></td></tr>"));if(c=w())h.source=c,j+="<tr class='test-source'><th>Source: </th><td><pre>"+n(c)+"</pre></td></tr>";j+="</table>"}t("log",e,h);d.current.assertions.push({result:!!a,message:j})},pushFailure:function(a,c,b){if(!d.current)throw Error("pushFailure() assertion outside test context, was "+w(2));var j={module:d.current.module,
name:d.current.testName,result:!1,message:a};a=n(a)||"error";a="<span class='test-message'>"+a+"</span>";a+="<table>";b&&(a+="<tr class='test-actual'><th>Result: </th><td><pre>"+n(b)+"</pre></td></tr>");c&&(j.source=c,a+="<tr class='test-source'><th>Source: </th><td><pre>"+n(c)+"</pre></td></tr>");a+="</table>";t("log",e,j);d.current.assertions.push({result:!1,message:a})},url:function(a){a=r(r({},e.urlParams),a);var c,b="?";for(c in a)u.call(a,c)&&(b+=encodeURIComponent(c)+"="+encodeURIComponent(a[c])+
"&");return l.location.protocol+"//"+l.location.host+l.location.pathname+b.slice(0,-1)},extend:r,id:p,addEvent:A,addClass:S,hasClass:R,removeClass:X});r(e.constructor.prototype,{begin:B("begin"),done:B("done"),log:B("log"),testStart:B("testStart"),testDone:B("testDone"),moduleStart:B("moduleStart"),moduleDone:B("moduleDone")});if("undefined"===typeof document||"complete"===document.readyState)d.autorun=!0;e.load=function(){t("begin",e,{});var a,c,b,j,h,f,g,k;j=0;a=[];g=h="";j=r({},d);e.init();r(d,
j);d.blocking=!1;j=d.urlConfig.length;for(b=0;b<j;b++)f=d.urlConfig[b],"string"===typeof f&&(f={id:f,label:f,tooltip:"[no tooltip available]"}),d[f.id]=e.urlParams[f.id],g+="<input id='qunit-urlconfig-"+n(f.id)+"' name='"+n(f.id)+"' type='checkbox'"+(d[f.id]?" checked='checked'":"")+" title='"+n(f.tooltip)+"'><label for='qunit-urlconfig-"+n(f.id)+"' title='"+n(f.tooltip)+"'>"+f.label+"</label>";for(b in d.modules)d.modules.hasOwnProperty(b)&&a.push(b);j=a.length;a.sort(function(a,c){return a.localeCompare(c)});
h+="<label for='qunit-modulefilter'>Module: </label><select id='qunit-modulefilter' name='modulefilter'><option value='' "+(void 0===d.module?"selected='selected'":"")+">< All Modules ></option>";for(b=0;b<j;b++)h+="<option value='"+n(encodeURIComponent(a[b]))+"' "+(d.module===a[b]?"selected='selected'":"")+">"+n(a[b])+"</option>";h+="</select>";if(a=p("qunit-userAgent"))a.innerHTML=navigator.userAgent;if(a=p("qunit-header"))a.innerHTML="<a href='"+e.url({filter:void 0,module:void 0,testNumber:void 0})+
"'>"+a.innerHTML+"</a> ";if(a=p("qunit-testrunner-toolbar")){c=document.createElement("input");c.type="checkbox";c.id="qunit-filter-pass";A(c,"click",function(){var a,b=document.getElementById("qunit-tests");c.checked?b.className+=" hidepass":(a=" "+b.className.replace(/[\n\t\r]/g," ")+" ",b.className=a.replace(/ hidepass /," "));x.sessionStorage&&(c.checked?sessionStorage.setItem("qunit-filter-passed-tests","true"):sessionStorage.removeItem("qunit-filter-passed-tests"))});if(d.hidepassed||x.sessionStorage&&
sessionStorage.getItem("qunit-filter-passed-tests"))c.checked=!0,b=document.getElementById("qunit-tests"),b.className+=" hidepass";a.appendChild(c);b=document.createElement("label");b.setAttribute("for","qunit-filter-pass");b.setAttribute("title","Only show tests and assertions that fail. Stored in sessionStorage.");b.innerHTML="Hide passed tests";a.appendChild(b);b=document.createElement("span");b.innerHTML=g;g=b.getElementsByTagName("input");f=function(a){var b={};a=a.target||a.srcElement;b[a.name]=
a.checked?!0:void 0;l.location=e.url(b)};for(var m=g.length;m--;)A(g[m],"click",f);a.appendChild(b);1<j&&(k=document.createElement("span"),k.setAttribute("id","qunit-modulefilter-container"),k.innerHTML=h,A(k.lastChild,"change",function(){var a=k.getElementsByTagName("select")[0],a=decodeURIComponent(a.options[a.selectedIndex].value);l.location=e.url({module:""===a?void 0:a,filter:void 0,testNumber:void 0})}),a.appendChild(k))}if(h=p("qunit-fixture"))d.fixture=h.innerHTML;d.autostart&&e.start()};
A(l,"load",e.load);T=l.onerror;l.onerror=function(a,c,b){var d=!1;T&&(d=T(a,c,b));if(!0!==d){if(e.config.current){if(e.config.current.ignoreGlobalErrors)return!0;e.pushFailure(a,c+":"+b)}else e.test("global failure",r(function(){e.pushFailure(a,c+":"+b)},{validTest:P}));return!1}return d};var E,L=[],v=[],z=[],M=Object.getPrototypeOf||function(a){return a.__proto__},H;m=function(a,c){return a instanceof c.constructor||c instanceof a.constructor?c==a:c===a};H={string:m,"boolean":m,number:m,"null":m,
undefined:m,nan:function(a){return isNaN(a)},date:function(a,c){return"date"===e.objectType(a)&&c.valueOf()===a.valueOf()},regexp:function(a,c){return"regexp"===e.objectType(a)&&c.source===a.source&&c.global===a.global&&c.ignoreCase===a.ignoreCase&&c.multiline===a.multiline&&c.sticky===a.sticky},"function":function(){var a=L[L.length-1];return a!==Object&&"undefined"!==typeof a},array:function(a,c){var b,d,h,f,g,k;if("array"!==e.objectType(a))return!1;h=c.length;if(h!==a.length)return!1;v.push(c);
z.push(a);for(b=0;b<h;b++){f=!1;for(d=0;d<v.length;d++)if(g=v[d]===c[b],k=z[d]===a[b],g||k)if(c[b]===a[b]||g&&k)f=!0;else return v.pop(),z.pop(),!1;if(!f&&!E(c[b],a[b]))return v.pop(),z.pop(),!1}v.pop();z.pop();return!0},object:function(a,c){var b,d,e,f,g,k=!0,l=[],m=[];if(c.constructor!==a.constructor&&!(null===M(c)&&M(a)===Object.prototype||null===M(a)&&M(c)===Object.prototype))return!1;L.push(c.constructor);v.push(c);z.push(a);for(b in c){e=!1;for(d=0;d<v.length;d++)if(f=v[d]===c[b],g=z[d]===a[b],
f||g)if(c[b]===a[b]||f&&g)e=!0;else{k=!1;break}l.push(b);if(!e&&!E(c[b],a[b])){k=!1;break}}v.pop();z.pop();L.pop();for(b in a)m.push(b);return k&&E(l.sort(),m.sort())}};E=function(){var a=[].slice.apply(arguments);if(2>a.length)a=!0;else{var c;if(a[0]===a[1])c=!0;else if(null===a[0]||null===a[1]||"undefined"===typeof a[0]||"undefined"===typeof a[1]||e.objectType(a[0])!==e.objectType(a[1]))c=!1;else{c=[a[1],a[0]];var b=e.objectType(a[0]);c=b?"function"===e.objectType(H[b])?H[b].apply(H,c):H[b]:void 0}a=
c&&E.apply(this,a.splice(1,a.length-1))}return a};e.equiv=E;m=function(a){return'"'+a.toString().replace(/"/g,'\\"')+'"'};q=function(a){return a+""};var O=function(a,c,b){var d=N.separator(),e=N.indent(),f=N.indent(1);c.join&&(c=c.join(","+d+f));return!c?a+b:[a,f+c,e+b].join(d)},D=function(a,c){var b=a.length,d=Array(b);for(this.up();b--;)d[b]=this.parse(a[b],void 0,c);this.down();return O("[",d,"]")},ba=/^function (\w+)/,N={parse:function(a,c,b){b=b||[];var d,e=this.parsers[c||this.typeOf(a)];c=
typeof e;a:if(d=b,d.indexOf)d=d.indexOf(a);else{for(var f=0,g=d.length;f<g;f++)if(d[f]===a){d=f;break a}d=-1}return-1!==d?"recursion("+(d-b.length)+")":"function"===c?(b.push(a),a=e.call(this,a,b),b.pop(),a):"string"===c?e:this.parsers.error},typeOf:function(a){return null===a?"null":"undefined"===typeof a?"undefined":e.is("regexp",a)?"regexp":e.is("date",a)?"date":e.is("function",a)?"function":void 0!==typeof a.setInterval&&"undefined"!==typeof a.document&&"undefined"===typeof a.nodeType?"window":
9===a.nodeType?"document":a.nodeType?"node":"[object Array]"===Y.call(a)||"number"===typeof a.length&&"undefined"!==typeof a.item&&(a.length?a.item(0)===a[0]:null===a.item(0)&&"undefined"===typeof a[0])?"array":a.constructor===Error.prototype.constructor?"error":typeof a},separator:function(){return this.multiline?this.HTML?"<br />":"\n":this.HTML?"&nbsp;":" "},indent:function(a){if(!this.multiline)return"";var c=this.indentChar;this.HTML&&(c=c.replace(/\t/g,"   ").replace(/ /g,"&nbsp;"));return Array(this.depth+
(a||0)).join(c)},up:function(a){this.depth+=a||1},down:function(a){this.depth-=a||1},setParser:function(a,c){this.parsers[a]=c},quote:m,literal:q,join:O,depth:1,parsers:{window:"[Window]",document:"[Document]",error:function(a){return'Error("'+a.message+'")'},unknown:"[Unknown]","null":"null",undefined:"undefined","function":function(a){var c="function",b="name"in a?a.name:(ba.exec(a)||[])[1];b&&(c+=" "+b);c=[c+"( ",e.jsDump.parse(a,"functionArgs"),"){"].join("");return O(c,e.jsDump.parse(a,"functionCode"),
"}")},array:D,nodelist:D,arguments:D,object:function(a,c){var b=[],d,h,f,g;e.jsDump.up();d=[];for(h in a)d.push(h);d.sort();for(g=0;g<d.length;g++)h=d[g],f=a[h],b.push(e.jsDump.parse(h,"key")+": "+e.jsDump.parse(f,void 0,c));e.jsDump.down();return O("{",b,"}")},node:function(a){var c,b,d,h=e.jsDump.HTML?"&lt;":"<",f=e.jsDump.HTML?"&gt;":">",g=a.nodeName.toLowerCase(),k=h+g,l=a.attributes;if(l){b=0;for(c=l.length;b<c;b++)(d=l[b].nodeValue)&&"inherit"!==d&&(k+=" "+l[b].nodeName+"="+e.jsDump.parse(d,
"attribute"))}k+=f;if(3===a.nodeType||4===a.nodeType)k+=a.nodeValue;return k+h+"/"+g+f},functionArgs:function(a){var c=a.length;if(!c)return"";for(a=Array(c);c--;)a[c]=String.fromCharCode(97+c);return" "+a.join(", ")+" "},key:m,functionCode:"[code]",attribute:m,string:m,date:m,regexp:q,number:q,"boolean":q},HTML:!1,indentChar:"  ",multiline:!0};e.jsDump=N;e.diff=function(a,c){a=a.replace(/\s+$/,"");c=c.replace(/\s+$/,"");var b,d,e="",f=""===a?[]:a.split(/\s+/),g=""===c?[]:c.split(/\s+/);d={};var k=
{};for(b=0;b<g.length;b++)u.call(d,g[b])||(d[g[b]]={rows:[],o:null}),d[g[b]].rows.push(b);for(b=0;b<f.length;b++)u.call(k,f[b])||(k[f[b]]={rows:[],n:null}),k[f[b]].rows.push(b);for(b in d)u.call(d,b)&&(1===d[b].rows.length&&u.call(k,b)&&1===k[b].rows.length)&&(g[d[b].rows[0]]={text:g[d[b].rows[0]],row:k[b].rows[0]},f[k[b].rows[0]]={text:f[k[b].rows[0]],row:d[b].rows[0]});for(b=0;b<g.length-1;b++)null!=g[b].text&&(null==g[b+1].text&&g[b].row+1<f.length&&null==f[g[b].row+1].text&&g[b+1]==f[g[b].row+
1])&&(g[b+1]={text:g[b+1],row:g[b].row+1},f[g[b].row+1]={text:f[g[b].row+1],row:b+1});for(b=g.length-1;0<b;b--)null!=g[b].text&&(null==g[b-1].text&&0<g[b].row&&null==f[g[b].row-1].text&&g[b-1]==f[g[b].row-1])&&(g[b-1]={text:g[b-1],row:g[b].row-1},f[g[b].row-1]={text:f[g[b].row-1],row:b-1});var k=a.match(/\s+/g),l=c.match(/\s+/g);null==k?k=[" "]:k.push(" ");null==l?l=[" "]:l.push(" ");if(0===g.length)for(b=0;b<f.length;b++)e+="<del>"+f[b]+k[b]+"</del>";else{if(null==g[0].text)for(c=0;c<f.length&&null==
f[c].text;c++)e+="<del>"+f[c]+k[c]+"</del>";for(b=0;b<g.length;b++)if(null==g[b].text)e+="<ins>"+g[b]+l[b]+"</ins>";else{d="";for(c=g[b].row+1;c<f.length&&null==f[c].text;c++)d+="<del>"+f[c]+k[c]+"</del>";e+=" "+g[b].text+l[b]+d}}return e};"undefined"!==typeof exports&&r(exports,e.constructor.prototype)})(function(){return this}.call());

}