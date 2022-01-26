import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
	StyleSheet,
	Text,
	View,
	TextInput,
	ScrollView,
	ActivityIndicator,
	Alert,
	TouchableHighlight,
	BackHandler,
} from 'react-native';
import { Button, NavigationHeader, SafeAreaView, SelectButton } from '../theme';
import { StatusBar } from 'expo-status-bar';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Colors } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { getCar, getLogin, setSuperUserTokens } from '../store/login';
import { getCookie } from '../lib/api/login';
import { RootState } from '../store';
import Material from 'react-native-vector-icons/MaterialIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import list, {
	addList,
	dayChange,
	removeList,
	setToday,
	updateList,
} from '../store/list';
import database from '@react-native-firebase/database';
import PushNotification, {
	sendPushNotification,
} from '../components/PushNotification';
import firestore from '@react-native-firebase/firestore';
import messaging from '@react-native-firebase/messaging';

dayjs.locale('ko');

const mainColor = '#00B992';
const subColor = '#00B992';

import { firebase } from '@react-native-firebase/auth';
import { cos } from 'react-native-reanimated';
import { stringify } from 'qs';

export function Home() {
	const {
		carNum,
		name,
		timeList,
		email,
		pushToken,
		today,
		isCanSubmit,
		isCanRequest,
		isCanExtraRequest,
	} = useSelector(({ login, list }: RootState) => ({
		carNum: login.carNum,
		name: login.name,
		timeList: list.timeList,
		email: login.email,
		pushToken: login.pushToken,
		today: list.today,
		isCanSubmit: list.isCanSubmit,
		isCanRequest: list.isCanRequest,
		isCanExtraRequest: list.isCanExtraRequest,
	}));
	const [checkBox, setCheckBox] = useState('1');
	const [date, setDate] = useState(dayjs().format('DD'));
	const [postHour, setPostHour] = useState('1');

	const [superUserTokens, setTokens] = useState([]);

	const dispatch = useDispatch();

	const buttons = useMemo(
		() => [
			{
				text: '지금 나가요',
				checkNum: '1',
				hour: '0',
			},
			{
				text: '3시간 신청',
				checkNum: '2',
				hour: '3',
			},
			{
				text: '5시간 신청',
				checkNum: '3',
				hour: '5',
			},
			{
				text: '2시간 추가 신청',
				checkNum: '4',
				hour: '2',
			},
		],
		[]
	);

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
		setInterval(() => setDate(dayjs().format('DD')), 1000);
		if (date !== today) {
			dispatch(setToday(dayjs().format('DD')));
			dispatch(dayChange());
		}
	}, [today, date]);

	useEffect(() => {
		(async () => {
			await firestore()
				.collection('superUser')
				.doc('token')
				.get()
				.then((response) => {
					let data = response.data();
					data && setTokens(data.tokens);
					data && console.log(data.tokens);
				});
		})();
	}, []);

	useEffect(() => {
		const subscriber = firestore()
			.collection('user')
			.doc(email)
			.onSnapshot((documentSnapshot) => {
				if (
					documentSnapshot &&
					documentSnapshot.data() &&
					documentSnapshot.data() !== null
				) {
					const data = documentSnapshot.data();
					if (data && data.status === 'ok') {
						dispatch(updateList('ok'));
					} else if (data && data.status === 'refuse') {
						dispatch(updateList('refuse'));
					}
				}
			});

		// Stop listening for updates when no longer required
		//
	}, [email]);

	useEffect(() => {
		dispatch(setToday(dayjs().format('DD')));
	}, []);

	const onPressCheckBox = useCallback(
		(checkNum, hour) => {
			console.log(checkNum, hour);
			if (isCanExtraRequest && hour === '2') {
				setCheckBox(checkNum);
				setPostHour(hour);
			} else if (isCanExtraRequest === false && hour !== '2') {
				setCheckBox(checkNum);
				setPostHour(hour);
			}
		},
		[isCanExtraRequest]
	);

	const onPressSubmit = useCallback(() => {
		const time = dayjs().format('MM월 DD일 A hh시 mm분');
		const hourTIme = dayjs().format('A hh시 mm분');
		const day = dayjs().format('DD');
		dispatch(addList({ time, day, postHour }));
	}, [postHour]);

	useEffect(() => {
		if (isCanSubmit) {
			const hourTIme = dayjs().format('A hh시 mm분');
			const day = dayjs().format('DD');
			firestore()
				.collection('user')
				.doc(`${email}`)
				.update({
					status: 'request',
					day,
				})
				.then(() => {
					console.log('User updated!');
				});
			database()
				.ref(`/postList/${name}`)
				.update({
					timeStamp: hourTIme,
					carNum: carNum,
					hour: postHour,
					email: email,
					pushToken: pushToken,
					status: 'request',
				})
				.then(() => console.log('Data updated.'));

			superUserTokens.forEach((token) => {
				(async () => {
					await sendPushNotification(token, name, name);
				})();
			});
		}
	}, [isCanSubmit, postHour]);

	const onPressRemove = useCallback((id: number) => {
		dispatch(removeList(id));
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
								안녕하세요 {name}님
							</Text>
						</View>
						<View style={styles.blankView} />
						<Text style={styles.touchText}>등록 차량 정보 : {carNum}</Text>
						<View style={styles.blankView} />
						<Text style={styles.touchText}>신청 정보</Text>
						<View style={styles.blankView} />
						<Text style={[styles.touchText, { color: Colors.grey600 }]}>
							초과 시간은 개별 연락 주시길 바랍니다
						</Text>
						{buttons.map((button) => (
							<SelectButton
								key={button.text}
								hour={button.hour}
								checkBox={checkBox}
								isCanExtraRequest={isCanExtraRequest}
								onPressCheckBox={onPressCheckBox}
								isCanRequest={isCanRequest}
								text={button.text}
								checkNum={button.checkNum}
							/>
						))}
					</View>

					<TouchableOpacity
						onPress={onPressSubmit}
						activeOpacity={0.6}
						style={styles.buttonView}
					>
						<Text style={styles.buttonText}>신청하기</Text>
					</TouchableOpacity>

					<View style={{ minHeight: 40, maxHeight: 200 }} />
					<ScrollView
						style={[
							styles.borderView,
							{ borderBottomRightRadius: 15, borderBottomLeftRadius: 15 },
						]}
					>
						<View
							style={[
								styles.headerView,
								{
									flexDirection: 'row',
									alignItems: 'center',
									justifyContent: 'space-around',
								},
							]}
						>
							<Text
								style={[
									styles.touchText,
									{
										color: Colors.white,
										position: 'absolute',
										left: -2,
										top: 16,
									},
								]}
							>
								신청내역
							</Text>
							<TouchableHighlight
								onPress={() =>
									Alert.alert(
										'알림',
										'건물 정책상 1일 1회 주차 신청만 가능 합니다. 다만 3시간 신청의 경우 2시간 추가 신청이 가능 합니다.'
									)
								}
								style={{ marginLeft: '80%' }}
								underlayColor={mainColor}
							>
								<FontAwesome5
									color={Colors.white}
									name={'info-circle'}
									size={21}
								/>
							</TouchableHighlight>
						</View>
						{timeList.map((time, idx) => (
							<View
								key={time.id}
								style={{
									height: 35,
									flexDirection: 'row',
									alignItems: 'center',
									backgroundColor:
										time.status === 'send'
											? Colors.blue100
											: time.status === 'refuse'
											? Colors.red100
											: Colors.green200,
								}}
							>
								<Text style={[styles.listText]}>
									{idx + 1}. {time.time}
								</Text>
								<View style={{ position: 'absolute', right: 55 }}>
									{time.status === 'send' && (
										<ActivityIndicator color={mainColor} size={20} />
									)}
									{time.status === 'ok' && (
										<FontAwesome5
											color={mainColor}
											name="check-circle"
											size={20}
										/>
									)}
									{time.status === 'refuse' && (
										<FontAwesome color={mainColor} name="close" size={20} />
									)}
								</View>
								<View style={{ position: 'absolute', right: 20 }}>
									<TouchableOpacity
										style={{ padding: 5 }}
										onPress={() => onPressRemove(time.id)}
									>
										<FontAwesome5
											color={mainColor}
											name="trash-alt"
											size={20}
										/>
									</TouchableOpacity>
								</View>
							</View>
						))}
					</ScrollView>
					<View style={{ height: 40 }} />
				</View>
			</ScrollView>
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
		fontFamily: 'NanumSquareBold',
		marginLeft: '7.5%',
		letterSpacing: -1,
		color: Colors.grey100,
		fontSize: 14,
		// marginTop: 20,
	},
	listText: {
		alignSelf: 'center',
		marginLeft: '7.5%',
		fontFamily: 'NanumSquareR',
	},
	borderView: {
		alignSelf: 'center',
		// justifyContent: 'flex-start',
		width: '85%',
		backgroundColor: Colors.grey200,
		minHeight: 400,
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
		// alignItems: 'center',
		// alignContent: 'center',
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
});
