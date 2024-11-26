import { AxiosError } from "axios";
import { DEFAULT_ERROR_MESSAGE } from "../constants/constants";

export const getErrorMessage = (err: unknown): string => {
  if (err instanceof AxiosError) {
    return err.response !== undefined ? err.response.statusText : err.message;
  } else if (err instanceof Error) {
    return err.message;
  }
  return DEFAULT_ERROR_MESSAGE;
};
