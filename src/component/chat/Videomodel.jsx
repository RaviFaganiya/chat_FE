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


import React, { useEffect } from "react";

const VideoCallModal = ({
  callState,
  chatUser,
  localVideoRef,
  remoteVideoRef,
  onClose,
}) => {
  // Debug logging
  useEffect(() => {
    console.log("CallState:", callState);
    console.log("ChatUser:", chatUser);
    console.log("LocalVideoRef:", localVideoRef?.current);
    console.log("RemoteVideoRef:", remoteVideoRef?.current);
  }, [callState, chatUser, localVideoRef, remoteVideoRef]);

  // Do not render if call state is completely inactive
  if (!callState?.isInCall && !callState?.isInitiating && !callState?.isReceiving) {
    return null;
  }

  const isVoiceCall = callState?.callType === "voice";
  const isVideoCall = callState?.callType === "video";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
      {isVoiceCall && (
        <div className="w-full h-full bg-gradient-to-b from-gray-700 to-gray-900 flex flex-col items-center justify-center">
          <div className="text-white mb-4 text-lg">
            Voice Call with {chatUser?.username || "Unknown"}
          </div>
          {chatUser?.avatar ? (
            <img
              src={chatUser.avatar}
              alt="Avatar"
              className="w-24 h-24 rounded-full border-4 border-white"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center text-black font-bold">
              {chatUser?.username?.[0]?.toUpperCase() || "?"}
            </div>
          )}
        </div>
      )}

      {isVideoCall && (
        <div className="w-full h-full relative">
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="absolute bottom-4 right-4 w-32 h-32 rounded-md border border-white"
          />
        </div>
      )}

      <button
        className="absolute top-4 right-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
        onClick={onClose}
      >
        End Call
      </button>
    </div>
  );
};

export default VideoCallModal;
