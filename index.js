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

function HeadlessCheck({ isHeadless }) {
	if (isHeadless) {
		// App has been launched in the background by iOS, ignore
		return null;
	}

	return <App />;
}

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
AppRegistry.registerComponent('app', () => HeadlessCheck);
