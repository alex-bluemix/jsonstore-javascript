/**
 * @license
 * Licensed Materials - Property of IBM
 * 5725-I43 (C) Copyright IBM Corp. 2006, 2013. All Rights Reserved.
 * US Government Users Restricted Rights - Use, duplication or
 * disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */

var  JSONStore = JSONStore || {};

JSONStore = (function(JSONStore_) {

  /*jshint strict:false*/

  var publicAPI = [
    'init',
    'get',
    'initCollection',
    'usePassword',
    'clearPassword',
    'closeAll',
    'documentify',
    'changePassword',
    'destroy',
    'getErrorMessage',
    'startTransaction',
    'commitTransaction',
    'rollbackTransaction',
    'fileInfo',
    'QueryPart'
  ];

  var stub = {};

  _.each(publicAPI, function(apiName) {
    var implName = apiName;
    stub[apiName] =
      (function(apiName, implName) {
      return function() {
          return _JSONStoreImpl[implName].apply(_JSONStoreImpl, arguments);
      };
    })(apiName, implName);
  });

  return stub;
}(JSONStore_));
