import React, { useEffect } from 'react'
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { getStoredAuth } from "../utils/authUtils";
import { BASE_URL } from '../utils/constants';
import { setFeed } from '../utils/feedSlice';
import UserCard from './userCard';
const Feed = () => {
  const feed = useSelector((store) => store.feed);
  const dispatch = useDispatch();
  const { accessToken } = getStoredAuth();
  const getFeed = async () => {
    if(feed) return;
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
  }
  useEffect(() => {
    getFeed();
  }, []);
  return (
    <div className=" flex justify-center my-4">
      {feed && <UserCard user={feed[0]} />}
    </div>
  )
}

export default Feed