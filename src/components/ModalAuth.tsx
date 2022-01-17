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
import { Auth, signInWithEmailAndPassword } from 'firebase/auth';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import { setUid } from '../store/login';
import { ModalRegister } from './ModalRegister';
import { useSetFireStore } from '../hooks';

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
	const [mode, setMode] = useState(false);

	// Set an initializing state whilst Firebase connects

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const dispatch = useDispatch();
	const auth = getAuth();
	const register = async () =>
		createUserWithEmailAndPassword(auth, email, password)
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
						udi: uid,
					};
					useSetFireStore(data);
				}
				// ...
			})
			.catch((error) => {
				const errorCode = error.code;
				const errorMessage = error.message;
				console.warn(errorMessage);
				// ..
			});
	const login = async () =>
		signInWithEmailAndPassword(auth, email, password)
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
						udi: uid,
					};
					useSetFireStore(data);
				}
				// ...
			})
			.catch((error) => {
				const errorCode = error.code;
				const errorMessage = error.message;
				console.warn(errorCode);
				if (errorCode === 'auth/wrong-password') {
					Alert.alert('아이디/비밀번호 오류');
				}
			});
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
		paddingLeft: 5,
		paddingRight: 5,
		paddingTop: 5,
	},
	buttonText: {
		borderBottomWidth: 0.5,

		fontSize: 12,
		marginRight: 10,
		fontFamily: 'NanumSquareR',
		letterSpacing: -1,
	},
	loginText: {
		fontFamily: 'NanumSquareR',
		letterSpacing: -1,
		fontSize: 14,
		width: '100%',
		color: Colors.black,
	},
});
