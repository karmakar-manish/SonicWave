import { create } from "zustand"
import type { UserInterface, MessageInterface } from "../types"
import { io } from "socket.io-client"
import { BACKEND_URL } from "../config"
import { axiosInstance } from "../lib/axios"



interface ChatStore {
    //variables---------
    users: UserInterface[]  //list of all users
    isLoading: boolean
    error: string | null
    socket: any
    isConnected: boolean,
    onlineUsers: Set<string>
    userActivities: Map<string, string>
    messages: MessageInterface[]    //list of all messages
    selectedUser: UserInterface | null  //the user who is selected for chatting


    //functions-------
    // fetchUsers: () => Promise<void>
    initSocket: (userId: string) => void
    disconnectSocket: () => void
    sendMessage: (receiverId: string, senderId: string, content: string) => void
    fetchMessages: (userId: string) => Promise<void>
    setSelectedUser: (user: UserInterface | null) => void
}

const socket = io(BACKEND_URL, {
    withCredentials: true,
    autoConnect: false  //only connect if user is authenticated
})


export const useChatStore = create<ChatStore>((set, get) => ({
    //initialize the variables
    users: [],
    isLoading: false,
    error: null,
    socket: socket,
    isConnected: false,
    onlineUsers: new Set(),
    userActivities: new Map(),
    messages: [],
    selectedUser: null,

    //now define to functions to use the above state variables

    //for the user who is selected for chatting
    setSelectedUser: (user) => set({ selectedUser: user }),

    //function to initialize socket 
    initSocket: (userId) => {
        //connect if the user is not connected (first time)
        if (!get().isConnected) {
            socket.auth = { userId }
            socket.connect()

            //send events => client to server
            socket.emit("user_connected", userId)

            //listen to the following events
            socket.on("users_online", (users: string[]) => {
                set({ onlineUsers: new Set(users) })
            })

            socket.on("activities", (activities: [string, string][]) => {
                set({ userActivities: new Map(activities) })
            })

            //when the user gets online, store its userId in the set
            socket.on("user_connected", (userId: string) => {
                set((state) => ({
                    onlineUsers: new Set([...state.onlineUsers, String(userId)])
                }))
            })

            //when the user is disconnected, remove it's userId
            socket.on("user_disconnected", (userId: string) => {
                set((state) => {
                    //create a new Set
                    const newOnlineUsers = new Set(state.onlineUsers)
                    //delete the current user
                    newOnlineUsers.delete(userId)
                    return { onlineUsers: newOnlineUsers }
                })
            })

            //initialize the message array
            socket.on("receive_message", (message: MessageInterface) => {
                const { selectedUser } = get()

                //only push message if it's from/to the current chat
                if (selectedUser && (message.senderId === String(selectedUser.id) || message.receiverId === String(selectedUser.id))) {
                    set((state) => ({
                        messages: [...state.messages, message]
                    }))
                }
            })
            socket.on("message_sent", (message: MessageInterface) => {
                set((state) => ({
                    messages: [...state.messages, message]
                }))
            })


            //function to update the activity of the user
            socket.on("activity_updated", ({ userId, activity }) => {
                set((state) => {
                    //create a new map of activities
                    const newActivities = new Map(state.userActivities)
                    //insert the value in the map
                    newActivities.set(String(userId), activity)
                    return { userActivities: newActivities }
                })
            })

            //mark the user as connected
            set({ isConnected: true })
        }
    },

    //when the user gets disconnected
    disconnectSocket: () => {
        //incase the user is connected
        if (get().isConnected) {
            socket.disconnect()
            set({ isConnected: false })   //disconnected
        }
    },

    // function to send message 
    sendMessage: async (receiverId, senderId, content) => {
        //get the socket
        const socket = get().socket

        //incase the user is not connected
        if (!socket) return

        //send event => client to server
        socket.emit("send_message", {
            receiverId: String(receiverId),
            senderId: String(senderId),
            content
        })
    },

    //fetch all the messages of the user and put them in the messages list
    fetchMessages: async (userId: string) => {
        set({ isLoading: true, error: null })
        try {
            const res = await axiosInstance.get(`/users/messages/${userId}`)

            //put the messages in the message list
            set({ messages: res.data })
        } catch (err: any) {
            set({ error: err.response.data.message || "Error fetching messages" })
        } finally {
            set({ isLoading: false })
        }
    }
}))