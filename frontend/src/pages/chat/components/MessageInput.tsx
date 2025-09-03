import { useChatStore } from "../../../hooks/useChatStore"
import { useAuthUserHook } from "../../../hooks/useAuthUserHook"
import { useState } from "react"
import { Send } from "lucide-react"

export default function MessageInput()
{

    const {data: authUser} = useAuthUserHook()
    const [newMessage, setNewMessage] = useState("")
    const {selectedUser, sendMessage} = useChatStore()

    function handleSend()
    {
        if(!selectedUser || !authUser || !newMessage)
            return

        sendMessage(selectedUser.id.toString(), authUser.id.toString(), newMessage.trim())
        
        //reset
        setNewMessage("")
    }

    return <div className="p-4 mt-auto border-t border-zinc-800">
        <div className="flex gap-2">
            <input 
            placeholder="Type a message"
            value={newMessage}
            onChange={(e)=>setNewMessage(e.target.value)}
            className="bg-zinc-800 border-zinc-700/50 w-full p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 "
            onKeyDown={(e)=> e.key === "Enter" && handleSend()}
        />

        <button className=" border cursor-pointer bg-green-500 px-2 rounded-md hover:bg-green-600" 
        onClick={handleSend} disabled={!newMessage.trim()}>
            <Send className="size-6 text-green-100 hover:scale-105 transition-colors"/>
        </button>
        </div>
    </div>
}