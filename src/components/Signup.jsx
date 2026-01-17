import axios from "axios";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router";

import { useToast } from "../context/ToastContext";
import { addUser } from "../utils/userSlice";
import { BASE_URL } from "../utils/constants";
import { setStoredAuth } from "../utils/authUtils";
import Loader from "./Loader";

const Signup = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { addToast } = useToast();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSignup = async () => {
    const payload = {
      firstName,
      lastName,
      username,
      email,
      mobileNumber,
      password,
    };

    setIsLoading(true);

    try {
      const baseUrl = BASE_URL;
      
      // Step 1: Signup API call
      const res = await axios.post(`${baseUrl}/auth/signup`, payload, {
        withCredentials: true,
      });
      
      if (res.data.success) {
        const { accessToken } = res.data.data;

        // Store access token in localStorage
        setStoredAuth({ accessToken });

        // Show success toast
        addToast("success", res.data.message);

        // Step 2: Fetch user profile and dispatch to Redux (while loader is still showing)
        try {
          const user = await axios.get(`${baseUrl}/users/profile`, {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          
          if (user.data.success) {
            dispatch(addUser(user.data.data));
            
            // Step 3: Navigate to edit-profile (Redux already has user data)
            navigate("/edit-profile");
          }
        } catch (userError) {
          console.error("Failed to fetch user profile:", userError);
          addToast("error", "Failed to load profile. Please try logging in.");
          setIsLoading(false);
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

  return (
    <div className="min-h-screen flex items-center justify-center relative">
      <Loader isLoading={isLoading} message="Creating your account..." />

      <div className="card card-dash bg-base-300 w-96 ">
        <div className="card-body">
          <h2 className="card-title flex items-center justify-center">
            Sign Up
          </h2>

          {/* First Name */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">First Name</span>
            </label>
            <input
              type="text"
              className="input input-bordered"
              placeholder="Enter your first name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>

          {/* Last Name */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Last Name</span>
            </label>
            <input
              type="text"
              className="input input-bordered"
              placeholder="Enter your last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>

          {/* Username */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Username</span>
            </label>
            <input
              type="text"
              className="input input-bordered"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          {/* Email */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <input
              type="email"
              className="input input-bordered"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Mobile Number */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Mobile Number</span>
            </label>
            <input
              type="tel"
              className="input input-bordered"
              placeholder="Enter your mobile number"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
            />
          </div>

          {/* Password */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Password</span>
            </label>
            <input
              type="password"
              className="input input-bordered"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Link to="/login" className="text-sm text-gray-500 text-right">
              <p>Already have an account?</p>
            </Link>
          </div>

          <div className="card-actions justify-end mt-2">
            <button 
              className="btn btn-primary" 
              onClick={handleSignup}
              disabled={isLoading}
            >
              {isLoading ? "Signing up..." : "Sign Up"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;