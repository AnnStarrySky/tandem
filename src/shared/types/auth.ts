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
