import axios from "axios";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";

import { useToast } from "../context/ToastContext";
import { addUser } from "../utils/userSlice";
import { BASE_URL } from "../utils/constants";
const Login = () => {
  const [loginMethod, setLoginMethod] = useState("email");
  const [identifier, setIdentifier] = useState("john.doe@example.com");
  const [password, setPassword] = useState("SecurePass123");
  const { addToast } = useToast();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const getInputConfig = () => {
    switch (loginMethod) {
      case "email":
        return { type: "email", placeholder: "Enter your email" };
      case "username":
        return { type: "text", placeholder: "Enter your username" };
      case "phone":
        return { type: "tel", placeholder: "Enter your phone number" };
      default:
        return { type: "text", placeholder: "Enter identifier" };
    }
  };

  const handleLogin = async () => {
    const payloadKey = loginMethod === "phone" ? "mobileNumber" : loginMethod;
    const payload = {
      [payloadKey]: identifier,
      password,
    };

    try {
      const baseUrl = BASE_URL;
      const res = await axios.post(`${baseUrl}/auth/login`, payload, {
        withCredentials: true,
      });
      if (res.data.success) {
        const { id, username, accessToken } = res.data.data;
        
        // Store user info and token in localStorage
        localStorage.setItem("userId", id);
        localStorage.setItem("username", username);
        localStorage.setItem("accessToken", accessToken);
        
        // Show success toast immediately
        addToast("success", res.data.message);
        
        // Fetch full user profile (non-blocking)
        try {
          const user = await axios.get(`${baseUrl}/users/${id}`, {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          if (user.data.success) {
            dispatch(addUser(user.data.data));
          }
          navigate("/feed");
        } catch (userError) {
          console.error("Failed to fetch user profile:", userError);
          // Don't show error toast - login was still successful
        }
      }
    } catch (error) {
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

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="card card-dash bg-base-300 w-96 ">
        <div className="card-body">
          <h2 className="card-title flex items-center justify-center">Login</h2>

          {/* Tabs for selecting login method */}
          <div
            role="tablist"
            className="tabs tabs-boxed flex items-center justify-center"
          >
            <button
              role="tab"
              className={`tab ${
                loginMethod === "email" ? "tab-active" : ""
              }  bg-base-200`}
              onClick={() => {
                setLoginMethod("email");
                setIdentifier("");
              }}
            >
              Email
            </button>
            <button
              role="tab"
              className={`tab ${
                loginMethod === "username" ? "tab-active" : ""
              }  bg-base-200`}
              onClick={() => {
                setLoginMethod("username");
                setIdentifier("");
              }}
            >
              Username
            </button>
            <button
              role="tab"
              className={`tab ${
                loginMethod === "phone" ? "tab-active" : ""
              }  bg-base-200`}
              onClick={() => {
                setLoginMethod("phone");
                setIdentifier("");
              }}
            >
              Phone
            </button>
          </div>

          {/* Dynamic input based on selection */}
          <div className="form-control mt-2">
            <label className="label">
              <span className="label-text capitalize">{loginMethod}</span>
            </label>
            <input
              type={getInputConfig().type}
              className="input input-bordered"
              placeholder={getInputConfig().placeholder}
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Password</span>
            </label>
            <input
              type="password"
              className="input input-bordered"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <p className="text-sm text-gray-500 text-right">Forgot password?</p>
            <p className="text-sm text-gray-500 text-right">
              Don't have an account?
            </p>
          </div>
          <div className="card-actions justify-end mt-2">
            <button className="btn btn-primary" onClick={handleLogin}>
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
