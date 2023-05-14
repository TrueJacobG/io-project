const link: string = "https://192.168.50.81:7012/api/v1";

const useFetch = async (url: string, method: string, token: string) => {
  return fetch(link + url, {
    method: method,
    headers: new Headers({
      Authorization: token,
      "Content-Type": "application/json",
    }),
  }).then((res) => res.json());
};

export default useFetch;
