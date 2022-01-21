import React, { useEffect, useState } from 'react';
import {
	Alert,
	Dimensions,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from 'react-native';

import { Button, ModalView } from '../theme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import { setAdmin, setUid, setUserInfo } from '../store/login';
import { ModalRegister } from './ModalRegister';
// import { useSetFireStore } from '../hooks';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { setCarNum } from '../store/car';
import { useNavigation } from '@react-navigation/native';

const screen = Dimensions.get('screen');
const mainColor = '#00B992';
interface props {
	modalVisible: boolean;
	setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
	registerVisible: boolean;
	setRegister: React.Dispatch<React.SetStateAction<boolean>>;
}

export function ModalAuth({
	modalVisible,
	setModalVisible,
	setRegister,
}: props) {
	const [mode, setMode] = useState(true);

	// Set an initializing state whilst Firebase connects

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const dispatch = useDispatch();

	const reset = async () => {
		if (email === '') {
			Alert.alert('이메일을 입력해주세요');
		} else {
			Alert.alert('입력하신 이메일로 비밀번호 재설정 링크가 전송 되었습니다');
			auth().sendPasswordResetEmail(email);
		}
	};

	const navigation = useNavigation();
	const register = async () => {
		setEmail(email.replace(' ', ''));
		setPassword(password.replace('', ''));
		auth()
			.createUserWithEmailAndPassword(email, password)
			.then((userCredential) => {
				// Signed in
				const user = userCredential.user;
				const { email, uid } = user;
				if (email && uid) {
					dispatch(setUid({ email, uid }));
					console.log('hi');
					setModalVisible(false);
					setRegister(true);
					const data = {
						uid: uid,
						admin: false,
					};
					firestore()
						.collection('user')
						.doc(`${email}`)
						.set(data)
						.then(() => {
							console.log('User updated!');
						});
				}
				// ...
			})
			.catch((error) => {
				const errorCode = error.code;
				const errorMessage = error.message;
				console.warn(errorMessage);
				// ..
			});
	};
	const login = async () => {
		setEmail(email.replace(' ', ''));
		setPassword(password.replace('', ''));
		auth()
			.signInWithEmailAndPassword(email, password)
			.then((userCredential) => {
				// Signed in
				const user = userCredential.user;
				const { email, uid } = user;
				if (email && uid) {
					dispatch(setUid({ email, uid }));
					console.log('hi');
					setModalVisible(false);

					const data = {
						uid: uid,
						email: email,
					};
					console.log(firestore().app.auth().currentUser?.uid);
					firestore()
						.collection('user')
						.doc(`${email}`)
						.update(data)
						.then(() => {
							console.log('User updated!');
						})
						.catch((e) => console.log(e));
					firestore()
						.collection('user')
						.doc(email)
						.onSnapshot((documentSnapshot) => {
							const data = documentSnapshot.data();
							if (data) {
								const { carNum, name, admin } = data;
								console.log(carNum, 'carNum');
								dispatch(setUserInfo({ name, carNum }));
								if (admin === true) {
									dispatch(setAdmin(true));
								}
							}
							console.log('User data: ', documentSnapshot.data());
						});
					setTimeout(() => {
						navigation.navigate('TabNavigator');
					}, 500);
				}
				// ...
			})
			.catch((error) => {
				const errorCode = error.code;
				const errorMessage = error.message;
				console.warn(errorCode);
				if (error.code === 'auth/email-already-in-use') {
					Alert.alert('이미 가입된 이메일 입니다');
				}
				if (errorCode === 'auth/wrong-password') {
					Alert.alert('비밀번호 오류');
				}
				if (errorCode === 'auth/user-not-found') {
					Alert.alert('이메일이 잘못되었습니다');
				}
			});
	};
	return (
		<ModalView
			modalVisible={modalVisible}
			setModalVisible={setModalVisible}
			ModalViewRender={() => (
				<>
					<>
						<View style={styles.textInputView}>
							<Icon
								name="account"
								size={25}
								color={mainColor}
								style={{
									// marginTop: 5,
									paddingRight: 10,
								}}
							/>
							<TextInput
								value={email}
								autoCapitalize="none"
								autoCompleteType="email"
								placeholder="EMAIL"
								onChangeText={(email) => setEmail((text) => email)}
								style={styles.loginText}
								placeholderTextColor={Colors.grey600}
							/>
						</View>
					</>

					<>
						<View style={styles.textInputView}>
							<Icon
								name="lock"
								size={25}
								color={mainColor}
								style={{
									// marginTop: 5,
									paddingRight: 10,
								}}
							/>
							<TextInput
								autoCapitalize="none"
								autoCompleteType="password"
								secureTextEntry={false}
								style={styles.loginText}
								value={password}
								onChangeText={(userPw) => setPassword((text) => userPw)}
								placeholder="PASSWORD"
								placeholderTextColor={Colors.grey600}
							/>
						</View>
					</>
					<View style={styles.buttonView}>
						<TouchableOpacity onPress={() => setMode((mode) => !mode)}>
							<Text style={styles.buttonText}>
								{mode ? '로그인' : '회원가입'}
							</Text>
						</TouchableOpacity>
					</View>
					{mode === false && (
						<View style={[styles.buttonView, { marginTop: 10 }]}>
							<TouchableOpacity onPress={reset}>
								<Text style={styles.buttonText}>비밀번호 재설정</Text>
							</TouchableOpacity>
						</View>
					)}
					<View style={styles.buttonOverLine} />
					<Button
						buttonText={mode ? '회원가입' : '로그인'}
						buttonNumber={1}
						onPressFunction={mode ? register : login}
					/>
				</>
			)}
		/>
	);
}

const styles = StyleSheet.create({
	textInputView: {
		paddingBottom: 2,
		borderBottomWidth: 0.6,
		width: '60%',
		justifyContent: 'flex-start',
		textAlign: 'center',

		marginBottom: 30,
		flexDirection: 'row',
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
	blankView: {
		height: 20,
	},
	buttonOverLine: {
		borderTopWidth: 0.6,
		width: screen.width * 0.9,
		marginTop: 20,
		borderColor: Colors.black,
	},
	buttonView: {
		alignSelf: 'flex-end',

		paddingTop: 5,
		borderBottomWidth: 0.4,
	},
	buttonText: {
		fontSize: 12,
		alignSelf: 'center',
		fontFamily: 'NanumSquareR',
		letterSpacing: -1,
		textAlign: 'center',
	},
	loginText: {
		fontFamily: 'NanumSquareR',
		letterSpacing: -1,
		fontSize: 14,
		width: '100%',
		color: Colors.black,
	},
});
