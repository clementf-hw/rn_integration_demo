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
  Text
} from 'react-native';
import { styles } from './styles'
import { initialRegion } from '../../Constants/CommonConstants'
import MapView from 'react-native-hms-map';
import { RNRemoteMessage } from 'react-native-hwpush';
import { getLastLocation, parseLocation, getLocationPermission } from '../../Helpers/LocationHelper'
import * as R from 'ramda'

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
      }, 
    );
    this.getToken()
    this.initDataMessageListener()
    getLocationPermission()
  }

  getToken() {
    NativeModules.RNHmsInstanceId.getToken(
        null,
        RNRemoteMessage.DEFAULT_TOKEN_SCOPE,
        (result, token) => {
          const displayText = result === '0' ? token : 'Token registration failed, please restart.'
          this.setState({
            displayText
          })
        },
    );
  }

  initDataMessageListener() {
    const eventEmitter = new NativeEventEmitter(NativeModules.ToastExample); 
    this.listenerPushMsg = eventEmitter.addListener( 
      'PushMsgReceiverEvent', 
      event => {
        const message = new RNRemoteMessage(event.msg); 
        this.handleData(JSON.parse(message.getData()))
      }
    );
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
    const location = JSON.parse(locationData)
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

  render() {
    const { displayText, region } = this.state
    return (
      <View style={styles.container}>
        <Text style={styles.textBox}>
          {displayText}
        </Text>
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
