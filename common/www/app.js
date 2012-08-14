// Created by Smile. 
// http://www.smile.fr
// https://github.com/smile-mobile
// MIT Licensed
/**
 * app specific JS
 */
var app = (function(app) {

	/**
	 * callback function to execute on registration
	 */
	var onregistration = function(event) {
		var li = '<li>REGISTERED -> REGID:' + event.regid + '</li>';
		jQuery("#app-status-ul").append(li);
	};

	/**
	 * callback function to execute on message
	 */
	var onmessage = function(event) {
		var data = JSON.parse(event.data);
		var li = '<li>MESSAGE -> MSG:' + data.message + '</li>';
		jQuery("#app-status-ul").append(li);
	};

	/**
	 * callback function to execute on error
	 */
	var onerror = function(event) {
		var li = '<li>ERROR -> MSG:' + event.msg + '</li>';
		jQuery("#app-status-ul").append(li);
	};

	/**
	 * App init
	 */
	app.start = function() {
		cordovapushapp.init(onregistration, onmessage, onerror, cordovaloader.device);
		cordovapushapp.subscribe();
		jQuery("#unsubscribe").bind('click', function() {
			cordovapushapp.unsubscribe();
		});
	};

	return app;
})(app || {});
