export interface car {
	error: string;
	carList: any;
	loginInfo: any;
	carNum: string;
	carInfo: carInfo;
	isCarGetSuccess: boolean;
	isPostSuccess: boolean;
	isRequestCarNum: boolean;
}

interface carInfo {
	entryDateString: string;
	entryDate: string;
	id: string;
	differentTime: string;
}

export interface postDiscountAPI {
	id: string;
	discountType: number;
	carNo: string;
}

export interface discountType {
	under3: 1;
	under5: 4;
	over5: 7;
}

export interface carInfoState {
	carNum: string;
	email: string;
	hour: string;
	timeStamp: string;
	name: string;
	pushToken: string;
}
