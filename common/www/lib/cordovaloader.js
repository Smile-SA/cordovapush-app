// Created by Smile. 
// http://www.smile.fr
// https://github.com/smile-mobile
// MIT Licensed
/**
 * Cordova loader<br>
 * A simple loader for the different Cordova files depending on the platform. It
 * provides cordovaloader.debug to true if platform is not recognized.
 * TODO support for Windows Phone & BlackBerry 
 */
cordovaloader = (function() {
	var $ = {};

	$.debug = false;
    $.device = '';

	/**
	 * Loads the right Cordova file
	 * 
	 * @param dir :
	 *            the path to the directory where your Cordova libs are located.
	 *            e.g : lib
	 * @param filename :
	 *            the prefix name of your cordova files. e.g : cordova-1.8.1
	 * 
	 */
	$.load = function(dir, filename) {
		var useragent = navigator.userAgent;
		if (useragent.indexOf('iPhone') != -1 || useragent.indexOf('iPad') != -1) {
			document.write('<script type="text/javascript" charset="utf-8" src="' + dir + '/' + filename
					+ '-ios.js"><\/script>');
            $.device = 'ios';
		} else if (useragent.indexOf('Android') != -1) {
			document.write('<script type="text/javascript" charset="utf-8" src="' + dir + '/' + filename
					+ '-android.js"><\/script>');
            $.device = 'android';
		} else {
			$.debug = true;
            $.device = 'web';
		}
	};

	return $;
})();
