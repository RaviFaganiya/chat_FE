"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Settings, LogOut } from "lucide-react"
import socket from "../../socket"

export default function Sidebar({ setIsCreateAccount, onProfileClick }) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const getUserList = async () => {
    const token = localStorage.getItem("token")
    try {
      setLoading(true)
      const response = await fetch("https://chat-be-v2eh.onrender.com/api/user/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch users")
      }

      const result = await response.json()
      console.log("Fetched users data:", result) // Debug log
      setData(result)
      setError(null)
    } catch (error) {
      console.error("Error fetching users:", error)
      setError("Failed to load users")

      if (error.message.includes("401")) {
        localStorage.removeItem("token")
        setIsCreateAccount?.(false)
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getUserList()

    // Socket event listeners for real-time updates
    const handleLastMessageUpdate = ({ userId, lastMessage }) => {
      console.log("Sidebar: Last message update:", { userId, lastMessage }) // Debug log

      setData((prevData) => {
        if (!prevData) return prevData

        const updatedUsers = prevData.users.map((user) => {
          if (user._id === userId) {
            return {
              ...user,
              lastMessage: lastMessage,
            }
          }
          return user
        })

        // Sort users by last message timestamp
        updatedUsers.sort((a, b) => {
          const aTime = a.lastMessage?.timestamp || new Date(0)
          const bTime = b.lastMessage?.timestamp || new Date(0)
          return new Date(bTime) - new Date(aTime)
        })

        return {
          ...prevData,
          users: updatedUsers,
        }
      })
    }

    const handleUnreadCountUpdate = ({ userId, unreadCount }) => {
      console.log("Sidebar: Unread count update:", { userId, unreadCount }) // Debug log

      setData((prevData) => {
        if (!prevData) return prevData

        const updatedUsers = prevData.users.map((user) => {
          if (user._id === userId) {
            return {
              ...user,
              lastMessage: user.lastMessage
                ? {
                  ...user.lastMessage,
                  unreadCount: unreadCount,
                }
                : {
                  content: null,
                  timestamp: null,
                  unreadCount: unreadCount,
                  isFromCurrentUser: false,
                },
            }
          }
          return user
        })

        return {
          ...prevData,
          users: updatedUsers,
        }
      })
    }

    const handleReceiveMessage = (message) => {
      console.log("Sidebar: Received message:", message) // Debug log

      // Update last message and increment unread count for the sender
      setData((prevData) => {
        if (!prevData) return prevData

        const updatedUsers = prevData.users.map((user) => {
          if (user._id === message.fromUserId) {
            const currentUnread = user.lastMessage?.unreadCount || 0
            return {
              ...user,
              lastMessage: {
                content: message.message,
                timestamp: message.timestamp,
                unreadCount: currentUnread + 1,
                isFromCurrentUser: false,
              },
            }
          }
          return user
        })

        // Sort users by last message timestamp
        updatedUsers.sort((a, b) => {
          const aTime = a.lastMessage?.timestamp || new Date(0)
          const bTime = b.lastMessage?.timestamp || new Date(0)
          return new Date(bTime) - new Date(aTime)
        })

        return {
          ...prevData,
          users: updatedUsers,
        }
      })
    }

    const handleUserOnline = ({ userId }) => {
      setData((prevData) => {
        if (!prevData) return prevData

        const updatedUsers = prevData.users.map((user) => {
          if (user._id === userId) {
            return { ...user, isOnline: true }
          }
          return user
        })

        return { ...prevData, users: updatedUsers }
      })
    }

    const handleUserOffline = ({ userId }) => {
      setData((prevData) => {
        if (!prevData) return prevData

        const updatedUsers = prevData.users.map((user) => {
          if (user._id === userId) {
            return { ...user, isOnline: false }
          }
          return user
        })

        return { ...prevData, users: updatedUsers }
      })
    }

    // Add socket listeners
    socket.on("last_message_update", handleLastMessageUpdate)
    socket.on("unread_count_update", handleUnreadCountUpdate)
    socket.on("receive_message", handleReceiveMessage)
    socket.on("user_online", handleUserOnline)
    socket.on("user_offline", handleUserOffline)

    // Cleanup
    return () => {
      socket.off("last_message_update", handleLastMessageUpdate)
      socket.off("unread_count_update", handleUnreadCountUpdate)
      socket.off("receive_message", handleReceiveMessage)
      socket.off("user_online", handleUserOnline)
      socket.off("user_offline", handleUserOffline)
    }
  }, [])

  const handleUserClick = async (userId) => {
    console.log(`Sidebar: User clicked: ${userId}`) // Debug log

    // Navigate to chat - the chat page will handle marking messages as read
    navigate(`/chat/${userId}`)
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("email")
    socket.disconnect()
    setIsCreateAccount?.(false)
    navigate("/login")
  }

  const formatLastMessage = (message) => {
    return message.length > 30 ? `${message.substring(0, 30)}...` : message
  }

  // const formatTime = (timestamp) => {
  //   const now = new Date()
  //   const messageTime = new Date(timestamp)
  //   const diffInHours = (now.getTime() - messageTime.getTime()) / (1000 * 60 * 60)

  //   if (diffInHours < 1) {
  //     return "now"
  //   } else if (diffInHours < 24) {
  //     return messageTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  //   } else if (diffInHours < 48) {
  //     return "yesterday"
  //   } else {
  //     return messageTime.toLocaleDateString([], { month: "short", day: "numeric" })
  //   }
  // }

  const formatTime = (timestamp) => {
    const now = new Date()
    const messageTime = new Date(timestamp)
    const diffInMinutes = Math.floor((now.getTime() - messageTime.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) {
      return "now"
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes} min ago`
    } else if (diffInMinutes < 1440) {
      // Less than 24 hours
      return messageTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    } else if (diffInMinutes < 2880) {
      return "yesterday"
    } else {
      return messageTime.toLocaleDateString([], { month: "short", day: "numeric" })
    }
  }


  if (error) {
    return (
      <div className="w-64 h-screen bg-gray-900 text-white flex flex-col">
        <div className="flex items-center justify-center flex-1 p-4">
          <div className="text-center">
            <p className="text-red-400 mb-4">{error}</p>
            <button
              onClick={getUserList}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-64 h-screen bg-gray-900 text-white flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        {/* Current User Profile */}
        <div className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg mb-3">
          <div className="relative">
            <img
              src={data?.currentUser?.profilePic || "/placeholder.svg"}
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-sm font-semibold truncate">{data?.currentUser?.name || "Loading..."}</h2>
            <p className="text-xs text-gray-400 truncate">{data?.currentUser?.email}</p>
          </div>
        </div>

        {/* Profile Button */}
        <button
          onClick={onProfileClick}
          className="w-full flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded text-sm transition-colors"
        >
          <Settings size={16} />
          Profile Settings
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <h3 className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wide">
            Contacts ({data?.users?.length || 0})
          </h3>

          <div className="space-y-1">
            {loading
              ? // Loading skeleton
              Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="p-3 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 bg-gray-700 rounded-full animate-pulse" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 bg-gray-700 rounded animate-pulse" />
                      <div className="h-2 bg-gray-700 rounded w-2/3 animate-pulse" />
                    </div>
                  </div>
                </div>
              ))
              : data?.users?.map((user) => {
                // Get unread count - ensure it's a number and > 0
                const unreadCount = user.lastMessage?.unreadCount || 0
                const hasUnreadMessages = typeof unreadCount === "number" && unreadCount > 0

                console.log(
                  `Sidebar: User ${user.name} - Unread count: ${unreadCount}, Has unread: ${hasUnreadMessages}`,
                ) // Debug log

                return (
                  <div key={user._id} className="group">
                    <button
                      onClick={() => handleUserClick(user._id)}
                      className="w-full p-3 rounded-lg hover:bg-gray-800 transition-colors text-left"
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <img
                            src={user.profilePic || "/placeholder.svg"}
                            alt={user.name}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                          {user.isOnline && (
                            <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-green-500 rounded-full border-2 border-gray-900" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium truncate">{user.name}</span>
                            {user.lastMessage?.timestamp && (
                              <span className="text-xs text-gray-400">{formatTime(user.lastMessage.timestamp)}</span>
                            )}
                          </div>
                          {/* Last Message Display */}
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500 truncate">
                              {user.lastMessage?.content
                                ? formatLastMessage(user.lastMessage.content)
                                : "No messages yet"}
                            </span>
                            {/* Unread Count Badge - Only show if count > 0 */}
                            {hasUnreadMessages && (
                              <span className="bg-red-500 text-white text-xs rounded-full min-w-[20px] h-5 flex items-center justify-center px-1.5 flex-shrink-0 ml-2 font-medium">
                                {unreadCount > 99 ? "99+" : unreadCount}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </button>
                  </div>
                )
              })}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-sm transition-colors"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </div>
  )
}
