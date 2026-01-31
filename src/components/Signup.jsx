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
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
  const { addToast } = useToast();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Client-side validation
  const validateForm = () => {
    const newErrors = {};
    
    if (!firstName.trim()) {
      newErrors.firstName = "First name is required";
    }
    
    if (!lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }
    
    if (!username.trim()) {
      newErrors.username = "Username is required";
    } else if (username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }
    
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email";
    }
    
    if (!mobileNumber.trim()) {
      newErrors.mobileNumber = "Mobile number is required";
    } else if (!/^[0-9]{10,15}$/.test(mobileNumber)) {
      newErrors.mobileNumber = "Please enter a valid mobile number";
    }
    
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async (e) => {
    e?.preventDefault(); // Support form submission
    
    // Validate before submitting
    if (!validateForm()) {
      addToast("warning", "Please fix the errors before submitting");
      return;
    }

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

        // Step 2: Fetch user profile and dispatch to Redux
        try {
          const user = await axios.get(`${baseUrl}/users/profile`, {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          
          if (user.data.success) {
            dispatch(addUser(user.data.data));
            
            // Step 3: Navigate to edit-profile
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

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !isLoading) {
      handleSignup();
    }
  };

  return (
    <div className="flex items-center justify-center relative px-3 py-4">
      <Loader isLoading={isLoading} message="Creating your account..." />

      <div className="card bg-base-300 w-full max-w-2xl md:max-w-3xl shadow-xl rounded-lg">
        <div className="card-body p-4 sm:p-6 md:p-8">
          {/* Header */}
          <div className="text-center mb-3 md:mb-5">
            <h2 className="text-lg sm:text-2xl md:text-3xl font-bold text-base-content">
              Create Account
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-base-content/70 mt-0.5">
              Join CodeMatch to connect with developers
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSignup} className="space-y-2.5 md:space-y-4">
            {/* Two-column grid on tablet and desktop */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 md:gap-4">
              {/* First Name */}
              <div className="form-control">
                <label className="label pb-0.5 pt-0">
                  <span className="label-text text-xs sm:text-sm font-medium">First Name</span>
                </label>
                <input
                  type="text"
                  className={`input input-bordered input-sm sm:input-md w-full ${
                    errors.firstName ? "input-error" : ""
                  }`}
                  placeholder="First name"
                  value={firstName}
                  onChange={(e) => {
                    setFirstName(e.target.value);
                    if (errors.firstName) {
                      setErrors({ ...errors, firstName: "" });
                    }
                  }}
                  onKeyPress={handleKeyPress}
                  disabled={isLoading}
                  autoComplete="given-name"
                  aria-invalid={errors.firstName ? "true" : "false"}
                  aria-describedby={errors.firstName ? "firstName-error" : undefined}
                />
                {errors.firstName && (
                  <label className="label py-0">
                    <span id="firstName-error" className="label-text-alt text-error text-xs">
                      {errors.firstName}
                    </span>
                  </label>
                )}
              </div>

              {/* Last Name */}
              <div className="form-control">
                <label className="label pb-0.5 pt-0">
                  <span className="label-text text-xs sm:text-sm font-medium">Last Name</span>
                </label>
                <input
                  type="text"
                  className={`input input-bordered input-sm sm:input-md w-full ${
                    errors.lastName ? "input-error" : ""
                  }`}
                  placeholder="Last name"
                  value={lastName}
                  onChange={(e) => {
                    setLastName(e.target.value);
                    if (errors.lastName) {
                      setErrors({ ...errors, lastName: "" });
                    }
                  }}
                  onKeyPress={handleKeyPress}
                  disabled={isLoading}
                  autoComplete="family-name"
                  aria-invalid={errors.lastName ? "true" : "false"}
                  aria-describedby={errors.lastName ? "lastName-error" : undefined}
                />
                {errors.lastName && (
                  <label className="label py-0">
                    <span id="lastName-error" className="label-text-alt text-error text-xs">
                      {errors.lastName}
                    </span>
                  </label>
                )}
              </div>
            </div>

            {/* Username - Full width */}
            <div className="form-control">
              <label className="label pb-0.5 pt-0">
                <span className="label-text text-xs sm:text-sm font-medium">Username</span>
              </label>
              <input
                type="text"
                className={`input input-bordered input-sm sm:input-md w-full ${
                  errors.username ? "input-error" : ""
                }`}
                placeholder="Username"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  if (errors.username) {
                    setErrors({ ...errors, username: "" });
                  }
                }}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
                autoComplete="username"
                aria-invalid={errors.username ? "true" : "false"}
                aria-describedby={errors.username ? "username-error" : undefined}
              />
              {errors.username && (
                <label className="label py-0">
                  <span id="username-error" className="label-text-alt text-error text-xs">
                    {errors.username}
                  </span>
                </label>
              )}
            </div>

            {/* Two-column grid for email and phone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 md:gap-4">
              {/* Email */}
              <div className="form-control">
                <label className="label pb-0.5 pt-0">
                  <span className="label-text text-xs sm:text-sm font-medium">Email</span>
                </label>
                <input
                  type="email"
                  className={`input input-bordered input-sm sm:input-md w-full ${
                    errors.email ? "input-error" : ""
                  }`}
                  placeholder="Email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) {
                      setErrors({ ...errors, email: "" });
                    }
                  }}
                  onKeyPress={handleKeyPress}
                  disabled={isLoading}
                  autoComplete="email"
                  aria-invalid={errors.email ? "true" : "false"}
                  aria-describedby={errors.email ? "email-error" : undefined}
                />
                {errors.email && (
                  <label className="label py-0">
                    <span id="email-error" className="label-text-alt text-error text-xs">
                      {errors.email}
                    </span>
                  </label>
                )}
              </div>

              {/* Mobile Number */}
              <div className="form-control">
                <label className="label pb-0.5 pt-0">
                  <span className="label-text text-xs sm:text-sm font-medium">Mobile</span>
                </label>
                <input
                  type="tel"
                  className={`input input-bordered input-sm sm:input-md w-full ${
                    errors.mobileNumber ? "input-error" : ""
                  }`}
                  placeholder="Phone"
                  value={mobileNumber}
                  onChange={(e) => {
                    setMobileNumber(e.target.value);
                    if (errors.mobileNumber) {
                      setErrors({ ...errors, mobileNumber: "" });
                    }
                  }}
                  onKeyPress={handleKeyPress}
                  disabled={isLoading}
                  autoComplete="tel"
                  aria-invalid={errors.mobileNumber ? "true" : "false"}
                  aria-describedby={errors.mobileNumber ? "mobileNumber-error" : undefined}
                />
                {errors.mobileNumber && (
                  <label className="label py-0">
                    <span id="mobileNumber-error" className="label-text-alt text-error text-xs">
                      {errors.mobileNumber}
                    </span>
                  </label>
                )}
              </div>
            </div>

            {/* Password with visibility toggle */}
            <div className="form-control">
              <label className="label pb-0.5 pt-0">
                <span className="label-text text-xs sm:text-sm font-medium">Password</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className={`input input-bordered input-sm sm:input-md w-full pr-10 ${
                    errors.password ? "input-error" : ""
                  }`}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) {
                      setErrors({ ...errors, password: "" });
                    }
                  }}
                  onKeyPress={handleKeyPress}
                  disabled={isLoading}
                  autoComplete="new-password"
                  aria-invalid={errors.password ? "true" : "false"}
                  aria-describedby={errors.password ? "password-error" : undefined}
                />
                <button
                  type="button"
                  className="absolute right-2 top-1/2 -translate-y-1/2 btn btn-ghost btn-xs sm:btn-sm btn-circle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.542 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && (
                <label className="label py-0">
                  <span id="password-error" className="label-text-alt text-error text-xs">
                    {errors.password}
                  </span>
                </label>
              )}
            </div>

            {/* Already have account link */}
            <div className="text-center text-xs pt-0.5">
              <Link 
                to="/login" 
                className="text-primary hover:underline focus:underline focus:outline-none"
                tabIndex={0}
              >
                Already have an account? Login
              </Link>
            </div>

            {/* Submit button */}
            <div className="card-actions pt-1.5">
              <button 
                type="submit"
                className="btn btn-primary btn-sm sm:btn-md w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="loading loading-spinner loading-xs sm:loading-sm"></span>
                    <span className="text-xs sm:text-sm">Signing up...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                    <span className="text-xs sm:text-sm">Create Account</span>
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

export default Signup;
