/*global module, deepEqual, ok, start, test, stop*/
(function() {

	'use strict';
	
	//Dependencies:
	var model = JSONStore;

	var fail = function (err) {
		ok(false, 'Failed with: ' + err + ' ' + model.getErrorMessage(err));
		start();
	};

	var modelInstance;

	module('Erase');

	test('storing data', 3, function () {
		stop();

		var checkTheCount = function (countSize) {
			deepEqual(countSize, 1, 'store should add 1 document to the DB');
			start();
		};

		var storeSuccessfullyCalled = function (data) {
			deepEqual(data, 1, '1 element stored');
			modelInstance.count({onSuccess:checkTheCount, onFailure:fail});
		};

		var modelCreationSuccess = function (data) {
			deepEqual(data, 0, 'new collection init success');
			modelInstance.store([{fn: 'carlos'}], {onSuccess: storeSuccessfullyCalled, onFailure:fail});
		};


		modelInstance = model.initCollection('erase', {fn: 'string'}, {dropCollection:true,
				onSuccess:modelCreationSuccess, onFailure:fail});

	});

	test('test erase', 3, function () {
		stop();

		var checkTheCount = function (countSize) {
			deepEqual(countSize, 0, 'no docs should be left in the db');
			start();
		};

		var checkTheQueue = function (queueSize) {
			deepEqual(queueSize, 0, 'using erase should not modify the contents of the push queue');
			modelInstance.count({onSuccess:checkTheCount, onFailure:fail});
		};

		var eraseSuccessfullyCalled = function (data) {
			deepEqual(data, 1, 'one element deleted');
			modelInstance.pushRequiredCount({onSuccess:checkTheQueue, onFailure:fail});
		};

		modelInstance.erase(1, {onSuccess: eraseSuccessfullyCalled, onFailure:fail});

	});

})();