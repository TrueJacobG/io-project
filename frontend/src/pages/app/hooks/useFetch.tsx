import { useEffect, useState } from "react";

let link: string;

if (import.meta.env.VITE_FAKE_API !== undefined) {
  link = import.meta.env.VITE_FAKE_API;
}

if (import.meta.env.VITE_API !== undefined) {
  link = import.meta.env.VITE_API;
}

const useFetch = async (url: string, method: string, body: any) => {
  return fetch(link + url, {
    method: method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  }).then((res) => res.json());
};

export default useFetch;
