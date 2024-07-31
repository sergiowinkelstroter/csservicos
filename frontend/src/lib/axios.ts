import axios from "axios";
import { getCookie } from "@/utils/cookies";

export const api = axios.create({
  baseURL: process.env.API_URL || "http://localhost:3002",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(async (config) => {
  const token = await getCookie("token");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});
