import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Colors } from 'react-native-paper';

interface props {
	currentNumber: number;
	item: number[];
	color: string;
}

export function Sequence({ currentNumber, item, color }: props) {
	return (
		<View style={styles.rowView}>
			{item.map((c, idx) => (
				<View style={styles.rowView} key={idx}>
					{idx !== item.length - 1 && (
						<View style={styles.rowView}>
							<View
								style={[
									styles.circle,
									{
										backgroundColor:
											idx === currentNumber ? color : Colors.white,
									},
								]}
							/>
							<View style={styles.rowLine} />
						</View>
					)}

					{idx === item.length - 1 && (
						<View
							style={[
								styles.circle,
								{
									backgroundColor: idx === currentNumber ? color : Colors.white,
								},
							]}
						/>
					)}
				</View>
			))}
		</View>
	);
}

const styles = StyleSheet.create({
	rowView: {
		flexDirection: 'row',
		justifyContent: 'center',
	},
	circle: {
		width: 10 * 2,
		height: 10 * 2,
		borderRadius: 10,

		borderWidth: 3,
		// marginLeft: 15,
		// marginRight: 15,
	},
	rowLine: {
		width: 20,
		height: 1,
		backgroundColor: Colors.black,
		alignSelf: 'center',
	},
});
