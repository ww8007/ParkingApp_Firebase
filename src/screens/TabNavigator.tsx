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
import PushNotification from '../components/PushNotification';
import { SuperUser } from './SuperUser';
type TabBarIconProps = { focused: boolean; color: string; size: number };

const icons: Record<string, string[]> = {
	Home: ['car', 'car-outline'],
	SuperUser: ['car', 'car-outline'],
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

			const focusedSize = focused ? size + 4 : size;
			const focusedColor = focused ? '#00B992' : Colors.green200;
			const [icon, iconOutline] = icons[name];

			const iconName = focused ? icon : iconOutline;
			return <Icon name={iconName} size={focusedSize} color={focusedColor} />;
		},
		tabBarActiveBackgroundColor: Colors.white,
		tabBarInactiveBackgroundColor: Colors.white,
		tabBarActiveTintColor: Colors.black,
		tabBarInactiveTintColor: Colors.grey600,
		// tabBarActiveTintColor:
		// 	route.name !== 'Home' && isInTeamTime ? teamColor : individualColor,

		innerHeight: 40,
		headerShown: false,
		tabBarStyle: Platform.OS === 'ios' ? { height: 85 } : { height: 50 },
	};
};
const Tab = createBottomTabNavigator();

export default function TabNavigator() {
	const { isSuperUser } = useSelector(({ login }: RootState) => ({
		isSuperUser: login.isSuperUser,
	}));
	console.log(isSuperUser);
	return (
		<Tab.Navigator screenOptions={screenOptions}>
			{isSuperUser === false ? (
				<>
					<Tab.Screen
						name="Home"
						component={Home}
						options={{
							tabBarLabel: '주차 신청',
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
				</>
			) : (
				<>
					<Tab.Screen
						name="SuperUser"
						component={SuperUser}
						options={{
							tabBarLabel: '설정',
							tabBarLabelStyle: {
								fontSize: 11,
								fontFamily: 'NanumSquareBold',
							},
						}}
					/>
				</>
			)}
		</Tab.Navigator>
	);
}
