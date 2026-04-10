export type BackendLoginResponse = {
  id: string;
  name: string;
  jwtToken: string;
};

export type BackendUser = {
  id: string;
  email?: string | null;
  name?: string | null;
};

export type BackendAuthResponse = {
  user: BackendUser;
  accessToken: string;
  refreshToken?: string;
};

export type ProviderName = "credentials" | "github" | "google";
