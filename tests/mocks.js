/*global sinon*/

//Mock jQuery
var WLJQ = jQuery;

//Mock the WL Namespace
var WL = WL || {};

//Mock Client
WL.Client = WL.Client || {};

WL.Client.__state = WL.Client.__state || function () {
	'use strict';
	return {
		enableFIPS: false
	};
};

WL.Client.getEnvironment = WL.Client.getEnvironment || function () {
	'use strict';
	return 'preview';
};

WL.Client.isConnected = WL.Client.isConnected || function () {
	'use strict';
	return false;
};


//Mock initOptions
var initOptions = initOptions || {};

//Mock headers
/*WL.Client.__globalHeaders = WL.Client.__globalHeaders || {
	'WL-Instance-Id' : '12345678910',
	'x-wl-app-version' : '1.0'
}; */
WL.Client.__getGlobalHeaders = WL.Client.__getGlobalHeaders || function () {
	'use strict';
	return WL.Client.__globalHeaders;
};

//Mock Environment
WL.Environment = WL.Environment || {};
WL.Environment.ANDROID = WL.Environment.ANDROID || 'android';
WL.Environment.IPHONE = WL.Environment.IPHONE || 'iphone';
WL.Environment.IPAD = WL.Environment.IPAD || 'ipad';

//Mock AppProp
WL.AppProp = WL.AppProp || {};
WL.AppProp.APP_VERSION = WL.AppProp.APP_VERSION || 'APP_VERSION';
WL.AppProp.ENVIRONMENT = WL.AppProp.ENVIRONMENT || 'ENVIRONMENT';
WL.AppProp.APP_DISPLAY_NAME = WL.AppProp.APP_DISPLAY_NAME || 'APP_DISPLAY_NAME';
WL.AppProp.WORKLIGHT_ROOT_URL = WL.AppProp.WORKLIGHT_ROOT_URL || 'WORKLIGHT_ROOT_URL';

//Mock AppProperty
WL.AppProperty = WL.AppProperty || {
	APP_VERSION : '1.0',
	ENVIRONMENT : 'preview',
	APP_DISPLAY_NAME: 'analytics',
	WORKLIGHT_ROOT_URL : '/apps/services/'
};


WL.StaticAppProps = WL.StaticAppProps || {};
WL.StaticAppProps.WORKLIGHT_ROOT_URL = WL.AppProperty.WORKLIGHT_ROOT_URL;

/*
//Mock get AppProperty
WL.Client.getAppProperty = WL.Client.getAppProperty || function (property) {
	return WL.AppProperty[property];
};
*/
//Mock jQuery's AJAX calls
sinon.stub(WLJQ, 'ajax').returns(function() {
	'use strict';
	var deferred = WLJQ.Deferred();
	setTimeout(deferred.resolve, 0);
	return deferred.promise();
})();

//Mock WL.Device.getContext()
WL.Device = WL.Device || {};
WL.Device.getContext = WL.Device.getContext || function(){
	'use strict';
	return null;
};

WL.Client.invokeProcedure = WL.Client.invokeProcedure || function(){

};

WL.EncryptedCache = WL.EncryptedCache || {};
WL.EncryptedCache.random = WL.EncryptedCache.random || function(){
	'use strict';
	return 4;
};
WL.EncryptedCache.secureRandom = WL.EncryptedCache.secureRandom || function(){
	'use strict';
	return 4;
};

//Mock WLJSX.bind
var WLJSX = WLJSX || {};
WLJSX.bind = WLJSX.bind || function(){
	//Do nothing here
};