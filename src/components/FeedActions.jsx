import React from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { getStoredAuth } from "../utils/authUtils";
import { BASE_URL } from "../utils/constants";
import { removeFirstUserFromFeed } from "../utils/feedSlice";
import { removesentConnections } from "../utils/sentConnectionSlice";
import { useToast } from "../context/ToastContext";
import connect from "../assets/icons/connect.png";
import block from "../assets/icons/block.png";
import ignore from "../assets/icons/ignore.png";

const FeedActions = ({ user }) => {
  const dispatch = useDispatch();
  const { addToast } = useToast();

  const handleConnect = async () => {
    const { accessToken } = getStoredAuth();
    try {
      const response = await axios.post(
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

  return (
    <>
      <button
        onClick={handleConnect}
        className="btn flex flex-col items-center justify-center p-4 h-auto min-h-[90px] w-24 gap-2"
      >
        <img src={connect} className="w-6 h-6" alt="Connect" />
        <span className="text-sm">Connect</span>
      </button>

      <button
        onClick={handleIgnore}
        className="btn flex flex-col items-center justify-center p-4 h-auto min-h-[90px] w-24 gap-2"
      >
        <img src={ignore} className="w-6 h-6" alt="Ignore" />
        <span className="text-sm">Ignore</span>
      </button>

      <button className="btn flex flex-col items-center justify-center p-4 h-auto min-h-[90px] w-24 gap-2">
        <img src={block} className="w-6 h-6" alt="Block" />
        <span className="text-sm">Block</span>
      </button>
    </>
  );
};

export default FeedActions;
