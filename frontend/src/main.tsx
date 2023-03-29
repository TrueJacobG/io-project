import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "./index.css";
import Info from "./pages/info";
import Event from "./pages/event";
import WrongUrl from "./pages/error";
import App from "./pages/app";
import Expense from "./pages/expense";

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
  {
    path: "/event/:id_event/expense",
    element: <Expense />,
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
