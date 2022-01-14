import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Colors } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import HomeNavigator from './HomeNavigator';
import { Home } from './Home';
import { RouteProp, ParamListBase } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { Platform } from 'react-native';
import { Setting } from './Setting';
type TabBarIconProps = { focused: boolean; color: string; size: number };

const icons: Record<string, string[]> = {
	Home: ['car', 'car-outline'],
	Setting: ['ios-settings', 'ios-settings-outline'],
};

const screenOptions = ({
	route,
}: {
	route: RouteProp<ParamListBase, string>;
}) => {
	return {
		tabBarIcon: ({ focused, color, size }: TabBarIconProps) => {
			const { name } = route;

			const focusedSize = focused ? size + 6 : size;
			const focusedColor = focused ? Colors.blue500 : Colors.blue200;
			const [icon, iconOutline] = icons[name];

			const iconName = focused ? icon : iconOutline;
			return <Icon name={iconName} size={focusedSize} color={focusedColor} />;
		},
		tabBarActiveBackgroundColor: Colors.white,
		tabBarInactiveBackgroundColor: Colors.white,
		// tabBarActiveTintColor:
		// 	route.name !== 'Home' && isInTeamTime ? teamColor : individualColor,

		innerHeight: 40,
		headerShown: false,
		tabBarStyle: Platform.OS === 'ios' ? { height: 85 } : { height: 50 },
	};
};
const Tab = createBottomTabNavigator();

export default function TabNavigator() {
	return (
		<Tab.Navigator screenOptions={screenOptions}>
			<Tab.Screen
				name="Home"
				component={Home}
				options={{
					tabBarLabel: '개인 시간표',
					tabBarLabelStyle: {
						fontSize: 11,
						fontFamily: 'NanumSquareBold',
					},
				}}
			/>
			<Tab.Screen
				name="Setting"
				component={Setting}
				options={{
					tabBarLabel: '설정',
					tabBarLabelStyle: {
						fontSize: 11,
						fontFamily: 'NanumSquareBold',
					},
				}}
			/>
		</Tab.Navigator>
	);
}
