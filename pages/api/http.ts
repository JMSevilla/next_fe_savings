import axios, { AxiosError } from "axios";
import { NextApiRequest, NextApiResponse } from "next";

const http = axios.create();
export const gitlabProvinces = axios.create({
  baseURL: process.env.NEXT_PUBLIC_GITLAB_BASE_URL,
});

export const BSBAPI = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_BASE_URL,
});

type RequestHandler = {
  concat: string;
  requestOptions: any;
};
var myHeaders = new Headers();
myHeaders.append("authapp", "Basic:793bb6c2-4807-4805-a092-0a91d5ff62d7");
export const buildRequest = (callback: RequestHandler) => {
  return new Promise((resolve: any) => {
    fetch(process.env.NEXT_PUBLIC_BACKEND_BASE_URL + callback.concat, {
      method: callback.requestOptions.method,
      body: callback.requestOptions.body,
      redirect: "follow",
    })
      .then((response: any) => resolve(response.json))
      .then((result) => console.log(result))
      .catch((error) => console.log("error", error));
  });
};

type RequestHandlerCallback = (
  req: NextApiRequest,
  res: NextApiResponse
) => Promise<void>;

export const buildRequestHandler =
  (callbackFn: RequestHandlerCallback) =>
  async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      await callbackFn(req, res);
    } catch (error) {
      if (error instanceof AxiosError) {
        res
          .status(error.response?.status ?? 500)
          .json(error.response?.data ?? "Something went wrong");
        return;
      }
      res.status(500).json("Something went wrong");
    }
  };

export default http;
