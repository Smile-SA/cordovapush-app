package fr.smile.mobile.cordovapush;

/**
 * @author awysocki
 *
 */
//--------------------------------------------------------
//My knowledge came from
//Android Cloud to Device Messaging (C2DM) - Tutorial
//http://www.vogella.de/articles/AndroidCloudToDeviceMessaging/article.html
//--------------------------------------------------------

import org.json.JSONException;
import org.json.JSONObject;
import org.json.JSONTokener;

import android.app.Notification;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;

import com.google.android.c2dm.C2DMBaseReceiver;
import com.plugin.C2DM.C2DMPlugin;

public class C2DMReceiver extends C2DMBaseReceiver {

	public static final String ME = "C2DMReceiver";

	public C2DMReceiver() {
		super("man"); // This is currently not used, a constructor is required
		Log.v(ME, "Constructor");
	}

	@Override
	public void onRegistered(Context context, String registrationId) throws java.io.IOException {

		Log.v(ME + ":onRegistered", "Registration ID arrived!");
		Log.v(ME + ":onRegistered", registrationId);

		JSONObject json;

		try {
			json = new JSONObject().put("event", "registered");
			json.put("regid", registrationId);

			Log.v(ME + ":onRegisterd", json.toString());

			// Send this JSON data to the JavaScript application above EVENT
			// should be set to the msg type
			// In this case this is the registration ID
			C2DMPlugin.sendJavascript(json);

		} catch (JSONException e) {
			// No message to the user is sent, JSON failed
			Log.e(ME + ":onRegisterd", "JSON exception");
		}
	};

	/**
	 * Messages received should look like :<br>
	 * "data : {"title":"title", "message":"message"}"
	 */
	@Override
	protected void onMessage(Context context, Intent intent) {
		Log.v(ME + ":onMessage", "Message: Fantastic!!!");
		// Extract the payload from the message
		Bundle extras = intent.getExtras();
		if (extras != null) {
			try {
				Log.v(ME + ":onMessage extras ", extras.getString("data"));
				
				// 1 - create notification on status bar
				JSONObject data = (JSONObject) new JSONTokener(extras.getString("data")).nextValue();
				String title = data.getString("title");
				String message = data.getString("message");
				createNotification(context, title, message);

				// 2 - delegate push message to the app
				JSONObject json;
				json = new JSONObject().put("event", "message");
				json.put("data", data.toString());
				Log.v(ME + ":onMessage ", json.toString());
				C2DMPlugin.sendJavascript(json);
			} catch (JSONException e) {
				Log.e(ME + ":onMessage", "JSON exception");
			}
		}
	}

	/**
	 * create notification on status bar
	 * 
	 * @param context
	 * @param payload
	 */
	protected void createNotification(Context context, String title, String message) {
		NotificationManager notificationManager = (NotificationManager) context
				.getSystemService(Context.NOTIFICATION_SERVICE);
		Notification notification = new Notification(R.drawable.ic_launcher, message, System.currentTimeMillis());
		// Hide the notification after its selected
		notification.flags |= Notification.FLAG_AUTO_CANCEL;

		// adding LED lights to notification
		notification.defaults |= Notification.DEFAULT_LIGHTS;

		Intent intent = new Intent(this, cordovapushActivity.class);
		// set flags to resume the app if possible and not starting a new one
		intent.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_SINGLE_TOP);

		PendingIntent pendingIntent = PendingIntent.getActivity(context, 0, intent, 0);
		notification.setLatestEventInfo(context, title, message, pendingIntent);
		notificationManager.notify(0, notification);
	}

	@Override
	public void onError(Context context, String errorId) {
		try {
			JSONObject json;
			json = new JSONObject().put("event", "error");
			json.put("msg", errorId);

			Log.e(ME + ":onError ", json.toString());

			C2DMPlugin.sendJavascript(json);
		} catch (JSONException e) {
			Log.e(ME + ":onMessage", "JSON exception");
		}
	}
}