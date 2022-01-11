import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createAction } from 'redux-actions';
import { getCarNumber } from '../lib/api/login';
import createRequestThunk from '../lib/util/createRequestThunk';
import { AppThunk } from './store';
import * as api from '../lib/api/login';

const initialState = {
	data: {},
};

const GET_CAR = 'login/GET_CAR';

export const getCar = createAction(GET_CAR, (data: any) => data);

const getCarThunk = createRequestThunk(GET_CAR, api.getCarNumber);

export function loginThunk() {}

const loginSlice = createSlice({
	name: 'login',
	initialState,
	reducers: {
		GET_CAR_SUCCESS: (state, action: PayloadAction<any>) => {
			state.data = action.payload;
		},
		GET_CAR_FAILURE: (state, action: PayloadAction<any>) => {
			state.data = action.payload;
		},
	},
});

export const { GET_CAR_FAILURE, GET_CAR_SUCCESS } = loginSlice.actions;

export default loginSlice.reducer;

// export const getCarNumber
