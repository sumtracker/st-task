//* Packages Imports */
import axios, { InternalAxiosRequestConfig } from "axios";

//* Services Imports */
import AppConfig from "../config/config";

export const requestApiMiddleware = () => {
  axios.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    let token = AppConfig.BACKEND_TOKEN;
    if (token) {
      config["headers"]["Authorization"] = "Token " + token;
    }
    return config;
  });
};
