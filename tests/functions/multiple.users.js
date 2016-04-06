/*global module, deepEqual, ok, start, sinon, asyncTest*/
/*jshint camelcase: false*/

(function() {

	'use strict';

	module('MultiUser');

	var fail = function(err){
		ok(false, 'Failed with: ' + err + ' ' + JSONStore.getErrorMessage(err));
		start();
	};

	asyncTest('Destroy DB', 1, function(){

		var destroyWin = function (data) {
			deepEqual(data, 0, 'db cleared');
			start();
		};

		JSONStore.destroy({onSuccess: destroyWin, onFailure: fail});

	});

	asyncTest('Basic test with store and non-default username', 5, function () {

		var mI;

		var closeWin = function(status){
			deepEqual(status, 0, 'close successful');
			start();
		};

		var winFind = function (results) {
			deepEqual(results.length, 1, 'correct num of results');
			deepEqual(results[0].json.fn, 'carlitos', 'right value');
			JSONStore.closeAll({onFailure: fail, onSuccess: closeWin});

		};

		var winStore = function (status) {
			deepEqual(status, 1, 'one doc stored');
			mI.findAll({onFailure: fail, onSuccess: winFind});
		};

		var winInit = function (status) {
			deepEqual(status, 0, 'new collection 0');
			mI.add({fn: 'carlitos'}, {onFailure: fail, onSuccess: winStore});
		};

		mI = JSONStore.initCollection('namedStoreCollection', {fn: 'string'},
			{onFailure: fail, onSuccess: winInit, username: 'carlos'});
	});

	asyncTest('Failure test: mismatched username', 3, function () {

		var mI_1 = null, mI_2 = null;

		var closeWin = function(status){
			deepEqual(status, 0, 'close successful');
			start();
		};

		var expectedFail = function(err){
			deepEqual(err, -6, 'Expected mismatch user stuff');
			JSONStore.closeAll({onFailure: fail, onSuccess: closeWin});
		};

		var winInit_1 = function (status) {
			deepEqual(status, 0, 'new collection 1');
			mI_2 = JSONStore.initCollection('namedStoreCollection3', {fn: 'string'},
				{onFailure: expectedFail, onSuccess: fail, username: 'tim'});
		};

		mI_1 = JSONStore.initCollection('namedStoreCollection2', {fn: 'string'},
			{onFailure: fail, onSuccess: winInit_1, username: 'carlos'});

	});

	asyncTest('Multiple username', 7, function () {

		var mI;

		var closeWinFinal = function (status){
			deepEqual(status, 0, 'close successful');
			start();
		};

		var winInit2 = function (status) {
			deepEqual(status, 0, 'another new collection 0');
			JSONStore.closeAll({onFailure: fail, onSuccess: closeWinFinal});

		};

		var closeWin = function(status){
			deepEqual(status, 0, 'close successful');
			mI = JSONStore.initCollection('namedStoreCollection', {fn: 'string'},
				{onFailure: fail, onSuccess: winInit2, username: 'bala'});
		};

		var winFind = function (results) {
			deepEqual(results.length, 1, 'correct num of results');
			deepEqual(results[0].json.fn, 'famitos', 'right value');
			JSONStore.closeAll({onFailure: fail, onSuccess: closeWin});

		};

		var winStore = function (status) {
			deepEqual(status, 1, 'one doc stored');
			mI.findAll({onFailure: fail, onSuccess: winFind});
		};

		var winInit = function (status) {
			deepEqual(status, 0, 'new collection 0');
			mI.add({fn: 'famitos'}, {onFailure: fail, onSuccess: winStore});
		};

		mI = JSONStore.initCollection('namedStoreCollection', {fn: 'string'},
			{onFailure: fail, onSuccess: winInit, username: 'fama'});

	});

	//Testing 2 collections with different usernames, no passwords.
	//Destroy all
	//Init collection 1 > Store data > findAll > close
	//Init collection 2 > Store data > findAll > close
	//Init collection 1 > count > close
	//Init collection 2 > count > close
	//Destroy all
	asyncTest('Two collections, different usernames, no passwords', 19, function () {

		var mI_1 = null, mI_2 = null;

		var destroyWin = function (status) {
			deepEqual(status, 0, 'destroyWin');
			start();
		};

		var closeWin_13 = function (status) {
			deepEqual(status, 0, 'closeWin_13');
			JSONStore.destroy({onFailure: fail, onSuccess: destroyWin});
		};

		var winCount2 = function (count) {
			deepEqual(count, 1, 'winCount2');
			JSONStore.closeAll({onFailure: fail, onSuccess: closeWin_13});
		};

		var winInit_21 = function (status) {
			deepEqual(status, 1, 'winInit_21');
			mI_2.count({onFailure: fail, onSuccess: winCount2});
		};

		var closeWin_12 = function (status) {
			deepEqual(status, 0, 'closeWin_12');
			mI_2 = JSONStore.initCollection('namedStoreCollection', {fn: 'string', age: 'number'},
				{onFailure: fail, onSuccess: winInit_21, username: 'tim'});
		};

		var winCount1 = function (count) {
			deepEqual(count, 1, 'winCount1');
			JSONStore.closeAll({onFailure: fail, onSuccess: closeWin_12});
		};

		var winInit_11 = function (status) {
			deepEqual(status, 1, 'winInit_11');
			mI_1.count({onFailure: fail, onSuccess: winCount1});
		};

		var closeWin_2 = function (status) {
			deepEqual(status, 0, 'closeWin_2');
			mI_1 = JSONStore.initCollection('namedStoreCollection', {fn: 'string'},
				{onFailure: fail, onSuccess: winInit_11, username: 'carlos'});
		};

		var winFind_2 = function (results) {
			deepEqual(results.length, 1, 'winFind_2');
			deepEqual(results[0].json.fn, 'timothy', 'winFind_2-2');
			deepEqual(results[0].json.age, 99, 'winFind_2-3');
			JSONStore.closeAll({onFailure: fail, onSuccess: closeWin_2});
		};

		var winStore_2 = function (count) {
			deepEqual(count, 1, 'winStore_2');
			mI_1.findAll({onFailure: fail, onSuccess: winFind_2});
		};

		var winInit_2 = function (status) {
			deepEqual(status, 0, 'winInit_2');
			mI_2.store({fn: 'timothy', age: 99}, {onFailure: fail, onSuccess: winStore_2});
		};

		var closeWin_1 = function (status) {
			deepEqual(status, 0, 'closeWin_1');
			mI_2 = JSONStore.initCollection('namedStoreCollection', {fn: 'string', age: 'number'},
				{onFailure: fail, onSuccess: winInit_2, username: 'tim'});
		};

		var winFind_1 = function (results) {
			deepEqual(results.length, 1, 'winFind_1');
			deepEqual(results[0].json.fn, 'carlitos', 'winFind_1-2');
			JSONStore.closeAll({onFailure: fail, onSuccess: closeWin_1});
		};

		var winStore_1 = function (count) {
			deepEqual(count, 1, 'winStore_1');
			mI_1.findAll({onFailure: fail, onSuccess: winFind_1});
		};

		var winInit_1 = function (status) {
			deepEqual(status, 0, 'winInit_1');
			mI_1.store({fn: 'carlitos'}, {onFailure: fail, onSuccess: winStore_1});
		};

		var startInit = function (status) {
			deepEqual(status, 0, 'destroyWin/startInit');

			mI_1 = JSONStore.initCollection('namedStoreCollection', {fn: 'string'},
				{onFailure: fail, onSuccess: winInit_1, username: 'carlos'});
		};

		JSONStore.destroy({onFailure: fail, onSuccess: startInit});
	});

	//Testing 2 collections with different usernames AND passwords.
	//Destroy all
	//Init collection 1 > Store data > findAll > close
	//Init collection 2 > Store data > find All > close
	//Init collection 1 > count > close
	//Init collection 2 > count > close
	//Destroy all
	asyncTest('Two collections, different usernames AND passwords', 27, function () {

		var mI_1 = null,
		mI_2 = null;
		var destroyWin = function (status) {
			deepEqual(status, 0, 'destroyWin');
			start();
		};

		var closeWin_13 = function (status) {
			deepEqual(status, 0, 'closeWin_13');
			JSONStore.destroy({onFailure: fail, onSuccess: destroyWin});
		};

		var winCount2 = function (count) {
			deepEqual(count, 1, 'winCount2');
			JSONStore.closeAll({onFailure: fail, onSuccess: closeWin_13});
		};

		var winInit_21 = function (status) {
			deepEqual(status, 1, 'winInit_21');
			ok(JSONStore.clearPassword(), 'clearPassword');
			mI_2.count({onFailure: fail, onSuccess: winCount2});
		};

		var closeWin_12 = function (status) {
			deepEqual(status, 0, 'closeWin_12');
			ok(JSONStore.usePassword('world'), 'usePassword');
			mI_2 = JSONStore.initCollection('namedStoreCollection', {fn: 'string', age: 'number'},
				{onFailure: fail, onSuccess: winInit_21, username: 'tim'});
		};

		var winCount1 = function (count) {
			deepEqual(count, 1, 'winCount1');
			JSONStore.closeAll({onFailure: fail, onSuccess: closeWin_12});
		};

		var winInit_11 = function (status) {
			deepEqual(status, 1, 'winInit_11');
			ok(JSONStore.clearPassword(), 'clearPassword');
			mI_1.count({onFailure: fail, onSuccess: winCount1});
		};

		var closeWin_2 = function (status) {
			deepEqual(status, 0, 'closeWin_2');
			ok(JSONStore.usePassword('hello'), 'usePassword');
			mI_1 = JSONStore.initCollection('namedStoreCollection', {fn: 'string'},
				{onFailure: fail, onSuccess: winInit_11, username: 'carlos'});
		};

		var winFind_2 = function (results) {
			deepEqual(results.length, 1, 'winFind_2');
			deepEqual(results[0].json.fn, 'timothy', 'winFind_2-2');
			deepEqual(results[0].json.age, 99, 'winFind_2-3');
			JSONStore.closeAll({onFailure: fail, onSuccess: closeWin_2});
		};

		var winStore_2 = function (count) {
			deepEqual(count, 1, 'winStore_2');
			mI_1.findAll({onFailure: fail, onSuccess: winFind_2});
		};

		var winInit_2 = function (status) {
			deepEqual(status, 0, 'winInit_2');
			ok(JSONStore.clearPassword(), 'clearPassword');
			mI_2.store({fn: 'timothy', age: 99}, {onFailure: fail, onSuccess: winStore_2});
		};

		var closeWin_1 = function (status) {
			deepEqual(status, 0, 'closeWin_1');
			ok(JSONStore.usePassword('world'), 'usePassword');
			mI_2 = JSONStore.initCollection('namedStoreCollection', {fn: 'string', age: 'number'},
				{onFailure: fail, onSuccess: winInit_2, username: 'tim'});
		};

		var winFind_1 = function (results) {
			deepEqual(results.length, 1, 'winFind_1');
			deepEqual(results[0].json.fn, 'carlitos', 'winFind_1-2');
			JSONStore.closeAll({onFailure: fail, onSuccess: closeWin_1});
		};

		var winStore_1 = function (count) {
			deepEqual(count, 1, 'winStore_1');
			mI_1.findAll({onFailure: fail, onSuccess: winFind_1});
		};

		var winInit_1 = function (status) {
			deepEqual(status, 0, 'winInit_1');
			ok(JSONStore.clearPassword(), 'clearPassword');
			mI_1.store({fn: 'carlitos'}, {onFailure: fail, onSuccess: winStore_1});
		};

		var startInit = function (status) {
			deepEqual(status, 0, 'destroyWin/startInit');

			ok(JSONStore.usePassword('hello'), 'usePassword');
			mI_1 = JSONStore.initCollection('namedStoreCollection', {fn: 'string'},
				{onFailure: fail, onSuccess: winInit_1, username: 'carlos'});
		};

		JSONStore.destroy({onFailure: fail, onSuccess: startInit});
	});

	//Testing 2 collections with different usernames AND passwords.
	//the password is sent via initCollection
	//Destroy all
	//Init collection 1 > Store data > findAll > close
	//Init collection 2 > Store data > find All > close
	//Init collection 1 > count > close
	//Init collection 2 > count > close
	//Destroy all
	asyncTest('Two collections, different usernames AND passwords, pwd sent via initCollection', 19, function () {

		var mI_1 = null, mI_2 = null;

		var destroyWin = function (status) {
			deepEqual(status, 0, 'destroyWin');
			start();
		};

		var closeWin_13 = function (status) {
			deepEqual(status, 0, 'closeWin_13');
			JSONStore.destroy({onFailure: fail, onSuccess: destroyWin});
		};

		var winCount2 = function (count) {
			deepEqual(count, 1, 'winCount2');
			JSONStore.closeAll({onFailure: fail, onSuccess: closeWin_13});
		};

		var winInit_21 = function (status) {
			deepEqual(status, 1, 'winInit_21');
			mI_2.count({onFailure: fail, onSuccess: winCount2});
		};

		var closeWin_12 = function (status) {
			deepEqual(status, 0, 'closeWin_12');
			mI_2 = JSONStore.initCollection('namedStoreCollection', {fn: 'string', age: 'number'},
				{onFailure: fail, onSuccess: winInit_21, username: 'tim2', password: 'world'});
		};

		var winCount1 = function (count) {
			deepEqual(count, 1, 'winCount1');
			JSONStore.closeAll({onFailure: fail, onSuccess: closeWin_12});
		};

		var winInit_11 = function (status) {
			deepEqual(status, 1, 'winInit_11');
			mI_1.count({onFailure: fail, onSuccess: winCount1});
		};

		var closeWin_2 = function (status) {
			deepEqual(status, 0, 'closeWin_2');
			mI_1 = JSONStore.initCollection('namedStoreCollection', {fn: 'string'},
				{onFailure: fail, onSuccess: winInit_11, username: 'carlos2', password: 'hello'});
		};

		var winFind_2 = function (results) {
			deepEqual(results.length, 1, 'winFind_2');
			deepEqual(results[0].json.fn, 'timothy', 'winFind_2-2');
			deepEqual(results[0].json.age, 99, 'winFind_2-3');
			JSONStore.closeAll({onFailure: fail, onSuccess: closeWin_2});
		};

		var winStore_2 = function (count) {
			deepEqual(count, 1, 'winStore_2');
			mI_1.findAll({onFailure: fail, onSuccess: winFind_2});
		};

		var winInit_2 = function (status) {
			deepEqual(status, 0, 'winInit_2');
			mI_2.store({fn: 'timothy', age: 99}, {onFailure: fail, onSuccess: winStore_2});
		};

		var closeWin_1 = function (status) {
			deepEqual(status, 0, 'closeWin_1');
			mI_2 = JSONStore.initCollection('namedStoreCollection', {fn: 'string', age: 'number'},
				{onFailure: fail, onSuccess: winInit_2, username: 'tim2', password: 'world'});
		};

		var winFind_1 = function (results) {
			deepEqual(results.length, 1, 'winFind_1');
			deepEqual(results[0].json.fn, 'carlitos', 'winFind_1-2');
			JSONStore.closeAll({onFailure: fail, onSuccess: closeWin_1});
		};

		var winStore_1 = function (count) {
			deepEqual(count, 1, 'winStore_1');
			mI_1.findAll({onFailure: fail, onSuccess: winFind_1});
		};

		var winInit_1 = function (status) {
			deepEqual(status, 0, 'winInit_1');
			mI_1.store({fn: 'carlitos'}, {onFailure: fail, onSuccess: winStore_1});
		};

		var startInit = function (status) {
			deepEqual(status, 0, 'destroyWin/startInit');

			mI_1 = JSONStore.initCollection('namedStoreCollection', {fn: 'string'},
				{onFailure: fail, onSuccess: winInit_1, username: 'carlos2', password: 'hello'});
		};

		JSONStore.destroy({onFailure: fail, onSuccess: startInit});
	});

	//Testing if password is cleared automatically
	//Destroy everything first
	//InitCollection 1 with username and password > store 1 > find > closeAll
	//InitCollection 2 same username, no password > expected failure > closeAll > destroy
	asyncTest('Two collections, trying to access the second one without knowing the pwd', 9, function () {

		var mI_1 = null, mI_2 = null;
	
		var destroyWin = function (status) {
			deepEqual(status, 0, 'destroyWin');
			start()
		};

		var closeWin = function (status) {
			deepEqual(status, 0, 'closeWin');
			JSONStore.destroy({onFailure: fail, onSuccess: destroyWin});
		};

		var expectedFailedLogin = function (status) {
			deepEqual(status, -3, 'expectedFailedLogin'); //maybe change back to -1
			JSONStore.closeAll({onFailure: fail, onSuccess: closeWin});
		};

		var closeWin_1 = function (status) {
			deepEqual(status, 0, 'closeWin_1');
			mI_2 = JSONStore.initCollection('namedStoreCollection', {fn: 'string'},
				{onFailure: expectedFailedLogin, onSuccess: fail, username: 'helloworld'});
		};

		var winFind_1 = function (results) {
			deepEqual(results.length, 1, 'winFind_1');
			deepEqual(results[0].json.fn, 'carlitos', 'winFind_1-2');
			JSONStore.closeAll({onFailure: fail, onSuccess: closeWin_1});
		};

		var winStore_1 = function (count) {
			deepEqual(count, 1, 'winStore_1');
			mI_1.findAll({onFailure: fail, onSuccess: winFind_1});
		};

		var winInit_1 = function (status) {
			deepEqual(status, 0, 'winInit_1');
			mI_1.store({fn: 'carlitos'}, {onFailure: fail, onSuccess: winStore_1});
		};

		var startInit = function (status) {
			deepEqual(status, 0, 'destroyWin/startInit');

			mI_1 = JSONStore.initCollection('namedStoreCollection', {fn: 'string'},
				{onFailure: fail, onSuccess: winInit_1, username: 'helloworld', password: '12345'});
		};

		JSONStore.destroy({onFailure: fail, onSuccess: startInit});
	});

	//Run findAll on a closed collection by preserving the instance variable
	//Destroy everything first
	//InitCollection > store > findAll > closeAll > try to store data
	asyncTest('Run findAll on a closed collection by preserving the instance variable', 10, function () {

		var mI_1 = null;

		var destroyWin = function (status) {
			deepEqual(status, 0, 'destroyWin');
			start();
		};

		var expectedFailedLogin = function (status) {
			deepEqual(status, -50, 'expectedFailedLogin');
			JSONStore.destroy({onFailure: fail, onSuccess: destroyWin});
		};

		var closeWin_1 = function (status) {
			deepEqual(status, 0, 'closeWin_1');
			mI_1.findAll({onSuccess: fail, onFailure: expectedFailedLogin});
		};

		var winFind_1 = function (results) {
			deepEqual(results.length, 1, 'winFind_1');
			deepEqual(results[0].json.name, 'carlosandreu', 'winFind_1-2');
			deepEqual(results[0].json.age, 100, 'winFind_1-2');
			deepEqual(results[0].json.active, false, 'winFind_1-2');
			JSONStore.closeAll({onFailure: fail, onSuccess: closeWin_1});
		};

		var winStore_1 = function (count) {
			deepEqual(count, 1, 'winStore_1');
			mI_1.findAll({onFailure: fail, onSuccess: winFind_1});
		};

		var winInit_1 = function (status) {
			deepEqual(status, 0, 'winInit_1');
			mI_1.store({name: 'carlosandreu', age: 100, active: false}, {onFailure: fail, onSuccess: winStore_1});
		};

		var startInit = function (status) {
			deepEqual(status, 0, 'destroyWin/startInit');

			var usr = Math.random().toString().replace('.',''),
				pwd = Math.random().toString().replace('.','');

			mI_1 = JSONStore.initCollection('collName1975', {name: 'string', age: 'number', active: 'boolean'},
				{onFailure: fail, onSuccess: winInit_1, username: usr, password: pwd});
		};

		JSONStore.destroy({onFailure: fail, onSuccess: startInit});
	});

	//Try to currupt data by logging in with a wrong password
	//Destroy everything first
	//Init > Store > findAll > closeAll
	//Init with wrong pwd > Init with right pwd > findAll > close > destroy
	asyncTest('Try to currupt data by logging in with a wrong password', 16, function () {

		var mI_1 = null,
			usr = Math.random().toString().replace('.',''),
			pwd = Math.random().toString().replace('.',''),
			wrongpwd = Math.random().toString().replace('.','');
	

		var destroyWin = function (status) {
			deepEqual(status, 0, 'destroyWin');
			start();
		};

		var closeWin_2 = function (status) {
			deepEqual(status, 0, 'closeWin_1');
			JSONStore.destroy({onFailure: fail, onSuccess: destroyWin});
		};

		var winFind_2 = function (results) {
			deepEqual(results.length, 1, 'winFind_2');
			deepEqual(results[0].json.name, 'carlosandreu', 'winFind_2-2');
			deepEqual(results[0].json.age, 100, 'winFind_2-2');
			deepEqual(results[0].json.active, false, 'winFind_2-2');
			JSONStore.closeAll({onFailure: fail, onSuccess: closeWin_2});
		};

		var initWin2 = function (status) {
			deepEqual(status, 1, 'initWin2');
			mI_1.findAll({onFailure: fail, onSuccess: winFind_2});
		};

		var expectedFailedLogin = function (status) {
			deepEqual(status, -3, 'expectedFailedLogin, INVALID_KEY_ON_PROVISION');
			mI_1 = JSONStore.initCollection('collName1975', {name: 'string', age: 'number', active: 'boolean'},
				{onFailure: fail, onSuccess: initWin2, username: usr, password: pwd});
		};

		var closeWin_1 = function (status) {
			deepEqual(status, 0, 'closeWin_1');
			mI_1 = JSONStore.initCollection('collName1975', {name: 'string', age: 'number', active: 'boolean'},
				{onFailure: expectedFailedLogin, onSuccess: fail, username: usr, password: wrongpwd});
		};

		var winFind_1 = function (results) {
			deepEqual(results.length, 1, 'winFind_1');
			deepEqual(results[0].json.name, 'carlosandreu', 'winFind_1-2');
			deepEqual(results[0].json.age, 100, 'winFind_1-2');
			deepEqual(results[0].json.active, false, 'winFind_1-2');
			JSONStore.closeAll({onFailure: fail, onSuccess: closeWin_1});
		};

		var winStore_1 = function (count) {
			deepEqual(count, 1, 'winStore_1');
			mI_1.findAll({onFailure: fail, onSuccess: winFind_1});
		};

		var winInit_1 = function (status) {
			deepEqual(status, 0, 'winInit_1');
			mI_1.store({name: 'carlosandreu', age: 100, active: false}, {onFailure: fail, onSuccess: winStore_1});
		};

		var startInit = function (status) {
			deepEqual(status, 0, 'destroyWin/startInit');

			mI_1 = JSONStore.initCollection('collName1975', {name: 'string', age: 'number', active: 'boolean'},
				{onFailure: fail, onSuccess: winInit_1, username: usr, password: pwd});
		};

		JSONStore.destroy({onFailure: fail, onSuccess: startInit});
	});

	//One collection encrypted under user A, another collection unencrypted under user B
	//Destroy everything first
	//Init encrypted collection under user A > store > findAll > closeAll
	//Init non-encrypted collection under user B > store > findAll > closeAll
	//Re-open user A's collection > check > closeAll
	//Re-open user B's collection > check > closeAll
	//Destroy everything
	asyncTest('Two collections, one encrypted, one not encrypted', 22, function () {

		var mI_1 = null, mI_2 = null;
		var destroyWin = function (status) {
			deepEqual(status, 0, 'destroyWin');
			start();
		};

		var closeWin_13 = function (status) {
			deepEqual(status, 0, 'closeWin_13');
			JSONStore.destroy({onFailure: fail, onSuccess: destroyWin});
		};

		var winFindById2 = function (results) {
			deepEqual(results.length, 1, 'winFindById2');
			deepEqual(results[0].json.fn, 'timothy', 'winFindById2-2');
			deepEqual(results[0].json.age, 99, 'winFindById2-3');
			JSONStore.closeAll({onFailure: fail, onSuccess: closeWin_13});
		};

		var winInit_21 = function (status) {
			deepEqual(status, 1, 'winInit_21');
			mI_2.findById(1, {onFailure: fail, onSuccess: winFindById2});
		};

		var closeWin_12 = function (status) {
			deepEqual(status, 0, 'closeWin_12');
			mI_2 = JSONStore.initCollection('namedStoreCollection', {fn: 'string', age: 'number'},
				{onFailure: fail, onSuccess: winInit_21, username: 'tim2000'});
		};

		var winFindById1 = function (results) {
			deepEqual(results.length, 1, 'winFindById1');
			deepEqual(results[0].json.fn, 'carlitos', 'winFindById1-2');
			JSONStore.closeAll({onFailure: fail, onSuccess: closeWin_12});
		};

		var winInit_11 = function (status) {
			deepEqual(status, 1, 'winInit_11');
			mI_1.findById(1, {onFailure: fail, onSuccess: winFindById1});
		};

		var closeWin_2 = function (status) {
			deepEqual(status, 0, 'closeWin_2');
			mI_1 = JSONStore.initCollection('namedStoreCollection', {fn: 'string'},
				{onFailure: fail, onSuccess: winInit_11, username: 'carlos9001', password: 'hello'});
		};

		var winFind_2 = function (results) {
			deepEqual(results.length, 1, 'winFind_2');
			deepEqual(results[0].json.fn, 'timothy', 'winFind_2-2');
			deepEqual(results[0].json.age, 99, 'winFind_2-3');
			JSONStore.closeAll({onFailure: fail, onSuccess: closeWin_2});
		};

		var winStore_2 = function (count) {
			deepEqual(count, 1, 'winStore_2');
			mI_1.findAll({onFailure: fail, onSuccess: winFind_2});
		};

		var winInit_2 = function (status) {
			deepEqual(status, 0, 'winInit_2');
			mI_2.store({fn: 'timothy', age: 99}, {onFailure: fail, onSuccess: winStore_2});
		};

		var closeWin_1 = function (status) {
			deepEqual(status, 0, 'closeWin_1');
			mI_2 = JSONStore.initCollection('namedStoreCollection', {fn: 'string', age: 'number'},
				{onFailure: fail, onSuccess: winInit_2, username: 'tim2000'});
		};

		var winFind_1 = function (results) {
			deepEqual(results.length, 1, 'winFind_1');
			deepEqual(results[0].json.fn, 'carlitos', 'winFind_1-2');
			JSONStore.closeAll({onFailure: fail, onSuccess: closeWin_1});
		};

		var winStore_1 = function (count) {
			deepEqual(count, 1, 'winStore_1');
			mI_1.findAll({onFailure: fail, onSuccess: winFind_1});
		};

		var winInit_1 = function (status) {
			deepEqual(status, 0, 'winInit_1');
			mI_1.store({fn: 'carlitos'}, {onFailure: fail, onSuccess: winStore_1});
		};

		var startInit = function (status) {
			deepEqual(status, 0, 'destroyWin/startInit');

			mI_1 = JSONStore.initCollection('namedStoreCollection', {fn: 'string'},
				{onFailure: fail, onSuccess: winInit_1, username: 'carlos9001', password: 'hello'});
		};

		JSONStore.destroy({onFailure: fail, onSuccess: startInit});
	});

	//Default collection + new collection w/ pwd
	//Destroy everything first
	//Init collection (implied user:jsonstore)> store > findAll > closeAll
	//Init nencrypted collection under user B > store > findAll > closeAll
	//Re-open user A's collection > check > closeAll
	//Re-open user B's collection > check > closeAll
	//Destroy everything
	asyncTest('Default collection + new collection w/ pwd', 22, function () {

		var mI_1 = null, mI_2 = null;

		var destroyWin = function (status) {
			deepEqual(status, 0, 'destroyWin');
			start();
		};

		var closeWin_13 = function (status) {
			deepEqual(status, 0, 'closeWin_13');
			JSONStore.destroy({onFailure: fail, onSuccess: destroyWin});
		};

		var winFindById2 = function (results) {
			deepEqual(results.length, 1, 'winFindById2');
			deepEqual(results[0].json.fn, 'timothy', 'winFindById2-2');
			deepEqual(results[0].json.age, 99, 'winFindById2-3');
			JSONStore.closeAll({onFailure: fail, onSuccess: closeWin_13});
		};

		var winInit_21 = function (status) {
			deepEqual(status, 1, 'winInit_21');
			mI_2.findById(1, {onFailure: fail, onSuccess: winFindById2});
		};

		var closeWin_12 = function (status) {
			deepEqual(status, 0, 'closeWin_12');
			mI_2 = JSONStore.initCollection('namedStoreCollection', {fn: 'string', age: 'number'},
				{onFailure: fail, onSuccess: winInit_21, username: 'raj', password: '12345'});
		};

		var winFindById1 = function (results) {
			deepEqual(results.length, 1, 'winFindById1');
			deepEqual(results[0].json.fn, 'carlitos', 'winFindById1-2');
			JSONStore.closeAll({onFailure: fail, onSuccess: closeWin_12});
		};

		var winInit_11 = function (status) {
			deepEqual(status, 1, 'winInit_11');
			mI_1.findById(1, {onFailure: fail, onSuccess: winFindById1});
		};

		var closeWin_2 = function (status) {
			deepEqual(status, 0, 'closeWin_2');
			mI_1 = JSONStore.initCollection('namedStoreCollection', {fn: 'string'},
				{onFailure: fail, onSuccess: winInit_11});
		};

		var winFind_2 = function (results) {
			deepEqual(results.length, 1, 'winFind_2');
			deepEqual(results[0].json.fn, 'timothy', 'winFind_2-2');
			deepEqual(results[0].json.age, 99, 'winFind_2-3');
			JSONStore.closeAll({onFailure: fail, onSuccess: closeWin_2});
		};

		var winStore_2 = function (count) {
			deepEqual(count, 1, 'winStore_2');
			mI_2.findAll({onFailure: fail, onSuccess: winFind_2});
		};

		var winInit_2 = function (status) {
			deepEqual(status, 0, 'winInit_2');
			mI_2.store({fn: 'timothy', age: 99}, {onFailure: fail, onSuccess: winStore_2});
		};

		var closeWin_1 = function (status) {
			deepEqual(status, 0, 'closeWin_1');
			mI_2 = JSONStore.initCollection('namedStoreCollection', {fn: 'string', age: 'number'},
				{onFailure: fail, onSuccess: winInit_2, username: 'raj', password: '12345'});
		};

		var winFind_1 = function (results) {
			deepEqual(results.length, 1, 'winFind_1');
			deepEqual(results[0].json.fn, 'carlitos', 'winFind_1-2');
			JSONStore.closeAll({onFailure: fail, onSuccess: closeWin_1});
		};

		var winStore_1 = function (count) {
			deepEqual(count, 1, 'winStore_1');
			mI_1.findAll({onFailure: fail, onSuccess: winFind_1});
		};

		var winInit_1 = function (status) {
			deepEqual(status, 0, 'winInit_1');
			mI_1.store({fn: 'carlitos'}, {onFailure: fail, onSuccess: winStore_1});
		};

		var startInit = function (status) {
			deepEqual(status, 0, 'destroyWin/startInit');

			mI_1 = JSONStore.initCollection('namedStoreCollection', {fn: 'string'},
				{onFailure: fail, onSuccess: winInit_1});
		};

		JSONStore.destroy({onFailure: fail, onSuccess: startInit});
	});

})();
