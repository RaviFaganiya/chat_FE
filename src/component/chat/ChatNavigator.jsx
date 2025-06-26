"use client"

import { useEffect, useState } from "react"
import SideBar from "./SideBar"
import ProfilePage from "./ProfilePage"
import { Route, Routes, useNavigate, useLocation } from "react-router-dom"
import StartChat from "./StartChat"
import Chat from "./Chat"
import axios from "axios"

function ChatNavigator({ setIsCreateAccount }) {
  const [users, setUsers] = useState([])
  const [currentUser, setCurrentUser] = useState(null)
  // const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showProfile, setShowProfile] = useState(false)

  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem("token")
      const email = localStorage.getItem("email")

      if (!token || !email) {
        setIsCreateAccount(false)
        return
      }

      try {
        // setLoading(true)
        const res = await axios.get("https://chat-be-v2eh.onrender.com/api/user/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const responseData = res.data

        if (responseData.success) {
          setCurrentUser(responseData.currentUser)
          setUsers(responseData.users || [])

          if (location.pathname === "/chat" && responseData.users?.length > 0) {
            navigate(`/chat/${responseData.users[0]._id}`)
          }
        } else {
          throw new Error("Failed to fetch users")
        }

        setError(null)
      } catch (error) {
        console.error("Error fetching users:", error)
        setError("Failed to load users")

        if (error.response?.status === 401) {
          localStorage.removeItem("token")
          localStorage.removeItem("email")
          setIsCreateAccount(false)
        }
      } 
      // finally {
      //   setLoading(false)
      // }
    }

    if (!showProfile) {
      fetchUsers()
    }
  }, [location.pathname, navigate, setIsCreateAccount, showProfile])

  if (showProfile) {
    return <ProfilePage onBack={() => setShowProfile(false)} />
  }

  // if (loading) {
  //   return (
  //     <div className="flex h-screen bg-gray-100 items-center justify-center">
  //       <div className="text-center">
  //         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
  //         <p className="text-gray-600">Loading chat...</p>
  //       </div>
  //     </div>
  //   )
  // }

  if (error) {
    return (
      <div className="flex h-screen bg-gray-100 items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="flex-shrink-0">
        <SideBar
          setIsCreateAccount={setIsCreateAccount}
          currentUser={currentUser}
          otherUsers={users}
          onProfileClick={() => setShowProfile(true)}
        />
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-hidden">
        <Routes>
          <Route path="/" element={<StartChat currentUser={currentUser} />} />
          <Route path="/chat/:id" element={<Chat currentUser={currentUser} />} />
        </Routes>
      </div>
    </div>
  )
}

export default ChatNavigator
