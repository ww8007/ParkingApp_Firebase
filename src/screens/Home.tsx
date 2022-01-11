import React from 'react';
import { View } from 'react-native';
import { SafeAreaView } from '../theme';
import { StatusBar } from 'expo-status-bar';
import { TouchableOpacity } from 'react-native-gesture-handler';
export function Home() {
	return (
		<SafeAreaView>
			<StatusBar style="light" />
			<TouchableOpacity />
			<View />
		</SafeAreaView>
	);
}
