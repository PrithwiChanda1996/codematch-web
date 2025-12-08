import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { useRef } from "react";
import axios from "axios";
import { addUser, removeUser } from "../utils/userSlice";
import { BASE_URL } from "../utils/constants";
import {
  getStoredAuth,
  clearStoredAuth,
  setStoredAuth,
} from "../utils/authUtils";
import { useToast } from "../context/ToastContext";

export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const { addToast } = useToast();
  const restoringSession = useRef(false);

  // Refresh access token using refresh token (httpOnly cookie)
  const refreshAccessToken = async () => {
    try {
      const res = await axios.post(
        `${BASE_URL}/auth/refresh-token`,
        {},
        {
          withCredentials: true,
        }
      );

      if (res.data.success) {
        const { accessToken } = res.data.data;
        setStoredAuth({ accessToken });
        return accessToken;
      }
      return null;
    } catch (error) {
      console.error("Token refresh failed:", error);
      return null;
    }
  };

  // Fetch user profile using access token
  const fetchUserProfile = async (accessToken) => {
    try {
      const res = await axios.get(`${BASE_URL}/users/profile`, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (res.data.success) {
        dispatch(addUser(res.data.data));
        return true;
      }
      return false;
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
      return false;
    }
  };

  // Restore session from localStorage
  const restoreSession = async () => {
    // Skip if user already loaded in Redux
    if (user) {
      console.log("User already in state, skipping session restore");
      return true;
    }

    // Skip if already restoring
    if (restoringSession.current) {
      console.log("Session restoration already in progress");
      return false;
    }

    // Set flag to prevent concurrent calls
    restoringSession.current = true;

    try {
      const { accessToken } = getStoredAuth();

      // Scenario 1: localStorage has accessToken - try to fetch profile
      if (accessToken) {
        const success = await fetchUserProfile(accessToken);

        if (success) {
          console.log("Session restored from localStorage");
          return true;
        }

        // Access token expired or invalid - try refresh
        console.log("Access token expired, attempting refresh...");
        const newToken = await refreshAccessToken();

        if (newToken) {
          const retrySuccess = await fetchUserProfile(newToken);
          if (retrySuccess) {
            console.log("Session restored after token refresh");
            return true;
          }
        }
      }

      // Scenario 2: localStorage is empty but refresh token cookie might exist
      console.log("Attempting session recovery from refresh token cookie...");

      const newToken = await refreshAccessToken();

      if (newToken) {
        const success = await fetchUserProfile(newToken);
        if (success) {
          console.log("Session recovered successfully from refresh token!");
          return true;
        }
      }

      // All recovery attempts failed
      if (accessToken) {
        // Had a token but all recovery failed - clean up on backend too
        console.log("Session restoration failed - logging out");
        handleLogout();
      } else {
        // Never had a session - just return false without calling logout API
        console.log("No session to restore");
      }
      return false;
    } finally {
      // Always reset flag when done
      restoringSession.current = false;
    }
  };

  // Logout function
  const handleLogout = async () => {
    try {
      // Get accessToken from localStorage
      const { accessToken } = getStoredAuth();

      // Call logout API to clear refresh token cookie on backend
      await axios.post(
        `${BASE_URL}/auth/logout`,
        {},
        {
          withCredentials: true,
          headers: accessToken
            ? { Authorization: `Bearer ${accessToken}` }
            : {},
        }
      );
    } catch (error) {
      console.error("Logout API call failed:", error);
      // Continue with logout even if API call fails
    }

    // Clear local storage and Redux state
    clearStoredAuth();
    dispatch(removeUser());
    restoringSession.current = false; // Reset restoration flag
    navigate("/login");
  };

  return { user, restoreSession, handleLogout, refreshAccessToken };
};
