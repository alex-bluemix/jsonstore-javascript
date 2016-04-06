/*global module, deepEqual, ok, start, test, stop*/
(function() {

	'use strict';

	//Dependencies:
	var model = JSONStore;

	var fail = function (err) {
		ok(false, 'Failed with: ' + err + ' ' + model.getErrorMessage(err));
		start();
	};

	var mI;

	module('Refresh');
	 
	test('storing data and testing refresh', 5, function () {
		stop();

		var checkTheQueue2 = function (queueSize) {
			deepEqual(queueSize, 0, 'using refresh should not modify the contents of the push queue');
			start();
		};

		var refreshSuccessfullyCalled = function (data) {
			deepEqual(data, 1, '1 doc modified');
			mI.pushRequiredCount({onSuccess:checkTheQueue2, onFailure:fail});
		};

		var checkTheQueue = function (queueSize) {
			deepEqual(queueSize, 0, 'store should not incremente the queueSize');
			mI.refresh({_id: 1, json:{fn: 'karl'}}, {onSuccess: refreshSuccessfullyCalled, onFailure:fail});
		};

		var storeSuccessfullyCalled = function (data) {
			deepEqual(data, 1, '1 stored');
			mI.pushRequiredCount({onSuccess:checkTheQueue, onFailure:fail});

		};

		var modelCreationSuccess = function (data) {
			deepEqual(data, 0, 'new collection');
			mI.store([{fn: 'carlos'}], {onSuccess: storeSuccessfullyCalled, onFailure:fail});
		};

		var COLLECTION_NAME = 'refresh';
		var SCHEMA = {fn: 'string'};
		
		mI = model.initCollection(COLLECTION_NAME, SCHEMA, {dropCollection:true,
				onSuccess:modelCreationSuccess, onFailure:fail});

	});

})();