"use client"

import { Mic, MicOff, X } from "lucide-react"

export default function VoiceModal({ isOpen, onClose, isListening, transcript, onStartListening, onStopListening }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-200 to-cyan-200 px-6 py-4">
          <h2 className="flex items-center gap-2 text-xl font-bold text-indigo-800">
            <Mic className="w-5 h-5 text-cyan-600 animate-bounce" />
            Voice to Text
          </h2>
        </div>

        {/* Body */}
        <div className="px-6 py-8 space-y-6 bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
          {/* Microphone Visualization */}
          <div className="flex justify-center">
            <div className="relative flex items-center justify-center">
              {/* Outer ring */}
              <span
                className={`absolute w-36 h-36 rounded-full border-4 transition-all duration-300 ${
                  isListening ? "border-cyan-300 animate-[ping_1.5s_ease-in-out_infinite]" : "border-gray-200"
                }`}
              />
              {/* Middle ring */}
              <span
                className={`absolute w-28 h-28 rounded-full border-4 transition-all duration-300 ${
                  isListening ? "border-indigo-300 animate-[ping_2s_ease-in-out_infinite]" : "border-gray-100"
                }`}
              />
              {/* Inner circle */}
              <div
                className={`w-24 h-24 rounded-full flex items-center justify-center border-4 shadow-lg transition-all duration-300 ${
                  isListening
                    ? "bg-gradient-to-br from-cyan-200 to-indigo-200 border-cyan-400 animate-pulse"
                    : "bg-gray-100 border-gray-300"
                }`}
              >
                <Mic
                  className={`w-12 h-12 transition-all duration-300 ${
                    isListening ? "text-cyan-600 animate-pulse" : "text-gray-400"
                  }`}
                />
              </div>
              {/* Recording indicator */}
              {isListening && (
                <span className="absolute right-2 top-2 w-4 h-4 bg-red-500 rounded-full opacity-80 animate-ping" />
              )}
            </div>
          </div>

          {/* Status */}
          <div className="text-center">
            <p
              className={`text-base font-semibold transition-colors duration-300 ${
                isListening ? "text-cyan-700" : "text-indigo-700"
              }`}
            >
              {isListening ? "Listening... Speak now" : "Tap the mic to start recording"}
            </p>
            {isListening && (
              <p className="text-xs text-indigo-500 mt-1 animate-fade-in">
                Message will be sent automatically when you stop recording
              </p>
            )}
          </div>

          {/* Transcript Display */}
          <div className="bg-white/80 rounded-xl p-4 min-h-[100px] border border-cyan-100 shadow-inner">
            <p className="text-sm text-gray-800 font-mono whitespace-pre-wrap leading-relaxed">
              {transcript ? (
                <span className="animate-fade-in">{transcript}</span>
              ) : (
                <span className="text-gray-400 italic">Your speech will appear here...</span>
              )}
            </p>
            {isListening && (
              <div className="flex items-center mt-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse mr-2"></div>
                <span className="text-xs text-gray-500">Recording...</span>
              </div>
            )}
          </div>

          {/* Control Buttons */}
          <div className="flex justify-center gap-4">
            {!isListening ? (
              <button
                onClick={onStartListening}
                className="bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-600 hover:to-indigo-600 text-white px-8 py-3 rounded-full font-semibold shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                <Mic className="inline-block w-5 h-5 mr-2 animate-bounce" />
                Start Recording
              </button>
            ) : (
              <button
                onClick={onStopListening}
                className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-8 py-3 rounded-full font-semibold shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                <MicOff className="inline-block w-5 h-5 mr-2 animate-pulse" />
                Stop & Send
              </button>
            )}
          </div>

          {/* Cancel Button */}
          {!isListening && (
            <div className="pt-4 border-t border-gray-200">
              <button
                onClick={onClose}
                className="w-full py-3 border border-gray-300 text-gray-600 rounded-full hover:bg-gray-50 transition-all duration-300 font-medium"
              >
                <X className="inline-block w-5 h-5 mr-1" />
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      <style jsx global>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}
