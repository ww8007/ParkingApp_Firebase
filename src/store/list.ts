import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { list, addListType, addTimeType } from '../interface/list';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import { Alert } from 'react-native';

dayjs().locale('ko');

const initialState: list = {
	timeList: [],
	idxNumber: 0,
	today: '',
	isCanRequest: true,
	isCanSubmit: false,
};

const listSlice = createSlice({
	name: 'list',
	initialState,
	reducers: {
		setToday: (state, action: PayloadAction<string>) => {
			state.today = action.payload;
		},
		addList: (state, action: PayloadAction<addTimeType>) => {
			if (state.isCanRequest === true) {
				const data = {
					time: action.payload.time,
					status: 'send',
					id: state.idxNumber,
					day: action.payload.day,
				};
				state.idxNumber = state.idxNumber + 1;
				state.timeList = [data, ...state.timeList];
				state.isCanSubmit = true;
			} else {
				Alert.alert('알림', '하루에 한 번만 신청이 가능 합니다');
				state.isCanSubmit = false;
			}

			state.isCanRequest = false;
		},
		removeList: (state, action: PayloadAction<number>) => {
			const find = state.timeList.find((item) => item.day === state.today);
			if (find) {
				state.isCanRequest = true;
				state.isCanSubmit = false;
			}
			state.timeList = state.timeList.filter(
				(item) => item.id !== action.payload
			);
		},
		updateList: (state, action: PayloadAction<string>) => {
			const find = state.timeList.find((item) => item.day === state.today);
			if (find) {
				find.status = action.payload;
			}
		},
	},
});

export const { addList, removeList, setToday, updateList } = listSlice.actions;

export default listSlice.reducer;
