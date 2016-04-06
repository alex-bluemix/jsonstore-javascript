/*global test, stop, module, deepEqual, start*/
/*jshint maxparams: 5*/
(function(jQuery) {

	'use strict';

	var cb = JSONStoreUtil.callback,
	$ = jQuery;

	module('Callback');

/*	Methods tested:
	generate : __setcallbacks
	*/

	var SUCCESS_STATUS = 0,
	FAILURE_STATUS = -1,
	SUCCESS_DATA = {data: 'mySuccessData'},
	FAILURE_DATA = {data: 'myFailureData'},
	TIMEOUT = 5, //ms
	COLLECTION_NAME = 'myCollection',
	SUCCESS_EVENT = 'JSONSTORE/CALLBACK-TEST/SUCCESS',
	FAILURE_EVENT = 'JSONSTORE/CALLBACK-TEST/FAILURE',
	EVENT_LABELS = {success: SUCCESS_EVENT, failure: FAILURE_EVENT};

	test('generate', 12, function () {

		stop();

		var options = {};

		options.onSuccess = function (status, data) {

			deepEqual(status, 0, 'calback - got success');
			deepEqual(data, SUCCESS_DATA, 'should get right data');
		};

		options.onFailure = function (status, data) {

			deepEqual(status, -1, 'callback - got failure');
			deepEqual(data, FAILURE_DATA, 'should get right data');
		};

		//The first parameter in the events is 'evt',
		//that an event object that always gets passed.
		//The following parameters should be ours.

		$(document.body).bind(SUCCESS_EVENT, function(evt, status, src, collectionName, data) {

			deepEqual(status, 0, 'event - got success');

			deepEqual(src, 'callback-test', 'event - got success src ' + src);

			deepEqual(collectionName, COLLECTION_NAME, 'should got the right collectionName ' + collectionName);

			deepEqual(data, SUCCESS_DATA, 'should get right data');

		});

		$(document.body).bind(FAILURE_EVENT, function(evt, status, src, collectionName, data) {

			deepEqual(status, -1, 'event - got failure');

			deepEqual(src, 'callback-test', 'event - got failure src');

			deepEqual(collectionName, COLLECTION_NAME, 'should got the right collectionName');

			deepEqual(data, FAILURE_DATA, 'should get right data');

		});

		var callbacks = cb.generate(options, EVENT_LABELS, 'callback-test', COLLECTION_NAME, null),
		onSuccess = callbacks.onSuccess,
		onFailure = callbacks.onFailure;

		onSuccess(SUCCESS_STATUS, SUCCESS_DATA);
		onFailure(FAILURE_STATUS, FAILURE_DATA);

		setTimeout(function(){
			start();
		}, TIMEOUT);

	});

})(JQ);