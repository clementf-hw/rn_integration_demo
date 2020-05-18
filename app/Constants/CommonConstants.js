import { PERMISSIONS } from 'react-native-permissions'

export const initialRegion = {
    // Istanbul
    latitude: 41.01074,
    longitude: 28.997436,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
};



export const pushDataType = {
    MESSAGE: "message",
    LOCATION: "location",
    MY_LOCATION: "my_location"
}

export const requiredPermissions = [
    { 
        permissionKey: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION, 
        permissionName: 'Location'
    },
    {
        permissionKey: PERMISSIONS.ANDROID.CAMERA,
        permissionName: 'Camera'
    },
    {
        permissionKey: PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
        permissionName: 'Read External Storage'
    }
]