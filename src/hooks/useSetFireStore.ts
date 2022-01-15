import { doc, getFirestore, updateDoc } from 'firebase/firestore';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

export function useSetFireStore(data: any) {
	const { email } = useSelector(({ login }: RootState) => ({
		email: login.email,
	}));
	const fireStore = getFirestore();
	const washingtonRef = doc(fireStore, 'user', `${email}`);
	(async () => {
		await updateDoc(washingtonRef, data);
	})();
}
