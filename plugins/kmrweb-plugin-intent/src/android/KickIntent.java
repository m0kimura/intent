package net.kmrweb.plugin;

import org.json.JSONArray;
import org.json.JSONException;

import android.app.Activity;
import android.os.Bundle;
import android.net.Uri;
import android.provider.Settings;
import android.content.Intent;
import android.util.Log;
import android.view.WindowManager;
import android.widget.Toast;

import org.apache.cordova.*;

public class KickIntent extends CordovaPlugin {

  @Override
  public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {

    try{
      String x0; String x1;
      if(args.length()>0){x0 = args.getString(0);}else{x0 = "";}
      if(args.length()>1){x1 = args.getString(1);}else{x1 = "";}
      if(action.equals("setting")){setting(x0, x1); callbackContext.success("Success");}
      if(action.equals("toast")){toast(x0); callbackContext.success("Success");}
      if(action.equals("flags")){flags(x0, x1); callbackContext.success("Success");}
      if(action.equals("brightness")){brightness(x0); callbackContext.success("Success");}
      callbackContext.error("Method Error");
      
    }catch(JSONException e){
      callbackContext.error("Failed to parse parameters");
    }
    return true;
  }

  private boolean setting(String x0, String x1) {

    Intent intent = new Intent();
    if(x0.equals("user")){intent.setAction(Settings.ACTION_ACCESSIBILITY_SETTINGS);}
    if(x0.equals("account")){
      intent.setAction(Settings.ACTION_ADD_ACCOUNT);
      intent.putExtra(Settings.EXTRA_ACCOUNT_TYPES,new String[]{"com.google"});
    }
    if(x0.equals("airplane")){intent.setAction(Settings.ACTION_AIRPLANE_MODE_SETTINGS);}
    if(x0.equals("apn")){intent.setAction(Settings.ACTION_APN_SETTINGS);}
    if(x0.equals("application")){
      intent.setAction(Settings.ACTION_APPLICATION_DETAILS_SETTINGS);
      intent.setData(Uri.parse(x1));
    }
    if(x0.equals("developper")){intent.setAction(Settings.ACTION_APPLICATION_DEVELOPMENT_SETTINGS);}
    if(x0.equals("applist")){intent.setAction(Settings.ACTION_APPLICATION_SETTINGS);}
    if(x0.equals("bluetooth")){intent.setAction(Settings.ACTION_BLUETOOTH_SETTINGS);}
    if(x0.equals("roaming")){intent.setAction(Settings.ACTION_DATA_ROAMING_SETTINGS);}
    if(x0.equals("date")){intent.setAction(Settings.ACTION_DATE_SETTINGS);}
    if(x0.equals("device")){intent.setAction(Settings.ACTION_DEVICE_INFO_SETTINGS);}
    if(x0.equals("display")){intent.setAction(Settings.ACTION_DISPLAY_SETTINGS);}
    if(x0.equals("saver")){intent.setAction(Settings.ACTION_DREAM_SETTINGS);}
    if(x0.equals("keyboard")){intent.setAction(Settings.ACTION_INPUT_METHOD_SETTINGS);}

    this.cordova.getActivity().startActivity(intent);
    
    return true;
  }

  private boolean toast(String x0) {

    Toast.makeText(this.cordova.getActivity(), x0, Toast.LENGTH_LONG).show();
    
    return true;
  }

  private boolean flags(String x0, String x1) {

    if(x0.equals("fullscreen")){
      if(x1.equals("on")){
        this.cordova.getActivity().getWindow().addFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN);
      }else{
        this.cordova.getActivity().getWindow().clearFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN);
      }
    }
    if(x0.equals("nosleep")){
      if(x1.equals("on")){
        this.cordova.getActivity().getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
      }else{
        this.cordova.getActivity().getWindow().clearFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
      }
    }
    if(x0.equals("hidekey")){
      if(x1.equals("on")){
        this.cordova.getActivity().getWindow().setSoftInputMode(WindowManager.LayoutParams.SOFT_INPUT_STATE_ALWAYS_HIDDEN);
      }else{
      }
    }

    return true;
  }

  private boolean brightness(String x0) {

    WindowManager.LayoutParams lp = this.cordova.getActivity().getWindow().getAttributes();
    lp.screenBrightness = 1.0f;
    this.cordova.getActivity().getWindow().setAttributes(lp);

    return true;
  }

}
