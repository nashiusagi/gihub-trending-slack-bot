interface FetchRequest {
  url: string;
  options: object;
}

export const useFetch = (request: FetchRequest) => {
  return fetch(request.url, request.options)
    .catch((e) => {
      console.error(e);
      throw Error(e);
    })
    .then(handleServerSideErrors)
    .then((res) => {
      return res.text();
    });
};

const handleServerSideErrors = async (res: Response) => {
  if (!res) return new Response("Abort Error", undefined);
  if (res.ok) return res;

  switch (res.status) {
    case 400:
      console.error("Bad Request");
      return new Response("Bad Request", { status: 400 });
    case 401:
      console.error("Unauthorized");
      return new Response("Unauthorized", { status: 401 });
    case 403:
      console.error("Forbidden");
      return new Response("Forbidden", { status: 403 });
    case 404:
      console.error("Not Found");
      return new Response("Not Found", { status: 404 });
    case 500:
      console.error("Internal Server Error");
      return new Response("Internal Server Error", { status: 500 });
    case 502:
      console.error("Bad Gateway");
      return new Response("Bad Gateway", { status: 502 });
    case 504:
      console.error("Gateway Timeout");
      return new Response("Gateway Timeout", { status: 504 });
    default:
      console.error("Unhandled Error");
      return new Response("Unhandled Error", { status: res.status });
  }
};

const hasJsonContent = (res: Response): boolean => {
  const contentType = res.headers.get("Content-Type");

  return !!contentType?.includes("application/json");
};
