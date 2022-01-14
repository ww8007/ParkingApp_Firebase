import React, { useCallback, useEffect, useState } from 'react';
import {
	StyleSheet,
	Text,
	View,
	TextInput,
	ScrollView,
	ActivityIndicator,
	Alert,
} from 'react-native';
import { Button, NavigationHeader, SafeAreaView } from '../theme';
import { StatusBar } from 'expo-status-bar';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Colors } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { getCar, getLogin } from '../store/login';
import { getCookie } from '../lib/api/login';
import { RootState } from '../store';
import Material from 'react-native-vector-icons/MaterialIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import { addList, removeList } from '../store/list';
dayjs.locale('ko');

const mainColor = '#33aafc';

export function Home() {
	const { carNum, name, timeList } = useSelector(
		({ login, list }: RootState) => ({
			carNum: login.carNum,
			name: login.name,
			timeList: list.timeList,
		})
	);
	const [checkBox, setCheckBox] = useState(false);
	const dispatch = useDispatch();
	const onPressCheckBox = useCallback((check) => {
		setCheckBox(check);
	}, []);
	const [hour, setHour] = useState('');
	// useEffect(() => {
	// 	getCookie();
	// }, []);
	// const onPressSubmit = useCallback(() => {
	// 	dispatch(getCar());
	// }, []);
	// const onPressLogin = useCallback(() => {
	// 	dispatch(getLogin());
	// }, []);

	const onPressSubmit = useCallback(() => {
		const time = dayjs().format('MM월 DD일 HH시 mm분');
		console.log(checkBox);
		if (checkBox === true) {
			if (hour === '') {
				Alert.alert('신청 시간이 비어있습니다');
			} else {
				dispatch(addList(time));
			}
		} else {
			dispatch(addList(time));
		}

		console.log(time);
	}, [checkBox, hour]);

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
						<TouchableOpacity
							onPress={() => onPressCheckBox(false)}
							style={{
								flexDirection: 'row',
								marginTop: 20,
								alignSelf: 'center',
								width: '85%',
								height: 40,
								backgroundColor: Colors.blue100,
							}}
						>
							<Text style={[styles.subText, { alignSelf: 'center' }]}>
								30분 이내에 나가요
							</Text>
							<View style={{ position: 'absolute', right: 10, top: 8 }}>
								{checkBox ? (
									<Material
										color={mainColor}
										name={'check-box-outline-blank'}
										size={25}
									/>
								) : (
									<Material color={mainColor} name={'check-box'} size={25} />
								)}
							</View>
						</TouchableOpacity>
						<TouchableOpacity
							onPress={() => onPressCheckBox(true)}
							style={{
								flexDirection: 'row',
								marginTop: 20,
								alignSelf: 'center',
								width: '85%',
								height: 40,
								backgroundColor: Colors.blue100,
							}}
						>
							<View style={[styles.textInputView]}>
								<TextInput
									style={{ backgroundColor: Colors.white, marginLeft: '7.5%' }}
									value={hour}
									onChangeText={(hour) => setHour((text) => hour)}
									placeholder="1"
								/>
							</View>
							<Text
								style={[styles.subText, { alignSelf: 'center', marginLeft: 4 }]}
							>
								시간 이내에 나가요
							</Text>
							<View style={{ position: 'absolute', right: 10, top: 8 }}>
								{checkBox ? (
									<Material color={mainColor} name={'check-box'} size={25} />
								) : (
									<Material
										color={mainColor}
										name={'check-box-outline-blank'}
										size={25}
									/>
								)}
							</View>
						</TouchableOpacity>
					</View>

					<TouchableOpacity
						onPress={onPressSubmit}
						activeOpacity={0.6}
						style={styles.buttonView}
					>
						<Text style={styles.buttonText}>신청하기</Text>
					</TouchableOpacity>

					<View style={{ height: 40 }} />
					<View style={styles.borderView}>
						<View style={styles.headerView}>
							<Text style={[styles.touchText, { color: Colors.white }]}>
								신청내역
							</Text>
						</View>
						{timeList.map((time, idx) => (
							<View
								key={time.id}
								style={{
									height: 35,
									flexDirection: 'row',
									alignItems: 'center',
									backgroundColor:
										time.status === 'send' ? Colors.orange100 : Colors.blue100,
								}}
							>
								<Text style={[styles.listText]}>
									{idx + 1}. {time.time}
								</Text>
								<View style={{ position: 'absolute', right: 55 }}>
									{time.status === 'send' && (
										<ActivityIndicator color={mainColor} size={20} />
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
					</View>
				</View>
			</ScrollView>
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
		alignSelf: 'center',
		marginLeft: '7.5%',
		fontFamily: 'NanumSquareR',
	},
	borderView: {
		alignSelf: 'center',
		justifyContent: 'flex-start',
		width: '85%',
		backgroundColor: Colors.grey200,
		height: 280,
		borderTopLeftRadius: 15,
		borderTopRightRadius: 15,
	},
	buttonView: {
		alignItems: 'center',
		justifyContent: 'center',
		width: '85%',
		marginLeft: '7.5%',
		height: 50,
		backgroundColor: Colors.blue300,
		borderBottomLeftRadius: 15,
		borderBottomRightRadius: 15,
	},
	headerView: {
		height: 50,
		alignItems: 'center',
		alignContent: 'center',
		justifyContent: 'center',
		backgroundColor: Colors.blue300,
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
