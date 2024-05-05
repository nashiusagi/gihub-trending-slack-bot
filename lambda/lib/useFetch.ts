import { type Result, Success, Failure } from "../types";

interface FetchRequest {
  url: string;
  options: object;
}

/**
 * NOTE: Resultで返すと呼び出し元でハンドリングが複雑になるため、
 * ここでは簡略化のためにPromise<string>を返している
 */
export const useFetch = (request: FetchRequest) => {
  return fetch(request.url, request.options)
    .then(handleServerSideErrors)
    .then((result) => {
      if (result.isSuccess()) {
        const response = result.value;
        return response.text();
      }
      return Promise.resolve(result.error.message);
    })
    .catch((e) => {
      console.error(e);
      return Promise.resolve("Network Error");
    });
};

/**
 * レスポンスにたいして共通で行う前処理
 * 4xx, 5xx系のエラーをさばく
 */
const handleServerSideErrors = async (
  res: Response,
): Promise<Result<Response, Error>> => {
  if (!res) return new Failure(new Error("Abort Error"));
  if (res.ok) return new Success(res);

  switch (res.status) {
    case 400:
      console.error("Bad Request");
      return new Failure(new Error("Bad Request"));
    case 401:
      console.error("Unauthorized");
      return new Failure(new Error("Unauthorized"));
    case 403:
      console.error("Forbidden");
      return new Failure(new Error("Forbidden"));
    case 404:
      console.error("Not Found");
      return new Failure(new Error("Not Found"));
    case 500:
      console.error("Internal Server Error");
      return new Failure(new Error("Internal Server Error"));
    case 502:
      console.error("Bad Gateway");
      return new Failure(new Error("Bad Gateway"));
    case 504:
      console.error("Gateway Timeout");
      return new Failure(new Error("Gateway Timeout"));
    default:
      console.error("Unhandled Error");
      return new Failure(new Error("Unhandled Error"));
  }
};
