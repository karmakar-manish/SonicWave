import type { MessageInterface } from "../types";
import { BACKEND_URL } from "../config";
import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client"

let socket: Socket

export function useSocket(userId: number) {
    const [onlineUsers, setOnlineUsers] = useState<string[]>([])
    const [activities, setActivities] = useState<Map<string, string>>(new Map())
    const [messages, setMessages] = useState<MessageInterface[]>([])

    useEffect(() => {
        socket = io(BACKEND_URL, {
            withCredentials: true,
            autoConnect: false  //only connect if user is authenticated
        })

        //send events => client to server
        socket.emit("user_connected", userId)

        //listen to the following events
        socket.on("users_online", (users) => setOnlineUsers(users))
        socket.on("activities", (entries) => setActivities(new Map(entries)))
        socket.on("activity_updated", ({ userId, activity }) => {
            setActivities(prev => new Map(prev.set(userId, activity)))
        })

        socket.on("receive_message", (message) => {
            setMessages(prev => [...prev, message])
        })
        socket.on("message_sent", (message) => {
            setMessages(prev => [...prev, message])
        })

        
        return () => {
            socket.disconnect()
        }
    }, [userId])

    return { socket, onlineUsers, activities, messages }
}