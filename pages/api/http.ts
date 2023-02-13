import axios, { AxiosError } from "axios";
import { NextApiRequest, NextApiResponse } from "next";

const http = axios.create();
export const gitlabProvinces = axios.create({
  baseURL: process.env.NEXT_PUBLIC_GITLAB_BASE_URL,
});

export const BSBAPI = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_BASE_URL,
  headers: {
    "x-api-key": "34a89f9063bb49a59d2525220b677e25",
  },
});

export default http;
