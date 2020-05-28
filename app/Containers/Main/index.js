/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { Component } from 'react';
import {
  View,
  NativeModules,
  NativeEventEmitter,
  Text,
  Button,
  Linking
} from 'react-native';
import { styles } from './styles'
import { initialRegion, requiredPermissions } from '../../Constants/CommonConstants'
import MapView from 'react-native-hms-map';
import { RNRemoteMessage } from 'react-native-hwpush';
import { getLastLocation, parseLocation } from '../../Helpers/LocationHelper'
import * as R from 'ramda'
import ReactNativeHmsScan from 'react-native-hms-scan'
import { handleMultiplePermissions } from '../../Helpers/PermissionHelper'
import url from 'url'

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      displayText: "Waiting for Token...",
      region: initialRegion
    };
  }

  componentDidMount() {
    const eventTokenEmitter = new NativeEventEmitter(NativeModules.ToastExample); 
    this.listenerToken = eventTokenEmitter.addListener( 
      'PushTokenMsgReceiverEvent', 
      event => { 
        console.log('log received token:' + event.token + '\n')
        this.setState({
          displayText: event.token
        })
      }, 
    );
    this.getToken()
    this.initPushMessageListener()
    handleMultiplePermissions(requiredPermissions)
  }

  getToken() {
    NativeModules.RNHmsInstanceId.getToken(
        null,
        RNRemoteMessage.DEFAULT_TOKEN_SCOPE,
        (result, token) => {
          const displayText = result === '0' ? token : 'Token registration failed, please restart.'
          console.log('log received token:' + token + '\n')
          this.setState({
            displayText
          })
        },
    );
  }

  initPushMessageListener() {
    // Get the url that opens the app
    const getAppOpenUrl = async () => {
      const initialUrl = await Linking.getInitialURL();
      console.log('Opening deeplink: ' + initialUrl)
      this.handleDeepLink(initialUrl)
    };
    getAppOpenUrl()

    // Listen to plain Notification Messages
    Linking.addEventListener('url', 
      event => {
        console.log("Notification deeplink: " + event.url)
        this.handleDeepLink(event.url)
      }
    );

    // Listen to Data Messages
    const eventEmitter = new NativeEventEmitter(NativeModules.ToastExample); 
    this.listenerPushMsg = eventEmitter.addListener( 
      'PushMsgReceiverEvent', 
      event => {
        const message = new RNRemoteMessage(event.msg); 
        this.handleData(JSON.parse(message.getData()))
      }
    );
  }

  handleDeepLink(link) {
    if (!link) return 
    const linkObject = url.parse(link, true)
    console.log(linkObject)
  }

  handleData(data) {
    const message = R.propOr(false, "message", data)
    const location = R.propOr(false, "location", data) 
    const myLocation = R.propOr(false, "my_location", data)
    if (message) this.onMessageReceived(message)
    if (location) this.onLocationReceived(location)
    if (!location && myLocation) this.onRequestCurrentLocation()
  }
 
  onMessageReceived(message) {
    this.setState({
      displayText: message
    })
  }

  onLocationReceived(locationData) {
    const location =  typeof locationData === "object" ? locationData : JSON.parse(locationData)
    this.setState({
      region: {
        latitude: parseFloat(location.lat),
        longitude: parseFloat(location.lng),
        latitudeDelta: 0,
        longitudeDelta: 0,
      }
    })
  }

  onRequestCurrentLocation() {
    getLastLocation().then(
      result => 
      {
        this.setState({
          region: parseLocation(result)
        })
      }
    ).catch(err => console.error(err))
  }

  async startScan() {
    try {
      const data = await ReactNativeHmsScan.startScan();
      const qrcodeData = {
        message: (JSON.parse(data)).message,
        location: (JSON.parse(data)).location,
        my_location: (JSON.parse(data)).my_location
      }
      this.handleData(qrcodeData)
    } catch (e) {
      console.log(e);
    }
  }

  onScan = () => {
    this.startScan()
  }

  render() {
    const { displayText, region } = this.state
    return (
      <View style={styles.container}>
        <Text style={styles.textBox}>
          {displayText}
        </Text>
        <Button 
          title={'Scan Button'}
          onPress={this.onScan}
        />
        <MapView 
          style={styles.map} 
          region={region}
          showCompass={true}
          showsUserLocation={true}
          showsMyLocationButton={true}
          >
        </MapView>
      </View>
    );
  }
};


