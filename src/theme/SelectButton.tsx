import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { Colors } from 'react-native-paper';
import Material from 'react-native-vector-icons/MaterialIcons';

const subColor = '#00B992';

interface props {
	checkBox: string;
	onPressCheckBox: (check: any, hour: string) => void;
	text: string;
	checkNum: string;
	hour: string;
	isCanExtraRequest: boolean;
	isCanRequest: boolean;
}

export function SelectButton({
	checkBox,
	onPressCheckBox,
	text,
	checkNum,
	hour,
	isCanExtraRequest,
	isCanRequest,
}: props) {
	return (
		<TouchableOpacity
			onPress={() => onPressCheckBox(checkNum, hour)}
			style={{
				flexDirection: 'row',
				marginTop: 20,
				alignSelf: 'center',
				width: '85%',
				height: 35,
				backgroundColor:
					checkNum === '4'
						? isCanExtraRequest
							? subColor
							: Colors.grey500
						: isCanRequest
						? subColor
						: Colors.grey500,
			}}
		>
			<Text style={[styles.subText, { alignSelf: 'center' }]}>{text}</Text>
			<View style={{ position: 'absolute', right: 10, top: 6 }}>
				{checkBox === checkNum ? (
					<Material color={Colors.white} name={'check-box'} size={22} />
				) : (
					<Material
						color={Colors.white}
						name={'check-box-outline-blank'}
						size={22}
					/>
				)}
			</View>
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	subText: {
		textAlign: 'center',
		alignSelf: 'flex-start',
		fontFamily: 'NanumSquareBold',
		marginLeft: '7.5%',
		letterSpacing: -1,
		color: Colors.grey100,
		fontSize: 14,
	},
});
