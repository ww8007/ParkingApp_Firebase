// import React, { useEffect, useState } from 'react';
// import { Text } from 'react-native';
// import * as GoogleSignIn from 'expo-google-sign-in';

// export function GoogleLogin() {
// 	const [user, setUser] = useState<any>();

// 	// useEffect(() => {
// 	// 	initAsync();
// 	// }, []);

// 	// const initAsync = async () => {
// 	// 	await GoogleSignIn.initAsync({
// 	// 		// You may ommit the clientId when the firebase `googleServicesFile` is configured
// 	// 		clientId: '<YOUR_IOS_CLIENT_ID>',
// 	// 	});
// 	// 	_syncUserWithStateAsync();
// 	// };

// 	const _syncUserWithStateAsync = async () => {
// 		const user = await GoogleSignIn.signInSilentlyAsync();
// 		user && setUser(user);
// 	};

// 	const signOutAsync = async () => {
// 		await GoogleSignIn.signOutAsync();
// 		setUser(user);
// 	};

// 	const signInAsync = async () => {
// 		try {
// 			await GoogleSignIn.askForPlayServicesAsync();
// 			const { type, user } = await GoogleSignIn.signInAsync();
// 			if (type === 'success') {
// 				_syncUserWithStateAsync();
// 			}
// 		} catch ({ message }) {
// 			alert('login: Error:' + message);
// 		}
// 	};

// 	return <Text onPress={signInAsync}>Toggle Auth</Text>;
// }
