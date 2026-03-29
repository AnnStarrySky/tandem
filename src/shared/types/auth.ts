export type BackendUser = {
  id: number;
  email?: string | null;
  name?: string | null;
};

export type BackendAuthResponse = {
  user: BackendUser;
  accessToken: string;
  refreshToken?: string;
};

export type BackendLoginResponse = {
  id: string;
  name: string;
  jwtToken: string;
  errors?: object;
};
