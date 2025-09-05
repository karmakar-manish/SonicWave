import { axiosInstance } from "../../lib/axios"
import { useAuthUserHook } from "../../hooks/useAuthUserHook"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import { Camera, Loader, Mail, User } from "lucide-react"

export default function ProfilePage() {
    const { data: authUser } = useAuthUserHook()
    const [selectedImg, setSelectedImg] = useState<string | null>(null)
    const [fullname, setFullname] = useState("")
    const queryClient = useQueryClient()
    
    //store the authUser's fullname in the state variable
    useEffect(() => {
        if (authUser?.fullname)
            setFullname(authUser.fullname)
    }, [authUser])


    //mutation function to update profile information
    const { mutate: updateProfileMutation, isPending } = useMutation({
        mutationFn: async ({ imageUrl, fullname }: {
            imageUrl: string,
            fullname: string
        }) => {

            const res = await axiosInstance.put("/users/update-profile", {
                imageUrl,
                fullname
            })
            return res.data
        },
        onSuccess: () => {
            //again fetch user information
            queryClient.invalidateQueries({ queryKey: ["authUser"] })
            toast.success("Profile updated successfully!")
        },
        onError: (err: any) => {
            toast.error(err.response.data.message || "Error while updating profile!")
        }
    })

    //handlesave function
    function handleSave() {
        const trimmedName = fullname.trim()
        if (!trimmedName) {
            toast.error("Fullname cannot be empty")
            return
        }

        updateProfileMutation({
            imageUrl: selectedImg || authUser.imageUrl,
            fullname: trimmedName
        })
    }

    //function to change image into base64url
    async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0] || null

        if (!file) return

        readFileAsDataURL(file).then((base64Image) => {
            setSelectedImg(base64Image as string) //stores base64 encoded string in the state variable
        })
    }

    function readFileAsDataURL(file: File): Promise<string | ArrayBuffer | null> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.onloadend = () => resolve(reader.result)
            reader.onerror = reject
            reader.readAsDataURL(file)
        })
    }


    return <div className="min-h-full rounded-lg bg-gradient-to-b from-zinc-800 to-zinc-900 overflow-hidden pt-5 flex flex-col justify-start">
        <div className="mx-auto rounded-lg pb-2 h-[calc(100vh-140px)] overflow-auto p-8 bg-zinc-800 shadow-xl">
            <div>
                <div className="text-center ">
                    <h1 className="text-2xl font-semibold">Profile</h1>
                    <p className="mt-2 mb-5">Your profile information</p>
                </div>


                {/* avatar upload section  */}
                <div className="flex flex-col items-center gap-4">
                    <div className="relative">
                        <img src={selectedImg || authUser.imageUrl || "/avatar.png"} alt="Profile" className="size-32 rounded-full border-4 object-cover" />

                        <label htmlFor="avatar-upload" className={`absolute bottom-0 right-0 bg-gray-300 p-1.5 hover:scale-105 cursor-pointer rounded-full transition-all duration-200 ${isPending ? "animate-pulse pointer-events-none" : ""}`}>
                            <Camera className="size-5 text-gray-800" />
                            <input type="file" id="avatar-upload" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={isPending} />
                        </label>
                    </div>

                    <p className="text-sm text-zinc-400">
                        {isPending ? "Uploading..." : "Click the camera icon to update your photo"}
                    </p>
                </div>

                {/* User information  */}
                <div className="mt-10 px-20">
                    <div>
                        <div className="flex gap-2 items-center text-sm text-zinc-400">
                            <User className="size-4" />
                            Full Name
                        </div>

                        <input
                            type="text"
                            value={fullname}
                            onChange={(e) => setFullname(e.target.value)}
                            className="px-4 py-2.5 bg-base-200 rounded-lg border text-gray-700 w-full"
                        />

                    </div>

                    <div className="mt-3 ">
                        <div className="flex gap-2 items-center text-sm text-zinc-400">
                            <Mail className="size-4" />
                            Email Address
                        </div>
                        <p className="px-4 py-2.5 bg-base-200 rounded-lg border text-gray-700 hover:cursor-not-allowed">{authUser.email}</p>
                    </div>
                </div>

                {/* information of createdAt */}
                <div className="mt-6 px-20 rounded-xl p-6">
                    <h2 className="text-lg font-medium mb-4">Account Information </h2>
                    <div className="space-y-3 text-sm">
                        <div className="flex items-center justify-between py-2 border-b border-zinc-700">
                            <span>Member Since</span>
                            <span >{authUser.createdAt.split("T")[0]}</span>
                        </div>
                        <div className="flex items-center justify-between py-2">
                            <span>Account Status</span>
                            <span className="text-green-500">Active</span>
                        </div>
                    </div>


                    {/* button to submit  */}
                    <div className="text-right mt-5">
                        <button
                            onClick={handleSave}
                            disabled={isPending}
                            className={`px-6 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition 
                            ${isPending?"cursor-not-allowed": "cursor-pointer"}`}>

                            {isPending ? (
                                <div className="flex justify-center items-center gap-2">
                                    <Loader className="animate-spin size-5" />
                                    Saving...
                                </div>
                            ) : ("Save Changes")}

                        </button>
                    </div>

                </div>
            </div>
        </div>
    </div>

}