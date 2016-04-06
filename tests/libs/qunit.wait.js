function wlCommonInit(){
    console.log('init success');
    QUnit.start(); //Tests loaded, run tests
}

if(! _.isUndefined(WL.browser)){
	db = browser;
 	wlCommonInit();
}

