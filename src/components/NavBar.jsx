import React from "react";
import { useSelector } from "react-redux";
import logo from "../assets/images/logo.png";
import avatar from "../assets/images/avatar.png";
const NavBar = () => {
  const user = useSelector((state) => state.user);
  return (
    <div className="navbar bg-base-300 shadow-sm">
      <div className="flex-1">
        <a className="btn btn-ghost text-xl gap-2">
          <img
            src={logo}
            alt="DevTinder Logo"
            className="w-10 h-10 rounded-full"
          />
          DevTinder
        </a>
      </div>
      <div className="flex gap-2">
        {user && <p className="text-sm font-bold flex items-center gap-2">Welcome, {user.username}</p>}
        <div className="dropdown dropdown-end mx-5">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar"
          >
            {user ? (
              <div className="w-10 rounded-full">
                <img alt="User Profile Photo" src={user.profilePhoto} />
              </div>
            ) : (
              <div className="w-10 rounded-full">
                <img alt="User Profile Photo" src={avatar} />
              </div>
            )}
          </div>
          <ul
            tabIndex="-1"
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
          >
            <li>
              <a className="justify-between">
                Profile
                <span className="badge">New</span>
              </a>
            </li>
            <li>
              <a>Settings</a>
            </li>
            <li>
              <a>Logout</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
