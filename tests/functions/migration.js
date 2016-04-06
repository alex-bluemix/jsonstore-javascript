/*global module, WL, deepEqual, ok, start, stop, QUnit, asyncTest, LocalFileSystem*/
(function() {

  'use strict';

  QUnit.testStart(function( details ) {
    // console.log( 'Now running: ', details.module, details.name );
    if (details.module.indexOf('Migration') === 0) {
      stop();
      JSONStore.destroy().always(function () {
        // console.log('Destroy done!');
        start();
      });
    }
  });


  function isIphone(){
      return /iPhone|iPad|iPod/i.test(navigator.userAgent)
  }

  function isAndroid(){
    return /Android/i.test(navigator.userAgent)
  }

  function isWindows(){
    return /IEMobile/i.test(navigator.userAgent)
  }

  module('Migration');

  //1) This test needs to be run on a clean simulator so we don't have defaults data lying around
  //implying that he migration was already done.
  asyncTest('Test file migration path', 3, function () {
    if(typeof JSONStoreUtil.browser === 'object'){
      //keep # assertions the same
      ok(true, 'no migration in browser');
      ok(true, 'no migration in browser');
      ok(true, 'no migration in browser');
      start();
    } else {
      
      JSONStore.destroy().then(function () {
        
        var failzors = function(err){
          ok(false, 'Error processing file system: ' + JSON.stringify(err));
          start();
        };
        if(isAndroid()){
          window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(){
            window.resolveLocalFileSystemURI('file:///data/data/com.'+StaticAppProps.APP_DISPLAY_NAME, function(dirEnt){

              dirEnt.getDirectory('databases', {create: true}, function(dirEntry){
                dirEntry.getFile('com.ibm.worklight.database', {create: true, exclusive: false}, function (fileEntry) {
                  fileEntry.createWriter(function (writer) {
                    writer.seek(0);
                    writer.write('Hey Guys, I am a migration test!\n');
                    ok(true, 'wrote a file');
                    doInit();
                  }, function(err){ ok(false, 'Write to disk error - createWriter: ' + err); });
                }, function(err){ ok(false, 'Write to disk error - getFile: ' + err); });
              });

            
            }, function(err){
              failzors(err);
            });
          }, function(err){
            failzors(err);
          });
        }
        else if(isIphone()){
        //iOS impl

          window.requestFileSystem(LocalFileSystem.PERSISTENT, 0,  function (fileSystem) {
            fileSystem.root.getFile('jsonstore.sqlite', {create: true, exclusive: false}, function (fileEntry) {
              fileEntry.createWriter(function (writer) {
                writer.seek(0);
                writer.write('Hey Guys, I am a migration test!\n');
                ok(true, 'wrote a file');
                doInit();
              }, function(err){ ok(false, 'Write to disk error - createWriter: ' + err); });
            }, function(err){ ok(false, 'Write to disk error - getFile: ' + err); });
          }, function(err){ ok(false, 'Write to disk error - requestFileSystem: ' + err); });
        }else if(isWindows()){
          if(typeof Client === 'object'){
          ok(true, 'no migration in windows8');
          ok(true, 'no migration in windows8');
          ok(true, 'no migration in windows8');
          start();
          }
        }

        function doInit(){
          var c = JSONStore.initCollection('migration1', {fn: 'string'});

          c.promise

          .then(function () {
            ok(false, 'init should not have worked, because the database is bogus');
            start();
          })

          .fail(function (err) {
          //We should get this error, because since it's not a real DB, we think it's ecnrypted with a bad key
            var expectedRC = -3;
            deepEqual(err.err, expectedRC, 'expecting ' + expectedRC + ' ' + err.toString());

            if(isAndroid()){
              window.resolveLocalFileSystemURI('file:///data/data/com.'+StaticAppProps.APP_DISPLAY_NAME+'/databases',  function (dirEnt) {
                dirEnt.getDirectory('wljsonstore', {create: false, exclusive: false}, function(dirEntry){
                  dirEntry.getFile('jsonstore.sqlite', {create: true, exclusive: false}, function () {
                    ok(true, 'File was successfully moved!');
                    start();
                  }, failzors);
                }, failzors);
              }, failzors);
            }else{
              window.requestFileSystem(LocalFileSystem.PERSISTENT, 0,  function (fileSystem) {
                fileSystem.root.getDirectory('wljsonstore', {create: false, exclusive: false}, function(dirEntry){
                  dirEntry.getFile('jsonstore.sqlite', {create: true, exclusive: false}, function () {
                    ok(true, 'File was successfully moved!');
                    start();
                  }, failzors);
                }, failzors);
              }, failzors);
            }
          });
        }
      }).fail(function (err){
        ok(false, 'destroy migration test failed: '+err.toString());
      });//done destroy then block
      


    }


  });//async test end


})();