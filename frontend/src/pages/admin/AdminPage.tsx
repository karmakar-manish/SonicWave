import { useState } from "react"
import { useCheckAdmin } from "../../hooks/useAdminHook"
import DashboardStats from "./components/DashboardStats"

import Header from "./components/Header"
import { Album, Music } from "lucide-react"
import SongsTabContent from "./components/SongsTabContent"
import AlbumsTabContent from "./components/AlbumsTabContent"

export default function AdminPage() {
    const { data: isAdmin, isLoading } = useCheckAdmin()
    const [activeTab, setActiveTab] = useState("tab1")

    //incase the user is not admin and the state is not loading
    if (!isAdmin?.isAdmin && !isLoading) {
        return <div className="h-screen bg-red-100">
            <div className="flex justify-center items-center p-20 text-2xl font-bold h-screen text-red-600">
                Un-authorized... You are not admin
            </div>
        </div>
    }
    return <div className="min-h-screen bg-gradient-to-b from-zinc-900 via-zinc-900 to-black text-zinc-100 p-8 ">
        <Header />
        <DashboardStats />

        <div className="">
            <div className="max-w-md flex items-center w-fit rounded-md p-1 bg-zinc-800/50">

                <button onClick={() => setActiveTab("tab1")}
                    className={`px-4 py-2 text-sm font-medium 
                    ${activeTab === "tab1" ? "bg-zinc-700 " : "text-gray-400 hover:text-gray-200"} flex items-center cursor-pointer rounded-md`}>
                    <Music className="mr-2 size-4" />
                    Songs
                </button>

                <button onClick={() => setActiveTab("tab2")}
                    className={`px-4 py-2 text-sm font-medium 
                    ${activeTab === "tab2" ? " bg-zinc-700" : "text-gray-400 hover:text-gray-200"} flex items-center cursor-pointer rounded-md`}>
                    <Album className="size-4 mr-2" />
                    Albums
                </button>

            </div>

            {/* tab contents  */}
            <div>
                {activeTab === "tab1" && (
                    <SongsTabContent/>
                )}
                {activeTab === "tab2" && (
                    <AlbumsTabContent/>
                )}
            </div>

        </div>
    </div>
}