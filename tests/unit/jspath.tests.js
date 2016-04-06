/*global test, module, deepEqual*/
(function() {

	'use strict';

	var jspath = JSONStoreUtil.jspath

	var data = {
		fn: 'carlos',
		address:
		{city: 'Austin',
		zip: '78758',
		arr: [1,2,'test',true],
		obj :
		{ test: 'hello', fn: 'world', arr: [40,30,50,
		{fn: 'hello world'}]}},
		bool: true,
		arr: [1,2,3]
	};

	var UNDEF;

	// __get = function (data, element, parent)
	module('JS Path');
	test('get', 20, function() {

		deepEqual(jspath.get(data, 'fn', 'root'), [data.fn], 'testing parent root');
		deepEqual(jspath.get(data, 'fn', ''), [data.fn, data.address.obj.fn, data.address.obj.arr[3].fn], 'testing w/o root');
		deepEqual(jspath.get(data, 'fn', 'address'), [data.address.obj.fn, data.address.obj.arr[3].fn], 'fn under address');
		deepEqual(jspath.get(data, 'fn', 'address.obj'), [data.address.obj.fn, data.address.obj.arr[3].fn], 'fn under address.obj');
		deepEqual(jspath.get(data, 'fn', 'address.obj.arr'), [data.address.obj.arr[3].fn], 'fn under address.obj.arr');
		deepEqual(jspath.get(data, 'address'), [data.address], 'get address obj, root implied, default value: root for path');
		deepEqual(jspath.get(data, 'address', 'root'), [data.address], 'get address obj');
		deepEqual(jspath.get(data, 'address', ''), [data.address], 'get all address obj');
		deepEqual(jspath.get(data, 'arr', ''), [data.address.arr, data.address.obj.arr, data.arr], 'get all arrays');
		deepEqual(jspath.get(data, 'bool', 'root'), [data.bool], 'get bool');
		deepEqual(jspath.get(data, 'bool', ''), [data.bool], 'get all bools');
		deepEqual(jspath.get(data, 'test', ''), [data.address.obj.test], 'get all test');
		deepEqual(jspath.get(data, '234234234', ''), [], 'test non existant key');
		deepEqual(jspath.get([{fn: 'carlos'}], 'fn', ''), ['carlos'], 'searching in an array instead of a hash map');
		deepEqual(jspath.get(null), [], 'sending null');
		deepEqual(jspath.get(UNDEF), [], 'sending undefined ');
		deepEqual(jspath.get(123), [], 'sending a number ');
		deepEqual(jspath.get(data, 1), [], 'sending a number via element');
		deepEqual(jspath.get(data, 1, 2), [], 'sending a number via element and path');
		deepEqual(jspath.get(data, 'fn', 123), [], 'sending a number via element and path');
	});

})();