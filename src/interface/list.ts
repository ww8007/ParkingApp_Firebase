export interface list {
	timeList: addListType[];
	idxNumber: number;
	today: string;
	isCanRequest: boolean;
	isCanSubmit: boolean;
}

export interface addListType {
	time: string;
	status: string;
	id: number;
	day: string;
}

export interface addTimeType {
	day: string;
	time: string;
}
