/*global test, module, deepEqual, ok*/
/*jshint maxparams: 5*/
(function() {

	'use strict';
	var UNDEF;

	var check = JSONStoreUtil.check;

	module('Check');

/*	Methods tested:

	isAlphaNumeric: __isAlphaNumeric,
	isObject: __isObject,
	isSimpleObject: __isSimpleObject,
	isArrayOfObjects : __isArrayOfObjects,
	containsDuplicateKeys : __containsDuplicateKeys,
	isValidAdapter : __isValidAdapter,
	isInt : __isInt,
	isValidDocument : __isValidDocument,
	isFunction : __isFunction,
	isString : __isString,
	isUndefined : __isUndefined,
	isBoolean : __isBoolean,
	isCompatibleBoolean : __isCompatibleBoolean,
	isValidLoadObject : __isValidLoadObject,
	isPartofSearchFields : __isPartofSearchFields,
	countKeys : __countKeys,
	mergeObjects : __mergeObjects,
	isReservedWord : __isReservedWord,
	isArrayOfInts : __isArrayOfInts,
	isValidSchemaObject : __isValidSchemaObject,
	isNumber : __isNumber
  filterPick : __filterPick,
  isArrayOfDocuments : __isArrayOfDocuments,
  isArray : __isArray,
  isValidSortObject : __isValidSortObject,
  isArrayOfSAFields : __isArrayOfSAFields,
  isEmptyArray : __isEmptyArray
	*/

	test('isAlphaNumeric', 23, function () {

		ok(check.isAlphaNumeric('hello'), 'normal string');
		ok(check.isAlphaNumeric('HELLO'), 'normal string uppercase');
		ok(check.isAlphaNumeric('213123'), 'just numbers as string');
		ok(check.isAlphaNumeric('hello23423'), 'words + numbers');
		ok(check.isAlphaNumeric('465657hello'), 'numbers + words');
		ok(check.isAlphaNumeric('32423hello23423'), 'numbers + words + numbers');
		ok(check.isAlphaNumeric('a4s8j4o0s8'), 'numbers + words...');

		ok(!check.isAlphaNumeric('hello world'), 'normal string with space');
		ok(!check.isAlphaNumeric('HELLO WORLD'), 'normal string uppercase with space');
		ok(!check.isAlphaNumeric('213123 234676'), 'numbers + space + numbers');
		ok(!check.isAlphaNumeric('21sfsdf3123 '), 'words and numbers + space');
		ok(!check.isAlphaNumeric(' 21sfsdf3123'), 'space + words and numbers');
		ok(!check.isAlphaNumeric('tim.robertson@gmail.com'), 'email addr 1');
		ok(!check.isAlphaNumeric('rtimothy@us.ibm.com'), 'email addr 2');
		ok(!check.isAlphaNumeric('(%^'), 'symbols');
		ok(!check.isAlphaNumeric('&^&&* '), 'symbols + space');
		ok(!check.isAlphaNumeric(null), 'null');
		ok(!check.isAlphaNumeric(UNDEF), 'undefined');
		ok(!check.isAlphaNumeric(function(){}), 'function');
		ok(!check.isAlphaNumeric([]), 'array');
		ok(!check.isAlphaNumeric({}), 'obj');
		ok(!check.isAlphaNumeric(true), 'true');
		ok(!check.isAlphaNumeric(false), 'false');
	});

	test('isObject', 11, function () {

		ok(check.isObject({}), 'empty object');
		ok(check.isObject({fn: 'carlos'}), 'normal object');
		ok(check.isObject({fn: {name: 'carlos'}}), 'nested object');
		ok(check.isObject([], {isArrayValid: true}), 'array with true flag');

		ok(!check.isObject('hello'), 'string');
		ok(!check.isObject(null), 'null');
		ok(!check.isObject(UNDEF), 'undefined');
		ok(!check.isObject(function(){}), 'function');
		ok(!check.isObject([]), 'array without the true flag');
		ok(!check.isObject(true), 'true');
		ok(!check.isObject(false), 'false');
	});

	test('isSimpleObject', 11, function () {

		ok(check.isSimpleObject({}), 'empty object');
		ok(check.isSimpleObject({fn: 'carlos'}), 'normal object');

		ok(!check.isSimpleObject([]), 'array should not be a simple object');
		ok(!check.isSimpleObject({fn: {name: 'carlos'}}), 'nested object');
		ok(!check.isSimpleObject({arr: [1,2,3]}), 'nested array in obj');
		ok(!check.isSimpleObject('hello'), 'string');
		ok(!check.isSimpleObject(null), 'null');
		ok(!check.isSimpleObject(UNDEF), 'undefined');
		ok(!check.isSimpleObject(function(){}), 'function');
		ok(!check.isSimpleObject(true), 'true');
		ok(!check.isSimpleObject(false), 'false');
	});

	test('isArrayOfObjects', 15, function () {

		ok(check.isArrayOfObjects( [{fn: 'carlos'}] ), 'array with single obj');
		ok(check.isArrayOfObjects( [
			{fn: 'carlos'},
			{fn: 'jeremy'},
			{fn: 'tim3324'},
			{fn: true},
			{fn: false},
			{fn: null},
			{fn: 42234},
			{fn: '2234234'},
			{fn: UNDEF}
		]
		), 'array with a few obj');

		ok(!check.isArrayOfObjects([1,2,3]), 'array with numbers');
		ok(!check.isArrayOfObjects(['hey', 'hello']), 'array with strings');
		ok(!check.isArrayOfObjects({}), 'empty object');
		ok(!check.isArrayOfObjects({fn: 'carlos'}), 'normal object');
		ok(!check.isArrayOfObjects([]), 'empty array');
		ok(!check.isArrayOfObjects({fn: {name: 'carlos'}}), 'nested object');
		ok(!check.isArrayOfObjects({arr: [1,2,3]}), 'nested array in obj');
		ok(!check.isArrayOfObjects('hello'), 'string');
		ok(!check.isArrayOfObjects(null), 'null');
		ok(!check.isArrayOfObjects(UNDEF), 'undefined');
		ok(!check.isArrayOfObjects(function(){}), 'function');
		ok(!check.isArrayOfObjects(true), 'true');
		ok(!check.isArrayOfObjects(false), 'false');
	});

	test('containsDuplicateKeys', 16, function () {

		ok(check.containsDuplicateKeys({fn: 'carlos', fN: 'carlos'}), 'keys: fn and fN');
		ok(check.containsDuplicateKeys({fn: 'carlos', Fn: 'carlos'}), 'keys: fn and Fn');
		ok(check.containsDuplicateKeys({fn: 'carlos', FN: 'carlos'}), 'keys: fn and FN');
		ok(check.containsDuplicateKeys({fn: 'carlos', ln: 'andreu', FN: 'carlos'}), 'keys: fn, ln and FN');
		ok(check.containsDuplicateKeys({fn: 'carlos', ln: 'andreu', fnn: 'carlos', LN: 'hey'}), 'keys: fn, ln and fnn, LN');

		ok(!check.containsDuplicateKeys({fn: 'carlos', ln: 'andreu', fnn: 'carlos'}), 'keys: fn, ln and fnn');
		ok(!check.containsDuplicateKeys({fn: 'carlos'}), 'normal object');
		ok(!check.containsDuplicateKeys({fn: {name: 'carlos'}}), 'nested object');
		ok(!check.containsDuplicateKeys({arr: [1,2,3]}), 'nested array in obj');

		//Note: If it's not an object (arrays are not treated as objects), it returns true.

		ok(check.containsDuplicateKeys([]), 'empty array');
		ok(check.containsDuplicateKeys('hello'), 'string');
		ok(check.containsDuplicateKeys(null), 'null');
		ok(check.containsDuplicateKeys(UNDEF), 'undefined');
		ok(check.containsDuplicateKeys(function(){}), 'function');
		ok(check.containsDuplicateKeys(true), 'true');
		ok(check.containsDuplicateKeys(false), 'false');
	});

	test('isValidAdapter', 20, function () {

		ok(check.isValidAdapter({name: 'myAdapter'}), 'valid adapter, just name');
		ok(check.isValidAdapter({name: 'myAdapter', add: '', replace: '', remove: ''}), 'valid adapter, all the right keys');
		ok(check.isValidAdapter({name: 'myAdapter', add: '', replace: '', remove: ''}),'valid adapter with optional onSuccess and onFailure');
		ok(check.isValidAdapter({name: 'myAdapter', add: '', update: '', remove: ''}), 'adapter with update instead of replace');
		ok(check.isValidAdapter({name: 'myAdapter', replace: '', remove: ''}), 'missing add');
		ok(check.isValidAdapter({name: 'myAdapter', add: '', remove: ''}), 'missing replace');
		ok(check.isValidAdapter({name: 'myAdapter', add: '', replace: ''}), 'missing remove');

		ok(!check.isValidAdapter({name: ''}), 'adapter name is empty');
		ok(!check.isValidAdapter({test: ''}), 'invalid adapter, it does not have a name key' );
		ok(!check.isValidAdapter({}), 'empty object');
		ok(!check.isValidAdapter({fn: 'carlos'}), 'normal object');
		ok(!check.isValidAdapter({fn: {name: 'carlos'}}), 'nested object');
		ok(!check.isValidAdapter([], true), 'array with true flag');
		ok(!check.isValidAdapter('hello'), 'string');
		ok(!check.isValidAdapter(null), 'null');
		ok(!check.isValidAdapter(UNDEF), 'undefined');
		ok(!check.isValidAdapter(function(){}), 'function');
		ok(!check.isValidAdapter([]), 'array without the true flag');
		ok(!check.isValidAdapter(true), 'true');
		ok(!check.isValidAdapter(false), 'false');
	});

	test('isInt', 15, function () {

		ok(check.isInt(1), 'simple int');
		ok(check.isInt(1432312), 'long number');

		ok(!check.isInt(3.14), 'float should fail');
		ok(!check.isInt('342342342323432'), 'number as string');
		ok(!check.isInt({}), 'empty object');
		ok(!check.isInt({fn: 'carlos'}), 'normal object');
		ok(!check.isInt([]), 'array should not be a simple object');
		ok(!check.isInt({fn: {name: 'carlos'}}), 'nested object');
		ok(!check.isInt({arr: [1,2,3]}), 'nested array in obj');
		ok(!check.isInt('hello'), 'string');
		ok(!check.isInt(null), 'null');
		ok(!check.isInt(UNDEF), 'undefined');
		ok(!check.isInt(function(){}), 'function');
		ok(!check.isInt(true), 'true');
		ok(!check.isInt(false), 'false');
	});

	test('isValidDocument', 19, function () {

		var invalidDoc = {},
		validDoc = {};

		validDoc[constant.ID_KEY] = 1;
		validDoc[constant.JSON_DATA_KEY] = {fn: 'carlos'};

		ok(check.isValidDocument(validDoc), 'valid doc');

		validDoc[constant.ID_KEY] = '1'; //strings that turn into numbers are valid
		validDoc[constant.JSON_DATA_KEY] = {fn: 'carlos'};

		ok(check.isValidDocument(validDoc), 'valid doc, key is a string');

		invalidDoc[constant.ID_KEY] = '3.14'; //turns into float => invalid
		invalidDoc[constant.JSON_DATA_KEY] = {fn: 'carlos'};

		ok(!check.isValidDocument(invalidDoc), 'invalid doc, key is a string that gets coereced to a float');

		invalidDoc[constant.ID_KEY] = 1;
		invalidDoc[constant.JSON_DATA_KEY] = [];

		ok(!check.isValidDocument(invalidDoc), 'invalid doc, json data must be an obj');

		invalidDoc[constant.ID_KEY] = 1;
		invalidDoc[constant.JSON_DATA_KEY] = null;

		ok(!check.isValidDocument(invalidDoc), 'invalid doc, json data must not be null');

		ok(!check.isValidDocument(1), 'simple int');
		ok(!check.isValidDocument(143234234234423423423234234), 'long number');
		ok(!check.isValidDocument('342342342323432'), 'number as string');
		ok(!check.isValidDocument({}), 'empty object');
		ok(!check.isValidDocument({fn: 'carlos'}), 'normal object');
		ok(!check.isValidDocument([]), 'array should not be a simple object');
		ok(!check.isValidDocument({fn: {name: 'carlos'}}), 'nested object');
		ok(!check.isValidDocument({arr: [1,2,3]}), 'nested array in obj');
		ok(!check.isValidDocument('hello'), 'string');
		ok(!check.isValidDocument(null), 'null');
		ok(!check.isValidDocument(UNDEF), 'undefined');
		ok(!check.isValidDocument(function(){}), 'function');
		ok(!check.isValidDocument(true), 'true');
		ok(!check.isValidDocument(false), 'false');
	});


	test('isFunction', 8, function () {

		ok(check.isFunction(function(){}), 'function');

		ok(!check.isFunction('hello'), 'string');
		ok(!check.isFunction(null), 'null');
		ok(!check.isFunction(UNDEF), 'undefined');
		ok(!check.isFunction(true), 'true');
		ok(!check.isFunction(false), 'false');
		ok(!check.isFunction({}), 'obj');
		ok(!check.isFunction([]), 'array');
	});

	test('isString', 9, function () {

		ok(check.isString('hello'), 'string');
		ok(check.isString(''), 'empty string');

		ok(!check.isString(null), 'null');
		ok(!check.isString(UNDEF), 'undefined');
		ok(!check.isString(function(){}), 'function');
		ok(!check.isString(true), 'true');
		ok(!check.isString(false), 'false');
		ok(!check.isString({}), 'obj');
		ok(!check.isString([]), 'array');

	});

	test('isUndefined', 8, function () {

		ok(check.isUndefined(UNDEF), 'undefined');
		ok(check.isUndefined(null), 'null is undefined');

		ok(!check.isUndefined('hello'), 'string');
		ok(!check.isUndefined(function(){}), 'function');
		ok(!check.isUndefined(true), 'true');
		ok(!check.isUndefined(false), 'false');
		ok(!check.isUndefined({}), 'obj');
		ok(!check.isUndefined([]), 'array');
	});

	test('isBoolean', 8, function () {

		ok(check.isBoolean(true), 'true');
		ok(check.isBoolean(false), 'false');

		ok(!check.isBoolean(UNDEF), 'undefined');
		ok(!check.isBoolean(null), 'null is undefined');
		ok(!check.isBoolean('hello'), 'string');
		ok(!check.isBoolean(function(){}), 'function');
		ok(!check.isBoolean({}), 'obj');
		ok(!check.isBoolean([]), 'array');

	});

	test('isCompatibleBoolean', 10, function () {
		ok(check.isCompatibleBoolean(1), 'true');
		ok(check.isCompatibleBoolean(0), 'true');
		ok(check.isCompatibleBoolean('1'), 'true');
		ok(check.isCompatibleBoolean('0'), 'true');
		ok(check.isCompatibleBoolean(false), 'true');
		ok(check.isCompatibleBoolean(true), 'true');

		ok(!check.isCompatibleBoolean(100), 'false');
		ok(!check.isCompatibleBoolean('100'), 'false');
		ok(!check.isCompatibleBoolean({}), 'false');
		ok(!check.isCompatibleBoolean(null), 'false');
	});

	test('isValidLoadObject', 8, function () {

		ok(check.isValidLoadObject({ procedure: 'getCustomers', params: [], key: 'customers' }), 'valid load obj');
		ok(check.isValidLoadObject({ procedure: '234234', params: [1,2,3, true, false, 'sdffsd'], key: '234234' }), 'valid load obj');

		ok(!check.isValidLoadObject(UNDEF), 'undefined');
		ok(!check.isValidLoadObject(null), 'null is undefined');
		ok(!check.isValidLoadObject('hello'), 'string');
		ok(!check.isValidLoadObject(function(){}), 'function');
		ok(!check.isValidLoadObject({}), 'obj');
		ok(!check.isValidLoadObject([]), 'array');

	});

	test('isPartOfSchema', 14, function () {

		var schema = {fn: 'string', age: 'number'};
		var additionalSchema = {lol: 'string'};

		ok(check.isPartofSearchFields({fn: 'carlos'}, schema), 'obj is in schema fn');
		ok(check.isPartofSearchFields({age: 99}, schema), 'valid in schema age');
		ok(check.isPartofSearchFields({fn: 'tim', age: 100}, schema), 'valid in schema fn and age');
		ok(check.isPartofSearchFields({fn: 'tim', age: 100, lol: 'lol'}, schema, additionalSchema), 'valid in schema fn and age with additional schema containing valid key lol');
		ok(check.isPartofSearchFields({lol: 'lol'}, additionalSchema), 'valid in additional schema containing key lol');

		ok(!check.isPartofSearchFields({invalidKey: 'hey'}, schema), 'should fail invalidKey only');
		ok(!check.isPartofSearchFields({fn: 'tim', age: 100, invalidKey: 'hey'}, schema), 'invalidKey and other valid keys');
		ok(!check.isPartofSearchFields(UNDEF), 'undefined');
		ok(!check.isPartofSearchFields(null), 'null is undefined');
		ok(!check.isPartofSearchFields('hello'), 'string');
		ok(!check.isPartofSearchFields(function(){}), 'function');
		ok(!check.isPartofSearchFields({}), 'obj');
		ok(!check.isPartofSearchFields([]), 'array');

		ok(!check.isPartofSearchFields(schema, additionalSchema), 'should fail since scheme should not contain anything from additional schema');

	});

	test('countKeys', 9, function () {

		deepEqual(check.countKeys({ procedure: 'getCustomers', params: [], key: 'customers' }), 3, 'valid obj');
		deepEqual(check.countKeys({ procedure: '234234', params: [1,2,3, true, false, 'sdffsd'], key: '234234' }), 3, 'another valid load obj');
		deepEqual(check.countKeys({}), 0, 'empty obj');
		deepEqual(check.countKeys({fn: 'carlos'}), 1, '1 key obj');

		deepEqual(check.countKeys(UNDEF), -1, 'undefined');
		deepEqual(check.countKeys(null), -1, 'null is undefined');
		deepEqual(check.countKeys('hello'), -1, 'string');
		deepEqual(check.countKeys(function(){}), -1, 'function');
		deepEqual(check.countKeys([]), -1, 'array');

	});

	test('mergeObjects', 7, function () {

		deepEqual(check.mergeObjects({fn: 'carlos' }, {ln: 'andreu'}), {fn: 'carlos', ln: 'andreu'}, 'valid objs');
		deepEqual(check.mergeObjects({}, {}), {}, 'valid empty objs');

		deepEqual(check.mergeObjects(UNDEF, UNDEF), -1, 'undefined');
		deepEqual(check.mergeObjects(null, null), -1, 'null is undefined');
		deepEqual(check.mergeObjects('hello', 'hey'), -1, 'string');
		deepEqual(check.mergeObjects(function(){}, function(){}), -1, 'function');
		deepEqual(check.mergeObjects([], []), -1, 'array');

	});


	test('isReservedWord', 10, function () {
		ok(!check.isReservedWord('hello'), 'normal string');
		ok(!check.isReservedWord('rtimothy'), 'normal username');
		ok(!check.isReservedWord(''), 'empty');
		ok(check.isReservedWord('jsonstore'), 'default username');
		ok(check.isReservedWord('JSONSTORE'), 'default username caps');
		ok(check.isReservedWord('dpk'), 'dpk android key');
		ok(check.isReservedWord('DPK'), 'dpk android key caps');
		ok(check.isReservedWord('JSONStoreKey'), 'dpk ios key');
		ok(check.isReservedWord('jsonstorekey'), 'dpk ios key caps');
		ok(!check.isReservedWord(undefined), 'undefined');
	});

	test('isArrayOfInts', 8, function () {

		ok(check.isArrayOfInts([1,2,3]), 'simple array of ints');
		ok(check.isArrayOfInts([234234]), 'simple array of int');
		ok(!check.isArrayOfInts(null), 'null');
		ok(!check.isArrayOfInts(UNDEF), 'undef');
		ok(!check.isArrayOfInts({}), 'empty obj');
		ok(!check.isArrayOfInts([]), 'empty array');
		ok(!check.isArrayOfInts([1,'a',3]), 'string');
		ok(!check.isArrayOfInts([1,1.2,3]), 'float');

	});

	test('isValidSchemaObject', 14, function () {

		ok(check.isValidSchemaObject({fn: 'string'}), 'string');
		ok(check.isValidSchemaObject({active: 'boolean'}), 'boolean');
		ok(check.isValidSchemaObject({age: 'number'}), 'number');
		ok(check.isValidSchemaObject({count: 'integer'}), 'integer');

		ok(check.isValidSchemaObject({fn: 'string', active: 'boolean'}), 'string and boolean');
		ok(check.isValidSchemaObject({fn: 'string', active: 'boolean', num: 'number', intt: 'integer'}), 'all valid');
		ok(!check.isValidSchemaObject({active: 'bool'}), 'bool');
		ok(!check.isValidSchemaObject({age: '123'}), 'numbers');
		ok(!check.isValidSchemaObject({count: '@#$#'}), 'symbols');
		ok(!check.isValidSchemaObject({_id: 'integer'}), 'reserved word');
		ok(!check.isValidSchemaObject({json: 'string'}), 'reserved word');
		ok(!check.isValidSchemaObject({_operation: 'integer'}), 'reserved word');
		ok(!check.isValidSchemaObject({_deleted: 'integer'}), 'reserved word');
		ok(!check.isValidSchemaObject({_dirty: 'integer'}), 'reserved word');

	});

	test('isNumber', 16, function () {

		ok(check.isNumber(1), 'simple int');
		ok(check.isNumber(1432312), 'long number');
		ok(check.isNumber(3.14), 'float number');
		ok(check.isNumber(-12), 'neg number');
		ok(check.isNumber('5'), 'should be num');

		ok(!check.isNumber({}), 'empty object');
		ok(!check.isNumber({fn: 'carlos'}), 'normal object');
		ok(!check.isNumber([]), 'array should not be a simple object');
		ok(!check.isNumber({fn: {name: 'carlos'}}), 'nested object');
		ok(!check.isNumber({arr: [1,2,3]}), 'nested array in obj');
		ok(!check.isNumber('hello'), 'string');
		ok(!check.isNumber(null), 'null');
		ok(!check.isNumber(UNDEF), 'undefined');
		ok(!check.isNumber(function(){}), 'function');
		ok(!check.isNumber(true), 'true');
		ok(!check.isNumber(false), 'false');
	});

  test('filterPick', 2, function () {

	var res = check.filterPick([{hello: 'world', test: '123'}], ['hello'], function (doc) {
		deepEqual(this.test, 'testing', 'check context is passed');
		return doc.hello === 'world';
	}, {test: 'testing'});

	deepEqual(res, [{hello: 'world'}], 'check expected result');
  });

  test('isArrayOfDocuments', 8, function () {

	ok(check.isArrayOfDocuments([{_id: '1', json: {}}]), 'normal doc');
	ok(check.isArrayOfDocuments([{_id: 1, json: {'hello' : 'world'}}]), 'normal doc json populated');
	ok(check.isArrayOfDocuments([{test: '123', _id: 1, json: {'hello' : 'world'}}]), 'normal doc json populated with other key');

	ok(! check.isArrayOfDocuments([]), 'empty arr');
	ok(! check.isArrayOfDocuments(true), 'true bool');
	ok(! check.isArrayOfDocuments(false), 'false bool');
	ok(! check.isArrayOfDocuments({}), 'empty obj');
	ok(! check.isArrayOfDocuments([{}]), 'array with empty obj');
  });

  test('isArray', 8, function () {
	ok(check.isArray([]), 'empty arr');
	ok(check.isArray([1,2,3]), 'pop arr with nums');
	ok(check.isArray([true]), 'pop arr with bool');

	ok(!check.isArray({}), 'empty obj');
	ok(!check.isArray(true), 'true bool');
	ok(!check.isArray(false), 'false bool');
	ok(!check.isArray('hello'), 'string');
	ok(!check.isArray(123), 'num');
  });

	test('isValidSortObject', 10, function () {
		deepEqual(check.isValidSortObject({}, {}, {}), false, 'Pass empty parameters.');
		deepEqual(check.isValidSortObject({prop1 : 'ASC', prop2 : 'DESC'}, {prop1 : 'string', prop2: 'string'}, {}), false, 'Pass object with more than one property.');
		deepEqual(check.isValidSortObject({prop1 : true}, {prop1 : 'integer'}, {}), false, 'Pass object with something other than a string.');
		deepEqual(check.isValidSortObject({prop1 : 'invalid'}, {prop1 : 'boolean'}, {}), false, 'Pass object with invalid string.');
		deepEqual(check.isValidSortObject({prop1 : 'DeSc'}, {prop1: 'string'}, {}), true, 'Test that it is case insensitive.');
		deepEqual(check.isValidSortObject({prop1 : ''}, {prop1 : 'string'}, {}), false, 'Pass empty string.');
		deepEqual(check.isValidSortObject({prop1 : 'ASC'}, {prop1 : 'string'}, {}), true,  'Pass correct object.');
		deepEqual(check.isValidSortObject({prop1 : 'DESC'}, {}, {}), false, 'Pass object not in search fields.');
		deepEqual(check.isValidSortObject({testField : 'DESC'}, {testfield : 'string'}, {}), true,  'Pass object in search fields.');
		deepEqual(check.isValidSortObject({testField : 'ASC'}, {}, {testfield : 'string'}), true,  'Pass object in additional search fields.');
	});

  test('isArrayOfSAFields', 5, function () {
	ok(check.isArrayOfSAFields(['hello'], {hello: 'string'}), 'normal case');
	ok(check.isArrayOfSAFields(['hey.heyo'], {'hey.heyo': 'number'}), 'normal case');

	ok(! check.isArrayOfSAFields(['hello'], {hell: 'string'}), 'normal fail case 1');
	ok(! check.isArrayOfSAFields([123], {hello: 'string'}), 'normal fail case 2');
	ok(! check.isArrayOfSAFields({}, {hello: 'string'}), 'normal fail case 3');
  });

  test('isArrayOfCleanDocuments', 4, function () {
	ok(check.isArrayOfCleanDocuments([{_id: 1, json: {name: 'nana', age: 1}, _deleted: false, _dirty: new Date(), _operation: 'add'}]), 'normal case');

	ok(!check.isArrayOfCleanDocuments({_id: 1, json: {name: 'nana', age: 1}, _deleted: false, _dirty: new Date(), _operation: 'add'}), 'normal fail case 1');
	ok(!check.isArrayOfCleanDocuments({name: 'nana', age: '12'}), 'normal fail case 2');
	ok(!check.isArrayOfCleanDocuments({}), 'normal fail case 3');
  });

  test('hasJSONSearchField', 5, function () {
	ok(check.hasJSONSearchFields(['_id', '_deleted', 'json', '_dirty', '_operation']), 'normal case');
	ok(check.hasJSONSearchFields(['_id']), 'normal case');

	ok(!check.hasJSONSearchFields({}), 'normal fail case 1');
	ok(!check.hasJSONSearchFields([]), 'normal fail case 2');
	ok(!check.hasJSONSearchFields('_id'), 'normal fail case 3');
  });

  test('isEmptyArray', 4, function () {
	ok(check.isEmptyArray([]), 'normal case');

	ok(!check.isEmptyArray('emptyArray', 'normal fail case'));
	ok(!check.isEmptyArray(['emptyArray'], 'normal fail case'));
	ok(!check.isEmptyArray({}, 'normal fail case'));
  });

})();
