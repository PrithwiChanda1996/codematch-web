import React, { useEffect } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { getStoredAuth } from "../utils/authUtils";
import { BASE_URL } from "../utils/constants";
import { setFeed } from "../utils/feedSlice";
import UserCard from "./userCard";
import FeedActions from "./FeedActions";

const Feed = () => {
  const feed = useSelector((store) => store.feed);
  const dispatch = useDispatch();
  const { accessToken } = getStoredAuth();
  const getFeed = async () => {
    if (feed) return;
    const baseUrl = BASE_URL;
    try {
      const response = await axios.get(`${baseUrl}/users/suggestions`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response.data.success) {
        dispatch(setFeed(response.data.data));
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getFeed();
  }, []);
  return (
    <div className="flex justify-center my-4 pb-13">
      {feed && feed[0] ? (
        <UserCard user={feed[0]} actions={<FeedActions user={feed[0]} />} />
      ) : (
        <div className="card bg-base-300 w-96 shadow-sm rounded-md p-8">
          <div className="text-center space-y-4">
            <h2 className="text-xl font-semibold">No more users to show</h2>
            <p className="text-gray-400">Reload to see fresh suggestions</p>
            <button
              onClick={() => window.location.reload()}
              className="btn btn-primary"
            >
              Reload Feed
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Feed;
