import React, { useCallback, useEffect, useState } from 'react';

import * as AppleAuthentication from 'expo-apple-authentication';

import {
	OAuthProvider,
	getAuth,
	signInWithCredential,
	UserCredential,
} from 'firebase/auth';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import * as Crypto from 'expo-crypto';
import { useDispatch } from 'react-redux';
import { setUid } from '../store/login';
import { getFirestore, setDoc, doc, Firestore } from 'firebase/firestore';
import { ANDROID_KEY, IOS_KEY, AUTH_DOMAIN, FIREBASE_URL } from '@env';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, set } from 'firebase/database';

interface functionProps {
	setLoginUid: React.Dispatch<string>;
	setEmail: React.Dispatch<string>;
}

const signInWithApple = ({ setLoginUid, setEmail }: functionProps) => {
	const nonce = Math.random().toString(36).substring(2, 10);
	const auth = getAuth();
	return Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, nonce)
		.then((hashedNonce) =>
			AppleAuthentication.signInAsync({
				requestedScopes: [
					AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
					AppleAuthentication.AppleAuthenticationScope.EMAIL,
				],
				nonce: hashedNonce,
			})
		)
		.then((appleCredential) => {
			const { identityToken } = appleCredential;
			const provider = new OAuthProvider('apple.com');
			const credential = provider.credential({
				idToken: identityToken!,
				rawNonce: nonce,
			});
			let uid;
			return signInWithCredential(auth, credential).then((data) => {
				setLoginUid(data.user.uid);
				data.user.email && setEmail(data.user.email);
			});

			// Successful sign in is handled by firebase.auth().onAuthStateChanged
		})
		.catch((error) => {
			// ...
		});
};

export function AppleLogin() {
	const dispatch = useDispatch();
	const [uid, setLoginUid] = useState('');
	const [email, setEmail] = useState('');
	const [fireStore, setFireStore] = useState(getFirestore());

	useEffect(() => {
		if (uid.length) {
			dispatch(setUid(uid));
			const save = async () => {
				await setDoc(doc(fireStore, 'user', email), {
					uid: uid,
				});
			};
			save();
		}
	}, [uid, fireStore]);

	const getUser = async () => {
		const fireStore = getFirestore();
		const querySnapshot = await getDocs(collection(fireStore, 'users'));
		querySnapshot.forEach((doc) => {
			console.log(`${doc.id} => ${doc.data()}`);
		});
	};

	return (
		<AppleAuthentication.AppleAuthenticationButton
			buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
			buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
			cornerRadius={5}
			style={{ width: 200, height: 44 }}
			onPress={() => signInWithApple({ setEmail, setLoginUid })}
		/>
	);
}
