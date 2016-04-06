/*globals phantom, require, console */

if (phantom.args.length === 0 || phantom.args.length > 2) {
    console.log('Usage: run-qunit.js URL');
    phantom.exit(1);
}

/**
 * Wait until the test condition is true or a timeout occurs.
 *
 * @param testFx javascript condition that evaluates to a boolean
 * @param onReady what to do when testFx condition is fulfilled
 * @param timeOutMillis the max amount of time to wait. If not specified, 3 sec is used.
 */
var waitFor = function (testFx, onReady, timeOutMillis) {

    'use strict';

    var maxtimeOutMillis = timeOutMillis ? timeOutMillis : 30001, //< Default Max Timout is 3s
        start = new Date().getTime(),
        condition = false,
        interval = setInterval(function() {
            if ( (new Date().getTime() - start < maxtimeOutMillis) && !condition ) {
                // If not time-out yet and condition not yet fulfilled
                condition = (typeof(testFx) === 'string' ? eval(testFx) : testFx()); //< defensive code
            } else {
                if(!condition) {
                    // If condition still not fulfilled (timeout but condition is 'false')
                    //console.log('"waitFor()" timeout');
                    phantom.exit(1);
                } else {
                    // Condition fulfilled (timeout and/or condition is 'true')
                    //console.log('"waitFor()" finished in ' + (new Date().getTime() - start) + 'ms.');
                    typeof(onReady) === 'string' ? eval(onReady) : onReady(); //< Do what it's supposed to do once the condition is fulfilled
                    clearInterval(interval); //< Stop this interval
                }
            }
        }, 100); //< repeat check every 250ms
};

var page = require('webpage').create();

// Route "console.log()" calls from within the Page context
//to the main Phantom context (i.e. current "this")
page.onConsoleMessage = function(msg) {
    'use strict';

    if (msg.indexOf('testsuites') >= 0) {
        console.log(msg);
    }
};

page.open(phantom.args[0], function(status){

    'use strict';

    if (status !== 'success') {
        console.log('Unable to open... Status: ' + status);
        phantom.exit(1);
    } else {
        waitFor(function () { //testFx
            return page.evaluate(function () {
                var el = document.getElementById('qunit-testresult');
                if (el && el.innerText.match('completed')) {
                    return true;
                }
                return false;
            });
        }, function () { //onReady
            var failedNum = page.evaluate(function () {
                //var el = document.getElementById('qunit-testresult');
                //console.log(el.innerText);
                console.log(document.getElementById('junit').innerHTML);
                try {
                    return el.getElementsByClassName('failed')[0].innerHTML;
                } catch (e) { }
                return 10000;
            });
            phantom.exit((parseInt(failedNum, 10) > 0) ? 1 : 0);
        });
    }
});