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
} from 'react-native';
import { styles } from './styles'
import { initialRegion } from '../../Constants/CommonConstants'
import MapView from 'react-native-hms-map';

export default class App extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <View style={styles.container}>
        <MapView 
          style={styles.map} 
          initialRegion={initialRegion}
          showCompass={true}
          showsUserLocation={true}
          showsMyLocationButton={true}
          >
        </MapView>
      </View>
    );
  }
};
