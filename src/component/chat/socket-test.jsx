"use client"

import { useEffect, useState } from "react"
import socket from "../../socket"

export default function SocketTest({ currentUserId, targetUserId }) {
  const [logs, setLogs] = useState([])

  const addLog = (message) => {
    setLogs((prev) => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
  }

  useEffect(() => {
    // Test socket connection
    socket.on("connect", () => {
      addLog("✅ Socket connected")
    })

    socket.on("disconnect", () => {
      addLog("❌ Socket disconnected")
    })

    // Listen for all call events
    socket.on("incoming-call", ({ from, callType }) => {
      addLog(`📞 Incoming call from ${from} (${callType})`)
    })

    socket.on("call-accepted", ({ from }) => {
      addLog(`✅ Call accepted by ${from}`)
    })

    socket.on("call-rejected", ({ from }) => {
      addLog(`❌ Call rejected by ${from}`)
    })

    socket.on("call-failed", ({ reason }) => {
      addLog(`❌ Call failed: ${reason}`)
    })

    return () => {
      socket.off("connect")
      socket.off("disconnect")
      socket.off("incoming-call")
      socket.off("call-accepted")
      socket.off("call-rejected")
      socket.off("call-failed")
    }
  }, [])

  const testCall = () => {
    addLog(`📤 Sending test call to ${targetUserId}`)
    socket.emit("call-initiate", {
      to: targetUserId,
      from: currentUserId,
      callType: "video",
    })
  }

  return (
    <div className="fixed bottom-4 right-4 w-80 h-60 bg-white border rounded-lg shadow-lg p-4 z-50">
      <h3 className="font-bold mb-2">Socket Debug</h3>
      <div className="h-32 overflow-y-auto text-xs bg-gray-100 p-2 rounded mb-2">
        {logs.map((log, index) => (
          <div key={index}>{log}</div>
        ))}
      </div>
      <button onClick={testCall} className="w-full bg-blue-500 text-white px-2 py-1 rounded text-sm">
        Test Call
      </button>
      <button onClick={() => setLogs([])} className="w-full bg-gray-500 text-white px-2 py-1 rounded text-sm mt-1">
        Clear Logs
      </button>
    </div>
  )
}
