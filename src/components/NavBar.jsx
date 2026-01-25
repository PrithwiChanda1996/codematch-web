import React from "react";
import { useSelector } from "react-redux";
import logo from "../assets/logo/logo.png";
import avatar from "../assets/logo/avatar.png";
import { useAuth } from "../hooks/useAuth";
import { Link } from "react-router";

const NavBar = () => {
  const user = useSelector((state) => state.user);
  const { handleLogout } = useAuth();

  return (
    <nav className="navbar bg-base-300 shadow-sm sticky top-0 z-50 px-2 sm:px-4 min-h-14 sm:min-h-16">
      {/* Logo and Brand */}
      <div className="flex-1">
        <Link
          to="/"
          className="btn btn-ghost text-base sm:text-lg md:text-xl gap-1.5 sm:gap-2 px-2 sm:px-4 min-h-0 h-auto py-2"
          aria-label="DevTinder Home"
        >
          <img
            src={logo}
            alt="DevTinder Logo"
            className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full"
          />
          <span className="font-semibold">DevTinder</span>
        </Link>
      </div>

      {/* User Info and Avatar */}
      <div className="flex items-center gap-1 sm:gap-2 md:gap-3">
        {/* Welcome Text - Hidden on mobile, visible on sm+ */}
        {user && (
          <p className="hidden sm:flex text-xs sm:text-sm md:text-base font-medium text-base-content/80 items-center">
            Welcome, <span className="font-bold ml-1">{user.username}</span>
          </p>
        )}

        {/* Avatar Dropdown */}
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar"
            aria-label="User menu"
          >
            {user ? (
              <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full ring-2 ring-primary ring-offset-2 ring-offset-base-300">
                <img
                  alt={`${user.username}'s profile`}
                  src={user.profilePhoto}
                  className="rounded-full object-cover"
                />
              </div>
            ) : (
              <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full ring-2 ring-base-content/20 ring-offset-2 ring-offset-base-300">
                <img
                  alt="Default avatar"
                  src={avatar}
                  className="rounded-full object-cover"
                />
              </div>
            )}
          </div>

          {/* Dropdown Menu */}
          {user && (
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-48 sm:w-52 p-2 shadow-lg border border-base-300"
              role="menu"
            >
              <li role="menuitem">
                <Link
                  to="/profile"
                  className="text-xs sm:text-sm py-2 sm:py-2.5"
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
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  Profile
                </Link>
              </li>
              <li role="menuitem">
                <Link
                  to="/connections"
                  className="text-xs sm:text-sm py-2 sm:py-2.5"
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
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  Connections
                </Link>
              </li>
              <div className="divider my-0"></div>
              <li role="menuitem">
                <a
                  onClick={handleLogout}
                  className="text-xs sm:text-sm py-2 sm:py-2.5 text-error hover:bg-error/10"
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
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  Logout
                </a>
              </li>
            </ul>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
