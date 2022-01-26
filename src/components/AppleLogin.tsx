// import React, { useCallback, useEffect, useState } from 'react';

// // import * as AppleAuthentication from 'expo-apple-authentication';

// // import {
// // 	OAuthProvider,
// // 	getAuth,
// // 	signInWithCredential,
// // 	UserCredential,
// // } from 'firebase/auth';
// // import { collection, addDoc, getDocs } from 'firebase/firestore';
// import * as Crypto from 'expo-crypto';
// import { useDispatch } from 'react-redux';
// import { setUid } from '../store/login';
// // import { getFirestore, setDoc, doc, Firestore } from 'firebase/firestore';

// // import { initializeApp } from 'firebase/app';
// // import { getDatabase, ref, onValue, set } from 'firebase/database';
// import { ModalRegister } from './ModalRegister';
// import auth from '@react-native-firebase/auth';
// interface functionProps {
// 	setLoginUid: React.Dispatch<React.SetStateAction<string>>;
// 	setEmail: React.Dispatch<React.SetStateAction<string>>;
// 	onSetUserInfo: (uid: any, email: any) => void;
// 	setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
// }

// const signInWithApple = ({
// 	setLoginUid,
// 	setEmail,
// 	onSetUserInfo,
// 	setModalVisible,
// }: functionProps) => {
// 	const nonce = Math.random().toString(36).substring(2, 10);

// 	return Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, nonce)
// 		.then((hashedNonce) =>
// 			AppleAuthentication.signInAsync({
// 				requestedScopes: [
// 					AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
// 					AppleAuthentication.AppleAuthenticationScope.EMAIL,
// 				],
// 				nonce: hashedNonce,
// 			})
// 		)
// 		.then((appleCredential) => {
// 			const { identityToken } = appleCredential;

// 			const credential = auth.AppleAuthProvider.credential(
// 				identityToken,
// 				nonce
// 			);

// 			return auth()
// 				.signInWithCredential(credential)
// 				.then((data) => {
// 					const { uid, email } = data.user;
// 					setLoginUid(uid);
// 					email && setEmail(email);
// 					onSetUserInfo(uid, email);
// 					setModalVisible(true);
// 				});

// 			// Successful sign in is handled by firebase.auth().onAuthStateChanged
// 		})
// 		.catch((error) => {
// 			// ...
// 		});
// };

// export function AppleLogin() {
// 	const dispatch = useDispatch();
// 	const [uid, setLoginUid] = useState('');
// 	const [email, setEmail] = useState('');

// 	const [modalVisible, setModalVisible] = useState(false);
// 	const onSetUserInfo = useCallback((uid, email) => {
// 		if (uid.length && email.length) {
// 			dispatch(setUid({ uid, email }));
// 		}
// 	}, []);

// 	return (
// 		<>
// 			{/* <AppleAuthentication.AppleAuthenticationButton
// 				buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
// 				buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.WHITE}
// 				cornerRadius={8}
// 				style={{ width: 250, height: 44 }}
// 				onPress={() =>
// 					signInWithApple({
// 						setEmail,
// 						setLoginUid,
// 						onSetUserInfo,
// 						setModalVisible,
// 					})
// 				}
// 			/> */}
// 			<ModalRegister
// 				modalVisible={modalVisible}
// 				setModalVisible={setModalVisible}
// 			/>
// 		</>
// 	);
// }
