import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Platform } from "react-native";

const getBaseUrl = () => {
  if (__DEV__) {
    if (Platform.OS === "android") {
      return "http://192.168.15.122:8080/syncrobaby/";
    }
    return "http://localhost:8080/syncrobaby/";
  }
  //return "https:syncrobaby/";
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
