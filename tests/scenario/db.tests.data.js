/*global test, module, deepEqual, ok, start, stop, deepEqual*/

/*
 * Test non-uniform data:
 * - Records that do not have all the keys defined in the schema
 * - Records that do not all have the same fields
 */
(function() {

	'use strict';

	//Dependencies:
	var model = JSONStore;

	var modelInstance;

	var COLLECTION = 'testStrangeData';
	var SCHEMA = {'index1' : 'string', 'index2.nested' : 'string', 'fn' : 'string'};
	var DATA = [{'index1' : 'record1', 'index2' : {'nested' : 'nest1', 'subindex' : 'nest2'}}, {'fn' : 'carlos', 'age' : '13'},
	{'fn' : 'jeff', 'ln' : 'barrett', 'index2' : {'nested' : 'jlbnest'}}, {'index1' : 'record2', 'fn' : 'jeremy'}];


	var fail = function (err) {
		ok(false, 'Failed with: ' + err + ' ' + model.getErrorMessage(err));
		start();
	};

	module('Non-Uniform Data');

	test('Create Model', 1, function(){
		stop();

		var winInit = function(data){
			deepEqual(data, 0, 'new collection');
			start();
		};

		var options = { onSuccess: winInit, onFailure: fail, dropCollection: true};

		modelInstance = JSONStore.initCollection(COLLECTION, SCHEMA, options);

	});

	test('Store', 1, function() {

		stop();

		var winStore = function(data){
			deepEqual(data, 4, 'Expected for number of records stored: ' + 4);
			start();
		};
		modelInstance.store(DATA, {onSuccess: winStore, onFailure: fail});

	});

	test('Local Count', 1, function() {

		stop();

		var winpushRequiredCount = function(data){
			deepEqual(data, 0, 'Modification count should be 0');
			start();
		};
		modelInstance.pushRequiredCount({onSuccess: winpushRequiredCount, onFailure: fail});
	});

	test('isPushRequired', 1, function() {

		stop();

		var isPushRequired = function(data){
			deepEqual(data, 0, 'isPushRequired should have returned 0 ' + data);
			start();
		};

		modelInstance.isPushRequired(1, {onSuccess: isPushRequired, onFailure: fail});

	});

	test('Find by string', 1, function() {

		stop();

		var winFind = function(data){
			deepEqual(data.length, 1, 'Expected matches for record1: ' + 1);
			start();
		};

		modelInstance.find({index1: 'record1'}, {onSuccess: winFind, onFailure: fail});
	});


	test('Find All', 1, function() {

		stop();

		var winFindAll = function(data){
			deepEqual(data.length, 4, 'Find all should return : ' + 4);
			start();
		};

		modelInstance.findAll({onSuccess: winFindAll, onFailure: fail});
	});

	test('Add', 1, function() {
		stop();

		var winAdd = function(data) {
			deepEqual(data, 1, 'Added one record');
			start();
		};

		modelInstance.add({index1 : 'newrecord', fn : 'fama', ln : 'stress'}, {onSuccess: winAdd, onFailure: fail});
	});

	test('Find added by key index1', 4, function() {
		stop();

		var winFindRecords = function(data) {
			deepEqual(data.length, 1);
			deepEqual(data[0].json.index1, 'newrecord');
			deepEqual(data[0].json.fn, 'fama');
			deepEqual(data[0].json.ln, 'stress');
			start();
		};

		modelInstance.find({index1 : 'newrecord'}, {onSuccess: winFindRecords, onFailure: fail});
	});

	test('Find added by key fn', 4, function() {
		stop();

		var winFindSomeRecords = function(data) {
			deepEqual(data.length, 1);
			deepEqual(data[0].json.index1, 'newrecord');
			deepEqual(data[0].json.fn, 'fama');
			deepEqual(data[0].json.ln, 'stress');
			start();
		};

		modelInstance.find({fn : 'fama'}, {onSuccess: winFindSomeRecords, onFailure: fail});
	});


})();