/*global test, module, deepEqual, ok, start, stop, deepEqual*/
(function() {

	'use strict';

	//Dependencies:
	var model = JSONStore;

	var modelInstance;
	var testData;
	var perfResults = [];

	// EncryptedCache.__proto__.secureRandom = function (onCompleteHandler) {
	//   onCompleteHandler( EncryptedCache.random() );
	// };

	function customerData10(){
		return {
			schema : {'firstname': 'string', 'lastname' : 'string', 'address.city' : 'string', 'address.state': 'string'},
			collection : 'perf',
			data : [{'lastcalldate':'2012-07-25','firstname':'Athena','lastname':'Gikil','products':['Frigidaire'],'address':{'city':'custer','state':'co','localphone':'3373804'},'customerId':'6955fd18-2de5-46ba-8ded-5df78d30578f'},{'lastcalldate':'2012-08-01','firstname':'Athena','lastname':'Gikil','products':['GE Dryer','Whirlpool Washer'],'address':{'city':'berlin','state':'nj','localphone':'3063813'},'customerId':'b5c29b8c-3ebe-4177-8c27-d086b3e54660'},{'lastcalldate':'2012-05-16','firstname':'Athena','lastname':'Gikil','products':['GE Dryer','Sony Mixer'],'address':{'city':'london','state':'tx','localphone':'3063813'},'customerId':'e3c0e641-f50f-466e-8f73-4dbf00ade859'},{'lastcalldate':'2012-07-26','firstname':'Molar','lastname':'Gikil','products':['Sony Mixer','Whirpool Dishwasher'],'address':{'city':'woods','state':'ar','localphone':'5108428'},'customerId':'2d223554-8f88-4bdb-9624-8e3de9fe5387'},{'lastcalldate':'2012-06-30','firstname':'Bala','lastname':'Gikil','products':['Sony Mixer','GE Utrawave','GE Dryer'],'address':{'city':'woods','state':'ar','localphone':'3649313'},'customerId':'51cfa6a3-f271-4ca5-b4d5-f140af3097f3'},{'lastcalldate':'2012-07-26','firstname':'Fama','lastname':'Stres','products':['GE Dryer','Whirlpool Washer'],'address':{'city':'woods','state':'nj','localphone':'1594926'},'customerId':'51cfa6a3-f271-4ca5-b4d5-f140af3097f3','orders':[{'ordid':15122,'status':'open','comments':'Washer and dryer not working','filedon':'2012-07-10'},{'ordid':12920,'status':'closeAlld','comments':'Dishwasher leaking','filedon':'2011-12-11'}]},{'lastcalldate':'2012-08-03','firstname':'Athena','lastname':'Gikil','products':['Whirpool Dishwasher','Frigidaire','Sony Mixer'],'address':{'city':'berlin','state':'tn','localphone':'1594926'},'customerId':'8a898ae3-4d0b-4715-b315-7e7a291c9124'},{'lastcalldate':'2012-06-21','firstname':'Athena','lastname':'Biglar','products':['Whirlpool Washer','Whirpool Dishwasher'],'address':{'city':'austin','state':'nj','localphone':'5108428'},'customerId':'6955fd18-2de5-46ba-8ded-5df78d30578f'},{'lastcalldate':'2012-05-23','firstname':'Athena','lastname':'Gikil','products':['GE Utrawave','Sony Mixer'],'address':{'city':'berlin','state':'ca','localphone':'5108428'},'customerId':'2d223554-8f88-4bdb-9624-8e3de9fe5387'},{'lastcalldate':'2012-05-22','firstname':'Diana','lastname':'Addar','products':['Sony Mixer','GE Utrawave','Whirpool Dishwasher'],'address':{'city':'austin','state':'pa','localphone':'3776149'},'customerId':'6955fd18-2de5-46ba-8ded-5df78d30578f'}],
			numStored : 10,
			findBala : 1
		};
	}

	testData = customerData10();

	var fail = function (err) {
		ok(false, 'Failed with: ' + err + ' ' + model.getErrorMessage(err));
		start();
	};

	/************************************************
	Start of the more complex customer tests
	**************************************************/
	module('Performance');

	//Create a new model, only to drop it in the next step
	test('Create Model', 1, function(){
		stop();

		var winInit = function(data){
			deepEqual(data, 0, 'new collection:'+data);
			start();
		};

		var options = { onSuccess: winInit, onFailure: fail, dropCollection: true};
		modelInstance = JSONStore.initCollection(testData.collection, testData.schema, options);
	});

	test('Store', 2, function() {
		stop();

		var perfStart, perfEnd;
		
		var winStore = function(data){
			perfEnd = new Date();
			perfResults.push({ 'Store': (perfEnd.getTime() - perfStart.getTime()) });
			ok(true, 'Store of ' + testData.numStored + ' records took (millis): ' + (perfEnd.getTime() - perfStart.getTime()));
			deepEqual(data, testData.numStored, 'Expected for number of records stored: ' + testData.numStored);
			start();
		};
		//Store the array, it will get parsed by top level elements
		perfStart = new Date();
		modelInstance.store(testData.data, {onSuccess: winStore, onFailure: fail});

	});


	test('Find by string', 2, function() {
		stop();

		var perfStart, perfEnd;

		var win = function(data){
			perfEnd = new Date();
			perfResults.push({ 'Find by string': (perfEnd.getTime() - perfStart.getTime()) });
			ok(true, 'Search of ' + testData.numStored + ' records took (millis): ' + (perfEnd.getTime() - perfStart.getTime()));
			deepEqual(data.length, testData.findBala, 'Expected matches for firstname Bala: ' +testData.findBala);
			start();
		};

		perfStart = new Date();
		modelInstance.find({firstname: 'Bala'}, {onSuccess: win, onFailure: fail});
	});


	test('Find All', 2, function() {
		stop();
		
		var perfStart, perfEnd;

		var winFindAll = function(data){
			perfEnd = new Date();
			perfResults.push({ 'Find All': (perfEnd.getTime() - perfStart.getTime()) });
			ok(true, 'Store of all records took (millis): ' + (perfEnd.getTime() - perfStart.getTime()));
			deepEqual(data.length, testData.numStored, 'Find all should return : ' + testData.numStored);
			start();
		};
		perfStart = new Date();
		modelInstance.findAll({onSuccess: winFindAll, onFailure: fail});
	});

	test('Find Bala and Update', 3, function() {
		stop();

		var perfStart, perfEnd;

		var winReplace = function (updateData){
			perfEnd = new Date();
			perfResults.push({ 'Find bala and update': (perfEnd.getTime() - perfStart.getTime()) });
			ok(true, 'Update of 1 records took (millis): ' + (perfEnd.getTime() - perfStart.getTime()));
			deepEqual(updateData, 1, 'Expected an update of 1 record');
			start();
		};

		var winFind = function(data){
			deepEqual(data.length, testData.findBala,  'Expected 24 matches for firstname Bala');
			data[0].json.firstname = 'Holla';
			//test perf to update 1 record by object
			perfStart = new Date();
			modelInstance.replace(data[0], { onSuccess: winReplace, onFailure: fail });
		};

		modelInstance.find({firstname: 'Bala'}, {onSuccess: winFind, onFailure: fail});
	});

	test('Delete by query', 2, function() {
		stop();

		var perfStart, perfEnd;

		var winRemove = function(data){
			perfEnd = new Date();
			perfResults.push({ 'Delete by query': (perfEnd.getTime() - perfStart.getTime()) });
			ok(true, 'Delete of ' + testData.findBala + ' records took (millis): ' + (perfEnd.getTime() - perfStart.getTime()));
			deepEqual(1, data, 'Expected matches for delete firstname Holla: 1');
			start();
		};

		perfStart = new Date();
		modelInstance.remove({firstname: 'Holla'}, {onSuccess: winRemove, onFailure: fail});
	});


	test('Find All Post-Delete', 2, function() {
		stop();
		
		var perfStart, perfEnd;

		var winFindAll = function(data){
			perfEnd = new Date();
			perfResults.push({ 'Find All Post Delete': (perfEnd.getTime() - perfStart.getTime()) });
			ok(true, 'Find all (after delete) records took (millis): ' + (perfEnd.getTime() - perfStart.getTime()));
			deepEqual( (testData.numStored  - 1) , data.length,  'Find all should return : ' + (testData.numStored  - testData.findBala));
			start();
		};

		perfStart = new Date();
		modelInstance.find({}, {onSuccess: winFindAll, onFailure: fail});
	});

	test('Print results', 7, function(){
		ok(true, 'Results in millis  for ' + testData.numStored + ' records');
		for(var i =0; i < perfResults.length; i++){
			for(var j in perfResults[i]){
				if (true) {
					ok(true, j + ' ' + perfResults[i][j]);
				}
			}
		}
		
	});

})();