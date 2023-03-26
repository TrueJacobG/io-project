let link: string;

if (import.meta.env.VITE_FAKE_API !== undefined) {
  link = import.meta.env.VITE_FAKE_API;
}

if (import.meta.env.VITE_API !== undefined) {
  link = import.meta.env.VITE_API;
}

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
