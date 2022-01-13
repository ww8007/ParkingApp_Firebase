import { combineReducers } from 'redux';
import { all } from 'redux-saga/effects';
import { persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import login, { loginSaga } from './login';
import car, { carSaga } from './car';
import list from './list';
// import storageSession from 'redux-persist/lib/storage/session';
const persistConfig = {
	key: 'root',
	storage: AsyncStorage,
	blacklist: ['car'],
};
const rootReducer = combineReducers({ login, car, list });
export default persistReducer(persistConfig, rootReducer);
export type RootState = ReturnType<typeof rootReducer>;

export function* rootSaga() {
	yield all([loginSaga(), carSaga()]);
}
