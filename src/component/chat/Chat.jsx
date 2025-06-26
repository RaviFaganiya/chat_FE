// // // // // "use client"

// // // // // import { useEffect, useState, useRef, useCallback } from "react"
// // // // // import { useParams } from "react-router-dom"
// // // // // import axios from "axios"
// // // // // import socket from "../../socket"
// // // // // import VideoCallModal from "./video-call-model"
// // // // // import VoiceModal from "./Voice-model"
// // // // // import { Phone, PhoneOff, Video, VideoOff, Mic, MicOff } from "lucide-react"

// // // // // function Chat({ currentUser: propCurrentUser }) {
// // // // //   const { id } = useParams()
// // // // //   const [messages, setMessages] = useState([])
// // // // //   const [input, setInput] = useState("")
// // // // //   const [currentUser, setCurrentUser] = useState(propCurrentUser)
// // // // //   const [toUser, setToUser] = useState(null)
// // // // //   const [isUserOnline, setIsUserOnline] = useState(false)
// // // // //   const [isTyping, setIsTyping] = useState(false)
// // // // //   const [isWindowFocused, setIsWindowFocused] = useState(true)
// // // // //   const [loading, setLoading] = useState(true)
// // // // //   const [error, setError] = useState(null)

// // // // //   // Call-related states
// // // // //   const [isInCall, setIsInCall] = useState(false)
// // // // //   const [isVideoCall, setIsVideoCall] = useState(false)
// // // // //   const [isCallIncoming, setIsCallIncoming] = useState(false)
// // // // //   const [incomingCallType, setIncomingCallType] = useState(null)
// // // // //   const [isCallConnected, setIsCallConnected] = useState(false)
// // // // //   const [isMuted, setIsMuted] = useState(false)
// // // // //   const [isVideoEnabled, setIsVideoEnabled] = useState(true)
// // // // //   const [callDuration, setCallDuration] = useState(0)
// // // // //   const [showVoiceModal, setShowVoiceModal] = useState(false)
// // // // //   const [isListening, setIsListening] = useState(false)
// // // // //   const [transcript, setTranscript] = useState("")

// // // // //   // Refs
// // // // //   const typingTimeoutRef = useRef(null)
// // // // //   const messagesEndRef = useRef(null)
// // // // //   const unreadMessagesRef = useRef(new Set())
// // // // //   const localVideoRef = useRef(null)
// // // // //   const remoteVideoRef = useRef(null)
// // // // //   const peerConnectionRef = useRef(null)
// // // // //   const localStreamRef = useRef(null)
// // // // //   const callTimerRef = useRef(null)

// // // // //   // WebRTC configuration
// // // // //   const rtcConfiguration = {
// // // // //     iceServers: [{ urls: "stun:stun.l.google.com:19302" }, { urls: "stun:stun1.l.google.com:19302" }],
// // // // //   }

// // // // //   // Track window focus for read receipts
// // // // //   useEffect(() => {
// // // // //     const handleFocus = () => setIsWindowFocused(true)
// // // // //     const handleBlur = () => setIsWindowFocused(false)

// // // // //     window.addEventListener("focus", handleFocus)
// // // // //     window.addEventListener("blur", handleBlur)

// // // // //     return () => {
// // // // //       window.removeEventListener("focus", handleFocus)
// // // // //       window.removeEventListener("blur", handleBlur)
// // // // //     }
// // // // //   }, [])

// // // // //   const roomId = currentUser && toUser
// // // // //     ? [currentUser._id, toUser._id].sort().join("_")
// // // // //     : null
// // // // //   // Mark messages as read when window is focused and user is in chat
// // // // //   useEffect(() => {
// // // // //     if (
// // // // //       isWindowFocused &&
// // // // //       messages.length &&
// // // // //       currentUser?._id &&
// // // // //       toUser?._id &&
// // // // //       roomId
// // // // //     ) {
// // // // //       messages.forEach((msg) => {
// // // // //         if (
// // // // //           msg.type === "received" &&
// // // // //           !msg.isRead &&
// // // // //           msg._id &&
// // // // //           msg.fromUserId === toUser._id && // ✅ Sirf open user ke messages
// // // // //           !unreadMessagesRef.current.has(msg._id)
// // // // //         ) {
// // // // //           unreadMessagesRef.current.add(msg._id)
// // // // //           socket.emit("read_message", {
// // // // //             messageId: msg._id,
// // // // //             fromUserId: msg.fromUserId,
// // // // //             toUserId: currentUser._id,
// // // // //           })
// // // // //         }
// // // // //       })
// // // // //     }
// // // // //   }, [isWindowFocused, messages, currentUser, toUser, roomId])

// // // // //   // useEffect(() => {
// // // // //   //   if (isWindowFocused && messages.length > 0) {
// // // // //   //     const unreadReceivedMessages = messages.filter((msg) => msg.type === "received" && !msg.isRead && msg._id)

// // // // //   //     unreadReceivedMessages.forEach((msg) => {
// // // // //   //       if (!unreadMessagesRef.current.has(msg._id)) {
// // // // //   //         unreadMessagesRef.current.add(msg._id)
// // // // //   //         socket.emit("read_message", {
// // // // //   //           messageId: msg._id,
// // // // //   //           fromUserId: msg.fromUserId,
// // // // //   //           toUserId: currentUser?._id,
// // // // //   //         })
// // // // //   //       }
// // // // //   //     })
// // // // //   //   }
// // // // //   // }, [isWindowFocused, messages, currentUser])

// // // // //   // Initial data fetch
// // // // //   useEffect(() => {
// // // // //     const fetchInitialData = async () => {
// // // // //       const token = localStorage.getItem("token")
// // // // //       if (!token) {
// // // // //         setError("No authentication token found")
// // // // //         setLoading(false)
// // // // //         return
// // // // //       }

// // // // //       try {
// // // // //         setLoading(true)
// // // // //         setError(null)

// // // // //         const res = await axios.get("https://chat-be-v2eh.onrender.com/api/user/users", {
// // // // //           headers: { Authorization: `Bearer ${token}` },
// // // // //         })

// // // // //         const responseData = res.data

// // // // //         if (!responseData.success) {
// // // // //           throw new Error("Failed to fetch users")
// // // // //         }

// // // // //         const receiver = responseData.users?.find((u) => u._id === id)
// // // // //         const userData = responseData.currentUser

// // // // //         setCurrentUser(userData)
// // // // //         setToUser(receiver)

// // // // //         if (!receiver) {
// // // // //           setError("User not found")
// // // // //           setLoading(false)
// // // // //           return
// // // // //         }

// // // // //         if (userData && receiver) {
// // // // //           const messageRes = await axios.get(`https://chat-be-v2eh.onrender.com/api/chat/message/${id}`, {
// // // // //             headers: { Authorization: `Bearer ${token}` },
// // // // //           })

// // // // //           const formattedMessages = messageRes.data.map((msg) => ({
// // // // //             ...msg,
// // // // //             type: msg.fromUserId === userData._id ? "sent" : "received",
// // // // //           }))

// // // // //           setMessages(formattedMessages)

// // // // //           if (isWindowFocused) {
// // // // //             const unreadReceived = formattedMessages.filter((msg) => msg.type === "received" && !msg.isRead && msg._id)

// // // // //             unreadReceived.forEach((msg) => {
// // // // //               socket.emit("read_message", {
// // // // //                 messageId: msg._id,
// // // // //                 fromUserId: msg.fromUserId,
// // // // //                 toUserId: userData._id,
// // // // //               })
// // // // //             })
// // // // //           }
// // // // //         }
// // // // //       } catch (error) {
// // // // //         console.error("Error fetching users/messages:", error)
// // // // //         setError(error.response?.data?.message || "Failed to load chat data")

// // // // //         if (error.response?.status === 401) {
// // // // //           localStorage.removeItem("token")
// // // // //           window.location.href = "/login"
// // // // //         }
// // // // //       }
// // // // //       finally {
// // // // //         setLoading(false)
// // // // //       }
// // // // //     }

// // // // //     fetchInitialData()

// // // // //     return () => {
// // // // //       if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
// // // // //       if (callTimerRef.current) clearInterval(callTimerRef.current)
// // // // //     }
// // // // //   }, [id, isWindowFocused])

// // // // //   // WebRTC Functions
// // // // //   const createPeerConnection = useCallback(() => {
// // // // //     const peerConnection = new RTCPeerConnection(rtcConfiguration)

// // // // //     peerConnection.onicecandidate = (event) => {
// // // // //       if (event.candidate) {
// // // // //         socket.emit("ice_candidate", {
// // // // //           toUserId: toUser._id,
// // // // //           candidate: event.candidate,
// // // // //         })
// // // // //       }
// // // // //     }

// // // // //     peerConnection.ontrack = (event) => {
// // // // //       if (remoteVideoRef.current) {
// // // // //         remoteVideoRef.current.srcObject = event.streams[0]
// // // // //       }
// // // // //     }

// // // // //     peerConnection.onconnectionstatechange = () => {
// // // // //       if (peerConnection.connectionState === "connected") {
// // // // //         setIsCallConnected(true)
// // // // //         startCallTimer()
// // // // //       } else if (peerConnection.connectionState === "disconnected" || peerConnection.connectionState === "failed") {
// // // // //         endCall()
// // // // //       }
// // // // //     }

// // // // //     return peerConnection
// // // // //   }, [toUser])

// // // // //   const startCallTimer = () => {
// // // // //     setCallDuration(0)
// // // // //     callTimerRef.current = setInterval(() => {
// // // // //       setCallDuration((prev) => prev + 1)
// // // // //     }, 1000)
// // // // //   }

// // // // //   const formatCallDuration = (seconds) => {
// // // // //     const mins = Math.floor(seconds / 60)
// // // // //     const secs = seconds % 60
// // // // //     return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
// // // // //   }

// // // // //   const getUserMedia = async (video = false) => {
// // // // //     try {
// // // // //       const stream = await navigator.mediaDevices.getUserMedia({
// // // // //         video: video,
// // // // //         audio: true,
// // // // //       })
// // // // //       localStreamRef.current = stream
// // // // //       if (localVideoRef.current && video) {
// // // // //         localVideoRef.current.srcObject = stream
// // // // //       }
// // // // //       return stream
// // // // //     } catch (error) {
// // // // //       console.error("Error accessing media devices:", error)
// // // // //       throw error
// // // // //     }
// // // // //   }

// // // // //   const initiateCall = async (isVideo = false) => {
// // // // //     try {
// // // // //       setIsVideoCall(isVideo)
// // // // //       setIsInCall(true)

// // // // //       const stream = await getUserMedia(isVideo)
// // // // //       const peerConnection = createPeerConnection()
// // // // //       peerConnectionRef.current = peerConnection

// // // // //       stream.getTracks().forEach((track) => {
// // // // //         peerConnection.addTrack(track, stream)
// // // // //       })

// // // // //       const offer = await peerConnection.createOffer()
// // // // //       await peerConnection.setLocalDescription(offer)

// // // // //       socket.emit("call_offer", {
// // // // //         toUserId: toUser._id,
// // // // //         offer: offer,
// // // // //         isVideo: isVideo,
// // // // //       })
// // // // //     } catch (error) {
// // // // //       console.error("Error initiating call:", error)
// // // // //       endCall()
// // // // //     }
// // // // //   }

// // // // //   const acceptCall = async () => {
// // // // //     try {
// // // // //       setIsInCall(true)
// // // // //       setIsCallIncoming(false)

// // // // //       const stream = await getUserMedia(incomingCallType === "video")
// // // // //       const peerConnection = createPeerConnection()
// // // // //       peerConnectionRef.current = peerConnection

// // // // //       stream.getTracks().forEach((track) => {
// // // // //         peerConnection.addTrack(track, stream)
// // // // //       })

// // // // //       socket.emit("call_accepted", {
// // // // //         toUserId: toUser._id,
// // // // //       })
// // // // //     } catch (error) {
// // // // //       console.error("Error accepting call:", error)
// // // // //       rejectCall()
// // // // //     }
// // // // //   }

// // // // //   const rejectCall = () => {
// // // // //     setIsCallIncoming(false)
// // // // //     setIncomingCallType(null)
// // // // //     socket.emit("call_rejected", {
// // // // //       toUserId: toUser._id,
// // // // //     })
// // // // //   }

// // // // //   const endCall = () => {
// // // // //     if (localStreamRef.current) {
// // // // //       localStreamRef.current.getTracks().forEach((track) => track.stop())
// // // // //       localStreamRef.current = null
// // // // //     }

// // // // //     if (peerConnectionRef.current) {
// // // // //       peerConnectionRef.current.close()
// // // // //       peerConnectionRef.current = null
// // // // //     }

// // // // //     if (localVideoRef.current) localVideoRef.current.srcObject = null
// // // // //     if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null

// // // // //     if (callTimerRef.current) {
// // // // //       clearInterval(callTimerRef.current)
// // // // //       callTimerRef.current = null
// // // // //     }

// // // // //     setIsInCall(false)
// // // // //     setIsVideoCall(false)
// // // // //     setIsCallConnected(false)
// // // // //     setIsCallIncoming(false)
// // // // //     setIncomingCallType(null)
// // // // //     setCallDuration(0)
// // // // //     setIsMuted(false)
// // // // //     setIsVideoEnabled(true)

// // // // //     if (toUser) {
// // // // //       socket.emit("call_ended", {
// // // // //         toUserId: toUser._id,
// // // // //       })
// // // // //     }
// // // // //   }

// // // // //   const toggleMute = () => {
// // // // //     if (localStreamRef.current) {
// // // // //       const audioTrack = localStreamRef.current.getAudioTracks()[0]
// // // // //       if (audioTrack) {
// // // // //         audioTrack.enabled = !audioTrack.enabled
// // // // //         setIsMuted(!audioTrack.enabled)
// // // // //       }
// // // // //     }
// // // // //   }

// // // // //   const toggleVideo = () => {
// // // // //     if (localStreamRef.current) {
// // // // //       const videoTrack = localStreamRef.current.getVideoTracks()[0]
// // // // //       if (videoTrack) {
// // // // //         videoTrack.enabled = !videoTrack.enabled
// // // // //         setIsVideoEnabled(videoTrack.enabled)
// // // // //       }
// // // // //     }
// // // // //   }

// // // // //   // Handle received messages
// // // // //   const handleReceiveMessage = useCallback(
// // // // //     (data) => {
// // // // //       if (!currentUser) return

// // // // //       const type = data.fromUserId === currentUser._id ? "sent" : "received"

// // // // //       setMessages((prev) => {
// // // // //         const existingIndex = prev.findIndex(
// // // // //           (msg) =>
// // // // //             msg.fromUserId === currentUser._id &&
// // // // //             typeof msg._id === "string" &&
// // // // //             msg._id.length < 24 &&
// // // // //             msg.message === data.message,
// // // // //         )

// // // // //         if (existingIndex >= 0) {
// // // // //           const newMessages = [...prev]
// // // // //           newMessages[existingIndex] = { ...data, type }
// // // // //           return newMessages
// // // // //         }

// // // // //         if (prev.some((msg) => msg._id === data._id)) return prev

// // // // //         return [...prev, { ...data, type }]
// // // // //       })

// // // // //       if (type === "received" && isWindowFocused) {
// // // // //         setTimeout(() => {
// // // // //           socket.emit("read_message", {
// // // // //             messageId: data._id,
// // // // //             fromUserId: data.fromUserId,
// // // // //             toUserId: currentUser._id,
// // // // //           })
// // // // //         }, 100)
// // // // //       }
// // // // //     },
// // // // //     [currentUser, isWindowFocused],
// // // // //   )

// // // // //   const handleMessageSent = useCallback(
// // // // //     (data) => {
// // // // //       setMessages((prev) =>
// // // // //         prev.map((msg) =>
// // // // //           msg.fromUserId === currentUser?._id && typeof msg._id === "string" && msg._id.length < 24
// // // // //             ? { ...data, type: "sent" }
// // // // //             : msg,
// // // // //         ),
// // // // //       )
// // // // //     },
// // // // //     [currentUser],
// // // // //   )

// // // // //   const handleReadStatus = useCallback((data) => {
// // // // //     const { messageId, isRead, readBy } = data

// // // // //     setMessages((prev) =>
// // // // //       prev.map((msg) => {
// // // // //         if (msg._id === messageId) {
// // // // //           if (isRead) {
// // // // //             unreadMessagesRef.current.delete(messageId)
// // // // //           }
// // // // //           return { ...msg, isRead, readBy }
// // // // //         }
// // // // //         return msg
// // // // //       }),
// // // // //     )
// // // // //   }, [])

// // // // //   const handleDeliveryStatus = useCallback((data) => {
// // // // //     const { messageId, isDelivered } = data
// // // // //     setMessages((prev) => prev.map((msg) => (msg._id === messageId ? { ...msg, isDelivered } : msg)))
// // // // //   }, [])

// // // // //   const handleTyping = useCallback(
// // // // //     ({ fromUserId }) => {
// // // // //       if (fromUserId === id) {
// // // // //         setIsTyping(true)
// // // // //         if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
// // // // //         typingTimeoutRef.current = setTimeout(() => setIsTyping(false), 2000)
// // // // //       }
// // // // //     },
// // // // //     [id],
// // // // //   )

// // // // //   // Call event handlers
// // // // //   const handleIncomingCall = useCallback(
// // // // //     ({ fromUserId, isVideo }) => {
// // // // //       if (fromUserId === toUser?._id) {
// // // // //         setIsCallIncoming(true)
// // // // //         setIncomingCallType(isVideo ? "video" : "voice")
// // // // //         setIsVideoCall(isVideo)
// // // // //       }
// // // // //     },
// // // // //     [toUser],
// // // // //   )

// // // // //   const handleCallAccepted = useCallback(
// // // // //     async ({ fromUserId }) => {
// // // // //       if (fromUserId === toUser?._id && peerConnectionRef.current) {
// // // // //         // Call was accepted, wait for answer
// // // // //       }
// // // // //     },
// // // // //     [toUser],
// // // // //   )

// // // // //   const handleCallRejected = useCallback(
// // // // //     ({ fromUserId }) => {
// // // // //       if (fromUserId === toUser?._id) {
// // // // //         endCall()
// // // // //       }
// // // // //     },
// // // // //     [toUser],
// // // // //   )

// // // // //   const handleCallEnded = useCallback(
// // // // //     ({ fromUserId }) => {
// // // // //       if (fromUserId === toUser?._id) {
// // // // //         endCall()
// // // // //       }
// // // // //     },
// // // // //     [toUser],
// // // // //   )

// // // // //   const handleCallOffer = useCallback(
// // // // //     async ({ fromUserId, offer, isVideo }) => {
// // // // //       if (fromUserId === toUser?._id) {
// // // // //         setIsCallIncoming(true)
// // // // //         setIncomingCallType(isVideo ? "video" : "voice")
// // // // //         setIsVideoCall(isVideo)

// // // // //         const peerConnection = createPeerConnection()
// // // // //         peerConnectionRef.current = peerConnection
// // // // //         await peerConnection.setRemoteDescription(offer)
// // // // //       }
// // // // //     },
// // // // //     [toUser, createPeerConnection],
// // // // //   )

// // // // //   const handleCallAnswer = useCallback(
// // // // //     async ({ fromUserId, answer }) => {
// // // // //       if (fromUserId === toUser?._id && peerConnectionRef.current) {
// // // // //         await peerConnectionRef.current.setRemoteDescription(answer)
// // // // //       }
// // // // //     },
// // // // //     [toUser],
// // // // //   )

// // // // //   const handleIceCandidate = useCallback(
// // // // //     async ({ fromUserId, candidate }) => {
// // // // //       if (fromUserId === toUser?._id && peerConnectionRef.current) {
// // // // //         await peerConnectionRef.current.addIceCandidate(candidate)
// // // // //       }
// // // // //     },
// // // // //     [toUser],
// // // // //   )

// // // // //   const checkUserOnline = useCallback(() => {
// // // // //     if (toUser?._id) {
// // // // //       socket.emit("check_user_online", { toUserId: toUser._id }, ({ isOnline }) => {
// // // // //         setIsUserOnline(isOnline)
// // // // //       })
// // // // //     }
// // // // //   }, [toUser])

// // // // //   // Setup socket listeners
// // // // //   useEffect(() => {
// // // // //     socket.on("receive_message", handleReceiveMessage)
// // // // //     socket.on("message_sent", handleMessageSent)
// // // // //     socket.on("message_read_status", handleReadStatus)
// // // // //     socket.on("message_delivered_status", handleDeliveryStatus)
// // // // //     socket.on("user_typing", handleTyping)

// // // // //     // Call event listeners
// // // // //     socket.on("incoming_call", handleIncomingCall)
// // // // //     socket.on("call_accepted", handleCallAccepted)
// // // // //     socket.on("call_rejected", handleCallRejected)
// // // // //     socket.on("call_ended", handleCallEnded)
// // // // //     socket.on("call_offer", handleCallOffer)
// // // // //     socket.on("call_answer", handleCallAnswer)
// // // // //     socket.on("ice_candidate", handleIceCandidate)

// // // // //     if (currentUser?._id && toUser?._id) {
// // // // //       const roomId = [currentUser._id, toUser._id].sort().join("_")
// // // // //       socket.emit("join_room", { roomId })
// // // // //     }

// // // // //     checkUserOnline()
// // // // //     const interval = setInterval(checkUserOnline, 30000)

// // // // //     return () => {
// // // // //       socket.off("receive_message", handleReceiveMessage)
// // // // //       socket.off("message_sent", handleMessageSent)
// // // // //       socket.off("message_read_status", handleReadStatus)
// // // // //       socket.off("message_delivered_status", handleDeliveryStatus)
// // // // //       socket.off("user_typing", handleTyping)
// // // // //       socket.off("incoming_call", handleIncomingCall)
// // // // //       socket.off("call_accepted", handleCallAccepted)
// // // // //       socket.off("call_rejected", handleCallRejected)
// // // // //       socket.off("call_ended", handleCallEnded)
// // // // //       socket.off("call_offer", handleCallOffer)
// // // // //       socket.off("call_answer", handleCallAnswer)
// // // // //       socket.off("ice_candidate", handleIceCandidate)
// // // // //       clearInterval(interval)
// // // // //       if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
// // // // //     }
// // // // //   }, [
// // // // //     handleReceiveMessage,
// // // // //     handleMessageSent,
// // // // //     handleReadStatus,
// // // // //     handleDeliveryStatus,
// // // // //     handleTyping,
// // // // //     handleIncomingCall,
// // // // //     handleCallAccepted,
// // // // //     handleCallRejected,
// // // // //     handleCallEnded,
// // // // //     handleCallOffer,
// // // // //     handleCallAnswer,
// // // // //     handleIceCandidate,
// // // // //     checkUserOnline,
// // // // //     currentUser,
// // // // //     toUser,
// // // // //   ])

// // // // //   const handleSend = () => {
// // // // //     if (!input.trim() || !toUser?._id || !currentUser?._id) return

// // // // //     const tempId = Math.random().toString(36).substring(7)
// // // // //     const messageData = {
// // // // //       toUserId: toUser._id,
// // // // //       message: input,
// // // // //       timestamp: new Date(),
// // // // //     }

// // // // //     setMessages((prev) => [
// // // // //       ...prev,
// // // // //       {
// // // // //         _id: tempId,
// // // // //         message: input,
// // // // //         fromUserId: currentUser._id,
// // // // //         toUserId: toUser._id,
// // // // //         type: "sent",
// // // // //         isDelivered: isUserOnline,
// // // // //         isRead: false,
// // // // //         timestamp: new Date(),
// // // // //       },
// // // // //     ])

// // // // //     setInput("")
// // // // //     socket.emit("send_message", messageData)
// // // // //   }

// // // // //   const handleTypingInput = (e) => {
// // // // //     setInput(e.target.value)
// // // // //     if (toUser?._id) {
// // // // //       socket.emit("typing", { toUserId: toUser._id })
// // // // //     }
// // // // //   }

// // // // //   useEffect(() => {
// // // // //     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
// // // // //   }, [messages])

// // // // //   useEffect(() => {
// // // // //     if (isTyping) {
// // // // //       const timeout = setTimeout(() => {
// // // // //         setIsTyping(false)
// // // // //       }, 5000)
// // // // //       return () => clearTimeout(timeout)
// // // // //     }
// // // // //   }, [messages])

// // // // //   const handleKeyPress = (e) => {
// // // // //     if (e.key === "Enter") {
// // // // //       handleSend()
// // // // //     }
// // // // //   }

// // // // //   const getMessageStatus = (msg) => {
// // // // //     if (msg.type !== "sent") return null

// // // // //     if (msg.isRead) {
// // // // //       return (
// // // // //         <span className="text-white-400" title="Read">
// // // // //           ✓✓
// // // // //         </span>
// // // // //       )
// // // // //     } else if (msg.isDelivered) {
// // // // //       return (
// // // // //         <span className="text-gray-300" title="Delivered">
// // // // //           ✓✓
// // // // //         </span>
// // // // //       )
// // // // //     } else {
// // // // //       return (
// // // // //         <span className="text-gray-400" title="Sent">
// // // // //           ✓
// // // // //         </span>
// // // // //       )
// // // // //     }
// // // // //   }

// // // // //   // if (loading) {
// // // // //   //   return (
// // // // //   //     <div className="flex flex-col h-full w-full p-6 items-center justify-center">
// // // // //   //       <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
// // // // //   //       <p className="text-gray-600">Loading chat...</p>
// // // // //   //     </div>
// // // // //   //   )
// // // // //   // }

// // // // //   if (error) {
// // // // //     return (
// // // // //       <div className="flex flex-col h-full w-full p-6 items-center justify-center">
// // // // //         <div className="text-center">
// // // // //           <p className="text-red-600 mb-4">{error}</p>
// // // // //           <button
// // // // //             onClick={() => window.location.reload()}
// // // // //             className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
// // // // //           >
// // // // //             Retry
// // // // //           </button>
// // // // //         </div>
// // // // //       </div>
// // // // //     )
// // // // //   }

// // // // //   return (
// // // // //     <div className="flex flex-col h-full w-full p-6 relative">
// // // // //       {/* Incoming Call Modal */}
// // // // //       {isCallIncoming && (
// // // // //         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
// // // // //           <div className="bg-white p-6 rounded-lg shadow-lg text-center">
// // // // //             <h3 className="text-lg font-semibold mb-4">
// // // // //               Incoming {incomingCallType} call from {toUser?.name}
// // // // //             </h3>
// // // // //             <div className="flex gap-4 justify-center">
// // // // //               <button
// // // // //                 onClick={acceptCall}
// // // // //                 className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 flex items-center gap-2"
// // // // //               >
// // // // //                 {incomingCallType === "video" ? <Video size={20} /> : <Phone size={20} />}
// // // // //                 Accept
// // // // //               </button>
// // // // //               <button
// // // // //                 onClick={rejectCall}
// // // // //                 className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 flex items-center gap-2"
// // // // //               >
// // // // //                 <PhoneOff size={20} />
// // // // //                 Decline
// // // // //               </button>
// // // // //             </div>
// // // // //           </div>
// // // // //         </div>
// // // // //       )}

// // // // //       {/* Call Interface */}
// // // // //       {isInCall && (
// // // // //         <div className="fixed inset-0 bg-black z-40 flex flex-col">
// // // // //           <div className="flex-1 relative">
// // // // //             {/* Remote Video */}
// // // // //             <video
// // // // //               ref={remoteVideoRef}
// // // // //               autoPlay
// // // // //               playsInline
// // // // //               className="w-full h-full object-cover"
// // // // //               style={{ display: isVideoCall ? "block" : "none" }}
// // // // //             />

// // // // //             {/* Local Video */}
// // // // //             {isVideoCall && (
// // // // //               <video
// // // // //                 ref={localVideoRef}
// // // // //                 autoPlay
// // // // //                 playsInline
// // // // //                 muted
// // // // //                 className="absolute top-4 right-4 w-48 h-36 object-cover rounded-lg border-2 border-white"
// // // // //               />
// // // // //             )}

// // // // //             {/* Call Info */}
// // // // //             <div className="absolute top-4 left-4 text-white">
// // // // //               <h3 className="text-lg font-semibold">{toUser?.name}</h3>
// // // // //               <p className="text-sm opacity-75">
// // // // //                 {isCallConnected ? formatCallDuration(callDuration) : "Connecting..."}
// // // // //               </p>
// // // // //             </div>

// // // // //             {/* Call Controls */}
// // // // //             <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-4">
// // // // //               <button
// // // // //                 onClick={toggleMute}
// // // // //                 className={`p-4 rounded-full ${isMuted ? "bg-red-500" : "bg-gray-600"} text-white hover:opacity-80`}
// // // // //               >
// // // // //                 {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
// // // // //               </button>

// // // // //               {isVideoCall && (
// // // // //                 <button
// // // // //                   onClick={toggleVideo}
// // // // //                   className={`p-4 rounded-full ${!isVideoEnabled ? "bg-red-500" : "bg-gray-600"} text-white hover:opacity-80`}
// // // // //                 >
// // // // //                   {isVideoEnabled ? <Video size={24} /> : <VideoOff size={24} />}
// // // // //                 </button>
// // // // //               )}

// // // // //               <button onClick={endCall} className="p-4 rounded-full bg-red-500 text-white hover:bg-red-600">
// // // // //                 <PhoneOff size={24} />
// // // // //               </button>
// // // // //             </div>
// // // // //           </div>
// // // // //         </div>
// // // // //       )}

// // // // //       {/* Chat Header */}
// // // // //       <div className="mb-4 flex justify-between items-center">
// // // // //         <div className="flex items-center gap-3">
// // // // //           <img
// // // // //             src={toUser?.profilePic || "/placeholder.svg?height=40&width=40"}
// // // // //             alt={toUser?.name}
// // // // //             className="w-10 h-10 rounded-full object-cover"
// // // // //           />
// // // // //           <div>
// // // // //             <h1 className="text-xl font-bold">{toUser?.name || "..."}</h1>
// // // // //             <p className="text-sm text-gray-500">{isTyping ? "Typing..." : isUserOnline ? "Online" : "Offline"}</p>
// // // // //           </div>
// // // // //         </div>

// // // // //         {/* Call Buttons */}
// // // // //         <div className="flex gap-2">
// // // // //           <button
// // // // //             onClick={() => initiateCall(false)}
// // // // //             className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center gap-2"
// // // // //             title="Voice Call"
// // // // //           >
// // // // //             <Phone size={20} />
// // // // //           </button>
// // // // //           <button
// // // // //             onClick={() => initiateCall(true)}
// // // // //             className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
// // // // //             title="Video Call"
// // // // //           >
// // // // //             <Video size={20} />
// // // // //           </button>
// // // // //         </div>
// // // // //       </div>

// // // // //       {/* Messages */}
// // // // //       <div className="flex-1 overflow-y-auto mb-4 border rounded p-4 bg-white">
// // // // //         {messages.map((msg) => (
// // // // //           <div
// // // // //             key={msg._id}
// // // // //             className={`mb-2 max-w-xs px-4 py-2 rounded ${msg.type === "sent" ? "bg-gray-500 text-white self-end ml-auto" : "bg-gray-200 text-black"
// // // // //               }`}
// // // // //           >
// // // // //             <div className="flex justify-between items-center gap-2">
// // // // //               <span>{msg.message}</span>
// // // // //               {msg.type === "sent" && <span className="text-xs ml-2 flex items-center">{getMessageStatus(msg)}</span>}
// // // // //             </div>
// // // // //             <div className="text-xs mt-1 opacity-70">
// // // // //               {new Date(msg.timestamp).toLocaleTimeString([], {
// // // // //                 hour: "2-digit",
// // // // //                 minute: "2-digit",
// // // // //               })}
// // // // //             </div>
// // // // //           </div>
// // // // //         ))}
// // // // //         <div ref={messagesEndRef} />
// // // // //       </div>

// // // // //       {/* Message Input */}
// // // // //       <div className="flex gap-2">
// // // // //         <input
// // // // //           type="text"
// // // // //           placeholder="Type your message"
// // // // //           value={input}
// // // // //           onChange={handleTypingInput}
// // // // //           onKeyPress={handleKeyPress}
// // // // //           className="flex-1 border px-4 py-2 rounded focus:outline-none"
// // // // //           disabled={isInCall}
// // // // //         />
// // // // //         <button
// // // // //           onClick={handleSend}
// // // // //           disabled={!input.trim() || isInCall}
// // // // //           className={`px-4 py-2 rounded ${input.trim() && !isInCall
// // // // //             ? "bg-blue-600 text-white hover:bg-blue-700"
// // // // //             : "bg-gray-300 text-gray-500 cursor-not-allowed"
// // // // //             }`}
// // // // //         >
// // // // //           Send
// // // // //         </button>
// // // // //       </div>
// // // // //     </div>
// // // // //   )
// // // // // }

// // // // // export default Chat



// // // // "use client"

// // // // import { useEffect, useState, useRef, useCallback } from "react"
// // // // import { useParams } from "react-router-dom"
// // // // import axios from "axios"
// // // // import socket from "../../socket"
// // // // import VideoCallModal from "./Videomodel"
// // // // import VoiceModal from "./Voice-model"
// // // // import { Phone, Video, Mic } from "lucide-react"

// // // // function Chat({ currentUser: propCurrentUser }) {
// // // //   const { id } = useParams()
// // // //   const [messages, setMessages] = useState([])
// // // //   const [input, setInput] = useState("")
// // // //   const [currentUser, setCurrentUser] = useState(propCurrentUser)
// // // //   const [toUser, setToUser] = useState(null)
// // // //   const [isUserOnline, setIsUserOnline] = useState(false)
// // // //   const [isTyping, setIsTyping] = useState(false)
// // // //   const [isWindowFocused, setIsWindowFocused] = useState(true)
// // // //   const [loading, setLoading] = useState(true)
// // // //   const [error, setError] = useState(null)

// // // //   // Enhanced call-related states
// // // //   const [callState, setCallState] = useState({
// // // //     isInCall: false,
// // // //     isInitiating: false,
// // // //     isReceiving: false,
// // // //     callType: null, // "audio" | "video" | null
// // // //     remoteUserId: null,
// // // //   })
// // // //   const [isCallConnected, setIsCallConnected] = useState(false)
// // // //   const [isMuted, setIsMuted] = useState(false)
// // // //   const [isVideoEnabled, setIsVideoEnabled] = useState(true)
// // // //   const [callDuration, setCallDuration] = useState(0)

// // // //   // Voice modal states
// // // //   const [showVoiceModal, setShowVoiceModal] = useState(false)
// // // //   const [isListening, setIsListening] = useState(false)
// // // //   const [transcript, setTranscript] = useState("")
// // // //   const [recognition, setRecognition] = useState(null)

// // // //   // Refs
// // // //   const typingTimeoutRef = useRef(null)
// // // //   const messagesEndRef = useRef(null)
// // // //   const unreadMessagesRef = useRef(new Set())
// // // //   const localVideoRef = useRef(null)
// // // //   const remoteVideoRef = useRef(null)
// // // //   const peerConnectionRef = useRef(null)
// // // //   const localStreamRef = useRef(null)
// // // //   const callTimerRef = useRef(null)

// // // //   // WebRTC configuration
// // // //   const rtcConfiguration = {
// // // //     iceServers: [{ urls: "stun:stun.l.google.com:19302" }, { urls: "stun:stun1.l.google.com:19302" }],
// // // //   }

// // // //   // Track window focus for read receipts
// // // //   useEffect(() => {
// // // //     const handleFocus = () => setIsWindowFocused(true)
// // // //     const handleBlur = () => setIsWindowFocused(false)

// // // //     window.addEventListener("focus", handleFocus)
// // // //     window.addEventListener("blur", handleBlur)

// // // //     return () => {
// // // //       window.removeEventListener("focus", handleFocus)
// // // //       window.removeEventListener("blur", handleBlur)
// // // //     }
// // // //   }, [])

// // // //   const roomId = currentUser && toUser ? [currentUser._id, toUser._id].sort().join("_") : null

// // // //   // Mark messages as read when window is focused and user is in chat
// // // //   useEffect(() => {
// // // //     if (isWindowFocused && messages.length && currentUser?._id && toUser?._id && roomId) {
// // // //       messages.forEach((msg) => {
// // // //         if (
// // // //           msg.type === "received" &&
// // // //           !msg.isRead &&
// // // //           msg._id &&
// // // //           msg.fromUserId === toUser._id &&
// // // //           !unreadMessagesRef.current.has(msg._id)
// // // //         ) {
// // // //           unreadMessagesRef.current.add(msg._id)
// // // //           socket.emit("read_message", {
// // // //             messageId: msg._id,
// // // //             fromUserId: msg.fromUserId,
// // // //             toUserId: currentUser._id,
// // // //           })
// // // //         }
// // // //       })
// // // //     }
// // // //   }, [isWindowFocused, messages, currentUser, toUser, roomId])

// // // //   // Initialize speech recognition
// // // //   useEffect(() => {
// // // //     if (typeof window !== "undefined" && ("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
// // // //       const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
// // // //       const recognitionInstance = new SpeechRecognition()

// // // //       recognitionInstance.continuous = true
// // // //       recognitionInstance.interimResults = true
// // // //       recognitionInstance.lang = "en-US"

// // // //       recognitionInstance.onresult = (event) => {
// // // //         let finalTranscript = ""
// // // //         let interimTranscript = ""

// // // //         for (let i = event.resultIndex; i < event.results.length; i++) {
// // // //           const transcript = event.results[i][0].transcript
// // // //           if (event.results[i].isFinal) {
// // // //             finalTranscript += transcript
// // // //           } else {
// // // //             interimTranscript += transcript
// // // //           }
// // // //         }

// // // //         setTranscript(finalTranscript + interimTranscript)
// // // //       }

// // // //       recognitionInstance.onend = () => {
// // // //         setIsListening(false)
// // // //       }

// // // //       recognitionInstance.onerror = (event) => {
// // // //         console.error("Speech recognition error:", event.error)
// // // //         setIsListening(false)
// // // //         if (event.error === "not-allowed") {
// // // //           alert("Microphone access was denied. Please allow microphone access in your browser settings.")
// // // //         }
// // // //       }

// // // //       setRecognition(recognitionInstance)
// // // //     }
// // // //   }, [])

// // // //   // Initial data fetch
// // // //   useEffect(() => {
// // // //     const fetchInitialData = async () => {
// // // //       const token = localStorage.getItem("token")
// // // //       if (!token) {
// // // //         setError("No authentication token found")
// // // //         setLoading(false)
// // // //         return
// // // //       }

// // // //       try {
// // // //         setLoading(true)
// // // //         setError(null)

// // // //         const res = await axios.get("https://chat-be-v2eh.onrender.com/api/user/users", {
// // // //           headers: { Authorization: `Bearer ${token}` },
// // // //         })

// // // //         const responseData = res.data

// // // //         if (!responseData.success) {
// // // //           throw new Error("Failed to fetch users")
// // // //         }

// // // //         const receiver = responseData.users?.find((u) => u._id === id)
// // // //         const userData = responseData.currentUser

// // // //         setCurrentUser(userData)
// // // //         setToUser(receiver)

// // // //         if (!receiver) {
// // // //           setError("User not found")
// // // //           setLoading(false)
// // // //           return
// // // //         }

// // // //         if (userData && receiver) {
// // // //           const messageRes = await axios.get(`https://chat-be-v2eh.onrender.com/api/chat/message/${id}`, {
// // // //             headers: { Authorization: `Bearer ${token}` },
// // // //           })

// // // //           const formattedMessages = messageRes.data.map((msg) => ({
// // // //             ...msg,
// // // //             type: msg.fromUserId === userData._id ? "sent" : "received",
// // // //           }))

// // // //           setMessages(formattedMessages)

// // // //           if (isWindowFocused) {
// // // //             const unreadReceived = formattedMessages.filter((msg) => msg.type === "received" && !msg.isRead && msg._id)

// // // //             unreadReceived.forEach((msg) => {
// // // //               socket.emit("read_message", {
// // // //                 messageId: msg._id,
// // // //                 fromUserId: msg.fromUserId,
// // // //                 toUserId: userData._id,
// // // //               })
// // // //             })
// // // //           }
// // // //         }
// // // //       } catch (error) {
// // // //         console.error("Error fetching users/messages:", error)
// // // //         setError(error.response?.data?.message || "Failed to load chat data")

// // // //         if (error.response?.status === 401) {
// // // //           localStorage.removeItem("token")
// // // //           window.location.href = "/login"
// // // //         }
// // // //       } finally {
// // // //         setLoading(false)
// // // //       }
// // // //     }

// // // //     fetchInitialData()

// // // //     return () => {
// // // //       if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
// // // //       if (callTimerRef.current) clearInterval(callTimerRef.current)
// // // //     }
// // // //   }, [id, isWindowFocused])

// // // //   // WebRTC Functions
// // // //   const initializePeerConnection = useCallback(() => {
// // // //     const peerConnection = new RTCPeerConnection(rtcConfiguration)

// // // //     peerConnection.onicecandidate = (event) => {
// // // //       if (event.candidate && socket) {
// // // //         socket.emit("webrtc-ice-candidate", {
// // // //           to: callState.remoteUserId || toUser._id,
// // // //           candidate: event.candidate,
// // // //         })
// // // //       }
// // // //     }

// // // //     peerConnection.ontrack = (event) => {
// // // //       console.log("📺 Received remote stream")
// // // //       if (remoteVideoRef.current) {
// // // //         remoteVideoRef.current.srcObject = event.streams[0]
// // // //       }
// // // //     }

// // // //     peerConnection.onconnectionstatechange = () => {
// // // //       console.log("🔗 Connection state:", peerConnection.connectionState)
// // // //       if (peerConnection.connectionState === "connected") {
// // // //         setIsCallConnected(true)
// // // //         startCallTimer()
// // // //       } else if (peerConnection.connectionState === "disconnected" || peerConnection.connectionState === "failed") {
// // // //         endCall()
// // // //       }
// // // //     }

// // // //     return peerConnection
// // // //   }, [callState.remoteUserId, toUser])

// // // //   const startCallTimer = () => {
// // // //     setCallDuration(0)
// // // //     callTimerRef.current = setInterval(() => {
// // // //       setCallDuration((prev) => prev + 1)
// // // //     }, 1000)
// // // //   }

// // // //   const formatCallDuration = (seconds) => {
// // // //     const mins = Math.floor(seconds / 60)
// // // //     const secs = seconds % 60
// // // //     return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
// // // //   }

// // // //   const startCall = async (callType) => {
// // // //     try {
// // // //       console.log(`📞 Starting ${callType} call to:`, toUser._id)

// // // //       // Check available devices
// // // //       const devices = await navigator.mediaDevices.enumerateDevices()
// // // //       const hasAudio = devices.some((d) => d.kind === "audioinput")
// // // //       const hasVideo = devices.some((d) => d.kind === "videoinput")

// // // //       if (callType === "audio" && !hasAudio) {
// // // //         alert("No microphone found. Please connect a microphone and try again.")
// // // //         return
// // // //       }
// // // //       if (callType === "video" && !hasVideo) {
// // // //         alert("No camera found. Please connect a camera and try again.")
// // // //         return
// // // //       }

// // // //       setCallState({
// // // //         isInCall: false,
// // // //         isInitiating: true,
// // // //         isReceiving: false,
// // // //         callType,
// // // //         remoteUserId: toUser._id,
// // // //       })

// // // //       // Get user media
// // // //       const constraints = {
// // // //         audio: hasAudio,
// // // //         video: callType === "video" && hasVideo,
// // // //       }

// // // //       const stream = await navigator.mediaDevices.getUserMedia(constraints)
// // // //       localStreamRef.current = stream

// // // //       if (localVideoRef.current) {
// // // //         localVideoRef.current.srcObject = stream
// // // //       }

// // // //       // Initialize peer connection
// // // //       const peerConnection = initializePeerConnection()
// // // //       peerConnectionRef.current = peerConnection

// // // //       // Add local stream to peer connection
// // // //       stream.getTracks().forEach((track) => {
// // // //         peerConnection.addTrack(track, stream)
// // // //       })

// // // //       // Emit call initiation
// // // //       if (socket) {
// // // //         socket.emit("initiate-call", {
// // // //           to: toUser._id,
// // // //           from: currentUser._id,
// // // //           callType,
// // // //         })
// // // //       }
// // // //     } catch (error) {
// // // //       console.error("❌ Error starting call:", error)
// // // //       if (error.name === "NotFoundError") {
// // // //         alert("Required device not found. Please check your camera/microphone.")
// // // //       } else if (error.name === "NotAllowedError") {
// // // //         alert("Permission denied. Please allow access to your camera/microphone.")
// // // //       } else {
// // // //         alert(error.message || "Failed to start call. Please check your camera/microphone permissions.")
// // // //       }
// // // //       endCall()
// // // //     }
// // // //   }

// // // //   const acceptCall = async () => {
// // // //     try {
// // // //       console.log("✅ Accepting call")

// // // //       const constraints = {
// // // //         audio: true,
// // // //         video: callState.callType === "video",
// // // //       }

// // // //       const stream = await navigator.mediaDevices.getUserMedia(constraints)
// // // //       localStreamRef.current = stream

// // // //       if (localVideoRef.current) {
// // // //         localVideoRef.current.srcObject = stream
// // // //       }

// // // //       const peerConnection = initializePeerConnection()
// // // //       peerConnectionRef.current = peerConnection

// // // //       stream.getTracks().forEach((track) => {
// // // //         peerConnection.addTrack(track, stream)
// // // //       })

// // // //       setCallState((prev) => ({
// // // //         ...prev,
// // // //         isReceiving: false,
// // // //         isInCall: true,
// // // //       }))

// // // //       if (socket) {
// // // //         socket.emit("accept-call", {
// // // //           to: callState.remoteUserId,
// // // //           from: currentUser._id,
// // // //         })
// // // //       }
// // // //     } catch (error) {
// // // //       console.error("❌ Error accepting call:", error)
// // // //       alert("Failed to accept call. Please check your camera/microphone permissions.")
// // // //       rejectCall()
// // // //     }
// // // //   }

// // // //   const rejectCall = () => {
// // // //     console.log("❌ Rejecting call")
// // // //     if (socket) {
// // // //       socket.emit("reject-call", {
// // // //         to: callState.remoteUserId,
// // // //         from: currentUser._id,
// // // //       })
// // // //     }
// // // //     endCall()
// // // //   }

// // // //   const endCall = () => {
// // // //     console.log("📞 Ending call")

// // // //     // Stop local stream
// // // //     if (localStreamRef.current) {
// // // //       localStreamRef.current.getTracks().forEach((track) => track.stop())
// // // //       localStreamRef.current = null
// // // //     }

// // // //     // Close peer connection
// // // //     if (peerConnectionRef.current) {
// // // //       peerConnectionRef.current.close()
// // // //       peerConnectionRef.current = null
// // // //     }

// // // //     // Clear video elements
// // // //     if (localVideoRef.current) {
// // // //       localVideoRef.current.srcObject = null
// // // //     }
// // // //     if (remoteVideoRef.current) {
// // // //       remoteVideoRef.current.srcObject = null
// // // //     }

// // // //     // Stop call timer
// // // //     if (callTimerRef.current) {
// // // //       clearInterval(callTimerRef.current)
// // // //       callTimerRef.current = null
// // // //     }

// // // //     // Emit call end if we're in a call
// // // //     if ((callState.isInCall || callState.isInitiating) && socket) {
// // // //       socket.emit("end-call", {
// // // //         to: callState.remoteUserId || toUser._id,
// // // //         from: currentUser._id,
// // // //       })
// // // //     }

// // // //     // Reset call state
// // // //     setCallState({
// // // //       isInCall: false,
// // // //       isInitiating: false,
// // // //       isReceiving: false,
// // // //       callType: null,
// // // //       remoteUserId: null,
// // // //     })
// // // //     setIsCallConnected(false)
// // // //     setCallDuration(0)
// // // //     setIsMuted(false)
// // // //     setIsVideoEnabled(true)
// // // //   }

// // // //   const toggleMute = () => {
// // // //     if (localStreamRef.current) {
// // // //       const audioTrack = localStreamRef.current.getAudioTracks()[0]
// // // //       if (audioTrack) {
// // // //         audioTrack.enabled = !audioTrack.enabled
// // // //         setIsMuted(!audioTrack.enabled)
// // // //       }
// // // //     }
// // // //   }

// // // //   const toggleVideo = () => {
// // // //     if (localStreamRef.current) {
// // // //       const videoTrack = localStreamRef.current.getVideoTracks()[0]
// // // //       if (videoTrack) {
// // // //         videoTrack.enabled = !videoTrack.enabled
// // // //         setIsVideoEnabled(videoTrack.enabled)
// // // //       }
// // // //     }
// // // //   }

// // // //   const createOffer = async () => {
// // // //     if (!peerConnectionRef.current || !socket) return

// // // //     try {
// // // //       console.log("📡 Creating WebRTC offer")
// // // //       const offer = await peerConnectionRef.current.createOffer()
// // // //       await peerConnectionRef.current.setLocalDescription(offer)

// // // //       socket.emit("webrtc-offer", {
// // // //         to: callState.remoteUserId || toUser._id,
// // // //         offer,
// // // //       })
// // // //     } catch (error) {
// // // //       console.error("❌ Error creating offer:", error)
// // // //     }
// // // //   }

// // // //   const handleOffer = async (offer, from) => {
// // // //     if (!peerConnectionRef.current || !socket) return

// // // //     try {
// // // //       console.log("📡 Handling WebRTC offer from:", from)
// // // //       await peerConnectionRef.current.setRemoteDescription(offer)
// // // //       const answer = await peerConnectionRef.current.createAnswer()
// // // //       await peerConnectionRef.current.setLocalDescription(answer)

// // // //       socket.emit("webrtc-answer", {
// // // //         to: from,
// // // //         answer,
// // // //       })
// // // //     } catch (error) {
// // // //       console.error("❌ Error handling offer:", error)
// // // //     }
// // // //   }

// // // //   const handleAnswer = async (answer) => {
// // // //     if (!peerConnectionRef.current) return

// // // //     try {
// // // //       console.log("📡 Handling WebRTC answer")
// // // //       await peerConnectionRef.current.setRemoteDescription(answer)
// // // //     } catch (error) {
// // // //       console.error("❌ Error handling answer:", error)
// // // //     }
// // // //   }

// // // //   const handleIceCandidate = async (candidate) => {
// // // //     if (!peerConnectionRef.current) return

// // // //     try {
// // // //       console.log("🧊 Adding ICE candidate")
// // // //       await peerConnectionRef.current.addIceCandidate(candidate)
// // // //     } catch (error) {
// // // //       console.error("❌ Error handling ICE candidate:", error)
// // // //     }
// // // //   }

// // // //   // Voice recognition functions
// // // //   const startListening = () => {
// // // //     if (recognition) {
// // // //       setTranscript("")
// // // //       recognition.start()
// // // //       setIsListening(true)
// // // //     } else {
// // // //       alert("Speech recognition is not supported in your browser")
// // // //     }
// // // //   }

// // // //   const stopListening = () => {
// // // //     if (recognition) {
// // // //       recognition.stop()
// // // //       setIsListening(false)

// // // //       // Auto-send the message after a short delay to ensure transcript is complete
// // // //       setTimeout(() => {
// // // //         if (transcript.trim() && socket) {
// // // //           const messageData = {
// // // //             toUserId: toUser._id,
// // // //             message: transcript.trim(),
// // // //             timestamp: new Date(),
// // // //           }

// // // //           const tempId = Math.random().toString(36).substring(7)
// // // //           setMessages((prev) => [
// // // //             ...prev,
// // // //             {
// // // //               _id: tempId,
// // // //               message: transcript.trim(),
// // // //               fromUserId: currentUser._id,
// // // //               toUserId: toUser._id,
// // // //               type: "sent",
// // // //               isDelivered: isUserOnline,
// // // //               isRead: false,
// // // //               timestamp: new Date(),
// // // //             },
// // // //           ])

// // // //           socket.emit("send_message", messageData)
// // // //           setShowVoiceModal(false)
// // // //           setTranscript("")
// // // //         }
// // // //       }, 300)
// // // //     }
// // // //   }

// // // //   const handleVoiceModalOpen = () => {
// // // //     setShowVoiceModal(true)
// // // //     setTranscript("")
// // // //   }

// // // //   const handleVoiceModalClose = () => {
// // // //     setShowVoiceModal(false)
// // // //     stopListening()
// // // //     setTranscript("")
// // // //   }

// // // //   // Handle received messages
// // // //   const handleReceiveMessage = useCallback(
// // // //     (data) => {
// // // //       if (!currentUser) return

// // // //       const type = data.fromUserId === currentUser._id ? "sent" : "received"

// // // //       setMessages((prev) => {
// // // //         const existingIndex = prev.findIndex(
// // // //           (msg) =>
// // // //             msg.fromUserId === currentUser._id &&
// // // //             typeof msg._id === "string" &&
// // // //             msg._id.length < 24 &&
// // // //             msg.message === data.message,
// // // //         )

// // // //         if (existingIndex >= 0) {
// // // //           const newMessages = [...prev]
// // // //           newMessages[existingIndex] = { ...data, type }
// // // //           return newMessages
// // // //         }

// // // //         if (prev.some((msg) => msg._id === data._id)) return prev

// // // //         return [...prev, { ...data, type }]
// // // //       })

// // // //       if (type === "received" && isWindowFocused) {
// // // //         setTimeout(() => {
// // // //           socket.emit("read_message", {
// // // //             messageId: data._id,
// // // //             fromUserId: data.fromUserId,
// // // //             toUserId: currentUser._id,
// // // //           })
// // // //         }, 100)
// // // //       }
// // // //     },
// // // //     [currentUser, isWindowFocused],
// // // //   )

// // // //   const handleMessageSent = useCallback(
// // // //     (data) => {
// // // //       setMessages((prev) =>
// // // //         prev.map((msg) =>
// // // //           msg.fromUserId === currentUser?._id && typeof msg._id === "string" && msg._id.length < 24
// // // //             ? { ...data, type: "sent" }
// // // //             : msg,
// // // //         ),
// // // //       )
// // // //     },
// // // //     [currentUser],
// // // //   )

// // // //   const handleReadStatus = useCallback((data) => {
// // // //     const { messageId, isRead, readBy } = data

// // // //     setMessages((prev) =>
// // // //       prev.map((msg) => {
// // // //         if (msg._id === messageId) {
// // // //           if (isRead) {
// // // //             unreadMessagesRef.current.delete(messageId)
// // // //           }
// // // //           return { ...msg, isRead, readBy }
// // // //         }
// // // //         return msg
// // // //       }),
// // // //     )
// // // //   }, [])

// // // //   const handleDeliveryStatus = useCallback((data) => {
// // // //     const { messageId, isDelivered } = data
// // // //     setMessages((prev) => prev.map((msg) => (msg._id === messageId ? { ...msg, isDelivered } : msg)))
// // // //   }, [])

// // // //   const handleTyping = useCallback(
// // // //     ({ fromUserId }) => {
// // // //       if (fromUserId === id) {
// // // //         setIsTyping(true)
// // // //         if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
// // // //         typingTimeoutRef.current = setTimeout(() => setIsTyping(false), 2000)
// // // //       }
// // // //     },
// // // //     [id],
// // // //   )

// // // //   // Call event handlers
// // // //   const handleIncomingCall = useCallback(
// // // //     ({ from, callType }) => {
// // // //       if (from === toUser?._id) {
// // // //         console.log("📞 Incoming call from:", from, "Type:", callType)
// // // //         setCallState({
// // // //           isInCall: false,
// // // //           isInitiating: false,
// // // //           isReceiving: true,
// // // //           callType,
// // // //           remoteUserId: from,
// // // //         })
// // // //       }
// // // //     },
// // // //     [toUser],
// // // //   )

// // // //   const handleCallAccepted = useCallback(
// // // //     async ({ from }) => {
// // // //       if (from === toUser?._id) {
// // // //         console.log("✅ Call accepted by:", from)
// // // //         setCallState((prev) => ({
// // // //           ...prev,
// // // //           isInitiating: false,
// // // //           isInCall: true,
// // // //         }))
// // // //         await createOffer()
// // // //       }
// // // //     },
// // // //     [toUser],
// // // //   )

// // // //   const handleCallRejected = useCallback(
// // // //     ({ from }) => {
// // // //       if (from === toUser?._id) {
// // // //         console.log("❌ Call rejected by:", from)
// // // //         endCall()
// // // //       }
// // // //     },
// // // //     [toUser],
// // // //   )

// // // //   const handleCallEnded = useCallback(
// // // //     ({ from }) => {
// // // //       if (from === toUser?._id) {
// // // //         console.log("📞 Call ended by:", from)
// // // //         endCall()
// // // //       }
// // // //     },
// // // //     [toUser],
// // // //   )

// // // //   const handleWebRTCOffer = useCallback(
// // // //     async ({ offer, from }) => {
// // // //       if (from === toUser?._id) {
// // // //         console.log("📡 Received WebRTC offer from:", from)
// // // //         await handleOffer(offer, from)
// // // //       }
// // // //     },
// // // //     [toUser],
// // // //   )

// // // //   const handleWebRTCAnswer = useCallback(
// // // //     async ({ answer, from }) => {
// // // //       if (from === toUser?._id) {
// // // //         console.log("📡 Received WebRTC answer from:", from)
// // // //         await handleAnswer(answer)
// // // //       }
// // // //     },
// // // //     [toUser],
// // // //   )

// // // //   const handleWebRTCIceCandidate = useCallback(
// // // //     async ({ candidate, from }) => {
// // // //       if (from === toUser?._id) {
// // // //         console.log("🧊 Received ICE candidate from:", from)
// // // //         await handleIceCandidate(candidate)
// // // //       }
// // // //     },
// // // //     [toUser],
// // // //   )

// // // //   const handleCallFailed = useCallback(({ reason }) => {
// // // //     console.log("❌ Call failed:", reason)
// // // //     alert(`Call failed: ${reason}`)
// // // //     endCall()
// // // //   }, [])

// // // //   const checkUserOnline = useCallback(() => {
// // // //     if (toUser?._id) {
// // // //       socket.emit("check_user_online", { toUserId: toUser._id }, ({ isOnline }) => {
// // // //         setIsUserOnline(isOnline)
// // // //       })
// // // //     }
// // // //   }, [toUser])

// // // //   // Setup socket listeners
// // // //   useEffect(() => {
// // // //     socket.on("receive_message", handleReceiveMessage)
// // // //     socket.on("message_sent", handleMessageSent)
// // // //     socket.on("message_read_status", handleReadStatus)
// // // //     socket.on("message_delivered_status", handleDeliveryStatus)
// // // //     socket.on("user_typing", handleTyping)

// // // //     // Call event listeners
// // // //     socket.on("incoming-call", handleIncomingCall)
// // // //     socket.on("call-accepted", handleCallAccepted)
// // // //     socket.on("call-rejected", handleCallRejected)
// // // //     socket.on("call-ended", handleCallEnded)
// // // //     socket.on("webrtc-offer", handleWebRTCOffer)
// // // //     socket.on("webrtc-answer", handleWebRTCAnswer)
// // // //     socket.on("webrtc-ice-candidate", handleWebRTCIceCandidate)
// // // //     socket.on("call-failed", handleCallFailed)

// // // //     if (currentUser?._id && toUser?._id) {
// // // //       const roomId = [currentUser._id, toUser._id].sort().join("_")
// // // //       socket.emit("join_room", { roomId })
// // // //     }

// // // //     checkUserOnline()
// // // //     const interval = setInterval(checkUserOnline, 30000)

// // // //     return () => {
// // // //       socket.off("receive_message", handleReceiveMessage)
// // // //       socket.off("message_sent", handleMessageSent)
// // // //       socket.off("message_read_status", handleReadStatus)
// // // //       socket.off("message_delivered_status", handleDeliveryStatus)
// // // //       socket.off("user_typing", handleTyping)
// // // //       socket.off("incoming-call", handleIncomingCall)
// // // //       socket.off("call-accepted", handleCallAccepted)
// // // //       socket.off("call-rejected", handleCallRejected)
// // // //       socket.off("call-ended", handleCallEnded)
// // // //       socket.off("webrtc-offer", handleWebRTCOffer)
// // // //       socket.off("webrtc-answer", handleWebRTCAnswer)
// // // //       socket.off("webrtc-ice-candidate", handleWebRTCIceCandidate)
// // // //       socket.off("call-failed", handleCallFailed)
// // // //       clearInterval(interval)
// // // //       if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
// // // //     }
// // // //   }, [
// // // //     handleReceiveMessage,
// // // //     handleMessageSent,
// // // //     handleReadStatus,
// // // //     handleDeliveryStatus,
// // // //     handleTyping,
// // // //     handleIncomingCall,
// // // //     handleCallAccepted,
// // // //     handleCallRejected,
// // // //     handleCallEnded,
// // // //     handleWebRTCOffer,
// // // //     handleWebRTCAnswer,
// // // //     handleWebRTCIceCandidate,
// // // //     handleCallFailed,
// // // //     checkUserOnline,
// // // //     currentUser,
// // // //     toUser,
// // // //   ])

// // // //   const handleSend = () => {
// // // //     if (!input.trim() || !toUser?._id || !currentUser?._id) return

// // // //     const tempId = Math.random().toString(36).substring(7)
// // // //     const messageData = {
// // // //       toUserId: toUser._id,
// // // //       message: input,
// // // //       timestamp: new Date(),
// // // //     }

// // // //     setMessages((prev) => [
// // // //       ...prev,
// // // //       {
// // // //         _id: tempId,
// // // //         message: input,
// // // //         fromUserId: currentUser._id,
// // // //         toUserId: toUser._id,
// // // //         type: "sent",
// // // //         isDelivered: isUserOnline,
// // // //         isRead: false,
// // // //         timestamp: new Date(),
// // // //       },
// // // //     ])

// // // //     setInput("")
// // // //     socket.emit("send_message", messageData)
// // // //   }

// // // //   const handleTypingInput = (e) => {
// // // //     setInput(e.target.value)
// // // //     if (toUser?._id) {
// // // //       socket.emit("typing", { toUserId: toUser._id })
// // // //     }
// // // //   }

// // // //   useEffect(() => {
// // // //     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
// // // //   }, [messages])

// // // //   useEffect(() => {
// // // //     if (isTyping) {
// // // //       const timeout = setTimeout(() => {
// // // //         setIsTyping(false)
// // // //       }, 5000)
// // // //       return () => clearTimeout(timeout)
// // // //     }
// // // //   }, [messages])

// // // //   const handleKeyPress = (e) => {
// // // //     if (e.key === "Enter") {
// // // //       handleSend()
// // // //     }
// // // //   }

// // // //   const getMessageStatus = (msg) => {
// // // //     if (msg.type !== "sent") return null

// // // //     if (msg.isRead) {
// // // //       return (
// // // //         <span className="text-white-400" title="Read">
// // // //           ✓✓
// // // //         </span>
// // // //       )
// // // //     } else if (msg.isDelivered) {
// // // //       return (
// // // //         <span className="text-gray-300" title="Delivered">
// // // //           ✓✓
// // // //         </span>
// // // //       )
// // // //     } else {
// // // //       return (
// // // //         <span className="text-gray-400" title="Sent">
// // // //           ✓
// // // //         </span>
// // // //       )
// // // //     }
// // // //   }

// // // //   if (error) {
// // // //     return (
// // // //       <div className="flex flex-col h-full w-full p-6 items-center justify-center">
// // // //         <div className="text-center">
// // // //           <p className="text-red-600 mb-4">{error}</p>
// // // //           <button
// // // //             onClick={() => window.location.reload()}
// // // //             className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
// // // //           >
// // // //             Retry
// // // //           </button>
// // // //         </div>
// // // //       </div>
// // // //     )
// // // //   }

// // // //   return (
// // // //     <div className="flex flex-col h-full w-full p-6 relative">
// // // //       {/* Video Call Modal */}
// // // //       <VideoCallModal
// // // //         callState={callState}
// // // //         chatUser={toUser}
// // // //         localVideoRef={localVideoRef}
// // // //         remoteVideoRef={remoteVideoRef}
// // // //         onAcceptCall={acceptCall}
// // // //         onRejectCall={rejectCall}
// // // //         onEndCall={endCall}
// // // //         isCallConnected={isCallConnected}
// // // //         callDuration={callDuration}
// // // //         formatCallDuration={formatCallDuration}
// // // //         isMuted={isMuted}
// // // //         isVideoEnabled={isVideoEnabled}
// // // //         toggleMute={toggleMute}
// // // //         toggleVideo={toggleVideo}
// // // //       />

// // // //       {/* Voice Modal */}
// // // //       <VoiceModal
// // // //         isOpen={showVoiceModal}
// // // //         onClose={handleVoiceModalClose}
// // // //         isListening={isListening}
// // // //         transcript={transcript}
// // // //         onStartListening={startListening}
// // // //         onStopListening={stopListening}
// // // //       />

// // // //       {/* Chat Header */}
// // // //       <div className="mb-4 flex justify-between items-center">
// // // //         <div className="flex items-center gap-3">
// // // //           <img
// // // //             src={toUser?.profilePic || "/placeholder.svg?height=40&width=40"}
// // // //             alt={toUser?.name}
// // // //             className="w-10 h-10 rounded-full object-cover"
// // // //           />
// // // //           <div>
// // // //             <h1 className="text-xl font-bold">{toUser?.name || "..."}</h1>
// // // //             <p className="text-sm text-gray-500">{isTyping ? "Typing..." : isUserOnline ? "Online" : "Offline"}</p>
// // // //           </div>
// // // //         </div>

// // // //         {/* Call Buttons */}
// // // //         <div className="flex gap-2">
// // // //           <button
// // // //             onClick={() => startCall("audio")}
// // // //             disabled={callState.isInCall || callState.isInitiating || callState.isReceiving}
// // // //             className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
// // // //             title="Voice Call"
// // // //           >
// // // //             <Phone size={20} />
// // // //           </button>
// // // //           <button
// // // //             onClick={() => startCall("video")}
// // // //             disabled={callState.isInCall || callState.isInitiating || callState.isReceiving}
// // // //             className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
// // // //             title="Video Call"
// // // //           >
// // // //             <Video size={20} />
// // // //           </button>
// // // //           <button
// // // //             onClick={handleVoiceModalOpen}
// // // //             className="p-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 flex items-center gap-2"
// // // //             title="Voice Message"
// // // //           >
// // // //             <Mic size={20} />
// // // //           </button>
// // // //         </div>
// // // //       </div>

// // // //       {/* Messages */}
// // // //       <div className="flex-1 overflow-y-auto mb-4 border rounded p-4 bg-white">
// // // //         {messages.map((msg) => (
// // // //           <div
// // // //             key={msg._id}
// // // //             className={`mb-2 max-w-xs px-4 py-2 rounded ${
// // // //               msg.type === "sent" ? "bg-gray-500 text-white self-end ml-auto" : "bg-gray-200 text-black"
// // // //             }`}
// // // //           >
// // // //             <div className="flex justify-between items-center gap-2">
// // // //               <span>{msg.message}</span>
// // // //               {msg.type === "sent" && <span className="text-xs ml-2 flex items-center">{getMessageStatus(msg)}</span>}
// // // //             </div>
// // // //             <div className="text-xs mt-1 opacity-70">
// // // //               {new Date(msg.timestamp).toLocaleTimeString([], {
// // // //                 hour: "2-digit",
// // // //                 minute: "2-digit",
// // // //               })}
// // // //             </div>
// // // //           </div>
// // // //         ))}
// // // //         <div ref={messagesEndRef} />
// // // //       </div>

// // // //       {/* Message Input */}
// // // //       <div className="flex gap-2">
// // // //         <input
// // // //           type="text"
// // // //           placeholder="Type your message"
// // // //           value={input}
// // // //           onChange={handleTypingInput}
// // // //           onKeyPress={handleKeyPress}
// // // //           className="flex-1 border px-4 py-2 rounded focus:outline-none"
// // // //           disabled={callState.isInCall}
// // // //         />
// // // //         <button
// // // //           onClick={handleSend}
// // // //           disabled={!input.trim() || callState.isInCall}
// // // //           className={`px-4 py-2 rounded ${
// // // //             input.trim() && !callState.isInCall
// // // //               ? "bg-blue-600 text-white hover:bg-blue-700"
// // // //               : "bg-gray-300 text-gray-500 cursor-not-allowed"
// // // //           }`}
// // // //         >
// // // //           Send
// // // //         </button>
// // // //       </div>
// // // //     </div>
// // // //   )
// // // // }

// // // // export default Chat



// // // "use client"

// // // import { useEffect, useState, useRef, useCallback } from "react"
// // // import { useParams } from "react-router-dom"
// // // import axios from "axios"
// // // import socket from "../../socket"
// // // import VideoCallModal from "./Videomodel"
// // // import VoiceModal from "./Voice-model"
// // // import { Phone, Video, Mic } from "lucide-react"

// // // function Chat({ currentUser: propCurrentUser }) {
// // //   const { id } = useParams()
// // //   const [messages, setMessages] = useState([])
// // //   const [input, setInput] = useState("")
// // //   const [currentUser, setCurrentUser] = useState(propCurrentUser)
// // //   const [toUser, setToUser] = useState(null)
// // //   const [isUserOnline, setIsUserOnline] = useState(false)
// // //   const [isTyping, setIsTyping] = useState(false)
// // //   const [isWindowFocused, setIsWindowFocused] = useState(true)
// // //   const [loading, setLoading] = useState(true)
// // //   const [error, setError] = useState(null)

// // //   // Enhanced call-related states
// // //   const [callState, setCallState] = useState({
// // //     isInCall: false,
// // //     isInitiating: false,
// // //     isReceiving: false,
// // //     callType: null, // "audio" | "video" | null
// // //     remoteUserId: null,
// // //   })
// // //   const [isCallConnected, setIsCallConnected] = useState(false)
// // //   const [isMuted, setIsMuted] = useState(false)
// // //   const [isVideoEnabled, setIsVideoEnabled] = useState(true)
// // //   const [callDuration, setCallDuration] = useState(0)

// // //   // Voice modal states
// // //   const [showVoiceModal, setShowVoiceModal] = useState(false)
// // //   const [isListening, setIsListening] = useState(false)
// // //   const [transcript, setTranscript] = useState("")
// // //   const [recognition, setRecognition] = useState(null)

// // //   // Refs
// // //   const typingTimeoutRef = useRef(null)
// // //   const messagesEndRef = useRef(null)
// // //   const unreadMessagesRef = useRef(new Set())
// // //   const localVideoRef = useRef(null)
// // //   const remoteVideoRef = useRef(null)
// // //   const peerConnectionRef = useRef(null)
// // //   const localStreamRef = useRef(null)
// // //   const callTimerRef = useRef(null)

// // //   // WebRTC configuration
// // //   const rtcConfiguration = {
// // //     iceServers: [{ urls: "stun:stun.l.google.com:19302" }, { urls: "stun:stun1.l.google.com:19302" }],
// // //   }

// // //   // Enhanced time formatting function
// // //   const formatMessageTime = (timestamp) => {
// // //     const now = new Date()
// // //     const messageTime = new Date(timestamp)
// // //     const diffInMs = now.getTime() - messageTime.getTime()
// // //     const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
// // //     const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
// // //     const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

// // //     // Same day
// // //     if (diffInDays === 0) {
// // //       if (diffInMinutes < 1) {
// // //         return "now"
// // //       } else if (diffInMinutes < 60) {
// // //         return `${diffInMinutes} min ago`
// // //       } else {
// // //         return messageTime.toLocaleTimeString([], {
// // //           hour: "2-digit",
// // //           minute: "2-digit",
// // //         })
// // //       }
// // //     }
// // //     // Yesterday
// // //     else if (diffInDays === 1) {
// // //       return `Yesterday ${messageTime.toLocaleTimeString([], {
// // //         hour: "2-digit",
// // //         minute: "2-digit",
// // //       })}`
// // //     }
// // //     // This week (within 7 days)
// // //     else if (diffInDays < 7) {
// // //       const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
// // //       return `${dayNames[messageTime.getDay()]} ${messageTime.toLocaleTimeString([], {
// // //         hour: "2-digit",
// // //         minute: "2-digit",
// // //       })}`
// // //     }
// // //     // Older messages
// // //     else {
// // //       return (
// // //         messageTime.toLocaleDateString([], {
// // //           month: "short",
// // //           day: "numeric",
// // //           year: messageTime.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
// // //         }) +
// // //         " " +
// // //         messageTime.toLocaleTimeString([], {
// // //           hour: "2-digit",
// // //           minute: "2-digit",
// // //         })
// // //       )
// // //     }
// // //   }

// // //   // Track window focus for read receipts
// // //   useEffect(() => {
// // //     const handleFocus = () => setIsWindowFocused(true)
// // //     const handleBlur = () => setIsWindowFocused(false)

// // //     window.addEventListener("focus", handleFocus)
// // //     window.addEventListener("blur", handleBlur)

// // //     return () => {
// // //       window.removeEventListener("focus", handleFocus)
// // //       window.removeEventListener("blur", handleBlur)
// // //     }
// // //   }, [])

// // //   const roomId = currentUser && toUser ? [currentUser._id, toUser._id].sort().join("_") : null

// // //   // Mark messages as read when window is focused and user is in chat
// // //   useEffect(() => {
// // //     if (isWindowFocused && messages.length && currentUser?._id && toUser?._id && roomId) {
// // //       messages.forEach((msg) => {
// // //         if (
// // //           msg.type === "received" &&
// // //           !msg.isRead &&
// // //           msg._id &&
// // //           msg.fromUserId === toUser._id &&
// // //           !unreadMessagesRef.current.has(msg._id)
// // //         ) {
// // //           unreadMessagesRef.current.add(msg._id)
// // //           socket.emit("read_message", {
// // //             messageId: msg._id,
// // //             fromUserId: msg.fromUserId,
// // //             toUserId: currentUser._id,
// // //           })
// // //         }
// // //       })
// // //     }
// // //   }, [isWindowFocused, messages, currentUser, toUser, roomId])

// // //   // Initialize speech recognition
// // //   useEffect(() => {
// // //     if (typeof window !== "undefined" && ("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
// // //       const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
// // //       const recognitionInstance = new SpeechRecognition()

// // //       recognitionInstance.continuous = true
// // //       recognitionInstance.interimResults = true
// // //       recognitionInstance.lang = "en-US"

// // //       recognitionInstance.onresult = (event) => {
// // //         let finalTranscript = ""
// // //         let interimTranscript = ""

// // //         for (let i = event.resultIndex; i < event.results.length; i++) {
// // //           const transcript = event.results[i][0].transcript
// // //           if (event.results[i].isFinal) {
// // //             finalTranscript += transcript
// // //           } else {
// // //             interimTranscript += transcript
// // //           }
// // //         }

// // //         setTranscript(finalTranscript + interimTranscript)
// // //       }

// // //       recognitionInstance.onend = () => {
// // //         setIsListening(false)
// // //       }

// // //       recognitionInstance.onerror = (event) => {
// // //         console.error("Speech recognition error:", event.error)
// // //         setIsListening(false)
// // //         if (event.error === "not-allowed") {
// // //           alert("Microphone access was denied. Please allow microphone access in your browser settings.")
// // //         }
// // //       }

// // //       setRecognition(recognitionInstance)
// // //     }
// // //   }, [])

// // //   // Initial data fetch
// // //   useEffect(() => {
// // //     const fetchInitialData = async () => {
// // //       const token = localStorage.getItem("token")
// // //       if (!token) {
// // //         setError("No authentication token found")
// // //         setLoading(false)
// // //         return
// // //       }

// // //       try {
// // //         setLoading(true)
// // //         setError(null)

// // //         const res = await axios.get("https://chat-be-v2eh.onrender.com/api/user/users", {
// // //           headers: { Authorization: `Bearer ${token}` },
// // //         })

// // //         const responseData = res.data

// // //         if (!responseData.success) {
// // //           throw new Error("Failed to fetch users")
// // //         }

// // //         const receiver = responseData.users?.find((u) => u._id === id)
// // //         const userData = responseData.currentUser

// // //         setCurrentUser(userData)
// // //         setToUser(receiver)

// // //         if (!receiver) {
// // //           setError("User not found")
// // //           setLoading(false)
// // //           return
// // //         }

// // //         if (userData && receiver) {
// // //           const messageRes = await axios.get(`https://chat-be-v2eh.onrender.com/api/chat/message/${id}`, {
// // //             headers: { Authorization: `Bearer ${token}` },
// // //           })

// // //           const formattedMessages = messageRes.data.map((msg) => ({
// // //             ...msg,
// // //             type: msg.fromUserId === userData._id ? "sent" : "received",
// // //           }))

// // //           setMessages(formattedMessages)

// // //           if (isWindowFocused) {
// // //             const unreadReceived = formattedMessages.filter((msg) => msg.type === "received" && !msg.isRead && msg._id)

// // //             unreadReceived.forEach((msg) => {
// // //               socket.emit("read_message", {
// // //                 messageId: msg._id,
// // //                 fromUserId: msg.fromUserId,
// // //                 toUserId: userData._id,
// // //               })
// // //             })
// // //           }
// // //         }
// // //       } catch (error) {
// // //         console.error("Error fetching users/messages:", error)
// // //         setError(error.response?.data?.message || "Failed to load chat data")

// // //         if (error.response?.status === 401) {
// // //           localStorage.removeItem("token")
// // //           window.location.href = "/login"
// // //         }
// // //       } finally {
// // //         setLoading(false)
// // //       }
// // //     }

// // //     fetchInitialData()

// // //     return () => {
// // //       if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
// // //       if (callTimerRef.current) clearInterval(callTimerRef.current)
// // //     }
// // //   }, [id, isWindowFocused])

// // //   // WebRTC Functions
// // //   const initializePeerConnection = useCallback(() => {
// // //     const peerConnection = new RTCPeerConnection(rtcConfiguration)

// // //     peerConnection.onicecandidate = (event) => {
// // //       if (event.candidate && socket) {
// // //         socket.emit("webrtc-ice-candidate", {
// // //           to: callState.remoteUserId || toUser._id,
// // //           candidate: event.candidate,
// // //         })
// // //       }
// // //     }

// // //     peerConnection.ontrack = (event) => {
// // //       console.log("📺 Received remote stream")
// // //       if (remoteVideoRef.current && event.streams[0]) {
// // //         remoteVideoRef.current.srcObject = event.streams[0]
// // //         // Ensure video plays
// // //         remoteVideoRef.current.play().catch(console.error)
// // //       }
// // //     }

// // //     peerConnection.onconnectionstatechange = () => {
// // //       console.log("🔗 Connection state:", peerConnection.connectionState)
// // //       if (peerConnection.connectionState === "connected") {
// // //         setIsCallConnected(true)
// // //         startCallTimer()
// // //       } else if (peerConnection.connectionState === "disconnected" || peerConnection.connectionState === "failed") {
// // //         endCall()
// // //       }
// // //     }

// // //     return peerConnection
// // //   }, [callState.remoteUserId, toUser])

// // //   const startCallTimer = () => {
// // //     setCallDuration(0)
// // //     callTimerRef.current = setInterval(() => {
// // //       setCallDuration((prev) => prev + 1)
// // //     }, 1000)
// // //   }

// // //   const formatCallDuration = (seconds) => {
// // //     const mins = Math.floor(seconds / 60)
// // //     const secs = seconds % 60
// // //     return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
// // //   }

// // //   const startCall = async (callType) => {
// // //     try {
// // //       console.log(`📞 Starting ${callType} call to:`, toUser._id)

// // //       // Check available devices
// // //       const devices = await navigator.mediaDevices.enumerateDevices()
// // //       const hasAudio = devices.some((d) => d.kind === "audioinput")
// // //       const hasVideo = devices.some((d) => d.kind === "videoinput")

// // //       if (callType === "audio" && !hasAudio) {
// // //         alert("No microphone found. Please connect a microphone and try again.")
// // //         return
// // //       }
// // //       if (callType === "video" && !hasVideo) {
// // //         alert("No camera found. Please connect a camera and try again.")
// // //         return
// // //       }

// // //       setCallState({
// // //         isInCall: false,
// // //         isInitiating: true,
// // //         isReceiving: false,
// // //         callType,
// // //         remoteUserId: toUser._id,
// // //       })

// // //       // Get user media with proper constraints
// // //       const constraints = {
// // //         audio: hasAudio,
// // //         video:
// // //           callType === "video" && hasVideo
// // //             ? {
// // //                 width: { ideal: 1280 },
// // //                 height: { ideal: 720 },
// // //                 facingMode: "user",
// // //               }
// // //             : false,
// // //       }

// // //       const stream = await navigator.mediaDevices.getUserMedia(constraints)
// // //       localStreamRef.current = stream

// // //       // Set local video stream and ensure it plays
// // //       if (localVideoRef.current) {
// // //         localVideoRef.current.srcObject = stream
// // //         localVideoRef.current.muted = true // Prevent echo
// // //         localVideoRef.current.play().catch(console.error)
// // //       }

// // //       // Initialize peer connection
// // //       const peerConnection = initializePeerConnection()
// // //       peerConnectionRef.current = peerConnection

// // //       // Add local stream to peer connection
// // //       stream.getTracks().forEach((track) => {
// // //         peerConnection.addTrack(track, stream)
// // //       })

// // //       // Emit call initiation
// // //       if (socket) {
// // //         socket.emit("initiate-call", {
// // //           to: toUser._id,
// // //           from: currentUser._id,
// // //           callType,
// // //         })
// // //       }
// // //     } catch (error) {
// // //       console.error("❌ Error starting call:", error)
// // //       if (error.name === "NotFoundError") {
// // //         alert("Required device not found. Please check your camera/microphone.")
// // //       } else if (error.name === "NotAllowedError") {
// // //         alert("Permission denied. Please allow access to your camera/microphone.")
// // //       } else {
// // //         alert(error.message || "Failed to start call. Please check your camera/microphone permissions.")
// // //       }
// // //       endCall()
// // //     }
// // //   }

// // //   const acceptCall = async () => {
// // //     try {
// // //       console.log("✅ Accepting call")

// // //       const constraints = {
// // //         audio: true,
// // //         video:
// // //           callState.callType === "video"
// // //             ? {
// // //                 width: { ideal: 1280 },
// // //                 height: { ideal: 720 },
// // //                 facingMode: "user",
// // //               }
// // //             : false,
// // //       }

// // //       const stream = await navigator.mediaDevices.getUserMedia(constraints)
// // //       localStreamRef.current = stream

// // //       // Set local video stream and ensure it plays
// // //       if (localVideoRef.current) {
// // //         localVideoRef.current.srcObject = stream
// // //         localVideoRef.current.muted = true // Prevent echo
// // //         localVideoRef.current.play().catch(console.error)
// // //       }

// // //       const peerConnection = initializePeerConnection()
// // //       peerConnectionRef.current = peerConnection

// // //       stream.getTracks().forEach((track) => {
// // //         peerConnection.addTrack(track, stream)
// // //       })

// // //       setCallState((prev) => ({
// // //         ...prev,
// // //         isReceiving: false,
// // //         isInCall: true,
// // //       }))

// // //       if (socket) {
// // //         socket.emit("accept-call", {
// // //           to: callState.remoteUserId,
// // //           from: currentUser._id,
// // //         })
// // //       }
// // //     } catch (error) {
// // //       console.error("❌ Error accepting call:", error)
// // //       alert("Failed to accept call. Please check your camera/microphone permissions.")
// // //       rejectCall()
// // //     }
// // //   }

// // //   const rejectCall = () => {
// // //     console.log("❌ Rejecting call")
// // //     if (socket) {
// // //       socket.emit("reject-call", {
// // //         to: callState.remoteUserId,
// // //         from: currentUser._id,
// // //       })
// // //     }
// // //     endCall()
// // //   }

// // //   const endCall = () => {
// // //     console.log("📞 Ending call")

// // //     // Stop local stream
// // //     if (localStreamRef.current) {
// // //       localStreamRef.current.getTracks().forEach((track) => track.stop())
// // //       localStreamRef.current = null
// // //     }

// // //     // Close peer connection
// // //     if (peerConnectionRef.current) {
// // //       peerConnectionRef.current.close()
// // //       peerConnectionRef.current = null
// // //     }

// // //     // Clear video elements
// // //     if (localVideoRef.current) {
// // //       localVideoRef.current.srcObject = null
// // //     }
// // //     if (remoteVideoRef.current) {
// // //       remoteVideoRef.current.srcObject = null
// // //     }

// // //     // Stop call timer
// // //     if (callTimerRef.current) {
// // //       clearInterval(callTimerRef.current)
// // //       callTimerRef.current = null
// // //     }

// // //     // Emit call end if we're in a call
// // //     if ((callState.isInCall || callState.isInitiating) && socket) {
// // //       socket.emit("end-call", {
// // //         to: callState.remoteUserId || toUser._id,
// // //         from: currentUser._id,
// // //       })
// // //     }

// // //     // Reset call state
// // //     setCallState({
// // //       isInCall: false,
// // //       isInitiating: false,
// // //       isReceiving: false,
// // //       callType: null,
// // //       remoteUserId: null,
// // //     })
// // //     setIsCallConnected(false)
// // //     setCallDuration(0)
// // //     setIsMuted(false)
// // //     setIsVideoEnabled(true)
// // //   }

// // //   const toggleMute = () => {
// // //     if (localStreamRef.current) {
// // //       const audioTrack = localStreamRef.current.getAudioTracks()[0]
// // //       if (audioTrack) {
// // //         audioTrack.enabled = !audioTrack.enabled
// // //         setIsMuted(!audioTrack.enabled)
// // //       }
// // //     }
// // //   }

// // //   const toggleVideo = () => {
// // //     if (localStreamRef.current) {
// // //       const videoTrack = localStreamRef.current.getVideoTracks()[0]
// // //       if (videoTrack) {
// // //         videoTrack.enabled = !videoTrack.enabled
// // //         setIsVideoEnabled(videoTrack.enabled)
// // //       }
// // //     }
// // //   }

// // //   const createOffer = async () => {
// // //     if (!peerConnectionRef.current || !socket) return

// // //     try {
// // //       console.log("📡 Creating WebRTC offer")
// // //       const offer = await peerConnectionRef.current.createOffer()
// // //       await peerConnectionRef.current.setLocalDescription(offer)

// // //       socket.emit("webrtc-offer", {
// // //         to: callState.remoteUserId || toUser._id,
// // //         offer,
// // //       })
// // //     } catch (error) {
// // //       console.error("❌ Error creating offer:", error)
// // //     }
// // //   }

// // //   const handleOffer = async (offer, from) => {
// // //     if (!peerConnectionRef.current || !socket) return

// // //     try {
// // //       console.log("📡 Handling WebRTC offer from:", from)
// // //       await peerConnectionRef.current.setRemoteDescription(offer)
// // //       const answer = await peerConnectionRef.current.createAnswer()
// // //       await peerConnectionRef.current.setLocalDescription(answer)

// // //       socket.emit("webrtc-answer", {
// // //         to: from,
// // //         answer,
// // //       })
// // //     } catch (error) {
// // //       console.error("❌ Error handling offer:", error)
// // //     }
// // //   }

// // //   const handleAnswer = async (answer) => {
// // //     if (!peerConnectionRef.current) return

// // //     try {
// // //       console.log("📡 Handling WebRTC answer")
// // //       await peerConnectionRef.current.setRemoteDescription(answer)
// // //     } catch (error) {
// // //       console.error("❌ Error handling answer:", error)
// // //     }
// // //   }

// // //   const handleIceCandidate = async (candidate) => {
// // //     if (!peerConnectionRef.current) return

// // //     try {
// // //       console.log("🧊 Adding ICE candidate")
// // //       await peerConnectionRef.current.addIceCandidate(candidate)
// // //     } catch (error) {
// // //       console.error("❌ Error handling ICE candidate:", error)
// // //     }
// // //   }

// // //   // Voice recognition functions
// // //   const startListening = () => {
// // //     if (recognition) {
// // //       setTranscript("")
// // //       recognition.start()
// // //       setIsListening(true)
// // //     } else {
// // //       alert("Speech recognition is not supported in your browser")
// // //     }
// // //   }

// // //   const stopListening = () => {
// // //     if (recognition) {
// // //       recognition.stop()
// // //       setIsListening(false)

// // //       // Auto-send the message after a short delay to ensure transcript is complete
// // //       setTimeout(() => {
// // //         if (transcript.trim() && socket) {
// // //           const messageData = {
// // //             toUserId: toUser._id,
// // //             message: transcript.trim(),
// // //             timestamp: new Date(),
// // //           }

// // //           const tempId = Math.random().toString(36).substring(7)
// // //           setMessages((prev) => [
// // //             ...prev,
// // //             {
// // //               _id: tempId,
// // //               message: transcript.trim(),
// // //               fromUserId: currentUser._id,
// // //               toUserId: toUser._id,
// // //               type: "sent",
// // //               isDelivered: isUserOnline,
// // //               isRead: false,
// // //               timestamp: new Date(),
// // //             },
// // //           ])

// // //           socket.emit("send_message", messageData)
// // //           setShowVoiceModal(false)
// // //           setTranscript("")
// // //         }
// // //       }, 300)
// // //     }
// // //   }

// // //   const handleVoiceModalOpen = () => {
// // //     setShowVoiceModal(true)
// // //     setTranscript("")
// // //   }

// // //   const handleVoiceModalClose = () => {
// // //     setShowVoiceModal(false)
// // //     stopListening()
// // //     setTranscript("")
// // //   }

// // //   // Handle received messages
// // //   const handleReceiveMessage = useCallback(
// // //     (data) => {
// // //       if (!currentUser) return

// // //       const type = data.fromUserId === currentUser._id ? "sent" : "received"

// // //       setMessages((prev) => {
// // //         const existingIndex = prev.findIndex(
// // //           (msg) =>
// // //             msg.fromUserId === currentUser._id &&
// // //             typeof msg._id === "string" &&
// // //             msg._id.length < 24 &&
// // //             msg.message === data.message,
// // //         )

// // //         if (existingIndex >= 0) {
// // //           const newMessages = [...prev]
// // //           newMessages[existingIndex] = { ...data, type }
// // //           return newMessages
// // //         }

// // //         if (prev.some((msg) => msg._id === data._id)) return prev

// // //         return [...prev, { ...data, type }]
// // //       })

// // //       if (type === "received" && isWindowFocused) {
// // //         setTimeout(() => {
// // //           socket.emit("read_message", {
// // //             messageId: data._id,
// // //             fromUserId: data.fromUserId,
// // //             toUserId: currentUser._id,
// // //           })
// // //         }, 100)
// // //       }
// // //     },
// // //     [currentUser, isWindowFocused],
// // //   )

// // //   const handleMessageSent = useCallback(
// // //     (data) => {
// // //       setMessages((prev) =>
// // //         prev.map((msg) =>
// // //           msg.fromUserId === currentUser?._id && typeof msg._id === "string" && msg._id.length < 24
// // //             ? { ...data, type: "sent" }
// // //             : msg,
// // //         ),
// // //       )
// // //     },
// // //     [currentUser],
// // //   )

// // //   const handleReadStatus = useCallback((data) => {
// // //     const { messageId, isRead, readBy } = data

// // //     setMessages((prev) =>
// // //       prev.map((msg) => {
// // //         if (msg._id === messageId) {
// // //           if (isRead) {
// // //             unreadMessagesRef.current.delete(messageId)
// // //           }
// // //           return { ...msg, isRead, readBy }
// // //         }
// // //         return msg
// // //       }),
// // //     )
// // //   }, [])

// // //   const handleDeliveryStatus = useCallback((data) => {
// // //     const { messageId, isDelivered } = data
// // //     setMessages((prev) => prev.map((msg) => (msg._id === messageId ? { ...msg, isDelivered } : msg)))
// // //   }, [])

// // //   const handleTyping = useCallback(
// // //     ({ fromUserId }) => {
// // //       if (fromUserId === id) {
// // //         setIsTyping(true)
// // //         if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
// // //         typingTimeoutRef.current = setTimeout(() => setIsTyping(false), 2000)
// // //       }
// // //     },
// // //     [id],
// // //   )

// // //   // Call event handlers
// // //   const handleIncomingCall = useCallback(
// // //     ({ from, callType }) => {
// // //       if (from === toUser?._id) {
// // //         console.log("📞 Incoming call from:", from, "Type:", callType)
// // //         setCallState({
// // //           isInCall: false,
// // //           isInitiating: false,
// // //           isReceiving: true,
// // //           callType,
// // //           remoteUserId: from,
// // //         })
// // //       }
// // //     },
// // //     [toUser],
// // //   )

// // //   const handleCallAccepted = useCallback(
// // //     async ({ from }) => {
// // //       if (from === toUser?._id) {
// // //         console.log("✅ Call accepted by:", from)
// // //         setCallState((prev) => ({
// // //           ...prev,
// // //           isInitiating: false,
// // //           isInCall: true,
// // //         }))
// // //         await createOffer()
// // //       }
// // //     },
// // //     [toUser],
// // //   )

// // //   const handleCallRejected = useCallback(
// // //     ({ from }) => {
// // //       if (from === toUser?._id) {
// // //         console.log("❌ Call rejected by:", from)
// // //         endCall()
// // //       }
// // //     },
// // //     [toUser],
// // //   )

// // //   const handleCallEnded = useCallback(
// // //     ({ from }) => {
// // //       if (from === toUser?._id) {
// // //         console.log("📞 Call ended by:", from)
// // //         endCall()
// // //       }
// // //     },
// // //     [toUser],
// // //   )

// // //   const handleWebRTCOffer = useCallback(
// // //     async ({ offer, from }) => {
// // //       if (from === toUser?._id) {
// // //         console.log("📡 Received WebRTC offer from:", from)
// // //         await handleOffer(offer, from)
// // //       }
// // //     },
// // //     [toUser],
// // //   )

// // //   const handleWebRTCAnswer = useCallback(
// // //     async ({ answer, from }) => {
// // //       if (from === toUser?._id) {
// // //         console.log("📡 Received WebRTC answer from:", from)
// // //         await handleAnswer(answer)
// // //       }
// // //     },
// // //     [toUser],
// // //   )

// // //   const handleWebRTCIceCandidate = useCallback(
// // //     async ({ candidate, from }) => {
// // //       if (from === toUser?._id) {
// // //         console.log("🧊 Received ICE candidate from:", from)
// // //         await handleIceCandidate(candidate)
// // //       }
// // //     },
// // //     [toUser],
// // //   )

// // //   const handleCallFailed = useCallback(({ reason }) => {
// // //     console.log("❌ Call failed:", reason)
// // //     alert(`Call failed: ${reason}`)
// // //     endCall()
// // //   }, [])

// // //   const checkUserOnline = useCallback(() => {
// // //     if (toUser?._id) {
// // //       socket.emit("check_user_online", { toUserId: toUser._id }, ({ isOnline }) => {
// // //         setIsUserOnline(isOnline)
// // //       })
// // //     }
// // //   }, [toUser])

// // //   // Setup socket listeners
// // //   useEffect(() => {
// // //     socket.on("receive_message", handleReceiveMessage)
// // //     socket.on("message_sent", handleMessageSent)
// // //     socket.on("message_read_status", handleReadStatus)
// // //     socket.on("message_delivered_status", handleDeliveryStatus)
// // //     socket.on("user_typing", handleTyping)

// // //     // Call event listeners
// // //     socket.on("incoming-call", handleIncomingCall)
// // //     socket.on("call-accepted", handleCallAccepted)
// // //     socket.on("call-rejected", handleCallRejected)
// // //     socket.on("call-ended", handleCallEnded)
// // //     socket.on("webrtc-offer", handleWebRTCOffer)
// // //     socket.on("webrtc-answer", handleWebRTCAnswer)
// // //     socket.on("webrtc-ice-candidate", handleWebRTCIceCandidate)
// // //     socket.on("call-failed", handleCallFailed)

// // //     if (currentUser?._id && toUser?._id) {
// // //       const roomId = [currentUser._id, toUser._id].sort().join("_")
// // //       socket.emit("join_room", { roomId })
// // //     }

// // //     checkUserOnline()
// // //     const interval = setInterval(checkUserOnline, 30000)

// // //     return () => {
// // //       socket.off("receive_message", handleReceiveMessage)
// // //       socket.off("message_sent", handleMessageSent)
// // //       socket.off("message_read_status", handleReadStatus)
// // //       socket.off("message_delivered_status", handleDeliveryStatus)
// // //       socket.off("user_typing", handleTyping)
// // //       socket.off("incoming-call", handleIncomingCall)
// // //       socket.off("call-accepted", handleCallAccepted)
// // //       socket.off("call-rejected", handleCallRejected)
// // //       socket.off("call-ended", handleCallEnded)
// // //       socket.off("webrtc-offer", handleWebRTCOffer)
// // //       socket.off("webrtc-answer", handleWebRTCAnswer)
// // //       socket.off("webrtc-ice-candidate", handleWebRTCIceCandidate)
// // //       socket.off("call-failed", handleCallFailed)
// // //       clearInterval(interval)
// // //       if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
// // //     }
// // //   }, [
// // //     handleReceiveMessage,
// // //     handleMessageSent,
// // //     handleReadStatus,
// // //     handleDeliveryStatus,
// // //     handleTyping,
// // //     handleIncomingCall,
// // //     handleCallAccepted,
// // //     handleCallRejected,
// // //     handleCallEnded,
// // //     handleWebRTCOffer,
// // //     handleWebRTCAnswer,
// // //     handleWebRTCIceCandidate,
// // //     handleCallFailed,
// // //     checkUserOnline,
// // //     currentUser,
// // //     toUser,
// // //   ])

// // //   const handleSend = () => {
// // //     if (!input.trim() || !toUser?._id || !currentUser?._id) return

// // //     const tempId = Math.random().toString(36).substring(7)
// // //     const messageData = {
// // //       toUserId: toUser._id,
// // //       message: input,
// // //       timestamp: new Date(),
// // //     }

// // //     setMessages((prev) => [
// // //       ...prev,
// // //       {
// // //         _id: tempId,
// // //         message: input,
// // //         fromUserId: currentUser._id,
// // //         toUserId: toUser._id,
// // //         type: "sent",
// // //         isDelivered: isUserOnline,
// // //         isRead: false,
// // //         timestamp: new Date(),
// // //       },
// // //     ])

// // //     setInput("")
// // //     socket.emit("send_message", messageData)
// // //   }

// // //   const handleTypingInput = (e) => {
// // //     setInput(e.target.value)
// // //     if (toUser?._id) {
// // //       socket.emit("typing", { toUserId: toUser._id })
// // //     }
// // //   }

// // //   useEffect(() => {
// // //     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
// // //   }, [messages])

// // //   useEffect(() => {
// // //     if (isTyping) {
// // //       const timeout = setTimeout(() => {
// // //         setIsTyping(false)
// // //       }, 5000)
// // //       return () => clearTimeout(timeout)
// // //     }
// // //   }, [messages])

// // //   const handleKeyPress = (e) => {
// // //     if (e.key === "Enter") {
// // //       handleSend()
// // //     }
// // //   }

// // //   const getMessageStatus = (msg) => {
// // //     if (msg.type !== "sent") return null

// // //     if (msg.isRead) {
// // //       return (
// // //         <span className="text-white-400" title="Read">
// // //           ✓✓
// // //         </span>
// // //       )
// // //     } else if (msg.isDelivered) {
// // //       return (
// // //         <span className="text-gray-300" title="Delivered">
// // //           ✓✓
// // //         </span>
// // //       )
// // //     } else {
// // //       return (
// // //         <span className="text-gray-400" title="Sent">
// // //           ✓
// // //         </span>
// // //       )
// // //     }
// // //   }

// // //   if (error) {
// // //     return (
// // //       <div className="flex flex-col h-full w-full p-6 items-center justify-center">
// // //         <div className="text-center">
// // //           <p className="text-red-600 mb-4">{error}</p>
// // //           <button
// // //             onClick={() => window.location.reload()}
// // //             className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
// // //           >
// // //             Retry
// // //           </button>
// // //         </div>
// // //       </div>
// // //     )
// // //   }

// // //   return (
// // //     <div className="flex flex-col h-full w-full p-6 relative">
// // //       {/* Video Call Modal */}
// // //       <VideoCallModal
// // //         callState={callState}
// // //         chatUser={toUser}
// // //         localVideoRef={localVideoRef}
// // //         remoteVideoRef={remoteVideoRef}
// // //         onAcceptCall={acceptCall}
// // //         onRejectCall={rejectCall}
// // //         onEndCall={endCall}
// // //         isCallConnected={isCallConnected}
// // //         callDuration={callDuration}
// // //         formatCallDuration={formatCallDuration}
// // //         isMuted={isMuted}
// // //         isVideoEnabled={isVideoEnabled}
// // //         toggleMute={toggleMute}
// // //         toggleVideo={toggleVideo}
// // //       />

// // //       {/* Voice Modal */}
// // //       <VoiceModal
// // //         isOpen={showVoiceModal}
// // //         onClose={handleVoiceModalClose}
// // //         isListening={isListening}
// // //         transcript={transcript}
// // //         onStartListening={startListening}
// // //         onStopListening={stopListening}
// // //       />

// // //       {/* Chat Header */}
// // //       <div className="mb-4 flex justify-between items-center">
// // //         <div className="flex items-center gap-3">
// // //           <img
// // //             src={toUser?.profilePic || "/placeholder.svg?height=40&width=40"}
// // //             alt={toUser?.name}
// // //             className="w-10 h-10 rounded-full object-cover"
// // //           />
// // //           <div>
// // //             <h1 className="text-xl font-bold">{toUser?.name || "..."}</h1>
// // //             <p className="text-sm text-gray-500">{isTyping ? "Typing..." : isUserOnline ? "Online" : "Offline"}</p>
// // //           </div>
// // //         </div>

// // //         {/* Call Buttons */}
// // //         <div className="flex gap-2">
// // //           <button
// // //             onClick={() => startCall("audio")}
// // //             disabled={callState.isInCall || callState.isInitiating || callState.isReceiving}
// // //             className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
// // //             title="Voice Call"
// // //           >
// // //             <Phone size={20} />
// // //           </button>
// // //           <button
// // //             onClick={() => startCall("video")}
// // //             disabled={callState.isInCall || callState.isInitiating || callState.isReceiving}
// // //             className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
// // //             title="Video Call"
// // //           >
// // //             <Video size={20} />
// // //           </button>
// // //           <button
// // //             onClick={handleVoiceModalOpen}
// // //             className="p-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 flex items-center gap-2"
// // //             title="Voice Message"
// // //           >
// // //             <Mic size={20} />
// // //           </button>
// // //         </div>
// // //       </div>

// // //       {/* Messages */}
// // //       <div className="flex-1 overflow-y-auto mb-4 border rounded p-4 bg-white">
// // //         {messages.map((msg) => (
// // //           <div
// // //             key={msg._id}
// // //             className={`mb-4 max-w-xs px-4 py-2 rounded-lg ${
// // //               msg.type === "sent" ? "bg-blue-500 text-white self-end ml-auto" : "bg-gray-200 text-black"
// // //             }`}
// // //           >
// // //             <div className="flex justify-between items-start gap-2">
// // //               <span className="break-words">{msg.message}</span>
// // //               {msg.type === "sent" && (
// // //                 <span className="text-xs ml-2 flex items-center flex-shrink-0">{getMessageStatus(msg)}</span>
// // //               )}
// // //             </div>
// // //             <div className="text-xs mt-1 opacity-70">{formatMessageTime(msg.timestamp)}</div>
// // //           </div>
// // //         ))}
// // //         <div ref={messagesEndRef} />
// // //       </div>

// // //       {/* Message Input */}
// // //       <div className="flex gap-2">
// // //         <input
// // //           type="text"
// // //           placeholder="Type your message"
// // //           value={input}
// // //           onChange={handleTypingInput}
// // //           onKeyPress={handleKeyPress}
// // //           className="flex-1 border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
// // //           disabled={callState.isInCall}
// // //         />
// // //         <button
// // //           onClick={handleSend}
// // //           disabled={!input.trim() || callState.isInCall}
// // //           className={`px-4 py-2 rounded ${
// // //             input.trim() && !callState.isInCall
// // //               ? "bg-blue-600 text-white hover:bg-blue-700"
// // //               : "bg-gray-300 text-gray-500 cursor-not-allowed"
// // //           }`}
// // //         >
// // //           Send
// // //         </button>
// // //       </div>
// // //     </div>
// // //   )
// // // }

// // // export default Chat



// // "use client"

// // import { useEffect, useState, useRef, useCallback } from "react"
// // import { useParams } from "react-router-dom"
// // import axios from "axios"
// // import socket from "../../socket"
// // import VideoCallModal from "./Videomodel"
// // import VoiceModal from "./Voice-model"
// // import { Phone, Video, Mic } from "lucide-react"

// // function Chat({ currentUser: propCurrentUser }) {
// //   const { id } = useParams()
// //   const [messages, setMessages] = useState([])
// //   const [input, setInput] = useState("")
// //   const [currentUser, setCurrentUser] = useState(propCurrentUser)
// //   const [toUser, setToUser] = useState(null)
// //   const [isUserOnline, setIsUserOnline] = useState(false)
// //   const [isTyping, setIsTyping] = useState(false)
// //   const [isWindowFocused, setIsWindowFocused] = useState(true)
// //   const [loading, setLoading] = useState(true)
// //   const [error, setError] = useState(null)

// //   // Enhanced call-related states
// //   const [callState, setCallState] = useState({
// //     isInCall: false,
// //     isInitiating: false,
// //     isReceiving: false,
// //     callType: null, // "audio" | "video" | null
// //     remoteUserId: null,
// //   })
// //   const [isCallConnected, setIsCallConnected] = useState(false)
// //   const [isMuted, setIsMuted] = useState(false)
// //   const [isVideoEnabled, setIsVideoEnabled] = useState(true)
// //   const [callDuration, setCallDuration] = useState(0)

// //   // Voice modal states
// //   const [showVoiceModal, setShowVoiceModal] = useState(false)
// //   const [isListening, setIsListening] = useState(false)
// //   const [transcript, setTranscript] = useState("")
// //   const [recognition, setRecognition] = useState(null)

// //   // Refs
// //   const typingTimeoutRef = useRef(null)
// //   const messagesEndRef = useRef(null)
// //   const unreadMessagesRef = useRef(new Set())
// //   const localVideoRef = useRef(null)
// //   const remoteVideoRef = useRef(null)
// //   const peerConnectionRef = useRef(null)
// //   const localStreamRef = useRef(null)
// //   const callTimerRef = useRef(null)

// //   // WebRTC configuration
// //   const rtcConfiguration = {
// //     iceServers: [{ urls: "stun:stun.l.google.com:19302" }, { urls: "stun:stun1.l.google.com:19302" }],
// //   }

// //   // Group messages by date and format time
// //   const getDateGroup = (timestamp) => {
// //     const now = new Date()
// //     const messageDate = new Date(timestamp)
// //     const diffInDays = Math.floor((now.getTime() - messageDate.getTime()) / (1000 * 60 * 60 * 24))

// //     // Reset time to compare dates only
// //     const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
// //     const msgDate = new Date(messageDate.getFullYear(), messageDate.getMonth(), messageDate.getDate())
// //     const daysDiff = Math.floor((today.getTime() - msgDate.getTime()) / (1000 * 60 * 60 * 24))

// //     if (daysDiff === 0) {
// //       return "Today"
// //     } else if (daysDiff === 1) {
// //       return "Yesterday"
// //     } else if (daysDiff < 7) {
// //       const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
// //       return dayNames[messageDate.getDay()]
// //     } else {
// //       return messageDate.toLocaleDateString([], {
// //         weekday: "long",
// //         month: "long",
// //         day: "numeric",
// //         year: messageDate.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
// //       })
// //     }
// //   }

// //   const formatMessageTime = (timestamp) => {
// //     const messageTime = new Date(timestamp)
// //     return messageTime.toLocaleTimeString([], {
// //       hour: "2-digit",
// //       minute: "2-digit",
// //     })
// //   }

// //   // Group messages by date
// //   const groupMessagesByDate = (messages) => {
// //     const groups = {}

// //     messages.forEach((message) => {
// //       const dateGroup = getDateGroup(message.timestamp)
// //       if (!groups[dateGroup]) {
// //         groups[dateGroup] = []
// //       }
// //       groups[dateGroup].push(message)
// //     })

// //     return groups
// //   }

// //   // Track window focus for read receipts
// //   useEffect(() => {
// //     const handleFocus = () => setIsWindowFocused(true)
// //     const handleBlur = () => setIsWindowFocused(false)

// //     window.addEventListener("focus", handleFocus)
// //     window.addEventListener("blur", handleBlur)

// //     return () => {
// //       window.removeEventListener("focus", handleFocus)
// //       window.removeEventListener("blur", handleBlur)
// //     }
// //   }, [])

// //   const roomId = currentUser && toUser ? [currentUser._id, toUser._id].sort().join("_") : null

// //   // Mark messages as read when window is focused and user is in chat
// //   useEffect(() => {
// //     if (isWindowFocused && messages.length && currentUser?._id && toUser?._id && roomId) {
// //       messages.forEach((msg) => {
// //         if (
// //           msg.type === "received" &&
// //           !msg.isRead &&
// //           msg._id &&
// //           msg.fromUserId === toUser._id &&
// //           !unreadMessagesRef.current.has(msg._id)
// //         ) {
// //           unreadMessagesRef.current.add(msg._id)
// //           socket.emit("read_message", {
// //             messageId: msg._id,
// //             fromUserId: msg.fromUserId,
// //             toUserId: currentUser._id,
// //           })
// //         }
// //       })
// //     }
// //   }, [isWindowFocused, messages, currentUser, toUser, roomId])

// //   // Initialize speech recognition
// //   useEffect(() => {
// //     if (typeof window !== "undefined" && ("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
// //       const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
// //       const recognitionInstance = new SpeechRecognition()

// //       recognitionInstance.continuous = true
// //       recognitionInstance.interimResults = true
// //       recognitionInstance.lang = "en-US"

// //       recognitionInstance.onresult = (event) => {
// //         let finalTranscript = ""
// //         let interimTranscript = ""

// //         for (let i = event.resultIndex; i < event.results.length; i++) {
// //           const transcript = event.results[i][0].transcript
// //           if (event.results[i].isFinal) {
// //             finalTranscript += transcript
// //           } else {
// //             interimTranscript += transcript
// //           }
// //         }

// //         setTranscript(finalTranscript + interimTranscript)
// //       }

// //       recognitionInstance.onend = () => {
// //         setIsListening(false)
// //       }

// //       recognitionInstance.onerror = (event) => {
// //         console.error("Speech recognition error:", event.error)
// //         setIsListening(false)
// //         if (event.error === "not-allowed") {
// //           alert("Microphone access was denied. Please allow microphone access in your browser settings.")
// //         }
// //       }

// //       setRecognition(recognitionInstance)
// //     }
// //   }, [])

// //   // Initial data fetch
// //   useEffect(() => {
// //     const fetchInitialData = async () => {
// //       const token = localStorage.getItem("token")
// //       if (!token) {
// //         setError("No authentication token found")
// //         setLoading(false)
// //         return
// //       }

// //       try {
// //         setLoading(true)
// //         setError(null)

// //         const res = await axios.get("https://chat-be-v2eh.onrender.com/api/user/users", {
// //           headers: { Authorization: `Bearer ${token}` },
// //         })

// //         const responseData = res.data

// //         if (!responseData.success) {
// //           throw new Error("Failed to fetch users")
// //         }

// //         const receiver = responseData.users?.find((u) => u._id === id)
// //         const userData = responseData.currentUser

// //         setCurrentUser(userData)
// //         setToUser(receiver)

// //         if (!receiver) {
// //           setError("User not found")
// //           setLoading(false)
// //           return
// //         }

// //         if (userData && receiver) {
// //           const messageRes = await axios.get(`https://chat-be-v2eh.onrender.com/api/chat/message/${id}`, {
// //             headers: { Authorization: `Bearer ${token}` },
// //           })

// //           const formattedMessages = messageRes.data.map((msg) => ({
// //             ...msg,
// //             type: msg.fromUserId === userData._id ? "sent" : "received",
// //           }))

// //           setMessages(formattedMessages)

// //           if (isWindowFocused) {
// //             const unreadReceived = formattedMessages.filter((msg) => msg.type === "received" && !msg.isRead && msg._id)

// //             unreadReceived.forEach((msg) => {
// //               socket.emit("read_message", {
// //                 messageId: msg._id,
// //                 fromUserId: msg.fromUserId,
// //                 toUserId: userData._id,
// //               })
// //             })
// //           }
// //         }
// //       } catch (error) {
// //         console.error("Error fetching users/messages:", error)
// //         setError(error.response?.data?.message || "Failed to load chat data")

// //         if (error.response?.status === 401) {
// //           localStorage.removeItem("token")
// //           window.location.href = "/login"
// //         }
// //       } finally {
// //         setLoading(false)
// //       }
// //     }

// //     fetchInitialData()

// //     return () => {
// //       if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
// //       if (callTimerRef.current) clearInterval(callTimerRef.current)
// //     }
// //   }, [id, isWindowFocused])

// //   // WebRTC Functions
// //   const initializePeerConnection = useCallback(() => {
// //     const peerConnection = new RTCPeerConnection(rtcConfiguration)

// //     peerConnection.onicecandidate = (event) => {
// //       if (event.candidate && socket) {
// //         socket.emit("webrtc-ice-candidate", {
// //           to: callState.remoteUserId || toUser._id,
// //           candidate: event.candidate,
// //         })
// //       }
// //     }

// //     peerConnection.ontrack = (event) => {
// //       console.log("📺 Received remote stream")
// //       if (remoteVideoRef.current && event.streams[0]) {
// //         remoteVideoRef.current.srcObject = event.streams[0]
// //         // Ensure video plays
// //         remoteVideoRef.current.play().catch(console.error)
// //       }
// //     }

// //     peerConnection.onconnectionstatechange = () => {
// //       console.log("🔗 Connection state:", peerConnection.connectionState)
// //       if (peerConnection.connectionState === "connected") {
// //         setIsCallConnected(true)
// //         startCallTimer()
// //       } else if (peerConnection.connectionState === "disconnected" || peerConnection.connectionState === "failed") {
// //         endCall()
// //       }
// //     }

// //     return peerConnection
// //   }, [callState.remoteUserId, toUser])

// //   const startCallTimer = () => {
// //     setCallDuration(0)
// //     callTimerRef.current = setInterval(() => {
// //       setCallDuration((prev) => prev + 1)
// //     }, 1000)
// //   }

// //   const formatCallDuration = (seconds) => {
// //     const mins = Math.floor(seconds / 60)
// //     const secs = seconds % 60
// //     return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
// //   }

// //   const startCall = async (callType) => {
// //     try {
// //       console.log(`📞 Starting ${callType} call to:`, toUser._id)

// //       // Check available devices
// //       const devices = await navigator.mediaDevices.enumerateDevices()
// //       const hasAudio = devices.some((d) => d.kind === "audioinput")
// //       const hasVideo = devices.some((d) => d.kind === "videoinput")

// //       if (callType === "audio" && !hasAudio) {
// //         alert("No microphone found. Please connect a microphone and try again.")
// //         return
// //       }
// //       if (callType === "video" && !hasVideo) {
// //         alert("No camera found. Please connect a camera and try again.")
// //         return
// //       }

// //       setCallState({
// //         isInCall: false,
// //         isInitiating: true,
// //         isReceiving: false,
// //         callType,
// //         remoteUserId: toUser._id,
// //       })

// //       // Get user media with proper constraints
// //       const constraints = {
// //         audio: hasAudio,
// //         video:
// //           callType === "video" && hasVideo
// //             ? {
// //                 width: { ideal: 1280 },
// //                 height: { ideal: 720 },
// //                 facingMode: "user",
// //               }
// //             : false,
// //       }

// //       const stream = await navigator.mediaDevices.getUserMedia(constraints)
// //       localStreamRef.current = stream

// //       // Set local video stream and ensure it plays
// //       if (localVideoRef.current) {
// //         localVideoRef.current.srcObject = stream
// //         localVideoRef.current.muted = true // Prevent echo
// //         localVideoRef.current.play().catch(console.error)
// //       }

// //       // Initialize peer connection
// //       const peerConnection = initializePeerConnection()
// //       peerConnectionRef.current = peerConnection

// //       // Add local stream to peer connection
// //       stream.getTracks().forEach((track) => {
// //         peerConnection.addTrack(track, stream)
// //       })

// //       // Emit call initiation
// //       if (socket) {
// //         socket.emit("initiate-call", {
// //           to: toUser._id,
// //           from: currentUser._id,
// //           callType,
// //         })
// //       }
// //     } catch (error) {
// //       console.error("❌ Error starting call:", error)
// //       if (error.name === "NotFoundError") {
// //         alert("Required device not found. Please check your camera/microphone.")
// //       } else if (error.name === "NotAllowedError") {
// //         alert("Permission denied. Please allow access to your camera/microphone.")
// //       } else {
// //         alert(error.message || "Failed to start call. Please check your camera/microphone permissions.")
// //       }
// //       endCall()
// //     }
// //   }

// //   const acceptCall = async () => {
// //     try {
// //       console.log("✅ Accepting call")

// //       const constraints = {
// //         audio: true,
// //         video:
// //           callState.callType === "video"
// //             ? {
// //                 width: { ideal: 1280 },
// //                 height: { ideal: 720 },
// //                 facingMode: "user",
// //               }
// //             : false,
// //       }

// //       const stream = await navigator.mediaDevices.getUserMedia(constraints)
// //       localStreamRef.current = stream

// //       // Set local video stream and ensure it plays
// //       if (localVideoRef.current) {
// //         localVideoRef.current.srcObject = stream
// //         localVideoRef.current.muted = true // Prevent echo
// //         localVideoRef.current.play().catch(console.error)
// //       }

// //       const peerConnection = initializePeerConnection()
// //       peerConnectionRef.current = peerConnection

// //       stream.getTracks().forEach((track) => {
// //         peerConnection.addTrack(track, stream)
// //       })

// //       setCallState((prev) => ({
// //         ...prev,
// //         isReceiving: false,
// //         isInCall: true,
// //       }))

// //       if (socket) {
// //         socket.emit("accept-call", {
// //           to: callState.remoteUserId,
// //           from: currentUser._id,
// //         })
// //       }
// //     } catch (error) {
// //       console.error("❌ Error accepting call:", error)
// //       alert("Failed to accept call. Please check your camera/microphone permissions.")
// //       rejectCall()
// //     }
// //   }

// //   const rejectCall = () => {
// //     console.log("❌ Rejecting call")
// //     if (socket) {
// //       socket.emit("reject-call", {
// //         to: callState.remoteUserId,
// //         from: currentUser._id,
// //       })
// //     }
// //     endCall()
// //   }

// //   const endCall = () => {
// //     console.log("📞 Ending call")

// //     // Stop local stream
// //     if (localStreamRef.current) {
// //       localStreamRef.current.getTracks().forEach((track) => track.stop())
// //       localStreamRef.current = null
// //     }

// //     // Close peer connection
// //     if (peerConnectionRef.current) {
// //       peerConnectionRef.current.close()
// //       peerConnectionRef.current = null
// //     }

// //     // Clear video elements
// //     if (localVideoRef.current) {
// //       localVideoRef.current.srcObject = null
// //     }
// //     if (remoteVideoRef.current) {
// //       remoteVideoRef.current.srcObject = null
// //     }

// //     // Stop call timer
// //     if (callTimerRef.current) {
// //       clearInterval(callTimerRef.current)
// //       callTimerRef.current = null
// //     }

// //     // Emit call end if we're in a call
// //     if ((callState.isInCall || callState.isInitiating) && socket) {
// //       socket.emit("end-call", {
// //         to: callState.remoteUserId || toUser._id,
// //         from: currentUser._id,
// //       })
// //     }

// //     // Reset call state
// //     setCallState({
// //       isInCall: false,
// //       isInitiating: false,
// //       isReceiving: false,
// //       callType: null,
// //       remoteUserId: null,
// //     })
// //     setIsCallConnected(false)
// //     setCallDuration(0)
// //     setIsMuted(false)
// //     setIsVideoEnabled(true)
// //   }

// //   const toggleMute = () => {
// //     if (localStreamRef.current) {
// //       const audioTrack = localStreamRef.current.getAudioTracks()[0]
// //       if (audioTrack) {
// //         audioTrack.enabled = !audioTrack.enabled
// //         setIsMuted(!audioTrack.enabled)
// //       }
// //     }
// //   }

// //   const toggleVideo = () => {
// //     if (localStreamRef.current) {
// //       const videoTrack = localStreamRef.current.getVideoTracks()[0]
// //       if (videoTrack) {
// //         videoTrack.enabled = !videoTrack.enabled
// //         setIsVideoEnabled(videoTrack.enabled)
// //       }
// //     }
// //   }

// //   const createOffer = async () => {
// //     if (!peerConnectionRef.current || !socket) return

// //     try {
// //       console.log("📡 Creating WebRTC offer")
// //       const offer = await peerConnectionRef.current.createOffer()
// //       await peerConnectionRef.current.setLocalDescription(offer)

// //       socket.emit("webrtc-offer", {
// //         to: callState.remoteUserId || toUser._id,
// //         offer,
// //       })
// //     } catch (error) {
// //       console.error("❌ Error creating offer:", error)
// //     }
// //   }

// //   const handleOffer = async (offer, from) => {
// //     if (!peerConnectionRef.current || !socket) return

// //     try {
// //       console.log("📡 Handling WebRTC offer from:", from)
// //       await peerConnectionRef.current.setRemoteDescription(offer)
// //       const answer = await peerConnectionRef.current.createAnswer()
// //       await peerConnectionRef.current.setLocalDescription(answer)

// //       socket.emit("webrtc-answer", {
// //         to: from,
// //         answer,
// //       })
// //     } catch (error) {
// //       console.error("❌ Error handling offer:", error)
// //     }
// //   }

// //   const handleAnswer = async (answer) => {
// //     if (!peerConnectionRef.current) return

// //     try {
// //       console.log("📡 Handling WebRTC answer")
// //       await peerConnectionRef.current.setRemoteDescription(answer)
// //     } catch (error) {
// //       console.error("❌ Error handling answer:", error)
// //     }
// //   }

// //   const handleIceCandidate = async (candidate) => {
// //     if (!peerConnectionRef.current) return

// //     try {
// //       console.log("🧊 Adding ICE candidate")
// //       await peerConnectionRef.current.addIceCandidate(candidate)
// //     } catch (error) {
// //       console.error("❌ Error handling ICE candidate:", error)
// //     }
// //   }

// //   // Voice recognition functions
// //   const startListening = () => {
// //     if (recognition) {
// //       setTranscript("")
// //       recognition.start()
// //       setIsListening(true)
// //     } else {
// //       alert("Speech recognition is not supported in your browser")
// //     }
// //   }

// //   const stopListening = () => {
// //     if (recognition) {
// //       recognition.stop()
// //       setIsListening(false)

// //       // Auto-send the message after a short delay to ensure transcript is complete
// //       setTimeout(() => {
// //         if (transcript.trim() && socket) {
// //           const messageData = {
// //             toUserId: toUser._id,
// //             message: transcript.trim(),
// //             timestamp: new Date(),
// //           }

// //           const tempId = Math.random().toString(36).substring(7)
// //           setMessages((prev) => [
// //             ...prev,
// //             {
// //               _id: tempId,
// //               message: transcript.trim(),
// //               fromUserId: currentUser._id,
// //               toUserId: toUser._id,
// //               type: "sent",
// //               isDelivered: isUserOnline,
// //               isRead: false,
// //               timestamp: new Date(),
// //             },
// //           ])

// //           socket.emit("send_message", messageData)
// //           setShowVoiceModal(false)
// //           setTranscript("")
// //         }
// //       }, 300)
// //     }
// //   }

// //   const handleVoiceModalOpen = () => {
// //     setShowVoiceModal(true)
// //     setTranscript("")
// //   }

// //   const handleVoiceModalClose = () => {
// //     setShowVoiceModal(false)
// //     stopListening()
// //     setTranscript("")
// //   }

// //   // Handle received messages
// //   const handleReceiveMessage = useCallback(
// //     (data) => {
// //       if (!currentUser) return

// //       const type = data.fromUserId === currentUser._id ? "sent" : "received"

// //       setMessages((prev) => {
// //         const existingIndex = prev.findIndex(
// //           (msg) =>
// //             msg.fromUserId === currentUser._id &&
// //             typeof msg._id === "string" &&
// //             msg._id.length < 24 &&
// //             msg.message === data.message,
// //         )

// //         if (existingIndex >= 0) {
// //           const newMessages = [...prev]
// //           newMessages[existingIndex] = { ...data, type }
// //           return newMessages
// //         }

// //         if (prev.some((msg) => msg._id === data._id)) return prev

// //         return [...prev, { ...data, type }]
// //       })

// //       if (type === "received" && isWindowFocused) {
// //         setTimeout(() => {
// //           socket.emit("read_message", {
// //             messageId: data._id,
// //             fromUserId: data.fromUserId,
// //             toUserId: currentUser._id,
// //           })
// //         }, 100)
// //       }
// //     },
// //     [currentUser, isWindowFocused],
// //   )

// //   const handleMessageSent = useCallback(
// //     (data) => {
// //       setMessages((prev) =>
// //         prev.map((msg) =>
// //           msg.fromUserId === currentUser?._id && typeof msg._id === "string" && msg._id.length < 24
// //             ? { ...data, type: "sent" }
// //             : msg,
// //         ),
// //       )
// //     },
// //     [currentUser],
// //   )

// //   const handleReadStatus = useCallback((data) => {
// //     const { messageId, isRead, readBy } = data

// //     setMessages((prev) =>
// //       prev.map((msg) => {
// //         if (msg._id === messageId) {
// //           if (isRead) {
// //             unreadMessagesRef.current.delete(messageId)
// //           }
// //           return { ...msg, isRead, readBy }
// //         }
// //         return msg
// //       }),
// //     )
// //   }, [])

// //   const handleDeliveryStatus = useCallback((data) => {
// //     const { messageId, isDelivered } = data
// //     setMessages((prev) => prev.map((msg) => (msg._id === messageId ? { ...msg, isDelivered } : msg)))
// //   }, [])

// //   const handleTyping = useCallback(
// //     ({ fromUserId }) => {
// //       if (fromUserId === id) {
// //         setIsTyping(true)
// //         if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
// //         typingTimeoutRef.current = setTimeout(() => setIsTyping(false), 2000)
// //       }
// //     },
// //     [id],
// //   )

// //   // Call event handlers
// //   const handleIncomingCall = useCallback(
// //     ({ from, callType }) => {
// //       if (from === toUser?._id) {
// //         console.log("📞 Incoming call from:", from, "Type:", callType)
// //         setCallState({
// //           isInCall: false,
// //           isInitiating: false,
// //           isReceiving: true,
// //           callType,
// //           remoteUserId: from,
// //         })
// //       }
// //     },
// //     [toUser],
// //   )

// //   const handleCallAccepted = useCallback(
// //     async ({ from }) => {
// //       if (from === toUser?._id) {
// //         console.log("✅ Call accepted by:", from)
// //         setCallState((prev) => ({
// //           ...prev,
// //           isInitiating: false,
// //           isInCall: true,
// //         }))
// //         await createOffer()
// //       }
// //     },
// //     [toUser],
// //   )

// //   const handleCallRejected = useCallback(
// //     ({ from }) => {
// //       if (from === toUser?._id) {
// //         console.log("❌ Call rejected by:", from)
// //         endCall()
// //       }
// //     },
// //     [toUser],
// //   )

// //   const handleCallEnded = useCallback(
// //     ({ from }) => {
// //       if (from === toUser?._id) {
// //         console.log("📞 Call ended by:", from)
// //         endCall()
// //       }
// //     },
// //     [toUser],
// //   )

// //   const handleWebRTCOffer = useCallback(
// //     async ({ offer, from }) => {
// //       if (from === toUser?._id) {
// //         console.log("📡 Received WebRTC offer from:", from)
// //         await handleOffer(offer, from)
// //       }
// //     },
// //     [toUser],
// //   )

// //   const handleWebRTCAnswer = useCallback(
// //     async ({ answer, from }) => {
// //       if (from === toUser?._id) {
// //         console.log("📡 Received WebRTC answer from:", from)
// //         await handleAnswer(answer)
// //       }
// //     },
// //     [toUser],
// //   )

// //   const handleWebRTCIceCandidate = useCallback(
// //     async ({ candidate, from }) => {
// //       if (from === toUser?._id) {
// //         console.log("🧊 Received ICE candidate from:", from)
// //         await handleIceCandidate(candidate)
// //       }
// //     },
// //     [toUser],
// //   )

// //   const handleCallFailed = useCallback(({ reason }) => {
// //     console.log("❌ Call failed:", reason)
// //     alert(`Call failed: ${reason}`)
// //     endCall()
// //   }, [])

// //   const checkUserOnline = useCallback(() => {
// //     if (toUser?._id) {
// //       socket.emit("check_user_online", { toUserId: toUser._id }, ({ isOnline }) => {
// //         setIsUserOnline(isOnline)
// //       })
// //     }
// //   }, [toUser])

// //   // Setup socket listeners
// //   useEffect(() => {
// //     socket.on("receive_message", handleReceiveMessage)
// //     socket.on("message_sent", handleMessageSent)
// //     socket.on("message_read_status", handleReadStatus)
// //     socket.on("message_delivered_status", handleDeliveryStatus)
// //     socket.on("user_typing", handleTyping)

// //     // Call event listeners
// //     socket.on("incoming-call", handleIncomingCall)
// //     socket.on("call-accepted", handleCallAccepted)
// //     socket.on("call-rejected", handleCallRejected)
// //     socket.on("call-ended", handleCallEnded)
// //     socket.on("webrtc-offer", handleWebRTCOffer)
// //     socket.on("webrtc-answer", handleWebRTCAnswer)
// //     socket.on("webrtc-ice-candidate", handleWebRTCIceCandidate)
// //     socket.on("call-failed", handleCallFailed)

// //     if (currentUser?._id && toUser?._id) {
// //       const roomId = [currentUser._id, toUser._id].sort().join("_")
// //       socket.emit("join_room", { roomId })
// //     }

// //     checkUserOnline()
// //     const interval = setInterval(checkUserOnline, 30000)

// //     return () => {
// //       socket.off("receive_message", handleReceiveMessage)
// //       socket.off("message_sent", handleMessageSent)
// //       socket.off("message_read_status", handleReadStatus)
// //       socket.off("message_delivered_status", handleDeliveryStatus)
// //       socket.off("user_typing", handleTyping)
// //       socket.off("incoming-call", handleIncomingCall)
// //       socket.off("call-accepted", handleCallAccepted)
// //       socket.off("call-rejected", handleCallRejected)
// //       socket.off("call-ended", handleCallEnded)
// //       socket.off("webrtc-offer", handleWebRTCOffer)
// //       socket.off("webrtc-answer", handleWebRTCAnswer)
// //       socket.off("webrtc-ice-candidate", handleWebRTCIceCandidate)
// //       socket.off("call-failed", handleCallFailed)
// //       clearInterval(interval)
// //       if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
// //     }
// //   }, [
// //     handleReceiveMessage,
// //     handleMessageSent,
// //     handleReadStatus,
// //     handleDeliveryStatus,
// //     handleTyping,
// //     handleIncomingCall,
// //     handleCallAccepted,
// //     handleCallRejected,
// //     handleCallEnded,
// //     handleWebRTCOffer,
// //     handleWebRTCAnswer,
// //     handleWebRTCIceCandidate,
// //     handleCallFailed,
// //     checkUserOnline,
// //     currentUser,
// //     toUser,
// //   ])

// //   const handleSend = () => {
// //     if (!input.trim() || !toUser?._id || !currentUser?._id) return

// //     const tempId = Math.random().toString(36).substring(7)
// //     const messageData = {
// //       toUserId: toUser._id,
// //       message: input,
// //       timestamp: new Date(),
// //     }

// //     setMessages((prev) => [
// //       ...prev,
// //       {
// //         _id: tempId,
// //         message: input,
// //         fromUserId: currentUser._id,
// //         toUserId: toUser._id,
// //         type: "sent",
// //         isDelivered: isUserOnline,
// //         isRead: false,
// //         timestamp: new Date(),
// //       },
// //     ])

// //     setInput("")
// //     socket.emit("send_message", messageData)
// //   }

// //   const handleTypingInput = (e) => {
// //     setInput(e.target.value)
// //     if (toUser?._id) {
// //       socket.emit("typing", { toUserId: toUser._id })
// //     }
// //   }

// //   useEffect(() => {
// //     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
// //   }, [messages])

// //   useEffect(() => {
// //     if (isTyping) {
// //       const timeout = setTimeout(() => {
// //         setIsTyping(false)
// //       }, 5000)
// //       return () => clearTimeout(timeout)
// //     }
// //   }, [messages])

// //   const handleKeyPress = (e) => {
// //     if (e.key === "Enter") {
// //       handleSend()
// //     }
// //   }

// //   const getMessageStatus = (msg) => {
// //     if (msg.type !== "sent") return null

// //     if (msg.isRead) {
// //       return (
// //         <span className="text-white-400" title="Read">
// //           ✓✓
// //         </span>
// //       )
// //     } else if (msg.isDelivered) {
// //       return (
// //         <span className="text-gray-300" title="Delivered">
// //           ✓✓
// //         </span>
// //       )
// //     } else {
// //       return (
// //         <span className="text-gray-400" title="Sent">
// //           ✓
// //         </span>
// //       )
// //     }
// //   }

// //   if (error) {
// //     return (
// //       <div className="flex flex-col h-full w-full p-6 items-center justify-center">
// //         <div className="text-center">
// //           <p className="text-red-600 mb-4">{error}</p>
// //           <button
// //             onClick={() => window.location.reload()}
// //             className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
// //           >
// //             Retry
// //           </button>
// //         </div>
// //       </div>
// //     )
// //   }

// //   return (
// //     <div className="flex flex-col h-full w-full p-6 relative">
// //       {/* Video Call Modal */}
// //       <VideoCallModal
// //         callState={callState}
// //         chatUser={toUser}
// //         localVideoRef={localVideoRef}
// //         remoteVideoRef={remoteVideoRef}
// //         onAcceptCall={acceptCall}
// //         onRejectCall={rejectCall}
// //         onEndCall={endCall}
// //         isCallConnected={isCallConnected}
// //         callDuration={callDuration}
// //         formatCallDuration={formatCallDuration}
// //         isMuted={isMuted}
// //         isVideoEnabled={isVideoEnabled}
// //         toggleMute={toggleMute}
// //         toggleVideo={toggleVideo}
// //       />

// //       {/* Voice Modal */}
// //       <VoiceModal
// //         isOpen={showVoiceModal}
// //         onClose={handleVoiceModalClose}
// //         isListening={isListening}
// //         transcript={transcript}
// //         onStartListening={startListening}
// //         onStopListening={stopListening}
// //       />

// //       {/* Chat Header */}
// //       <div className="mb-4 flex justify-between items-center">
// //         <div className="flex items-center gap-3">
// //           <img
// //             src={toUser?.profilePic || "/placeholder.svg?height=40&width=40"}
// //             alt={toUser?.name}
// //             className="w-10 h-10 rounded-full object-cover"
// //           />
// //           <div>
// //             <h1 className="text-xl font-bold">{toUser?.name || "..."}</h1>
// //             <p className="text-sm text-gray-500">{isTyping ? "Typing..." : isUserOnline ? "Online" : "Offline"}</p>
// //           </div>
// //         </div>

// //         {/* Call Buttons */}
// //         <div className="flex gap-2">
// //           <button
// //             onClick={() => startCall("audio")}
// //             disabled={callState.isInCall || callState.isInitiating || callState.isReceiving}
// //             className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
// //             title="Voice Call"
// //           >
// //             <Phone size={20} />
// //           </button>
// //           <button
// //             onClick={() => startCall("video")}
// //             disabled={callState.isInCall || callState.isInitiating || callState.isReceiving}
// //             className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
// //             title="Video Call"
// //           >
// //             <Video size={20} />
// //           </button>
// //           <button
// //             onClick={handleVoiceModalOpen}
// //             className="p-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 flex items-center gap-2"
// //             title="Voice Message"
// //           >
// //             <Mic size={20} />
// //           </button>
// //         </div>
// //       </div>

// //       {/* Messages */}
// //       <div className="flex-1 overflow-y-auto mb-4 border rounded p-4 bg-white">
// //         {(() => {
// //           const groupedMessages = groupMessagesByDate(messages)
// //           const dateGroups = Object.keys(groupedMessages)

// //           return dateGroups.map((dateGroup, groupIndex) => (
// //             <div key={dateGroup}>
// //               {/* Date Separator */}
// //               <div className="flex items-center justify-center my-4">
// //                 <div className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full border">{dateGroup}</div>
// //               </div>

// //               {/* Messages for this date */}
// //               {groupedMessages[dateGroup].map((msg) => (
// //                 <div
// //                   key={msg._id}
// //                   className={`mb-3 max-w-xs px-4 py-2 rounded-lg relative ${
// //                     msg.type === "sent" ? "bg-green-500 text-white self-end ml-auto" : "bg-gray-200 text-black"
// //                   }`}
// //                 >
// //                   <div className="flex justify-between items-start gap-2">
// //                     <span className="break-words">{msg.message}</span>
// //                   </div>
// //                   <div className="flex items-center justify-end gap-1 mt-1">
// //                     <span className="text-xs opacity-70">{formatMessageTime(msg.timestamp)}</span>
// //                     {msg.type === "sent" && <span className="text-xs flex items-center">{getMessageStatus(msg)}</span>}
// //                   </div>
// //                 </div>
// //               ))}
// //             </div>
// //           ))
// //         })()}
// //         <div ref={messagesEndRef} />
// //       </div>

// //       {/* Message Input */}
// //       <div className="flex gap-2">
// //         <input
// //           type="text"
// //           placeholder="Type your message"
// //           value={input}
// //           onChange={handleTypingInput}
// //           onKeyPress={handleKeyPress}
// //           className="flex-1 border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
// //           disabled={callState.isInCall}
// //         />
// //         <button
// //           onClick={handleSend}
// //           disabled={!input.trim() || callState.isInCall}
// //           className={`px-4 py-2 rounded ${
// //             input.trim() && !callState.isInCall
// //               ? "bg-blue-600 text-white hover:bg-blue-700"
// //               : "bg-gray-300 text-gray-500 cursor-not-allowed"
// //           }`}
// //         >
// //           Send
// //         </button>
// //       </div>
// //     </div>
// //   )
// // }

// // export default Chat


// "use client"

// import { useEffect, useState, useRef, useCallback } from "react"
// import { useParams } from "react-router-dom"
// import axios from "axios"
// import socket from "../../socket"
// import VideoCallModal from "./Videomodel"
// import VoiceModal from "./Voice-model"
// import { Phone, Video, Mic } from "lucide-react"

// function Chat({ currentUser: propCurrentUser }) {
//   const { id } = useParams()
//   const [messages, setMessages] = useState([])
//   const [input, setInput] = useState("")
//   const [currentUser, setCurrentUser] = useState(propCurrentUser)
//   const [toUser, setToUser] = useState(null)
//   const [isUserOnline, setIsUserOnline] = useState(false)
//   const [isTyping, setIsTyping] = useState(false)
//   const [isWindowFocused, setIsWindowFocused] = useState(true)
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState(null)

//   // Enhanced call-related states
//   const [callState, setCallState] = useState({
//     isInCall: false,
//     isInitiating: false,
//     isReceiving: false,
//     callType: null,
//     remoteUserId: null,
//   })
//   const [isCallConnected, setIsCallConnected] = useState(false)
//   const [isMuted, setIsMuted] = useState(false)
//   const [isVideoEnabled, setIsVideoEnabled] = useState(true)
//   const [callDuration, setCallDuration] = useState(0)

//   // Voice modal states
//   const [showVoiceModal, setShowVoiceModal] = useState(false)
//   const [isListening, setIsListening] = useState(false)
//   const [transcript, setTranscript] = useState("")
//   const [recognition, setRecognition] = useState(null)

//   // Refs
//   const typingTimeoutRef = useRef(null)
//   const messagesEndRef = useRef(null)
//   const unreadMessagesRef = useRef(new Set())
//   const localVideoRef = useRef(null)
//   const remoteVideoRef = useRef(null)
//   const peerConnectionRef = useRef(null)
//   const localStreamRef = useRef(null)
//   const callTimerRef = useRef(null)
//   const connectionTimeoutRef = useRef(null)

//   // WebRTC configuration with multiple STUN servers
//   const rtcConfiguration = {
//     iceServers: [
//       { urls: "stun:stun.l.google.com:19302" },
//       { urls: "stun:stun1.l.google.com:19302" },
//       { urls: "stun:stun2.l.google.com:19302" },
//       { urls: "stun:stun3.l.google.com:19302" },
//       { urls: "stun:stun4.l.google.com:19302" },
//     ],
//     iceCandidatePoolSize: 10,
//   }

//   // Group messages by date and format time
//   const getDateGroup = (timestamp) => {
//     const now = new Date()
//     const messageDate = new Date(timestamp)
//     const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
//     const msgDate = new Date(messageDate.getFullYear(), messageDate.getMonth(), messageDate.getDate())
//     const daysDiff = Math.floor((today.getTime() - msgDate.getTime()) / (1000 * 60 * 60 * 24))

//     if (daysDiff === 0) {
//       return "Today"
//     } else if (daysDiff === 1) {
//       return "Yesterday"
//     } else if (daysDiff < 7) {
//       const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
//       return dayNames[messageDate.getDay()]
//     } else {
//       return messageDate.toLocaleDateString([], {
//         weekday: "long",
//         month: "long",
//         day: "numeric",
//         year: messageDate.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
//       })
//     }
//   }

//   const formatMessageTime = (timestamp) => {
//     const messageTime = new Date(timestamp)
//     return messageTime.toLocaleTimeString([], {
//       hour: "2-digit",
//       minute: "2-digit",
//     })
//   }

//   const groupMessagesByDate = (messages) => {
//     const groups = {}
//     messages.forEach((message) => {
//       const dateGroup = getDateGroup(message.timestamp)
//       if (!groups[dateGroup]) {
//         groups[dateGroup] = []
//       }
//       groups[dateGroup].push(message)
//     })
//     return groups
//   }

//   // Track window focus for read receipts
//   useEffect(() => {
//     const handleFocus = () => setIsWindowFocused(true)
//     const handleBlur = () => setIsWindowFocused(false)

//     window.addEventListener("focus", handleFocus)
//     window.addEventListener("blur", handleBlur)

//     return () => {
//       window.removeEventListener("focus", handleFocus)
//       window.removeEventListener("blur", handleBlur)
//     }
//   }, [])

//   const roomId = currentUser && toUser ? [currentUser._id, toUser._id].sort().join("_") : null

//   // Mark messages as read when window is focused and user is in chat
//   useEffect(() => {
//     if (isWindowFocused && messages.length && currentUser?._id && toUser?._id && roomId) {
//       messages.forEach((msg) => {
//         if (
//           msg.type === "received" &&
//           !msg.isRead &&
//           msg._id &&
//           msg.fromUserId === toUser._id &&
//           !unreadMessagesRef.current.has(msg._id)
//         ) {
//           unreadMessagesRef.current.add(msg._id)
//           socket.emit("read_message", {
//             messageId: msg._id,
//             fromUserId: msg.fromUserId,
//             toUserId: currentUser._id,
//           })
//         }
//       })
//     }
//   }, [isWindowFocused, messages, currentUser, toUser, roomId])

//   // Initialize speech recognition
//   useEffect(() => {
//     if (typeof window !== "undefined" && ("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
//       const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
//       const recognitionInstance = new SpeechRecognition()

//       recognitionInstance.continuous = true
//       recognitionInstance.interimResults = true
//       recognitionInstance.lang = "en-US"

//       recognitionInstance.onresult = (event) => {
//         let finalTranscript = ""
//         let interimTranscript = ""

//         for (let i = event.resultIndex; i < event.results.length; i++) {
//           const transcript = event.results[i][0].transcript
//           if (event.results[i].isFinal) {
//             finalTranscript += transcript
//           } else {
//             interimTranscript += transcript
//           }
//         }

//         setTranscript(finalTranscript + interimTranscript)
//       }

//       recognitionInstance.onend = () => {
//         setIsListening(false)
//       }

//       recognitionInstance.onerror = (event) => {
//         console.error("Speech recognition error:", event.error)
//         setIsListening(false)
//         if (event.error === "not-allowed") {
//           alert("Microphone access was denied. Please allow microphone access in your browser settings.")
//         }
//       }

//       setRecognition(recognitionInstance)
//     }
//   }, [])

//   // Initial data fetch
//   useEffect(() => {
//     const fetchInitialData = async () => {
//       const token = localStorage.getItem("token")
//       if (!token) {
//         setError("No authentication token found")
//         setLoading(false)
//         return
//       }

//       try {
//         setLoading(true)
//         setError(null)

//         const res = await axios.get("https://chat-be-v2eh.onrender.com/api/user/users", {
//           headers: { Authorization: `Bearer ${token}` },
//         })

//         const responseData = res.data

//         if (!responseData.success) {
//           throw new Error("Failed to fetch users")
//         }

//         const receiver = responseData.users?.find((u) => u._id === id)
//         const userData = responseData.currentUser

//         setCurrentUser(userData)
//         setToUser(receiver)

//         if (!receiver) {
//           setError("User not found")
//           setLoading(false)
//           return
//         }

//         if (userData && receiver) {
//           const messageRes = await axios.get(`https://chat-be-v2eh.onrender.com/api/chat/message/${id}`, {
//             headers: { Authorization: `Bearer ${token}` },
//           })

//           const formattedMessages = messageRes.data.map((msg) => ({
//             ...msg,
//             type: msg.fromUserId === userData._id ? "sent" : "received",
//           }))

//           setMessages(formattedMessages)

//           if (isWindowFocused) {
//             const unreadReceived = formattedMessages.filter((msg) => msg.type === "received" && !msg.isRead && msg._id)

//             unreadReceived.forEach((msg) => {
//               socket.emit("read_message", {
//                 messageId: msg._id,
//                 fromUserId: msg.fromUserId,
//                 toUserId: userData._id,
//               })
//             })
//           }
//         }
//       } catch (error) {
//         console.error("Error fetching users/messages:", error)
//         setError(error.response?.data?.message || "Failed to load chat data")

//         if (error.response?.status === 401) {
//           localStorage.removeItem("token")
//           window.location.href = "/login"
//         }
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchInitialData()

//     return () => {
//       if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
//       if (callTimerRef.current) clearInterval(callTimerRef.current)
//       if (connectionTimeoutRef.current) clearTimeout(connectionTimeoutRef.current)
//     }
//   }, [id, isWindowFocused])

//   // WebRTC Functions
//   const createPeerConnection = useCallback(() => {
//     console.log("🔧 Creating new peer connection")
//     const pc = new RTCPeerConnection(rtcConfiguration)

//     pc.onicecandidate = (event) => {
//       if (event.candidate) {
//         console.log("🧊 Sending ICE candidate:", event.candidate)
//         socket.emit("ice-candidate", {
//           to: callState.remoteUserId || toUser._id,
//           candidate: event.candidate,
//         })
//       } else {
//         console.log("🧊 ICE gathering complete")
//       }
//     }

//     pc.ontrack = (event) => {
//       console.log("📺 Received remote track:", event.track.kind)
//       if (remoteVideoRef.current && event.streams[0]) {
//         console.log("📺 Setting remote stream")
//         remoteVideoRef.current.srcObject = event.streams[0]
//         remoteVideoRef.current.play().catch((e) => console.error("Remote video play error:", e))
//       }
//     }

//     pc.onconnectionstatechange = () => {
//       console.log("🔗 Connection state changed:", pc.connectionState)
//       if (pc.connectionState === "connected") {
//         setIsCallConnected(true)
//         startCallTimer()
//         if (connectionTimeoutRef.current) {
//           clearTimeout(connectionTimeoutRef.current)
//           connectionTimeoutRef.current = null
//         }
//       } else if (pc.connectionState === "failed" || pc.connectionState === "disconnected") {
//         console.log("❌ Connection failed/disconnected")
//         endCall()
//       }
//     }

//     pc.oniceconnectionstatechange = () => {
//       console.log("🧊 ICE connection state:", pc.iceConnectionState)
//       if (pc.iceConnectionState === "failed") {
//         console.log("🔄 ICE failed, restarting...")
//         pc.restartIce()
//       }
//     }

//     return pc
//   }, [callState.remoteUserId, toUser])

//   const startCallTimer = () => {
//     setCallDuration(0)
//     callTimerRef.current = setInterval(() => {
//       setCallDuration((prev) => prev + 1)
//     }, 1000)
//   }

//   const formatCallDuration = (seconds) => {
//     const mins = Math.floor(seconds / 60)
//     const secs = seconds % 60
//     return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
//   }

//   const startCall = async (callType) => {
//     try {
//       console.log(`📞 Starting ${callType} call to:`, toUser._id)

//       if (!toUser?._id || !currentUser?._id) {
//         alert("User information not available")
//         return
//       }

//       // Check if user is online
//       if (!isUserOnline) {
//         alert("User is currently offline")
//         return
//       }

//       setCallState({
//         isInCall: false,
//         isInitiating: true,
//         isReceiving: false,
//         callType,
//         remoteUserId: toUser._id,
//       })

//       // Get user media
//       const constraints = {
//         audio: true,
//         video: callType === "video" ? { width: 1280, height: 720, facingMode: "user" } : false,
//       }

//       console.log("🎥 Getting user media with constraints:", constraints)
//       const stream = await navigator.mediaDevices.getUserMedia(constraints)
//       localStreamRef.current = stream

//       if (localVideoRef.current) {
//         localVideoRef.current.srcObject = stream
//         localVideoRef.current.muted = true
//         localVideoRef.current.play().catch((e) => console.error("Local video play error:", e))
//       }

//       // Create peer connection
//       const pc = createPeerConnection()
//       peerConnectionRef.current = pc

//       // Add tracks to peer connection
//       stream.getTracks().forEach((track) => {
//         console.log("➕ Adding track:", track.kind)
//         pc.addTrack(track, stream)
//       })

//       // Set connection timeout
//       connectionTimeoutRef.current = setTimeout(() => {
//         console.log("⏰ Call connection timeout")
//         alert("Call connection timeout. Please try again.")
//         endCall()
//       }, 30000)

//       // Emit call initiation
//       console.log("📤 Emitting call initiation")
//       socket.emit("call-initiate", {
//         to: toUser._id,
//         from: currentUser._id,
//         callType,
//       })
//     } catch (error) {
//       console.error("❌ Error starting call:", error)
//       if (error.name === "NotAllowedError") {
//         alert("Camera/microphone access denied. Please allow access and try again.")
//       } else if (error.name === "NotFoundError") {
//         alert("Camera/microphone not found. Please check your devices.")
//       } else {
//         alert("Failed to start call: " + error.message)
//       }
//       endCall()
//     }
//   }

//   const acceptCall = async () => {
//     try {
//       console.log("✅ Accepting call")

//       const constraints = {
//         audio: true,
//         video: callState.callType === "video" ? { width: 1280, height: 720, facingMode: "user" } : false,
//       }

//       const stream = await navigator.mediaDevices.getUserMedia(constraints)
//       localStreamRef.current = stream

//       if (localVideoRef.current) {
//         localVideoRef.current.srcObject = stream
//         localVideoRef.current.muted = true
//         localVideoRef.current.play().catch((e) => console.error("Local video play error:", e))
//       }

//       const pc = createPeerConnection()
//       peerConnectionRef.current = pc

//       stream.getTracks().forEach((track) => {
//         console.log("➕ Adding track:", track.kind)
//         pc.addTrack(track, stream)
//       })

//       setCallState((prev) => ({
//         ...prev,
//         isReceiving: false,
//         isInCall: true,
//       }))

//       socket.emit("call-accept", {
//         to: callState.remoteUserId,
//         from: currentUser._id,
//       })
//     } catch (error) {
//       console.error("❌ Error accepting call:", error)
//       alert("Failed to accept call: " + error.message)
//       rejectCall()
//     }
//   }

//   const rejectCall = () => {
//     console.log("❌ Rejecting call")
//     socket.emit("call-reject", {
//       to: callState.remoteUserId,
//       from: currentUser._id,
//     })
//     endCall()
//   }

//   const endCall = () => {
//     console.log("📞 Ending call")

//     // Clear timeouts
//     if (connectionTimeoutRef.current) {
//       clearTimeout(connectionTimeoutRef.current)
//       connectionTimeoutRef.current = null
//     }

//     if (callTimerRef.current) {
//       clearInterval(callTimerRef.current)
//       callTimerRef.current = null
//     }

//     // Stop local stream
//     if (localStreamRef.current) {
//       localStreamRef.current.getTracks().forEach((track) => {
//         track.stop()
//         console.log("🛑 Stopped track:", track.kind)
//       })
//       localStreamRef.current = null
//     }

//     // Close peer connection
//     if (peerConnectionRef.current) {
//       peerConnectionRef.current.close()
//       peerConnectionRef.current = null
//     }

//     // Clear video elements
//     if (localVideoRef.current) {
//       localVideoRef.current.srcObject = null
//     }
//     if (remoteVideoRef.current) {
//       remoteVideoRef.current.srcObject = null
//     }

//     // Emit call end
//     if (callState.isInCall || callState.isInitiating) {
//       socket.emit("call-end", {
//         to: callState.remoteUserId || toUser._id,
//         from: currentUser._id,
//       })
//     }

//     // Reset states
//     setCallState({
//       isInCall: false,
//       isInitiating: false,
//       isReceiving: false,
//       callType: null,
//       remoteUserId: null,
//     })
//     setIsCallConnected(false)
//     setCallDuration(0)
//     setIsMuted(false)
//     setIsVideoEnabled(true)
//   }

//   const toggleMute = () => {
//     if (localStreamRef.current) {
//       const audioTrack = localStreamRef.current.getAudioTracks()[0]
//       if (audioTrack) {
//         audioTrack.enabled = !audioTrack.enabled
//         setIsMuted(!audioTrack.enabled)
//       }
//     }
//   }

//   const toggleVideo = () => {
//     if (localStreamRef.current) {
//       const videoTrack = localStreamRef.current.getVideoTracks()[0]
//       if (videoTrack) {
//         videoTrack.enabled = !videoTrack.enabled
//         setIsVideoEnabled(videoTrack.enabled)
//       }
//     }
//   }

//   // WebRTC signaling handlers
//   const handleCallOffer = useCallback(
//     async ({ from, callType }) => {
//       console.log("📞 Incoming call from:", from, "Type:", callType)
//       if (from === toUser?._id) {
//         setCallState({
//           isInCall: false,
//           isInitiating: false,
//           isReceiving: true,
//           callType,
//           remoteUserId: from,
//         })
//       }
//     },
//     [toUser],
//   )

//   const handleCallAccept = useCallback(
//     async ({ from }) => {
//       console.log("✅ Call accepted by:", from)
//       if (from === toUser?._id) {
//         setCallState((prev) => ({
//           ...prev,
//           isInitiating: false,
//           isInCall: true,
//         }))

//         // Create and send offer
//         try {
//           const offer = await peerConnectionRef.current.createOffer({
//             offerToReceiveAudio: true,
//             offerToReceiveVideo: callState.callType === "video",
//           })
//           await peerConnectionRef.current.setLocalDescription(offer)

//           console.log("📤 Sending offer")
//           socket.emit("webrtc-offer", {
//             to: from,
//             offer: offer,
//           })
//         } catch (error) {
//           console.error("❌ Error creating offer:", error)
//           endCall()
//         }
//       }
//     },
//     [toUser, callState.callType],
//   )

//   const handleCallReject = useCallback(
//     ({ from }) => {
//       console.log("❌ Call rejected by:", from)
//       if (from === toUser?._id) {
//         endCall()
//       }
//     },
//     [toUser],
//   )

//   const handleCallEnd = useCallback(
//     ({ from }) => {
//       console.log("📞 Call ended by:", from)
//       if (from === toUser?._id) {
//         endCall()
//       }
//     },
//     [toUser],
//   )

//   const handleWebRTCOffer = useCallback(
//     async ({ from, offer }) => {
//       console.log("📡 Received WebRTC offer from:", from)
//       if (from === toUser?._id && peerConnectionRef.current) {
//         try {
//           await peerConnectionRef.current.setRemoteDescription(offer)
//           const answer = await peerConnectionRef.current.createAnswer()
//           await peerConnectionRef.current.setLocalDescription(answer)

//           console.log("📤 Sending answer")
//           socket.emit("webrtc-answer", {
//             to: from,
//             answer: answer,
//           })
//         } catch (error) {
//           console.error("❌ Error handling offer:", error)
//           endCall()
//         }
//       }
//     },
//     [toUser],
//   )

//   const handleWebRTCAnswer = useCallback(
//     async ({ from, answer }) => {
//       console.log("📡 Received WebRTC answer from:", from)
//       if (from === toUser?._id && peerConnectionRef.current) {
//         try {
//           await peerConnectionRef.current.setRemoteDescription(answer)
//         } catch (error) {
//           console.error("❌ Error handling answer:", error)
//           endCall()
//         }
//       }
//     },
//     [toUser],
//   )

//   const handleIceCandidate = useCallback(
//     async ({ from, candidate }) => {
//       console.log("🧊 Received ICE candidate from:", from)
//       if (from === toUser?._id && peerConnectionRef.current) {
//         try {
//           await peerConnectionRef.current.addIceCandidate(candidate)
//         } catch (error) {
//           console.error("❌ Error adding ICE candidate:", error)
//         }
//       }
//     },
//     [toUser],
//   )

//   // Voice recognition functions
//   const startListening = () => {
//     if (recognition) {
//       setTranscript("")
//       recognition.start()
//       setIsListening(true)
//     } else {
//       alert("Speech recognition is not supported in your browser")
//     }
//   }

//   const stopListening = () => {
//     if (recognition) {
//       recognition.stop()
//       setIsListening(false)

//       setTimeout(() => {
//         if (transcript.trim() && socket) {
//           const messageData = {
//             toUserId: toUser._id,
//             message: transcript.trim(),
//             timestamp: new Date(),
//           }

//           const tempId = Math.random().toString(36).substring(7)
//           setMessages((prev) => [
//             ...prev,
//             {
//               _id: tempId,
//               message: transcript.trim(),
//               fromUserId: currentUser._id,
//               toUserId: toUser._id,
//               type: "sent",
//               isDelivered: isUserOnline,
//               isRead: false,
//               timestamp: new Date(),
//             },
//           ])

//           socket.emit("send_message", messageData)
//           setShowVoiceModal(false)
//           setTranscript("")
//         }
//       }, 300)
//     }
//   }

//   const handleVoiceModalOpen = () => {
//     setShowVoiceModal(true)
//     setTranscript("")
//   }

//   const handleVoiceModalClose = () => {
//     setShowVoiceModal(false)
//     stopListening()
//     setTranscript("")
//   }

//   // Handle received messages
//   const handleReceiveMessage = useCallback(
//     (data) => {
//       if (!currentUser) return

//       const type = data.fromUserId === currentUser._id ? "sent" : "received"

//       setMessages((prev) => {
//         const existingIndex = prev.findIndex(
//           (msg) =>
//             msg.fromUserId === currentUser._id &&
//             typeof msg._id === "string" &&
//             msg._id.length < 24 &&
//             msg.message === data.message,
//         )

//         if (existingIndex >= 0) {
//           const newMessages = [...prev]
//           newMessages[existingIndex] = { ...data, type }
//           return newMessages
//         }

//         if (prev.some((msg) => msg._id === data._id)) return prev

//         return [...prev, { ...data, type }]
//       })

//       if (type === "received" && isWindowFocused) {
//         setTimeout(() => {
//           socket.emit("read_message", {
//             messageId: data._id,
//             fromUserId: data.fromUserId,
//             toUserId: currentUser._id,
//           })
//         }, 100)
//       }
//     },
//     [currentUser, isWindowFocused],
//   )

//   const handleMessageSent = useCallback(
//     (data) => {
//       setMessages((prev) =>
//         prev.map((msg) =>
//           msg.fromUserId === currentUser?._id && typeof msg._id === "string" && msg._id.length < 24
//             ? { ...data, type: "sent" }
//             : msg,
//         ),
//       )
//     },
//     [currentUser],
//   )

//   const handleReadStatus = useCallback((data) => {
//     const { messageId, isRead, readBy } = data

//     setMessages((prev) =>
//       prev.map((msg) => {
//         if (msg._id === messageId) {
//           if (isRead) {
//             unreadMessagesRef.current.delete(messageId)
//           }
//           return { ...msg, isRead, readBy }
//         }
//         return msg
//       }),
//     )
//   }, [])

//   const handleDeliveryStatus = useCallback((data) => {
//     const { messageId, isDelivered } = data
//     setMessages((prev) => prev.map((msg) => (msg._id === messageId ? { ...msg, isDelivered } : msg)))
//   }, [])

//   const handleTyping = useCallback(
//     ({ fromUserId }) => {
//       if (fromUserId === id) {
//         setIsTyping(true)
//         if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
//         typingTimeoutRef.current = setTimeout(() => setIsTyping(false), 2000)
//       }
//     },
//     [id],
//   )

//   const checkUserOnline = useCallback(() => {
//     if (toUser?._id) {
//       socket.emit("check_user_online", { toUserId: toUser._id }, ({ isOnline }) => {
//         setIsUserOnline(isOnline)
//       })
//     }
//   }, [toUser])

//   // Setup socket listeners
//   useEffect(() => {
//     socket.on("receive_message", handleReceiveMessage)
//     socket.on("message_sent", handleMessageSent)
//     socket.on("message_read_status", handleReadStatus)
//     socket.on("message_delivered_status", handleDeliveryStatus)
//     socket.on("user_typing", handleTyping)

//     // Call event listeners
//     socket.on("call-offer", handleCallOffer)
//     socket.on("call-accept", handleCallAccept)
//     socket.on("call-reject", handleCallReject)
//     socket.on("call-end", handleCallEnd)
//     socket.on("webrtc-offer", handleWebRTCOffer)
//     socket.on("webrtc-answer", handleWebRTCAnswer)
//     socket.on("ice-candidate", handleIceCandidate)

//     if (currentUser?._id && toUser?._id) {
//       const roomId = [currentUser._id, toUser._id].sort().join("_")
//       socket.emit("join_room", { roomId })
//     }

//     checkUserOnline()
//     const interval = setInterval(checkUserOnline, 30000)

//     return () => {
//       socket.off("receive_message", handleReceiveMessage)
//       socket.off("message_sent", handleMessageSent)
//       socket.off("message_read_status", handleReadStatus)
//       socket.off("message_delivered_status", handleDeliveryStatus)
//       socket.off("user_typing", handleTyping)
//       socket.off("call-offer", handleCallOffer)
//       socket.off("call-accept", handleCallAccept)
//       socket.off("call-reject", handleCallReject)
//       socket.off("call-end", handleCallEnd)
//       socket.off("webrtc-offer", handleWebRTCOffer)
//       socket.off("webrtc-answer", handleWebRTCAnswer)
//       socket.off("ice-candidate", handleIceCandidate)
//       clearInterval(interval)
//       if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
//     }
//   }, [
//     handleReceiveMessage,
//     handleMessageSent,
//     handleReadStatus,
//     handleDeliveryStatus,
//     handleTyping,
//     handleCallOffer,
//     handleCallAccept,
//     handleCallReject,
//     handleCallEnd,
//     handleWebRTCOffer,
//     handleWebRTCAnswer,
//     handleIceCandidate,
//     checkUserOnline,
//     currentUser,
//     toUser,
//   ])

//   const handleSend = () => {
//     if (!input.trim() || !toUser?._id || !currentUser?._id) return

//     const tempId = Math.random().toString(36).substring(7)
//     const messageData = {
//       toUserId: toUser._id,
//       message: input,
//       timestamp: new Date(),
//     }

//     setMessages((prev) => [
//       ...prev,
//       {
//         _id: tempId,
//         message: input,
//         fromUserId: currentUser._id,
//         toUserId: toUser._id,
//         type: "sent",
//         isDelivered: isUserOnline,
//         isRead: false,
//         timestamp: new Date(),
//       },
//     ])

//     setInput("")
//     socket.emit("send_message", messageData)
//   }

//   const handleTypingInput = (e) => {
//     setInput(e.target.value)
//     if (toUser?._id) {
//       socket.emit("typing", { toUserId: toUser._id })
//     }
//   }

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
//   }, [messages])

//   useEffect(() => {
//     if (isTyping) {
//       const timeout = setTimeout(() => {
//         setIsTyping(false)
//       }, 5000)
//       return () => clearTimeout(timeout)
//     }
//   }, [messages])

//   const handleKeyPress = (e) => {
//     if (e.key === "Enter") {
//       handleSend()
//     }
//   }

//   const getMessageStatus = (msg) => {
//     if (msg.type !== "sent") return null

//     if (msg.isRead) {
//       return (
//         <span className="text-white-400" title="Read">
//           ✓✓
//         </span>
//       )
//     } else if (msg.isDelivered) {
//       return (
//         <span className="text-gray-300" title="Delivered">
//           ✓✓
//         </span>
//       )
//     } else {
//       return (
//         <span className="text-gray-400" title="Sent">
//           ✓
//         </span>
//       )
//     }
//   }

//   if (error) {
//     return (
//       <div className="flex flex-col h-full w-full p-6 items-center justify-center">
//         <div className="text-center">
//           <p className="text-red-600 mb-4">{error}</p>
//           <button
//             onClick={() => window.location.reload()}
//             className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
//           >
//             Retry
//           </button>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="flex flex-col h-full w-full p-6 relative">
//       {/* Video Call Modal */}
//       <VideoCallModal
//         callState={callState}
//         chatUser={toUser}
//         localVideoRef={localVideoRef}
//         remoteVideoRef={remoteVideoRef}
//         onAcceptCall={acceptCall}
//         onRejectCall={rejectCall}
//         onEndCall={endCall}
//         isCallConnected={isCallConnected}
//         callDuration={callDuration}
//         formatCallDuration={formatCallDuration}
//         isMuted={isMuted}
//         isVideoEnabled={isVideoEnabled}
//         toggleMute={toggleMute}
//         toggleVideo={toggleVideo}
//       />

//       {/* Voice Modal */}
//       <VoiceModal
//         isOpen={showVoiceModal}
//         onClose={handleVoiceModalClose}
//         isListening={isListening}
//         transcript={transcript}
//         onStartListening={startListening}
//         onStopListening={stopListening}
//       />

//       {/* Chat Header */}
//       <div className="mb-4 flex justify-between items-center">
//         <div className="flex items-center gap-3">
//           <img
//             src={toUser?.profilePic || "/placeholder.svg?height=40&width=40"}
//             alt={toUser?.name}
//             className="w-10 h-10 rounded-full object-cover"
//           />
//           <div>
//             <h1 className="text-xl font-bold">{toUser?.name || "..."}</h1>
//             <p className="text-sm text-gray-500">{isTyping ? "Typing..." : isUserOnline ? "Online" : "Offline"}</p>
//           </div>
//         </div>

//         {/* Call Buttons */}
//         <div className="flex gap-2">
//           <button
//             onClick={() => startCall("audio")}
//             disabled={callState.isInCall || callState.isInitiating || callState.isReceiving}
//             className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
//             title="Voice Call"
//           >
//             <Phone size={20} />
//           </button>
//           <button
//             onClick={() => startCall("video")}
//             disabled={callState.isInCall || callState.isInitiating || callState.isReceiving}
//             className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
//             title="Video Call"
//           >
//             <Video size={20} />
//           </button>
//           <button
//             onClick={handleVoiceModalOpen}
//             className="p-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 flex items-center gap-2"
//             title="Voice Message"
//           >
//             <Mic size={20} />
//           </button>
//         </div>
//       </div>

//       {/* Messages */}
//       <div className="flex-1 overflow-y-auto mb-4 border rounded p-4 bg-white">
//         {(() => {
//           const groupedMessages = groupMessagesByDate(messages)
//           const dateGroups = Object.keys(groupedMessages)

//           return dateGroups.map((dateGroup, groupIndex) => (
//             <div key={dateGroup}>
//               {/* Date Separator */}
//               <div className="flex items-center justify-center my-4">
//                 <div className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full border">{dateGroup}</div>
//               </div>

//               {/* Messages for this date */}
//               {groupedMessages[dateGroup].map((msg) => (
//                 <div
//                   key={msg._id}
//                   className={`mb-3 max-w-xs px-4 py-2 rounded-lg relative ${
//                     msg.type === "sent" ? "bg-green-500 text-white self-end ml-auto" : "bg-gray-200 text-black"
//                   }`}
//                 >
//                   <div className="flex justify-between items-start gap-2">
//                     <span className="break-words">{msg.message}</span>
//                   </div>
//                   <div className="flex items-center justify-end gap-1 mt-1">
//                     <span className="text-xs opacity-70">{formatMessageTime(msg.timestamp)}</span>
//                     {msg.type === "sent" && <span className="text-xs flex items-center">{getMessageStatus(msg)}</span>}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           ))
//         })()}
//         <div ref={messagesEndRef} />
//       </div>

//       {/* Message Input */}
//       <div className="flex gap-2">
//         <input
//           type="text"
//           placeholder="Type your message"
//           value={input}
//           onChange={handleTypingInput}
//           onKeyPress={handleKeyPress}
//           className="flex-1 border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//           disabled={callState.isInCall}
//         />
//         <button
//           onClick={handleSend}
//           disabled={!input.trim() || callState.isInCall}
//           className={`px-4 py-2 rounded ${
//             input.trim() && !callState.isInCall
//               ? "bg-blue-600 text-white hover:bg-blue-700"
//               : "bg-gray-300 text-gray-500 cursor-not-allowed"
//           }`}
//         >
//           Send
//         </button>
//       </div>
//     </div>
//   )
// }

// export default Chat


"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import { useParams } from "react-router-dom"
import axios from "axios"
import socket from "../../socket"
import VideoCallModal from "./Videomodel"
import VoiceModal from "./Voice-model"
import { Phone, Video, Mic } from "lucide-react"
import SocketTest from "./socket-test"

function Chat({ currentUser: propCurrentUser }) {
  const { id } = useParams()
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")
  const [currentUser, setCurrentUser] = useState(propCurrentUser)
  const [toUser, setToUser] = useState(null)
  const [isUserOnline, setIsUserOnline] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [isWindowFocused, setIsWindowFocused] = useState(true)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Enhanced call-related states
  const [callState, setCallState] = useState({
    isInCall: false,
    isInitiating: false,
    isReceiving: false,
    callType: null,
    remoteUserId: null,
  })
  const [isCallConnected, setIsCallConnected] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoEnabled, setIsVideoEnabled] = useState(true)
  const [callDuration, setCallDuration] = useState(0)

  // Voice modal states
  const [showVoiceModal, setShowVoiceModal] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [recognition, setRecognition] = useState(null)

  // Refs
  const typingTimeoutRef = useRef(null)
  const messagesEndRef = useRef(null)
  const unreadMessagesRef = useRef(new Set())
  const localVideoRef = useRef(null)
  const remoteVideoRef = useRef(null)
  const peerConnectionRef = useRef(null)
  const localStreamRef = useRef(null)
  const callTimerRef = useRef(null)
  const connectionTimeoutRef = useRef(null)

  // WebRTC configuration with multiple STUN servers
  const rtcConfiguration = {
    iceServers: [
      { urls: "stun:stun.l.google.com:19302" },
      { urls: "stun:stun1.l.google.com:19302" },
      { urls: "stun:stun2.l.google.com:19302" },
      { urls: "stun:stun3.l.google.com:19302" },
      { urls: "stun:stun4.l.google.com:19302" },
    ],
    iceCandidatePoolSize: 10,
  }

  // Group messages by date and format time
  const getDateGroup = (timestamp) => {
    const now = new Date()
    const messageDate = new Date(timestamp)
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const msgDate = new Date(messageDate.getFullYear(), messageDate.getMonth(), messageDate.getDate())
    const daysDiff = Math.floor((today.getTime() - msgDate.getTime()) / (1000 * 60 * 60 * 24))

    if (daysDiff === 0) {
      return "Today"
    } else if (daysDiff === 1) {
      return "Yesterday"
    } else if (daysDiff < 7) {
      const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
      return dayNames[messageDate.getDay()]
    } else {
      return messageDate.toLocaleDateString([], {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: messageDate.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
      })
    }
  }

  const formatMessageTime = (timestamp) => {
    const messageTime = new Date(timestamp)
    return messageTime.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const groupMessagesByDate = (messages) => {
    const groups = {}
    messages.forEach((message) => {
      const dateGroup = getDateGroup(message.timestamp)
      if (!groups[dateGroup]) {
        groups[dateGroup] = []
      }
      groups[dateGroup].push(message)
    })
    return groups
  }

  // Track window focus for read receipts
  useEffect(() => {
    const handleFocus = () => setIsWindowFocused(true)
    const handleBlur = () => setIsWindowFocused(false)

    window.addEventListener("focus", handleFocus)
    window.addEventListener("blur", handleBlur)

    return () => {
      window.removeEventListener("focus", handleFocus)
      window.removeEventListener("blur", handleBlur)
    }
  }, [])

  const roomId = currentUser && toUser ? [currentUser._id, toUser._id].sort().join("_") : null

  // Mark messages as read when window is focused and user is in chat
  useEffect(() => {
    if (isWindowFocused && messages.length && currentUser?._id && toUser?._id && roomId) {
      messages.forEach((msg) => {
        if (
          msg.type === "received" &&
          !msg.isRead &&
          msg._id &&
          msg.fromUserId === toUser._id &&
          !unreadMessagesRef.current.has(msg._id)
        ) {
          unreadMessagesRef.current.add(msg._id)
          socket.emit("read_message", {
            messageId: msg._id,
            fromUserId: msg.fromUserId,
            toUserId: currentUser._id,
          })
        }
      })
    }
  }, [isWindowFocused, messages, currentUser, toUser, roomId])

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== "undefined" && ("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      const recognitionInstance = new SpeechRecognition()

      recognitionInstance.continuous = true
      recognitionInstance.interimResults = true
      recognitionInstance.lang = "en-US"

      recognitionInstance.onresult = (event) => {
        let finalTranscript = ""
        let interimTranscript = ""

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript
          if (event.results[i].isFinal) {
            finalTranscript += transcript
          } else {
            interimTranscript += transcript
          }
        }

        setTranscript(finalTranscript + interimTranscript)
      }

      recognitionInstance.onend = () => {
        setIsListening(false)
      }

      recognitionInstance.onerror = (event) => {
        console.error("Speech recognition error:", event.error)
        setIsListening(false)
        if (event.error === "not-allowed") {
          alert("Microphone access was denied. Please allow microphone access in your browser settings.")
        }
      }

      setRecognition(recognitionInstance)
    }
  }, [])

  // Initial data fetch
  useEffect(() => {
    const fetchInitialData = async () => {
      const token = localStorage.getItem("token")
      if (!token) {
        setError("No authentication token found")
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)

        const res = await axios.get("https://chat-be-v2eh.onrender.com/api/user/users", {
          headers: { Authorization: `Bearer ${token}` },
        })

        const responseData = res.data

        if (!responseData.success) {
          throw new Error("Failed to fetch users")
        }

        const receiver = responseData.users?.find((u) => u._id === id)
        const userData = responseData.currentUser

        setCurrentUser(userData)
        setToUser(receiver)

        if (!receiver) {
          setError("User not found")
          setLoading(false)
          return
        }

        if (userData && receiver) {
          const messageRes = await axios.get(`https://chat-be-v2eh.onrender.com/api/chat/message/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          })

          const formattedMessages = messageRes.data.map((msg) => ({
            ...msg,
            type: msg.fromUserId === userData._id ? "sent" : "received",
          }))

          setMessages(formattedMessages)

          if (isWindowFocused) {
            const unreadReceived = formattedMessages.filter((msg) => msg.type === "received" && !msg.isRead && msg._id)

            unreadReceived.forEach((msg) => {
              socket.emit("read_message", {
                messageId: msg._id,
                fromUserId: msg.fromUserId,
                toUserId: userData._id,
              })
            })
          }
        }
      } catch (error) {
        console.error("Error fetching users/messages:", error)
        setError(error.response?.data?.message || "Failed to load chat data")

        if (error.response?.status === 401) {
          localStorage.removeItem("token")
          window.location.href = "/login"
        }
      } finally {
        setLoading(false)
      }
    }

    fetchInitialData()

    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
      if (callTimerRef.current) clearInterval(callTimerRef.current)
      if (connectionTimeoutRef.current) clearTimeout(connectionTimeoutRef.current)
    }
  }, [id, isWindowFocused])

  // WebRTC Functions
  const createPeerConnection = useCallback(() => {
    console.log("🔧 Creating new peer connection")
    const pc = new RTCPeerConnection(rtcConfiguration)

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        console.log("🧊 Sending ICE candidate:", event.candidate)
        socket.emit("ice-candidate", {
          to: callState.remoteUserId || toUser._id,
          candidate: event.candidate,
        })
      } else {
        console.log("🧊 ICE gathering complete")
      }
    }

    pc.ontrack = (event) => {
      console.log("📺 Received remote track:", event.track.kind)
      if (remoteVideoRef.current && event.streams[0]) {
        console.log("📺 Setting remote stream")
        remoteVideoRef.current.srcObject = event.streams[0]
        remoteVideoRef.current.play().catch((e) => console.error("Remote video play error:", e))
      }
    }

    pc.onconnectionstatechange = () => {
      console.log("🔗 Connection state changed:", pc.connectionState)
      if (pc.connectionState === "connected") {
        setIsCallConnected(true)
        startCallTimer()
        if (connectionTimeoutRef.current) {
          clearTimeout(connectionTimeoutRef.current)
          connectionTimeoutRef.current = null
        }
      } else if (pc.connectionState === "failed" || pc.connectionState === "disconnected") {
        console.log("❌ Connection failed/disconnected")
        endCall()
      }
    }

    pc.oniceconnectionstatechange = () => {
      console.log("🧊 ICE connection state:", pc.iceConnectionState)
      if (pc.iceConnectionState === "failed") {
        console.log("🔄 ICE failed, restarting...")
        pc.restartIce()
      }
    }

    return pc
  }, [callState.remoteUserId, toUser])

  const startCallTimer = () => {
    setCallDuration(0)
    callTimerRef.current = setInterval(() => {
      setCallDuration((prev) => prev + 1)
    }, 1000)
  }

  const formatCallDuration = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const startCall = async (callType) => {
    try {
      console.log(`📞 Starting ${callType} call to:`, toUser._id)

      if (!toUser?._id || !currentUser?._id) {
        alert("User information not available")
        return
      }

      // Check if user is online
      if (!isUserOnline) {
        alert("User is currently offline")
        return
      }

      setCallState({
        isInCall: false,
        isInitiating: true,
        isReceiving: false,
        callType,
        remoteUserId: toUser._id,
      })

      // Get user media
      const constraints = {
        audio: true,
        video: callType === "video" ? { width: 1280, height: 720, facingMode: "user" } : false,
      }

      console.log("🎥 Getting user media with constraints:", constraints)
      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      localStreamRef.current = stream

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream
        localVideoRef.current.muted = true
        localVideoRef.current.play().catch((e) => console.error("Local video play error:", e))
      }

      // Create peer connection
      const pc = createPeerConnection()
      peerConnectionRef.current = pc

      // Add tracks to peer connection
      stream.getTracks().forEach((track) => {
        console.log("➕ Adding track:", track.kind)
        pc.addTrack(track, stream)
      })

      // Set connection timeout
      connectionTimeoutRef.current = setTimeout(() => {
        console.log("⏰ Call connection timeout")
        alert("Call connection timeout. Please try again.")
        endCall()
      }, 30000)

      // Emit call initiation
      console.log("📤 Emitting call initiation")
      socket.emit("call-initiate", {
        to: toUser._id,
        from: currentUser._id,
        callType,
      })
    } catch (error) {
      console.error("❌ Error starting call:", error)
      if (error.name === "NotAllowedError") {
        alert("Camera/microphone access denied. Please allow access and try again.")
      } else if (error.name === "NotFoundError") {
        alert("Camera/microphone not found. Please check your devices.")
      } else {
        alert("Failed to start call: " + error.message)
      }
      endCall()
    }
  }

  const acceptCall = async () => {
    try {
      console.log("✅ Accepting call")

      const constraints = {
        audio: true,
        video: callState.callType === "video" ? { width: 1280, height: 720, facingMode: "user" } : false,
      }

      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      localStreamRef.current = stream

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream
        localVideoRef.current.muted = true
        localVideoRef.current.play().catch((e) => console.error("Local video play error:", e))
      }

      const pc = createPeerConnection()
      peerConnectionRef.current = pc

      stream.getTracks().forEach((track) => {
        console.log("➕ Adding track:", track.kind)
        pc.addTrack(track, stream)
      })

      setCallState((prev) => ({
        ...prev,
        isReceiving: false,
        isInCall: true,
      }))

      socket.emit("call-accept", {
        to: callState.remoteUserId,
        from: currentUser._id,
      })
    } catch (error) {
      console.error("❌ Error accepting call:", error)
      alert("Failed to accept call: " + error.message)
      rejectCall()
    }
  }

  const rejectCall = () => {
    console.log("❌ Rejecting call")
    socket.emit("call-reject", {
      to: callState.remoteUserId,
      from: currentUser._id,
    })
    endCall()
  }

  const endCall = () => {
    console.log("📞 Ending call")

    // Clear timeouts
    if (connectionTimeoutRef.current) {
      clearTimeout(connectionTimeoutRef.current)
      connectionTimeoutRef.current = null
    }

    if (callTimerRef.current) {
      clearInterval(callTimerRef.current)
      callTimerRef.current = null
    }

    // Stop local stream
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => {
        track.stop()
        console.log("🛑 Stopped track:", track.kind)
      })
      localStreamRef.current = null
    }

    // Close peer connection
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close()
      peerConnectionRef.current = null
    }

    // Clear video elements
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null
    }
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null
    }

    // Emit call end
    if (callState.isInCall || callState.isInitiating) {
      socket.emit("call-end", {
        to: callState.remoteUserId || toUser._id,
        from: currentUser._id,
      })
    }

    // Reset states
    setCallState({
      isInCall: false,
      isInitiating: false,
      isReceiving: false,
      callType: null,
      remoteUserId: null,
    })
    setIsCallConnected(false)
    setCallDuration(0)
    setIsMuted(false)
    setIsVideoEnabled(true)
  }

  const toggleMute = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0]
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled
        setIsMuted(!audioTrack.enabled)
      }
    }
  }

  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0]
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled
        setIsVideoEnabled(videoTrack.enabled)
      }
    }
  }

  // WebRTC signaling handlers
  const handleCallOffer = useCallback(
    async ({ from, callType }) => {
      console.log("📞 Incoming call received from:", from, "Type:", callType, "Expected from:", toUser?._id)
      if (from === toUser?._id) {
        console.log("✅ Call offer accepted - showing incoming call modal")
        setCallState({
          isInCall: false,
          isInitiating: false,
          isReceiving: true,
          callType,
          remoteUserId: from,
        })
      } else {
        console.log("❌ Call offer rejected - from user doesn't match current chat")
      }
    },
    [toUser],
  )

  const handleCallAccept = useCallback(
    async ({ from }) => {
      console.log("✅ Call accepted by:", from)
      if (from === toUser?._id) {
        setCallState((prev) => ({
          ...prev,
          isInitiating: false,
          isInCall: true,
        }))

        // Create and send offer
        try {
          const offer = await peerConnectionRef.current.createOffer({
            offerToReceiveAudio: true,
            offerToReceiveVideo: callState.callType === "video",
          })
          await peerConnectionRef.current.setLocalDescription(offer)

          console.log("📤 Sending offer")
          socket.emit("webrtc-offer", {
            to: from,
            offer: offer,
          })
        } catch (error) {
          console.error("❌ Error creating offer:", error)
          endCall()
        }
      }
    },
    [toUser, callState.callType],
  )

  const handleCallReject = useCallback(
    ({ from }) => {
      console.log("❌ Call rejected by:", from)
      if (from === toUser?._id) {
        endCall()
      }
    },
    [toUser],
  )

  const handleCallEnd = useCallback(
    ({ from }) => {
      console.log("📞 Call ended by:", from)
      if (from === toUser?._id) {
        endCall()
      }
    },
    [toUser],
  )

  const handleWebRTCOffer = useCallback(
    async ({ from, offer }) => {
      console.log("📡 Received WebRTC offer from:", from)
      if (from === toUser?._id && peerConnectionRef.current) {
        try {
          await peerConnectionRef.current.setRemoteDescription(offer)
          const answer = await peerConnectionRef.current.createAnswer()
          await peerConnectionRef.current.setLocalDescription(answer)

          console.log("📤 Sending answer")
          socket.emit("webrtc-answer", {
            to: from,
            answer: answer,
          })
        } catch (error) {
          console.error("❌ Error handling offer:", error)
          endCall()
        }
      }
    },
    [toUser],
  )

  const handleWebRTCAnswer = useCallback(
    async ({ from, answer }) => {
      console.log("📡 Received WebRTC answer from:", from)
      if (from === toUser?._id && peerConnectionRef.current) {
        try {
          await peerConnectionRef.current.setRemoteDescription(answer)
        } catch (error) {
          console.error("❌ Error handling answer:", error)
          endCall()
        }
      }
    },
    [toUser],
  )

  const handleIceCandidate = useCallback(
    async ({ from, candidate }) => {
      console.log("🧊 Received ICE candidate from:", from)
      if (from === toUser?._id && peerConnectionRef.current) {
        try {
          await peerConnectionRef.current.addIceCandidate(candidate)
        } catch (error) {
          console.error("❌ Error adding ICE candidate:", error)
        }
      }
    },
    [toUser],
  )

  // Define handleCallFailed function
  const handleCallFailed = useCallback(() => {
    alert("Call failed to connect. Please try again.")
    endCall()
  }, [endCall])

  // Voice recognition functions
  const startListening = () => {
    if (recognition) {
      setTranscript("")
      recognition.start()
      setIsListening(true)
    } else {
      alert("Speech recognition is not supported in your browser")
    }
  }

  const stopListening = () => {
    if (recognition) {
      recognition.stop()
      setIsListening(false)

      setTimeout(() => {
        if (transcript.trim() && socket) {
          const messageData = {
            toUserId: toUser._id,
            message: transcript.trim(),
            timestamp: new Date(),
          }

          const tempId = Math.random().toString(36).substring(7)
          setMessages((prev) => [
            ...prev,
            {
              _id: tempId,
              message: transcript.trim(),
              fromUserId: currentUser._id,
              toUserId: toUser._id,
              type: "sent",
              isDelivered: isUserOnline,
              isRead: false,
              timestamp: new Date(),
            },
          ])

          socket.emit("send_message", messageData)
          setShowVoiceModal(false)
          setTranscript("")
        }
      }, 300)
    }
  }

  const handleVoiceModalOpen = () => {
    setShowVoiceModal(true)
    setTranscript("")
  }

  const handleVoiceModalClose = () => {
    setShowVoiceModal(false)
    stopListening()
    setTranscript("")
  }

  // Handle received messages
  const handleReceiveMessage = useCallback(
    (data) => {
      if (!currentUser) return

      const type = data.fromUserId === currentUser._id ? "sent" : "received"

      setMessages((prev) => {
        const existingIndex = prev.findIndex(
          (msg) =>
            msg.fromUserId === currentUser._id &&
            typeof msg._id === "string" &&
            msg._id.length < 24 &&
            msg.message === data.message,
        )

        if (existingIndex >= 0) {
          const newMessages = [...prev]
          newMessages[existingIndex] = { ...data, type }
          return newMessages
        }

        if (prev.some((msg) => msg._id === data._id)) return prev

        return [...prev, { ...data, type }]
      })

      if (type === "received" && isWindowFocused) {
        setTimeout(() => {
          socket.emit("read_message", {
            messageId: data._id,
            fromUserId: data.fromUserId,
            toUserId: currentUser._id,
          })
        }, 100)
      }
    },
    [currentUser, isWindowFocused],
  )

  const handleMessageSent = useCallback(
    (data) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.fromUserId === currentUser?._id && typeof msg._id === "string" && msg._id.length < 24
            ? { ...data, type: "sent" }
            : msg,
        ),
      )
    },
    [currentUser],
  )

  const handleReadStatus = useCallback((data) => {
    const { messageId, isRead, readBy } = data

    setMessages((prev) =>
      prev.map((msg) => {
        if (msg._id === messageId) {
          if (isRead) {
            unreadMessagesRef.current.delete(messageId)
          }
          return { ...msg, isRead, readBy }
        }
        return msg
      }),
    )
  }, [])

  const handleDeliveryStatus = useCallback((data) => {
    const { messageId, isDelivered } = data
    setMessages((prev) => prev.map((msg) => (msg._id === messageId ? { ...msg, isDelivered } : msg)))
  }, [])

  const handleTyping = useCallback(
    ({ fromUserId }) => {
      if (fromUserId === id) {
        setIsTyping(true)
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
        typingTimeoutRef.current = setTimeout(() => setIsTyping(false), 2000)
      }
    },
    [id],
  )

  const checkUserOnline = useCallback(() => {
    if (toUser?._id) {
      socket.emit("check_user_online", { toUserId: toUser._id }, ({ isOnline }) => {
        setIsUserOnline(isOnline)
      })
    }
  }, [toUser])

  // Setup socket listeners
  useEffect(() => {
    socket.on("receive_message", handleReceiveMessage)
    socket.on("message_sent", handleMessageSent)
    socket.on("message_read_status", handleReadStatus)
    socket.on("message_delivered_status", handleDeliveryStatus)
    socket.on("user_typing", handleTyping)

    // Call event listeners
    socket.on("incoming-call", handleCallOffer)
    socket.on("call-accepted", handleCallAccept)
    socket.on("call-rejected", handleCallReject)
    socket.on("call-ended", handleCallEnd)
    socket.on("webrtc-offer", handleWebRTCOffer)
    socket.on("webrtc-answer", handleWebRTCAnswer)
    socket.on("ice-candidate", handleIceCandidate)
    socket.on("call-failed", handleCallFailed)

    if (currentUser?._id && toUser?._id) {
      const roomId = [currentUser._id, toUser._id].sort().join("_")
      socket.emit("join_room", { roomId })
    }

    checkUserOnline()
    const interval = setInterval(checkUserOnline, 30000)

    return () => {
      socket.off("receive_message", handleReceiveMessage)
      socket.off("message_sent", handleMessageSent)
      socket.off("message_read_status", handleReadStatus)
      socket.off("message_delivered_status", handleDeliveryStatus)
      socket.off("user_typing", handleTyping)
      socket.off("incoming-call", handleCallOffer)
      socket.off("call-accepted", handleCallAccept)
      socket.off("call-rejected", handleCallReject)
      socket.off("call-ended", handleCallEnd)
      socket.off("webrtc-offer", handleWebRTCOffer)
      socket.off("webrtc-answer", handleWebRTCAnswer)
      socket.off("ice-candidate", handleIceCandidate)
      socket.off("call-failed", handleCallFailed)
      clearInterval(interval)
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
    }
  }, [
    handleReceiveMessage,
    handleMessageSent,
    handleReadStatus,
    handleDeliveryStatus,
    handleTyping,
    handleCallOffer,
    handleCallAccept,
    handleCallReject,
    handleCallEnd,
    handleWebRTCOffer,
    handleWebRTCAnswer,
    handleIceCandidate,
    checkUserOnline,
    currentUser,
    toUser,
    handleCallFailed,
  ])

  const handleSend = () => {
    if (!input.trim() || !toUser?._id || !currentUser?._id) return

    const tempId = Math.random().toString(36).substring(7)
    const messageData = {
      toUserId: toUser._id,
      message: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [
      ...prev,
      {
        _id: tempId,
        message: input,
        fromUserId: currentUser._id,
        toUserId: toUser._id,
        type: "sent",
        isDelivered: isUserOnline,
        isRead: false,
        timestamp: new Date(),
      },
    ])

    setInput("")
    socket.emit("send_message", messageData)
  }

  const handleTypingInput = (e) => {
    setInput(e.target.value)
    if (toUser?._id) {
      socket.emit("typing", { toUserId: toUser._id })
    }
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  useEffect(() => {
    if (isTyping) {
      const timeout = setTimeout(() => {
        setIsTyping(false)
      }, 5000)
      return () => clearTimeout(timeout)
    }
  }, [messages])

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSend()
    }
  }

  const getMessageStatus = (msg) => {
    if (msg.type !== "sent") return null

    if (msg.isRead) {
      return (
        <span className="text-white-400" title="Read">
          ✓✓
        </span>
      )
    } else if (msg.isDelivered) {
      return (
        <span className="text-gray-300" title="Delivered">
          ✓✓
        </span>
      )
    } else {
      return (
        <span className="text-gray-400" title="Sent">
          ✓
        </span>
      )
    }
  }

  if (error) {
    return (
      <div className="flex flex-col h-full w-full p-6 items-center justify-center">
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
    <div className="flex flex-col h-full w-full p-6 relative">
      {/* Video Call Modal */}
      <VideoCallModal
        callState={callState}
        chatUser={toUser}
        localVideoRef={localVideoRef}
        remoteVideoRef={remoteVideoRef}
        onAcceptCall={acceptCall}
        onRejectCall={rejectCall}
        onEndCall={endCall}
        isCallConnected={isCallConnected}
        callDuration={callDuration}
        formatCallDuration={formatCallDuration}
        isMuted={isMuted}
        isVideoEnabled={isVideoEnabled}
        toggleMute={toggleMute}
        toggleVideo={toggleVideo}
      />

      {/* Voice Modal */}
      <VoiceModal
        isOpen={showVoiceModal}
        onClose={handleVoiceModalClose}
        isListening={isListening}
        transcript={transcript}
        onStartListening={startListening}
        onStopListening={stopListening}
      />

      {/* Chat Header */}
      <div className="mb-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <img
            src={toUser?.profilePic || "/placeholder.svg?height=40&width=40"}
            alt={toUser?.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <h1 className="text-xl font-bold">{toUser?.name || "..."}</h1>
            <p className="text-sm text-gray-500">{isTyping ? "Typing..." : isUserOnline ? "Online" : "Offline"}</p>
          </div>
        </div>

        {/* Call Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => startCall("audio")}
            disabled={callState.isInCall || callState.isInitiating || callState.isReceiving}
            className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Voice Call"
          >
            <Phone size={20} />
          </button>
          <button
            onClick={() => startCall("video")}
            disabled={callState.isInCall || callState.isInitiating || callState.isReceiving}
            className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Video Call"
          >
            <Video size={20} />
          </button>
          <button
            onClick={handleVoiceModalOpen}
            className="p-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 flex items-center gap-2"
            title="Voice Message"
          >
            <Mic size={20} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto mb-4 border rounded p-4 bg-white">
        {(() => {
          const groupedMessages = groupMessagesByDate(messages)
          const dateGroups = Object.keys(groupedMessages)

          return dateGroups.map((dateGroup, groupIndex) => (
            <div key={dateGroup}>
              {/* Date Separator */}
              <div className="flex items-center justify-center my-4">
                <div className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full border">{dateGroup}</div>
              </div>

              {/* Messages for this date */}
              {groupedMessages[dateGroup].map((msg) => (
                <div
                  key={msg._id}
                  className={`mb-3 max-w-xs px-4 py-2 rounded-lg relative ${
                    msg.type === "sent" ? "bg-green-500 text-white self-end ml-auto" : "bg-gray-200 text-black"
                  }`}
                >
                  <div className="flex justify-between items-start gap-2">
                    <span className="break-words">{msg.message}</span>
                  </div>
                  <div className="flex items-center justify-end gap-1 mt-1">
                    <span className="text-xs opacity-70">{formatMessageTime(msg.timestamp)}</span>
                    {msg.type === "sent" && <span className="text-xs flex items-center">{getMessageStatus(msg)}</span>}
                  </div>
                </div>
              ))}
            </div>
          ))
        })()}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Type your message"
          value={input}
          onChange={handleTypingInput}
          onKeyPress={handleKeyPress}
          className="flex-1 border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={callState.isInCall}
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || callState.isInCall}
          className={`px-4 py-2 rounded ${
            input.trim() && !callState.isInCall
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Send
        </button>
      </div>
      {/* Temporary debug component */}
      {process.env.NODE_ENV === "development" && (
        <SocketTest currentUserId={currentUser?._id} targetUserId={toUser?._id} />
      )}
    </div>
  )
}

export default Chat
