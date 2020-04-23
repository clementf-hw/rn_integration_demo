import {check, request, openSettings, RESULTS} from 'react-native-permissions';
import { Alert } from 'react-native'
import * as R from 'ramda'

export function handlePermission(permission) {
    const permissionKey = R.propOr(false, "permissionKey", permission)
    if (!permissionKey) return

    check(permissionKey)
    .then((result) => {
        switch (result) {
        case RESULTS.UNAVAILABLE:
            // 'This feature is not available (on this device / in this context)',
            break;
        case RESULTS.DENIED:
            // 'The permission has not been requested / is denied but requestable'
            requestPermission(permission)
            break;
        case RESULTS.GRANTED:
            // Granted
            break;
        case RESULTS.BLOCKED:
            // The permission is denied and not requestable anymore
            showPermissionDialog(permission)
            break;
        }
    })
    .catch((error) => {
        console.error(error)
    });
}

export function requestPermission(permission) {
    const permissionKey = R.propOr(false, "permissionKey", permission)
    if (!permissionKey) return

    request(permissionKey).then((result) => {
        if (result === RESULTS.DENIED || result === RESULTS.BLOCKED) {
            showPermissionDialog(permission)
        } 
    })
}

function showPermissionDialog(permission) {
    const permissionName = R.propOr(false, "permissionName", permission)
    if (!permissionName) return

    Alert.alert(
        'Permission not granted',
        'Please go to Settings to grant '+ permissionName+' permission.',
        [
            {
                text: 'Dismiss',
                style: 'cancel'
            },
            {
                text: 'Settings',
                onPress: () => redirectToSettings()
            }
        ]
    )
}

redirectToSettings = () => {
    openSettings().catch(() => console.warn('cannot open settings'));
}