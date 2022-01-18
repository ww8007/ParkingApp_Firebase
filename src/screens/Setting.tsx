import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationHeader, SafeAreaView } from '../theme';
import { StatusBar } from 'expo-status-bar';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Colors } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { getCar, getLogin } from '../store/login';
import { getCookie } from '../lib/api/login';
import Material from 'react-native-vector-icons/MaterialCommunityIcons';
import Font5Icon from 'react-native-vector-icons/FontAwesome5';
import Ionic from 'react-native-vector-icons/Ionicons';
import { RootState } from '../store';
import { ModalSetting } from '../components';

const mainColor = '#00B992';

export function Setting() {
	const { name, carNum } = useSelector(({ login }: RootState) => ({
		name: login.name,
		carNum: login.carNum,
	}));
	const dispatch = useDispatch();
	const [modalVisible, setModalVisible] = useState(false);
	// useEffect(() => {
	// 	getCookie();
	// }, []);
	// const onPressSubmit = useCallback(() => {
	// 	dispatch(getCar());
	// }, []);
	// const onPressLogin = useCallback(() => {
	// 	dispatch(getLogin());
	// }, []);

	return (
		<SafeAreaView style={{ backgroundColor: '#00B992' }}>
			<StatusBar style={'light'} backgroundColor="#00B992" />
			<View style={styles.view}>
				<NavigationHeader title="설정" />

				<View style={styles.mainView}>
					<Text style={styles.titleText}>계정 정보</Text>
					<View style={styles.blankView} />
					<>
						<View style={styles.rowView}>
							<View style={styles.iconStyle}>
								<Font5Icon name="user-alt" size={21} color={mainColor} />
							</View>
							<Text style={styles.touchText}> 이름 : {name}</Text>
						</View>
					</>
					<View style={styles.blankView} />
					<>
						<View style={styles.rowView}>
							<View style={[styles.iconStyle]}>
								<Ionic name="car" size={28} color={mainColor} />
							</View>
							<Text style={[styles.touchText, { marginLeft: 8 }]}>
								차량 번호 : {carNum}
							</Text>
						</View>
					</>
					<View style={styles.blankGreyView} />
					<Text style={styles.titleText}>계정 정보 변경</Text>
					<View style={styles.blankView} />

					<TouchableOpacity
						activeOpacity={0.5}
						onPress={() => setModalVisible(true)}
					>
						<View style={styles.rowView}>
							<View style={styles.iconStyle}>
								<Material name="clock" size={27} color={mainColor} />
							</View>
							<Text style={styles.touchText}>차량 번호 수정</Text>
							<View style={styles.iconView}>
								<Font5Icon
									name="angle-right"
									size={19}
									color={Colors.black}
									style={styles.rightIconStyle}
								/>
							</View>
						</View>
					</TouchableOpacity>
					<View style={styles.blankView} />
				</View>
				<ModalSetting
					modalVisible={modalVisible}
					setModalVisible={setModalVisible}
					currentCarNum={carNum}
				/>
			</View>
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
		backgroundColor: '#00B992',
	},
	titleText: {
		fontSize: 20,
		alignSelf: 'flex-start',
		fontFamily: 'NanumSquareBold',
		marginLeft: '10%',
		marginTop: 20,
		letterSpacing: -1,
	},
	rowView: {
		flexDirection: 'row',
		alignItems: 'center',
		// justifyContent: 'flex-start',

		height: 30,
		// backgroundColor: Colors.grey400,
		padding: 5,
	},
	iconStyle: {
		height: 30,
		width: 30,

		alignSelf: 'center',
		justifyContent: 'center',
		alignItems: 'center',
		marginLeft: '9%',
	},
	touchText: {
		fontSize: 14,
		textAlign: 'center',
		fontFamily: 'NanumSquareR',
		letterSpacing: -1,
		marginLeft: 5,
	},
	blankView: {
		height: 20,
	},
	iconView: {
		alignItems: 'flex-end',
		flex: 1.5,
	},
	rightIconStyle: {
		marginRight: '15%',
	},
	blankGreyView: {
		height: 20,
		backgroundColor: Colors.grey200,
		marginTop: 20,
	},
});
