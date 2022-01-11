import React, { useCallback, useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, set } from 'firebase/database';
import { collection } from 'firebase/firestore';

// import {ActivityIndicator} from 'react-native';
import { Provider, useSelector } from 'react-redux';
import { Provider as PaperProvider } from 'react-native-paper';
import { composeWithDevTools } from 'redux-devtools-extension';

import { applyMiddleware, createStore } from 'redux';
// import {IThemeState} from 'app/models/reducers/theme';
import rootReducer from './src/store';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';

// Initialize Firebase
// import MainNavigator from './src/screens/MainNavigator';
import {
	NavigationContainer,
	DefaultTheme,
	DarkTheme,
} from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { AppearanceProvider, useColorScheme } from 'react-native-appearance';
import 'react-native-gesture-handler';
// import { enableScreens } from 'react-native-screens';
import { SafeAreaProvider } from 'react-native-safe-area-context';
// import { ToggleThemeProvider } from './src/contexts';
// import { useEffect } from 'react';
// import Loading from './src/screens/Loading';
import * as ScreenOrientation from 'expo-screen-orientation';
import * as Font from 'expo-font';
import { ToggleThemeProvider } from './src/contexts';
import MainNavigator from './src/screens/MainNavigator';
import thunk from 'redux-thunk';
// enableScreens();

// make Store
const store = createStore(rootReducer, composeWithDevTools(applyMiddleware())); // 스토어를 만듭니다.
const persistor = persistStore(store);

export default function App() {
	const scheme = useColorScheme();
	const [theme, setTheme] = useState(
		scheme === 'dark' ? DefaultTheme : DefaultTheme
	);
	useEffect(() => {
		lockOrientation();
	}, []);
	useEffect(() => {
		loadAssetsAsync();
	}, []);
	const [isLoading, onChangeLoading] = useState(false);
	const loadAssetsAsync = async () => {
		await Font.loadAsync({
			SCDream2: require('./assets/fonts/SCDream2.otf'),
			SCDream3: require('./assets/fonts/SCDream3.otf'),
			SCDream4: require('./assets/fonts/SCDream4.otf'),
			NanumSquareBold: require('./assets/fonts/NanumSquareBold.ttf'),
			NanumSquareR: require('./assets/fonts/NanumSquareR.ttf'),
			NanumSquareL: require('./assets/fonts/NanumSquareL.ttf'),
		});
		onChangeLoading(true);
	};
	const lockOrientation = async () => {
		await ScreenOrientation.lockAsync(
			ScreenOrientation.OrientationLock.PORTRAIT_UP
		);
	};
	const toggleTheme = useCallback(
		() => setTheme(({ dark }) => (dark ? DefaultTheme : DefaultTheme)),
		[]
	);

	function getScore() {}
	return (
		<Provider store={store}>
			<PersistGate loading={null} persistor={persistor}>
				<AppearanceProvider>
					<ToggleThemeProvider toggleTheme={toggleTheme}>
						<SafeAreaProvider>
							<NavigationContainer theme={theme}>
								{/* {loading && <Loading />} */}
								{isLoading && <MainNavigator />}
							</NavigationContainer>
						</SafeAreaProvider>
					</ToggleThemeProvider>
				</AppearanceProvider>
			</PersistGate>
		</Provider>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center',
	},
});
