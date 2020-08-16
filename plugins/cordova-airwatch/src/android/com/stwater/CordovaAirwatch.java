package com.stwater;

import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CallbackContext;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import java.util.Enumeration;
import java.util.Properties;

public class CordovaAirwatch extends CordovaPlugin {

    @Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
            if ("getUsername".equals(action)) {
                getProperty("aw-username", callbackContext);
                return true;
            }
            if ("getProperty".equals(action)) {
                try{
                    String propertyKey = args.getString(0);
                    if("list".equals(propertyKey)){
                        getAllProperties(callbackContext);
                    }
                    getProperty(propertyKey, callbackContext);
                } catch (Exception e){
                    callbackContext.error("Exception in getProperty call: "+e.getMessage());
                }
                return true;
            }

        return false;  // Returning false results in a "MethodNotFound" error.
    }

    private void getProperty(String propertyKey, final CallbackContext callback){
        if(propertyKey == null || "".equals(propertyKey)){
            callback.error("missing argument Property Key, the property to get");
            return;
        }

        final String property = propertyKey;

        //Do not run on UI Thread.
        cordova.getThreadPool().execute(new Runnable() {
            @Override
            public void run() {
                try {
                    int counter = 1000;
                    String result = "notfound";

                    while (counter > 0 && result.equals("notfound")) {

                        //Try to get the user's Airwatch details
                        result = System.getProperty(property) != null ? System.getProperty(property) : result;

                        counter--;
                        Thread.sleep(10);
                    }

                    callback.success(result);
                } catch (Exception e){
                    callback.error("Exception in System.getProperty call: "+e.getMessage());
                }
            }
        });
    }

    private void getAllProperties(final CallbackContext callback){
    //Do not run on UI Thread.
        cordova.getThreadPool().execute(new Runnable() {
            @Override
            public void run() {
                try{
                    String propertyList = "<strong>Available Properties</strong><br/>";
                    Properties properties = System.getProperties();

                    Enumeration<String> prop = (Enumeration<String>) properties.propertyNames();

                    while(prop.hasMoreElements()){
                        String propName = prop.nextElement();
                        propertyList += "<strong>Key: " + propName + ":</strong>, value: " + System.getProperty(propName) + "<br />\n";
                    }

                    callback.success(propertyList);
                } catch (Exception e){
                    callback.error("Exception in System.getProperty call: "+e.getMessage());
                }
            }
        });
    }
}