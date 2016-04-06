/*global test, module, WL, deepEqual, asyncTest, ok, start, cordova, sinon*/
(function() {

	'use strict';

	//Dependencies:
	var model = WL.JSONStore,

	fail = function(err) {
		ok(false, 'Failed with: ' + err + ' ' + model.getErrorMessage(err));
		start();
	};

	module('File Check');

	//Some of these tests only work on iOS, if we are running on Anrdoid, make a test
	// that generates the same number of asserts so we don't have a mismatch
	if (WL.Client.getEnvironment() === 'iphone' ||
		WL.Client.getEnvironment() === 'ipad') {

		asyncTest('unEncryptedCollection file check', 6, function () {
			var modelInstance;
			var stub = sinon.stub(WL.EncryptedCache, 'secureRandom', function(onCompleteHandler){
				onCompleteHandler( Math.random() );
			});

			var checkDBEncrypted2 = function (status) {

				deepEqual(status, 1, 'DB is encrypted as expected');
				stub.restore();
				start();
			};

			var encryptedCollectionWin = function (status) {
				deepEqual(status, 0, 'encryptedCollectionWin');

				cordova.exec(checkDBEncrypted2, fail, 'StoragePlugin', '_isStoreEncrypted', []);
			};

			var initEncryptedCollection = function (status) {

				deepEqual(status, 0, 'initEncryptedCollection');

				WL.JSONStore.usePassword('hello');
				modelInstance = modelInstance = model.initCollection('encryptedCollection',
					{fn: 'string'}, {onFailure:fail , onSuccess: encryptedCollectionWin});

			};

			var checkDBEncrypted1 = function (status) {

				deepEqual(status, 0, 'DB is NOT encrypted as expected');

				WL.JSONStore.destroy({onFailure: fail, onSuccess: initEncryptedCollection});
			};



			var unEncryptedCollectionInitWin = function (status) {

				deepEqual(status, 0, 'unEncryptedCollection');

				cordova.exec(checkDBEncrypted1, fail, 'StoragePlugin', '_isStoreEncrypted', []);

			};

      WL.JSONStore.destroy().
      then(function (res) {
        deepEqual(res, 0, 'destroy');
        modelInstance = model.initCollection('unEncryptedCollection', {fn: 'string'},
        {onFailure:fail , onSuccess: unEncryptedCollectionInitWin});
      });

		});


	} else {
		//Android
		test('unEncryptedCollection file check -- Android', 5, function () {
			ok(true, 'Not implemted on android');
			ok(true, 'Not implemted on android');
			ok(true, 'Not implemted on android');
			ok(true, 'Not implemted on android');
			ok(true, 'Not implemted on android');
		});
	}

 asyncTest('destroy', 1,  function () {
   WL.JSONStore.destroy()
   .always(function (res) {
     deepEqual(res, 0, 'destroy worked');
        start();
     });
  });

})();