import {check, checkMultiple, request, requestMultiple, openSettings, RESULTS} from 'react-native-permissions';
import { Alert } from 'react-native'
import * as R from 'ramda'

export function getKeysByStatus(result, status) {
    const keys = Object.entries(result).reduce((acc, item) => {
        const [key, val] = item 
        if (val === status) {
            acc.push(key)
        }
        return acc
    }, [])
    return keys
}

export function handleMultiplePermissions(permissions) {
    if (!permissions || permissions.length < 1) return
    const permissionKeys = permissions.map(item => {
            return R.propOr(false, "permissionKey", item)
        }
    )
    checkMultiple(permissionKeys).then(
        (result) => {
            const deniedPermissions = getKeysByStatus(result, RESULTS.DENIED)
            const blockedPermissions = getKeysByStatus(result, RESULTS.BLOCKED)
            requestMultiplePermissions(deniedPermissions, blockedPermissions, permissions)
        }
    )
}

export function requestMultiplePermissions(requests, blocked, permissions) {
    requestMultiple(requests).then(
        (result) => {
            const blockedPermissions =  [...blocked, ...getKeysByStatus(result, RESULTS.BLOCKED)];
            if (blockedPermissions.length > 0) {
                const blockedNames = permissions.reduce((acc, item) => {
                    if (blockedPermissions.indexOf(item.permissionKey) != -1){
                        acc.push(item.permissionName)
                    }
                    return acc
                }, [])
                showPermissionDialog({
                    permissionName: blockedNames.join(', ')
                })
            } 
        }
    )
}

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
        'Please go to Settings to grant '+ permissionName+' permission(s).',
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