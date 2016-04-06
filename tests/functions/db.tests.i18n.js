/*global module, WL, deepEqual, ok, start, asyncTest*/
/*jshint -W100, quotmark: false, unused: false*/

/*

some users, but not the build machines, were affected by jshint error:

	"This character may get silently deleted by one or more browsers."

Hence we have -W100 in th jshint rules.

*/

/*
 Test Security stuff
 */
(function() {

		'use strict';

		//Dependencies:
		var model = JSONStore;

		function fail(err){
			ok(false, 'Failed with: ' + err + ' ' + model.getErrorMessage(err));
			start();
		}

		module('i18n');


		/************************************************************

		Important:  These tests are in a state of flux until we make a decision on usernames.
		right now it has to be 0-9a-zA-Z which means no non-murica usernames

		*************************************************************/


		asyncTest("Non 'murica username and password" , 1, function(){

			var username = '郭德纲所演绎的相声作品中',
			pw = '徐德亮突然宣布退出郭德纲领衔的德云社',
			modelInstance;
			
			var closeWin2 = function (data) {
				deepEqual(data, 0, 'closeall2 worked');
				start();
			};

			var initWin2 = function (data) {
				deepEqual(data, 1, 'new collection open 2');
				model.closeAll({onSuccess: closeWin2, onFailure: fail});
			};

			var closeWin = function (data) {
				deepEqual(data, 0, 'closeall worked');
				modelInstance = model.initCollection("i18nTest1", {fn : 'string'}, {onSuccess: initWin2, onFailure: fail, username : username, password : pw});
			};

			var findAllWin = function (data) {
				deepEqual(data.length, 1, "expected 1 document");
				deepEqual(data[0]["json"]["fn"], 'jiachen', "expected 'jiachen'");
				model.closeAll({onSuccess: closeWin, onFailure: fail});
			};

			var addWin = function (data) {
				deepEqual(data, 1, "stored 1 doc");
				modelInstance.findAll({onSuccess: findAllWin, onFailure: fail});
			};

			var initWin = function (data) {
				deepEqual(data, 0, 'new collection');
				modelInstance.add({fn : 'jiachen'}, {onSuccess: addWin, onFailure: fail});
			};

			var badUsername = function (data) {
				deepEqual(data, -7, "bad username");
				start();
			};

			modelInstance = model.initCollection("i18nTest1", {fn : 'string'}, {onSuccess: fail, onFailure: badUsername, username : username, password : pw});

		});

		// asyncTest("Non 'murica username and password 2" , 5, function(){

		//  var username = 'böün',
		//  pw = 'FüßefällenLäuse',
		//  modelInstance;


		//   var closeWin2 = function (data) {
		//     deepEqual(data, 0, 'closeall2 worked');
		//     start();
		//   };

		//  var initWin2 = function (data) {
		//    deepEqual(data, 1, 'new collection open 2');
		//    model.closeAll({onSuccess: closeWin2, onFailure: fail});
		//  };

		//  var closeWin = function (data) {
		//    deepEqual(data, 0, 'closeall worked');
		//    modelInstance = model.initCollection("i18nTest1", {fn : 'string'}, {onSuccess: initWin2, onFailure: fail, username : username, password : pw});
		//  };

		//  var addWin = function (data) {
		//    deepEqual(data, 1, "stored 1 doc");
		//    model.closeAll({onSuccess: closeWin, onFailure: fail});
		//  };

		//  var initWin = function (data) {
		//    deepEqual(data, 0, 'new collection');
		//    modelInstance.add({fn : 'jiachen'}, {onSuccess: addWin, onFailure: fail});
		//  };

		//  modelInstance = model.initCollection("i18nTest1", {fn : 'string'}, {onSuccess: initWin, onFailure: fail, username : username, password : pw});
		// });

		// asyncTest("Non 'murica username and password 3" , 5, function(){

		//  var username = 'אַלֶכְּסַנְדֶר',
		//  pw = 'אַלְבֶּרְט',
		//  modelInstance;

		//   var closeWin2 = function (data) {
		//     deepEqual(data, 0, 'closeall2 worked');
		//     start();
		//   };

		//  var initWin2 = function (data) {
		//    deepEqual(data, 1, 'new collection open 2');
		//    model.closeAll({onSuccess: closeWin2, onFailure: fail});
		//  };

		//  var closeWin = function (data) {
		//    deepEqual(data, 0, 'closeall worked');
		//    modelInstance = model.initCollection("i18nTest1", {fn : 'string'}, {onSuccess: initWin2, onFailure: fail, username : username, password : pw});
		//  };

		//  var addWin = function (data) {
		//    deepEqual(data, 1, "stored 1 doc");
		//    model.closeAll({onSuccess: closeWin, onFailure: fail});
		//  };

		//  var initWin = function (data) {
		//    deepEqual(data, 0, 'new collection');
		//    modelInstance.add({fn : 'jiachen'}, {onSuccess: addWin, onFailure: fail});
		//  };

		//  modelInstance = model.initCollection("i18nTest1", {fn : 'string'}, {onSuccess: initWin, onFailure: fail, username : username, password : pw});
		// });

	}
)();