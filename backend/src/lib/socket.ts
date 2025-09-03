import { Server } from "socket.io"
import dotenv from "dotenv"
import { PrismaClient } from "@prisma/client"
const client = new PrismaClient()

dotenv.config()

export function initializeSocket(server: any) {
    const io = new Server(server, {
        cors: {
            origin: process.env.CLIENT_URL,
            credentials: true
        }
    })

    const userSockets = new Map()    //{userId: socketId}
    const userActivities = new Map()    //{userId: activity}

    //listen to events
    io.on("connection", (socket: any) => {

        socket.on("user_connected", (userId: string) => {
            userSockets.set(String(userId), socket.id)
            userActivities.set(String(userId), "Idle")  //not listening to music now

            //send event from server to all clients that the user is online
            io.emit("user_connected", String(userId))

            //Tell this user which other users are online => client to server
            socket.emit("users_online", Array.from(userSockets.keys()))

            //The server will tell this user what other users are doing => server to client
            io.emit("activities", Array.from(userActivities.entries()))
        })


        //event to update the activities of the user
        socket.on("update_activity", ({ userId, activity }: {
            userId: string,
            activity: any
        }) => {
            console.log("activity updated : ", userId, activity);
            userActivities.set(String(userId), activity)

            // send events => server to client 
            io.emit("activity_updated", { userId: String(userId), activity })
        })


        //listen to events
        socket.on("send_message", async (data: any) => {
            try {
                const { senderId, receiverId, content } = data

                //insert in database
                const message = await client.messageSchema.create({
                    data: {
                        senderId :String(senderId),
                        receiverId: String(receiverId),
                        content
                    }
                })

                //get the receiverSocket id of the receiver of the message
                const receiverSocketId = userSockets.get(String(receiverId))
                //send message to receiver in real time if they are online
                if (receiverSocketId) {
                    io.to(receiverSocketId).emit("receive_message", message)
                }

                //send events => server to client
                socket.emit("message_sent", message)
            } catch (err: any) {
                console.error("Message error", err)
                socket.emit("message_error", err.message)   //client to server
            }
        })

        //listen to events => when user disconnects
        socket.on("disconnect", () => {
            let disconnectedUserId

            for (const [userId, socketId] of userSockets.entries()) {
                //find the diconnected user
                if(socketId === socket.id)
                {
                    disconnectedUserId = userId
                    userSockets.delete(userId)
                    userActivities.delete(userId)
                    break
                }
            }

            //let everyone know that the user is disconnected, so that we can update our UI
            if(disconnectedUserId)
            {
                //send events => server to client
                io.emit("user_disconnected", disconnectedUserId)
            }

        })
    })
}