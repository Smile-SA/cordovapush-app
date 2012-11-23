package com.plugin.C2DM;

// --------------------------------------------------------
// My knowledge came from
// Android Cloud to Device Messaging (C2DM) - Tutorial
// http://www.vogella.de/articles/AndroidCloudToDeviceMessaging/article.html
//--------------------------------------------------------

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.content.Context;
import android.util.Log;

import com.google.android.c2dm.C2DMessaging;
import org.apache.cordova.api.Plugin;
import org.apache.cordova.api.PluginResult;
import org.apache.cordova.api.PluginResult.Status;

/**
 * @author awysocki
 * 
 */

public class C2DMPlugin extends Plugin {

	public static final String ME = "C2DMPlugin";

	public static final String REGISTER = "register";
	public static final String UNREGISTER = "unregister";

	public static Plugin gwebView;
	private static String gECB;
	private static String gEMail;

	@Override
	public PluginResult execute(String action, JSONArray data, String callbackId) {
		PluginResult result = null;
		Log.v(ME + ":execute", "action=" + action);

		if (REGISTER.equals(action)) {
			Log.v(ME + ":execute", "data=" + data.toString());
			try {
				JSONObject jo = new JSONObject(data.toString().substring(1, data.toString().length() - 1));
				gwebView = this;
				Log.v(ME + ":execute", "jo=" + jo.toString());
				gECB = (String) jo.get("ecb");
				gEMail = (String) jo.get("email");
				Log.v(ME + ":execute", "ECB=" + gECB + " EMail=" + gEMail);
				C2DMessaging.register((Context) this.cordova, gEMail);
				Log.v(ME + ":execute", "C2DMessaging.register called ");
				result = new PluginResult(Status.OK);
			} catch (JSONException e) {
				Log.e(ME, "Got JSON Exception " + e.getMessage());
				result = new PluginResult(Status.JSON_EXCEPTION);
			}
		} else if (UNREGISTER.equals(action)) {
			C2DMessaging.unregister((Context) this.cordova);
			Log.v(ME + ":" + UNREGISTER, "C2DMessaging.unregister called ");
		} else {
			result = new PluginResult(Status.INVALID_ACTION);
			Log.e(ME, "Invalid action : " + action);
		}
		return result;
	}

	/**
	 * Sends the json to the Javascript application
	 * 
	 * @param _json
	 *            : the JSONObject to be sent to the app
	 */
	public static void sendJavascript(JSONObject _json) {
		// send JS only if the app is launched
		if (gECB != null && gwebView != null) {
			String _d = "javascript:" + gECB + "(" + _json.toString() + ")";
			Log.v(ME + ":sendJavascript", _d);
			gwebView.sendJavascript(_d);
		}
	}
}
