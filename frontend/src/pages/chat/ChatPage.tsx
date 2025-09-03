
import { useChatStore } from "../../hooks/useChatStore"
import Topbar from "../../components/Topbar"
import UsersList from "./components/UsersList"
import ChatHeader from "./components/ChatHeader"
import type { MessageInterface } from "../../types"
import { useAuthUserHook } from "../../hooks/useAuthUserHook"
import MessageInput from "./components/MessageInput"
import { useEffect } from "react"

//function to format the date
function formatDate(date: string)
{
    return new Date(date).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
    })
}

export default function ChatPage() {

    const { data: authUser } = useAuthUserHook()

    const { selectedUser, messages, fetchMessages } = useChatStore()
   

    useEffect(()=>{
        //incase the user is selected, fetch all their messages
        if(selectedUser)    fetchMessages(selectedUser.id.toString())
    }, [selectedUser, fetchMessages])

    console.log("All messages: ", fetchMessages)

    return (
        <div className="h-ful  rounded-lg bg-gradient-to-b from-zinc-800 to-zinc-900 overflow-hidden mt-2">
            <Topbar />
            <div className="grid lg:grid-cols-[300px_1fr] grid-cols-[80px_1fr] h-[calc(100vh-180px)]">
                <UsersList />

                {/* chat message  */}
                <div>
                    {selectedUser ? (
                        <>
                            <ChatHeader />
                            <div className="h-[calc(100vh-340px)] overflow-auto">
                                <div className="p-4 space-y-4">
                                    {messages?.map((msg: MessageInterface) => (
                                        <div key={msg.id} className={`flex items-start gap-3 ${msg.senderId === authUser.id.toString() ? "flex-row-reverse" : ""}`}>

                                            <div className="size-8 md:size-12 ">
                                                <img src={msg.senderId === authUser.id ? authUser.imageUrl : selectedUser.imageUrl || "/avatar.png"}
                                                    className="rounded-full" />
                                            </div>

                                            <div className={`rounded-lg p-3 max-w-[70%]
                                                ${msg.senderId === authUser.id.toString() ? "bg-green-500" : "bg-zinc-800"}`}>
                                                <p className="text-sm">{msg.content}</p>
                                                <span className="text-xs text-zinc-300 mt-1 block">{formatDate(msg.createdAt)}</span>

                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <MessageInput />
                        </>
                    ) : (
                        <NoConversationPlaceholder />
                    )}
                </div>
            </div>
        </div>
    )
}

function NoConversationPlaceholder() {
    return (
        <div className="flex flex-col items-center justify-center h-full space-y-6">
            <img src="/soniclogo.png" alt="SonicWave" className="size-30 animate-bounce" />
            <div className="text-center">
                <h3 className="text-zinc-300 text-lg font-medium mb-1">No conversation selected</h3>
                <p className="text-zinc-500 text-sm">Choose a friend to start chatting</p>
            </div>
        </div>
    )
}