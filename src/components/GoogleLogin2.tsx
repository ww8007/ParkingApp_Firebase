// import React, { useEffect, useState } from 'react';
// import {
// 	GoogleSignin,
// 	GoogleSigninButton,
// 	statusCodes,
// } from '@react-native-google-signin/google-signin';
// // import statusCodes along with GoogleSignin

// // Somewhere in your code
// const onPressSignIn = async (setInfo: any) => {
// 	try {
// 		console.log('hihih');
// 		await GoogleSignin.hasPlayServices();
// 		const userInfo = await GoogleSignin.signIn();
// 		if (userInfo) {
// 			console.log(userInfo);
// 			setInfo(userInfo.user.email);
// 			console.log(userInfo.user.email);
// 		}
// 		console.log('hihi');
// 	} catch (error: any) {
// 		console.warn(error);
// 	}
// };
// export function GoogleLogin2() {
// 	const [googleUserInfo, setInfo] = useState({});
// 	useEffect(() => {
// 		console.log(googleUserInfo);
// 		return () => {};
// 	}, [googleUserInfo]);
// 	return (
// 		<GoogleSigninButton
// 			style={{ width: 240, height: 60 }}
// 			size={GoogleSigninButton.Size.Wide}
// 			color={GoogleSigninButton.Color.Light}
// 			onPress={() => onPressSignIn(setInfo)}
// 		/>
// 	);
// }
