import {
  ChatMessagePresenter,
  IAuthPresenter,
  SpeechToTextPresenter,
  SuccessResponse,
} from "./api.types";
import secureCall from "./secureCall";
import axios, { Axios, AxiosResponse } from "axios";

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_LLM_API_BASE_URL + '/api/v1',
  timeout: 500000,
  headers: {
    "Content-Type": "application/json",
    "api-key": process.env.NEXT_PUBLIC_LLM_API_KEY,
  },
});

export function getMediaUrl(url: string) {
  return process.env.NEXT_PUBLIC_LLM_API_BASE_URL + '/' + url;
}

export function getAxiosInstance() {
  return instance;
}

export function isSuccess(response: AxiosResponse<any>) {
  return response.status >= 200 && response.status < 300;
}

export async function get<T>(url: string, params?: any) {
  return instance.get<T>(url, {
    params,
  });
}

export async function post<T>(url: string, data?: any) {
  return instance.post<T>(url, data, {});
}

export async function getChats(userId: string) {
  return get<ChatMessagePresenter[]>(`/chat/chats/${userId}/`);
}

export async function speechToText(record: string) {
  return post<SpeechToTextPresenter>("/chat/speech-to-text/", {
    record,
  });
}

export function swrInsecureFetcher<T>() {
  return (url: string) => {
    return get<T>(url).then((response) => {
      if (!response) {
        throw new Error("Not authenticated");
      }
      return response?.data;
    })
  };
}


export function swrFetcher<T>(dispatch: any, router: any) {
  return (url: string) => {
    return secureCall(() => get<T>(url), dispatch, router).then((response) => {
      if (!response) {
        throw new Error("Not authenticated");
      }
      return response?.data;
    });
  };
}
