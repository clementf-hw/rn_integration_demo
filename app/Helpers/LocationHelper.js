import HMSLocation from 'react-native-hms-location';
import * as R from 'ramda'
import { handlePermission } from './PermissionHelper'
import { PERMISSIONS } from 'react-native-permissions'

export const getLastLocation = () => HMSLocation.FusedLocation.Native.getLastLocation()

export const parseLocation = (location) => {
    return {
        latitude: R.propOr(0, 'latitude', location),
        longitude: R.propOr(0, 'longitude', location),
        latitudeDelta: R.propOr(0, 'latitudeDelta', location),
        longitudeDelta: R.propOr(0, 'longitudeDelta', location),
    }
}

export function getLocationPermission() {
    handlePermission({ 
        permissionKey: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION, 
        permissionName: 'Location'
    })
}