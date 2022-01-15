import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createAction } from 'redux-actions';
import { getCarNumber } from '../lib/api/login';
import createRequestThunk from '../lib/util/createRequestThunk';
import { AppThunk } from './store';
import * as api from '../lib/api/login';
import createRequestSaga from '../lib/util/createRequestSaga';
import { takeLatest } from 'redux-saga/effects';
import type { login, personalInfo, serverInfo } from '../interface/login';
import car from './car';
const initialState: login = {
	data: {},
	error: '',
	uid: '',
	email: '',
	carNum: '',
	name: '',
	pushToken: '',
};

const GET_CAR = 'login/GET_CAR';
const GET_LOGIN = 'login/GET_LOGIN';

export const getCar = createAction(GET_CAR);
export const getLogin = createAction(GET_LOGIN);

const getCarSaga = createRequestSaga(GET_CAR, api.getCarNumber);
const getLoginSaga = createRequestSaga(GET_LOGIN, api.getLogin);

export function* loginSaga() {
	yield takeLatest(GET_CAR, getCarSaga);
	yield takeLatest(GET_LOGIN, getLoginSaga);
}

const loginSlice = createSlice({
	name: 'login',
	initialState,
	reducers: {
		GET_CAR_SUCCESS: (state, action: PayloadAction<any>) => {
			state.data = action.payload;
			console.log(action.payload);
		},
		GET_CAR_FAILURE: (state, action: PayloadAction<any>) => {
			state.error = action.payload;
		},
		GET_LOGIN_SUCCESS: (state, action: PayloadAction<any>) => {
			state.data = action.payload;
		},
		GET_LOGIN_FAILURE: (state, action: PayloadAction<any>) => {
			state.error = action.payload;
		},
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
	},
});

export const { setUid, setUserInfo, setPushToken } = loginSlice.actions;

export default loginSlice.reducer;

// export const getCarNumber
