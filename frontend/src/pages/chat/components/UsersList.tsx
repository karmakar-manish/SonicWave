import { useFetchUsers } from "../../../hooks/useChatHook"
import { UserListSkeleton } from "./UserListSkeleton"
import { useChatStore } from "../../../hooks/useChatStore"
import type { UserInterface } from "../../../types"
export default function UsersList() {

    const { data: getAllUsers, isLoading: isUsersLoading } = useFetchUsers()

    const { selectedUser, setSelectedUser, onlineUsers } = useChatStore()

    return (
        <div className="border-r border-zinc-800">
            <div className="flex flex-col h-full">
                <div className="h-[calc(100vh-280px)]">
                    <div className="space-y-2 p-4">
                        {isUsersLoading ? (
                            <UserListSkeleton />
                        ) : (
                            getAllUsers?.map((user: UserInterface) => (
                                <div key={user.id} onClick={()=> setSelectedUser(user)}
                                className={`flex items-center justify-center lg:justify-start gap-3 p-3 rounded-lg cursor-pointer transition-colors 
                                ${selectedUser?.id === user.id ? "bg-zinc-900":"hover:bg-zinc-800/50"}`}>
                                    
                                    <div className="relative">
                                        <div className="size-8 md:size-12 ">
                                            <img src={user.imageUrl || "/avatar.png"} alt={user.fullname[0]} 
                                            className="rounded-full"/>
                                        </div>
                                        {/* online indicator */}
                                        <div className={`absolute bottom-0 right-0 ring-2 ring-zinc-900 size-3  rounded-full ${onlineUsers.has(user.id.toString()) ? "bg-green-500": "bg-zinc-500"}`}/>
                                    </div>

                                    <div className="flex-1 min-w-0 lg:block hidden">
                                        <span className="font-medium truncate">{user.fullname}</span>
                                    </div>

                                </div>
                            ))
                        )}
                    </div>

                </div>
            </div>
        </div>
    )
}