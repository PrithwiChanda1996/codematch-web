import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";

import { useToast } from "../context/ToastContext";
import { BASE_URL } from "../utils/constants";
import Loader from "./Loader";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const { addToast } = useToast();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (confirmPassword !== password) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();

    if (!token) {
      return;
    }

    if (!validateForm()) {
      addToast("warning", "Please fix the errors before submitting");
      return;
    }

    setIsLoading(true);

    try {
      const res = await axios.post(
        `${BASE_URL}/auth/reset-password`,
        { token, newPassword: password },
        { withCredentials: true }
      );

      if (res.data?.success) {
        navigate("/login", {
          replace: true,
          state: { passwordResetSuccess: true },
        });
      }
    } catch (error) {
      const response = error.response?.data;
      const status = error.response?.status;

      if (status === 400) {
        addToast(
          "error",
          response?.message && !Array.isArray(response.message)
            ? response.message
            : "This reset link is invalid or has expired. Please request a new one."
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

  if (!token) {
    return (
      <div className="flex items-center justify-center relative px-4 py-6">
        <div className="card bg-base-300 w-full max-w-md md:max-w-lg shadow-xl rounded-lg">
          <div className="card-body p-5 sm:p-6 md:p-8">
            <div className="text-center mb-4">
              <h2 className="text-xl sm:text-2xl font-bold text-base-content">
                Reset link missing
              </h2>
              <p className="text-sm text-base-content/70 mt-2">
                This page needs a valid link from your email. The reset token
                was not found in the address.
              </p>
            </div>
            <div className="card-actions flex-col gap-2">
              <Link to="/forgot-password" className="btn btn-primary w-full">
                Request a new reset link
              </Link>
              <Link
                to="/login"
                className="btn btn-ghost w-full"
              >
                Back to login
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center relative px-4 py-6">
      <Loader isLoading={isLoading} message="Updating your password..." />

      <div className="card bg-base-300 w-full max-w-md md:max-w-lg shadow-xl rounded-lg">
        <div className="card-body p-5 sm:p-6 md:p-8">
          <div className="text-center mb-4 md:mb-6">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-base-content">
              Set a new password
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-base-content/70 mt-1">
              Choose a password with at least 6 characters.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
            <div className="form-control">
              <label className="label pb-1" htmlFor="reset-new-password">
                <span className="label-text text-sm font-medium">
                  New password
                </span>
              </label>
              <div className="relative">
                <input
                  id="reset-new-password"
                  type={showPassword ? "text" : "password"}
                  className={`input input-bordered w-full pr-12 ${
                    errors.password ? "input-error" : ""
                  }`}
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) {
                      setErrors({ ...errors, password: "" });
                    }
                  }}
                  disabled={isLoading}
                  autoComplete="new-password"
                  aria-invalid={errors.password ? "true" : "false"}
                  aria-describedby={
                    errors.password ? "reset-password-error" : undefined
                  }
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 btn btn-ghost btn-sm btn-circle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && (
                <label className="label">
                  <span
                    id="reset-password-error"
                    className="label-text-alt text-error"
                  >
                    {errors.password}
                  </span>
                </label>
              )}
            </div>

            <div className="form-control">
              <label className="label pb-1" htmlFor="reset-confirm-password">
                <span className="label-text text-sm font-medium">
                  Confirm password
                </span>
              </label>
              <div className="relative">
                <input
                  id="reset-confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  className={`input input-bordered w-full pr-12 ${
                    errors.confirmPassword ? "input-error" : ""
                  }`}
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (errors.confirmPassword) {
                      setErrors({ ...errors, confirmPassword: "" });
                    }
                  }}
                  disabled={isLoading}
                  autoComplete="new-password"
                  aria-invalid={errors.confirmPassword ? "true" : "false"}
                  aria-describedby={
                    errors.confirmPassword
                      ? "reset-confirm-password-error"
                      : undefined
                  }
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 btn btn-ghost btn-sm btn-circle"
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                  aria-label={
                    showConfirmPassword ? "Hide password" : "Show password"
                  }
                  tabIndex={-1}
                >
                  {showConfirmPassword ? (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <label className="label">
                  <span
                    id="reset-confirm-password-error"
                    className="label-text-alt text-error"
                  >
                    {errors.confirmPassword}
                  </span>
                </label>
              )}
            </div>

            <p className="text-xs text-base-content/60">
              If this link has expired (typically after about an hour),{" "}
              <Link
                to="/forgot-password"
                className="text-primary hover:underline"
              >
                request a new one
              </Link>
              .
            </p>

            <div className="card-actions pt-3">
              <button
                type="submit"
                className="btn btn-primary w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Saving...
                  </>
                ) : (
                  "Save new password"
                )}
              </button>
            </div>
          </form>

          <div className="text-center pt-4">
            <Link
              to="/login"
              className="text-primary text-sm hover:underline focus:underline focus:outline-none"
            >
              Back to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
