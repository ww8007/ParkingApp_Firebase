import React, { useCallback, useEffect, useState } from 'react';
import {
	KeyboardAvoidingView,
	Platform,
	StyleSheet,
	Text,
	TextInput,
	View,
	Dimensions,
} from 'react-native';
import { ActivityIndicator, Colors } from 'react-native-paper';
import { Button, ModalView, Sequence } from '../theme';
import Material from 'react-native-vector-icons/MaterialIcons';
import {
	TouchableHighlight,
	TouchableOpacity,
} from 'react-native-gesture-handler';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import {
	doc,
	getFirestore,
	setDoc,
	collection,
	addDoc,
	updateDoc,
	getDoc,
} from 'firebase/firestore';
import { setUserInfo } from '../store/login';
import car, { getCarList, setCarId, setCarNum } from '../store/car';
import { useNavigation } from '@react-navigation/native';
import { carInfoState } from '../interface/car';
import { useSetFireStore } from '../hooks';
import { is } from 'immer/dist/internal';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import { getCarInfo, postDiscount } from '../store/car';

dayjs.locale('ko');
const screen = Dimensions.get('screen');

const UNDER_3 = 1;
const UNDER_5 = 4;
const OVER_5 = 6;

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
	const { email, isCarGetSuccess, carServerInfo, isPostSuccess } = useSelector(
		({ login, car }: RootState) => ({
			email: login.email,
			isCarGetSuccess: car.isCarGetSuccess,

			carServerInfo: car.carInfo,
			isPostSuccess: car.isCarGetSuccess,
		})
	);

	const dispatch = useDispatch();
	const navigation = useNavigation();
	const [isIdExist, setIdExist] = useState(false);
	useEffect(() => {
		if (modalVisible) {
			const db = getFirestore();
			const docRef = doc(db, 'user', carInfo.email);
			let data;
			console.log(carInfo.email);
			(async () => {
				data = await getDoc(docRef);
				if (data.exists()) {
					console.log('Document data:', data.data());
					// dispatch(getCarList(carInfo.carNum.slice(-4)));
					const id = data.data().id;
					if (id !== '') {
						dispatch(setCarId(id));
						// dispatch(getCarInfo(id));
						setIdExist(true);
					}
				} else {
					// doc.data() will be undefined in this case
					console.log('No such document!');
				}
			})();

			dispatch(setCarNum(carInfo.carNum));
		}
	}, [carInfo]);

	useEffect(() => {
		if (isCarGetSuccess && isIdExist === false) {
			const id = carServerInfo.id;
			const data = {
				id: id,
			};
			const fireStore = getFirestore();
			const washingtonRef = doc(fireStore, 'user', `${email}`);
			(async () => {
				await updateDoc(washingtonRef, data);
			})();
		}
	}, [isCarGetSuccess, isIdExist]);

	const onPressClose = useCallback(() => {
		setModalVisible(false);
	}, []);

	const [hour, setHour] = useState('3');
	const [mode, setMode] = useState('1');
	// 시간 설정 로직
	useEffect(() => {
		const differTime = carServerInfo.differentTime.split(':');
		const hour = Number(differTime[0]);
		if (hour < 3) {
			setHour('3');
		} else if (hour < 5) {
			setHour('5');
		} else {
			setHour(String(hour));
		}
	}, []);
	// 성공시 fireStore 상태 변경 로직
	useEffect(() => {}, []);

	const onPressConfirm = useCallback(() => {
		let countHour = Number(hour);
		console.log(carServerInfo.id);
		console.log(carInfo.carNum);
		if (hour === '3') {
			dispatch(
				postDiscount({
					id: carServerInfo.id,
					discountType: UNDER_3,
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
			}, 600);
		} else {
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
			}, 600);
			countHour = countHour - 5;
			while (true) {
				setTimeout(() => {
					dispatch(
						postDiscount({
							id: carServerInfo.id,
							discountType: OVER_5,
							carNo: carInfo.carNum,
						})
					);
				}, 400);
				countHour -= 1;
				if (countHour < 0) break;
			}
		}
	}, [hour, carInfo, carServerInfo]);

	const onPressFind = useCallback(() => {
		dispatch(getCarList(carInfo.carNum.slice(-4)));
	}, [carInfo]);

	return (
		<ModalView
			modalVisible={modalVisible}
			setModalVisible={setModalVisible}
			ModalViewRender={() => (
				<>
					<View style={styles.blankView} />
					<View style={styles.modalView}>
						<Text style={styles.titleText}>신청정보</Text>
						<View style={styles.rowView}>
							<View style={styles.textWithBorderView}>
								<Text style={styles.touchText}>이름</Text>
							</View>
							<View style={styles.textView}>
								<Text style={styles.touchText}>{carInfo.name}</Text>
							</View>
						</View>
						<View style={styles.rowView}>
							<View style={styles.textWithBorderView}>
								<Text style={styles.touchText}>차량번호</Text>
							</View>
							<View style={styles.textView}>
								<Text style={styles.touchText}>{carInfo.carNum}</Text>
							</View>
						</View>
						<View style={styles.rowView}>
							<View style={styles.textWithBorderView}>
								<Text style={styles.touchText}>요청 시간</Text>
							</View>
							<View style={styles.textView}>
								<Text style={styles.touchText}>
									{carInfo.hour === '0'
										? '바로 나가요'
										: `${carInfo.hour} 시간 뒤에 나가요`}
								</Text>
							</View>
						</View>
						{/* {!isIdExist === true && (
							<View style={styles.rowView}>
								<View style={styles.textWithBorderView}>
									<Text style={styles.touchText}>서버 연동</Text>
								</View>
								<View style={styles.textView}>
									<TouchableHighlight
										onPress={onPressFind}
										underlayColor={Colors.green800}
										style={{
											backgroundColor: Colors.green200,
											borderRadius: 8,
											width: '80%',
											marginLeft: '10%',
										}}
									>
										<Text style={styles.touchText}> 연동하기</Text>
									</TouchableHighlight>
								</View>
							</View>
						)} */}
						<View style={styles.rowView}>
							<View style={styles.textWithBorderView}>
								<Text style={styles.touchText}>주차시간</Text>
							</View>
							<View style={styles.textView}>
								<Text style={styles.touchText}>
									{carServerInfo.differentTime}
								</Text>
							</View>
						</View>
						<View style={styles.rowView}>
							<View style={styles.textWithBorderView}>
								<Text style={styles.touchText}>입차시간</Text>
							</View>
							<View style={styles.textView}>
								<Text style={styles.touchText}>
									{dayjs(carServerInfo.entryDate).format('HH시 mm분')}
								</Text>
							</View>
						</View>
						<View style={styles.rowView}>
							<View style={styles.textWithBorderView}>
								<Text style={styles.touchText}>적용시간</Text>
							</View>
							<View style={styles.textView}>
								<Text style={styles.touchText}>{hour}</Text>
							</View>
						</View>
					</View>
					<View style={styles.blankView} />
					<View style={styles.buttonOverLine} />
					<Button
						buttonNumber={2}
						buttonText="거절"
						secondButtonText="승인"
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
		backgroundColor: Colors.grey200,
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
		marginLeft: 10,
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
