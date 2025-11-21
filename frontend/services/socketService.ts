// Real-time socket.io integration for live updates
// This file prepares socket connection structure for later backend integration

import { io, type Socket } from "socket.io-client"

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000"

let socket: Socket | null = null

export function initializeSocket(token: string): Socket {
  if (socket) {
    return socket
  }

  socket = io(SOCKET_URL, {
    auth: {
      token,
    },
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5,
  })

  socket.on("connect", () => {
    console.log("Socket connected")
  })

  socket.on("disconnect", () => {
    console.log("Socket disconnected")
  })

  return socket
}

export function getSocket(): Socket | null {
  return socket
}

export function joinCrowdMonitoring(gateId: string) {
  if (socket) {
    socket.emit("join-crowd-monitoring", { gateId })
  }
}

export function leaveCrowdMonitoring(gateId: string) {
  if (socket) {
    socket.emit("leave-crowd-monitoring", { gateId })
  }
}

export function onCrowdUpdate(callback: (data: any) => void) {
  if (socket) {
    socket.on("crowd-update", callback)
  }
}

export function onAlertReceived(callback: (alert: any) => void) {
  if (socket) {
    socket.on("alert", callback)
  }
}

export function onYOLODetection(callback: (detection: any) => void) {
  if (socket) {
    socket.on("yolo-detection", callback)
  }
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}
