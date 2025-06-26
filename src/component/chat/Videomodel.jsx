// // "use client"

// // import React, { useState, useRef } from "react"
// // import { Button } from "@/components/ui/button"
// // import { Avatar, AvatarFallback } from "@/components/ui/avatar"
// // import {
// //   Phone,
// //   PhoneOff,
// //   Video,
// //   VideoOff,
// //   Mic,
// //   MicOff,
// //   Maximize2,
// //   Minimize2,
// // } from "lucide-react"

// // export default function VideoCallModal({
// //   callState,
// //   chatUser,
// //   localVideoRef,
// //   remoteVideoRef,
// //   onAcceptCall,
// //   onRejectCall,
// //   onEndCall,
// // }) {
// //   const [isVideoEnabled, setIsVideoEnabled] = useState(true)
// //   const [isAudioEnabled, setIsAudioEnabled] = useState(true)
// //   const [isFullscreen, setIsFullscreen] = useState(false)

// //   const toggleVideo = () => {
// //     if (localVideoRef.current?.srcObject) {
// //       const stream = localVideoRef.current.srcObject
// //       const videoTrack = stream.getVideoTracks()[0]
// //       if (videoTrack) {
// //         videoTrack.enabled = !videoTrack.enabled
// //         setIsVideoEnabled(videoTrack.enabled)
// //       }
// //     }
// //   }

// //   const toggleAudio = () => {
// //     if (localVideoRef.current?.srcObject) {
// //       const stream = localVideoRef.current.srcObject
// //       const audioTrack = stream.getAudioTracks()[0]
// //       if (audioTrack) {
// //         audioTrack.enabled = !audioTrack.enabled
// //         setIsAudioEnabled(audioTrack.enabled)
// //       }
// //     }
// //   }

// //   if (!callState.isInCall && !callState.isInitiating && !callState.isReceiving) {
// //     return null
// //   }

// //   return (
// //     <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
// //       <div
// //         className={`relative w-full h-full ${
// //           isFullscreen ? "" : "max-w-4xl max-h-3xl"
// //         } bg-gray-900 rounded-lg overflow-hidden`}
// //       >
// //         {/* Incoming Call Screen */}
// //         {callState.isReceiving && (
// //           <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-blue-600 to-blue-800 text-white">
// //             <div className="text-center mb-8">
// //               <Avatar className="w-32 h-32 mx-auto mb-4 bg-slate-500">
// //                 <AvatarFallback className="text-4xl bg-pink-500">
// //                   {chatUser?.username
// //                     ?.split(" ")
// //                     .map((word) => word[0])
// //                     .slice(0, 2)
// //                     .join("")
// //                     .toUpperCase()}
// //                 </AvatarFallback>
// //               </Avatar>
// //               <h2 className="text-2xl font-semibold mb-2">{chatUser.username}</h2>
// //               <p className="text-lg opacity-90">Incoming {callState.callType} call...</p>
// //             </div>

// //             <div className="flex gap-8">
// //               <Button
// //                 onClick={onRejectCall}
// //                 className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center"
// //               >
// //                 <PhoneOff className="w-8 h-8" />
// //               </Button>
// //               <Button
// //                 onClick={onAcceptCall}
// //                 className="w-16 h-16 rounded-full bg-green-500 hover:bg-green-600 flex items-center justify-center"
// //               >
// //                 <Phone className="w-8 h-8" />
// //               </Button>
// //             </div>
// //           </div>
// //         )}

// //         {/* Calling Screen */}
// //         {callState.isInitiating && (
// //           <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-gray-700 to-gray-900 text-white">
// //             <div className="text-center mb-8">
// //               <Avatar className="w-32 h-32 mx-auto mb-4 bg-slate-500">
// //                 <AvatarFallback className="text-4xl bg-pink-500">
// //                   {chatUser?.username
// //                     ?.split(" ")
// //                     .map((word) => word[0])
// //                     .slice(0, 2)
// //                     .join("")
// //                     .toUpperCase()}
// //                 </AvatarFallback>
// //               </Avatar>
// //               <h2 className="text-2xl font-semibold mb-2">{chatUser.username}</h2>
// //               <p className="text-lg opacity-90">Calling...</p>
// //             </div>

// //             <Button
// //               onClick={onEndCall}
// //               className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center"
// //             >
// //               <PhoneOff className="w-8 h-8" />
// //             </Button>
// //           </div>
// //         )}

// //         {/* Active Call Screen */}
// //         {callState.isInCall && (
// //           <>
// //             {/* Remote Video */}
// //             <div className="relative w-full h-full">
// //               {callState.callType === "video" ? (
// //                 <video
// //                   ref={remoteVideoRef}
// //                   autoPlay
// //                   playsInline
// //                   className="w-full h-full object-cover"
// //                 />
// //               ) : (
// //                 <div className="w-full h-full bg-gradient-to-b from-gray-700 to-gray-900 flex items-center justify-center">
// //                   <div className="text-center text-white">
// //                     <Avatar className="w-32 h-32 mx-auto mb-4 bg-slate-500">
// //                       <AvatarFallback className="text-4xl bg-pink-500">
// //                         {chatUser?.username
// //                           ?.split(" ")
// //                           .map((word) => word[0])
// //                           .slice(0, 2)
// //                           .join("")
// //                           .toUpperCase()}
// //                       </AvatarFallback>
// //                     </Avatar>
// //                     <h2 className="text-2xl font-semibold">{chatUser.username}</h2>
// //                   </div>
// //                 </div>
// //               )}
// //             </div>

// //             {/* Local Video */}
// //             {callState.callType === "video" && (
// //               <div className="absolute top-4 right-4 w-32 h-24 bg-gray-800 rounded-lg overflow-hidden border-2 border-white">
// //                 <video
// //                   ref={localVideoRef}
// //                   autoPlay
// //                   playsInline
// //                   muted
// //                   className="w-full h-full object-cover"
// //                 />
// //               </div>
// //             )}

// //             {/* Call Controls */}
// //             <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-4">
// //               {callState.callType === "video" && (
// //                 <Button
// //                   onClick={toggleVideo}
// //                   className={`w-12 h-12 rounded-full flex items-center justify-center ${
// //                     isVideoEnabled
// //                       ? "bg-gray-600 hover:bg-gray-700"
// //                       : "bg-red-500 hover:bg-red-600"
// //                   }`}
// //                 >
// //                   {isVideoEnabled ? (
// //                     <Video className="w-6 h-6" />
// //                   ) : (
// //                     <VideoOff className="w-6 h-6" />
// //                   )}
// //                 </Button>
// //               )}

// //               <Button
// //                 onClick={toggleAudio}
// //                 className={`w-12 h-12 rounded-full flex items-center justify-center ${
// //                   isAudioEnabled
// //                     ? "bg-gray-600 hover:bg-gray-700"
// //                     : "bg-red-500 hover:bg-red-600"
// //                 }`}
// //               >
// //                 {isAudioEnabled ? (
// //                   <Mic className="w-6 h-6" />
// //                 ) : (
// //                   <MicOff className="w-6 h-6" />
// //                 )}
// //               </Button>

// //               <Button
// //                 onClick={onEndCall}
// //                 className="w-12 h-12 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center"
// //               >
// //                 <PhoneOff className="w-6 h-6" />
// //               </Button>

// //               <Button
// //                 onClick={() => setIsFullscreen(!isFullscreen)}
// //                 className="w-12 h-12 rounded-full bg-gray-600 hover:bg-gray-700 flex items-center justify-center"
// //               >
// //                 {isFullscreen ? (
// //                   <Minimize2 className="w-6 h-6" />
// //                 ) : (
// //                   <Maximize2 className="w-6 h-6" />
// //                 )}
// //               </Button>
// //             </div>

// //             {/* Call Info */}
// //             <div className="absolute top-4 left-4 text-white">
// //               <p className="text-sm opacity-75">
// //                 {callState.callType === "video" ? "Video Call" : "Voice Call"} with{" "}
// //                 {chatUser.username}
// //               </p>
// //             </div>
// //           </>
// //         )}
// //       </div>
// //     </div>
// //   )
// // }






// "use client"

// import React, { useState } from "react"
// import {
//   Phone,
//   PhoneOff,
//   Video,
//   VideoOff,
//   Mic,
//   MicOff,
//   Maximize2,
//   Minimize2,
// } from "lucide-react"

// export default function VideoCallModal({
//   callState,
//   chatUser,
//   localVideoRef,
//   remoteVideoRef,
//   onAcceptCall,
//   onRejectCall,
//   onEndCall,
// }) {
//   const [isVideoEnabled, setIsVideoEnabled] = useState(true)
//   const [isAudioEnabled, setIsAudioEnabled] = useState(true)
//   const [isFullscreen, setIsFullscreen] = useState(false)

//   const toggleVideo = () => {
//     const stream = localVideoRef.current?.srcObject
//     const videoTrack = stream?.getVideoTracks?.()[0]
//     if (videoTrack) {
//       videoTrack.enabled = !videoTrack.enabled
//       setIsVideoEnabled(videoTrack.enabled)
//     }
//   }

//   const toggleAudio = () => {
//     const stream = localVideoRef.current?.srcObject
//     const audioTrack = stream?.getAudioTracks?.()[0]
//     if (audioTrack) {
//       audioTrack.enabled = !audioTrack.enabled
//       setIsAudioEnabled(audioTrack.enabled)
//     }
//   }

//   if (!callState.isInCall && !callState.isInitiating && !callState.isReceiving) return null

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
//       <div className={`relative w-full h-full ${isFullscreen ? "" : "max-w-4xl"} bg-gray-900 rounded-lg overflow-hidden`}>

//         {/* Incoming Call Screen */}
//         {callState.isReceiving && (
//           <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-blue-600 to-blue-800 text-white">
//             <div className="text-center mb-8">
//               <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-pink-500 flex items-center justify-center text-4xl font-bold">
//                 {chatUser?.username?.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase()}
//               </div>
//               <h2 className="text-2xl font-semibold mb-2">{chatUser.username}</h2>
//               <p className="text-lg opacity-90">Incoming {callState.callType} call...</p>
//             </div>

//             <div className="flex gap-8">
//               <button onClick={onRejectCall} className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center">
//                 <PhoneOff className="w-8 h-8 text-white" />
//               </button>
//               <button onClick={onAcceptCall} className="w-16 h-16 rounded-full bg-green-500 hover:bg-green-600 flex items-center justify-center">
//                 <Phone className="w-8 h-8 text-white" />
//               </button>
//             </div>
//           </div>
//         )}

//         {/* Calling Screen */}
//         {callState.isInitiating && (
//           <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-gray-700 to-gray-900 text-white">
//             <div className="text-center mb-8">
//               <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-pink-500 flex items-center justify-center text-4xl font-bold">
//                 {chatUser?.username?.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase()}
//               </div>
//               <h2 className="text-2xl font-semibold mb-2">{chatUser.username}</h2>
//               <p className="text-lg opacity-90">Calling...</p>
//             </div>

//             <button onClick={onEndCall} className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center">
//               <PhoneOff className="w-8 h-8 text-white" />
//             </button>
//           </div>
//         )}

//         {/* Active Call Screen */}
//         {callState.isInCall && (
//           <>
//             {/* Remote Video */}
//             <div className="relative w-full h-full">
//               {callState.callType === "video" ? (
//                 <video
//                   ref={remoteVideoRef}
//                   autoPlay
//                   playsInline
//                   className="w-full h-full object-cover"
//                 />
//               ) : (
//                 <div className="w-full h-full bg-gradient-to-b from-gray-700 to-gray-900 flex items-center justify-center">
//                   <div className="text-center text-white">
//                     <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-pink-500 flex items-center justify-center text-4xl font-bold">
//                       {chatUser?.username?.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase()}
//                     </div>
//                     <h2 className="text-2xl font-semibold">{chatUser.username}</h2>
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* Local Video */}
//             {callState.callType === "video" && (
//               <div className="absolute top-4 right-4 w-32 h-24 bg-gray-800 rounded-lg overflow-hidden border-2 border-white">
//                 <video
//                   ref={localVideoRef}
//                   autoPlay
//                   playsInline
//                   muted
//                   className="w-full h-full object-cover"
//                 />
//               </div>
//             )}

//             {/* Controls */}
//             <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-4">
//               {callState.callType === "video" && (
//                 <button
//                   onClick={toggleVideo}
//                   className={`w-12 h-12 rounded-full flex items-center justify-center ${
//                     isVideoEnabled ? "bg-gray-600 hover:bg-gray-700" : "bg-red-500 hover:bg-red-600"
//                   }`}
//                 >
//                   {isVideoEnabled ? <Video className="w-6 h-6 text-white" /> : <VideoOff className="w-6 h-6 text-white" />}
//                 </button>
//               )}

//               <button
//                 onClick={toggleAudio}
//                 className={`w-12 h-12 rounded-full flex items-center justify-center ${
//                   isAudioEnabled ? "bg-gray-600 hover:bg-gray-700" : "bg-red-500 hover:bg-red-600"
//                 }`}
//               >
//                 {isAudioEnabled ? <Mic className="w-6 h-6 text-white" /> : <MicOff className="w-6 h-6 text-white" />}
//               </button>

//               <button
//                 onClick={onEndCall}
//                 className="w-12 h-12 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center"
//               >
//                 <PhoneOff className="w-6 h-6 text-white" />
//               </button>

//               <button
//                 onClick={() => setIsFullscreen(!isFullscreen)}
//                 className="w-12 h-12 rounded-full bg-gray-600 hover:bg-gray-700 flex items-center justify-center"
//               >
//                 {isFullscreen ? <Minimize2 className="w-6 h-6 text-white" /> : <Maximize2 className="w-6 h-6 text-white" />}
//               </button>
//             </div>

//             {/* Info */}
//             <div className="absolute top-4 left-4 text-white">
//               <p className="text-sm opacity-75">
//                 {callState.callType === "video" ? "Video Call" : "Voice Call"} with {chatUser.username}
//               </p>
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   )
// }


"use client"

import { useState, useEffect } from "react"
import { Phone, PhoneOff, Video, VideoOff, Mic, MicOff, Maximize2, Minimize2 } from "lucide-react"

export default function VideoCallModal({
  callState,
  chatUser,
  localVideoRef,
  remoteVideoRef,
  onAcceptCall,
  onRejectCall,
  onEndCall,
  isCallConnected,
  callDuration,
  formatCallDuration,
  isMuted,
  isVideoEnabled,
  toggleMute,
  toggleVideo,
}) {
  const [isFullscreen, setIsFullscreen] = useState(false)

  // Ensure videos autoplay when streams are available
  useEffect(() => {
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      localVideoRef.current.play().catch(console.error)
    }
  }, [localVideoRef])

  useEffect(() => {
    if (remoteVideoRef.current && remoteVideoRef.current.srcObject) {
      remoteVideoRef.current.play().catch(console.error)
    }
  }, [remoteVideoRef])

  if (!callState.isInCall && !callState.isInitiating && !callState.isReceiving) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center">
      <div
        className={`relative w-full h-full ${isFullscreen ? "" : "max-w-6xl max-h-4xl"} bg-gray-900 rounded-lg overflow-hidden`}
      >
        {/* Incoming Call Screen */}
        {callState.isReceiving && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-blue-600 to-blue-800 text-white">
            <div className="text-center mb-8">
              <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-4xl font-bold shadow-2xl">
                {chatUser?.name
                  ?.split(" ")
                  .map((w) => w[0])
                  .slice(0, 2)
                  .join("")
                  .toUpperCase() || "U"}
              </div>
              <h2 className="text-3xl font-semibold mb-2">{chatUser?.name || "Unknown User"}</h2>
              <p className="text-xl opacity-90">Incoming {callState.callType} call...</p>
              <div className="mt-4 flex items-center justify-center">
                <div className="animate-pulse bg-white/20 rounded-full px-4 py-2">
                  <span className="text-sm">📞 Ringing...</span>
                </div>
              </div>
            </div>

            <div className="flex gap-12">
              <button
                onClick={onRejectCall}
                className="w-20 h-20 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center shadow-2xl transform hover:scale-105 transition-all duration-200"
              >
                <PhoneOff className="w-10 h-10 text-white" />
              </button>
              <button
                onClick={onAcceptCall}
                className="w-20 h-20 rounded-full bg-green-500 hover:bg-green-600 flex items-center justify-center shadow-2xl transform hover:scale-105 transition-all duration-200"
              >
                <Phone className="w-10 h-10 text-white" />
              </button>
            </div>
          </div>
        )}

        {/* Calling Screen */}
        {callState.isInitiating && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-gray-700 to-gray-900 text-white">
            <div className="text-center mb-8">
              <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-4xl font-bold shadow-2xl">
                {chatUser?.name
                  ?.split(" ")
                  .map((w) => w[0])
                  .slice(0, 2)
                  .join("")
                  .toUpperCase() || "U"}
              </div>
              <h2 className="text-3xl font-semibold mb-2">{chatUser?.name || "Unknown User"}</h2>
              <p className="text-xl opacity-90">Calling...</p>
              <div className="mt-4 flex items-center justify-center">
                <div className="animate-pulse bg-white/20 rounded-full px-4 py-2">
                  <span className="text-sm">📞 Connecting...</span>
                </div>
              </div>
            </div>

            <button
              onClick={onEndCall}
              className="w-20 h-20 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center shadow-2xl transform hover:scale-105 transition-all duration-200"
            >
              <PhoneOff className="w-10 h-10 text-white" />
            </button>
          </div>
        )}

        {/* Active Call Screen */}
        {callState.isInCall && (
          <>
            {/* Remote Video/Audio Display */}
            <div className="relative w-full h-full bg-gray-900">
              {callState.callType === "video" ? (
                <div className="w-full h-full relative">
                  <video
                    ref={remoteVideoRef}
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover"
                    style={{ transform: "scaleX(-1)" }} // Mirror effect
                  />
                  {/* Overlay for when remote video is not available */}
                  <div
                    className="absolute inset-0 flex items-center justify-center bg-gray-800"
                    style={{ display: remoteVideoRef.current?.srcObject ? "none" : "flex" }}
                  >
                    <div className="text-center text-white">
                      <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-4xl font-bold">
                        {chatUser?.name
                          ?.split(" ")
                          .map((w) => w[0])
                          .slice(0, 2)
                          .join("")
                          .toUpperCase() || "U"}
                      </div>
                      <h2 className="text-2xl font-semibold">{chatUser?.name || "Unknown User"}</h2>
                      <p className="text-sm opacity-75 mt-2">Video connecting...</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="w-full h-full bg-gradient-to-b from-gray-700 to-gray-900 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="w-40 h-40 mx-auto mb-6 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-5xl font-bold shadow-2xl">
                      {chatUser?.name
                        ?.split(" ")
                        .map((w) => w[0])
                        .slice(0, 2)
                        .join("")
                        .toUpperCase() || "U"}
                    </div>
                    <h2 className="text-3xl font-semibold mb-2">{chatUser?.name || "Unknown User"}</h2>
                    <p className="text-lg opacity-75">Voice Call</p>
                    {isCallConnected && <p className="text-sm opacity-60 mt-2">{formatCallDuration(callDuration)}</p>}
                  </div>
                </div>
              )}
            </div>

            {/* Local Video (Picture-in-Picture) */}
            {callState.callType === "video" && (
              <div className="absolute top-4 right-4 w-40 h-32 bg-gray-800 rounded-xl overflow-hidden border-4 border-white/20 shadow-2xl">
                <video
                  ref={localVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                  style={{ transform: "scaleX(-1)" }} // Mirror effect
                />
                {!isVideoEnabled && (
                  <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                    <VideoOff className="w-8 h-8 text-white/60" />
                  </div>
                )}
              </div>
            )}

            {/* Call Controls */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-4 bg-black/50 backdrop-blur-sm rounded-2xl p-4">
              {callState.callType === "video" && (
                <button
                  onClick={toggleVideo}
                  className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-200 ${
                    isVideoEnabled
                      ? "bg-gray-600/80 hover:bg-gray-700 text-white"
                      : "bg-red-500 hover:bg-red-600 text-white"
                  }`}
                  title={isVideoEnabled ? "Turn off camera" : "Turn on camera"}
                >
                  {isVideoEnabled ? <Video className="w-7 h-7" /> : <VideoOff className="w-7 h-7" />}
                </button>
              )}

              <button
                onClick={toggleMute}
                className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-200 ${
                  !isMuted ? "bg-gray-600/80 hover:bg-gray-700 text-white" : "bg-red-500 hover:bg-red-600 text-white"
                }`}
                title={isMuted ? "Unmute" : "Mute"}
              >
                {!isMuted ? <Mic className="w-7 h-7" /> : <MicOff className="w-7 h-7" />}
              </button>

              <button
                onClick={onEndCall}
                className="w-14 h-14 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center text-white transition-all duration-200 transform hover:scale-105"
                title="End call"
              >
                <PhoneOff className="w-7 h-7" />
              </button>

              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="w-14 h-14 rounded-full bg-gray-600/80 hover:bg-gray-700 flex items-center justify-center text-white transition-all duration-200"
                title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
              >
                {isFullscreen ? <Minimize2 className="w-7 h-7" /> : <Maximize2 className="w-7 h-7" />}
              </button>
            </div>

            {/* Call Info */}
            <div className="absolute top-4 left-4 text-white bg-black/50 backdrop-blur-sm rounded-lg px-4 py-2">
              <p className="text-sm font-medium">
                {callState.callType === "video" ? "Video Call" : "Voice Call"} with {chatUser?.name || "Unknown User"}
              </p>
              {isCallConnected && (
                <p className="text-xs opacity-75 mt-1">Duration: {formatCallDuration(callDuration)}</p>
              )}
              {!isCallConnected && <p className="text-xs opacity-75 mt-1">Connecting...</p>}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
