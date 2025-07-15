export type TUser = {
  id?: string,
  first: string,
  last: string,
  email: string,
  password: string;
  roles?: string[];
}

export type TLoginResponse = {
  id: string;
  first: string;
  last: string;
  email: string;
  roles: string[];
  accessToken: string;
  refreshToken: string;
}

export type TRegisterResponse = {
  message: string;
}