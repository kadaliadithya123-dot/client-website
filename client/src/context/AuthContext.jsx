import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(() => {
    const saved = localStorage.getItem("sritech_admin") || sessionStorage.getItem("sritech_admin");
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("sritech_token") || sessionStorage.getItem("sritech_token");
    if (!token) {
      setLoading(false);
      return;
    }
    api
      .get("/auth/me")
      .then((res) => setAdmin(res.data.admin))
      .catch(() => {
        localStorage.removeItem("sritech_token");
        localStorage.removeItem("sritech_admin");
        sessionStorage.removeItem("sritech_token");
        sessionStorage.removeItem("sritech_admin");
        setAdmin(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password, rememberMe = true) => {
    const res = await api.post("/auth/login", { email, password });
    const storage = rememberMe ? localStorage : sessionStorage;
    const otherStorage = rememberMe ? sessionStorage : localStorage;
    otherStorage.removeItem("sritech_token");
    otherStorage.removeItem("sritech_admin");
    storage.setItem("sritech_token", res.data.token);
    storage.setItem("sritech_admin", JSON.stringify(res.data.admin));
    setAdmin(res.data.admin);
    return res.data.admin;
  };

  const logout = () => {
    localStorage.removeItem("sritech_token");
    localStorage.removeItem("sritech_admin");
    sessionStorage.removeItem("sritech_token");
    sessionStorage.removeItem("sritech_admin");
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ admin, loading, login, logout }}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
