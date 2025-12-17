import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { getStoredAuth } from "../utils/authUtils";
import { BASE_URL } from "../utils/constants";
import { setMutualConnections } from "../utils/mutualConnectionSlice";
import ConnectionCard from "./ConnectionCard";
import { DisconnectButton } from "./ConnectionActions";

const MutualConnections = () => {
  const connections = useSelector((store) => store.mutualConnection);
  const loggedInUser = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const { accessToken } = getStoredAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMutualConnections = async () => {
    if (connections) return;

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`${BASE_URL}/connections`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // API returns data directly without success flag
      if (response.data.data && Array.isArray(response.data.data)) {
        dispatch(setMutualConnections(response.data.data));
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch mutual connections");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMutualConnections();
  }, []);

  // Helper function to extract the connected user (not the logged-in user)
  const getConnectedUser = (connection) => {
    if (!loggedInUser) return null;

    const loggedInUserId = loggedInUser._id;

    // Determine which user is the connected user (not the logged-in user)
    const connectedUserData =
      connection.fromUserId._id === loggedInUserId
        ? connection.toUserId
        : connection.fromUserId;

    // Transform to match ConnectionCard's expected format
    return {
      id: connectedUserData._id,
      firstName: connectedUserData.firstName,
      lastName: connectedUserData.lastName,
      username: connectedUserData.username,
      profilePhoto: connectedUserData.profilePhoto || "/default-avatar.png",
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
            No mutual connections yet
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {connections.map((connection) => {
        const connectedUser = getConnectedUser(connection);
        if (!connectedUser) return null;

        return (
          <ConnectionCard
            key={connection._id}
            user={connectedUser}
            actions={<DisconnectButton connection={connection} />}
          />
        );
      })}
    </div>
  );
};

export default MutualConnections;
