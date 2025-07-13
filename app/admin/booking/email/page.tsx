"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Link from "@tiptap/extension-link"
import Image from "@tiptap/extension-image"
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  LinkIcon,
  ImageIcon,
  Send,
  Paperclip,
  X,
  Mail,
  Eye,
  Settings,
  User,
  Sparkles,
  Zap,
  AtSign,
  CheckCircle,
  AlertCircle,
  Info,
  AlertTriangle,
} from "lucide-react"

// Types
interface EmailData {
  to: string
  subject: string
  text: string
  html: string
  senderType: string
}

interface UploadedFile {
  file: File
  url: string
  publicId: string
}

interface NotificationProps {
  title: string
  message: string
  isVisible: boolean
  onClose: () => void
  type?: "success" | "error" | "info" | "warning"
}

// Constants
const senderTypes = [
  {
    label: "No Reply",
    value: "noreply",
    email: "noreply@redtestlab.com",
    icon: "🚫",
    color: "bg-gray-500",
    description: "System notifications & automated messages",
  },
  {
    label: "Final Report",
    value: "finalreport",
    email: "finalreport@redtestlab.com",
    icon: "📊",
    color: "bg-blue-500",
    description: "Test results & medical reports",
  },
  {
    label: "Contact",
    value: "contact",
    email: "contact@redtestlab.com",
    icon: "📞",
    color: "bg-green-500",
    description: "General inquiries & customer service",
  },
  {
    label: "Support",
    value: "support",
    email: "customersupport@redtestlab.com",
    icon: "🛠️",
    color: "bg-purple-500",
    description: "Technical support & assistance",
  },
  {
    label: "Booking",
    value: "booking",
    email: "booking@redtestlab.com",
    icon: "📅",
    color: "bg-orange-500",
    description: "Appointments & scheduling",
  },
]

// Toast Notification Component
const Notification = ({ title, message, isVisible, onClose, type = "success" }: NotificationProps) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose()
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [isVisible, onClose])

  const getStyles = () => {
    switch (type) {
      case "success":
        return {
          bg: "bg-gradient-to-r from-green-500 to-emerald-500",
          icon: <CheckCircle className="w-4 h-4" />,
          iconBg: "bg-green-100",
          iconColor: "text-green-600",
        }
      case "error":
        return {
          bg: "bg-gradient-to-r from-red-500 to-pink-500",
          icon: <AlertCircle className="w-4 h-4" />,
          iconBg: "bg-red-100",
          iconColor: "text-red-600",
        }
      case "warning":
        return {
          bg: "bg-gradient-to-r from-yellow-500 to-orange-500",
          icon: <AlertTriangle className="w-4 h-4" />,
          iconBg: "bg-yellow-100",
          iconColor: "text-yellow-600",
        }
      default:
        return {
          bg: "bg-gradient-to-r from-sky-500 to-indigo-500",
          icon: <Info className="w-4 h-4" />,
          iconBg: "bg-blue-100",
          iconColor: "text-blue-600",
        }
    }
  }

  const styles = getStyles()

  if (!isVisible) return null

  return (
    <div className="fixed top-4 right-4 z-50 w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in slide-in-from-top-2">
      <div className={`h-1 ${styles.bg} w-full`} />
      <div className="p-4">
        <div className="flex items-start">
          <div className={`flex-shrink-0 w-8 h-8 rounded-full ${styles.iconBg} flex items-center justify-center mr-3`}>
            <div className={styles.iconColor}>{styles.icon}</div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <h3 className="font-semibold text-slate-800 text-sm">{title}</h3>
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-slate-600 ml-4 flex-shrink-0 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-slate-600 text-sm mt-1 leading-relaxed">{message}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// Debug Panel Component
const DebugPanel = ({ emailData, lastResponse }: { emailData: EmailData; lastResponse: any }) => {
  const [showDebug, setShowDebug] = useState(false)

  return (
    <div className="mt-6 border-t pt-6">
      <button
        onClick={() => setShowDebug(!showDebug)}
        className="text-sm text-gray-500 hover:text-gray-700 flex items-center"
      >
        <Settings className="w-4 h-4 mr-1" />
        {showDebug ? "Hide" : "Show"} Debug Info
      </button>

      {showDebug && (
        <div className="mt-4 space-y-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-800 mb-2">Request Payload</h4>
            <pre className="text-xs bg-white p-3 rounded border overflow-auto max-h-40">
              {JSON.stringify(
                {
                  to: emailData.to,
                  subject: emailData.subject,
                  html: emailData.html,
                  text: emailData.text,
                  senderType: emailData.senderType,
                },
                null,
                2,
              )}
            </pre>
          </div>

          {lastResponse && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-800 mb-2">Last Response</h4>
              <pre className="text-xs bg-white p-3 rounded border overflow-auto max-h-40">
                {JSON.stringify(lastResponse, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// Main Email Composer Component
const EmailComposer: React.FC = () => {
  // State Management
  const [emailData, setEmailData] = useState<EmailData>({
    to: "",
    subject: "",
    text: "",
    html: "",
    senderType: "noreply",
  })

  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [activeTab, setActiveTab] = useState<"compose" | "preview">("compose")
  const [lastResponse, setLastResponse] = useState<any>(null)
  const [notification, setNotification] = useState({
    show: false,
    title: "",
    message: "",
    type: "success" as "success" | "error" | "info" | "warning",
  })
  const [mounted, setMounted] = useState(false);

useEffect(() => {
  setMounted(true);
}, []);

  // TipTap Editor Setup
 const editor = useEditor({
  extensions: [
    StarterKit,
    Link.configure({
      openOnClick: false,
    }),
    Image,
  ],
  content: emailData.html,
  onUpdate: ({ editor }) => {
    const htmlContent = editor.getHTML();
    const textContent = editor.getText();
    setEmailData((prev) => ({
      ...prev,
      html: htmlContent,
      text: textContent,
    }));
  },
  // Add this to prevent SSR issues
  immediatelyRender: false,
});

  // Utility Functions
  const showNotification = (
    title: string,
    message: string,
    type: "success" | "error" | "info" | "warning" = "success",
  ) => {
    setNotification({
      show: true,
      title,
      message,
      type,
    })
  }

  const closeNotification = () => {
    setNotification((prev) => ({ ...prev, show: false }))
  }

  const selectedSenderType = senderTypes.find((type) => type.value === emailData.senderType)

  // File Upload Functions
  const uploadToCloudinary = async (file: File): Promise<UploadedFile> => {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("upload_preset", "E-Rickshaw")

    const response = await fetch(`https://api.cloudinary.com/v1_1/dm8jxispy/auto/upload`, {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      throw new Error("Failed to upload file")
    }

    const data = await response.json()
    return {
      file,
      url: data.secure_url,
      publicId: data.public_id,
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    if (files.length === 0) return

    setIsUploading(true)
    try {
      const uploadPromises = files.map(uploadToCloudinary)
      const uploadedFiles = await Promise.all(uploadPromises)
      setUploadedFiles((prev) => [...prev, ...uploadedFiles])
      showNotification("Files Uploaded", `${files.length} file(s) uploaded successfully! ✨`, "success")
    } catch (error) {
      showNotification("Upload Failed", "Failed to upload files. Please try again.", "error")
    } finally {
      setIsUploading(false)
    }
  }

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index))
    showNotification("File Removed", "File has been removed from attachments.", "info")
  }

  // Editor Functions
  const insertImage = () => {
    const url = window.prompt("Enter image URL:")
    if (url && editor) {
      editor.chain().focus().setImage({ src: url }).run()
      showNotification("Image Inserted", "Image has been added to your email content.", "success")
    }
  }

  const insertLink = () => {
    const url = window.prompt("Enter URL:")
    if (url && editor) {
      editor.chain().focus().setLink({ href: url }).run()
      showNotification("Link Inserted", "Link has been added to your email content.", "success")
    }
  }

  const insertUploadedImage = (imageUrl: string) => {
    if (editor) {
      editor.chain().focus().setImage({ src: imageUrl }).run()
      showNotification("Image Inserted", "Uploaded image has been added to your email content.", "success")
    }
  }

  // IMPROVED Email Sending Function
  const sendEmail = async () => {
  // Validation
  if (!emailData.to || !emailData.subject || (!emailData.html && !emailData.text)) {
    showNotification("Validation Error", "Please fill in all required fields to send your email.", "error");
    return;
  }

  setIsSending(true);
  setLastResponse(null);

  try {
    // Ensure we have HTML content
    const htmlContent = emailData.html || `<p>${emailData.text}</p>`;
    const textContent = emailData.text || emailData.html.replace(/<[^>]*>/g, "");

    const payload = {
      to: emailData.to,
      subject: emailData.subject,
      html: htmlContent,
      text: textContent,
      senderType: emailData.senderType,
      ...(uploadedFiles.length > 0 && {
        attachments: uploadedFiles.map((file) => ({
          filename: file.file.name,
          url: file.url,
          contentType: file.file.type,
        })),
      }),
    };

    console.log("Sending email with payload:", payload);

    const response = await fetch("https://redtestlab.com/api/email/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    // First read the response as text
    const responseText = await response.text();
    
    let result;
    try {
      // Then try to parse it as JSON
      result = JSON.parse(responseText);
    } catch (parseError) {
      // If parsing fails, use the text response as the result
      result = { message: responseText };
    }

    setLastResponse({
      status: response.status,
      statusText: response.statusText,
      data: result,
      timestamp: new Date().toISOString(),
    });

    if (!response.ok) {
      throw new Error(result.message || result.error || `HTTP ${response.status}: ${response.statusText}`);
    }

    // Success notification
    showNotification(
      "Email Sent Successfully! 🎉",
      `Your email has been sent to ${emailData.to} from ${selectedSenderType?.email}`,
      "success",
    );

    // Reset form after 3 seconds
    setTimeout(() => {
      setEmailData({
        to: "",
        subject: "",
        text: "",
        html: "",
        senderType: "noreply",
      });
      setUploadedFiles([]);
      editor?.commands.setContent("");
      setActiveTab("compose");
    }, 3000);
  } catch (error) {
    console.error("Email send error:", error);

    let errorMessage = "Failed to send email. Please try again.";

    if (error instanceof TypeError && error.message.includes("fetch")) {
      errorMessage =
        "Network error: Cannot connect to email server. Check if your backend is running on https://redtestlab.com";
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    setLastResponse({
      error: errorMessage,
      timestamp: new Date().toISOString(),
    });

    showNotification("Email Send Failed", errorMessage, "error");
  } finally {
    setIsSending(false);
  }
};

  // Test Connection Function
  const testConnection = async () => {
    try {
      const response = await fetch("https://redtestlab.com/api/health", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (response.ok) {
        showNotification("Connection Test", "✅ Backend server is reachable!", "success")
      } else {
        showNotification("Connection Test", "❌ Backend server responded with error", "error")
      }
    } catch (error) {
      showNotification("Connection Test", "❌ Cannot connect to backend server", "error")
    }
  }

  // Render Component
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Toast Notification */}
        <Notification
          title={notification.title}
          message={notification.message}
          isVisible={notification.show}
          onClose={closeNotification}
          type={notification.type}
        />

        {/* Main Content Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Status Bar */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 text-white">
                <Sparkles className="w-5 h-5" />
                <span className="font-medium">Email Composer</span>
                <span className="text-blue-100">•</span>
                <div className="flex items-center space-x-2">
                  <AtSign className="w-4 h-4" />
                  <span className="text-blue-100 text-sm">{selectedSenderType?.email}</span>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <button onClick={testConnection} className="text-white text-sm hover:text-blue-100 transition-colors">
                  Test Connection
                </button>
                <div className="flex items-center space-x-2 text-white text-sm">
                  <Zap className="w-4 h-4" />
                  <span>{emailData.text.length} characters</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab("compose")}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === "compose"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <Mail className="w-4 h-4 inline mr-2" />
                Compose
              </button>
              <button
                onClick={() => setActiveTab("preview")}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === "preview"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <Eye className="w-4 h-4 inline mr-2" />
                Preview
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          {activeTab === "compose" ? (
            <div className="p-6 space-y-8">
              {/* Sender Email Selection */}
              <section>
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <Settings className="w-5 h-5 mr-2" />
                  Sender Email
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {senderTypes.map((type) => (
                    <label
                      key={type.value}
                      className={`
                        flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all
                        ${
                          emailData.senderType === type.value
                            ? "border-blue-500 bg-blue-50 shadow-md"
                            : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                        }
                      `}
                    >
                      <input
                        type="radio"
                        name="senderType"
                        value={type.value}
                        checked={emailData.senderType === type.value}
                        onChange={(e) => setEmailData((prev) => ({ ...prev, senderType: e.target.value }))}
                        className="sr-only"
                      />
                      <div className="flex items-center space-x-3 flex-1">
                        <div className={`w-3 h-3 rounded-full ${type.color}`} />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <span className="text-lg">{type.icon}</span>
                            <span className="font-medium text-gray-800">{type.label}</span>
                          </div>
                          <div className="text-sm text-blue-600 font-mono">{type.email}</div>
                          <div className="text-xs text-gray-500 mt-1">{type.description}</div>
                        </div>
                      </div>
                      {emailData.senderType === type.value && (
                        <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full" />
                        </div>
                      )}
                    </label>
                  ))}
                </div>
              </section>

              {/* Recipient */}
              <section>
                <label className="block text-lg font-bold text-gray-800 mb-4">
                  <User className="w-5 h-5 inline mr-2" />
                  To <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={emailData.to}
                  onChange={(e) => setEmailData((prev) => ({ ...prev, to: e.target.value }))}
                  placeholder="recipient@example.com"
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-lg"
                  required
                />
              </section>

              {/* Subject */}
              <section>
                <label className="block text-lg font-bold text-gray-800 mb-4">
                  📝 Subject <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={emailData.subject}
                  onChange={(e) => setEmailData((prev) => ({ ...prev, subject: e.target.value }))}
                  placeholder="Enter your email subject line"
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg transition-all"
                  required
                />
              </section>

              {/* File Upload */}
              <section>
                <label className="block text-lg font-bold text-gray-800 mb-4">📎 Attachments</label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors bg-gray-50/50">
                  <label className="cursor-pointer">
                    <div className="flex flex-col items-center space-y-3">
                      <div className="p-4 bg-blue-100 rounded-full">
                        <Paperclip className="w-8 h-8 text-blue-600" />
                      </div>
                      <div>
                        <span className="text-blue-600 font-semibold text-lg">
                          {isUploading ? "Uploading files..." : "Click to upload files"}
                        </span>
                        <p className="text-gray-500 mt-1">or drag and drop your files here</p>
                        <p className="text-gray-400 text-sm mt-1">Supports images, PDFs, documents</p>
                      </div>
                    </div>
                    <input
                      type="file"
                      multiple
                      onChange={handleFileUpload}
                      className="hidden"
                      disabled={isUploading}
                      accept="image/*,.pdf,.doc,.docx,.txt"
                    />
                  </label>
                </div>

                {/* Uploaded Files Display */}
                {uploadedFiles.length > 0 && (
                  <div className="mt-6 space-y-3">
                    <h4 className="font-medium text-gray-700">Uploaded Files ({uploadedFiles.length})</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {uploadedFiles.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                              <Paperclip className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <span className="text-sm font-medium text-gray-700 block truncate max-w-32">
                                {file.file.name}
                              </span>
                              <span className="text-xs text-gray-500">
                                {(file.file.size / 1024 / 1024).toFixed(2)} MB
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {file.file.type.startsWith("image/") && (
                              <button
                                onClick={() => insertUploadedImage(file.url)}
                                className="text-xs bg-blue-500 text-white px-3 py-1 rounded-full hover:bg-blue-600 transition-colors"
                              >
                                Insert
                              </button>
                            )}
                            <button onClick={() => removeFile(index)} className="text-red-500 hover:text-red-700 p-1">
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </section>

              {/* Rich Text Editor */}
              <section>
                <label className="block text-lg font-bold text-gray-800 mb-4">
                  ✍️ Email Content <span className="text-red-500">*</span>
                </label>
                <div className="border-2 border-gray-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent">
                  {/* Editor Toolbar */}
                  <div className="flex items-center space-x-1 p-4 bg-gray-50 border-b border-gray-200">
                    <button
                      type="button"
                      onClick={() => editor?.chain().focus().toggleBold().run()}
                      className={`p-3 rounded-lg transition-all ${
                        editor?.isActive("bold")
                          ? "bg-blue-500 text-white shadow-md"
                          : "bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                      }`}
                      title="Bold"
                    >
                      <Bold className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => editor?.chain().focus().toggleItalic().run()}
                      className={`p-3 rounded-lg transition-all ${
                        editor?.isActive("italic")
                          ? "bg-blue-500 text-white shadow-md"
                          : "bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                      }`}
                      title="Italic"
                    >
                      <Italic className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => editor?.chain().focus().toggleBulletList().run()}
                      className={`p-3 rounded-lg transition-all ${
                        editor?.isActive("bulletList")
                          ? "bg-blue-500 text-white shadow-md"
                          : "bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                      }`}
                      title="Bullet List"
                    >
                      <List className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => editor?.chain().focus().toggleOrderedList().run()}
                      className={`p-3 rounded-lg transition-all ${
                        editor?.isActive("orderedList")
                          ? "bg-blue-500 text-white shadow-md"
                          : "bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                      }`}
                      title="Numbered List"
                    >
                      <ListOrdered className="w-4 h-4" />
                    </button>
                    <div className="w-px h-8 bg-gray-300 mx-2" />
                    <button
                      type="button"
                      onClick={insertLink}
                      className="p-3 rounded-lg bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all"
                      title="Insert Link"
                    >
                      <LinkIcon className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={insertImage}
                      className="p-3 rounded-lg bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all"
                      title="Insert Image"
                    >
                      <ImageIcon className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Editor Content */}
                  {mounted && editor && (
  <EditorContent
    editor={editor}
    className="prose max-w-none p-6 min-h-[300px] focus:outline-none bg-white"
  />
)}
                </div>
              </section>

              {/* Debug Panel */}
              <DebugPanel emailData={emailData} lastResponse={lastResponse} />

              {/* Send Button */}
              <section className="flex justify-end pt-6 border-t border-gray-200">
                <button
                  onClick={sendEmail}
                  disabled={isSending || !emailData.to || !emailData.subject || (!emailData.html && !emailData.text)}
                  className="flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-lg"
                >
                  <Send className="w-5 h-5 mr-2" />
                  {isSending ? "Sending Email..." : "Send Email"}
                </button>
              </section>
            </div>
          ) : (
            /* Preview Tab */
            <div className="p-6">
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="bg-white rounded-xl shadow-sm border p-6 max-w-4xl mx-auto">
                  <div className="border-b pb-4 mb-6">
                    <div className="text-sm text-gray-500 mb-2">From: {selectedSenderType?.email}</div>
                    <div className="text-sm text-gray-500 mb-2">To: {emailData.to || "recipient@example.com"}</div>
                    <div className="font-bold text-gray-800 text-xl mb-4">{emailData.subject || "Email Subject"}</div>
                  </div>
                  <div className="prose prose-lg max-w-none">
                    {emailData.html ? (
                      <div dangerouslySetInnerHTML={{ __html: emailData.html }} />
                    ) : (
                      <p className="text-gray-400 italic text-center py-12">
                        Start composing your email to see the preview here...
                      </p>
                    )}
                  </div>
                  {uploadedFiles.length > 0 && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <h4 className="font-semibold text-gray-800 mb-3">Attachments ({uploadedFiles.length})</h4>
                      <div className="space-y-2">
                        {uploadedFiles.map((file, index) => (
                          <div key={index} className="flex items-center space-x-3 text-sm text-gray-600">
                            <Paperclip className="w-4 h-4" />
                            <span>{file.file.name}</span>
                            <span className="text-gray-400">({(file.file.size / 1024 / 1024).toFixed(2)} MB)</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default EmailComposer
