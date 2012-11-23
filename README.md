# Cordova Push Samples

Here goes sample client apps, interacting with cordovapush server.

## Installation
You should install [cordova-client](https://github.com/filmaj/cordova-client)

## Quick Start
Use [cordova-client](https://github.com/filmaj/cordova-client) command lines to build and emulate the project.

### Config
edit the pushConfig.js file (under www/js directory) :

```javascript
pushConfig.c2dmSenderId = "YOUR_PROJECT_ID";// a Google API project id. Get it from https://code.google.com/apis/console
pushConfig.subscribePushServerURL = "YOUR_PUSH_SERVER_SUBSCRIPTION_URL";// eg : "http://10.1.8.56:8888/subscribe"
pushConfig.unsubscribePushServerURL = "YOUR_PUSH_SERVER_UNSUBSCRIPTION_URL";// eg : "http://10.1.8.56:8888/unsubscribe"
```

## Credits & Dependencies
it uses the following tools / plugins :

- [cordova-client](https://github.com/filmaj/cordova-client)
- [C2DM-PhoneGap Plugin](https://github.com/awysocki/C2DM-PhoneGap)
- [cordova-push-notification Plugin](https://github.com/mgcrea/cordova-push-notification)

## History

- 0.2.0 : [cordova-client](https://github.com/filmaj/cordova-client) automate build
- 0.1.0 : init
