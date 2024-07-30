"use server";
import { cookies } from "next/headers";

export async function addCookies(token: string) {
  if (token) {
    cookies().set("token", token);
  }
}

export async function getCookie(name: string) {
  return cookies().get(name)?.value;
}
