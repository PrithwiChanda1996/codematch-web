import React from "react";

const ConnectionCard = ({ user, actions }) => {
  const { id, firstName, lastName, username, profilePhoto } = user;

  return (
    <div key={id} className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <div className="flex items-center gap-4">
          <div className="avatar">
            <div className="w-16 rounded-full">
              <img src={profilePhoto} alt={username} />
            </div>
          </div>
          <div className="flex-grow">
            <h3 className="card-title">
              {firstName} {lastName}
            </h3>
            <p className="text-sm text-base-content/70">@{username}</p>
          </div>
          <div className="card-actions">{actions}</div>
        </div>
      </div>
    </div>
  );
};

export default ConnectionCard;
