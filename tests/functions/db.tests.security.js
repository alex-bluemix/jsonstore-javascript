/*global module, deepEqual, ok, start, asyncTest, test, stop, sinon*/

/*
 Test Security stuff
 */
(function() {

		'use strict';

		//Dependencies:
		var model = JSONStore;

		var modelInstance;

		var SCHEMA = {};
		var COLLECTION = '';
		var DATA = [];

		function fail(err){
			ok(false, 'Failed with: ' + err + ' ' + model.getErrorMessage(err));
			start();
		}

		// EncryptedCache.__proto__.secureRandom = function (onCompleteHandler) {
		//   onCompleteHandler( EncryptedCache.random() );
		// };

		module('Security');

		/*******************************************************************************************
		Basic Security tests
		*******************************************************************************************/
		test('Create model using password', 1, function(){
			stop();

			SCHEMA = {'fn': 'string', 'ln' : 'string', 'age' : 'integer'};
			COLLECTION = 'sectTest1';
			DATA = [{fn: 'carlos', ln: 'andreu', age: 13}, {fn: 'jeremy', ln: 'nortey', age: 14}, {fn: 'tim', ln: 'robertson', age: 15},
			{fn: 'jeff', ln: 'barrett', age: 16}, {fn: 'mike', ln: 'ortman', age: 17}, {fn: 'raj', ln: 'balabla', age: 18}];

			var createSuccessful = function (data) {
				deepEqual(data, 0, 'new collection');
				start();
			};

			var modelOpts = {
				onSuccess: createSuccessful,
				onFailure: fail,
				adapter:
				{ name: 'push_adapter',
				replace: 'updateCustomer',
				remove: 'removeCustomer',
				add:'addCustomer'
				},
				dropCollection: true
			};

			var password1 = 'superSecretPassword';
			model.usePassword(password1);
			modelInstance = model.initCollection(COLLECTION, SCHEMA, modelOpts);
		});

		test('SEC: Store data to encrypted database', 1, function(){
			stop();

			var addSuccessful = function (data) {
				deepEqual(data, 6, 'Data added should be 6. Actual: ' + data);
				start();
			};

			modelInstance.store(DATA, {onSuccess: addSuccessful, onFailure: fail});
		});

		//Do a close all, then re-access the database with the correct PW
		test('Right password test', 2, function(){
			stop();

			var mI;

			var successOnInit2 = function (data) {
				deepEqual(data, 1, 'table should have existed so get a 1');
				start();
			};

			var failureOnInit2 = function (data) {
				ok(false, 'Right password failed with: ' + data + ' ' + model.getErrorMessage(data));
				start();
			};

			var closeAllSuccess = function (data) {
				deepEqual(data, 0, 'closeAllSuccess');
				model.usePassword('superSecretPassword');
				mI = model.initCollection(COLLECTION, SCHEMA,
					{onFailure: failureOnInit2, onSuccess: successOnInit2});
			};

			model.closeAll({onFailure: fail, onSuccess: closeAllSuccess});

		});


		test('Try to create again using incorrect password', 1, function(){
			stop();

			COLLECTION = 'Fail';

			var failExpected = function(data) {
				//ERROR[-3] = 'INVALID_KEY_ON_PROVISION';
				deepEqual(data, -3, 'expected -3');
				start();
			};

			var modelOpts = {
				onSuccess: fail,
				onFailure: failExpected,
				adapter:
				{ name: 'push_adapter',
				replace: 'updateCustomer',
				remove: 'removeCustomer',
				add:'addCustomer'
				},
				dropCollection: true
			};

			var password2 = 'incorrectPassword';
			model.usePassword(password2);

			modelInstance = model.initCollection(COLLECTION, SCHEMA, modelOpts);
		});


		test('SEC: Change password failure, wrong old pw', 2, function(){
			stop();

			COLLECTION = 'sectTest1';


			var password1 = 'superSecretPassword';
			var password2 = 'myNewPassword';
			model.usePassword(password1);


			var failExpected = function(e){
				deepEqual(e, 24, 'Change password failed as expected ' + e);
				start();
			};

			var createSuccessful = function (data) {
				deepEqual(data, 0, 'new collection');
				model.changePassword(password1+'BADPW', password2, {onSuccess : fail, onFailure : failExpected});
			};

			var modelOpts = {
				onSuccess: createSuccessful,
				onFailure: fail,
				adapter:
				{ name: 'push_adapter',
				replace: 'updateCustomer',
				remove: 'removeCustomer',
				add:'addCustomer'
				},
				dropCollection: true
			};

			modelInstance = model.initCollection(COLLECTION, SCHEMA, modelOpts);
		});


		test('SEC: Change password success', 2, function(){
			stop();

			var password1 = 'superSecretPassword';
			var password2 = 'myNewPassword';
			model.usePassword(password1);

			var changedPassSuccess = function(data){
				deepEqual(data, 0, 'Change password should pass');
				start();
			};

			var createSuccessful = function (data) {
				deepEqual(data, 0, 'new collection');
				model.changePassword(password1, password2, {onSuccess : changedPassSuccess, onFailure : fail});
			};

			var modelOpts = {
				onSuccess: createSuccessful,
				onFailure: fail,
				adapter:
				{ name: 'push_adapter',
				replace: 'updateCustomer',
				remove: 'removeCustomer',
				add:'addCustomer'
				},
				dropCollection: true
			};

			modelInstance = model.initCollection(COLLECTION, SCHEMA, modelOpts);

		});


		test('SEC: Create model using new password', 1, function(){
			stop();

			var password2 = 'myNewPassword';

			model.usePassword(password2);

			var createSuccessful = function (data) {
				deepEqual(data, 0, 'new collection');
				start();
			};

			modelInstance = model.initCollection(COLLECTION, SCHEMA,
				{onSuccess:createSuccessful, onFailure: fail, dropCollection: true});
		});


		test('SEC: Destroy collection', 2, function(){
			stop();

			var password2 = 'myNewPassword';
			
			model.usePassword(password2);

			var destroyWin = function(data){
				deepEqual(data, 0, 'destroy success');
				start();
			};

			var createSuccessful = function (data) {
				deepEqual(data, 0, 'new collection');
				model.destroy({onSuccess: destroyWin, onFailure: fail});
			};

			modelInstance = model.initCollection(COLLECTION, SCHEMA,
				{onSuccess:createSuccessful, onFailure: fail, dropCollection: true});
		});

		test('Create model NO password', 1, function(){
			stop();

			model.clearPassword();

			var createSuccessful = function (data) {
				deepEqual(data, 0, 'new collection');
				start();
			};

			modelInstance = model.initCollection(COLLECTION, SCHEMA,
				{onSuccess:createSuccessful, onFailure: fail, dropCollection: true});
		});

		test('Wrong password test', 4, function(){
			stop();

			var mI;
			var localCollectionName = 'wrongPwdTest';
			var localData = [{fn: 'carlos'}, {fn: 'tim'}, {fn: 'jeff'}];
			var localSchema = {fn: 'string'};

			var expectedFailureOnInit = function (data) {
				deepEqual(data, -3, 'expectedFailureOnInit');
				start();
			};

			var closeAllSuccess = function (data) {
				deepEqual(data, 0, 'closeAllSuccess');
				model.usePassword('byebyeworld');
				mI = model.initCollection(localCollectionName, localSchema,
					{onFailure: expectedFailureOnInit, onSuccess: fail});
			};

			var storeSuccess = function (data) {
				deepEqual(data, localData.length, 'storeSuccess');
				model.clearPassword();
				model.closeAll({onFailure: fail, onSuccess: closeAllSuccess});
			};

			var initSuccess = function (data) {
				deepEqual(data, 0, 'initSuccess');
				mI.store(localData, {onFailure: fail, onSuccess: storeSuccess});
			};

			var destroySuccess = function () {
				model.usePassword('helloworld');
				mI = model.initCollection(localCollectionName, localSchema,
					{onFailure: fail, onSuccess: initSuccess});
			};

			model.destroy({onFailure: fail, onSuccess: destroySuccess});

		});

		asyncTest('write same data to enc database', 6, function () {

			var mI;

			var DATA = [{fn: 'carlos'}, {fn: 'tim'}, {fn: 'jeff'},
			{fn: 'raj'}, {fn: 'jeremy'}, {fn: 'bill'},
			{fn: 'lizet'}, {fn: 'mike'}, {fn: 'jeremy'},
			{fn: 'paul'}, {fn: 'curtiss'}, {fn: 'barbara'}]; //len: 12


			var countWin2 = function (total) {
				deepEqual(total, DATA.length + DATA.length, 'countWin2');
				JSONStore.clearPassword();
				start();
			};

			var store2Win = function (count) {
				deepEqual(count, DATA.length, 'store2Win');

				mI.count({onFailure: fail, onSuccess: countWin2});
			};

			var initWin2 = function (status) {
				deepEqual(status, 1, 'existing db');

				mI.store(DATA, {onFailure: fail, onSuccess: store2Win});
			};

			var countWin = function (total) {
				deepEqual(total, DATA.length, 'countWin');

				mI = null;

				model.usePassword('4c07f700a1d41a44912589ed3b5f8ba4');

				mI = model.initCollection('writeSameDataEncDB', {fn: 'string'},
					{onFailure: fail, onSuccess: initWin2});
			};

			var store1Win = function (count) {

				deepEqual(count, DATA.length, 'store1Win');

				mI.count({onFailure: fail, onSuccess: countWin});
			};

			var initWin = function (status) {
				deepEqual(status, 0, 'new db');

				mI.store(DATA, {onFailure: fail, onSuccess: store1Win});
			};

			var startCollection = function () {

				model.usePassword('4c07f700a1d41a44912589ed3b5f8ba4');

				mI = model.initCollection('writeSameDataEncDB', {fn: 'string'},
					{onFailure: fail, onSuccess: initWin});
			};

			model.destroy({onFailure: fail, onSuccess: startCollection});

		});
		
		//WI42904
		test('Pass no pw to encrypted DB, then try correct login', 5, function(){
			stop();


			var mI;
			var localCollectionName = 'wrongPwdTest';
			var localData = [{fn: 'carlos'}, {fn: 'tim'}, {fn: 'jeff'}];
			var localSchema = {fn: 'string'};
			
			var initSuccess2 = function(data) {
				deepEqual(data, 1, 'initSuccess2');
				start();
			};

			var expectedFailureOnInit = function (data) {
				deepEqual(data, -3, 'expectedFailureOnInit');
				model.usePassword('helloworld');
				mI = model.initCollection(localCollectionName, localSchema,
						{onFailure: fail, onSuccess: initSuccess2});
			};

			var closeAllSuccess = function (data) {
				deepEqual(data, 0, 'closeAllSuccess');
				mI = model.initCollection(localCollectionName, localSchema,
					{onFailure: expectedFailureOnInit, onSuccess: fail});
			};

			var storeSuccess = function (data) {
				deepEqual(data, localData.length, 'storeSuccess');
				model.clearPassword();
				model.closeAll({onFailure: fail, onSuccess: closeAllSuccess});
			};

			var initSuccess = function (data) {
				deepEqual(data, 0, 'initSuccess');
				mI.store(localData, {onFailure: fail, onSuccess: storeSuccess});
			};

			var destroySuccess = function () {
				model.usePassword('helloworld');
				mI = model.initCollection(localCollectionName, localSchema,
					{onFailure: fail, onSuccess: initSuccess});
			};

			model.destroy({onFailure: fail, onSuccess: destroySuccess});

		});

		asyncTest('SEC: Create model fips disabled', 1, function(){

			var password2 = 'myNewPassword';

			model.usePassword(password2);

			var createSuccessful = function (data) {
				deepEqual(data, 0, 'new collection');
				JSONStore.clearPassword();
				start();
			};

			var startCollection = function () {

				model.usePassword('4c07f700a1d41a44912589ed3b5f8ba4');

				modelInstance = model.initCollection(COLLECTION, SCHEMA,
					{onSuccess:createSuccessful, onFailure: fail, dropCollection: true, fipsEnabled: false});
			};

			model.destroy({onFailure: fail, onSuccess: startCollection});

		});

		//Uses the local key gen path
		asyncTest('Local key gen provision test', 3, function(){

			var collections = {
				localKeyGen1 : {
					searchFields : {fn :'string'}
				}
			},
			opts = {username: 'tjr', password: 'seekrit', localKeyGen: true};

			JSONStore.destroy().then(function(){
				return JSONStore.init(collections, opts);
			})

			.then(function(res){
				deepEqual(res.localKeyGen1.name, 'localKeyGen1', 'provisioned new collection with local password');
				return JSONStore.get('localKeyGen1').add({fn: 'tim'});
			})

			.then(function(res){
				deepEqual(res, 1, 'stored 1 doc');
				return JSONStore.get('localKeyGen1').find({});
			})

			.then(function(res){
				deepEqual(res.length, 1, 'returned all 1 docs');
				start();
			})

			.fail(function(err){
				ok(false, 'should not get error callback!' + err.toString());

			});

		});

		//Sets the local keygen path to false, to ensure we still use the old path
		asyncTest('Local key gen false provision test', 3, function(){

			var collections = {
				localKeyGen1 : {
					searchFields : {fn :'string'}
				}
			},
			opts = {username: 'tjr', password: 'seekrit', localKeyGen: false};

			JSONStore.destroy().then(function(){
				return JSONStore.init(collections, opts);
			})

			.then(function(res){
				var expected = (typeof browser === 'object') ? 0 : 1; //Browser impl uses no security, bro
				deepEqual(res.localKeyGen1.name, 'localKeyGen1', 'provisioned new collection with local password');
				return JSONStore.get('localKeyGen1').add({fn: 'tim'});
			})

			.then(function(res){
				deepEqual(res, 1, 'stored 1 doc');
				return JSONStore.get('localKeyGen1').find({});
			})

			.then(function(res){
				deepEqual(res.length, 1, 'returned all 1 docs');
				start();
			})

			.fail(function(err){
				ok(false, 'should not get error callback!' + err.toString());

			});

		});

		asyncTest('Init without password, then try to open with password should fail', 4, function(){

			JSONStore.destroy()
			.then(function(rc){
				deepEqual(rc, 0, 'destroy worked');
				return JSONStore.init( { a : { searchFields: {} } });
			})
			.then(function(){
				ok(true,'win');
				return JSONStore.closeAll();
			})
			.then(function(rc){
					//init with a password, on a previously provisioned insecure store, should fail with -3
					deepEqual(rc, 0, 'closeAll worked');
					return JSONStore.init( { a : { searchFields: {} } }, {password: 'derp', localKeyGen: true});
					
				})
			.then(function(){
				ok(false, 'init with password should have failed');
				start();
			})

			.fail(function(e){
				deepEqual(e.err, -3, 'Got expected failure for init');
				start();
			});

		});

		asyncTest('21207 - Uncaught exception when changing pwd with wrong usr', 8, function () {
			var collections = {
				hello : {
					searchFields : {
						fn: 'string'
					}
				}
			};

			var options = {
				username : 'Hey',
				password : '123'
			};

			JSONStore.destroy()

			.then(function (res) {
				deepEqual(res, 0, 'destroy');
				return JSONStore.init(collections, options);
			})

			.then(function (res) {
				deepEqual(res.hello.name, 'hello', 'init');
				return JSONStore.get('hello').add({fn: 'carlos'});
			})

			.then(function (res) {
				deepEqual(res, 1, 'add');
				return JSONStore.get('hello').findAll();
			})

		.then(function (res) {
				try {
					deepEqual(res.length, 1, 'findAll length');
					deepEqual(res[0].json.fn, 'carlos', 'find[0] name');
				} catch(e) {
					ok(false, 'failed e:'+e);
					start();
				}

				return JSONStore.changePassword('123', '111', null);
			})

		.then(function (res) {
				ok(false, 'Should not work because it is an invalid username:' + res);
				start();
			})

		.fail(function (err) {
				deepEqual(err.err, 24, 'err code');
				deepEqual(err.msg, 'ERROR_CHANGING_PASSWORD', 'msg');
				deepEqual(err.src, 'changePassword', 'src');
				start();
			});

		});

	}
)();
