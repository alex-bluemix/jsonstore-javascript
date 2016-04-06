/*global module, deepEqual, asyncTest, ok, start, test, stop*/
(function() {

	'use strict';

	//Dependencies:
	var model = JSONStore;

	//We use the same model Instance during all the tests
	var modelInstance;

	function fail(err) {
		ok(false, 'Failed with: ' + err + ' ' + model.getErrorMessage(err));
		start();
	}

	/************************************************
	Basic Add tests
	*************************************************/

	module('Add');

	test('Provision', 1, function() {
		stop();

		var schemaObj = {fn: 'string', ln : 'string', age : 'integer'};

		var winInit = function(data){
			deepEqual(data, 0, 'result code is: '+data);
			start();
		};

		modelInstance = JSONStore.initCollection('addTests', schemaObj, {onSuccess: winInit, onFailure: fail, dropCollection: true});
	});

	test('StoreBasic', 1, function() {
		stop();

		var dataToStore = [{fn: 'carlos', ln: 'andreu', age: 13}, {fn: 'jeremy', ln: 'nortey', age: 14}];

		var winStore = function(data){
			deepEqual(data, 2, 'Expected should match 2 stores:' + data);
			start();
		};

		modelInstance.store(dataToStore, {onSuccess: winStore, onFailure: fail});

	});

	test('Local Count 0', 1, function() {
		stop();

		var winpushRequiredCount = function(data){
			deepEqual(data, 0, 'Modification count should be 0');
			start();
		};

		modelInstance.pushRequiredCount({onSuccess: winpushRequiredCount, onFailure: fail});
	});

	test('Test count', 1, function() {
		stop();

		var countSuccess = function(data){
			deepEqual(data, 2, 'Expected 2, got: ' + data);
			start();
		};

		modelInstance.count({onSuccess: countSuccess, onFailure: fail});
	});

	test('Add Record', 1, function() {
		stop();

		var addWin = function(data){
			deepEqual(data, 1, 'Expected 1, got:' + data);
			start();
		};

		modelInstance.add({fn: 'jeff', ln: 'barrett', age: 21}, {onSuccess: addWin, onFailure: fail});

	});

	test('Local Count 1', 1, function() {
		stop();

		var winLC = function(data){
			deepEqual(data, 1, 'Modification count should be 1');
			start();
		};

		modelInstance.pushRequiredCount({onSuccess: winLC, onFailure: fail});
	});

	test('Update after add', 2, function() {
		stop();

		var pushReq = function(data) {
			var operation = data[0]._operation;
			deepEqual(operation, 'add', 'Operation should be add not replace: ' + data);
			start();
		};

		var replaceSuccess = function(data) {
			deepEqual(data, 1, 'replace success');
			modelInstance.getPushRequired({onSuccess: pushReq, onFailure: fail});
		};

		var doc = JSONStore.documentify(3, {fn: 'fnUpdated', ln: 'lnUpdated', age: 73});
		modelInstance.replace(doc, {onSuccess: replaceSuccess, onFailure: fail});
	});

	/*********************************************
	 * This test checks the case where something is added locally, then removed before a sync to
	 * the server. The object should be fully removed so that in the sync replay it doesn't waste
	 * time/bandwidth adding and then removing the object.
	 * Add the object, verify that it is waiting to sync, remove the object and make sure there's nothing to sync.
	 ********************************************/
	asyncTest('Remove after add', 7, function() {

		var doc = {fn: 'fnTransient', ln: 'lnTransient', age: 42};

		var nopushSuccess = function(data) {
			deepEqual(data.length, 1, 'Should be 1 items to be pushed');
			start();
		};

		var removeSuccess = function(data) {
			deepEqual(data, 1, 'remove success');
			modelInstance.getPushRequired({onSuccess: nopushSuccess, onFailure: fail});
		};

		var pushReq = function(data) {
			deepEqual(data.length, 2, 'Should be 2 items to be pushed');
			deepEqual(data[1].json.fn, doc.fn, 'right fn');
			deepEqual(data[1].json.ln, doc.ln, 'right ln');
			deepEqual(data[1].json.age, doc.age, 'right age');
			modelInstance.remove(data[1], {onSuccess: removeSuccess, onFailure: fail});
		};

		var addSuccess = function(data) {
			deepEqual(data, 1, 'add success');
			modelInstance.getPushRequired({onSuccess: pushReq, onFailure: fail});
		};

		modelInstance.add(doc, {onSuccess: addSuccess, onFailure: fail});

	});

	asyncTest('Documentify and add', 9, function() {

		var mI,
			docId = 99,
			docData = {fn: 'paul'},
			doc = JSONStore.documentify(docId, docData);

		var findAllWin = function (data) {
			deepEqual(data.length, 1, 'findAllWin');
			deepEqual(data[0]._id, 1);
			deepEqual(data[0].json.json.fn, doc.json.fn);
			start();
		};

		var findWin = function (data) {
			deepEqual(data.length, 0, 'findWin'); //no document with id = 99
			mI.findAll({onFailure: fail, onSuccess: findAllWin});
		};

		var addWin = function (data) {
			deepEqual(data, 1, 'addWin');
			mI.find({_id: docId}, {onFailure: fail, onSuccess: findWin});
		};


		var initWin = function (data) {
			deepEqual(data, 0, 'initWin');
			deepEqual(doc._id, docId, 'right doc id');
			deepEqual(doc.json, docData, 'right doc json obj');
			deepEqual(doc.json.fn, docData.fn, 'right fn');

			mI.add(doc, {onFailure: fail, onSuccess: addWin});
		};

		mI = model.initCollection('docnadd', {fn: 'string'},
			{dropCollection: true, onFailure: fail, onSuccess: initWin});

	});


	asyncTest('Add Stress', 3, function () {
		var mI,
		newData = [];

		var findAllWin = function (data) {
			deepEqual(data.length, 20, 'docs');
			start();

		};
		var addWin = function (data) {
			deepEqual(data, 20, 'addWin');
			mI.findAll({onFailure: fail, onSuccess: findAllWin});
		};

		var randomStr = function(){
			var abc = '0123456789abcdefghijklmnopqrstuvwxyz';
			var res = '';

			for(var j = 0; j < 5; j++){
				res += abc[(Math.random()*abc.length)];
			}
			return res;
		};

		var initWin = function (data) {
			deepEqual(data, 0, 'initWin');

			for(var i = 0; i < 20; i++)
			{
				newData.push({name: randomStr()});
			}

			mI.add(newData, {onFailure: fail, onSuccess: addWin});
		};
		mI = model.initCollection('addPPromisesT', {name: 'string'},
			{dropCollection: true, onFailure: fail, onSuccess: initWin});
	});

	asyncTest('Store and erase with documentify', 12, function() {

		var mI,
			docId = 99,
			docData = {fn: 'paul'},
			doc = JSONStore.documentify(docId, docData);

		var reallyReallyEraseWin = function (data) {
			deepEqual(data, 1, 'reallyReallyEraseWin');
			start();
		};

		var reallyEraseWin = function (data) {
			//this would work if the search key was json.fn instead of fn
			deepEqual(data, 0, 'reallyEraseWin');

			mI.erase({_id: 1}, {onFailure: fail, onSuccess: reallyReallyEraseWin});
		};

		var findAllWin = function (data) {

			if(!Array.isArray(data) || data.length < 1) {
				fail('data is not an array in findAllWin');
			} else {
				deepEqual(data.length, 1, 'findAllWin');
				deepEqual(data[0]._id, 1);
				deepEqual(data[0].json.json.fn, doc.json.fn);

				mI.erase({fn: 'paul'}, {onFailure: fail, onSuccess: reallyEraseWin});
			}
		};

		var findWin = function (data) {
			deepEqual(data.length, 0, 'findWin'); //no document with id = 99
			mI.findAll({onFailure: fail, onSuccess: findAllWin});
		};

		var eraseWin = function (data) {
			deepEqual(data, 0, 'eraseWin'); //no document to erase
			mI.find({_id: docId}, {onFailure: fail, onSuccess: findWin});

		};

		var storeWin = function (data) {
			deepEqual(data, 1, 'storeWin');
			mI.erase({_id: docId}, {onFailure: fail, onSuccess: eraseWin});
		};

		var initWin = function (data) {
			deepEqual(data, 0, 'initWin');
			deepEqual(doc._id, docId, 'right doc id');
			deepEqual(doc.json, docData, 'right doc json obj');
			deepEqual(doc.json.fn, docData.fn, 'right fn');

			mI.store(doc, {onFailure: fail, onSuccess: storeWin});
		};

		mI = model.initCollection('storeAndErase', {fn: 'string'},
			{dropCollection: true, onFailure: fail, onSuccess: initWin});
	});

	asyncTest('Add empty data', 6, function () {
		var mI,
		docId = 99,
		docData = {fn: 'paul'},
		doc = JSONStore.documentify(docId, docData);

		var zeroWin = function (data) {
			deepEqual(data, [{_id: 1, json: {}}], 'zeroWin');
			start();

		};

		var addWin = function (data) {
			deepEqual(data, 1, 'addWin');
			mI.findAll({onFailure: fail, onSuccess: zeroWin});
		};

		var initWin = function (data) {
			deepEqual(data, 0, 'initWin');
			deepEqual(doc._id, docId, 'right doc id');
			deepEqual(doc.json, docData, 'right doc json obj');
			deepEqual(doc.json.fn, docData.fn, 'right fn');

			mI.add({}, {onFailure: fail, onSuccess: addWin});
		};

		mI = model.initCollection('emptyData', {name: 'string', age: 'integer'},
			{dropCollection: true, onFailure: fail, onSuccess: initWin});
	});

	//TODO: refactor so it does not break other tests
	asyncTest('Add empty array data', 5, function () {
		var mI,
		docId = 99,
		docData = {fn: 'paul'},
		doc = JSONStore.documentify(docId, docData);

		var addWin = function (data) {
			deepEqual(data, 0, 'addWin');
			start();
		};

		var initWin = function (data) {
			deepEqual(data, 0, 'initWin');
			deepEqual(doc._id, docId, 'right doc id');
			deepEqual(doc.json, docData, 'right doc json obj');
			deepEqual(doc.json.fn, docData.fn, 'right fn');

			mI.add([], {onFailure: fail, onSuccess: addWin});
		};

		mI = model.initCollection('emptyArrayData', {name: 'string', age: 'integer'},
			{dropCollection: true, onFailure: fail, onSuccess: initWin});

	});


	asyncTest('Add with _id', 1, function () {
		var mI;

		var shouldFail = function (err) {
			deepEqual(err, -12, 'Failed as expected with err code:' + err);
			start();
		};

		var shouldNotWin = function (data) {
			ok(false, 'Should not work since using invalid searchfield', JSON.stringify(data));
			start();
		};

		mI = model.initCollection('addWithID', {_id: 'integer', name: 'string', age: 'integer'},
			{dropCollection: true, onFailure: shouldFail, onSuccess: shouldNotWin});
	});



/*
  //Note - cnandreu: Commented/removed because we no longer enforce this level of sync behavior
	//Test synchronous native code, these tests assume that native will be synchronous so javascript can keep queuing operations
	//and those operations will return to their respective success/failure callbacks in order
	asyncTest('add and find assuming synchronous native code', 19, function () {

		if(typeof browser === 'object'){
			//We can't guarantee synchronous behavior in an all JS impl
			//make sure we have the same number of assertions
			var i = 19;
			while(i--){
				ok(true, 'not implemented in browser, keep assertions the same');
			}
			start();
		}else{

			var DATA = [{fn: 'carlos'}, {fn: 'tim'}, {fn: 'jeff'},
						{fn: 'raj'}, {fn: 'jeremy'}, {fn: 'bill'},
						{fn: 'lizet'}, {fn: 'mike'}, {fn: 'jeremy'},
						{fn: 'paul'}, {fn: 'curtiss'}, {fn: 'barbara'}]; //len: 12

			var ADDITIONAL_DATA = [];
			var len = 100;
			while(len--){
				ADDITIONAL_DATA.push({fn: 'carlos'});
			}

			var mI = model.initCollection('syncTest', {fn: 'string'}, {dropCollection: true, onFailure: fail, onSuccess: function(status){
				deepEqual(status, 0, 'initWin');

				mI.store(DATA, {onFailure: fail, onSuccess: function(count) {
					deepEqual(count, DATA.length, 'storeWin');
				}});

				mI.add(ADDITIONAL_DATA, {onFailure: fail, onSuccess: function(count){
					deepEqual(count, ADDITIONAL_DATA.length, 'addWin');
				}});

				mI.count({onFailure: fail, onSuccess: function (total) {
					deepEqual(total, DATA.length + ADDITIONAL_DATA.length, 'countWin');
				}});

				mI.findAll({onFailure: fail, onSuccess: function (data){

					if (!Array.isArray(data)) {
						fail('not an array in findAllWin');
					} else {
						deepEqual(data.length, DATA.length + ADDITIONAL_DATA.length, 'findAllWin');

						var len = DATA.length;
						for(var i=0; i<len; i++){
							deepEqual(data[i].json.fn, DATA[i].fn, 'found:'+data[i].json.fn);
						}
					}

				}});

				mI.find({fn: 'carlos'},{onFailure: fail, onSuccess: function (results) {
					if (!Array.isArray(results)) {
						fail('not an array in findWin');
					} else {
						deepEqual(results.length, 1 + ADDITIONAL_DATA.length, 'findCarlos-length-check');
						deepEqual(results[0].json.fn, 'carlos', 'findCarlos-check-fn');
					}
					start();
				}});

			}});
		} // end else for ios/Android
	}); ///end test
*/

	//Testing the following defects:
	//13753: Cannot initialize multiple JSON Store normally on iOS
	//13756: The add operation will be failed when using multiple collections in a JSON Store on iOS
	//Test 1: Init 3 collections (inits inside callbacks) -> add data -> find data
	//Test 2: Same as test 1 but all the inits dont happen inside callbacks

	asyncTest('Testing init with different schemas', 9, function () {
		var c1,
			c2,
			c3;

		var find3Win = function (data) {
			deepEqual(data[0].json.age, 99, 'find3Win');
			start();
		};

		var find2Win = function (data) {
			deepEqual(data[0].json.ln, 'andreu', 'find2Win');
			c3.findAll({onFailure: fail, onSuccess: find3Win});
		};

		var find1Win = function (data) {
			deepEqual(data[0].json.fn, 'carlos', 'find1Win');
			c2.findAll({onFailure: fail, onSuccess: find2Win});
		};

		var add3Win = function (count) {
			deepEqual(count, 1, 'add1Win');
			c1.findAll({onFailure: fail, onSuccess: find1Win});
		};

		var add2Win = function (count) {
			deepEqual(count, 1, 'add1Win');
			c3.add({age: 99}, {onFailure: fail, onSuccess: add3Win});
		};

		var add1Win = function (count) {
			deepEqual(count, 1, 'add1Win');
			c2.add({ln: 'andreu'}, {onFailure: fail, onSuccess: add2Win});
		};


		var init3Win = function (status) {
			deepEqual(status, 0, 'init3 new collection');
			c1.add({fn: 'carlos'}, {onFailure: fail, onSuccess: add1Win});
		};

		var init2Win = function (status) {
			deepEqual(status, 0, 'init2 new collection');

			c3 = JSONStore.initCollection('c3', {'age' : 'number'},
					{onFailure: fail, onSuccess:init3Win});
		};

		var init1Win = function (status) {
			deepEqual(status, 0, 'init1 new collection');

			c2 = JSONStore.initCollection('c2', {'ln' : 'string'},
					{onFailure: fail, onSuccess:init2Win});
		};

		c1 = JSONStore.initCollection('c1', {'fn' : 'string'},
				{onFailure: fail, onSuccess:init1Win});
	});

	asyncTest('Adding by parts', 10, function() {
		var collections = {
				customers: {
					searchFields : {name: 'string', age: 'integer'}
				}
			};

		var data = [
			{name: 'carlos', age: 1},
			{name: 'dgonz', age: 2},
			{name: 'jeff', age: 2},
			{name: 'mike', age: 3},
			{name: 'nana', age: 4}
		];


		JSONStore.destroy()

		.then(function (res) {
			deepEqual(res, 0, 'destroy');
			return JSONStore.init(collections);
		})

		.then(function (res) {
			deepEqual(res.customers.name, 'customers');
			return JSONStore.get('customers').add([data[0], data[1]]);
		})

		.then(function (res) {
			deepEqual(res, 2, 'added 2 parts');
			return JSONStore.get('customers').add([data[2], data[3], data[4]]);
		})

		.then(function (res) {
			deepEqual(res, 3, 'added 3 parts');
			return JSONStore.get('customers').findAll();
		})
		.then(function (res) {
			deepEqual(res.length, 5, 'docs');
			deepEqual(res[0].json.name, 'carlos', 'name1');
			deepEqual(res[1].json.name, 'dgonz', 'name2');
			deepEqual(res[2].json.name, 'jeff', 'name3');
			deepEqual(res[3].json.name, 'mike', 'name4');
			deepEqual(res[4].json.name, 'nana', 'name5');
			start();
		})
		.fail(function (err) {
			ok(false, 'Failure is not an option: ' + JSON.stringify(err));
			start();
		});
	});
	
	// for WI55010
	asyncTest('adds in parallel', 13 , function () {

		var JOBSTATE_COLLECTION_NAME = 'JobState';
		var LATESTEVENT_COLLECTION_NAME = 'LatestEvent';
		var DROPDOWN_COLLECTION_NAME = 'DropdownOption';
		var SCOMPONENT_COLLECTION_NAME = 'ScopeItemComponent';
		var BUILDERSMARGIN_COLLECTION_NAME = 'BuilderMargin';
		var QUESTIONBANK_COLLECTION_NAME = 'QuestionBank';
		var SCOPEITEM_COLLECTION_NAME = 'ScopeItem';
		var REPORTBANK_COLLECTION_NAME = 'ReportBank';
		var REPORTQUESTION_COLLECTION_NAME = 'ReportQuestionBank';
		var MINCHARGE_COLLECTION_NAME = 'TradeMinCharge';
		var FASTFACT_COLLECTION_NAME = 'InsurerFastFact';
		var USERLOGIN_COLLECTION_NAME = 'UserLogin';

		var collections = {};
		collections[USERLOGIN_COLLECTION_NAME] = {};
		collections[USERLOGIN_COLLECTION_NAME].searchFields = {name: 'string', age: 'integer'};
		collections[JOBSTATE_COLLECTION_NAME] = {};
		collections[JOBSTATE_COLLECTION_NAME].searchFields = {name: 'string', age: 'integer'};
		collections[LATESTEVENT_COLLECTION_NAME] = {};
		collections[LATESTEVENT_COLLECTION_NAME].searchFields =  {name: 'string', age: 'integer'};
		collections[DROPDOWN_COLLECTION_NAME] = {};
		collections[DROPDOWN_COLLECTION_NAME].searchFields =  {name: 'string', age: 'integer'};
		collections[SCOMPONENT_COLLECTION_NAME] = {};
		collections[SCOMPONENT_COLLECTION_NAME].searchFields =  {name: 'string', age: 'integer'};
		collections[BUILDERSMARGIN_COLLECTION_NAME] = {};
		collections[BUILDERSMARGIN_COLLECTION_NAME].searchFields =  {name: 'string', age: 'integer'};
		collections[QUESTIONBANK_COLLECTION_NAME] = {};
		collections[QUESTIONBANK_COLLECTION_NAME].searchFields =  {name: 'string', age: 'integer'};
		collections[SCOPEITEM_COLLECTION_NAME] = {};
		collections[SCOPEITEM_COLLECTION_NAME].searchFields =  {name: 'string', age: 'integer'};
		collections[REPORTBANK_COLLECTION_NAME] = {};
		collections[REPORTBANK_COLLECTION_NAME].searchFields =  {name: 'string', age: 'integer'};
		collections[REPORTQUESTION_COLLECTION_NAME] = {};
		collections[REPORTQUESTION_COLLECTION_NAME].searchFields =  {name: 'string', age: 'integer'};
		collections[MINCHARGE_COLLECTION_NAME] = {};
		collections[MINCHARGE_COLLECTION_NAME].searchFields =  {name: 'string', age: 'integer'};
		collections[FASTFACT_COLLECTION_NAME] = {};
		collections[FASTFACT_COLLECTION_NAME].searchFields =  {name: 'string', age: 'integer'};

		var data = [
				{name: 'carlos', age: 1},
				{name: 'dgonz', age: 2},
				{name: 'jeff', age: 2},
				{name: 'mike', age: 3},
				{name: 'nana', age: 4},
				{name: 'nana', age: 4},
				{name: 'nana', age: 4},
				{name: 'nana', age: 4},
				{name: 'nana', age: 4},
				{name: 'nana', age: 4},
				{name: 'nana', age: 4},
				{name: 'nana', age: 4},
				{name: 'nana', age: 4},
				{name: 'nana', age: 4},
				{name: 'nana', age: 4},
				{name: 'nana', age: 4},
				{name: 'nana', age: 4},
				{name: 'nana', age: 4},
				{name: 'nana', age: 4},
				{name: 'nana', age: 4},
				{name: 'nana', age: 4},
				{name: 'nana', age: 4},
				{name: 'nana', age: 4},
				{name: 'nana', age: 4},
				{name: 'nana', age: 4},
				{name: 'nana', age: 4},
				{name: 'nana', age: 4},
				{name: 'nana', age: 4},
				{name: 'nana', age: 4},
				{name: 'nana', age: 4},
				{name: 'nana', age: 4},
				{name: 'nana', age: 4},
				{name: 'nana', age: 4},
				{name: 'nana', age: 4},
				{name: 'nana', age: 4},
				{name: 'nana', age: 4},
				{name: 'nana', age: 4},
				{name: 'nana', age: 4},
				{name: 'nana', age: 4},
				{name: 'nana', age: 4},
				{name: 'nana', age: 4},
				{name: 'nana', age: 4},
				{name: 'nana', age: 4},
				{name: 'nana', age: 4},
				{name: 'nana', age: 4},
				{name: 'nana', age: 4},
				{name: 'nana', age: 4},
				{name: 'nana', age: 4},
				{name: 'nana', age: 4},
				{name: 'nana', age: 4},
				{name: 'nana', age: 4},
				{name: 'nana', age: 4},
				{name: 'nana', age: 4},
				{name: 'nana', age: 4},
				{name: 'nana', age: 4},
				{name: 'nana', age: 4},
				{name: 'nana', age: 4},
				{name: 'nana', age: 4},
				{name: 'nana', age: 4},
				{name: 'nana', age: 4},
				{name: 'nana', age: 4},
				{name: 'nana', age: 4},
				{name: 'nana', age: 4},
				{name: 'nana', age: 4},
				{name: 'nana', age: 4},
				{name: 'nana', age: 4},
				{name: 'nana', age: 4},
				{name: 'nana', age: 4},
				{name: 'nana', age: 4},
				{name: 'nana', age: 4},
				{name: 'nana', age: 4},
				{name: 'nana', age: 4},
				{name: 'nana', age: 4},
				{name: 'nana', age: 4},
				{name: 'nana', age: 4},
				{name: 'nana', age: 4},
				{name: 'nana', age: 4},
				{name: 'nana', age: 4},
				{name: 'nana', age: 4},
				{name: 'nana', age: 4},
				{name: 'nana', age: 4},
				{name: 'nana', age: 4},
				{name: 'nana', age: 4},
				{name: 'nana', age: 4},
				{name: 'nana', age: 4}
			];
 
		JSONStore.destroy()
 
		.then(function(res) {
			deepEqual(res, 0, 'destroy');
			return JSONStore.init(collections);
		})
 
		.then(function () {
 
			return JSONStore.startTransaction();
		})

		.then(function() {
				var p1 = JSONStore.get(JOBSTATE_COLLECTION_NAME).add(data, {}),
				p2 = JSONStore.get(LATESTEVENT_COLLECTION_NAME).add(data, {}),
				p3 = JSONStore.get(DROPDOWN_COLLECTION_NAME).add(data, {}),
				p4 = JSONStore.get(SCOMPONENT_COLLECTION_NAME).add(data, {}),
				p5 = JSONStore.get(BUILDERSMARGIN_COLLECTION_NAME).add(data, {}),
				p6 = JSONStore.get(QUESTIONBANK_COLLECTION_NAME).add(data, {}),
				p7 = JSONStore.get(SCOPEITEM_COLLECTION_NAME).add(data, {}),
				p8 = JSONStore.get(REPORTBANK_COLLECTION_NAME).add(data, {}),
				p9 = JSONStore.get(REPORTQUESTION_COLLECTION_NAME).add(data, {}),
				p10 = JSONStore.get(MINCHARGE_COLLECTION_NAME).add(data, {}),
				p11 = JSONStore.get(FASTFACT_COLLECTION_NAME).add(data, {}),
				p12 = JSONStore.get(USERLOGIN_COLLECTION_NAME).add(data, {});
				return $.when.apply(this, [p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, p11, p12]);
		})

		.then(function () {
			try {

			deepEqual(arguments[0][0], 85, 'add1');
			deepEqual(arguments[1][0], 85, 'add2');
			deepEqual(arguments[2][0], 85, 'add3');
			deepEqual(arguments[3][0], 85, 'add4');
			deepEqual(arguments[4][0], 85, 'add5');
			deepEqual(arguments[5][0], 85, 'add6');
			deepEqual(arguments[6][0], 85, 'add7');
			deepEqual(arguments[7][0], 85, 'add8');
			deepEqual(arguments[8][0], 85, 'add9');
			deepEqual(arguments[9][0], 85, 'add10');
			deepEqual(arguments[10][0], 85, 'add11');
			deepEqual(arguments[11][0], 85, 'add12');
			} catch (e) {
				ok(false, 'failed:' + e.toString());
			}
 
		})
		
		.then(function() {
			return JSONStore.commitTransaction();
		})
		
		.then(function() {
			start();
		})
 
		.fail(function (err) {
		ok(false, 'Failure is not an option: ' + err.toString());
		start();
		});
 
		});

	/*
	//Note - cnandreu: Commented/removed because we no longer enforce this level of sync behavior
	asyncTest('Testing init with different schemas - inits outside callbacks', 9, function () {
		var c4,
			c5,
			c6;

		var find6Win = function (data) {
			deepEqual(data[0].json.age, 99, 'find6Win');
			start();
		};

		var find5Win = function (data) {
			deepEqual(data[0].json.ln, 'andreu', 'find5Win');
			c6.findAll({onFailure: fail, onSuccess: find6Win});
		};

		var find4Win = function (data) {
			deepEqual(data[0].json.fn, 'carlos', 'find4Win');
			c5.findAll({onFailure: fail, onSuccess: find5Win});
		};

		var add6Win = function (count) {
			deepEqual(count, 1, 'add6Win');
			c4.findAll({onFailure: fail, onSuccess: find4Win});
		};

		var add5Win = function (count) {
			deepEqual(count, 1, 'add5Win');
			c6.add({age: 99}, {onFailure: fail, onSuccess: add6Win});
		};

		var add4Win = function (count) {
			deepEqual(count, 1, 'add4Win');
			c5.add({ln: 'andreu'}, {onFailure: fail, onSuccess: add5Win});
		};


		var init6Win = function (status) {
			deepEqual(status, 0, 'init6 new collection');
			c4.add({fn: 'carlos'}, {onFailure: fail, onSuccess: add4Win});
		};

		var init5Win = function (status) {
			deepEqual(status, 0, 'init5 new collection');
		};

		var init4Win = function (status) {
			deepEqual(status, 0, 'init4 new collection');
		};

		c4 = JSONStore.initCollection('c4', {'fn' : 'string'},
				{onFailure: fail, onSuccess:init4Win});

		c5 = JSONStore.initCollection('c5', {'ln' : 'string'},
				{onFailure: fail, onSuccess:init5Win});

		c6 = JSONStore.initCollection('c6', {'age' : 'number'},
				{onFailure: fail, onSuccess:init6Win});

	});
*/
})();