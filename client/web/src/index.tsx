import React from "react";
import axios from "axios";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { CssBaseline } from "@mui/material";
import { ThemeContextProvider } from "./contexts/ThemeContext";
import App from "./pages/App";
import Public from "./pages/Public";
import NotFound from "./pages/NotFound";
import Settings from "./pages/Settings";
import TodoLists from "./pages/TodoLists";
import TodoList from "./pages/TodoList";

function PublicRoute({ children }: { children: JSX.Element }) {
  let location = useLocation();

  if (sessionStorage.getItem("jwt")) {
    return <Navigate to="/app/lists" state={{ from: location }} replace />;
  }

  return children;
}

function PrivateRoute({ children }: { children: JSX.Element }) {
  let location = useLocation();

  if (!sessionStorage.getItem("jwt")) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
}

axios.interceptors.request.use(
  (config) => {
    if (config.headers) config.headers.Authorization = `Bearer ${sessionStorage.getItem("jwt")}`;
    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);

const root = createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeContextProvider>
        <CssBaseline />
        <Routes>
          <Route
            path="/"
            element={
              <PublicRoute>
                <Public />
              </PublicRoute>
            }
          />
          <Route
            path="/app"
            element={
              <PrivateRoute>
                <App />
              </PrivateRoute>
            }
          >
            <Route path="lists" element={<TodoLists />} />
            <Route path="lists/:listId" element={<TodoList />} />
            <Route path="settings" element={<Settings />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </ThemeContextProvider>
    </BrowserRouter>
  </React.StrictMode>
);
