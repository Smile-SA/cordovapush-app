/**
 * 
 * @return Instance of C2DM
 */
var C2DM = function() {
};

/**
 * register device to C2DM
 */
C2DM.prototype.register = function(senderEmail, eventCallback, successCallback, failureCallback) {
	// The eventCallback has to be a
	// STRING name not the actual
	// routine like success/fail
	// routines
	if (typeof eventCallback != "string") {
		var e = new Array();
		e.msg = 'eventCallback must be a STRING name of the routine';
		e.rc = -1;
		failureCallback(e);
		return;
	}
	return cordova.exec(successCallback, // Callback which will be called
	// when directory listing is
	// successful
	failureCallback, // Callback which will be called when directory listing
	// encounters an error
	'C2DMPlugin', // Telling cordova that we want to run "DirectoryListing"
	// Plugin
	'register', // Telling the plugin, which action we want to perform
	[ {
		email : senderEmail,
		ecb : eventCallback
	} ]); // Passing a list of arguments to the plugin,
	// The ecb variable is the STRING name of your javascript routine to be used
	// for callbacks
	// You can add more to validate that eventCallback is a string and not an
	// object
};

C2DM.prototype.unregister = function(successCallback, failureCallback) {
	return cordova.exec(successCallback, // Callback which will be called
	// when directory listing is
	// successful
	failureCallback, // Callback which will be called when directory listing
	// encounters an error
	'C2DMPlugin', // Telling cordova that we want to run "DirectoryListing"
	// Plugin
	'unregister', // Telling the plugin, which action we want to perform
	[ {} ]); // Passing a list of arguments to the plugin,
};

// Register the javascript plugin with cordova
// Here we have to ignore deprecation notices : new plugin architecture is
// coming with 2.0 but is not defined yet
cordova.addConstructor(function() {
	cordova.addPlugin('C2DM', new C2DM());
});