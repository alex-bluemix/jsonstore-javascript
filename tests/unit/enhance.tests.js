/*global test, module, deepEqual, ok, start, stop, notDeepEqual*/
(function() {

	'use strict';

	var model = JSONStore,
	COLLECTION_NAME = 'enhance',
	SCHEMA = {fn : 'string'},
	FAIL = function (data) {
		ok(false, 'the global failure callback ran, got: ' + data);
		start();
	};

	module('Enhance');

	test('enhance', 6, function () {

		stop();

		var collection,
		win = function () {

			deepEqual(typeof collection.getName, 'undefined', 'getName should not exist prior to enhancement');

			collection.enhance('getName', function(){
				return this.name;
			});

			deepEqual(typeof collection.getName, 'function', 'getName should be a function');

			deepEqual(collection.getName(), COLLECTION_NAME, 'got the right name');

			collection.enhance('find', function(){
				return 'hello';
			});

			notDeepEqual(collection.find(), 'hello', 'should not be able to overwrite existing methods');

			collection.enhance('helloWorld', 'hey');

			deepEqual(typeof collection.helloWorld, 'undefined', 'you must send a function, not a string');

			collection.enhance(0, function(){});

			deepEqual(typeof collection[0], 'undefined', 'you must send a string for the name, not an object');

			start();

		};

		collection = model.initCollection(COLLECTION_NAME, SCHEMA, {onSuccess: win, onFailure: FAIL});

	});

})();