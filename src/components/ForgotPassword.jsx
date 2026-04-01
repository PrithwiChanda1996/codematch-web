import axios from "axios";
import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router";

import { useToast } from "../context/ToastContext";
import { BASE_URL } from "../utils/constants";
import Loader from "./Loader";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverMessage, setServerMessage] = useState(null);

  const { addToast } = useToast();
  const successRef = useRef(null);

  useEffect(() => {
    if (serverMessage && successRef.current) {
      successRef.current.focus();
    }
  }, [serverMessage]);

  const validateForm = () => {
    const newErrors = {};
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();

    if (!validateForm()) {
      addToast("warning", "Please fix the errors before submitting");
      return;
    }

    setIsLoading(true);
    setServerMessage(null);

    try {
      const res = await axios.post(
        `${BASE_URL}/auth/forgot-password`,
        { email: email.trim() },
        { withCredentials: true }
      );

      if (res.data?.success && res.data?.message) {
        setServerMessage(res.data.message);
      }
    } catch (error) {
      const status = error.response?.status;
      const response = error.response?.data;

      if (status === 500) {
        addToast(
          "error",
          "We could not send the email right now. Please try again in a moment."
        );
      } else if (response?.message) {
        if (Array.isArray(response.message)) {
          response.message.forEach((msg) => addToast("warning", msg));
        } else {
          addToast("error", response.message);
        }
      } else {
        addToast("error", "An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center relative px-4 py-6">
      <Loader isLoading={isLoading} message="Sending instructions..." />

      <div className="card bg-base-300 w-full max-w-md md:max-w-lg shadow-xl rounded-lg">
        <div className="card-body p-5 sm:p-6 md:p-8">
          <div className="text-center mb-4 md:mb-6">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-base-content">
              Forgot password
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-base-content/70 mt-1">
              Enter your email and we&apos;ll send reset instructions if an
              account exists.
            </p>
          </div>

          {serverMessage ? (
            <div
              ref={successRef}
              tabIndex={-1}
              role="status"
              className="alert alert-success text-sm"
            >
              <span>{serverMessage}</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
              <div className="form-control">
                <label className="label pb-1" htmlFor="forgot-email">
                  <span className="label-text text-sm font-medium">
                    Email address
                  </span>
                </label>
                <input
                  id="forgot-email"
                  type="email"
                  className={`input input-bordered w-full ${
                    errors.email ? "input-error" : ""
                  }`}
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) {
                      setErrors({ ...errors, email: "" });
                    }
                  }}
                  disabled={isLoading}
                  autoComplete="email"
                  aria-invalid={errors.email ? "true" : "false"}
                  aria-describedby={
                    errors.email ? "forgot-email-error" : undefined
                  }
                />
                {errors.email && (
                  <label className="label">
                    <span
                      id="forgot-email-error"
                      className="label-text-alt text-error"
                    >
                      {errors.email}
                    </span>
                  </label>
                )}
              </div>

              <div className="card-actions pt-3">
                <button
                  type="submit"
                  className="btn btn-primary w-full"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="loading loading-spinner loading-sm"></span>
                      Sending...
                    </>
                  ) : (
                    "Send reset instructions"
                  )}
                </button>
              </div>
            </form>
          )}

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs sm:text-sm pt-4 border-t border-base-content/10 mt-4">
            <Link
              to="/login"
              className="text-primary hover:underline focus:underline focus:outline-none"
            >
              Back to login
            </Link>
            <Link
              to="/signup"
              className="text-primary hover:underline focus:underline focus:outline-none"
            >
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
