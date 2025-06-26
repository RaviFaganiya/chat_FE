"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { X, Mail, Phone, Calendar, MapPin, FileText } from "lucide-react"

function ProfileModal({ userId, isOpen, onClose }) {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (isOpen && userId) {
      fetchUserProfile()
    }
  }, [isOpen, userId])

  const fetchUserProfile = async () => {
    try {
      setLoading(true)
      setError("")

      const token = localStorage.getItem("token")
      const response = await axios.get(`https://chat-be-v2eh.onrender.com/api/user/profile/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.data.success) {
        setProfile(response.data.user)
      }
    } catch (error) {
      console.error("Error fetching user profile:", error)
      setError("Failed to load user profile")
    } finally {
      setLoading(false)
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

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">User Profile</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading profile...</p>
            </div>
          )}

          {error && (
            <div className="text-center py-8">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {profile && (
            <div className="space-y-6">
              {/* Profile Picture and Basic Info */}
              <div className="text-center">
                <img
                  src={profile.profilePic || "/placeholder.svg?height=100&width=100"}
                  alt={profile.name}
                  className="w-20 h-20 rounded-full object-cover mx-auto border-4 border-gray-200"
                />
                <h3 className="mt-3 text-xl font-semibold text-gray-900">{profile.name}</h3>
                <div className="flex items-center justify-center gap-2 mt-1">
                  <div className={`w-2 h-2 rounded-full ${profile.isOnline ? "bg-green-500" : "bg-gray-400"}`}></div>
                  <span className="text-sm text-gray-500">{profile.isOnline ? "Online" : "Offline"}</span>
                </div>
              </div>

              {/* Profile Details */}
              <div className="space-y-4">
                {/* Email */}
                {profile.email && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Mail size={18} className="text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium text-gray-900">{profile.email}</p>
                    </div>
                  </div>
                )}

                {/* Mobile Number */}
                {profile.mobileNumber && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Phone size={18} className="text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Mobile</p>
                      <p className="font-medium text-gray-900">{profile.mobileNumber}</p>
                    </div>
                  </div>
                )}

                {/* Age */}
                {profile.birthdate && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Calendar size={18} className="text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Age</p>
                      <p className="font-medium text-gray-900">{calculateAge(profile.birthdate)} years old</p>
                    </div>
                  </div>
                )}

                {/* Location */}
                {profile.location && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <MapPin size={18} className="text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Location</p>
                      <p className="font-medium text-gray-900">{profile.location}</p>
                    </div>
                  </div>
                )}

                {/* Bio */}
                {profile.bio && (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText size={18} className="text-gray-500" />
                      <p className="text-sm text-gray-500">About</p>
                    </div>
                    <p className="text-gray-900">{profile.bio}</p>
                  </div>
                )}

                {/* Last Seen */}
                {profile.lastSeen && !profile.isOnline && (
                  <div className="text-center text-sm text-gray-500">
                    Last seen: {new Date(profile.lastSeen).toLocaleString()}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProfileModal
