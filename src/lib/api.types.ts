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

export type LengthType = "TIME" | "WORD";


export interface CreateSpeechPayload {
  speaker: string;
  title: string;
  topic: string;
  story: string;
  length: number;
  lengthType: LengthType;
}

export interface SpeechPresenter {
  id: string;
  speaker: string;
  title: string;
  topic: string;
  story: string;
  length: number;
  readingTime: number;
  createdAt: string;
  updatedAt: string;
  completedText: string;
  completionTime: number;
  lengthType: LengthType;
}
