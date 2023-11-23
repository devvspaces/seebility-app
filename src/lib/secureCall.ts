import { NextRouter } from "next/router";
import { refreshToken } from "../lib/api";
import { LOGIN, LOGOUT } from "../utils/AuthContext";
import routes from "@/lib/routes";
import { AxiosError } from "axios";
import { ErrorResponse } from "./api.types";

async function secureCall<T>(
  fn: () => Promise<T>,
  dispatch: any,
  router: NextRouter
): Promise<T | undefined> {
  try {
    const response = await fn();
    return response;
  } catch (e: any) {
    if (e instanceof AxiosError) {
      const data: ErrorResponse = e.response?.data;
      if (e.response?.status == 401) {
        try {
          const response = await refreshToken();
          if (response.status == 200) {
            dispatch({ type: LOGIN });
            return;
          }
        } catch (e) {
          dispatch({ type: LOGOUT });
          router.push(routes.login);
        }
      } else {
        throw e;
      }
    }
  }
}

export default secureCall;
