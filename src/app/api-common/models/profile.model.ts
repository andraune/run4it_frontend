export interface Profile {
    username: string;
    birthDate: string;
    height: number;
    weight: number;
    createdAt: string;
    updatedAt: string;
}

export interface PolarUser {
    profileID: number;
    memberID: string;
    polarUserID: number;
	accessTokenExpiresAt: string;
    updatedAt: string;
    authUrl: string;
}
