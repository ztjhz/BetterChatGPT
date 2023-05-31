import * as React from "react";
import * as ReactDOM from "react-dom/client";
import ChatPage from "./pages/chat";
import SearchPage from "./pages/search";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import './main.css';
await import('katex/dist/katex.min.css');

import './i18n';
import SearchResultPage from "./pages/search/result";

const router = createBrowserRouter([
  {
    path: "/",
    element: <SearchPage />,
  },
  {
    path: "/search/:question",
    element: <SearchResultPage />,
  },
  {
    path: "/chat",
    element: <ChatPage />,
  },
]);

//@ts-ignore
ReactDOM.createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);