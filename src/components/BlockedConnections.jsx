import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { getStoredAuth } from "../utils/authUtils";
import { BASE_URL } from "../utils/constants";
import { setBlockedConnections } from "../utils/blockedConnectionSlice";
import ConnectionCard from "./ConnectionCard";
import { UnblockButton } from "./ConnectionActions";
import defaultAvatar from "../assets/logo/default-avatar.svg";

const BlockedConnections = () => {
  const connections = useSelector((store) => store.blockedConnection);
  const dispatch = useDispatch();
  const { accessToken } = getStoredAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchBlockedConnections = async () => {
    if (connections) return;

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`${BASE_URL}/connections/blocked`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // API returns data directly without success flag
      if (response.data.data && Array.isArray(response.data.data)) {
        dispatch(setBlockedConnections(response.data.data));
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch blocked users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlockedConnections();
  }, []);

  // Helper function to extract the blocked user
  const getBlockedUser = (connection) => {
    // For blocked connections, toUserId contains the blocked user's data
    const blockedUserData = connection.toUserId;

    // Transform to match ConnectionCard's expected format
    return {
      id: blockedUserData._id,
      firstName: blockedUserData.firstName,
      lastName: blockedUserData.lastName,
      username: blockedUserData.username,
      profilePhoto: blockedUserData.profilePhoto || defaultAvatar,
    };
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="alert alert-error">
          <span>{error}</span>
        </div>
      </div>
    );
  }

  if (!connections || connections.length === 0) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="text-center">
          <p className="text-lg text-base-content/70">
            No blocked users
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {connections.map((connection) => {
        const blockedUser = getBlockedUser(connection);

        return (
          <ConnectionCard
            key={connection._id}
            user={blockedUser}
            actions={<UnblockButton user={blockedUser} connectionId={connection._id} />}
          />
        );
      })}
    </div>
  );
};

export default BlockedConnections;
