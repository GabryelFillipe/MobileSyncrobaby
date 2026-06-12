import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Platform } from "react-native";

const getBaseUrl = () => {
  if (__DEV__) {
    if (Platform.OS === "android") {
      return "https://syncrobabybackend-hmc2g7cqe9bfbqcr.brazilsouth-01.azurewebsites.net/syncrobaby/";
    }
    return "https://syncrobabybackend-hmc2g7cqe9bfbqcr.brazilsouth-01.azurewebsites.net/syncrobaby/";
  }
  return "https://syncrobabybackend-hmc2g7cqe9bfbqcr.brazilsouth-01.azurewebsites.net/syncrobaby/";
};

export const api = axios.create({
  baseURL: getBaseUrl(),
  timeout: 8000,
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("@App:token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
