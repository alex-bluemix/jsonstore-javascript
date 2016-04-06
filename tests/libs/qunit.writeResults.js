
/* JavaScript content from test/lib/qunit.writeResults.js in folder common */
(function($) {

	var writeToDisk = function (msg, filename) {

		console.log(msg);

		window.requestFileSystem(LocalFileSystem.PERSISTENT, 0,  function (fileSystem) {

           fileSystem.root.getFile(filename, {create: true, exclusive: false}, function (fileEntry) {
               fileEntry.createWriter(function (writer) {
                   writer.seek(0);
                   writer.write(msg+'\n');
               }, function(err){ console.log('Write to disk error - createWriter: ' + err); });
           }, function(err){ console.log('Write to disk error - getFile: ' + err); });
       }, function(err){ console.log('Write to disk error - requestFileSystem: ' + err); });

	};

    var results = $('<testsuites />');
    var modules = [];
    var tests = [];

    var currentModule = '';

    QUnit.moduleStart = function(details) {
        currentModule = details.name;
    };

    QUnit.testStart = function(details){
        console.log('Starting Test ' + details.name);
    };

    QUnit.testDone = function(details) {

        var test = $('<testcase />');
        test.attr('name', currentModule + ' ' + details.name);
        test.attr('class', details.name);
        test.attr('file', 'index.html');
        test.attr('assertions', details.total);
        test.attr('time', 0);
        tests.push(test);
    };

    QUnit.moduleDone = function(details) {
        var module = $('<testsuite name="WL.JSONStore" />');
        module.attr('name', details.name);
        module.attr('file', 'index.html');
        module.attr('tests', details.total);
        module.attr('assertions', details.total);
        module.attr('failures', details.failed);
        module.attr('errors', details.failed);
        module.attr('time', 0);
        for(var i in tests) {
            module.append(tests[i]);
        }
        modules.push(module);
        tests = [];
    };

    QUnit.done = function(details) {
        var suite = $('<testsuite />');
        suite.attr('name', 'allTests');
        suite.attr('tests', details.total);
        suite.attr('assertions', details.total);
        suite.attr('failures', details.failed);
        suite.attr('errors', details.failed);
        suite.attr('time', details.runtime / 1000);
        for(var i in modules) {
            suite.append(modules[i]);
        }

        results.append(suite);

        var junitResults = '<?xml version="1.0"?>';
        junitResults += results.html();
        writeToDisk(JSON.stringify(details), "results.txt");
        writeToDisk(junitResults, "junit.xml");

    };

})(WLJQ);