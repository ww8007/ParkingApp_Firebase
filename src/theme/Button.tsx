import React from 'react';
import {
	Dimensions,
	StyleSheet,
	Text,
	TouchableHighlight,
	View,
} from 'react-native';
import { Colors } from 'react-native-paper';

const screen = Dimensions.get('screen');

interface props {
	buttonNumber: number;
	buttonText: string;
	secondButtonText?: string;
	onPressFunction?: () => void;
	secondOnPressFunction?: () => void;
	onPressWithParam?: (pressParam: any) => void;
	secondOnPressWithParam?: (secondParam: any) => void;
	pressParam?: any;
	secondParam?: any;
	buttonColor?: string;
	secondButtonColor?: string;
}

export function Button({
	buttonNumber,
	buttonText,
	secondButtonText,
	onPressFunction,
	secondOnPressFunction,
	onPressWithParam,
	secondOnPressWithParam,
	pressParam,
	secondParam,
}: props) {
	return (
		<>
			{buttonNumber === 1 && (
				<View style={styles.buttonRowView}>
					<TouchableHighlight
						activeOpacity={0.1}
						underlayColor={Colors.grey200}
						style={styles.closeButtonStyle}
						onPress={() => {
							onPressFunction && onPressFunction();
							onPressWithParam && pressParam && onPressWithParam(pressParam);
						}}
					>
						<Text style={styles.buttonText}>{buttonText}</Text>
					</TouchableHighlight>
				</View>
			)}
			{buttonNumber === 2 && (
				<View style={styles.columnView}>
					<View style={styles.buttonWithTwoView}>
						<TouchableHighlight
							activeOpacity={0.1}
							underlayColor={Colors.grey200}
							style={[
								styles.twoButtonStyle,
								{ borderBottomLeftRadius: 13, paddingLeft: '-10%' },
							]}
							onPress={() => {
								onPressFunction && onPressFunction();
								onPressWithParam && pressParam && onPressWithParam(pressParam);
							}}
						>
							<Text style={[styles.buttonText]}>{buttonText}</Text>
						</TouchableHighlight>
						<View
							style={{
								height: '100%',
								borderLeftWidth: 0.4,
							}}
						/>
						<TouchableHighlight
							activeOpacity={0.1}
							underlayColor={Colors.grey200}
							style={[styles.twoButtonStyle, { borderBottomRightRadius: 13 }]}
							onPress={() => {
								secondOnPressFunction && secondOnPressFunction();
								secondOnPressWithParam &&
									secondParam &&
									secondOnPressWithParam(secondParam);
							}}
						>
							<Text style={styles.buttonText}>{secondButtonText}</Text>
						</TouchableHighlight>
					</View>
				</View>
			)}
		</>
	);
}

const styles = StyleSheet.create({
	buttonRowView: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignContent: 'center',
		alignSelf: 'center',
		marginBottom: -20,
		width: screen.width * 0.9,
		// marginTop: 15,
	},
	buttonWithTwoView: {
		flexDirection: 'row',
		marginBottom: -20,
		marginLeft: 1,
		width: '113%',
	},
	closeButtonStyle: {
		padding: 15,
		width: '100%',
		height: '100%',
		borderBottomRightRadius: 13,
		borderBottomLeftRadius: 13,
	},
	twoButtonStyle: {
		padding: 15,
		width: '50%',
		height: '100%',
	},

	buttonText: {
		textAlign: 'center',
		fontFamily: 'NanumSquareR',
		fontSize: 14,
	},

	columnView: {
		flexDirection: 'column',
	},
});
