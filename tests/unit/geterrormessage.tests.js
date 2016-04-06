/*global test, module, deepEqual*/
(function() {

	'use strict';

	var model = JSONStore,
	ERROR = [],
	UNDEF,
	NEGATIVE_STATUS_CODE_TESTS = 6,
	NOT_FOUND_STRING = 'Not found';

	//Taken from JSONStore
	ERROR[-100] = 'UNKNOWN_FAILURE';
	ERROR[-50] = 'PERSISTENT_STORE_NOT_OPEN';
	ERROR[-40] = 'FIPS_ENABLEMENT_FAILURE';
	ERROR[-41] = 'TRANSACTION_IN_PROGRESS';
	ERROR[-42] = 'NO_TRANSACTION_IN_PROGRESS';
	ERROR[-43] = 'TRANSACTION_FAILURE';
	ERROR[-44] = 'TRANSACTION_FAILURE_DURING_INIT';
	ERROR[-45] = 'TRANSACTION_FAILURE_DURING_CLOSE_ALL';
	ERROR[-46] = 'TRANSACTION_FAILURE_DURING_DESTROY';
	ERROR[-47] = 'TRANSACTION_FAILURE_DURING_REMOVE_COLLECTION';
	ERROR[-48] = 'TRANSACTION_FAILURE_DURING_ROLLBACK';
	ERROR[-20] = 'JSON_STORE_INVALID_JSON_STRUCTURE';
	ERROR[-21] = 'JSON_STORE_STORE_DATA_PROTECTION_KEY_FAILURE';
	ERROR[-22] = 'JSON_STORE_REMOVE_WITH_QUERIES_FAILURE';
	ERROR[-23] = 'JSON_STORE_REPLACE_DOCUMENTS_FAILURE';
	ERROR[-24] = 'JSON_STORE_FILE_INFO_ERROR';
	ERROR[-12] = 'INVALID_SEARCH_FIELD_TYPES';
	ERROR[-11] = 'OPERATION_FAILED_ON_SPECIFIC_DOCUMENT';
	ERROR[-10] = 'ACCEPT_CONDITION_FAILED';
	ERROR[-9] = 'OFFSET_WITHOUT_LIMIT';
	ERROR[-8] = 'INVALID_LIMIT_OR_OFFSET';
	ERROR[-7] = 'INVALID_USERNAME';
	ERROR[-6] = 'USERNAME_MISMATCH_DETECTED';
	ERROR[-5] = 'DESTROY_REMOVE_PERSISTENT_STORE_FAILED';
	ERROR[-4] = 'DESTROY_REMOVE_KEYS_FAILED';
	ERROR[-3] = 'INVALID_KEY_ON_PROVISION';
	ERROR[-2] = 'PROVISION_TABLE_SEARCH_FIELDS_MISMATCH';
	ERROR[-1] = 'PERSISTENT_STORE_FAILURE';
	ERROR[0] = 'SUCCESS';
	ERROR[1] = 'BAD_PARAMETER_EXPECTED_INT';
	ERROR[2] = 'BAD_PARAMETER_EXPECTED_STRING';
	ERROR[3] = 'BAD_PARAMETER_EXPECTED_FUNCTION';
	ERROR[4] = 'BAD_PARAMETER_EXPECTED_ALPHANUMERIC_STRING';
	ERROR[5] = 'BAD_PARAMETER_EXPECTED_OBJECT';
	ERROR[6] = 'BAD_PARAMETER_EXPECTED_SIMPLE_OBJECT';
	ERROR[7] = 'BAD_PARAMETER_EXPECTED_DOCUMENT';
	ERROR[8] = 'FAILED_TO_GET_UNPUSHED_DOCUMENTS_FROM_DB';
	ERROR[9] = 'NO_ADAPTER_LINKED_TO_COLLECTION';
	ERROR[10] = 'BAD_PARAMETER_EXPECTED_DOCUMENT_OR_ARRAY_OF_DOCUMENTS';
	ERROR[11] = 'INVALID_PASSWORD_EXPECTED_ALPHANUMERIC_STRING_WITH_LENGTH_GREATER_THAN_ZERO';
	ERROR[12] = 'ADAPTER_FAILURE';
	ERROR[13] = 'BAD_PARAMETER_EXPECTED_DOCUMENT_OR_ID';
	ERROR[14] = 'CAN_NOT_REPLACE_DEFAULT_FUNCTIONS';
	ERROR[15] = 'COULD_NOT_MARK_DOCUMENT_PUSHED';
	ERROR[16] = 'COULD_NOT_GET_SECURE_KEY';
	ERROR[17] = 'FAILED_TO_LOAD_INITIAL_DATA_FROM_ADAPTER';
	ERROR[18] = 'FAILED_TO_LOAD_INITIAL_DATA_FROM_ADAPTER_INVALID_LOAD_OBJ';
	ERROR[19] = 'INVALID_KEY_IN_LOAD_OBJECT';
	ERROR[20] = 'UNDEFINED_PUSH_OPERATION';
	ERROR[21] = 'INVALID_ADD_INDEX_KEY';
	ERROR[22] = 'INVALID_SEARCH_FIELD';
	ERROR[23] = 'ERROR_CLOSING_ALL';
	ERROR[24] = 'ERROR_CHANGING_PASSWORD';
	ERROR[25] = 'ERROR_DURING_DESTROY';
	ERROR[26] = 'ERROR_CLEARING_COLLECTION';
	ERROR[27] = 'INVALID_PARAMETER_FOR_FIND_BY_ID';
  ERROR[28] = 'INVALID_SORT_OBJECT';
  ERROR[29] = 'INVALID_FILTER_ARRAY';
  ERROR[30] = 'BAD_PARAMETER_EXPECTED_ARRAY_OF_OBJECTS';
  ERROR[31] = 'BAD_PARAMETER_EXPECTED_ARRAY_OF_CLEAN_DOCUMENTS';
  ERROR[32] = 'BAD_PARAMETER_WRONG_SEARCH_CRITERIA';

	module('Error Message');

	test('valid error message returned', 40, function () {

		var testCount = 1; //to account for -50
		deepEqual(model.getErrorMessage(-50), ERROR[-50], 'should return the right error message for -50');

		for(var i = -5; i < ERROR.length; i++) {
			deepEqual(model.getErrorMessage(i), ERROR[i], 'should return the right error message for: ' + i);
			testCount++;
		}

		deepEqual(testCount, ERROR.length+NEGATIVE_STATUS_CODE_TESTS, 'should have the correct number of messages');

	});

	test('invalid error message', 10, function () {

		deepEqual(model.getErrorMessage('a'), NOT_FOUND_STRING, 'string');
		deepEqual(model.getErrorMessage('1231'), NOT_FOUND_STRING, 'string with numbers');
		deepEqual(model.getErrorMessage(1.2), NOT_FOUND_STRING, 'float');
		deepEqual(model.getErrorMessage(32543454332423234534), NOT_FOUND_STRING, 'long int');
		deepEqual(model.getErrorMessage({}), NOT_FOUND_STRING, 'empty obj');
		deepEqual(model.getErrorMessage({hey: 'hello'}), NOT_FOUND_STRING, 'obj with a key and data');
		deepEqual(model.getErrorMessage([]), NOT_FOUND_STRING, 'empty array');
		deepEqual(model.getErrorMessage([1,2,3]), NOT_FOUND_STRING, 'array with numbers');
		deepEqual(model.getErrorMessage(null), NOT_FOUND_STRING, 'null');
		deepEqual(model.getErrorMessage(UNDEF), NOT_FOUND_STRING, 'undefined');

	});


})();