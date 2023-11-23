import axios, { Axios, AxiosResponse } from "axios";
import {
  AuthTokenPresenter,
  CreateSpeechPayload,
  ErrorResponse,
  IAuthPresenter,
  ProfilePresenter,
  SpeechPresenter,
  SuccessResponse,
} from "./api.types";
import secureCall from "./secureCall";

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 500000,
  headers: {
    "Content-Type": "application/json",
    "x-api-key": process.env.NEXT_PUBLIC_API_KEY,
  },
});

export function getAxiosInstance() {
  return instance;
}

export function isSuccess(response: AxiosResponse<any>) {
  return response.status >= 200 && response.status < 300;
}

export function getHeaders() {
  return {
    "Content-Type": "application/json",
    "x-api-key": process.env.NEXT_PUBLIC_API_KEY,
    Authorization: `Bearer ${getAccess()}`,
    Refresh: getRefresh(),
  };
}

export async function get<T>(url: string, params?: any) {
  return instance.get<SuccessResponse<T>>(url, {
    params,
    headers: getHeaders(),
  });
}

export async function post<T>(url: string, data?: any) {
  return instance.post<SuccessResponse<T>>(url, data, {
    headers: getHeaders(),
  });
}

export async function deleteRequest<T>(url: string, data?: any) {
  return instance.delete<SuccessResponse<T>>(url, data);
}

export function getAccess() {
  if (typeof window !== "undefined") {
    const sTokens = localStorage.getItem("tokens");
    if (sTokens) {
      const parsed = JSON.parse(sTokens) as AuthTokenPresenter;
      return parsed.access;
    }
  }
  return "";
}

export function getRefresh() {
  if (typeof window !== "undefined") {
    const sTokens = localStorage.getItem("tokens");
    if (sTokens) {
      const parsed = JSON.parse(sTokens) as AuthTokenPresenter;
      return parsed.refresh;
    }
  }
  return "";
}

function storeAccess(token: Partial<AuthTokenPresenter>) {
  if (typeof window !== "undefined") {
    const sTokens = localStorage.getItem("tokens");
    let parsed = {};
    if (sTokens) {
      parsed = JSON.parse(sTokens);
    }
    localStorage.setItem(
      "tokens",
      JSON.stringify({
        ...parsed,
        ...token,
      })
    );
  }
}

export async function login(email: string, password: string) {
  const res = await post<IAuthPresenter>("/auth/login", { email, password });
  if (isSuccess(res)) {
    storeAccess(res.data.data.token);
  }
  return res;
}

export async function loginWithGoogle(idToken: string) {
  const res = await post<IAuthPresenter>("/auth/sign-in/google", { idToken });
  if (isSuccess(res)) {
    storeAccess(res.data.data.token);
  }
  return res;
}

export async function register(email: string, password: string, name: string) {
  return post<IAuthPresenter>("/auth/register", { email, password, name });
}

export async function deleteAccount() {
  return deleteRequest("/auth/delete-account");
}

export async function updatePassword(password: string) {
  return post<IAuthPresenter>("/auth/change-password", { password });
}

export async function updateEmail(email: string) {
  return post<IAuthPresenter>("/auth/change-email", { email });
}

export async function updateProfile(data: Partial<ProfilePresenter>) {
  return post<IAuthPresenter>("/auth/profile", data);
}

export async function verifyOtp(email: string, otp: string) {
  return post<IAuthPresenter>("/auth/verify-otp", { email, otp });
}

export async function resendOtp(email: string) {
  return post<IAuthPresenter>("/auth/resend-otp", { email });
}

export async function logout() {
  return post("/auth/logout");
}

export async function me() {
  return get<ProfilePresenter>("/auth/profile");
}

export async function refreshToken() {
  const res = await post<
    Pick<AuthTokenPresenter, "access" | "accessExpiresIn">
  >("/auth/refresh");
  if (isSuccess(res)) {
    console.log("Storing access data", res.data.data)
    storeAccess(res.data.data);
  }
  return res;
}

export async function getSpeeches() {
  return get<SpeechPresenter[]>("/speech/list");
}

export async function createSpeech(data: CreateSpeechPayload) {
  return post<SpeechPresenter>("/speech/create", data);
}

export async function updateSpeech(id: string, data: Partial<SpeechPresenter>) {
  return post<SpeechPresenter>(`/speech/update/${id}`, data);
}

export async function getSpeech(id: string) {
  return get<SpeechPresenter>(`/speech/${id}`);
}

export async function deleteSpeech(id: string) {
  return deleteRequest<SpeechPresenter>(`/speech/delete/${id}`);
}

export function swrFetcher<T>(dispatch: any, router: any) {
  return (url: string) => {
    return secureCall(() => get<T>(url), dispatch, router).then((response) => {
      if (!response) {
        throw new Error("Not authenticated");
      }
      return response?.data.data;
    });
  };
}
