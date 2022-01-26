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
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import firestore from '@react-native-firebase/firestore';

import { setUserInfo } from '../store/login';
import car from '../store/car';
import { useNavigation } from '@react-navigation/native';
const screen = Dimensions.get('screen');

interface props {
	setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
	modalVisible: boolean;
}

export function ModalRegister({ setModalVisible, modalVisible }: props) {
	const { email } = useSelector(({ login }: RootState) => ({
		email: login.email,
	}));

	const dispatch = useDispatch();
	const navigation = useNavigation();
	const [item] = useState([0, 1, 2, 3]);
	const [currentNumber, setCurrent] = useState(0);
	const [mode, setMode] = useState('initial');
	const [name, setName] = useState('');
	const [carNum, setCarNum] = useState('');
	const [checkBox, setCheckBox] = useState(false);

	const onPressNext = useCallback(
		(text: string) => {
			setMode(text);
			setCurrent((currentNumber) => currentNumber + 1);
		},
		[currentNumber]
	);
	const onPressPrev = useCallback(
		(text: string) => {
			setMode(text);
			setCurrent((currentNumber) => currentNumber - 1);
		},
		[currentNumber]
	);

	useEffect(() => {
		if (mode === 'loading') {
			// const fireStore = getFirestore();
			let carNumber;
			carNumber = carNum.replace(' ', '');
			setCarNum(carNum.replace(' ', ''));
			dispatch(setUserInfo({ name, carNum }));
			firestore()
				.collection('user')
				.doc(`${email}`)
				.update({
					name: name,
					carNum: carNumber,
					id: '',
				})
				.then(() => {
					console.log('User updated!');
				});
			setTimeout(() => setMode('finish'), 1000);
		}
	}, [mode, email, carNum, name]);

	const onPressClose = useCallback(() => {
		setModalVisible(false);
		setMode('initial');
		navigation.navigate('TabNavigator');
	}, []);

	return (
		<ModalView
			modalVisible={modalVisible}
			setModalVisible={setModalVisible}
			ModalViewRender={() => (
				<>
					<Sequence
						item={item}
						color={'#00B992'}
						currentNumber={currentNumber}
					/>
					<View style={styles.blankView} />
					{mode === 'initial' && (
						<>
							<Text style={styles.titleText}>이름을 입력해주세요</Text>
							<View style={styles.blankView} />
							<View style={[styles.textInputView]}>
								<TextInput
									style={styles.textInput}
									value={name}
									onChangeText={(name) => setName((text) => name)}
									placeholder=""
									placeholderTextColor={Colors.grey600}
									autoFocus={true}
								/>
							</View>
							<View style={styles.buttonOverLine} />
							<Button
								buttonNumber={1}
								buttonText="다음"
								onPressWithParam={() => onPressNext('carNum')}
								pressParam="carNum"
							/>
						</>
					)}
					{mode === 'carNum' && (
						<>
							<Text style={styles.titleText}>
								차량 번호를 띄어쓰기 없이 입력해주세요
							</Text>
							<View style={styles.blankView} />
							<Text style={[styles.subText, { color: Colors.grey600 }]}>
								예시 : 11가1111
							</Text>
							<View style={styles.blankView} />
							<View style={[styles.textInputView]}>
								<TextInput
									style={styles.textInput}
									value={carNum}
									onChangeText={(carNum) => setCarNum((text) => carNum)}
									placeholder="11가1111"
									placeholderTextColor={Colors.grey600}
									autoFocus={true}
								/>
							</View>
							{/* <TouchableOpacity
								onPress={() => setCheckBox(!checkBox)}
								style={{
									flexDirection: 'row',
									justifyContent: 'center',
									alignContent: 'center',
									alignItems: 'center',
								}}
							>
								{checkBox ? (
									<Material name={'check-box-outline-blank'} size={20} />
								) : (
									<Material name={'check-box'} size={20} />
								)}
								<Text style={[styles.touchText, { marginLeft: 0 }]}>
									차량 번호 나중에 입력하기
								</Text>
							</TouchableOpacity> */}
							<View style={styles.buttonOverLine} />
							<Button
								buttonNumber={2}
								secondButtonText="다음"
								buttonText="이전"
								onPressWithParam={() => onPressNext('initial')}
								pressParam="initial"
								secondOnPressWithParam={() => onPressPrev('loading')}
								secondParam="loading"
							/>
						</>
					)}
					{mode === 'loading' && (
						<>
							<ActivityIndicator color="#00B992" size={30} />
							<View style={styles.blankView} />
							<Text style={[styles.titleText, { color: Colors.grey600 }]}>
								로딩중
							</Text>
						</>
					)}
					{mode === 'finish' && (
						<>
							<View style={styles.blankView} />
							<Text style={[styles.titleText, { fontSize: 17 }]}>
								🎉 회원가입이 완료 되었습니다
							</Text>
							<View style={styles.blankView} />
							<View style={styles.buttonOverLine} />
							<Button
								buttonNumber={1}
								buttonText="확인"
								onPressFunction={onPressClose}
							/>
						</>
					)}
				</>
			)}
		/>
	);
}

const styles = StyleSheet.create({
	SafeAeaView: { flex: 1 },
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
		alignSelf: 'center',
		fontFamily: 'NanumSquareBold',
		letterSpacing: -1,
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
		textAlign: 'left',
		fontFamily: 'NanumSquareR',
		letterSpacing: -1,
		marginLeft: screen.width * 0.15,
	},
});
