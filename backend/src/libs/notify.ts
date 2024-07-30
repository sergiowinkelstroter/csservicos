import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

export const api_notify = axios.create({
  baseURL: `${process.env.EVOLUTION_API_URL}/message/sendText`,
  headers: {
    "Content-Type": "application/json",
    apikey: process.env.EVOLUTION_API_KEY,
  },
});
