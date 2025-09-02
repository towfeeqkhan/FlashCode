import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createHashRouter, RouterProvider } from "react-router";
import "./index.css";
import App from "./App.jsx";
import Editor from "./components/Editor.jsx";
import { AIProvider } from "./context/AIContext.jsx";

const router = createHashRouter([
  {
    path: "/",
    element: <App />
  },
  {
    path: "/editor",
    element: <Editor />
  }
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AIProvider>
      <RouterProvider router={router} />
    </AIProvider>
  </StrictMode>
);
