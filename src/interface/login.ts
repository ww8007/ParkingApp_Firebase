export interface login {
	error: string;
	email: string;
	data: any;
	uid: string;
	carNum: string;
	name: string;
	pushToken: string;
	isSuperUser: boolean;
	superUserTokens: string[];
}

export interface serverInfo {
	email: string;
	uid: string;
}

export interface personalInfo {
	name: string;
	carNum: string;
}
