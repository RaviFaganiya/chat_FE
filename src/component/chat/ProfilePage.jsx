"use client"

import { useState, useEffect, useRef } from "react"
import axios from "axios"
import {
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  FileText,
  Camera,
  Save,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
} from "lucide-react"

function ProfilePage({ onBack }) {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    mobileNumber: "",
    birthdate: "",
    bio: "",
    location: "",
    profilePic: "",
    privacy: {
      showEmail: false,
      showMobile: false,
      showBirthdate: true,
    },
  })

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const fileInputRef = useRef(null)

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("token")

      const response = await axios.get("https://chat-be-v2eh.onrender.com/api/user/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.data.success) {
        const userData = response.data.user
        setProfile({
          name: userData.name || "",
          email: userData.email || "",
          mobileNumber: userData.mobileNumber || "",
          birthdate: userData.birthdate ? userData.birthdate.split("T")[0] : "",
          bio: userData.bio || "",
          location: userData.location || "",
          profilePic: userData.profilePic || "",
          privacy: userData.privacy || {
            showEmail: false,
            showMobile: false,
            showBirthdate: true,
          },
        })
      }
    } catch (error) {
      console.error("Error fetching profile:", error)
      setError("Failed to load profile data")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field, value) => {
    setProfile((prev) => ({
      ...prev,
      [field]: value,
    }))
    setError("")
    setSuccess("")
  }

  const handleImageUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file")
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB")
      return
    }

    try {
      setUploading(true)
      setError("")

      const formData = new FormData()
      formData.append("profilePic", file)

      const token = localStorage.getItem("token")
      const response = await axios.post("https://chat-be-v2eh.onrender.com/api/upload/profile-picture", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })

      if (response.data.success) {
        const imageUrl = `https://chat-be-v2eh.onrender.com${response.data.imageUrl}`
        setProfile((prev) => ({
          ...prev,
          profilePic: imageUrl,
        }))
        setSuccess("Profile picture uploaded successfully!")
      }
    } catch (error) {
      console.error("Error uploading image:", error)
      setError(error.response?.data?.message || "Failed to upload image")
    } finally {
      setUploading(false)
    }
  }

  const handleSaveProfile = async () => {
    try {
      setSaving(true)
      setError("")
      setSuccess("")

      if (!profile.name.trim()) {
        setError("Name is required")
        return
      }

      if (profile.birthdate && new Date(profile.birthdate) >= new Date()) {
        setError("Birthdate cannot be in the future")
        return
      }

      if (profile.mobileNumber && !/^[+]?[1-9][\d]{0,15}$/.test(profile.mobileNumber)) {
        setError("Please enter a valid mobile number")
        return
      }

      if (profile.bio && profile.bio.length > 500) {
        setError("Bio cannot exceed 500 characters")
        return
      }

      const token = localStorage.getItem("token")

      const profileData = {
        name: profile.name,
        mobileNumber: profile.mobileNumber,
        birthdate: profile.birthdate,
        bio: profile.bio,
        location: profile.location,
        profilePic: profile.profilePic,
      }

      const response = await axios.put("https://chat-be-v2eh.onrender.com/api/user/profile", profileData, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.data.success) {
        setSuccess("Profile updated successfully!")

        if (profile.name) {
          localStorage.setItem("userName", profile.name)
        }
      }
    } catch (error) {
      console.error("Error saving profile:", error)

      if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
        const errorMessages = error.response.data.errors.map((err) => err.msg || err.message).join(", ")
        setError(`Validation errors: ${errorMessages}`)
      } else {
        setError(error.response?.data?.message || "Failed to update profile")
      }
    } finally {
      setSaving(false)
    }
  }

  const calculateAge = (birthdate) => {
    if (!birthdate) return null
    const today = new Date()
    const birth = new Date(birthdate)
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }
    return age
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <ArrowLeft size={20} />
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Alert Messages */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-2">
            <AlertCircle size={20} className="text-red-600" />
            <span className="text-red-700">{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-2">
            <CheckCircle size={20} className="text-green-600" />
            <span className="text-green-700">{success}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              {/* Profile Picture */}
              <div className="text-center mb-6">
                <div className="relative inline-block">
                  <img
                    src={profile.profilePic || "/placeholder.svg?height=120&width=120"}
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover border-4 border-gray-200"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {uploading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <Camera size={16} />
                    )}
                  </button>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <h3 className="mt-3 font-semibold text-gray-900">{profile.name || "Your Name"}</h3>
                <p className="text-sm text-gray-500">{profile.email}</p>
                {profile.birthdate && <p className="text-sm text-gray-500">Age: {calculateAge(profile.birthdate)}</p>}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Profile Information</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <User size={16} className="inline mr-1" />
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={profile.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>

                  {/* Email (Read-only) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Mail size={16} className="inline mr-1" />
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={profile.email}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed"
                      disabled
                    />
                    <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                  </div>

                  {/* Mobile Number */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Phone size={16} className="inline mr-1" />
                      Mobile Number
                    </label>
                    <input
                      type="tel"
                      value={profile.mobileNumber}
                      onChange={(e) => handleInputChange("mobileNumber", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="+1234567890"
                      pattern="[+]?[1-9][\d]{0,15}"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Enter a valid mobile number (e.g., +1234567890 or 1234567890)
                    </p>
                  </div>

                  {/* Birthdate */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Calendar size={16} className="inline mr-1" />
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      value={profile.birthdate}
                      onChange={(e) => handleInputChange("birthdate", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      max={new Date().toISOString().split("T")[0]}
                    />
                    <p className="text-xs text-gray-500 mt-1">Please select a date in the past</p>
                  </div>

                  {/* Location */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <MapPin size={16} className="inline mr-1" />
                      Location
                    </label>
                    <input
                      type="text"
                      value={profile.location}
                      onChange={(e) => handleInputChange("location", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="City, Country"
                    />
                  </div>

                  {/* Bio */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FileText size={16} className="inline mr-1" />
                      Bio
                    </label>
                    <textarea
                      value={profile.bio}
                      onChange={(e) => handleInputChange("bio", e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Tell us about yourself..."
                      maxLength={500}
                    />
                    <p className="text-xs text-gray-500 mt-1">{profile.bio.length}/500 characters</p>
                  </div>
                </div>

                {/* Save Button */}
                <div className="mt-8 flex justify-end">
                  <button
                    onClick={handleSaveProfile}
                    disabled={saving || !profile.name.trim()}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {saving ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <Save size={16} />
                    )}
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
