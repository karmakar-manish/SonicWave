import { useChatStore } from "../../../hooks/useChatStore"

export default function ChatHeader() {
    const { selectedUser, onlineUsers } = useChatStore()

    return <div className="p-4 border-b border-zinc-900">
        <div className="flex items-center gap-3">
            <div className="size-8 md:size-12 ">
                <img src={selectedUser?.imageUrl || "/avatar.png"} alt={selectedUser?.fullname[0]}
                    className="rounded-full size-8 md:size-12" />
            </div>

            <div className="">
                <h2 className="font-medium">{selectedUser?.fullname}</h2>
                <p className="text-sm text-zinc-400">
                    {selectedUser && onlineUsers.has(selectedUser.id.toString()) ? "Online" : "Offline"}
                </p>
            </div>
        </div>
    </div>
}