import React, { useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import Cropper from "react-easy-crop";
import axios from "axios";
import { useToast } from "../context/ToastContext";
import { BASE_URL } from "../utils/constants";
import { getStoredAuth } from "../utils/authUtils";
import { addUser } from "../utils/userSlice";

const ProfilePhotoUploader = ({
  isOpen,
  onClose,
  currentPhotoUrl,
  onUploadSuccess,
}) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const { addToast } = useToast();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  // Validate file before processing
  const validateFile = (file) => {
    const validTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    if (!validTypes.includes(file.type)) {
      return {
        valid: false,
        error: "Please select a valid image file (JPG, PNG, GIF, or WebP)",
      };
    }
    if (file.size > 5 * 1024 * 1024) {
      return { valid: false, error: "Image must be less than 5MB" };
    }
    return { valid: true };
  };

  // Handle file selection
  const handleFileSelect = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validation = validateFile(file);
    if (!validation.valid) {
      addToast("error", validation.error);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => setSelectedImage(reader.result);
    reader.readAsDataURL(file);
  };

  // Callback when crop area changes
  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  // Create image element from URL
  const createImage = (url) => {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener("load", () => resolve(image));
      image.addEventListener("error", (error) => reject(error));
      image.src = url;
    });
  };

  // Get cropped image as blob
  const getCroppedBlob = async (imageSrc, pixelCrop) => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) throw new Error("Failed to get canvas context");

    // Set canvas to 400x400
    canvas.width = 400;
    canvas.height = 400;

    // Draw cropped image
    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      400,
      400
    );

    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else reject(new Error("Canvas is empty"));
        },
        "image/jpeg",
        0.85
      );
    });
  };

  // Handle upload
  const handleUpload = async () => {
    if (!selectedImage || !croppedAreaPixels) return;

    setIsUploading(true);

    try {
      // Get cropped image as blob
      const croppedBlob = await getCroppedBlob(
        selectedImage,
        croppedAreaPixels
      );

      // Prepare form data
      const formData = new FormData();
      formData.append("file", croppedBlob, "profile.jpg");

      // Get auth token
      const { accessToken } = getStoredAuth();
      if (!accessToken) {
        addToast("error", "Authentication required. Please login again.");
        handleCancel();
        return;
      }

      // Upload to backend
      const response = await axios.post(
        `${BASE_URL}/users/profile/upload-photo`,
        formData,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.data.success) {
        const photoUrl = response.data.data.photoUrl;

        // Update Redux store
        dispatch(addUser({ ...user, profilePhoto: photoUrl }));

        // Show success message
        addToast(
          "success",
          response.data.message || "Profile photo uploaded successfully!"
        );

        // Call success callback
        if (onUploadSuccess) {
          onUploadSuccess(photoUrl);
        }

        // Reset state and close modal
        resetState();
      }
    } catch (error) {
      console.error("Upload error:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Failed to upload photo. Please try again.";
      addToast("error", errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  // Reset component state
  const resetState = () => {
    setSelectedImage(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);
  };

  // Handle cancel
  const handleCancel = () => {
    resetState();
    if (onClose) onClose();
  };

  // Don't render if not open
  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-2xl w-full p-0">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-base-content/10">
          <h3 className="text-lg sm:text-xl font-bold text-base-content">
            Upload Profile Photo
          </h3>
          <button
            onClick={handleCancel}
            disabled={isUploading}
            className="btn btn-sm btn-circle btn-ghost"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6">
          {!selectedImage ? (
            // File selection view
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-sm sm:text-base text-base-content/70 mb-4">
                  Select an image to crop and upload as your profile photo
                </p>
              </div>

              {/* File Input */}
              <div className="form-control">
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="photo-file-input"
                  />
                  <div className="flex flex-col items-center justify-center gap-3 p-8 sm:p-12 border-2 border-dashed border-base-content/20 rounded-lg hover:border-primary hover:bg-base-200/50 transition-colors">
                    <svg
                      className="w-12 h-12 sm:w-16 sm:h-16 text-base-content/40"
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
                    <div className="text-center">
                      <p className="text-sm sm:text-base font-medium text-base-content">
                        Click to select an image
                      </p>
                      <p className="text-xs sm:text-sm text-base-content/60 mt-1">
                        JPG, PNG, GIF, or WebP (Max 5MB)
                      </p>
                    </div>
                  </div>
                </label>
              </div>

              {/* Current Photo Preview */}
              {currentPhotoUrl && (
                <div className="text-center">
                  <p className="text-xs sm:text-sm text-base-content/60 mb-2">
                    Current Photo
                  </p>
                  <img
                    src={currentPhotoUrl}
                    alt="Current profile"
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover mx-auto ring-2 ring-base-content/10"
                  />
                </div>
              )}
            </div>
          ) : (
            // Cropper view
            <div className="space-y-4">
              {/* Cropper Container */}
              <div
                className="relative w-full bg-base-300 rounded-lg overflow-hidden"
                style={{ height: "400px" }}
              >
                <Cropper
                  image={selectedImage}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={onCropComplete}
                  objectFit="contain"
                />
              </div>

              {/* Zoom Control */}
              <div className="space-y-2">
                <label className="flex items-center justify-between text-xs sm:text-sm font-medium text-base-content">
                  <span>Zoom</span>
                  <span className="text-base-content/60">
                    {zoom.toFixed(1)}x
                  </span>
                </label>
                <input
                  type="range"
                  min={1}
                  max={3}
                  step={0.1}
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="range range-primary range-xs sm:range-sm"
                  disabled={isUploading}
                />
              </div>

              {/* Instructions */}
              <div className="bg-base-200 p-3 rounded-lg">
                <p className="text-xs sm:text-sm text-base-content/70">
                  <strong>Tip:</strong> Drag the image to reposition, use the
                  slider to zoom in/out
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 p-4 sm:p-5 border-t border-base-content/10">
          {selectedImage ? (
            <>
              <button
                onClick={handleCancel}
                disabled={isUploading}
                className="btn btn-ghost btn-sm sm:btn-md w-full sm:flex-1"
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                disabled={isUploading}
                className="btn btn-primary btn-sm sm:btn-md w-full sm:flex-1"
              >
                {isUploading ? (
                  <>
                    <span className="loading loading-spinner loading-xs sm:loading-sm"></span>
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
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
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                      />
                    </svg>
                    <span>Upload Photo</span>
                  </>
                )}
              </button>
            </>
          ) : (
            <button
              onClick={handleCancel}
              className="btn btn-ghost btn-sm sm:btn-md w-full"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePhotoUploader;
