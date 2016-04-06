	/*global module, test, ok, asyncTest, deepEqual, notDeepEqual, start, stop */
	/*jshint maxparams: 7*/

	(function() {

		'use strict';
		//Dependencies:
		var model = JSONStore;

		var globalModel;

		var SCHEMA = {'fn': 'string', 'ln' : 'string', 'age' : 'integer'};
		var COLLECTION = 'find';
		var DATA = [{fn: 'carlos', ln: 'andreu', age: 13}, {fn: 'jeremy', ln: 'nortey', age: 14}];
		var UNDEF;

		module('Find');

		var fail = function(err){
			ok(false, 'Failed with: ' + err + ' ' + model.getErrorMessage(err));
			start();
		};

		var expectedFail = function(data){
			deepEqual(data, 6, 'generic expected failure callback ' + data);
			start();
		};

		var expectedFailInvalidField = function(data){
			deepEqual(data, 22, 'generic expected failure callback ' + data);
			start();
		};

		var checks = function(msg, data, resultid, originalid, fn, ln, age){
			deepEqual(data[resultid].json, DATA[originalid], 'found the right data ' + msg);
			deepEqual(data[resultid].json.fn, fn, 'found correct fn ' + msg);
			deepEqual(data[resultid].json.ln, ln, 'found correct ln ' + msg);
			deepEqual(data[resultid].json.age, age, 'found correct age' + msg);
		};

		var finishedSearchingFnNoStart = function (msg, data) {
			checks(msg, data, 0, 0, 'carlos', 'andreu', 13);
		};

		var finishedSearchingLn = function (msg, data) {
			checks(msg, data, 0, 0, 'carlos', 'andreu', 13);
			start();
		};

		var finishedSearchingAge = function (msg, data) {
			checks(msg, data, 0, 0, 'carlos', 'andreu', 13);
			start();
		};

		var finishedSearchingNonExistant = function (msg, data) {
			deepEqual(data, [], 'return value should be an empty array, ret value is: '+JSON.stringify(data));
			deepEqual(data.length, 0, 'no items should exist with that search query ' + msg);
			start();
		};

		var finishedSearchingFnOtherUser = function (msg, data) {
			checks(msg, data, 0, 1, 'jeremy', 'nortey', 14);
			start();
		};


		asyncTest('Test fuzzy search', 11, function () {

			var DATA = [{fn: 'carlos'}, {fn: 'tim'}, {fn: 'jeff'},
					{fn: 'raj'}, {fn: 'jeremy'}, {fn: 'bill'},
					{fn: 'lizet'}, {fn: 'mike'}, {fn: 'jeremy'},
					{fn: 'paul'}, {fn: 'curtiss'}, {fn: 'barbara'}]; //len = 12

			var modelInstance;

			var findAllWithAr = function (data) {

				deepEqual(data.length, 2, 'findAllWithAr');

				deepEqual(data[0].json.fn, 'carlos', 'findAllWithAr-carlos');
				deepEqual(data[1].json.fn, 'barbara', 'findAllWithAr-barbara');
				start();
			};

			var findAllWithJ = function (data) {

				deepEqual(data.length, 4, 'findAllWithJ-length');

				deepEqual(data[0].json.fn, 'jeff', 'findAllWithJ-jeff');
				deepEqual(data[1].json.fn, 'raj', 'findAllWithJ-raj');
				deepEqual(data[2].json.fn, 'jeremy', 'findAllWithJ-jeremy');
				deepEqual(data[3].json.fn, 'jeremy', 'findAllWithJ-jeremy-2');

				modelInstance.find({fn: 'ar'}, {onFailure: fail, onSuccess: findAllWithAr});
			};

			var finAllWin = function (data) {
				deepEqual(data.length, DATA.length, 'findAllWin');

				modelInstance.find({fn: 'j'}, {onFailure: fail, onSuccess: findAllWithJ});
			};

			var storeWin = function (count) {
				deepEqual(count, DATA.length, 'storeWin');
				modelInstance.findAll({onFailure: fail, onSuccess: finAllWin});
			};

			var initWin = function (status) {
				deepEqual(status, 0, 'initWin');
				modelInstance.store(DATA, {onFailure: fail, onSuccess: storeWin});
			};

			modelInstance = model.initCollection('fuzzySeachCollection', {fn: 'string'},
				{dropCollection: true, onFailure: fail, onSuccess: initWin});

		});

		test('Find: empty collection, empty query obj', 2, function(){
			var modelInstance;
			stop();

			var findWin = function (data) {
				deepEqual(data.length, 0, 'length of data should be 0');
				start();
			};

			var initWin = function(data){
				deepEqual(data, 0, 'create new collection');
				modelInstance.find({}, {onSuccess: findWin, onFailure: fail});
			};

			var options = { onSuccess: initWin, onFailure: fail, dropCollection: true};

			modelInstance = model.initCollection(COLLECTION, SCHEMA, options);

		});

		test('Store data to collection', 10, function(){
			stop();

			var initWin = function(data){
				deepEqual(data, 1, 'init existing collection');
				globalModel.store(DATA)

				.then(function(data){
					deepEqual(data, 2, 'Stored: ' + data);
					return globalModel.find({fn: 'carlos'});
				})

				.then(function(data){
					finishedSearchingFnNoStart('fn:\'carlos\'', data);
					return globalModel.find({FN: 'carlos'});
				})

				.then(function(data){
					//Behavior diff for the browser, this search will NOT match in the browser
					finishedSearchingFnNoStart('FN:\'carlos\'', data);
					start();
				})

				.fail(fail);
			};

			var options = { onSuccess: initWin, onFailure: fail, dropCollection: false};

			globalModel = model.initCollection(COLLECTION, SCHEMA, options);

		});

		/**
		*	Depend on 2 records in the global model instance then run a whole bunch of find queries
		*
		*/

		test('find ln: andreu', 4, function(){
			stop();
			globalModel.find({ln: 'andreu'},
			{
				onSuccess: function (data) { finishedSearchingLn('fn:\'andreu\'', data); },
				onFailure: fail
			});
		});

		test('find age: 13', 4, function(){
			stop();
			globalModel.find({age: 13},
			{
				onSuccess: function (data) { finishedSearchingAge('age:13', data); },
				onFailure: fail
			});
		});

		test('find age: 9000', 2, function(){
			stop();
			globalModel.find({age: 9000},
			{
				onSuccess: function (data) { finishedSearchingNonExistant('age:9000', data); },
				onFailure: fail
			});
		});

		test('find nonExistantKey', 1, function(){
			stop();
			globalModel.find({nonExistantKey: 'nonExistantValue'},
			{
				onSuccess:  fail,
				onFailure: expectedFailInvalidField
			});

		});
		test('find fn: null', 1, function(){
			stop();
			globalModel.find({fn: null},
			{
				onSuccess: fail,
				onFailure: expectedFail
			});

		});
		test('find fn: []', 1, function(){
			stop();
			globalModel.find({fn: []},
			{
				onSuccess: fail,
				onFailure: expectedFail
			});

		});
		test('find fn: {}', 1, function(){
			stop();
			globalModel.find({fn: {}},
			{
				onSuccess: fail,
				onFailure: expectedFail
			});

		});
		test('find fn:true', 2, function(){
			stop();
			globalModel.find({fn: true},
			{
				onSuccess: function (data) { finishedSearchingNonExistant('fn:true', data); },
				onFailure: fail
			});

		});
		test('Find UNDEF', 1, function(){
			stop();
			globalModel.find(UNDEF,
			{
				onSuccess: fail,
				onFailure: expectedFail
			});

		});
		test('find fn: jeremy', 4, function(){
			stop();
			globalModel.find({fn: 'jeremy'},
			{
				onSuccess: function (data) { finishedSearchingFnOtherUser('fn:jeremy', data); },
				onFailure: fail
			});

		});

		asyncTest('testing if we are indexing correctly',4, function () {

			var mI;

			var find2Win = function (docs) {
				deepEqual(docs.length, 1, 'find2Win: searching for fn, indexed: FN');
				start();
			};

			var find1Win = function (docs) {
				deepEqual(docs.length, 1, 'find1Win: searching for FN, indexed: FN');
				mI.find({fn: 'tim'}, {onFailure: fail, onSuccess: find2Win});
			};

			var storeWin = function (count) {
				deepEqual(count, 2, 'storeWin');
				mI.find({FN: 'carlos'}, {onFailure: fail, onSuccess: find1Win});
			};

			var initWin = function (status) {
				deepEqual(status, 0, 'initWin - new collection');
				mI.store([{FN: 'carlos'}, {fn: 'tim'}], {onFailure: fail, onSuccess: storeWin});
			};

			mI = model.initCollection('indexingCorrectly1343', {FN: 'string'},
				{onFailure: fail, onSuccess: initWin});

		});

		asyncTest('test limit', 4, function () {

			var mI;

			var find2Win = function (docs) {
				deepEqual(docs.length, 20, 'find no limit win');
				start();
			};

			var find1Win = function (docs) {
				deepEqual(docs.length, 5, 'find Limit 5 win');
				mI.find({fn: 'carlos'}, {onFailure: fail, onSuccess: find2Win});
			};

			var storeWin = function (count) {
				deepEqual(count, 20, 'storeWin');
				mI.find({fn: 'carlos'}, {onFailure: fail, onSuccess: find1Win, limit : 5});
			};

			var initWin = function (status) {
				deepEqual(status, 0, 'init worked');
				var carloses = [];
				for (var i = 0; i < 20; i++) {
					carloses.push({fn: 'carlos'});
				}
				mI.store(carloses, {onFailure: fail, onSuccess: storeWin});
			};

			mI = model.initCollection('limit123', {fn: 'string'},
				{onFailure: fail, onSuccess: initWin});

		});

		asyncTest('test limit bigger than count', 4, function () {

			var mI;

			var find2Win = function (docs) {
				deepEqual(docs.length, 20, 'find no limit win');
				start();
			};

			var find1Win = function (docs) {
				deepEqual(docs.length, 20, 'find Limit 9999 win');
				mI.find({fn: 'carlos'}, {onFailure: fail, onSuccess: find2Win});
			};

			var storeWin = function (count) {
				deepEqual(count, 20, 'storeWin');
				mI.find({fn: 'carlos'}, {onFailure: fail, onSuccess: find1Win, limit : 9999});
			};

			var initWin = function (status) {
				deepEqual(status, 0, 'init worked');
				var carloses = [];
				for (var i = 0; i < 20; i++) {
					carloses.push({fn: 'carlos'});
				}
				mI.store(carloses, {onFailure: fail, onSuccess: storeWin});
			};

			mI = model.initCollection('limitBig', {fn: 'string'},
				{onFailure: fail, onSuccess: initWin});

		});


		asyncTest('test limit 0', 4, function () {

			var mI;

			var find2Win = function (docs) {
				deepEqual(docs.length, 20, 'find no limit win');
				start();
			};

			var find1Win = function (docs) {
				deepEqual(docs.length, 0, 'find Limit 0 win');
				mI.find({fn: 'carlos'}, {onFailure: fail, onSuccess: find2Win});
			};

			var storeWin = function (count) {
				deepEqual(count, 20, 'storeWin');
				mI.find({fn: 'carlos'}, {onFailure: fail, onSuccess: find1Win, limit : 0});
			};

			var initWin = function (status) {
				deepEqual(status, 0, 'init worked');
				var carloses = [];
				for (var i = 0; i < 20; i++) {
					carloses.push({fn: 'carlos'});
				}
				mI.store(carloses, {onFailure: fail, onSuccess: storeWin});
			};

			mI = model.initCollection('limitZero', {fn: 'string'},
				{onFailure: fail, onSuccess: initWin});

		});

		asyncTest('test limit negative', 12, function () {

			var mI;

			var negativeLimitWin = function (data) {
				deepEqual(data.length, 9, 'negative limit worked');
				var startId = 20;
				for(var i =0, len = data.length; i < len; i++){
					deepEqual(data[i]._id, startId, 'Expected only the last 9 values in descending order');
					--startId;
				}
				start();
			};

			var storeWin = function (count) {
				deepEqual(count, 20, 'storeWin');
				mI.find({fn: 'carlos'}, {onSuccess: negativeLimitWin, onFailure : fail, limit : -9});
			};

			var initWin = function (status) {
				deepEqual(status, 0, 'init worked');
				var carloses = [];
				for (var i = 0; i < 20; i++) {
					carloses.push({fn: 'carlos'});
				}
				mI.store(carloses, {onFailure: fail, onSuccess: storeWin});
			};

			mI = model.initCollection('limitNeg', {fn: 'string'},
				{onFailure: fail, onSuccess: initWin});

		});


		asyncTest('test limit negative 2', 8, function () {

			var mI;

			var negativeLimitWin = function (data) {
				deepEqual(data.length, 5, 'negative limit worked');
				var startId = 5;
				for(var i =0, len = data.length; i < len; i++){
					deepEqual(data[i]._id, startId, 'Expected only the last 9 values in descending order');
					--startId;
				}
				start();
			};

			var storeWin = function (count) {
				deepEqual(count, 5, 'storeWin');
				mI.find({fn: 'tim'}, {onSuccess: negativeLimitWin, onFailure : fail, limit : -9});
			};

			var initWin = function (status) {
				deepEqual(status, 0, 'init worked');
				var tims = [];
				for (var i = 0; i < 5; i++) {
					tims.push({fn: 'tim'});
				}
				mI.store(tims, {onFailure: fail, onSuccess: storeWin});
			};

			mI = model.initCollection('limitNeg2', {fn: 'string'},
				{onFailure: fail, onSuccess: initWin});

		});




		asyncTest('test limit and offset', 9, function () {
			// Add 20 objects, find 10-15 using limit and offset
			var mI;

			var find2Win = function (docs) {
				deepEqual(docs.length, 20, 'find no limit win');
				start();
			};

			var find1Win = function (docs) {
				var l = docs.length,
					s = 15;
				deepEqual(l, 5, 'find Limit 5 win');
				while(l > 0){
					deepEqual(docs[l-1].json.fn, 'tim' + s, 'expected docs 10-15');
					s--;
					l--;
				}
				mI.find({fn: 'tim'}, {onFailure: fail, onSuccess: find2Win});
			};

			var storeWin = function (count) {
				deepEqual(count, 20, 'storeWin');
				mI.find({fn: 'tim'}, {onFailure: fail, onSuccess: find1Win, limit : 5, offset: 10});
			};

			var initWin = function (status) {
				deepEqual(status, 0, 'init worked');
				var carloses = [];
				for (var i = 1; i <= 20; i++) {
					carloses.push({fn: 'tim' + i});
				}
				mI.store(carloses, {onFailure: fail, onSuccess: storeWin});
			};

			mI = model.initCollection('limitOffset345', {fn: 'string'},
				{onFailure: fail, onSuccess: initWin});

		});

		asyncTest('trying to send only offset', 3, function () {

			var mI;

			var offsetExpectedFailure = function (err) {
				deepEqual(err, -9, 'offsetExpectedFailure');
				start();
			};

			var storeWin = function (count) {
				deepEqual(count, 20, 'storeWin');
				mI.find({fn: 'tim'}, {onFailure: offsetExpectedFailure, onSuccess: fail, offset: 10});
			};

			var initWin = function (status) {
				deepEqual(status, 0, 'init worked');
				var carloses = [];
				for (var i = 1; i <= 20; i++) {
					carloses.push({fn: 'tim' + i});
				}
				mI.store(carloses, {onFailure: fail, onSuccess: storeWin});
			};

			mI = model.initCollection('limitOffset345123', {fn: 'string'},
				{onFailure: fail, onSuccess: initWin});

		});


		asyncTest('Find with an array of queries', 9, function () {

				var c = JSONStore.initCollection('findArr1', {fn: 'string'});

				c.promise

				.then(function (res) {
					deepEqual(res, 0, 'init');
					return c.store([{fn: 'carlos'}, {fn: 'tim'}, {fn: 'raj'}]);
				})

				.then(function (res) {
					deepEqual(res, 3, 'store obj');
					return c.count();
				})

				.then(function (res) {
					deepEqual(res, 3, 'count should be 3');
					return c.find([{fn: 'tim'}, {fn: 'raj'}]);
				})

				.then(function (res) {
					deepEqual(res.length, 2, 'found 2 docs');
					deepEqual(res[0], {_id:2, json: {fn: 'tim'}});
					deepEqual(res[1], {_id:3, json: {fn: 'raj'}});
					//ensure the ordering is correct
					return c.find([{fn: 'raj'}, {fn: 'tim'}]);
				})
				.then(function (res) {
					deepEqual(res.length, 2, 'found 2 docs');
					deepEqual(res[0], {_id:3, json: {fn: 'raj'}});
					deepEqual(res[1], {_id:2, json: {fn: 'tim'}});
					start();
				})

				.fail(function (obj) {
					ok(false, 'failure is not an option' + obj.toString());
					start();
				});

			});//async test end


		asyncTest('Find with an array with miss', 5, function () {

				var c = JSONStore.initCollection('findArr2', {fn: 'string'});

				c.promise

				.then(function (res) {
					deepEqual(res, 0, 'init');
					return c.store([{fn: 'carlos'}, {fn: 'tim'}, {fn: 'raj'}]);
				})

				.then(function (res) {
					deepEqual(res, 3, 'store obj');
					return c.count();
				})

				.then(function (res) {
					deepEqual(res, 3, 'count should be 3');
					return c.find([{fn: 'tim'}, {fn: 'XXXXXXX'}]);
				})

				.then(function (res) {
					deepEqual(res.length, 1, 'found 1 docs');
					deepEqual(res[0], {_id:2, json: {fn: 'tim'}});
					start();
				})

				.fail(function (obj) {
					ok(false, 'failure is not an option' + obj.toString());
					start();
				});

			});//async test end

		asyncTest('Find with an array with bad field', 6, function () {

				var c = JSONStore.initCollection('findArr3', {fn: 'string'});

				c.promise

				.then(function (res) {
					deepEqual(res, 0, 'init');
					return c.store([{fn: 'carlos'}, {fn: 'tim'}, {fn: 'raj'}]);
				})

				.then(function (res) {
					deepEqual(res, 3, 'store obj');
					return c.count();
				})

				.then(function (res) {
					deepEqual(res, 3, 'count should be 3');
					return c.find([{fn: 'tim'}, {badKey: 'raj'}]);
				})

				.then(function (res) {
					ok(false, 'the previous query should not have worked, res: ' + res);
					start();
				})

				.fail(function (error) {
					deepEqual(error.err, 22, 'expecting 22');
					deepEqual(error.src, 'find', 'find');
					deepEqual(error.usr, 'jsonstore', 'expecting default user');
					start();
				});

			});//async test end


		asyncTest('Find with an array of all the things query', 7, function () {

				var c = JSONStore.initCollection('findArr4', {fn: 'string'});

				c.promise

				.then(function (res) {
					deepEqual(res, 0, 'init');
					return c.store([{fn: 'carlos'}, {fn: 'tim'}, {fn: 'raj'}]);
				})

				.then(function (res) {
					deepEqual(res, 3, 'store obj');
					return c.count();
				})

				.then(function (res) {
					deepEqual(res, 3, 'count should be 3');
					return c.find([{}]);
				})

				.then(function (res) {
					deepEqual(res.length, 3, 'found 3 docs');
					deepEqual(res[0], {_id:1, json: {fn: 'carlos'}});
					deepEqual(res[1], {_id:2, json: {fn: 'tim'}});
					deepEqual(res[2], {_id:3, json: {fn: 'raj'}});
					start();
				})

				.fail(function (obj) {
					ok(false, 'failure is not an option' + obj.toString());
					start();
				});

			});//async test end

		asyncTest('Find with an empty array', 4, function () {

				var c = JSONStore.initCollection('findArr5', {fn: 'string'});

				c.promise

				.then(function (res) {
					deepEqual(res, 0, 'init');
					return c.store([{fn: 'carlos'}, {fn: 'tim'}, {fn: 'raj'}]);
				})

				.then(function (res) {
					deepEqual(res, 3, 'store obj');
					return c.count();
				})

				.then(function (res) {
					deepEqual(res, 3, 'count should be 3');
					return c.find([]);
				})

				.then(function (res) {
					deepEqual(res, [], 'empty array should be returned');
					start();
				})

				.fail(function (error) {
					ok(false, 'failure is not an option ' + error.toString());
					start();
				});

			});//async test end


		asyncTest('Find with no dupes', 8, function () {
				var c;

				JSONStore.destroy()
				.then(function(rc){
					deepEqual(rc, 0, 'destroy worked');
					c = JSONStore.initCollection('findArr6', {fn: 'string'});
					return c.promise;
				})

				.then(function (res) {
					deepEqual(res, 0, 'init');
					return c.store([{fn: 'carlos'}, {fn: 'tim'}, {fn: 'raj'}]);
				})

				.then(function (res) {
					deepEqual(res, 3, 'store obj');
					return c.count();
				})

				.then(function () {
					deepEqual(3, 3, 'count should be 3');
					return c.find([{}, {fn: 'tim'}]);
				})

				.then(function (res) {
					//TODO This will fail until native impl changes
					deepEqual(res.length, 3, 'found 3 docs');
					deepEqual(res[0], {_id:1, json: {fn: 'carlos'}});
					deepEqual(res[1], {_id:2, json: {fn: 'tim'}});
					deepEqual(res[2], {_id:3, json: {fn: 'raj'}});
					start();
				})

				.fail(function (error) {
					ok(false, 'failure is not an option ' + error.toString());
					start();
				});

			});//async test end

		asyncTest('Testing exact match strings', 11, function () {

				var collections = {
					people : {
						searchFields : {name: 'string'}
					}
				};

				JSONStore.destroy()

				.then(function (rc) {
					deepEqual(rc, 0, 'destroy');
					return JSONStore.init(collections);
				})

				.then(function (res) {
					deepEqual(res.people.name, 'people', 'init');
					return res.people.add([{name: 'car'}, {name: 'ar'}, {name: 'carlos'}, {name: 'a'}]);
				})

				.then(function (res) {
					deepEqual(res, 4, 'add');
					return JSONStore.get('people').find({name : 'a' }, {exact: true});
				})

				.then(function (res) {
					deepEqual(res.length, 1, 'find "a"');
					deepEqual(res[0].json.name, 'a', 'name 1');
					return JSONStore.get('people').find({name : 'ar'}, {exact: true});
				})

				.then(function (res) {
					deepEqual(res.length, 1, 'find "ar"');
					deepEqual(res[0].json.name, 'ar', 'name 1');
					return JSONStore.get('people').find({name : 'car'}, {exact: true});
				})

				.then(function (res) {
					deepEqual(res.length, 1, 'find "car"');
					deepEqual(res[0].json.name, 'car', 'name 1');
					return JSONStore.get('people').find({name : 'carlos'},{exact: true});
				})

				.then(function (res) {
					deepEqual(res.length, 1, 'find "carlos"');
					deepEqual(res[0].json.name, 'carlos', 'name 1');
					start();
				})

				.fail(function (err) {
					ok(fail, err.toString());
					start();
				});

			});

		asyncTest('Testing exact match integer', 16, function () {

			var collections = {
				people : {
					searchFields : {name: 'integer'}
				}
			};

			JSONStore.destroy()

			.then(function (rc) {
				deepEqual(rc, 0, 'destroy');
				return JSONStore.init(collections);
			})

			.then(function (res) {
				deepEqual(res.people.name, 'people', 'init');
				return res.people.add([{name: 1}, {name: 111}, {name: 1112}, {name: '1112'}, {name: '01'}]);
			})

			.then(function (res) {
				deepEqual(res, 5, 'add');
				return JSONStore.get('people').find({name : 1 }, {exact: true});
			})

			.then(function (res) {
				try {
					deepEqual(res.length, 2, 'search for int 1');
					deepEqual(res[0].json.name, 1, 'name 1');
					deepEqual(res[1].json.name, '01', 'name "01"');
				} catch (e) {
					ok(false, 'Exception: ' + e + ' res: ' + JSON.stringify(res));
				}
				return JSONStore.get('people').find({name : '1'}, {exact: true});
			})

			.then(function (res) {
				try {
					deepEqual(res.length, 2, 'search for str "1"');
					deepEqual(res[0].json.name, 1, 'name 1');
					deepEqual(res[1].json.name, '01', 'name "01"');
				} catch (e) {
					ok(false, 'Exception: ' + e + ' res: ' + JSON.stringify(res));
				}
				return JSONStore.get('people').find({name : 11}, {exact: true});
			})

			.then(function (res) {
				deepEqual(res.length, 0, 'do not fid int 11');
				return JSONStore.get('people').find({name : '01'},{exact: true});
			})

			.then(function (res) {
				deepEqual(res.length, 2, 'search for str "01"');
				try {
					deepEqual(res[0].json.name, 1, 'name 1');
					deepEqual(res[1].json.name, '01', 'name "01"');
				} catch (e) {
					ok(false, 'Exception: ' + e + ' res: ' + JSON.stringify(res));
				}
				return JSONStore.get('people').find({name : 1112},{exact: true});
			})

			.then(function (res) {
				try {
					deepEqual(res.length, 2, 'find 2 for int 1112');
					deepEqual(res[0].json.name, 1112, 'name 1112');
					deepEqual(res[1].json.name, '1112', 'name \'1112\'');
				} catch (e) {
					ok(false, 'Exception: ' + e + ' res: ' + JSON.stringify(res));
				}
				start();
			})

			.fail(function (err) {
				ok(fail, err.toString());
				start();
			});

		});

		asyncTest('Testing exact match number', 15, function () {

			var collections = {
				people : {
					searchFields : {name: 'number'}
				}
			};

			JSONStore.destroy()

			.then(function (rc) {
				deepEqual(rc, 0, 'destroy');
				return JSONStore.init(collections);
			})

			.then(function (res) {
				deepEqual(res.people.name, 'people', 'init');
				return res.people.add([{name: 1.0}, {name: 1}, {name: 0.1112}, {name: '11.12'}, {name: '01.111'}, {name : 0.0000009}]);
			})

			.then(function (res) {
				deepEqual(res, 6, 'add');
				return JSONStore.get('people').find({name : 1 }, {exact: true});
			})

			.then(function (res) {
				deepEqual(res.length, 2, 'results for find int 1');
				deepEqual(res[0].json.name, 1.0, 'name 1.0');
				deepEqual(res[0].json.name, 1, 'name 1');
				return JSONStore.get('people').find({name : '1'}, {exact: true});
			})

			.then(function (res) {
				deepEqual(res.length, 2, 'results for find str "1"');
				deepEqual(res[0].json.name, 1.0, 'name 1.0');
				deepEqual(res[0].json.name, 1, 'name 1');
				return JSONStore.get('people').find({name : 11}, {exact: true});
			})

			.then(function (res) {
				deepEqual(res.length, 0, 'search for int 11');
				return JSONStore.get('people').find({name : 1.0},{exact: true});
			})

			.then(function (res) {
				deepEqual(res.length, 2, 'results for find num 1.0');
				deepEqual(res[0].json.name, 1.0, 'name 1.0');
				deepEqual(res[0].json.name, 1, 'name 1');
				return JSONStore.get('people').find({name : '11.12'},{exact: true});
			})

			.then(function (res) {
				deepEqual(res.length, 1);
				deepEqual(res[0].json.name, '11.12', 'name "1112"');
				start();
			})

			.fail(function (err) {
				ok(fail, err.toString());
				start();
			});

		});

		asyncTest('Testing exact match boolean', 31, function () {

			var collections = {
				people : {
					searchFields : {name: 'boolean'}
				}
			};

			JSONStore.destroy()

			.then(function (rc) {
				deepEqual(rc, 0, 'destroy');
				return JSONStore.init(collections);
			})

			.then(function (res) {
				deepEqual(res.people.name, 'people', 'init');
				return res.people.add([{name: true}, {name: false}, {name: 'true'}, {name: 'false'},
					{name: '0'}, {name: '1'}, {name: 0}, {name: 1}, {name: 'BRO'}]);
			})

			.then(function (res) {
				deepEqual(res, 9, 'add');
				return JSONStore.get('people').find({name : true }, {exact: true});
			})

			.then(function (res) {
				deepEqual(res.length, 3, 'search for boolean true');
				try {
					deepEqual(res[0].json.name, true, 'name bool true');
					//deepEqual(res[1].json.name, 'true', 'name str true');
					deepEqual(res[1].json.name, '1', 'name str 1');
					deepEqual(res[2].json.name, 1, 'name int 1');
				} catch (e) {
					ok(false, 'Exception: ' + e + ' res: ' + JSON.stringify(res));
				}
				return JSONStore.get('people').find({name : 'true'}, {exact: true});
			})

			.then(function (res) {
				try {
					deepEqual(res.length, 1, 'search for str "true"');
					//deepEqual(res[0].json.name, true, 'name bool true');
					deepEqual(res[0].json.name, 'true', 'name str true');
				} catch (e) {
					ok(false, 'Exception: ' + e + ' res: ' + JSON.stringify(res));
				}
				return JSONStore.get('people').find({name : 0}, {exact: true});
			})

			.then(function (res) {
				try {
					deepEqual(res.length, 3, 'search for int 0');
					deepEqual(res[0].json.name, false, 'name bool false');
					//deepEqual(res[1].json.name, 'false', 'name str false');
					deepEqual(res[1].json.name, '0', 'name str 0');
					deepEqual(res[2].json.name, 0, 'name int 0');
				} catch (e) {
					ok(false, 'Exception: ' + e + ' res: ' + JSON.stringify(res));
				}
				return JSONStore.get('people').find({name : '0'},{exact: true});
			})

			.then(function (res) {
				try {
					deepEqual(res.length, 3, 'search for int 0');
					deepEqual(res[0].json.name, false, 'name bool false');
					//deepEqual(res[1].json.name, 'false', 'name str false');
					deepEqual(res[1].json.name, '0', 'name str 0');
					deepEqual(res[2].json.name, 0, 'name int 0');
				} catch (e) {
					ok(false, 'Exception: ' + e + ' res: ' + JSON.stringify(res));
				}
				return JSONStore.get('people').find({name : false},{exact: true});
			})

			.then(function (res) {
				try {
					deepEqual(res.length, 3, 'search for boolean true');
					deepEqual(res[0].json.name, false, 'name bool false');
					//deepEqual(res[1].json.name, 'false', 'name str false');
					deepEqual(res[1].json.name, '0', 'name str 0');
					deepEqual(res[2].json.name, 0, 'name int 0');
				} catch (e) {
					ok(false, 'Exception: ' + e + ' res: ' + JSON.stringify(res));
				}
				return JSONStore.get('people').find({name : 'false'},{exact: true});
			})

			.then(function (res) {
				try {
					deepEqual(res.length, 1, 'search for str "true"');
					//deepEqual(res[0].json.name, false, 'name bool false');
					deepEqual(res[0].json.name, 'false', 'name str false');
				} catch (e) {
					ok(false, 'Exception: ' + e + ' res: ' + JSON.stringify(res));
				}
				return JSONStore.get('people').find({name : 1},{exact: true});
			})

			.then(function (res) {
				try {
					deepEqual(res.length, 3, 'search for boolean true');
					deepEqual(res[0].json.name, true, 'name bool true');
					//deepEqual(res[1].json.name, 'true', 'name str true');
					deepEqual(res[1].json.name, '1', 'name str 1');
					deepEqual(res[2].json.name, 1, 'name int 1');
				} catch (e) {
					ok(false, 'Exception: ' + e + ' res: ' + JSON.stringify(res));
				}
				return JSONStore.get('people').find({name : '1'},{exact: true});
			})

			.then(function (res) {
				try {
					deepEqual(res.length, 3, 'search for boolean true');
					deepEqual(res[0].json.name, true, 'name bool true');
					//deepEqual(res[1].json.name, 'true', 'name str true');
					deepEqual(res[1].json.name, '1', 'name str 1');
					deepEqual(res[2].json.name, 1, 'name int 1');
				} catch (e) {
					ok(false, 'Exception: ' + e + ' res: ' + JSON.stringify(res));
				}
				start();
			})

			.fail(function (err) {
				ok(fail, err.toString());
				start();
			});

		});

		/*
		asyncTest('Testing exact match  Dates', 3, function () {

			var collections = {
				people : {
					searchFields : {name: 'string'}
				}
			},
			now = new Date(),
			before = new Date(now.getTime() - 2000);

			console.log('now ', now, 'before ', before);
			JSONStore.destroy()

			.then(function (rc) {
				deepEqual(rc, 0, 'destroy');
				return JSONStore.init(collections);
			})

			.then(function (res) {
				deepEqual(res.people.name, 'people', 'init');
				return res.people.add([{name: now}, {name: before}]);
			})

			.then(function (res) {
				deepEqual(res, 2, 'add');
				return JSONStore.get('people').find({name : ''+ now }, {exact: true});
			})

			.then(function () {
				ok(false, 'DATES DO NOT WORK YET!!!!');
				// deepEqual(res.length, 1);
				// deepEqual(res[0].json.name, now, 'name now');
				start();
				// return JSONStore.get('people').find({name : 'ar'}, {exact: true});
			})

			// .then(function (res) {
			//	deepEqual(res.length, 1);
			//	deepEqual(res[0].json.name, 'ar', 'name 1');
			//	return JSONStore.get('people').find({name : 'car'}, {exact: true});
			// })

			// .then(function (res) {
			//	deepEqual(res.length, 1);
			//	deepEqual(res[0].json.name, 'car', 'name 1');
			//	return JSONStore.get('people').find({name : 'carlos'},{exact: true});
			// })

			// .then(function (res) {
			//	deepEqual(res.length, 1);
			//	deepEqual(res[0].json.name, 'carlos', 'name 1');
			//	start();
			// })

			.fail(function (err) {
				ok(fail, err.toString());
				start();
			});

		});
	*/
		asyncTest('Testing exact match strings -- Dates', 5, function () {

			var collections = {
				people : {
					searchFields : {name: 'string'}
				}
			},
			now = new Date(),
			before = '' + new Date(now.getTime() - 2000);

			now = '' + now;
			JSONStore.destroy()

			.then(function (rc) {
				deepEqual(rc, 0, 'destroy');
				return JSONStore.init(collections);
			})

			.then(function (res) {
				deepEqual(res.people.name, 'people', 'init');
				return res.people.add([{name: now}, {name: before}]);
			})

			.then(function (res) {
				deepEqual(res, 2, 'add');
				return JSONStore.get('people').find({name : now }, {exact: true});
			})

			.then(function (res) {
				deepEqual(res.length, 1);
				deepEqual(res[0].json.name, now, 'name now');
				start();
			})

			.fail(function (err) {
				ok(fail, err.toString());
				start();
			});

		});


		asyncTest('Testing exact match strings limit and offset', 15, function () {

			var collections = {
				people : {
					searchFields : {name: 'string'}
				}
			};

			JSONStore.destroy()

			.then(function (rc) {
				deepEqual(rc, 0, 'destroy');
				return JSONStore.init(collections);
			})

			.then(function (res) {
				deepEqual(res.people.name, 'people', 'init');
				return res.people.add([{name: 'carloscharlie'}, {name: 'chuckcarlos'}, {name: 'carlos'}, {name: 'brcarlosbr'}, {name: 'carlos'}, {name: 'carlos'}, {name: 'carlos'} ,{name: 'carlos'}]);
			})

			.then(function (res) {
				deepEqual(res, 8, 'add');
				return JSONStore.get('people').find({name : 'carlos'},{exact: true, limit : 2});
			})

			.then(function (res) {
				deepEqual(res.length, 2, 'search carlos limit 2');
				deepEqual(res[0].json.name, 'carlos', 'name carlos');
				deepEqual(res[1].json.name, 'carlos', 'name carlos');
				return JSONStore.get('people').find({name : 'carlos'},{exact: true, limit : 99});
			})

			.then(function (res) {
				deepEqual(res.length, 5, 'search carlos limit 99');
				deepEqual(res[0].json.name, 'carlos', 'name carlos');
				deepEqual(res[1].json.name, 'carlos', 'name carlos');
				deepEqual(res[2].json.name, 'carlos', 'name carlos');
				deepEqual(res[3].json.name, 'carlos', 'name carlos');
				deepEqual(res[4].json.name, 'carlos', 'name carlos');
				return JSONStore.get('people').find({name : 'carlos'},{exact: true, limit : 2, offset: 2});
			})

			.then(function (res) {
				deepEqual(res.length, 2, 'search carlos limit 2 offset 2');
				deepEqual(res[0].json.name, 'carlos', 'name carlos');
				deepEqual(res[1].json.name, 'carlos', 'name carlos');
				start();
			})

			.fail(function (err) {
				ok(fail, err.toString());
				start();
			});

		});


		asyncTest('Exact with multiple fields', 12, function () {

			var collections = {
				people : {
					searchFields : {fn: 'string',
						ln: 'string',
						age: 'integer',
						gpa: 'number',
						active: 'boolean'}
				}
			};

			JSONStore.destroy()

			.then(function (rc) {
				deepEqual(rc, 0, 'destroy');
				return JSONStore.init(collections);
			})

			.then(function (res) {
				deepEqual(res.people.name, 'people', 'init win');
				var carlos = {fn: 'carlos', ln: 'andreu', age: 10, gpa: 1.0, active: true};
				var tim = {fn: 'tim', ln: 'robertson', age: 20, gpa: 1.0, active: false};
				return JSONStore.get('people').add([carlos, tim]);
			})

			.then(function (res) {
				deepEqual(res, 2, 'add 2 worked');
				return JSONStore.get('people').find({fn: 'carlos', ln: 'andreu'}, {exact: true});
			})

			.then(function (res) {
				deepEqual(res.length, 1, 'found fn:carlos ln:andreu');
				try {
					deepEqual(res[0].json.fn, 'carlos', 'fn: carlos');
					deepEqual(res[0].json.ln, 'andreu', 'ln: andreu');
				} catch(e) {
					ok(false, 'Exception: ' + e + ' res: ' + JSON.stringify(res));
				}

				return JSONStore.get('people').find({age: 20, active: false}, {exact: true});
			})

			.then(function (res) {
				deepEqual(res.length, 1, 'found fn:tim ln:robertson');
				try {
					deepEqual(res[0].json.fn, 'tim', 'fn: tim');
					deepEqual(res[0].json.ln, 'robertson', 'ln: robertson');
				} catch(e) {
					ok(false, 'Exception: ' + e + ' res: ' + JSON.stringify(res));
				}

				return JSONStore.get('people').find({gpa: 1.0, age: 10}, {exact: true});
			})

			.then(function (res) {
				deepEqual(res.length, 1, 'found fn:carlos ln:andreu');
				try {
					deepEqual(res[0].json.fn, 'carlos', 'fn: carlos');
					deepEqual(res[0].json.ln, 'andreu', 'ln: andreu');
				} catch(e) {
					ok(false, 'Exception: ' + e + ' res: ' + JSON.stringify(res));
				}

				start();
			})

			.fail(function (err) {
				ok(fail, err.toString());
				start();
			});

		});


		asyncTest('Exact with single level dot fields', 14, function () {

			var collections = {
				people : {
					searchFields : {'name.first': 'string', 'name.age': 'integer'}
				}
			};

			JSONStore.destroy()

			.then(function (rc) {
				deepEqual(rc, 0, 'destroy');
				return JSONStore.init(collections);
			})

			.then(function (res) {
				deepEqual(res.people.name, 'people', 'init win');
				var carlos = {'name.first': 'carlos', 'name.age': 20};
				var tim = {'name.first': 'tim', 'name.age': 20};
				return JSONStore.get('people').add([carlos, tim]);
			})

			.then(function (res) {
				deepEqual(res, 2, 'add 2 worked');
				return JSONStore.get('people').find({'name.first': 'carlos'}, {exact: true});
			})

			.then(function (res) {
				deepEqual(res.length, 1, 'found name.first:carlos name.age:20');
				try {
					deepEqual(res[0].json['name.first'], 'carlos', 'name.first: carlos');
					deepEqual(res[0].json['name.age'], 20, 'name.age: 20');
				} catch(e) {
					ok(false, 'Exception: ' + e + ' res: ' + JSON.stringify(res));
				}

				return JSONStore.get('people').find({'name.age': 20}, {exact: true});
			})

			.then(function (res) {
				deepEqual(res.length, 2, 'found name.age: 20');
				try {
					deepEqual(res[0].json['name.first'], 'carlos', 'name.first: carlos');
					deepEqual(res[0].json['name.age'], 20, 'name.age: 20');
					deepEqual(res[1].json['name.first'], 'tim', 'name.first: tim');
					deepEqual(res[1].json['name.age'], 20, 'name.age: 20');
				} catch(e) {
					ok(false, 'Exception: ' + e + ' res: ' + JSON.stringify(res));
				}

				return JSONStore.get('people').find({'name.first': 'tim', 'name.age': 20}, {exact: true});
			})

			.then(function (res) {
				deepEqual(res.length, 1, 'found name.first:tim name.age:20');
				try {
					deepEqual(res[0].json['name.first'], 'tim', 'name.first: tim');
					deepEqual(res[0].json['name.age'], 20, 'name.age: 20');
				} catch(e) {
					ok(false, 'Exception: ' + e + ' res: ' + JSON.stringify(res));
				}

				start();
			})

			.fail(function (err) {
				ok(fail, err.toString());
				start();
			});

		});

		asyncTest('Exact with MULTI level dot fields', 14, function () {

			var arr = [
				{name: {first: 'carlos', age : 20}},
				{name: {first: 'tim', age: 20}}
			];

			var collections = {
				people : {
					searchFields : {'name.first': 'string', 'name.age': 'integer'}
				}
			};

			JSONStore.destroy()

			.then(function (rc) {
				deepEqual(rc, 0, 'destroy');
				return JSONStore.init(collections);
			})

			.then(function (res) {
				deepEqual(res.people.name, 'people', 'init win');

				return JSONStore.get('people').add(arr);
			})

			.then(function (res) {
				deepEqual(res, 2, 'add 2 worked');
				return JSONStore.get('people').find({'name.first': 'carlos'}, {exact: true});
			})

			.then(function (res) {
				deepEqual(res.length, 1, 'found name.first:carlos name.age:20');
				try {
					deepEqual(res[0].json.name.first, 'carlos', 'name.first: carlos');
					deepEqual(res[0].json.name.age, 20, 'name.age: 20');
				} catch(e) {
					ok(false, 'Exception: ' + e + ' res: ' + JSON.stringify(res));
				}

				return JSONStore.get('people').find({'name.age': 20}, {exact: true});
			})

			.then(function (res) {
				deepEqual(res.length, 2, 'found name.age: 20');
				try {
					deepEqual(res[0].json.name.first, 'carlos', 'name.first: carlos');
					deepEqual(res[0].json.name.age, 20, 'name.age: 20');
					deepEqual(res[1].json.name.first, 'tim', 'name.first: tim');
					deepEqual(res[1].json.name.age, 20, 'name.age: 20');
				} catch(e) {
					ok(false, 'Exception: ' + e + ' res: ' + JSON.stringify(res));
				}

				return JSONStore.get('people').find({'name.first': 'tim', 'name.age': 20}, {exact: true});
			})

			.then(function (res) {
				deepEqual(res.length, 1, 'found name.first:tim name.age:20');
				try {
					deepEqual(res[0].json.name.first, 'tim', 'name.first: tim');
					deepEqual(res[0].json.name.age, 20, 'name.age: 20');
				} catch(e) {
					ok(false, 'Exception: ' + e + ' res: ' + JSON.stringify(res));
				}

				start();
			})

			.fail(function (err) {
				ok(fail, err.toString());
				start();
			});

		});

		asyncTest('Exact with MULTI array with objs indexing', 8, function () {

			var arr = {names : [
				{name: {first: 'car', age : 20}},
				{name: {first: 'carlos', age : 20}},
				{name: {first: 'tim', age: 20}}
			]};

			var collections = {
				people : {
					searchFields : {'names.name.first': 'string', 'names.name.age': 'integer'}
				}
			};

			JSONStore.destroy()

			.then(function (rc) {
				deepEqual(rc, 0, 'destroy');
				return JSONStore.init(collections);
			})

			.then(function (res) {
				deepEqual(res.people.name, 'people', 'init people');
				return JSONStore.get('people').add(arr);
			})

			.then(function (res) {
				deepEqual(res, 1, 'add done');
				return JSONStore.get('people').find({'names.name.first': 'car'}, {exact: true});
			})

			.then(function (res) {
				deepEqual(res.length, 1, 'found doc');
				try {
					deepEqual(res[0].json.names[0].name.first, 'car', 'fn: car');
				} catch(e) {
					ok(false, 'Exception: ' + e + ' res: ' + JSON.stringify(res));
				}
				return JSONStore.get('people').find({'names.name.first': '-@-carlos'}, {exact: true});
			})

			.then(function (res) {
				deepEqual(res.length, 0, 'results of -@-carlos');

				return JSONStore.get('people').find({'names.name.first': 'carlos-@-'}, {exact: true});
			})

			.then(function (res) {
				deepEqual(res.length, 0, 'results of carlos-@-');

				return JSONStore.get('people').find({'names.name.first': '-@-carlos-@-'}, {exact: true});
			})

			.then(function (res) {
				deepEqual(res.length, 0, 'results of -@-carlos-@-');

				start();
			});

		});

		asyncTest('Find using nestedData with case', 5, function() {

			var collections = {
				people : {
					searchFields : {
						'ORDER.ID': 'string'
					}
				}
			};

			var data = [
			{'ORDER': {'ID': 'one'}},
			{'ORDER': {'ID': 'two'}},
			{'ORDER': {'ID': 'three'}}
			];
			
			var options = {exact: true};
			var query = {'ORDER.ID': 'one'};

			JSONStore.destroy()
				.then(function (res) {
					deepEqual(res, 0, 'destroy');
					return JSONStore.init(collections);
				})
				.then(function (res) {
					deepEqual(res.people.name, 'people', 'init');
					return JSONStore.get('people').add(data);
				})
				.then(function (res) {
					deepEqual(res, 3, 'added');
					return JSONStore.get('people').find(query,options);
				})
				.then(function (res) {
					deepEqual(res.length, 1, 'find');
					deepEqual(res[0].json.ORDER.ID, 'one', 'doc');
					start();
				})
				.fail(function (err) {
					ok(fail, err.toString());
					start();
				});

			});
	}(JSON, asyncTest, ok, start, deepEqual, notDeepEqual));