export interface LoginAPI {
  email: string;
  role: string;
  password: string;
}
export interface LoginResponseAPI {
  token: string;
  role: string;
  email: string;
}
