import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import axios from "axios";
import { useToast } from "../context/ToastContext";
import { BASE_URL } from "../utils/constants";
import { getStoredAuth } from "../utils/authUtils";
import { addUser } from "../utils/userSlice";
import defaultAvatar from "../assets/logo/default-avatar.svg";
import ProfilePhotoUploader from "./ProfilePhotoUploader";

const EditProfile = () => {
  // Get user data directly from Redux store
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    skills: user?.skills || [],
    age: user?.age || "",
    bio: user?.bio || "",
    currentOrganisation: user?.currentOrganisation || "",
    currentPosition: user?.currentPosition || "",
    gender: user?.gender || "male",
    githubUrl: user?.githubUrl || "",
    linkedinUrl: user?.linkedinUrl || "",
    location: user?.location || "",
    portfolioUrl: user?.portfolioUrl || "",
    profilePhoto: user?.profilePhoto || "",
  });

  const [skillInput, setSkillInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPhotoUploader, setShowPhotoUploader] = useState(false);
  const { addToast } = useToast();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddSkill = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()],
      }));
      setSkillInput("");
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill !== skillToRemove),
    }));
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const { accessToken } = getStoredAuth();

      if (!accessToken) {
        addToast("error", "Authentication required. Please login again.");
        navigate("/login");
        return;
      }

      // Prepare the payload - remove empty strings and undefined values
      const payload = {};
      Object.keys(formData).forEach((key) => {
        // Skip profilePhoto - it's now updated via dedicated upload endpoint
        if (key === "profilePhoto") return;

        const value = formData[key];
        // Include non-empty values, and always include age (even if 0)
        if (value !== "" && value !== null && value !== undefined) {
          // For arrays (skills), only include if not empty
          if (Array.isArray(value)) {
            if (value.length > 0) {
              payload[key] = value;
            }
          } else if (key === "age") {
            // Convert age to number
            const ageNum = parseInt(value, 10);
            if (!isNaN(ageNum)) {
              payload[key] = ageNum;
            }
          } else {
            payload[key] = value;
          }
        }
      });

      const response = await axios.patch(`${BASE_URL}/users/profile`, payload, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      if (response.data.success) {
        // Update Redux store with the new user data
        dispatch(addUser(response.data.data));
        addToast(
          "success",
          response.data.message || "Profile updated successfully!"
        );

        // Navigate back to profile or feed
        navigate("/profile");
      }
    } catch (error) {
      const response = error.response?.data;
      if (response?.message) {
        if (Array.isArray(response.message)) {
          // Validation errors - show multiple warning toasts
          response.message.forEach((msg) => {
            addToast("warning", msg);
          });
        } else {
          // Single error message
          addToast("error", response.message);
        }
      } else {
        addToast("error", "Failed to update profile. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate(-1); // Go back to previous page
  };

  return (
    <div className="flex items-center justify-center relative px-3 py-4">
      <div className="card bg-base-300 w-full max-w-2xl md:max-w-3xl shadow-xl rounded-lg">
        <div className="card-body p-4 sm:p-6 md:p-8">
          {/* Header */}
          <div className="text-center mb-3 md:mb-5">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-base-content">
              Edit Profile
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-base-content/70 mt-1">
              Update your information and preferences
            </p>
          </div>

          {/* Profile Photo Upload Section */}
          <div className="space-y-2.5 md:space-y-4">
            <div className="form-control">
              <label className="label pb-0.5 pt-0">
                <span className="label-text text-xs sm:text-sm font-medium">
                  Profile Photo
                </span>
              </label>
              <div className="flex items-center gap-3 sm:gap-4">
                <img
                  src={formData.profilePhoto || defaultAvatar}
                  alt="Profile preview"
                  className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full ${
                    formData.profilePhoto ? "object-cover" : "object-contain"
                  } bg-base-200 ring-2 ring-base-content/10`}
                />
                <button
                  type="button"
                  onClick={() => setShowPhotoUploader(true)}
                  className="btn btn-primary btn-sm sm:btn-md"
                  disabled={isSubmitting}
                >
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span>Change Photo</span>
                </button>
              </div>
            </div>

            {/* First Name & Last Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 md:gap-4">
              <div className="form-control">
                <label className="label pb-0.5 pt-0">
                  <span className="label-text text-xs sm:text-sm font-medium">
                    First Name
                  </span>
                </label>
                <input
                  type="text"
                  name="firstName"
                  className="input input-bordered input-sm sm:input-md w-full"
                  placeholder="First name"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                />
              </div>

              <div className="form-control">
                <label className="label pb-0.5 pt-0">
                  <span className="label-text text-xs sm:text-sm font-medium">
                    Last Name
                  </span>
                </label>
                <input
                  type="text"
                  name="lastName"
                  className="input input-bordered input-sm sm:input-md w-full"
                  placeholder="Last name"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Age & Gender */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 md:gap-4">
              <div className="form-control">
                <label className="label pb-0.5 pt-0">
                  <span className="label-text text-xs sm:text-sm font-medium">
                    Age
                  </span>
                </label>
                <input
                  type="number"
                  name="age"
                  className="input input-bordered input-sm sm:input-md w-full"
                  placeholder="Age"
                  value={formData.age}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  min="18"
                  max="100"
                />
              </div>

              <div className="form-control">
                <label className="label pb-0.5 pt-0">
                  <span className="label-text text-xs sm:text-sm font-medium">
                    Gender
                  </span>
                </label>
                <select
                  name="gender"
                  className="select select-bordered select-sm sm:select-md w-full"
                  value={formData.gender}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            {/* Location & Current Position */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 md:gap-4">
              <div className="form-control">
                <label className="label pb-0.5 pt-0">
                  <span className="label-text text-xs sm:text-sm font-medium">
                    Location
                  </span>
                </label>
                <input
                  type="text"
                  name="location"
                  className="input input-bordered input-sm sm:input-md w-full"
                  placeholder="City, Country"
                  value={formData.location}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                />
              </div>

              <div className="form-control">
                <label className="label pb-0.5 pt-0">
                  <span className="label-text text-xs sm:text-sm font-medium">
                    Current Position
                  </span>
                </label>
                <input
                  type="text"
                  name="currentPosition"
                  className="input input-bordered input-sm sm:input-md w-full"
                  placeholder="Job title"
                  value={formData.currentPosition}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Current Organisation - Full Width */}
            <div className="form-control">
              <label className="label pb-0.5 pt-0">
                <span className="label-text text-xs sm:text-sm font-medium">
                  Current Organisation
                </span>
              </label>
              <input
                type="text"
                name="currentOrganisation"
                className="input input-bordered input-sm sm:input-md w-full"
                placeholder="Company name"
                value={formData.currentOrganisation}
                onChange={handleInputChange}
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Bio - Full Width */}
          <div className="form-control mt-1">
            <label className="label pt-0 pb-0 mb-2 mr-2 sm:mb-3">
              <span className="label-text text-xs sm:text-sm font-medium">
                Bio
              </span>
            </label>
            <textarea
              name="bio"
              className="textarea textarea-bordered textarea-sm sm:textarea-md h-24 sm:h-32 md:h-40 text-xs sm:text-sm leading-relaxed"
              placeholder="Tell us about yourself..."
              value={formData.bio}
              onChange={handleInputChange}
              disabled={isSubmitting}
            />
          </div>

          {/* Skills - Full Width */}
          <div className="form-control mt-1">
            <label className="label pt-0 pb-0 mb-2 sm:mb-3">
              <span className="label-text text-xs sm:text-sm font-medium">
                Skills
              </span>
            </label>
            <div className="flex gap-1.5 sm:gap-2">
              <input
                type="text"
                className="input input-bordered input-sm sm:input-md flex-1 text-xs sm:text-sm"
                placeholder="Add a skill (e.g. React)"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleAddSkill()}
                disabled={isSubmitting}
              />
              <button
                type="button"
                className="btn btn-primary btn-sm sm:btn-md"
                onClick={handleAddSkill}
                disabled={isSubmitting}
                aria-label="Add skill"
              >
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                <span className="hidden sm:inline text-xs sm:text-sm">Add</span>
              </button>
            </div>
            {formData.skills.length > 0 && (
              <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-2">
                {formData.skills.map((skill, index) => (
                  <div
                    key={index}
                    className="badge badge-md sm:badge-lg badge-primary gap-1 sm:gap-2"
                  >
                    <span className="text-xs sm:text-sm">{skill}</span>
                    <button
                      type="button"
                      className="btn btn-xs btn-ghost btn-circle p-0"
                      onClick={() => handleRemoveSkill(skill)}
                      disabled={isSubmitting}
                      aria-label={`Remove ${skill}`}
                      title={`Remove ${skill}`}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Social Links Section */}
          <div className="space-y-2.5 md:space-y-4 mt-2">
            <div className="divider text-xs sm:text-sm font-semibold text-base-content/70 my-2 sm:my-3">
              Social Links (Optional)
            </div>

            {/* GitHub URL */}
            <div className="form-control">
              <label className="label pt-0 pb-0 mb-1.5 sm:mb-2">
                <span className="label-text text-xs sm:text-sm font-medium flex items-center gap-1.5">
                  <svg
                    className="w-3.5 h-3.5 sm:w-4 sm:h-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                  GitHub URL
                </span>
              </label>
              <input
                type="url"
                name="githubUrl"
                className="input input-bordered input-sm sm:input-md w-full text-xs sm:text-sm"
                placeholder="https://github.com/username"
                value={formData.githubUrl}
                onChange={handleInputChange}
                disabled={isSubmitting}
              />
            </div>

            {/* LinkedIn URL */}
            <div className="form-control">
              <label className="label pt-0 pb-0 mb-1.5 sm:mb-2">
                <span className="label-text text-xs sm:text-sm font-medium flex items-center gap-1.5">
                  <svg
                    className="w-3.5 h-3.5 sm:w-4 sm:h-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                  LinkedIn URL
                </span>
              </label>
              <input
                type="url"
                name="linkedinUrl"
                className="input input-bordered input-sm sm:input-md w-full text-xs sm:text-sm"
                placeholder="https://linkedin.com/in/username"
                value={formData.linkedinUrl}
                onChange={handleInputChange}
                disabled={isSubmitting}
              />
            </div>

            {/* Portfolio URL */}
            <div className="form-control">
              <label className="label pt-0 pb-0 mb-1.5 sm:mb-2">
                <span className="label-text text-xs sm:text-sm font-medium flex items-center gap-1.5">
                  <svg
                    className="w-3.5 h-3.5 sm:w-4 sm:h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                    />
                  </svg>
                  Portfolio URL
                </span>
              </label>
              <input
                type="url"
                name="portfolioUrl"
                className="input input-bordered input-sm sm:input-md w-full text-xs sm:text-sm"
                placeholder="https://yourportfolio.com"
                value={formData.portfolioUrl}
                onChange={handleInputChange}
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-4 sm:mt-5 md:mt-6">
            <button
              className="btn btn-ghost btn-sm sm:btn-md w-full sm:flex-1 gap-2"
              onClick={handleCancel}
              disabled={isSubmitting}
              aria-label="Cancel editing"
            >
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              <span className="text-xs sm:text-sm">Cancel</span>
            </button>
            <button
              className="btn btn-primary btn-sm sm:btn-md w-full sm:flex-1 gap-2"
              onClick={handleSubmit}
              disabled={isSubmitting}
              aria-label="Save profile changes"
            >
              {isSubmitting ? (
                <>
                  <span className="loading loading-spinner loading-xs sm:loading-sm"></span>
                  <span className="text-xs sm:text-sm">Saving...</span>
                </>
              ) : (
                <>
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-xs sm:text-sm">Save Changes</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Photo Uploader Modal */}
      <ProfilePhotoUploader
        isOpen={showPhotoUploader}
        onClose={() => setShowPhotoUploader(false)}
        currentPhotoUrl={formData.profilePhoto}
        onUploadSuccess={(photoUrl) => {
          setFormData((prev) => ({ ...prev, profilePhoto: photoUrl }));
          setShowPhotoUploader(false);
        }}
      />
    </div>
  );
};

export default EditProfile;
