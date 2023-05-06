const link: string = "https://192.168.50.81:7012/api/v1";

const useFetchWithBody = async (url: string, method: string, token: string, body: any) => {
  return fetch(link + url, {
    method: method,
    headers: new Headers({
      Authorization: token,
      "Content-Type": "application/json",
    }),
    body: JSON.stringify(body),
  }).then((res) => res.json());
};

export default useFetchWithBody;
