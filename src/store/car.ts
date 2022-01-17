import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createAction } from 'redux-actions';

import createRequestThunk from '../lib/util/createRequestThunk';
import { AppThunk } from './store';
import * as api from '../lib/api/car';
import createRequestSaga from '../lib/util/createRequestSaga';
import { takeLatest } from 'redux-saga/effects';
import type { car, postDiscountAPI } from '../interface/car';

const GET_CARLIST = 'car/GET_CARLIST';
const GET_CARINFO = 'car/GET_CARINFO';
const GET_LOGIN = 'car/GET_LOGIN';
const INIT_LOGIN = 'car/INIT_LOGIN';
const POST_DISCOUNT = 'car/POST_DISCOUNT';

export const getCarList = createAction(GET_CARLIST, (data: string) => data);
export const getCarInfo = createAction(GET_CARINFO, (data: string) => data);
export const getLogin = createAction(GET_LOGIN);
export const initLogin = createAction(INIT_LOGIN);
export const postDiscount = createAction(
	POST_DISCOUNT,
	(data: postDiscountAPI) => data
);

const getCarListSaga = createRequestSaga(GET_CARLIST, api.getCarList);
const getCarInfoSaga = createRequestSaga(GET_CARINFO, api.getCarInfo);
const getLoginSaga = createRequestSaga(GET_LOGIN, api.getLogin);
const initLoginSaga = createRequestSaga(INIT_LOGIN, api.initLogin);
const postDiscountSaga = createRequestSaga(POST_DISCOUNT, api.postDiscount);

export function* carSaga() {
	yield takeLatest(GET_CARINFO, getCarInfoSaga);
	yield takeLatest(GET_CARLIST, getCarListSaga);
	yield takeLatest(GET_LOGIN, getLoginSaga);
	yield takeLatest(INIT_LOGIN, initLoginSaga);
	yield takeLatest(POST_DISCOUNT, postDiscountSaga);
}

interface carType {
	carNo: string;
}

const initialState: car = {
	error: '',
	carList: '',
	carInfo: {
		differentTime: '',
		entryDateString: '',
		entryDate: '',
		id: '',
	},
	loginInfo: '',
	carNum: '',
	isCarGetSuccess: false,
	isPostSuccess: false,
};

const carSlice = createSlice({
	name: 'car',
	initialState,
	reducers: {
		GET_CARINFO_SUCCESS: (state, action: PayloadAction<any>) => {
			state.carList = action.payload;
			const { entryDate, id, entryDateToString, differentTime } =
				state.carList.parkEntry;
		},
		GET_CARINFO_FAILURE: (state, action: PayloadAction<any>) => {
			state.error = action.payload;
		},
		GET_CARLIST_SUCCESS: (state, action: PayloadAction<any>) => {
			state.carList = action.payload;
			const find = state.carList.find(
				(car: carType) => car.carNo === state.carNum
			);

			const { entryDate, id, entryDateToString, differentTime } = find;
			if (entryDate && id) {
				state.carInfo.differentTime = differentTime;
				state.carInfo.id = id;
				state.carInfo.entryDate = entryDate;
				state.carInfo.entryDateString = entryDateToString;
			}
			state.isCarGetSuccess = true;
		},
		GET_CARLIST_FAILURE: (state, action: PayloadAction<any>) => {
			state.error = action.payload;
		},
		INIT_LOGIN_SUCCESS: (state, action: PayloadAction<any>) => {
			// state.carList = action.payload;
		},
		INIT_LOGIN_FAILURE: (state, action: PayloadAction<any>) => {
			state.error = action.payload;
		},
		POST_DISCOUNT_SUCCESS: (state, action: PayloadAction<any>) => {
			console.log(action.payload);
			state.isPostSuccess = true;
		},
		POST_DISCOUNT_FAILURE: (state, action: PayloadAction<any>) => {
			state.error = action.payload;
			state.isPostSuccess = false;
		},
		GET_LOGIN_SUCCESS: (state, action: PayloadAction<any>) => {
			state.loginInfo = true;
		},
		GET_LOGIN_FAILURE: (state, action: PayloadAction<any>) => {
			state.error = action.payload;
		},
		searchFromList: (state, action: PayloadAction<string>) => {},
		setCarNum: (state, action: PayloadAction<string>) => {
			state.carNum = action.payload;
			state.isCarGetSuccess = false;
		},
		setCarId: (state, action: PayloadAction<string>) => {
			state.carInfo.id = action.payload;
		},
	},
});

export const { setCarNum, setCarId } = carSlice.actions;

export default carSlice.reducer;

// export const getCarNumber
