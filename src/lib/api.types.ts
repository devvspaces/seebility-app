import { AxiosError } from 'axios';

export interface AuthTokenPresenter {
  access: string;
  accessExpiresIn: string;
  refresh: string;
  refreshExpiresIn: string;
}

export interface IAuthPresenter {
  token: AuthTokenPresenter;
  email: string;
}

export interface ErrorResponse {
  message: string[] | string;
  statusCode: number;
  path: string;
  error: string;
}

export class ApiError extends AxiosError<ErrorResponse> {}

export interface ProfilePresenter {
  id: string;
  email: string;
  name: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
  lastLogin: string;
  isEmailVerified: boolean;
  modeOfSignUp: string;
}

export interface SuccessResponse<T> {
  isArray: boolean;
  path: string;
  duration: string;
  method: string;
  data: T;
}

export interface ChatMessagePresenter {
  room_name: string;
  message: string;
  ai: boolean;
  created_at: string;
}


export interface SpeechToTextPresenter {
  text: string;
}
