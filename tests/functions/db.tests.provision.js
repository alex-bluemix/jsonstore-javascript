/*global module, WL, deepEqual, ok, start, asyncTest, test, stop, _*/
/*jshint camelcase: false*/


var isDevice = function(){
    var a = navigator.userAgent||navigator.vendor||window.opera;
    return /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4));
};

if(isDevice()){
	//only run these tests on the device as they go straigh to db
	(function() {

		'use strict';

		//Dependencies:
		//var db = db;
		var model = JSONStore;

		var SCHEMA = {'customer_info.phone.home': 'string'};
		var COLLECTION = 'testProvision';
		var DATA =  [{ 'customer_id': '19201', 'customer_info': { 'firstname': 'John', 'lastname': 'Smith', 'address':
		{ 'city': 'Austin', 'street': '22 Carnegie Ave', 'state': 'TX' }, 'phone': [ { 'home': '712-191-1920' }, { 'work': '819-191-2011' } ] } },
		{ 'customer_id': '88192', 'customer_info': { 'firstname': 'Bobby', 'lastname': 'Jones', 'address': { 'city': 'Chattanooga', 'street':
		'12 Boxcart Lane', 'state': 'TX' }, 'phone': [ { 'home': '918-102-0010' }, { 'work': '918-221-1910' } ] } } ];

		function fail(err){
			ok(false, 'Failed with: ' + err);
			start();
		}

		//This will do a destroy before every test, which is not awesome when all the tests
		//depend on state
		// module('Provision',  { setup: function() {
//			stop();
//			console.log('setup destroy!!!!');
//			JSONStore.destroy()

//			.then(start)

//			.fail(fail);
		//   }});

		module('Provision');

		asyncTest( 'Destroy', 1, function(){
			JSONStore.destroy()
			.then(function(rc){
				deepEqual(rc, 0, 'destroy worked');
				start();
			})

			.fail(fail);
		});


		asyncTest( 'Close All' , 1, function(){

			var win = function(status){
				deepEqual(status, 0, 'Close all worked');
				start();
			};

			JSONStore.closeAll({onSuccess: win, onFailure: fail});

		});

		//********************************************************************************************
		// Basic provisioning tests
		//********************************************************************************************
		test('Provision', 1, function() {
			stop();

			var winInit = function(data){
				deepEqual(data, 0, 'Provisioning a non-existing table should return 0');
				start();
			};

			db.provision(COLLECTION, SCHEMA, {dropCollection: true, onSuccess: winInit, onFailure: fail, username: 'jsonstore'});
		});

		test('Store', 1, function() {
			stop();

			var win = function(data){
				deepEqual(data, 2, 'Added 2 records to database');
				start();
			};

			db.store(COLLECTION, DATA, {onSuccess: win, onFailure: fail});

		});

		test('Find by index', 2, function() {
			stop();

			var winFind = function(data){
				deepEqual(data.length, 1, 'Expected 1 returned record');
				var jsonData = data[0];
				var jsonDocument = jsonData.json;
				deepEqual(jsonDocument.customer_id, '19201', 'Expected customer ID 19201');
				start();
			};

			db.find(COLLECTION, [{'customer_info.phone.home': '712-191-1920'}], {onSuccess: winFind, onFailure: fail});

		});

		test('Empty find by index', 1, function() {
			stop();

			var win = function(data){
				deepEqual(data.length, 0, 'Expected 0 returned record');
				start();
			};

			// This should not find anything, but still call the success callback
			db.find(COLLECTION, [{'customer_info.phone.home': '999-999-9999'}], {onSuccess: win, onFailure: fail});
		});

		test('Find by invalid index', 1, function() {
			stop();

			var expectFail = function(data) {
				//TODO: Validate correct failure
				deepEqual(data, 22, 'failed with correct error code');
				start();
			};

			// This should call the error callback because an invalid key was used.
			db.find(COLLECTION, [{'customer_info.INVALIDKEY.home': '712-191-1920'}], {onSuccess: fail, onFailure: expectFail});

		});

		test('Provision existing table', 1, function() {
			stop();

			var winProvision = function(data){
				deepEqual(data, 1, 'table exists');
				start();
			};

			db.provision(COLLECTION, SCHEMA, {dropCollection: false, onSuccess: winProvision, onFailure: fail, username: 'jsonstore'});
		});

		//********************************************************************************************
		// Test using multiple indexes in the database of varying depth (e.g. x, y.z)
		//********************************************************************************************
		test('Setup Multiple Index tests', 1, function() {
			SCHEMA = {'lastcalldate': 'string', 'lastname': 'string', 'address.state': 'string'};
			COLLECTION = 'testProvision2';
			DATA =  [{'lastcalldate': '2012-07-09', 'lastname': 'Biglar', 'customerId': '137c6384-ec1a-4a29-bb53-7eeceeea6461', 'firstname':
			'Athena', 'address': {'city': 'woods', 'state': 'nj', 'localphone': '1576353'}}, {'lastcalldate': '2012-05-13', 'lastname': 'Stres',
			'customerId': '4601b0c9-4810-40d0-8d22-e4ab85533d56', 'firstname': 'Diana', 'address': {'city': 'austin', 'state': 'co', 'localphone':
			'3971031'}}, {'lastcalldate': '2012-05-24', 'lastname': 'Biglar', 'customerId': '53c284e5-2806-4e70-9a38-5d4492157c7d', 'firstname': 'Bala',
			'address': {'city': 'berlin', 'state': 'ny', 'localphone': '4568457'}}, {'lastcalldate': '2012-06-25', 'lastname': 'Biglar', 'customerId':
			'3acfe8bb-d497-4b16-b473-097250d36b71', 'firstname': 'Athena', 'address': {'city': 'dallas', 'state': 'co', 'localphone': '1576353'}},
			{'lastcalldate': '2012-08-01', 'lastname': 'Stres', 'customerId': '53c284e5-2806-4e70-9a38-5d4492157c7d', 'firstname': 'Athena', 'address':
			{'city': 'berlin', 'state': 'co', 'localphone': '3971031'}}, {'lastcalldate': '2012-05-25', 'lastname': 'Gikil', 'customerId':
			'f9c2cedc-3d32-48bc-a698-fcf4a2b167a0', 'firstname': 'Fama', 'address': {'city': 'london', 'state': 'ny', 'localphone': '1576353'}},
			{'lastcalldate': '2012-05-29', 'lastname': 'Biglar', 'customerId': '137c6384-ec1a-4a29-bb53-7eeceeea6461', 'firstname': 'Athena', 'address':
			{'city': 'woods', 'state': 'co', 'localphone': '1291875'}}, {'lastcalldate': '2012-06-25', 'lastname': 'Biglar', 'customerId':
			'53c284e5-2806-4e70-9a38-5d4492157c7d', 'firstname': 'Athena', 'address': {'city': 'custer', 'state': 'tn', 'localphone': '6061550'}},
			{'lastcalldate': '2012-07-06', 'lastname': 'Addar', 'customerId': 'b7a3ff61-d7ca-41e3-9a48-68657020b694', 'firstname': 'Diana', 'address':
			{'city': 'custer', 'state': 'nj', 'localphone': '1810973'}}, {'lastcalldate': '2012-05-28', 'lastname': 'Gikil', 'customerId':
			'53c284e5-2806-4e70-9a38-5d4492157c7d', 'firstname': 'Fama', 'address': {'city': 'austin', 'state': 'pa', 'localphone': '1576353'}}];

			ok(true, 'Changing table to ' + COLLECTION);
		});

		test('Multiple Index Provision', 1, function() {
			stop();

			var winProvision = function(data){
				deepEqual(data, 0, 'provision success');
				start();
			};

			db.provision(COLLECTION, SCHEMA, {dropCollection: true, onSuccess: winProvision, onFailure: fail, username: 'jsonstore'});
		});

		test('Multiple Index Store', 1, function() {
			stop();

			var winStore = function(data){
				deepEqual(data, 10, 'Added 10 records to database');
				start();
			};

			db.store(COLLECTION, DATA, {onSuccess: winStore, onFailure: fail});
		});

		test('Multiple Index Find', 2, function() {
			stop();

			var winFind = function(data){
				deepEqual(data.length, 1, 'Expected 1 returned record');
				var jsonData = data[0];
				var jsonDocument = jsonData.json;
				deepEqual(jsonDocument.customerId, '137c6384-ec1a-4a29-bb53-7eeceeea6461', 'Expected customer ID 137c6384-ec1a-4a29-bb53-7eeceeea6461');
				start();
			};

			db.find(COLLECTION, [{'lastcalldate': '2012-07-09', 'lastname': 'Biglar', 'address.state': 'nj'}], {onSuccess: winFind, onFailure: fail});
		});

		//********************************************************************************************
		// Test using an empty schema
		//********************************************************************************************
		test('Setup Empty Schema tests', 1, function() {
			COLLECTION = 'testProvision3';
			ok(true, 'Changing table to ' + COLLECTION);
		});

		test('Empty Schema Provision', 1, function() {
			stop();

			var winProvision = function(data){
				deepEqual(data, 0, 'data: '+data);
				start();
			};

			db.provision(COLLECTION, {}, {dropCollection: true, onSuccess: winProvision, onFailure: fail, username: 'jsonstore'});
		});

		test('Empty Schema Store', 1, function() {
			stop();

			var winStore = function(data){
				deepEqual(data, 10, 'Added 10 records to database');
				start();
			};

			db.store(COLLECTION, DATA, {onSuccess: winStore, onFailure: fail});
		});

		test ('Empty Schema Find', 1, function() {
			stop();

			var winFind = function(data){
				deepEqual(data.length, 10, 'Expected 10 returned record');
				start();
			};

			db.find(COLLECTION, [{}], {onSuccess: winFind, onFailure: fail});
		});

		test('Empty Schema Find by invalid index', 1, function() {

			stop();

			var expectFail = function(data) {
				deepEqual(data, 22, 'Expected failure callback for invalid index, data: ' + data);
				start();
			};

		// This should call the error callback because an invalid key was used
		// The DB was created with an empty schema, so it has no keys to find on
			db.find(COLLECTION, [{'lastcalldate': '2012-07-09', 'lastname': 'Biglar', 'address.state': 'nj'}],
				{onSuccess: fail, onFailure: expectFail});

		});

		//********************************************************************************************
		// Test using an invalid schema which uses and  Invalid SQL Data Type
		//********************************************************************************************

		test('Setup Invalid Schema tests', 1, function() {
			COLLECTION = 'testProvision4';
			ok(true, 'Changing table to ' + COLLECTION);
		});
		 
		test('Invalid Schema Provision', 1, function() {
			stop();

			var expectFail = function(data) {
				deepEqual(data, -1, 'Invalid schema should call failure callback with -1');
				start();
			};

		// This should call the error callback because a schema with an invalid data type for the key
			db.provision(COLLECTION, {'lastname': 'InvalidDataType'}, {dropCollection: true, onSuccess: fail, onFailure: expectFail, username: 'jsonstore'});
		});

		//********************************************************************************************
		// Validate if schema does not match the schema of an existing table
		//********************************************************************************************
		test('Setup Schema mismatch tests', 1, function() {
			COLLECTION = 'testProvision5';
			ok(true, 'Changing table to ' + COLLECTION);
		});

		//Open collection with one schema, close all, open with new schema, expected failure
		asyncTest('schema mismatch with initCollection', 3, function () {
			
			var mI;
			
			var expectedFailure = function (status) {
				deepEqual(status, -2, 'expected failure because the schema is different');
				start();
			};
			
			var closeAllWin1 = function (status) {
				deepEqual(status, 0, 'closeAllWin1');
				
				mI = null;
				
				model.initCollection('someCollection1321', {ln: 'string', fn: 'string'},
					{onFailure: expectedFailure, onSuccess: fail});
			};
			
			var initWin1 = function (status) {
				deepEqual(status, 0, 'new db');
				
				model.closeAll({onFailure: fail, onSuccess: closeAllWin1});
			};
			
			mI = model.initCollection('someCollection1321', {fn: 'string'},
				{onFailure: fail, onSuccess: initWin1});

		});

		test('Schema mismatch', 2, function() {
			stop();

			var expectFail = function(data) {
				deepEqual(data, -2, 'Mismatched schema should call failure callback with -2');
				start();
			};

			var nextProvision = function(data) {
				deepEqual(data, 0, 'provision success');
			// Called when first provision succedes.  Try provision again with a different schema, which should call the fail callback
				db.provision(COLLECTION, {'lastcalldate': 'string', 'lastname': 'string'},
					{dropCollection: false, onSuccess: fail, onFailure: expectFail, username: 'jsonstore'});
			};

			db.provision(COLLECTION, {'lastcalldate': 'string', 'lastname': 'string', 'address.state': 'string'},
				{dropCollection: true, onSuccess: nextProvision, onFailure: fail, username: 'jsonstore'});

		});

		test('Schema mismatch Empty requested', 2, function() {
			stop();

			var expectFail = function(data) {
				deepEqual(data, -2, 'Mismatched schema should call failure callback with -2');
				start();
			};

			var nextProvision = function(data) {
				deepEqual(data, 0, 'provision success');
			// Called when first provision succedes.  Try provision again with a different schema, which should call the fail callback
				db.provision(COLLECTION, {}, {dropCollection: false, onSuccess: fail, onFailure: expectFail, username: 'jsonstore'});
			};

			db.provision(COLLECTION, {'lastcalldate': 'string', 'lastname': 'string', 'address.state': 'string'},
				{dropCollection: true, onSuccess: nextProvision, onFailure: fail, username: 'jsonstore'});

		});

		test('Schema mismatch Empty table schema', 2, function() {
			stop();

			var expectFail = function(data) {
				deepEqual(data, -2, 'Mismatched schema should call failure callback with -2');
				start();
			};

			var nextProvision = function(data) {
				deepEqual(data, 0, 'provision success');
			// Called when first provision succedes.  Try provision again with a different schema, which should call the fail callback
				db.provision(COLLECTION, {'lastcalldate': 'string', 'lastname': 'string', 'address.state': 'string'},
					{dropCollection: false, onSuccess: fail, onFailure: expectFail, username: 'jsonstore'});
			};

			db.provision(COLLECTION, {}, {dropCollection: true, onSuccess: nextProvision, onFailure: fail, username: 'jsonstore'});

		});

		test('Schema mismatch order only', 2, function() {
			stop();

			var expectSuccess = function(data) {
				deepEqual(data, 1, 'Column order in schemas should not matter, table should exist');
				start();
			};

			var nextProvision = function(data) {
				deepEqual(data, 0, 'provision success');
			// Called when first provision succedes.  Try provision again with a different schema
			// Order of the columns in the schemas should not matter, so the success callback should wok
				db.provision(COLLECTION, {'lastname': 'string', 'address.state': 'string', 'lastcalldate': 'string'},
					{dropCollection: false, onSuccess: expectSuccess, onFailure: fail, username: 'jsonstore'});
			};

			db.provision(COLLECTION, {'lastcalldate': 'string', 'lastname': 'string', 'address.state': 'string'},
				{dropCollection: true, onSuccess: nextProvision, onFailure: fail, username: 'jsonstore'});

		});

		test('Schema mismatch single index', 2, function() {
			stop();

			var expectFail = function(data) {
				deepEqual(data, -2, 'Mismatched schema should call failure callback with -2');
				start();
			};

			var nextProvision = function(data) {
				deepEqual(data, 0, 'provision success');
			// Called when first provision succedes.  Try provision again with a different schema, which should call the fail callback
				db.provision(COLLECTION, {'lastname': 'string'}, {dropCollection: false, onSuccess: fail, onFailure: expectFail, username: 'jsonstore'});
			};

			db.provision(COLLECTION, {'lastcalldate': 'string'}, {dropCollection: true, onSuccess: nextProvision, onFailure: fail, username: 'jsonstore'});

		});

			// Note this test changes if we make column names case sensitive
		test('Schema mixed case', 1, function() {
			stop();

			var expectFailure = function(data) {
				deepEqual(data, -1, 'Column names are not case sensitive, duplicate column names should fail');
				start();
			};

			// Since the column names are case insenstivie, the following provision should fail
			db.provision(COLLECTION, {'lastcalldate': 'string', 'LastCallDate': 'string'},
				{dropCollection: true, onSuccess: fail, onFailure: expectFailure, username: 'jsonstore'});
		});

		// Note this test changes if we make column names case sensitive
		test('Schema mismatch case only', 2, function() {
			stop();

			var expectSuccess = function(data) {
				deepEqual(data, 1, 'Column names are not case sensitive, table should exist');
				start();
			};

			var nextProvision = function(data) {
				deepEqual(data, 0, 'provision success');
			// Called when first provision succedes.  Since Column Names are not case sensitive, this should get a success callback
			// indicating the table already exists.
				db.provision(COLLECTION, {'LASTCALLDATE': 'string'}, {dropCollection: false, onSuccess: expectSuccess, onFailure: fail, username: 'jsonstore'});
			};

			db.provision(COLLECTION, {'lastcalldate': 'string'}, {dropCollection: true, onSuccess: nextProvision, onFailure: fail, username: 'jsonstore'});
		});
			 
			//********************************************************************************************
			// Validate if schema with floating point type can be provisioned
			//********************************************************************************************
		test('Schema with floating point index', 4, function() {
			stop();

			var findSuccess = function(data) {
				deepEqual(data.length, 1, 'Found 1 expected record');
				var jsonData = data[0];
				var jsonDocument = jsonData.json;
				deepEqual(jsonDocument.lastcalldate, 1.25, 'Expected real value 1.25');
				start();
			};

			var expectSuccessStore = function(data) {
			// Make sure we can get the real number back on find.
				deepEqual(data, 1, 'stored 1 thing');
				db.find(COLLECTION, [{'lastcalldate': 1.25}], {onSuccess: findSuccess, onFailure: fail});
			};

			var nextProvision = function(data) {
				deepEqual(data, 0, 'provision success');
				// Called when provision succedes.  Store a real value, then make sure we can get it back in the callback
				db.store(COLLECTION, [{'lastcalldate' : 1.25}], {onSuccess: expectSuccessStore, onFailure: fail});
			};

			db.provision(COLLECTION, {'lastcalldate': 'number'}, {dropCollection: true, onSuccess: nextProvision, onFailure: fail, username: 'jsonstore'});
		});

		test('Schema mismatch after close', 3, function() {
			stop();

			var expectFail = function(data) {
				deepEqual(data, -2, 'Mismatched schema should call failure callback with -2');
				start();
			};

			var nextProvision = function(data) {
				deepEqual(data, 0, 'classAll success');
				// Called after the first provision then closeAll succedes.
				// Try provision again with a different schema, which should call the fail callback
				db.provision('testCollection6', {'lastcalldate': 'string', 'lastname': 'string'},
					{dropCollection: false, onSuccess: fail, onFailure: expectFail, username: 'jsonstore'});
			};

			var closeAll = function(data) {
				deepEqual(data, 0, 'first provision success');
				db.closeAll({onSuccess: nextProvision, onFailure: fail});
			};

			db.provision('testCollection6', {'lastcalldate': 'string', 'lastname': 'string', 'address.state': 'string'},
				{dropCollection: true, onSuccess: closeAll, onFailure: fail, username: 'jsonstore'});

		});


		asyncTest('Init with invalid usernames', 2, function () {

			var mI;

			var badUserWin2 = function (status) {
				deepEqual(status, -7, 'invalid username');
				start();
			};

			var badUserWin1 = function (status) {
				deepEqual(status, -7, 'invalid username');
				mI = model.initCollection('baduser1', {fn: 'string'},
					{onFailure: badUserWin2, onSuccess: fail, username: 'l33t_user'});
			};

			mI = model.initCollection('baduser1', {fn: 'string'},
				{onFailure: badUserWin1, onSuccess: fail, username: 'rtimothy@us.ibm.com'});
		});


	})();
}

