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
                  {/* Enhanced overlay for when remote video is not available */}
                  <div
                    className="absolute inset-0 flex items-center justify-center bg-gray-800"
                    style={{
                      display:
                        remoteVideoRef.current?.srcObject &&
                        remoteVideoRef.current.srcObject.getVideoTracks().length > 0
                          ? "none"
                          : "flex",
                    }}
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
                      {isCallConnected ? (
                        <p className="text-sm opacity-75 mt-2">Camera is off</p>
                      ) : (
                        <div className="mt-2">
                          <p className="text-sm opacity-75">Video connecting...</p>
                          <div className="flex items-center justify-center mt-2">
                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce mr-1"></div>
                            <div
                              className="w-2 h-2 bg-blue-400 rounded-full animate-bounce mr-1"
                              style={{ animationDelay: "0.1s" }}
                            ></div>
                            <div
                              className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                              style={{ animationDelay: "0.2s" }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                // Voice call display with better connection status
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
                    {isCallConnected ? (
                      <p className="text-sm opacity-60 mt-2">{formatCallDuration(callDuration)}</p>
                    ) : (
                      <div className="mt-2">
                        <p className="text-sm opacity-60">Connecting...</p>
                        <div className="flex items-center justify-center mt-2">
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-1"></div>
                          <div
                            className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-1"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-green-400 rounded-full animate-pulse"
                            style={{ animationDelay: "0.4s" }}
                          ></div>
                        </div>
                      </div>
                    )}
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
              {isCallConnected ? (
                <p className="text-xs opacity-75 mt-1">Duration: {formatCallDuration(callDuration)}</p>
              ) : (
                <div className="text-xs opacity-75 mt-1">
                  <p>Connecting...</p>
                  <div className="flex items-center mt-1">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse mr-2"></div>
                    <span>Establishing connection</span>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
