import React, { useCallback, useEffect, useState } from 'react';
import {
	KeyboardAvoidingView,
	Platform,
	StyleSheet,
	Text,
	TextInput,
	View,
	Dimensions,
	Alert,
} from 'react-native';
import { ActivityIndicator, Colors } from 'react-native-paper';
import { Button, ModalView, Sequence } from '../theme';
import Material from 'react-native-vector-icons/MaterialIcons';
import database from '@react-native-firebase/database';
import { TouchableHighlight, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';

import { setUserInfo } from '../store/login';
import car, {
	getCarList,
	makePostSuccess,
	setCarId,
	setCarNum,
} from '../store/car';
import { useNavigation } from '@react-navigation/native';
import { carInfoState } from '../interface/car';

import { is } from 'immer/dist/internal';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import { getCarInfo, postDiscount } from '../store/car';

dayjs.locale('ko');
const screen = Dimensions.get('screen');

const UNDER_3 = 1;
const UNDER_5 = 4;
const OVER_5 = 6;

import firestore from '@react-native-firebase/firestore';
import { sendPushNotification } from '.';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';

interface props {
	setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
	modalVisible: boolean;
	carInfo: carInfoState;
}

export function ModalCarInfo({
	setModalVisible,
	modalVisible,
	carInfo,
}: props) {
	const {
		email,
		isCarGetSuccess,
		carServerInfo,
		isPostSuccess,
		isRequestCarNum,
	} = useSelector(({ login, car }: RootState) => ({
		email: login.email,
		isCarGetSuccess: car.isCarGetSuccess,
		carServerInfo: car.carInfo,
		isPostSuccess: car.isPostSuccess,
		isRequestCarNum: car.isRequestCarNum,
	}));

	const dispatch = useDispatch();
	const navigation = useNavigation();
	const [isIdExist, setIdExist] = useState(false);
	const [status, setStatus] = useState('request');
	useEffect(() => {
		if (modalVisible) {
			const subscriber = firestore()
				.collection('user')
				.doc(email)
				.onSnapshot((documentSnapshot) => {
					const data = documentSnapshot.data();
					if (data) {
						const { id } = data;
						dispatch(setCarId(id));
						setIdExist(true);
						console.log('work');
						dispatch(getCarList(carInfo.carNum.slice(-4)));
					}
					console.log('User data: ', documentSnapshot.data());
				});
			dispatch(setCarNum(carInfo.carNum));
			return () => subscriber();
		}
	}, [carInfo]);

	useEffect(() => {
		if (isCarGetSuccess && isIdExist === false) {
			const id = carServerInfo.id;
			const data = {
				id: id,
			};
		}
	}, [isCarGetSuccess, isIdExist]);

	useEffect(() => {
		if (isPostSuccess === true) {
			setStatus('ok');
			firestore()
				.collection('user')
				.doc(`${carInfo.email}`)
				.update({
					status: 'ok',
				})
				.then(() => {});

			database()
				.ref(`/postList/${carInfo.name}`)
				.update({
					status: 'ok',
				})
				.then(() => console.log('Data updated.'));
			Alert.alert('??????', '??????????????? ?????? ???????????????', [
				{ text: '??????', onPress: () => dispatch(makePostSuccess(false)) },
			]);
			(async () => {
				sendPushNotification(carInfo.pushToken, '??? ?????? ???????????????');
			})();
		}
	}, [isPostSuccess, carInfo]);

	const onPressClose = useCallback(() => {
		setModalVisible(false);
	}, []);

	const [hour, setHour] = useState('3');
	const [mode, setMode] = useState('1');
	// ?????? ?????? ??????
	useEffect(() => {
		const differTime = carServerInfo.differentTime.split(':');
		const requestHour = Number(carInfo.hour);
		const hour = Number(differTime[0]);
		const minute = Number(differTime[1]);
		if (requestHour === 0) {
			if (hour < 3 && minute <= 55) setHour('3');
			else setHour('5');
		} else {
			setHour(String(requestHour));
		}
	}, []);
	// ????????? fireStore ?????? ?????? ??????
	console.log('h', typeof hour);
	useEffect(() => {}, []);

	const onPressConfirm = useCallback(() => {
		if (hour === '3') {
			dispatch(
				postDiscount({
					id: carServerInfo.id,
					discountType: UNDER_3,
					carNo: carInfo.carNum,
				})
			);
		} else if (hour === '2') {
			dispatch(
				postDiscount({
					id: carServerInfo.id,
					discountType: UNDER_5,
					carNo: carInfo.carNum,
				})
			);
		} else if (hour === '5') {
			dispatch(
				postDiscount({
					id: carServerInfo.id,
					discountType: UNDER_3,
					carNo: carInfo.carNum,
				})
			);
			setTimeout(() => {
				dispatch(
					postDiscount({
						id: carServerInfo.id,
						discountType: UNDER_5,
						carNo: carInfo.carNum,
					})
				);
			}, 1000);
		}
	}, [hour, carInfo, carServerInfo]);

	const onPressRefused = useCallback(() => {
		setStatus('refuse');
		firestore()
			.collection('user')
			.doc(`${carInfo.email}`)
			.update({
				status: 'refuse',
			})
			.then(() => {
				console.log('User updated! ok');
			});
		database()
			.ref(`/postList/${carInfo.name}`)
			.update({
				status: 'refuse',
			})
			.then(() => console.log('Data updated.'));
		Alert.alert('??????', '??????????????? ?????? ???????????????', [
			{ text: '??????', onPress: () => dispatch(makePostSuccess(false)) },
		]);
		(async () => {
			sendPushNotification(carInfo.pushToken, '??? ????????? ?????? ???????????????');
		})();
	}, [carInfo]);

	const onPressFind = useCallback(() => {
		console.log(carInfo.pushToken);
		(async () => {
			await sendPushNotification(
				carInfo.pushToken,
				'??? ????????? ?????? ?????? ?????????. ???????????? ?????? ????????? ?????? ????????? ?????????'
			);
		})();
		firestore()
			.collection('user')
			.doc(`${carInfo.email}`)
			.update({
				status: 'refuse',
			})
			.then(() => {
				console.log('User updated! ok');
			});
	}, [carInfo]);

	const onPressDelete = useCallback(() => {
		Alert.alert('??????', '????????? ?????? ????????????????', [
			{
				text: '??????',
				onPress: () => console.log('cancel'),
				style: 'cancel',
			},
			{
				text: '??????',
				onPress: async () => {
					await database().ref(`/postList/${carInfo.name}`).remove();
					setModalVisible(false);
				},
				style: 'default',
			},
		]);
	}, [carInfo]);

	return (
		<ModalView
			modalVisible={modalVisible}
			setModalVisible={setModalVisible}
			ModalViewRender={() => (
				<>
					<View style={styles.modalView}>
						<View
							style={{
								flexDirection: 'row',
								justifyContent: 'flex-start',
								alignContent: 'center',
								alignItems: 'center',
							}}
						>
							<Text style={styles.titleText}>????????????</Text>

							<TouchableHighlight
								onPress={onPressDelete}
								style={{ marginLeft: '45%' }}
								underlayColor={Colors.grey100}
							>
								<FontAwesome5Icon
									color={Colors.black}
									name="trash-alt"
									size={20}
									style={{ padding: 15 }}
								/>
							</TouchableHighlight>
						</View>

						<View style={styles.rowView}>
							<View style={styles.textWithBorderView}>
								<Text style={styles.touchText}>??????</Text>
							</View>
							<View style={styles.textView}>
								<Text style={styles.touchText}>{carInfo.name}</Text>
							</View>
						</View>
						<View style={styles.rowView}>
							<View style={styles.textWithBorderView}>
								<Text style={styles.touchText}>????????????</Text>
							</View>
							<View style={styles.textView}>
								<Text style={styles.touchText}>{carInfo.carNum}</Text>
							</View>
						</View>
						<View style={styles.rowView}>
							<View style={styles.textWithBorderView}>
								<Text style={styles.touchText}>?????? ??????</Text>
							</View>
							<View style={styles.textView}>
								<Text style={styles.touchText}>
									{Number(carInfo.hour) === 0
										? '?????? ?????????'
										: `${carInfo.hour} ??????`}
								</Text>
							</View>
						</View>
						{isRequestCarNum === true && (
							<View style={styles.rowView}>
								<View style={styles.textWithBorderView}>
									<Text style={styles.touchText}>?????? ?????? ?????????</Text>
								</View>
								<View style={styles.textView}>
									<TouchableHighlight
										onPress={() => console.log('hi')}
										underlayColor={Colors.green800}
										style={{
											backgroundColor: Colors.green200,
											borderRadius: 8,
											width: '80%',
											marginLeft: '10%',
										}}
									>
										<Text style={styles.touchText}>????????????</Text>
									</TouchableHighlight>
								</View>
							</View>
						)}
						<View style={styles.rowView}>
							<View style={styles.textWithBorderView}>
								<Text style={styles.touchText}>????????????</Text>
							</View>
							<View style={styles.textView}>
								<Text style={styles.touchText}>
									{carServerInfo.differentTime}
								</Text>
							</View>
						</View>
						<View style={styles.rowView}>
							<View style={styles.textWithBorderView}>
								<Text style={styles.touchText}>????????????</Text>
							</View>
							<View style={styles.textView}>
								<Text style={styles.touchText}>
									{dayjs(carServerInfo.entryDate).format('A hh??? mm???')}
								</Text>
							</View>
						</View>
						<View style={styles.rowView}>
							<View style={styles.textWithBorderView}>
								<Text style={styles.touchText}>????????????</Text>
							</View>
							<View style={styles.textView}>
								<Text style={styles.touchText}>{hour}</Text>
							</View>
						</View>
						<View style={styles.rowView}>
							<View style={styles.textWithBorderView}>
								<Text style={styles.touchText}>??????</Text>
							</View>
							<View style={styles.textView}>
								<Text style={styles.touchText}>
									{status === 'request'
										? '?????????'
										: status === 'ok'
										? '??????'
										: '??????'}
								</Text>
							</View>
						</View>
					</View>

					<View style={styles.buttonOverLine} />
					<Button
						buttonNumber={2}
						buttonText="??????"
						secondButtonText="??????"
						onPressFunction={onPressRefused}
						secondOnPressFunction={onPressConfirm}
					/>
				</>
			)}
		/>
	);
}

const styles = StyleSheet.create({
	SafeAeaView: { flex: 1 },
	rowView: {
		flexDirection: 'row',
	},
	modalView: {
		height: 400,
		backgroundColor: Colors.grey100,
		width: '90%',
		borderRadius: 8,
	},
	textInputView: {
		paddingBottom: 2,
		borderBottomWidth: 0.3,
		width: '60%',
		justifyContent: 'center',
		textAlign: 'center',
		padding: 10,
		marginBottom: 15,
	},
	textInput: {
		fontSize: 18,
		fontFamily: 'NanumSquareR',
		justifyContent: 'center',
		textAlign: 'center',
	},
	titleText: {
		fontSize: 20,
		alignSelf: 'flex-start',
		marginTop: 20,
		marginLeft: 20,
		fontFamily: 'NanumSquareBold',
		letterSpacing: -1,
		marginBottom: 20,
	},
	subText: {
		fontSize: 13,
		alignSelf: 'center',
		fontFamily: 'NanumSquareR',
		letterSpacing: -1,
	},
	blankView: {
		height: 20,
	},
	buttonOverLine: {
		borderTopWidth: 0.4,
		width: screen.width * 0.9,
		marginTop: 20,
		borderColor: Colors.black,
	},
	touchText: {
		fontSize: 14,
		textAlign: 'center',
		fontFamily: 'NanumSquareR',
		letterSpacing: -1,
		// marginLeft: 10,
		marginTop: 10,
		marginBottom: 10,
	},
	textWithBorderView: {
		width: '50%',
		borderRightWidth: 0.3,
	},
	textView: {
		width: '50%',
	},
});
