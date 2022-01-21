import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import type { login, personalInfo, serverInfo } from '../interface/login';
const initialState: login = {
	data: {},
	error: '',
	uid: '',
	email: '',
	carNum: '',
	name: '',
	pushToken: '',
	isSuperUser: false,
	superUserTokens: [],
};

const loginSlice = createSlice({
	name: 'login',
	initialState,
	reducers: {
		setUid: (state, action: PayloadAction<serverInfo>) => {
			const { uid, email } = action.payload;
			state.uid = uid;
			state.email = email;
		},
		setUserInfo: (state, action: PayloadAction<personalInfo>) => {
			const { name, carNum } = action.payload;
			state.name = name;
			state.carNum = carNum;
		},
		setPushToken: (state, action: PayloadAction<string>) => {
			state.pushToken = action.payload;
		},
		setSuperUserTokens: (state, action: PayloadAction<string[]>) => {
			state.superUserTokens = action.payload;
		},
		setAdmin: (state, action: PayloadAction<boolean>) => {
			state.isSuperUser = action.payload;
		},
	},
});

export const {
	setUid,
	setUserInfo,
	setPushToken,
	setSuperUserTokens,
	setAdmin,
} = loginSlice.actions;

export default loginSlice.reducer;

// export const getCarNumber
