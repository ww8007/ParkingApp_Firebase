import 'expo-dev-client';
import { Alert, AppRegistry } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import 'react-native-gesture-handler';
import { registerRootComponent } from 'expo';

import App from './App';

// Register background handler
messaging().setBackgroundMessageHandler(async (remoteMessage) => {
	console.log('Message handled in the background!', remoteMessage);

	Alert.alert('good');
});

messaging().setOpenSettingsForNotificationsHandler(async () => {
	// Set persistent value, using the MMKV package just as an example of how you might do it
	MMKV.setBool(openSettingsForNotifications, true);
});
// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
AppRegistry.registerComponent('app', () => App);
