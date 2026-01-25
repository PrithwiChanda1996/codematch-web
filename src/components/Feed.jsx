import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { getStoredAuth } from "../utils/authUtils";
import { BASE_URL } from "../utils/constants";
import { setFeed } from "../utils/feedSlice";
import UserCard from "./userCard";
import FeedActions from "./FeedActions";
import Loader from "./Loader";

const Feed = () => {
  const feed = useSelector((store) => store.feed);
  const dispatch = useDispatch();
  const { accessToken } = getStoredAuth();
  const [isLoading, setIsLoading] = useState(false);

  const getFeed = async () => {
    if (feed) return;
    const baseUrl = BASE_URL;
    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getFeed();
  }, []);

  // Loading State
  if (isLoading) {
    return (
      <div className="flex justify-center items-center my-8 sm:my-10 md:my-12 px-4">
        <Loader />
      </div>
    );
  }

  return (
    <div className="flex justify-center my-4 sm:my-6 md:my-8 px-3 sm:px-4 pb-4 sm:pb-6">
      {feed && feed[0] ? (
        <UserCard user={feed[0]} actions={<FeedActions user={feed[0]} />} />
      ) : (
        // Empty State
        <div className="card bg-base-300 w-full max-w-md md:max-w-lg shadow-xl rounded-lg p-6 sm:p-8 md:p-10">
          <div className="text-center space-y-4 sm:space-y-5">
            {/* Icon */}
            <div className="flex justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24 text-base-content/30"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>

            {/* Heading */}
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-base-content">
              No More Users to Show
            </h2>

            {/* Description */}
            <p className="text-xs sm:text-sm md:text-base text-base-content/60 max-w-xs mx-auto">
              You've seen all available suggestions. Check back later or reload
              to see fresh profiles!
            </p>

            {/* Reload Button */}
            <button
              onClick={() => window.location.reload()}
              className="btn btn-primary btn-sm sm:btn-md gap-2 mt-2"
              aria-label="Reload feed to see new suggestions"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 sm:h-5 sm:w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              <span className="text-xs sm:text-sm">Reload Feed</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Feed;
