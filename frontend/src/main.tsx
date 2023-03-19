import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import "./index.css";
import Info from "./routes/Info";
import Event from "./routes/Event";
import WrongUrl from "./routes/WrongUrl";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <WrongUrl />,
  },
  {
    path: "/info",
    element: <Info />,
  },
  {
    path: "/event/:id_event",
    element: <Event />,
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
