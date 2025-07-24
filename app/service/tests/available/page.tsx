"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import {
  Loader2,
  FileText,
  Upload,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Paperclip,
  XCircle,
} from "lucide-react";
type PrescriptionStatus =
  | "ASSIGNED"
  | "IN_PROGRESS"
  | "RETURNED_TO_ADMIN"
  | "UPLOADED"
  | "REJECTED";
// TypeScript interfaces
interface User {
  id: number;
  email: string;
  password: string;
  name: string | null;
  role: string;
  createdAt: string;
  updatedAt: string;
  googleId: string | null;
}

interface Prescription {
  id: number;
  userId: number;
  fileUrl: string;
  status: PrescriptionStatus;
  assignedToId: string;
  resultFileUrl: string | null;
  remarks: string | null;
  rejectionReason?: string | null;
  createdAt: string;
  updatedAt: string;
  user: User;
}

interface NotificationType {
  show: boolean;
  message: string;
  type: string;
}

interface UploadingState {
  [key: number]: boolean;
}

interface UploadState {
  [key: number]: {
    uploading: boolean;
    progress: number;
    selectedFile: File | null;
  };
}

export default function AssignedPrescriptions() {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState<UploadingState>({});
  const [notification, setNotification] = useState<NotificationType>({
    show: false,
    message: "",
    type: "",
  });

  // File upload state
  const [fileUploadState, setFileUploadState] = useState<UploadState>({});
  const fileInputRefs = useRef<{ [key: number]: HTMLInputElement | null }>({});

  // Form state for each prescription
  const [formData, setFormData] = useState<{
    [key: number]: {
      resultFileUrl: string;
      remarks: string;
    };
  }>({});

  // Rejection state
  const [showRejectForm, setShowRejectForm] = useState<{
    [key: number]: boolean;
  }>({});
  const [rejectionReason, setRejectionReason] = useState<{
    [key: number]: string;
  }>({});
  const [isRejecting, setIsRejecting] = useState<{ [key: number]: boolean }>(
    {}
  );
  const [isAccepting, setIsAccepting] = useState<{ [key: number]: boolean }>(
    {}
  );

  // Get provider ID from localStorage
  const getProviderId = () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("serviceId") || "";
    }
    return "";
  };

  // Fetch assigned prescriptions on component mount
  useEffect(() => {
    fetchAssignedPrescriptions();
  }, []);

  const fetchAssignedPrescriptions = async () => {
    setLoading(true);
    try {
      const providerId = getProviderId();

      if (!providerId) {
        throw new Error("Provider ID not found in local storage");
      }

      // GET requests cannot have a body, so we'll just use the URL
      const response = await fetch(
        `https://redtestlab.com/api/prescriptions/provider/${providerId}/assigned`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch prescriptions: ${response.status}`);
      }

      const data = await response.json();
      console.log("Fetched prescriptions:", data);
      setPrescriptions(data);

      // Initialize form data for each prescription
      const initialFormData: {
        [key: number]: { resultFileUrl: string; remarks: string };
      } = {};
      const initialUploadState: UploadState = {};

      data.forEach((prescription: Prescription) => {
        initialFormData[prescription.id] = {
          resultFileUrl: prescription.resultFileUrl || "",
          remarks: prescription.remarks || "",
        };
        initialUploadState[prescription.id] = {
          uploading: false,
          progress: 0,
          selectedFile: null,
        };
      });

      setFormData(initialFormData);
      setFileUploadState(initialUploadState);
    } catch (err) {
      setError("Failed to fetch assigned prescriptions. Please try again.");
      console.error(
        "Error fetching assigned prescriptions:",
        err instanceof Error ? err.message : String(err)
      );
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    prescriptionId: number,
    field: string,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [prescriptionId]: {
        ...prev[prescriptionId],
        [field]: value,
      },
    }));
  };

  // Handle file selection and automatically upload
  const handleFileSelect = async (
    prescriptionId: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setFileUploadState((prev) => ({
        ...prev,
        [prescriptionId]: {
          ...prev[prescriptionId],
          selectedFile: file,
          uploading: true,
          progress: 0,
        },
      }));

      // Automatically start upload to Cloudinary
      await uploadToCloudinary(prescriptionId, file);
    }
  };

  // Upload file to Cloudinary
  const uploadToCloudinary = async (prescriptionId: number, file: File) => {
    if (!file) {
      setNotification({
        show: true,
        message: "Please select a file to upload",
        type: "error",
      });
      setTimeout(() => {
        setNotification({ show: false, message: "", type: "" });
      }, 3000);
      return null;
    }

    // Create form data for upload
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "E-Rickshaw"); // Replace with your Cloudinary upload preset

    try {
      // Upload to Cloudinary as resource_type 'raw' for PDF and other non-image files
      // See: https://cloudinary.com/documentation/upload_images#uploading_raw_files
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dm8jxispy/raw/upload", // Use /raw/upload for resource_type=raw
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to upload file to Cloudinary");
      }

      const data = await response.json();

      // Update upload state
      setFileUploadState((prev) => ({
        ...prev,
        [prescriptionId]: {
          ...prev[prescriptionId],
          uploading: false,
          progress: 100,
        },
      }));

      // Update form data with the secure URL
      setFormData((prev) => ({
        ...prev,
        [prescriptionId]: {
          ...prev[prescriptionId],
          resultFileUrl: data.secure_url,
        },
      }));

      setNotification({
        show: true,
        message: "File uploaded successfully to Cloudinary",
        type: "success",
      });

      setTimeout(() => {
        setNotification({ show: false, message: "", type: "" });
      }, 3000);

      return data.secure_url;
    } catch (err) {
      console.error(
        "Error uploading to Cloudinary:",
        err instanceof Error ? err.message : String(err)
      );

      setFileUploadState((prev) => ({
        ...prev,
        [prescriptionId]: {
          ...prev[prescriptionId],
          uploading: false,
        },
      }));

      setNotification({
        show: true,
        message: "Failed to upload file. Please try again.",
        type: "error",
      });

      setTimeout(() => {
        setNotification({ show: false, message: "", type: "" });
      }, 3000);

      return null;
    }
  };

  const uploadResult = async (prescriptionId: number) => {
    // Validate input
    if (!formData[prescriptionId].resultFileUrl.trim()) {
      setNotification({
        show: true,
        message: "Please upload a result file",
        type: "error",
      });
      setTimeout(() => {
        setNotification({ show: false, message: "", type: "" });
      }, 3000);
      return;
    }

    // Set uploading state for this prescription
    setUploading((prev) => ({ ...prev, [prescriptionId]: true }));

    try {
      const response = await fetch(
        `https://redtestlab.com/api/prescriptions/provider/upload-result/${prescriptionId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fileUrl: formData[prescriptionId].resultFileUrl,
            remarks: formData[prescriptionId].remarks,
            status: "RETURNED_TO_ADMIN",
          }),
        }
      );

      // Show success notification
      setNotification({
        show: true,
        message: `Result uploaded successfully for prescription #${prescriptionId}`,
        type: "success",
      });

      // Refresh prescriptions list
      await fetchAssignedPrescriptions();

      // Hide notification after 3 seconds
      setTimeout(() => {
        setNotification({ show: false, message: "", type: "" });
      }, 3000);
    } catch (err) {
      console.error(
        "Error uploading result:",
        err instanceof Error ? err.message : String(err)
      );

      // Show error notification
      setNotification({
        show: true,
        message: `Failed to upload result for prescription #${prescriptionId}`,
        type: "error",
      });

      // Hide notification after 3 seconds
      setTimeout(() => {
        setNotification({ show: false, message: "", type: "" });
      }, 3000);
    } finally {
      // Clear uploading state
      setUploading((prev) => ({ ...prev, [prescriptionId]: false }));
    }
  };

  // Handle accepting a prescription
  const handleAccept = async (prescriptionId: number) => {
    setIsAccepting((prev) => ({ ...prev, [prescriptionId]: true }));

    try {
      const providerId = getProviderId();

      const response = await fetch(
        `https://redtestlab.com/api/prescriptions/provider/accept/${prescriptionId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ providerId }),
        }
      );

      // Show success notification
      setNotification({
        show: true,
        message: `Prescription #${prescriptionId} has been accepted`,
        type: "success",
      });

      // Refresh prescriptions list
      await fetchAssignedPrescriptions();

      // Hide notification after 3 seconds
      setTimeout(() => {
        setNotification({ show: false, message: "", type: "" });
      }, 3000);
    } catch (err) {
      console.error(
        "Error accepting prescription:",
        err instanceof Error ? err.message : String(err)
      );

      // Show error notification
      setNotification({
        show: true,
        message: `Failed to accept prescription #${prescriptionId}`,
        type: "error",
      });

      // Hide notification after 3 seconds
      setTimeout(() => {
        setNotification({ show: false, message: "", type: "" });
      }, 3000);
    } finally {
      setIsAccepting((prev) => ({ ...prev, [prescriptionId]: false }));
    }
  };

  // Handle rejecting a prescription
  const handleReject = async (prescriptionId: number) => {
    if (
      !rejectionReason[prescriptionId] ||
      rejectionReason[prescriptionId].trim() === ""
    ) {
      setNotification({
        show: true,
        message: "Please provide a reason for rejection",
        type: "error",
      });
      setTimeout(() => {
        setNotification({ show: false, message: "", type: "" });
      }, 3000);
      return;
    }

    setIsRejecting((prev) => ({ ...prev, [prescriptionId]: true }));

    try {
      const providerId = getProviderId();

      // Make sure we're sending the correct data structure that the API expects
      const response = await fetch(
        `https://redtestlab.com/api/prescriptions/provider/reject/${prescriptionId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            providerId,
            rejectionReason: rejectionReason[prescriptionId],
            status: "REJECTED", // Changed from 'UPLOADED' to 'REJECTED' to match backend
          }),
        }
      );

      // Show success notification
      setNotification({
        show: true,
        message: `Prescription #${prescriptionId} has been rejected and returned to admin`,
        type: "success",
      });

      // Refresh prescriptions list
      await fetchAssignedPrescriptions();

      // Hide notification after 3 seconds
      setTimeout(() => {
        setNotification({ show: false, message: "", type: "" });
      }, 3000);
    } catch (err) {
      console.error(
        "Error rejecting prescription:",
        err instanceof Error ? err.message : String(err)
      );

      // Show error notification
      setNotification({
        show: true,
        message: `Failed to reject prescription #${prescriptionId}. Please try again.`,
        type: "error",
      });

      // Hide notification after 3 seconds
      setTimeout(() => {
        setNotification({ show: false, message: "", type: "" });
      }, 3000);
    } finally {
      setIsRejecting((prev) => ({ ...prev, [prescriptionId]: false }));
      setShowRejectForm((prev) => ({ ...prev, [prescriptionId]: false }));
    }
  };

  // Display loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <Loader2 className="h-12 w-12 text-gray-600 animate-spin" />
        <p className="mt-4 text-lg text-gray-700">
          Loading assigned prescriptions...
        </p>
      </div>
    );
  }

  // Display error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <AlertCircle className="h-12 w-12 text-gray-600" />
        <p className="mt-4 text-lg text-gray-700">{error}</p>
        <button
          className="mt-4 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition"
          onClick={() => fetchAssignedPrescriptions()}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Notification */}
      {notification.show && (
        <div
          className={`fixed top-4 right-4 p-4 rounded-md shadow-lg flex items-center z-50 transition-opacity ${
            notification.type === "success"
              ? "bg-gray-100 text-gray-800 border border-gray-200"
              : "bg-gray-100 text-gray-800 border border-gray-200"
          }`}
        >
          {notification.type === "success" ? (
            <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0" />
          ) : (
            <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
          )}
          <span className="text-sm font-medium">{notification.message}</span>
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Assigned Prescriptions
          </h1>
          <p className="text-gray-600 mt-2">
            Manage prescriptions assigned to you and upload test results
          </p>
        </header>

        {prescriptions.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <h2 className="text-xl font-medium text-gray-700">
              No assigned prescriptions
            </h2>
            <p className="text-gray-500 mt-2">
              You don't have any prescriptions assigned to you at the moment.
            </p>
            <button
              onClick={fetchAssignedPrescriptions}
              className="mt-4 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition"
            >
              Refresh
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {prescriptions.map((prescription) => (
              <div
                key={prescription.id}
                className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow"
              >
                <div className="p-4 bg-gray-50 border-b border-gray-100">
                  <h3 className="font-medium text-gray-800 flex items-center">
                    <span className="bg-gray-100 text-gray-800 rounded-full w-6 h-6 inline-flex items-center justify-center mr-2 text-sm">
                      #{prescription.id}
                    </span>
                    Prescription
                  </h3>
                  <p className="text-sm text-gray-600">
                    Assigned:{" "}
                    {new Date(prescription.updatedAt).toLocaleDateString()} at{" "}
                    {new Date(prescription.updatedAt).toLocaleTimeString()}
                  </p>
                </div>

                <div className="p-4">
                  <div className="flex items-center mb-3">
                    <span className="font-medium text-gray-700 mr-2">
                      Patient:
                    </span>
                    <span className="text-gray-600">
                      {prescription.user.email}
                    </span>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center mb-3">
                      <span className="font-medium text-gray-700 mr-2">
                        Status:
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          prescription.status === "ASSIGNED"
                            ? "bg-yellow-100 text-yellow-800"
                            : prescription.status === "IN_PROGRESS"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {prescription.status}
                      </span>
                    </div>

                    <div className="mb-4">
                      <a
                        href={prescription.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-black text-sm flex items-center"
                        onClick={(e) => {
                          // Open in new tab without navigating away from current page
                          e.preventDefault();
                          window.open(prescription.fileUrl, "_blank");
                        }}
                      >
                        <FileText className="h-4 w-4 mr-1" />
                        View Prescription File
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </a>
                    </div>
                  </div>

                  {/* Accept/Reject buttons for ASSIGNED status */}
                  {prescription.status === "ASSIGNED" && (
                    <div className="space-y-4 border-t pt-4 border-gray-100">
                      {!showRejectForm[prescription.id] ? (
                        <div className="flex gap-2">
                          <button
                            onClick={(e) => {
                              e.preventDefault(); // Prevent default form submission
                              handleAccept(prescription.id);
                            }}
                            disabled={isAccepting[prescription.id]}
                            className="flex-1 py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 transition flex items-center justify-center"
                          >
                            {isAccepting[prescription.id] ? (
                              <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            ) : (
                              <CheckCircle className="h-4 w-4 mr-2" />
                            )}
                            Accept
                          </button>
                          <button
                            onClick={(e) => {
                              e.preventDefault(); // Prevent default form submission
                              setShowRejectForm((prev) => ({
                                ...prev,
                                [prescription.id]: true,
                              }));
                            }}
                            className="flex-1 py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700 transition flex items-center justify-center"
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Reject
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <label className="block text-sm font-medium text-gray-700">
                            Reason for rejection
                          </label>
                          <textarea
                            value={rejectionReason[prescription.id] || ""}
                            onChange={(e) =>
                              setRejectionReason((prev) => ({
                                ...prev,
                                [prescription.id]: e.target.value,
                              }))
                            }
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500"
                            rows={3}
                            placeholder="Please provide a reason for rejection..."
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={(e) => {
                                e.preventDefault(); // Prevent default form submission
                                handleReject(prescription.id);
                              }}
                              disabled={isRejecting[prescription.id]}
                              className="flex-1 py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700 transition flex items-center justify-center"
                            >
                              {isRejecting[prescription.id] ? (
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                              ) : (
                                <XCircle className="h-4 w-4 mr-2" />
                              )}
                              Confirm
                            </button>
                            <button
                              onClick={(e) => {
                                e.preventDefault(); // Prevent default form submission
                                setShowRejectForm((prev) => ({
                                  ...prev,
                                  [prescription.id]: false,
                                }));
                              }}
                              className="flex-1 py-2 px-4 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Form to upload result for IN_PROGRESS status */}
                  {prescription.status === "IN_PROGRESS" && (
                    <div className="space-y-4 border-t pt-4 border-gray-100">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Upload Result File
                        </label>
                        <div className="mt-1 flex items-center">
                          <div className="flex-grow">
                            <div className="relative mt-1 flex items-center">
                              <input
                                type="file"
                                ref={(el) => {
                                  fileInputRefs.current[prescription.id] = el;
                                }}
                                onChange={(e) =>
                                  handleFileSelect(prescription.id, e)
                                }
                                className="sr-only"
                                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                              />

                              <button
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault(); // Prevent default form submission
                                  fileInputRefs.current[
                                    prescription.id
                                  ]?.click();
                                }}
                                className="relative w-full flex items-center justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
                                disabled={
                                  fileUploadState[prescription.id]?.uploading
                                }
                              >
                                {fileUploadState[prescription.id]?.uploading ? (
                                  <>
                                    <Loader2 className="animate-spin h-4 w-4 mr-2" />
                                    Uploading...
                                  </>
                                ) : fileUploadState[prescription.id]
                                    ?.selectedFile ? (
                                  <>
                                    <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                                    {
                                      fileUploadState[prescription.id]
                                        .selectedFile?.name
                                    }
                                  </>
                                ) : (
                                  <>
                                    <Paperclip className="w-4 h-4 mr-2" />
                                    Select file
                                  </>
                                )}
                              </button>
                            </div>

                            {formData[prescription.id]?.resultFileUrl && (
                              <div className="mt-3">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  File URL
                                </label>
                                <div className="flex">
                                  <input
                                    type="text"
                                    value={
                                      formData[prescription.id]
                                        ?.resultFileUrl || ""
                                    }
                                    onChange={(e) =>
                                      handleInputChange(
                                        prescription.id,
                                        "resultFileUrl",
                                        e.target.value
                                      )
                                    }
                                    className="flex-grow p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-gray-500"
                                    readOnly
                                  />
                                  <a
                                    href={
                                      formData[prescription.id].resultFileUrl
                                    }
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 bg-gray-50 text-gray-700 rounded-r-md hover:bg-gray-100"
                                    onClick={(e) => {
                                      // Open in new tab without navigating away from current page
                                      e.preventDefault();
                                      window.open(
                                        formData[prescription.id].resultFileUrl,
                                        "_blank"
                                      );
                                    }}
                                  >
                                    <ExternalLink className="h-4 w-4" />
                                  </a>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Remarks
                        </label>
                        <textarea
                          value={formData[prescription.id]?.remarks || ""}
                          onChange={(e) =>
                            handleInputChange(
                              prescription.id,
                              "remarks",
                              e.target.value
                            )
                          }
                          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500"
                          rows={3}
                          placeholder="Add your remarks here..."
                        />
                      </div>

                      <button
                        onClick={(e) => {
                          e.preventDefault(); // Prevent default form submission
                          uploadResult(prescription.id);
                        }}
                        disabled={
                          uploading[prescription.id] ||
                          prescription.status ===
                            ("RETURNED_TO_ADMIN" as PrescriptionStatus)
                        }
                        className={
                          prescription.status ===
                          ("RETURNED_TO_ADMIN" as PrescriptionStatus)
                            ? "w-full py-2 flex items-center justify-center rounded-md transition bg-gray-200 text-gray-500 cursor-not-allowed"
                            : "w-full py-2 flex items-center justify-center rounded-md transition bg-black text-white hover:bg-gray-800"
                        }
                      >
                        {uploading[prescription.id] ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            Uploading...
                          </>
                        ) : prescription.status ===
                          ("RETURNED_TO_ADMIN" as PrescriptionStatus) ? (
                          <>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Result Uploaded
                          </>
                        ) : (
                          <>
                            <Upload className="h-4 w-4 mr-2" />
                            Completed
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  {/* View only for RETURNED_TO_ADMIN status */}
                  {prescription.status === "RETURNED_TO_ADMIN" && (
                    <div className="space-y-4 border-t pt-4 border-gray-100">
                      <div>
                        <span className="block text-sm font-medium text-gray-700 mb-1">
                          Result File
                        </span>
                        <a
                          href={prescription.resultFileUrl || ""}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                          onClick={(e) => {
                            // Open in new tab without navigating away from current page
                            e.preventDefault();
                            window.open(
                              prescription.resultFileUrl || "",
                              "_blank"
                            );
                          }}
                        >
                          <FileText className="h-4 w-4 mr-1" />
                          View Result File
                          <ExternalLink className="h-3 w-3 ml-1" />
                        </a>
                      </div>

                      {prescription.remarks && (
                        <div>
                          <span className="block text-sm font-medium text-gray-700 mb-1">
                            Remarks
                          </span>
                          <p className="text-gray-600 text-sm bg-gray-50 p-2 rounded-md border border-gray-100">
                            {prescription.remarks}
                          </p>
                        </div>
                      )}

                      <div className="bg-green-50 p-3 rounded-md border border-green-100 flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        <span className="text-sm text-green-700">
                          Result has been submitted to admin for review
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
