import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { getStoredAuth } from "../utils/authUtils";
import { BASE_URL } from "../utils/constants";
import { setsentConnections } from "../utils/sentConnectionSlice";
import ConnectionCard from "./ConnectionCard";
import { CancelButton } from "./ConnectionActions";

const SentConnections = () => {
  const connections = useSelector((store) => store.sentConnection);
  const dispatch = useDispatch();
  const { accessToken } = getStoredAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSentConnections = async () => {
    if (connections) return;

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`${BASE_URL}/connections/sent`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // API returns data directly without success flag
      if (response.data.data && Array.isArray(response.data.data)) {
        dispatch(setsentConnections(response.data.data));
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch sent connections");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSentConnections();
  }, []);

  // Helper function to extract the recipient user from toUserId
  const getRecipientUser = (connection) => {
    // For sent connections, toUserId is always the recipient
    const recipientData = connection.toUserId;

    // Transform to match ConnectionCard's expected format
    return {
      id: recipientData._id,
      firstName: recipientData.firstName,
      lastName: recipientData.lastName,
      username: recipientData.username,
      profilePhoto: recipientData.profilePhoto || "/default-avatar.png",
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
            No sent connection requests
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {connections.map((connection) => {
        const recipientUser = getRecipientUser(connection);

        return (
          <ConnectionCard
            key={connection._id}
            user={recipientUser}
            actions={<CancelButton connection={connection} />}
          />
        );
      })}
    </div>
  );
};

export default SentConnections;
