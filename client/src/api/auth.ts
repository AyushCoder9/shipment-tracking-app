import { api } from './client';

export interface LoginResponse {
  token: string;
  user: { username: string };
}

export const authApi = {
  login: (username: string, password: string) =>
    api<LoginResponse>('/auth/login', {
      method: 'POST',
      body: { username, password },
    }),
};
