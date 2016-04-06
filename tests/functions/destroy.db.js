(function() {

	'use strict';

	//Dependencies:
	var model = JSONStore;

	function fail(err){
		ok(false, 'Failed with: ' + err + ' ' + model.getErrorMessage(err));
		start();
	}

	module('Destroy');

	test('Destroy DB', 1, function(){

		stop();

		var destroyWin = function (data) {
			deepEqual(data, 0, 'db cleared');
			JSONStore.clearPassword();
			start();
		};

		JSONStore.destroy({onSuccess: destroyWin, onFailure: fail});
	});

})();
