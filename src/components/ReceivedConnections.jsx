import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { getStoredAuth } from "../utils/authUtils";
import { BASE_URL } from "../utils/constants";
import { setreceivedConnections } from "../utils/receivedConnectionSlice";
import ConnectionCard from "./ConnectionCard";
import { AcceptRejectButtons } from "./ConnectionActions";

const ReceivedConnections = () => {
  const connections = useSelector((store) => store.receivedConnection);
  const dispatch = useDispatch();
  const { accessToken } = getStoredAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchReceivedConnections = async () => {
    if (connections) return;

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`${BASE_URL}/connections/received`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // API returns data directly without success flag
      if (response.data.data && Array.isArray(response.data.data)) {
        dispatch(setreceivedConnections(response.data.data));
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch received connections");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReceivedConnections();
  }, []);

  // Helper function to extract the sender user from fromUserId
  const getSenderUser = (connection) => {
    // For received connections, fromUserId is always the sender
    const senderData = connection.fromUserId;

    // Transform to match ConnectionCard's expected format
    return {
      id: senderData._id,
      firstName: senderData.firstName,
      lastName: senderData.lastName,
      username: senderData.username,
      profilePhoto: senderData.profilePhoto || "/default-avatar.png",
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
            No received connection requests
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {connections.map((connection) => {
        const senderUser = getSenderUser(connection);

        return (
          <ConnectionCard
            key={connection._id}
            user={senderUser}
            actions={<AcceptRejectButtons connection={connection} />}
          />
        );
      })}
    </div>
  );
};

export default ReceivedConnections;
