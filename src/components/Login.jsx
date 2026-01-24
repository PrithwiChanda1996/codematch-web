import axios from "axios";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router";

import { useToast } from "../context/ToastContext";
import { addUser } from "../utils/userSlice";
import { BASE_URL } from "../utils/constants";
import { setStoredAuth } from "../utils/authUtils";
import Loader from "./Loader";

const Login = () => {
  const [loginMethod, setLoginMethod] = useState("email");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
  const { addToast } = useToast();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the page user was trying to access, default to /feed
  const from = location.state?.from || "/feed";

  const getInputConfig = () => {
    switch (loginMethod) {
      case "email":
        return { 
          type: "email", 
          placeholder: "Enter your email",
          label: "Email Address"
        };
      case "username":
        return { 
          type: "text", 
          placeholder: "Enter your username",
          label: "Username"
        };
      case "phone":
        return { 
          type: "tel", 
          placeholder: "Enter your phone number",
          label: "Phone Number"
        };
      default:
        return { 
          type: "text", 
          placeholder: "Enter identifier",
          label: "Identifier"
        };
    }
  };

  // Client-side validation
  const validateForm = () => {
    const newErrors = {};
    
    if (!identifier.trim()) {
      newErrors.identifier = `${getInputConfig().label} is required`;
    }
    
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e?.preventDefault(); // Support form submission
    
    // Validate before submitting
    if (!validateForm()) {
      addToast("warning", "Please fix the errors before submitting");
      return;
    }

    const payloadKey = loginMethod === "phone" ? "mobileNumber" : loginMethod;
    const payload = {
      [payloadKey]: identifier,
      password,
    };

    setIsLoading(true);

    try {
      const baseUrl = BASE_URL;
      const res = await axios.post(`${baseUrl}/auth/login`, payload, {
        withCredentials: true,
      });
      
      if (res.data.success) {
        const { accessToken } = res.data.data;

        // Store only access token in localStorage
        setStoredAuth({ accessToken });

        // Show success toast immediately
        addToast("success", res.data.message);

        // Fetch full user profile using the new endpoint
        try {
          const user = await axios.get(`${baseUrl}/users/profile`, {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          
          if (user.data.success) {
            dispatch(addUser(user.data.data));
            
            // Navigate to the page user was trying to access or default to feed
            navigate(from);
          }
        } catch (userError) {
          console.error("Failed to fetch user profile:", userError);
          setIsLoading(false);
          addToast("error", "Failed to load profile. Please try again.");
        }
      }
    } catch (error) {
      setIsLoading(false);
      const response = error.response?.data;
      if (response?.message) {
        if (Array.isArray(response.message)) {
          // Validation errors - show multiple warning toasts
          response.message.forEach((msg) => {
            addToast("warning", msg);
          });
        } else {
          // Single error message
          addToast("error", response.message);
        }
      } else {
        addToast("error", "An unexpected error occurred");
      }
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !isLoading) {
      handleLogin();
    }
  };

  const inputConfig = getInputConfig();

  return (
    <div className="flex items-center justify-center relative px-4 py-6">
      <Loader isLoading={isLoading} message="Logging you in..." />
      
      <div className="card bg-base-300 w-full max-w-md md:max-w-lg shadow-xl rounded-lg">
        <div className="card-body p-5 sm:p-6 md:p-8">
          {/* Header */}
          <div className="text-center mb-4 md:mb-6">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-base-content">
              Welcome Back
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-base-content/70 mt-1">
              Sign in to continue to DevTinder
            </p>
          </div>

          {/* Tabs for selecting login method */}
          <div
            role="tablist"
            className="tabs tabs-boxed bg-base-200 p-1 mb-4"
            aria-label="Login method selector"
          >
            <button
              role="tab"
              aria-selected={loginMethod === "email"}
              className={`tab flex-1 ${
                loginMethod === "email" ? "tab-active" : ""
              }`}
              onClick={() => {
                setLoginMethod("email");
                setIdentifier("");
                setErrors({});
              }}
            >
              <svg className="w-4 h-4 mr-1 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span className="hidden sm:inline">Email</span>
            </button>
            <button
              role="tab"
              aria-selected={loginMethod === "username"}
              className={`tab flex-1 ${
                loginMethod === "username" ? "tab-active" : ""
              }`}
              onClick={() => {
                setLoginMethod("username");
                setIdentifier("");
                setErrors({});
              }}
            >
              <svg className="w-4 h-4 mr-1 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="hidden sm:inline">Username</span>
            </button>
            <button
              role="tab"
              aria-selected={loginMethod === "phone"}
              className={`tab flex-1 ${
                loginMethod === "phone" ? "tab-active" : ""
              }`}
              onClick={() => {
                setLoginMethod("phone");
                setIdentifier("");
                setErrors({});
              }}
            >
              <svg className="w-4 h-4 mr-1 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span className="hidden sm:inline">Phone</span>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-3 md:space-y-4">
            {/* Dynamic input based on selection */}
            <div className="form-control">
              <label className="label pb-1">
                <span className="label-text text-sm font-medium">{inputConfig.label}</span>
              </label>
              <input
                type={inputConfig.type}
                className={`input input-bordered w-full ${
                  errors.identifier ? "input-error" : ""
                }`}
                placeholder={inputConfig.placeholder}
                value={identifier}
                onChange={(e) => {
                  setIdentifier(e.target.value);
                  if (errors.identifier) {
                    setErrors({ ...errors, identifier: "" });
                  }
                }}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
                autoComplete={loginMethod === "email" ? "email" : "username"}
                aria-invalid={errors.identifier ? "true" : "false"}
                aria-describedby={errors.identifier ? "identifier-error" : undefined}
              />
              {errors.identifier && (
                <label className="label">
                  <span id="identifier-error" className="label-text-alt text-error">
                    {errors.identifier}
                  </span>
                </label>
              )}
            </div>

            {/* Password input with visibility toggle */}
            <div className="form-control">
              <label className="label pb-1">
                <span className="label-text text-sm font-medium">Password</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className={`input input-bordered w-full pr-12 ${
                    errors.password ? "input-error" : ""
                  }`}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) {
                      setErrors({ ...errors, password: "" });
                    }
                  }}
                  onKeyPress={handleKeyPress}
                  disabled={isLoading}
                  autoComplete="current-password"
                  aria-invalid={errors.password ? "true" : "false"}
                  aria-describedby={errors.password ? "password-error" : undefined}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 btn btn-ghost btn-sm btn-circle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && (
                <label className="label">
                  <span id="password-error" className="label-text-alt text-error">
                    {errors.password}
                  </span>
                </label>
              )}
            </div>

            {/* Links - Side by side on desktop */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1 sm:gap-2 text-xs sm:text-sm pt-1">
              <Link 
                to="/forgot-password" 
                className="text-primary hover:underline focus:underline focus:outline-none"
                tabIndex={0}
              >
                Forgot password?
              </Link>
              <Link 
                to="/signup" 
                className="text-primary hover:underline focus:underline focus:outline-none"
                tabIndex={0}
              >
                Don't have an account?
              </Link>
            </div>

            {/* Submit button */}
            <div className="card-actions pt-3">
              <button 
                type="submit"
                className="btn btn-primary w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Logging in...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    Login
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
