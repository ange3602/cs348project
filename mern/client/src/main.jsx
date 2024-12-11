import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import App from "./App";
import Record from "./components/Record";
import RecordList from "./components/RecordList";
import Meals from "./components/Meals";
import Meal from "./components/Meal";
import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <RecordList />,
      },
    ],
  },
  {
    path: "/edit/:id",
    element: <App />,
    children: [
      {
        path: "/edit/:id",
        element: <Record />,
      },
    ],
  },
  {
    path: "/create",
    element: <App />,
    children: [
      {
        path: "/create",
        element: <Record />,
      },
    ],
  },
  {
    path: "/meals",
    element: <App />,
    children: [
      {
        path: "/meals",
        element: <Meals />,
      },
    ],
  },
  {
    path: "/edit-meal/:id",
    element: <App />,
    children: [
      {
        path: "/edit-meal/:id",
        element: <Meal />,
      },
    ],
  },
  {
    path: "/summary",
    element: <App />,
    children: [
      {
        path: "/summary",
        element: <RecordList />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);