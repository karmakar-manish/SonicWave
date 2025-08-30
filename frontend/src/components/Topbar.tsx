import { Link } from "react-router-dom"
import { useAuthUserHook } from "../hooks/useAuthUserHook"
import { LayoutDashboardIcon, LogInIcon } from "lucide-react"
import { useCheckAdmin } from "../hooks/useAdminHook"
import ProfileSection from "./ProfileSection"

export default function Navbar() {

    //fetch the current logged in user's data
    const { data: authUser } = useAuthUserHook()
    const {data: isAdmin} = useCheckAdmin({
        enabled: !!authUser //only run if the authUser is there
    })
  
    return (
        <div className="flex items-center justify-between py-2 px-4 bg-zinc-900/75 backdrop-blur-md rounded-md">

            <div className="flex justify-center items-center">
                <img src="/soniclogo.png" alt="SonicWave logo" className="w-10 h-12" />
                <p className="text-md">SonicWave</p>
            </div>

            <div className="flex items-center gap-4 ">
                {isAdmin?.isAdmin && (
                    <Link to={"/admin"} className="flex justify-center items-center hover:bg-zinc-800 transition px-2 py-1 rounded-sm cursor-pointer gap-1">
                        <LayoutDashboardIcon className="size-4 mr-2"/>
                        Admin Dashboard
                    </Link>
                )}

                {authUser ? (
                    <div>
                        <ProfileSection/>
                    </div>

                ) : (
                    <Link to={"/login"} className="flex justify-center items-center gap-1 hover:bg-slate-700 px-2 py-1 rounded-sm hover:text-slate-200">
                        <LogInIcon/>
                        SignIn
                    </Link>
                )}
            </div>
        </div>
    )
}