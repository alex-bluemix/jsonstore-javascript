/*global test, module, WL, deepEqual, ok, start, stop, deepEqual*/
(function() {

	'use strict';

	//Dependencies:
	var model = JSONStore;

	var modelInstance;
	var SCHEMA = {'fn': 'string', 'ln' : 'string', 'age' : 'integer'};
	var COLLECTION = 'simple';
	var DATA = [{fn: 'carlos', ln: 'andreu', age: 13}, {fn: 'jeremy', ln: 'nortey', age: 14}];

	var fail = function (err) {
		ok(false, 'Failed with: ' + err + ' ' + model.getErrorMessage(err));
		start();
	};

	module('Simple Tests');

	test('Create JSONStore', 1, function(){
		stop();

		var winInit = function(data){
			deepEqual(data, 0, 'new collection');
			start();
		};

		var options = { onSuccess: winInit, onFailure: fail, dropCollection: true};

		modelInstance = JSONStore.initCollection(COLLECTION, SCHEMA, options);

	});

	test('Remove', 1, function() {
		stop();

		var winRemove = function(data){
			deepEqual(data, 0, 'Collection is ' + COLLECTION);
			start();
		};

		modelInstance.remove({'fn': 'carlos'}, {onSuccess: winRemove, onFailure: fail});
	});

	test('Store', 1, function() {
		stop();

		var winStore = function(data){
			deepEqual(data, 2, 'data: '+data);
			start();
		};

		modelInstance.store(DATA, {onSuccess: winStore, onFailure: fail});

	});

	test('Find by string', 2, function() {
		stop();

		var winFind = function(data){
			deepEqual(data.length, 1, 'data: '+JSON.stringify(data));
			deepEqual(data[0].json.fn, 'carlos', 'got carlos back');
			start();
		};

		modelInstance.find({fn: 'carlos'}, {onSuccess: winFind, onFailure: fail});
	});

	test('Find by integer', 2, function() {
		stop();

		var winFindInt = function(data){
			deepEqual(data.length, 1, 'data: '+JSON.stringify(data));
			deepEqual(data[0].json.fn, 'carlos', 'got carlos back');
			start();
		};

		modelInstance.find({age: 13}, {onSuccess: winFindInt, onFailure: fail});
	});

	test('Replace', 3, function() {
		stop();

		var findWin = function(data){
			deepEqual(data.length, 1, 'data: '+JSON.stringify(data));
			deepEqual(data[0].json.fn, 'KARL', 'got carlos back');
			start();
		};

		var winReplace = function(data){
			deepEqual(data, 1, 'data: '+data);
			modelInstance.find({fn: 'KARL'}, {onFailure:fail, onSuccess:findWin});
		};

		modelInstance.replace({_id: 1, json: {fn: 'KARL', ln: 'ANDREU', age: 99}}, {onSuccess: winReplace, onFailure: fail});
	});

	test('Find all', 1, function() {
		stop();

		var winFindAll = function(data){
			deepEqual(data.length, 2, 'right amount of documents');
			start();
		};

		modelInstance.find({}, {onSuccess: winFindAll, onFailure: fail});
	});


	test('Push Required Count', 1, function() {
		stop();

		var winpushRequiredCount = function(data){
			deepEqual(data, 1, 'data: '+JSON.stringify(data));
			start();
		};

		modelInstance.pushRequiredCount({onSuccess: winpushRequiredCount, onFailure: fail});
	});

	test('isPushRequired', 1, function() {

		stop();

		var win = function(data){
			deepEqual(data, 1, 'isPushRequired should have returned 1');
			start();
		};

		modelInstance.isPushRequired(1, {onSuccess: win, onFailure: fail});

	});

})();