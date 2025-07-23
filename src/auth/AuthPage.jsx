import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { LogIn, UserPlus, Github, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

export default function AuthPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { login, axiosInstance } = useAuth();

  const type = location.pathname.includes("signup") ? "signup" : "login";

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [debugInfo, setDebugInfo] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    setDebugInfo("");

    const endpoint = type === "signup" ? "/v1/auth/signup" : "/v1/auth/signin";

    try {
      const payload =
          type === "signup"
              ? form
              : { email: form.email, password: form.password };

      console.log("Making request to:", `http://localhost:8080/api${endpoint}`);
      console.log("Payload:", { ...payload, password: "[REDACTED]" });

      const res = await axiosInstance.post(endpoint, payload);

      console.log("Full response:", res);
      console.log("Response data:", res.data);
      console.log("Response status:", res.status);
      console.log("Response headers:", res.headers);

      // Set debug info for UI
      setDebugInfo(`Response: ${JSON.stringify(res.data, null, 2)}`);

      // Check for different possible token field names
      const possibleTokenFields = [
        "accessToken",
        "access_token",
        "token",
        "jwt",
        "authToken",
        "jwtToken",
      ];

      const possibleRefreshFields = [
        "refreshToken",
        "refresh_token",
        "refreshJwt",
      ];

      let accessToken = null;
      let refreshToken = null;

      // Check direct fields
      for (const field of possibleTokenFields) {
        if (res.data[field]) {
          accessToken = res.data[field];
          break;
        }
      }

      for (const field of possibleRefreshFields) {
        if (res.data[field]) {
          refreshToken = res.data[field];
          break;
        }
      }

      // Check nested in 'data' field
      if (!accessToken && res.data.data) {
        for (const field of possibleTokenFields) {
          if (res.data.data[field]) {
            accessToken = res.data.data[field];
            break;
          }
        }
      }

      if (!refreshToken && res.data.data) {
        for (const field of possibleRefreshFields) {
          if (res.data.data[field]) {
            refreshToken = res.data.data[field];
            break;
          }
        }
      }

      if (accessToken) {
        console.log("Token found:", {
          accessToken: !!accessToken,
          refreshToken: !!refreshToken,
        });
        login(accessToken, refreshToken);
        navigate("/dashboard");
      } else {
        console.error("No access token found in response");
        console.error("Available fields:", Object.keys(res.data));
        setError(
            `No access token found. Available fields: ${Object.keys(
                res.data
            ).join(", ")}`
        );
      }
    } catch (err) {
      console.error("Authentication error:", err);
      console.error("Error response:", err.response?.data);
      console.error("Error status:", err.response?.status);
      console.error("Error headers:", err.response?.headers);

      setDebugInfo(
          `Error: ${JSON.stringify(err.response?.data || err.message, null, 2)}`
      );

      if (err.response?.status === 400) {
        setError(
            err.response?.data?.message ||
            "Bad request. Please check your input and try again."
        );
      } else if (err.response?.status === 401) {
        setError("Invalid credentials. Please check your email and password.");
      } else if (err.response?.status === 403) {
        setError(
            "Access forbidden. Please check your credentials or contact support."
        );
      } else if (err.response?.status === 422) {
        setError(
            err.response?.data?.message ||
            "Validation error. Please check your input."
        );
      } else if (err.code === "NETWORK_ERROR" || !err.response) {
        setError("Network error. Please check your connection and try again.");
      } else {
        setError(
            err.response?.data?.message ||
            `Request failed (${err.response?.status || "Unknown error"})`
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAuthMode = () => {
    setError("");
    setDebugInfo("");
    setForm({ firstName: "", lastName: "", email: "", password: "" });
    navigate(type === "signup" ? "/login" : "/signup");
  };

  return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-700"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-green-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent)] opacity-50"></div>

        <div className="relative z-10 w-full max-w-md px-6 py-8">
          {/* Logo and header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 mb-6 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-2xl shadow-blue-500/25">
              <Github className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent mb-2">
              {type === "signup" ? "Join the Future" : "Welcome Back"}
            </h1>
            <p className="text-gray-400 text-lg">
              {type === "signup"
                  ? "Create your account and start building tomorrow"
                  : "Sign in to continue your journey"}
            </p>
          </div>

          {/* Main form container */}
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name fields for signup */}
              {type === "signup" && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="group">
                      <label className="block text-sm font-medium text-gray-200 mb-2">
                        First Name
                      </label>
                      <div className="relative">
                        <input
                            id="firstName"
                            name="firstName"
                            type="text"
                            autoComplete="given-name"
                            required
                            value={form.firstName}
                            onChange={handleChange}
                            className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300 group-hover:border-white/30"
                            placeholder="John"
                        />
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                      </div>
                    </div>
                    <div className="group">
                      <label className="block text-sm font-medium text-gray-200 mb-2">
                        Last Name
                      </label>
                      <div className="relative">
                        <input
                            id="lastName"
                            name="lastName"
                            type="text"
                            autoComplete="family-name"
                            required
                            value={form.lastName}
                            onChange={handleChange}
                            className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300 group-hover:border-white/30"
                            placeholder="Doe"
                        />
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                      </div>
                    </div>
                  </div>
              )}

              {/* Email field */}
              <div className="group">
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Email address
                </label>
                <div className="relative">
                  <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={form.email}
                      onChange={handleChange}
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300 group-hover:border-white/30"
                      placeholder="you@example.com"
                  />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
              </div>

              {/* Password field */}
              <div className="group">
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete={type === "signup" ? "new-password" : "current-password"}
                      required
                      value={form.password}
                      onChange={handleChange}
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 pr-12 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300 group-hover:border-white/30"
                      placeholder="••••••••"
                  />
                  <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
              </div>

              {/* Error message */}
              {error && (
                  <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-4 backdrop-blur-sm">
                    <div className="text-red-200 text-sm font-medium">{error}</div>
                  </div>
              )}

              {/* Debug info */}
              {debugInfo && (
                  <div className="bg-blue-500/20 border border-blue-500/50 rounded-xl p-4 backdrop-blur-sm">
                    <div className="text-blue-200 text-xs">
                      <strong className="font-semibold">Debug Info:</strong>
                      <pre className="mt-2 whitespace-pre-wrap font-mono text-xs opacity-90">{debugInfo}</pre>
                    </div>
                  </div>
              )}

              {/* Submit button */}
              <button
                  type="submit"
                  disabled={isLoading}
                  className="group relative w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/25 disabled:opacity-70 disabled:transform-none"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
                <div className="relative flex items-center justify-center gap-2">
                  {isLoading ? (
                      <>
                        <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24">
                          <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                              fill="none"
                          />
                          <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        <span>Processing...</span>
                      </>
                  ) : type === "signup" ? (
                      <>
                        <UserPlus className="w-5 h-5" />
                        <span>Create Account</span>
                      </>
                  ) : (
                      <>
                        <LogIn className="w-5 h-5" />
                        <span>Sign In</span>
                      </>
                  )}
                </div>
              </button>
            </form>
          </div>

          {/* Toggle auth mode */}
          <div className="text-center mt-8">
            <button
                onClick={toggleAuthMode}
                className="text-gray-300 hover:text-white font-medium transition-colors duration-200 relative group"
            >
            <span className="relative z-10">
              {type === "signup"
                  ? "Already have an account? Sign in"
                  : "Don't have an account? Sign up"}
            </span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </div>

          {/* Decorative elements */}
          <div className="absolute -top-6 -right-6 w-20 h-20 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-xl"></div>
          <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-full blur-xl"></div>
        </div>
      </div>
  );
}