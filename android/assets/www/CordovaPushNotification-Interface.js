/**
 * Main JS
 */
var cordovapushapp = {};

cordovapushapp.c2dmSenderId = '';
cordovapushapp.c2dmregid = '';
cordovapushapp.c2dmPushServerSubscribeURL = '';
cordovapushapp.c2dmPushServerUnsubscribeURL = '';
cordovapushapp.onregistration = null;
cordovapushapp.onmessage = null;
cordovapushapp.onerror = null;
cordovapushapp.deviceType='';

window.onbeforeunload = function(e) {
	if (cordovapushapp.c2dmregid.length > 0) {
		// The same routines are called for success/fail on the unregister. You
		// can make them unique if you like
		window.plugins.C2DM.unregister(C2DM_Success, C2DM_Fail);
	}
};

/**
 * set up app to C2DM
 * 
 * @param onregistration :
 *            callback function to execute on registration
 * @param onmessage :
 *            callback function to execute onmessage
 * @param onerror :
 *            callback function to execute on error
 * 
 */
cordovapushapp.init = function(onregistration, onmessage, onerror, deviceType) {
	// TODO maybe store these in localstorage to avoid recall to google
    cordovapushapp.deviceType = deviceType;
	cordovapushapp.c2dmSenderId = pushConfig.c2dmSenderId;
	cordovapushapp.c2dmPushServerSubscribeURL = pushConfig.subscribePushServerURL;
	cordovapushapp.c2dmPushServerUnsubscribeURL = pushConfig.unsubscribePushServerURL;
	cordovapushapp.onregistration = onregistration;
	cordovapushapp.onmessage = onmessage;
	cordovapushapp.onerror = onerror;
};
/**
 * subscribe
 */
cordovapushapp.subscribe = function() {
    if(cordovapushapp.deviceType === "android"){
        window.plugins.C2DM.register(cordovapushapp.c2dmSenderId, "C2DM_Event", C2DM_Success, C2DM_Fail);
    }else if(cordovapushapp.deviceType === "ios"){
        window.plugins.pushNotification.registerDevice({
            alert : true,
            badge : true,
            sound : true
        }, function(status) {
            console.warn('registerDevice: ' + status.deviceToken);
                //navigator.notification.alert(JSON.stringify([ 'registerDevice', status ]));
            callSubscriptionServiceOnPushServer(status.deviceToken, pushConfig.subscribePushServerURL);
           /* window.plugins.pushNotification.setApplicationIconBadgeNumber(12, function(status) {
                console.warn('setApplicationIconBadgeNumber:'+ JSON.stringify(status));
                    navigator.notification.alert(JSON.stringify(['setBadge', status]));
            });*/
            
            document.addEventListener('push-notification', function(event) {
				console.warn('push-notification!:'+ JSON.stringify(event));	
				//navigator.notification.alert(JSON.stringify([ 'push-notification!', event ]));
			});
            
            window.plugins.pushNotification.getPendingNotifications(function(notifications) {
                console.warn('getPendingNotifications:'+ JSON.stringify(notifications));
                    //navigator.notification.alert(JSON.stringify(['getPendingNotifications', notifications]));
            });
            
            window.plugins.pushNotification.getRemoteNotificationStatus(function(status) {
                console.warn('getRemoteNotificationStatus:'+ JSON.stringify(status));
                    //navigator.notification.alert(JSON.stringify(['getRemoteNotificationStatus', status]));
            });

            
        });
    }else{
        console.log("device type not supported");
    }
};

/**
 * unsubscribe
 */
cordovapushapp.unsubscribe = function() {
	callSubscriptionServiceOnPushServer(cordovapushapp.c2dmregid, cordovapushapp.c2dmPushServerUnsubscribeURL);
};

/**
 * handle events
 * 
 * @param e :
 *            the event to handle
 */
function C2DM_Event(e) {
	switch (e.event) {
	case 'registered':
		cordovapushapp.c2dmregid = e.regid;
		if (cordovapushapp.c2dmregid.length > 0) {
			cordovapushapp.onregistration(e);
			callSubscriptionServiceOnPushServer(e.regid, cordovapushapp.c2dmPushServerSubscribeURL);
		}
		break;
	case 'message':
		cordovapushapp.onmessage(e);
		break;
	case 'error':
		cordovapushapp.onerror(e);
		break;
	default:
		console.log('EVENT -> Unknown, an event was received and we do not know what it is');
		break;
	}
}

function C2DM_Success(e) {
	console
			.log('C2DM_Success -> We have successfully registered and called the C2DM plugin, waiting for C2DM_Event:registered -> REGID back from Google');
}

function C2DM_Fail(e) {
	console.log('C2DM_Fail -> C2DM plugin failed to register');
}

/**
 * call subscription service on push server
 * 
 * @param deviceToken
 * @param pushServerSubscribeURL :
 *            push server URL to subscribe
 */
function callSubscriptionServiceOnPushServer(deviceToken, url) {
	$.support.cors = true;
	$.ajax({
		url : url,
		type : 'POST',
		data : {
			token : deviceToken,
			type : cordovaloader.device
		},
		dataType : 'json',
		crossDomain : true,
		beforeSend : function(xhr) {
			xhr.setRequestHeader('Cache-Control', 'no-cache');
		},
		success : function(_data, textStatus, _jqXHR) {
			console.log("successful post");
		},
		error : function(_jqXHR, textStatus,error) {
			console.log("failed post"+textStatus+" "+error+" "+_jqXHR.responseText);
		}
	});
}
