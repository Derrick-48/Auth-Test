import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AuthContext = createContext();

const axiosInstance = axios.create({
  baseURL: "https://vault-backend-susi.onrender.com/api",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Attach request interceptor only once
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");

    // Debug logging
    console.log("Request URL:", config.url);
    console.log("Token from localStorage:", token);

    if (token && token !== "undefined" && token !== "null") {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("Authorization header set:", config.headers.Authorization);
    } else {
      console.log("No valid token found");
    }

    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Attach response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    console.log("Response received:", response.status, response.config.url);
    return response;
  },
  async (error) => {
    console.error("Response error:", {
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url,
      headers: error.config?.headers,
    });

    if (error.response?.status === 401) {
      console.log("401 error - clearing tokens and redirecting");
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const login = (accessToken, refreshToken) => {
    console.log("Login called with:", {
      accessToken: !!accessToken,
      refreshToken: !!refreshToken,
    });

    if (accessToken) {
      localStorage.setItem("access_token", accessToken);
      localStorage.setItem("refresh_token", refreshToken);
      setUser({ token: accessToken });
      setIsAuthenticated(true);
      console.log("Login successful - tokens stored");
    } else {
      console.error("Login failed - no access token provided");
    }
  };

  const logout = () => {
    console.log("Logout called");
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setUser(null);
    setIsAuthenticated(false);
    navigate("/login");
  };

  const checkAuth = () => {
    const token = localStorage.getItem("access_token");
    console.log("CheckAuth - token exists:", !!token);

    if (token && token !== "undefined" && token !== "null") {
      setIsAuthenticated(true);
      setUser({ token });
      console.log("User authenticated from localStorage");
    } else {
      setIsAuthenticated(false);
      setUser(null);
      console.log("No valid token found in localStorage");
    }
    setIsLoading(false);
  };

  // Verify token validity
  const verifyToken = async () => {
    const token = localStorage.getItem("access_token");

    if (!token || token === "undefined" || token === "null") {
      console.log("No token to verify");
      logout();
      return false;
    }

    try {
      // Test the token with a simple authenticated request
      // Adjust this endpoint to match your backend
      await axiosInstance.get("/user/profile");
      console.log("Token verification successful");
      return true;
    } catch (error) {
      console.error("Token verification failed:", error.response?.status);
      if (error.response?.status === 401) {
        logout();
        return false;
      }
      // Don't logout for other errors (like network issues)
      return true;
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        logout,
        axiosInstance,
        verifyToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
