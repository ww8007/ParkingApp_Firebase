import React, { useCallback, useEffect, useState } from 'react';
import {
	StyleSheet,
	Text,
	View,
	TextInput,
	ScrollView,
	ActivityIndicator,
	Alert,
	TouchableHighlight,
	Dimensions,
	BackHandler,
} from 'react-native';
import { Button, NavigationHeader, SafeAreaView } from '../theme';
import { StatusBar } from 'expo-status-bar';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Colors } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';

import { getCookie } from '../lib/api/login';
import { RootState } from '../store';
import Material from 'react-native-vector-icons/MaterialIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Icons from 'react-native-vector-icons/AntDesign';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import { addList, removeList } from '../store/list';

import { initLogin, getLogin, makePostSuccess } from '../store/car';
import { ModalCarInfo } from '../components';
import type { carInfoState } from '../interface/car';
import PushNotification from '../components/PushNotification';
dayjs.locale('ko');
import { LogBox } from 'react-native';
import _ from 'lodash';
import messaging from '@react-native-firebase/messaging';
LogBox.ignoreLogs(['Warning:...']); // ignore specific logs
LogBox.ignoreAllLogs(); // ignore all logs
const _console = _.clone(console);
import database from '@react-native-firebase/database';
console.warn = (message) => {
	if (message.indexOf('Setting a timer') <= -1) {
		_console.warn(message);
	}
};
const mainColor = '#00B992';
const subColor = '#008080';

const screen = Dimensions.get('screen');

interface data {
	[prop: string]: people;
}

interface people {
	carNum: string;
	email: string;
	hour: string;
	timeStamp: string;
	pushToken: string;
	status: string;
}

export function SuperUser() {
	const { carNum, name, timeList } = useSelector(
		({ login, list }: RootState) => ({
			carNum: login.carNum,
			name: login.name,
			timeList: list.timeList,
		})
	);

	const [checkBox, setCheckBox] = useState(false);
	const dispatch = useDispatch();
	const [modalVisible, setModalVisible] = useState(false);
	// useEffect(() => {
	// 	getCookie();
	// }, []);
	// const onPressSubmit = useCallback(() => {
	// 	dispatch(getCar());
	// }, []);
	// const onPressLogin = useCallback(() => {
	// 	dispatch(getLogin());
	// }, []);

	const [data, setData] = useState<any>();
	const [isInitial, setInitial] = useState(true);

	useEffect(() => {
		const backAction = () => {
			Alert.alert('알림', '정말로 나가시겠어요?', [
				{
					text: '취소',
					onPress: () => null,
					style: 'cancel',
				},
				{ text: '확인', onPress: () => BackHandler.exitApp() },
			]);
			return true;
		};

		const backHandler = BackHandler.addEventListener(
			'hardwareBackPress',
			backAction
		);

		return () => backHandler.remove();
	}, []);

	useEffect(() => {
		const unsubscribe = messaging().onMessage(async (remoteMessage) => {
			remoteMessage.notification?.body &&
				Alert.alert(remoteMessage.notification?.body);
		});

		return unsubscribe;
	}, []);
	useEffect(() => {
		const onValueChange = database()
			.ref(`/postList`)
			.on('value', (snapshot) => {
				setData(snapshot.val());
			});

		// Stop listening for updates when no longer required
		return () => database().ref(`/postList}`).off('value', onValueChange);
	}, [isInitial]);

	// const onPressReload = useCallback(() => {
	// 	onValue(carRef, (snapshot) => {
	// 		setData(snapshot.val());
	// 		console.log(data);
	// 	});
	// }, []);

	const [carInfo, setCarInfo] = useState<carInfoState>({
		carNum: '',
		email: '',
		hour: '',
		timeStamp: '',
		name: '',
		pushToken: '',
		status: '',
	});
	const onPressEachCarInfo = useCallback(
		({
			email,
			carNum,
			hour,
			name,
			timeStamp,
			pushToken,
			status,
		}: carInfoState) => {
			setCarInfo({ carNum, email, hour, name, timeStamp, pushToken, status });
			dispatch(makePostSuccess(false));
			setModalVisible(true);
		},
		[]
	);

	useEffect(() => {
		dispatch(initLogin());
		setTimeout(() => {
			dispatch(getLogin());
		}, 500);
	}, []);

	return (
		<SafeAreaView style={{ backgroundColor: mainColor }}>
			<StatusBar style={'auto'} backgroundColor={mainColor} />
			<NavigationHeader title="주차 신청" />
			<ScrollView style={styles.view}>
				<View style={styles.mainView}>
					<View style={{ height: 40 }} />
					<View style={styles.borderView}>
						<View style={styles.headerView}>
							<Text style={[styles.touchText, { color: Colors.white }]}>
								신청내역
							</Text>
						</View>

						{data &&
							Object.keys(data).map((people: string, idx) => (
								<TouchableHighlight
									activeOpacity={0.5}
									underlayColor={Colors.grey500}
									onPress={() =>
										onPressEachCarInfo({
											email: data[people].email,
											carNum: data[people].carNum,
											name: people,
											hour: data[people].hour,
											timeStamp: data[people].timeStamp,
											pushToken: data[people].pushToken,
											status: data[people].status,
										})
									}
									style={{
										paddingTop: 15,
										paddingBottom: 15,
										backgroundColor:
											data[people].status === 'request'
												? Colors.blue100
												: data[people].status === 'ok'
												? Colors.green200
												: Colors.red200,
									}}
									key={data[people].timeStamp}
								>
									<>
										<Text style={styles.listText}>
											{idx + 1}. {people}, {data[people].carNum},{' '}
											{data[people].timeStamp}
										</Text>
										<Icons size={15} name="right" style={styles.iconStyle} />
									</>
								</TouchableHighlight>
							))}
					</View>
					<View style={styles.buttonView} />
				</View>
			</ScrollView>
			<ModalCarInfo
				modalVisible={modalVisible}
				setModalVisible={setModalVisible}
				carInfo={carInfo}
			/>
			<PushNotification />
			<View />
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	view: {
		flex: 1,
		backgroundColor: Colors.white,
	},
	mainView: {
		flex: 1,
	},
	touchView: {
		marginTop: 10,
		backgroundColor: Colors.blue400,
	},
	titleText: {
		fontSize: 20,
		alignSelf: 'flex-start',
		fontFamily: 'NanumSquareBold',
		marginLeft: '8%',
		marginTop: 20,
		letterSpacing: -1,
		marginBottom: 20,
	},
	touchText: {
		textAlign: 'center',
		alignSelf: 'flex-start',
		fontFamily: 'NanumSquareBold',
		marginLeft: '7.5%',
		letterSpacing: -1,
		fontSize: 15,
		// marginTop: 20,
	},
	subText: {
		textAlign: 'center',
		alignSelf: 'flex-start',
		fontFamily: 'NanumSquareR',
		marginLeft: '7.5%',
		letterSpacing: -1,
		// marginTop: 20,
	},
	listText: {
		marginLeft: '7.5%',
		fontFamily: 'NanumSquareR',
	},
	borderView: {
		alignSelf: 'center',
		// justifyContent: 'flex-start',
		width: '85%',
		backgroundColor: Colors.grey200,
		height: screen.height * 0.65,
		borderTopLeftRadius: 15,
		borderTopRightRadius: 15,
	},
	buttonView: {
		alignItems: 'center',
		justifyContent: 'center',
		width: '85%',
		marginLeft: '7.5%',
		height: 50,
		backgroundColor: mainColor,
		borderBottomLeftRadius: 15,
		borderBottomRightRadius: 15,
	},
	headerView: {
		height: 50,
		alignItems: 'center',
		alignContent: 'center',
		justifyContent: 'center',
		backgroundColor: mainColor,
		borderTopLeftRadius: 15,
		borderTopRightRadius: 15,
	},
	blankView: {
		height: 20,
	},
	textInputView: {
		borderBottomWidth: 0.5,
		backgroundColor: Colors.white,
		justifyContent: 'center',
		alignContent: 'center',
		alignItems: 'center',
		alignSelf: 'center',
		marginLeft: '6%',
		height: '80%',
		width: 40,
	},
	buttonText: {
		textAlign: 'center',
		fontFamily: 'NanumSquareBold',
		fontSize: 14,
		color: Colors.white,
	},
	iconStyle: {
		position: 'absolute',
		right: '11%',
		alignItems: 'center',
		alignContent: 'center',
		alignSelf: 'center',
		paddingTop: 15,
	},
});
