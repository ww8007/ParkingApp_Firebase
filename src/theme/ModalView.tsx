import React, { useCallback, useState, useEffect, ReactNode } from 'react';
import {
	Alert,
	Modal,
	StyleSheet,
	Text,
	TouchableHighlight,
	View,
	ActivityIndicator,
	Dimensions,
	ScrollView,
} from 'react-native';
import { Colors } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import Font5Icon from 'react-native-vector-icons/FontAwesome5';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { Button } from '../theme/Button';

import { RootState } from '../store';
import { CloseButton } from '../theme';

const screen = Dimensions.get('screen');

interface props {
	modalVisible?: boolean;
	setModalVisible?: React.Dispatch<React.SetStateAction<boolean>>;
	ModalViewRender: () => ReactNode;
}

export function ModalView({
	modalVisible,
	setModalVisible,
	ModalViewRender,
}: props) {
	const dispatch = useDispatch();
	const [mode, setMode] = useState('initial');

	const [check, setCheck] = useState(0);

	useEffect(() => {
		if (mode == 'loading') {
			setTimeout(() => {
				setMode('success');
			}, 1000);
		}
	}, [mode]);

	const onPressCloseBtn = useCallback(() => {
		setModalVisible && setModalVisible(false);
		setMode('initial');
	}, []);

	const onPressTimeText = useCallback((idx: number) => {}, []);

	return (
		<Modal
			animationType="fade"
			transparent={true}
			visible={modalVisible}
			onRequestClose={() => {
				Alert.alert('Modal has been closed.');
			}}
		>
			<View style={styles.centeredView}>
				<View style={styles.modalView}>
					<CloseButton closeBtn={onPressCloseBtn} />
					<>{ModalViewRender()}</>
				</View>
			</View>
		</Modal>
		// </AutoFocusProvider>
	);
}

const styles = StyleSheet.create({
	centeredView: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: -20,
	},
	rowView: {
		flexDirection: 'row',
		width: screen.width * 0.52,

		justifyContent: 'flex-start',
		alignItems: 'center',
	},
	columnView: {
		flexDirection: 'column',

		// borderRadius: 13,

		margin: 20,
	},
	backgroundView: {
		borderRadius: 13,
		backgroundColor: Colors.grey100,
	},
	iconView: {
		alignItems: 'flex-end',
		flex: 1,
	},
	modalView: {
		// margin: 10,
		marginBottom: 60,
		backgroundColor: Colors.white,
		borderRadius: 13,
		padding: 20,
		alignItems: 'center',
		shadowColor: 'black',
		elevation: 10,
		shadowOffset: {
			width: 1,
			height: 1,
		},
		shadowOpacity: 0.21,
		shadowRadius: 1.0,
		width: screen.width * 0.9,
		maxHeight: screen.height * 0.7,
	},
	touchText: {
		fontSize: 13,
		textAlign: 'left',
		fontFamily: 'NanumSquareR',
		letterSpacing: -1,
		justifyContent: 'center',
	},
	titleText: {
		fontSize: 20,
		textAlign: 'left',
		justifyContent: 'flex-start',
		alignSelf: 'flex-start',
		fontFamily: 'NanumSquareBold',
		letterSpacing: -1,
		marginLeft: '1%',
	},
	blankView: {
		height: 10,
	},
	textView: {
		width: '100%',
	},
	touchButtonStyle: {
		padding: 20,
		borderRadius: 13,
		// alignItems: 'center',
		// alignContent: 'center',
		// alignSelf: 'center',
		justifyContent: 'center',
		alignItems: 'center',
		alignContent: 'center',
		alignSelf: 'center',
	},
	buttonOverLine: {
		borderWidth: 0.4,
		width: screen.width * 0.9,
		marginTop: 20,
		borderColor: Colors.black,
	},
	rowLine: {
		borderTopWidth: 0.4,
		width: '113%',
		marginTop: 15,
	},
});
