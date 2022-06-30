interface UserModel extends Auth.UserInfo {
  token: string;
  refreshToken: string;
  password: string;
}

export const userModel: UserModel[] = [
  {
    token: '__TOKEN_SOYBEAN__',
    refreshToken: '__REFRESH_TOKEN_SOYBEAN__',
    id: '0',
    username: 'Soybean',
    password: 'soybean123',
		avatar: '',
		nickname: '',
		phone: '',
		email: ''
  },
];
