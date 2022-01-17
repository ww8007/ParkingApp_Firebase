import React, { useState, useCallback, useEffect, useMemo } from 'react';
import {
	Animated,
	Platform,
	StyleSheet,
	View,
	Text,
	ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from '../theme';
// import { SocialWebviewModal } from './Login/SocialWebviewModal';
import { LinearGradient } from 'expo-linear-gradient';
// import {
// 	SafeAreaView,
// 	TouchableView,
// 	MaterialCommunityIcon as Icon,
// } from '../theme/navigation';
import { getDatabase, ref, onValue, set } from 'firebase/database';
import { Colors } from 'react-native-paper';
import { RootState } from '../store';
import { useDispatch, useSelector } from 'react-redux';

import { useAnimatedValues, useLayout, useToggle } from '../hooks';
import { interpolate } from '../lib/util/interpolate';
import { TouchableOpacity } from 'react-native';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import { AppleLogin, GoogleLogin2, ModalAuth } from '../components';
import { ModalRegister } from '../components/ModalRegister';

dayjs.locale('ko');
// import auth from '@react-native-firebase/auth';
// import { GoogleSignin } from '@react-native-google-signin/google-signin';

export function Login() {
	const { carNum } = useSelector(({ login }: RootState) => ({
		carNum: login.carNum,
	}));
	const [modalVisible, setModalVisible] = useState(false);
	const [socialModalVisible, setSocialModalVisible] = useState(false);
	const [source, setSource] = useState('');
	const [registerVisible, setRegister] = useState(false);
	const navigation = useNavigation();
	const AnimatedText = Animated.createAnimatedComponent(Text);
	const [started, toggleStarted] = useToggle();

	const Title = useMemo(() => ['JJ ', '탁구장'], []);
	const animValues = useAnimatedValues(Title.length);
	const [layout, setLayout] = useLayout();

	const [loggedIn, setLoggedIn] = useState(false);

	const startAnimations = useMemo(
		() =>
			Title.map((notUsed, index) =>
				Animated.spring(animValues[index], {
					useNativeDriver: true,
					toValue: 1,
				})
			),
		[]
	);
	useEffect(() => {
		setTimeout(() => {
			if (carNum) {
				navigation.navigate('TabNavigator');
			}
		}, 1000);
	}, [carNum]);
	const onPressGoHome = useCallback(() => {
		navigation.navigate('TabNavigator');
	}, []);

	// const endAnimations = useMemo(
	// 	() =>
	// 		Title.map((notUsed, index) =>
	// 			Animated.spring(animValues[index], {
	// 				useNativeDriver: true,
	// 				toValue: 0,
	// 			})
	// 		),
	// 	[]
	// );
	const appLoading = useCallback(() => {
		if (Platform.OS === 'ios')
			Animated.stagger(600, [...startAnimations]).start(toggleStarted);
		else Animated.sequence([...startAnimations]).start(toggleStarted);
	}, [started]);

	const icons = useMemo(
		() =>
			Title.map((t, index) => {
				const numberOfText = Title.length;
				const animValue = animValues[index];
				const transform = {
					transform: [
						{
							translateY: interpolate(animValue, [-400, 0]),
						},
						// { rotate: interpolate(animValue, ['0deg', '360deg']) },
					],
				};
				return (
					<AnimatedText key={index} style={[transform, styles.text]}>
						{t}
					</AnimatedText>
				);
			}),
		[layout.height]
	);
	useEffect(() => appLoading(), []);

	return (
		<LinearGradient
			colors={['#00B992', '#00B992']}
			style={{ flex: 1 }}
			end={{ x: 0.95, y: 0.95 }}
			start={{ x: 0.01, y: 0.01 }}
		>
			<SafeAreaView style={{ padding: 0, margin: 0 }}>
				<ScrollView style={[{ margin: 0, padding: 0 }]}>
					<View style={styles.view}>
						<TouchableOpacity style={{ marginTop: '60%' }} onPress={appLoading}>
							<Animated.View style={[styles.textView]}>{icons}</Animated.View>
						</TouchableOpacity>

						<>
							<TouchableOpacity
								style={[
									styles.touchableView,
									{ backgroundColor: Colors.white },
								]}
								onPress={() => {
									setModalVisible(true);
									// navigation.navigate('TabNavigator');
								}}
							>
								<Text style={styles.loginText}>이메일로 로그인</Text>
							</TouchableOpacity>
							<View style={{ height: 30 }} />
							{/* <GoogleLogin /> */}
							<View style={{ height: 30 }} />
							{Platform.OS === 'ios' && <AppleLogin />}

							{/* <GoogleLogin /> */}
							{/* <GoogleLogin2 /> */}
							{/* {Platform.OS === 'ios' && <AppleLogin />} */}
							{/* <Text style={styles.buttonUnderText}>
								카카오 계정으로 간편로그인 하세요.
							</Text>
							<Text>hihi</Text> */}
							<ModalAuth
								modalVisible={modalVisible}
								setModalVisible={setModalVisible}
								registerVisible={registerVisible}
								setRegister={setRegister}
							/>
							<ModalRegister
								modalVisible={registerVisible}
								setModalVisible={setRegister}
							/>
							{/* <Text
								style={{
									position: 'absolute',
									bottom: 0,
									color: Colors.white,
									fontSize: 11,
									fontFamily: 'SCDream4',
								}}
							>
								make your plan
							</Text> */}
						</>
					</View>
				</ScrollView>
			</SafeAreaView>
		</LinearGradient>
	);
}
const styles = StyleSheet.create({
	view: {
		flex: 1,
		justifyContent: 'center',
		alignContent: 'center',
		alignItems: 'center',
	},
	text: {
		fontSize: 60,
		textAlign: 'center',
		marginBottom: 120,
		letterSpacing: -3,
		color: '#FFF',
		fontFamily: 'SCDream2',
	},
	buttonUnderText: {
		marginTop: 12,
		fontSize: 12,
		color: '#FFF',
		fontFamily: 'SCDream4',
	},
	loginText: {
		fontFamily: 'NanumSquareBold',
		fontSize: 20,
		marginLeft: 10,
		color: '#008080',
	},
	keyboardAwareFocus: {
		flex: 1,
		padding: 5,
		alignItems: 'center',
		justifyContent: 'center',
	},
	textView: {
		// marginTop: 30,
		padding: 5,
		// marginBottom: 30,
		flexDirection: 'row',
		flex: 1,
	},
	textInput: { fontSize: 24, padding: 10 },
	textInputView: { marginTop: 5, borderRadius: 10 },
	touchableView: {
		flexDirection: 'row',
		height: 45,
		borderRadius: 10,
		width: '65%',
		justifyContent: 'center',
		alignItems: 'center',
		shadowColor: 'black',
		shadowOffset: {
			width: 1,
			height: 1,
		},
		shadowOpacity: 0.21,
		shadowRadius: 1.0,
	},
});
