import React, { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { getStoredAuth } from "../utils/authUtils";
import { BASE_URL } from "../utils/constants";
import { removeFirstUserFromFeed } from "../utils/feedSlice";
import { removesentConnections } from "../utils/sentConnectionSlice";
import { useToast } from "../context/ToastContext";
import Modal from "./Modal";
import connect from "../assets/icons/connect.png";
import block from "../assets/icons/block.png";
import ignore from "../assets/icons/ignore.png";
import { removeBlockedConnections } from "../utils/blockedConnectionSlice";

const FeedActions = ({ user }) => {
  const dispatch = useDispatch();
  const { addToast } = useToast();
  const [showBlockModal, setShowBlockModal] = useState(false);

  const handleConnect = async () => {
    const { accessToken } = getStoredAuth();
    try {
      await axios.post(
        `${BASE_URL}/connections/send`,
        { toUserId: user._id },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      dispatch(removeFirstUserFromFeed());
      dispatch(removesentConnections());
      addToast("success", "Connection request sent successfully!");
    } catch (error) {
      console.error("Error sending connection request:", error);
      addToast(
        "error",
        error.response?.data?.message || "Failed to send connection request"
      );
    }
  };

  const handleIgnore = () => {
    dispatch(removeFirstUserFromFeed());
  };

  const handleBlock = () => {
    setShowBlockModal(true);
  };

  const handleConfirmBlock = async () => {
    const { accessToken } = getStoredAuth();
    try {
      await axios.post(
        `${BASE_URL}/connections/block/${user._id}`,
        {},
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      dispatch(removeFirstUserFromFeed());
      dispatch(removeBlockedConnections());
      addToast("success", "User blocked successfully!");
      setShowBlockModal(false);
    } catch (error) {
      console.error("Error blocking user:", error);
      addToast(
        "error",
        error.response?.data?.message || "Failed to block user"
      );
    }
  };

  return (
    <>
      {/* Connect Button with Label */}
      <div className="flex flex-col items-center gap-1.5">
        <button
          onClick={handleConnect}
          className="btn btn-circle bg-base-200 hover:bg-base-300 border-2 border-base-content/10 hover:border-primary flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 hover:scale-110 transition-all shadow-lg p-0 overflow-hidden"
          aria-label="Send connection request"
          title="Connect"
        >
          <img
            src={connect}
            className="w-full h-full object-cover"
            alt=""
            aria-hidden="true"
          />
        </button>
        <span className="text-xs font-medium text-base-content/70">
          Connect
        </span>
      </div>

      {/* Ignore Button with Label */}
      <div className="flex flex-col items-center gap-1.5">
        <button
          onClick={handleIgnore}
          className="btn btn-circle bg-base-200 hover:bg-base-300 border-2 border-base-content/10 hover:border-warning flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 hover:scale-110 transition-all shadow-lg p-0 overflow-hidden"
          aria-label="Ignore this profile"
          title="Ignore"
        >
          <img
            src={ignore}
            className="w-full h-full object-cover"
            alt=""
            aria-hidden="true"
          />
        </button>
        <span className="text-xs font-medium text-base-content/70">
          Ignore
        </span>
      </div>

      {/* Block Button with Label */}
      <div className="flex flex-col items-center gap-1.5">
        <button
          onClick={handleBlock}
          className="btn btn-circle bg-base-200 hover:bg-base-300 border-2 border-base-content/10 hover:border-error flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 hover:scale-110 transition-all shadow-lg p-0 overflow-hidden"
          aria-label="Block this user"
          title="Block"
        >
          <img
            src={block}
            className="w-full h-full object-cover"
            alt=""
            aria-hidden="true"
          />
        </button>
        <span className="text-xs font-medium text-base-content/70">
          Block
        </span>
      </div>

      {/* Block Confirmation Modal */}
      <Modal
        isOpen={showBlockModal}
        onClose={() => setShowBlockModal(false)}
        title="Block User"
        message={`Are you sure you want to block ${
          user?.firstName + " " + user?.lastName ||
          user?.username ||
          "this user"
        }?`}
        confirmText="Yes"
        cancelText="No"
        onConfirm={handleConfirmBlock}
        confirmButtonClass="btn-error"
        cancelButtonClass="btn-ghost"
      />
    </>
  );
};

export default FeedActions;
