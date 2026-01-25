import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import axios from "axios";
import { useToast } from "../context/ToastContext";
import { BASE_URL } from "../utils/constants";
import { getStoredAuth } from "../utils/authUtils";
import { addUser } from "../utils/userSlice";
import defaultAvatar from "../assets/logo/default-avatar.svg";

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
    <div className="min-h-screen flex items-center justify-center py-8">
      <div className="card card-dash bg-base-300 w-full max-w-2xl">
        <div className="card-body">
          <h2 className="card-title flex items-center justify-center mb-4">
            Edit Profile
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Profile Photo URL */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Profile Photo URL</span>
              </label>
              <input
                type="url"
                name="profilePhoto"
                className="input input-bordered"
                placeholder="https://example.com/photo.jpg"
                value={formData.profilePhoto}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-control">
              <div className="mt-2 flex justify-center">
                  <img
                    src={formData.profilePhoto || defaultAvatar}
                    alt="Profile preview"
                    className="w-24 h-24 rounded-full object-cover bg-base-200"
                  />
                </div>
            </div>

            {/* First Name */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">First Name</span>
              </label>
              <input
                type="text"
                name="firstName"
                className="input input-bordered"
                placeholder="Enter your first name"
                value={formData.firstName}
                onChange={handleInputChange}
              />
            </div>

            {/* Last Name */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Last Name</span>
              </label>
              <input
                type="text"
                name="lastName"
                className="input input-bordered"
                placeholder="Enter your last name"
                value={formData.lastName}
                onChange={handleInputChange}
              />
            </div>

            {/* Age */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Age</span>
              </label>
              <input
                type="number"
                name="age"
                className="input input-bordered"
                placeholder="Enter your age"
                value={formData.age}
                onChange={handleInputChange}
              />
            </div>

            {/* Gender */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Gender</span>
              </label>
              <select
                name="gender"
                className="select select-bordered"
                value={formData.gender}
                onChange={handleInputChange}
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Location */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Location</span>
              </label>
              <input
                type="text"
                name="location"
                className="input input-bordered"
                placeholder="Enter your location"
                value={formData.location}
                onChange={handleInputChange}
              />
            </div>

            {/* Current Position */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Current Position</span>
              </label>
              <input
                type="text"
                name="currentPosition"
                className="input input-bordered"
                placeholder="Enter your current position"
                value={formData.currentPosition}
                onChange={handleInputChange}
              />
            </div>

            {/* Current Organisation */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Current Organisation</span>
              </label>
              <input
                type="text"
                name="currentOrganisation"
                className="input input-bordered"
                placeholder="Enter your organisation"
                value={formData.currentOrganisation}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* Bio - Full Width */}
          <div className="form-control mt-2">
            <label className="label mx-2">
              <span className="label-text">Bio</span>
            </label>
            <textarea
              name="bio"
              className="textarea textarea-bordered h-24"
              placeholder="Tell us about yourself"
              value={formData.bio}
              onChange={handleInputChange}
            />
          </div>

          {/* Skills - Full Width */}
          <div className="form-control mt-2">
            <label className="label">
              <span className="label-text">Skills</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                className="input input-bordered flex-1"
                placeholder="Add a skill"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleAddSkill()}
              />
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleAddSkill}
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.skills.map((skill, index) => (
                <div key={index} className="badge badge-lg badge-primary gap-2">
                  {skill}
                  <button
                    type="button"
                    className="btn btn-xs btn-ghost btn-circle"
                    onClick={() => handleRemoveSkill(skill)}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* URLs Section */}
          <div className="grid grid-cols-1 gap-4 mt-2">
            {/* GitHub URL */}
            <div className="form-control">
              <label className="label mx-3">
                <span className="label-text">GitHub URL</span>
              </label>
              <input
                type="url"
                name="githubUrl"
                className="input input-bordered"
                placeholder="https://github.com/username"
                value={formData.githubUrl}
                onChange={handleInputChange}
              />
            </div>

            {/* LinkedIn URL */}
            <div className="form-control">
              <label className="label mx-2">
                <span className="label-text">LinkedIn URL</span>
              </label>
              <input
                type="url"
                name="linkedinUrl"
                className="input input-bordered"
                placeholder="https://linkedin.com/in/username"
                value={formData.linkedinUrl}
                onChange={handleInputChange}
              />
            </div>

            {/* Portfolio URL */}
            <div className="form-control">
              <label className="label mx-2">
                <span className="label-text">Portfolio URL</span>
              </label>
              <input
                type="url"
                name="portfolioUrl"
                className="input input-bordered"
                placeholder="https://yourportfolio.com"
                value={formData.portfolioUrl}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="card-actions justify-end mt-6">
            <button
              className="btn btn-ghost"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              className="btn btn-primary"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
