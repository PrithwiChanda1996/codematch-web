import React from 'react'
import avatar from '../assets/images/avatar.png';
import connect from '../assets/images/connect.png';
import block from '../assets/images/block.png';
import ignore from '../assets/images/ignore.png';
const userCard = ({ user }) => {
    const { id, firstName, lastName, username, email, profilePicture, about } = user;
  return (
    <div>
      <div className="card bg-base-300 w-96 shadow-sm rounded-md">
        <figure>
          <img src={profilePicture || avatar} alt="User Profile Photo" />
        </figure>
        <div className="card-body">
          <h2 className="card-title">
            {firstName} {lastName}
          </h2>
          <p className="text-sm text-gray-500">{username}</p>
          <small className="text-sm text-gray-500 cursor-pointer flex justify-end">
            show more
          </small>
          <div className="card-actions justify-left flex flex-row gap-3">
            <button className="btn flex flex-col items-center justify-center p-4 h-auto min-h-[90px] w-24 gap-2">
              <img src={connect} className="w-10 h-10" />
              <span className="text-sm">Connect</span>
            </button>

            <button className="btn flex flex-col items-center justify-center p-4 h-auto min-h-[90px] w-24 gap-2">
              <img src={ignore} className="w-10 h-10" />
              <span className="text-sm">Ignore</span>
            </button>

            <button className="btn flex flex-col items-center justify-center p-4 h-auto min-h-[90px] w-24 gap-2">
              <img src={block} className="w-10 h-10" />
              <span className="text-sm">Block</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default userCard