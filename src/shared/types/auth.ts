export type BackendLoginResponse = {
  id: string;
  name: string;
  jwtToken: string;
};

export type BackendAuthResponse = {
  user: {
    id: string;
    email?: string | null;
    name?: string | null;
  };
  accessToken: string;
  refreshToken?: string;
};

export type ProviderName = "credentials" | "github" | "google";
