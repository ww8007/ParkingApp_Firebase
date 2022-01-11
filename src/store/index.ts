import { combineReducers } from 'redux';

import { persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import login from './login';

// import storageSession from 'redux-persist/lib/storage/session';
const persistConfig = {
	key: 'root',
	storage: AsyncStorage,
	blacklist: ['login'],
};
const rootReducer = combineReducers({ login });
export default persistReducer(persistConfig, rootReducer);
export type RootState = ReturnType<typeof rootReducer>;
