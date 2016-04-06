/*global module, WL, deepEqual, ok, start, test, stop*/

/**
 * Test the closeAll functionality and the affect of closing on other functions
 */
(function() {

	'use strict';

	//Dependencies:
	var model = JSONStore;

	var fail = function (err) {
		ok(false, 'Failed with: ' + err + ' ' + model.getErrorMessage(err));
		start();
	};

	module('Close');

	test('General Close tests', 23, function(){
		stop();

		var modelInstance;

		var localCollectionName = 'closeAll';
		var localData = [{fn: 'carlos', ln: 'andreu', age: 13}, {fn: 'jeremy', ln: 'nortey', age: 14}];
		var localSchema = {'fn': 'string', 'ln' : 'string', 'age' : 'integer'};

		var destroySuccess2 = function (data) { //Destroy after closeAll
			deepEqual(data, 0,'destroySuccess2');
			start();
		};

		var closeAllSuccess2 = function (data) {
			deepEqual(data, 0, 'closeAllSuccess2');
			model.destroy({onSuccess: destroySuccess2, onFailure: fail});
		};

		var finishedStoring2 = function (data) {
			deepEqual(data, 2, 'finishedStoring2');
			model.closeAll({onSuccess: closeAllSuccess2, onFailure: fail});
		};

		var winInit3 = function (data) {
			deepEqual(data, 0, 'winInit3');
			modelInstance.store(localData, {onSuccess: finishedStoring2, onFailure: fail});
		};

		var destroySuccess = function (data) { //Destroy without closeAll
			deepEqual(data, 0, 'destroySuccess');
			modelInstance = model.initCollection(localCollectionName, localSchema,
				{dropCollection:true, onSuccess: winInit3, onFailure: fail});
		};

		var winInit2 = function (data) {
			deepEqual(data, 0, 'winInit2');
			model.destroy({onSuccess: destroySuccess, onFailure: fail});
		};

		//vvv Tests should return -50 because the DB is closed vvv

		var expectedChangePasswordFailure = function(data) {
			deepEqual(data, -50, 'expectedChangePasswordFailure');
			modelInstance = model.initCollection(localCollectionName, localSchema,
				{dropCollection:true, onSuccess: winInit2, onFailure: fail});
		};

		var expectedRemoveCollectionFailure = function(data) {
			deepEqual(data, -50, 'expectedRemoveCollectionFailure');
			model.changePassword('oldpw', 'newpw', {onSuccess: fail, onFailure: expectedChangePasswordFailure});
		};

		// Note that modelInstance.enhance does not go to the database, so it will not fail

		var expectedCountFailure = function(data) {
			deepEqual(data, -50, 'expectedCountFailure');
			modelInstance.removeCollection({onSuccess: fail, onFailure: expectedRemoveCollectionFailure});
		};

		var expectedpushRequiredCountFailure = function(data) {
			deepEqual(data, -50, 'expectedpushRequiredCountFailure');
			modelInstance.count({onSuccess: fail, onFailure: expectedCountFailure});
		};

		var expectedGetPushRequiredFailure = function(data) {
			deepEqual(data, -50, 'expectedGetPushRequiredFailure');
			modelInstance.pushRequiredCount({onSuccess: fail, onFailure: expectedpushRequiredCountFailure});
		};

		var expectedIsPushRequiredFailure = function(data) {
			deepEqual(data, -50, 'expectedIsPushRequiredFailure');
			modelInstance.getPushRequired({onSuccess: fail, onFailure: expectedGetPushRequiredFailure});
		};

		var expectedPushSelectedFailure = function(data) {
			deepEqual(data, -50, 'expectedPushSelectedFailure');
			modelInstance.isPushRequired(1, {onSuccess: fail, onFailure: expectedIsPushRequiredFailure});
		};

		var expectedPushFailure = function(data) {
			deepEqual(data, -50, 'expectedPushFailure');
			modelInstance.pushSelected({_id: 1, json: {fn: 'fail'}}, {onSuccess: fail, onFailure: expectedPushSelectedFailure});
		};

		var expectedRemoveFailure = function(data) {
			deepEqual(data, -50, 'expectedRemoveFailure');
			modelInstance.push({onSuccess: fail, onFailure: expectedPushFailure});
		};

		var expectedReplaceFailure = function(data) {
			deepEqual(data, -50, 'expectedReplaceFailure');
			modelInstance.remove({fn: 'carlos'}, {onSuccess: fail, onFailure: expectedRemoveFailure});
		};

		var expectedAddFailure = function(data) {
			deepEqual(data, -50, 'expectedAddFailure');
			modelInstance.replace({_id: 1, json: {fn: 'carlitos', ln: 'MrJavacript', age: 13}},
				{onSuccess: fail, onFailure: expectedReplaceFailure});
		};

		var expectedStoreFailure = function(data) {
			deepEqual(data, -50, 'expectedStoreFailure');
			modelInstance.add({fn: 'raj'}, {onSuccess: fail, onFailure: expectedAddFailure});
		};

		var expectedCloseAllWin = function(data) {
			deepEqual(data, 0, 'expectedCloseAllWin 1 instead of 0 because db was already closed');
			modelInstance.store({fn: 'raj'}, {onSuccess: fail, onFailure: expectedStoreFailure});
		};

		var expectedFindFailure = function(data) {
			deepEqual(data, -50, 'expectedFindFailure');
			model.closeAll({onSuccess: expectedCloseAllWin, onFailure:fail });
		};

		//^^^ Tests should return -50 because the DB is closed ^^^

		var closeAllSuccess = function (data) {
			deepEqual(data, 0,'closeAllSuccess');
			modelInstance.find({fn: 'carlos'}, {onSuccess: fail, onFailure: expectedFindFailure});
		};

		var finishedStoring = function (data) {
			deepEqual(data, 2, 'finishedStoring');
			model.closeAll({onSuccess: closeAllSuccess, onFailure: fail});
		};

		var winInit = function (data) {
			deepEqual(data, 0, 'winInit');
			modelInstance.store(localData, {onSuccess: finishedStoring, onFailure: fail});
		};

		modelInstance = model.initCollection(localCollectionName, localSchema,
			{adapter: {name: 'myFakeAdapter'}, dropCollection:true, onSuccess: winInit, onFailure: fail});
	});

})();