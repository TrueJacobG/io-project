import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "./index.css";
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
    path: "/event/:idEvent",
    element: <Event archived={false} />,
  },
  {
    path: "/event/archived/:idEvent",
    element: <Event archived={true} />,
  },
  {
    path: "/event/:idEvent/expense",
    element: <Expense archived={false} />,
  },
  {
    path: "/event/archived/:idEvent/expense",
    element: <Expense archived={true} />,
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
