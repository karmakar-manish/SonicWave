import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "react-toastify"
import { axiosInstance } from "../lib/axios"
import { useEffect, useRef, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import {  Github, LogOutIcon, User } from "lucide-react"
import { useAuthUserHook } from "../hooks/useAuthUserHook"


export default function ProfileSection() {
    const queryClient = useQueryClient()
    const navigate = useNavigate()
    
    const { data: authuser } = useAuthUserHook()

    const [open, setOpen] = useState(false)

    //to access DOM elements
    const dropdownRef = useRef<HTMLDivElement | null>(null)
    const avatarRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            const target = event.target as Node

            if (dropdownRef.current && !dropdownRef.current.contains(target)
                && avatarRef.current && !avatarRef.current.contains(target))
                setOpen(false)
        }

        //listen for mouse click
        document.addEventListener("mousedown", handleClickOutside)

        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [])


    //logout mutation
    const { mutate: logoutMutation, isPending: loggingout } = useMutation({
        mutationFn: async () => {
            const res = await axiosInstance.post("/auth/logout")
            return res
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["authUser"] })  //re-fetch data
            queryClient.removeQueries({ queryKey: ["isAdmin"] })   //clears it from the cache completely
            toast.success("Logged out successfully!")
            // navigate("/")
        },
        onError: (err: any) => {
            toast.error(err.response.data.message || "Error while logout")
        }
    })


    return (
        <div className="relative">
            <div ref={avatarRef} className=" flex justify-center size-10 rounded-full transition-all hover:scale-110 cursor-pointer hover:border-2" onClick={() => setOpen((prev) => !prev)}>
                <img src={authuser?.imageUrl || "/avatar.png"} alt={authuser?.fullname} className="rounded-full size-10" />
            </div>

            {open && (
                <div ref={dropdownRef} className="absolute right-3 top-9 w-50 h-fit z-10 bg-zinc-700 rounded-lg p-1">
                    <div>
                        <div className="mb-2 p-1 flex flex-col gap-1">
                            <Link to={"/profile"} className="cursor-pointer hover:bg-zinc-800 rounded-md p-2 flex justify-left items-center gap-3">
                                <User className="size-6" />
                                <span className="font-semibold">Account</span>
                            </Link>

                            <Link to={"/github"} className="cursor-pointer hover:bg-zinc-800 rounded-md p-2 flex justify-left items-center gap-3">
                                <Github className="size-6"/>
                                <span className="font-semibold">GitHub</span>
                            </Link>
                        </div>

                        <div className="border border-t-slate-400" />

                        <button className="cursor-pointer bg-red-400 hover:bg-red-500 rounded-md p-3 flex justify-left items-center gap-3 mt-2 w-full "
                            onClick={() => logoutMutation()} disabled={loggingout}>
                            <LogOutIcon className="size-6"/>
                            <span className="font-semibold">Logout</span>
                        </button>

                    </div>
                </div>
            )}
        </div>
    )
}


