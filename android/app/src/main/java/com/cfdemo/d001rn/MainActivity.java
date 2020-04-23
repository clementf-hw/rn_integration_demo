package com.cfdemo.d001rn;

import com.facebook.react.ReactActivity;
import com.huawei.hms.rn.location.helpers.HMSBroadcastReceiver;
import android.os.Bundle;

public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "d001rn";
  }

  @Override 
  public void onCreate(Bundle savedInstanceState){ 
    super.onCreate(savedInstanceState); 
    //HMSLocation Kit 
    HMSBroadcastReceiver.init(this, getReactNativeHost() 
      .getReactInstanceManager()); 
  }
}
