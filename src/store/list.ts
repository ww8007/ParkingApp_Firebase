import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { list, addListType } from '../interface/list';
const initialState: list = {
	timeList: [],
	idxNumber: 0,
};

const listSlice = createSlice({
	name: 'list',
	initialState,
	reducers: {
		addList: (state, action: PayloadAction<string>) => {
			const data = {
				time: action.payload,
				status: 'send',
				id: state.idxNumber,
			};
			state.idxNumber = state.idxNumber + 1;
			state.timeList = [data, ...state.timeList];
		},
		removeList: (state, action: PayloadAction<number>) => {
			console.log(action.payload);
			console.log(state.timeList);
			state.timeList = state.timeList.filter(
				(item) => item.id !== action.payload
			);
		},
	},
});

export const { addList, removeList } = listSlice.actions;

export default listSlice.reducer;
