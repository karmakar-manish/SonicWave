import { motion } from "framer-motion"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { axiosInstance } from "../../../lib/axios"
import { toast } from "react-toastify"
import { Eye, EyeClosed, Loader, Lock, Mail, RefreshCcw, User } from "lucide-react"
import Input from "../../../components/Input"
import { Link } from "react-router-dom"
import { signInWithPopup } from "firebase/auth"
import { auth, provider } from "../../../firebase"


export default function SignupForm() {
    const [fullname, setFullname] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [uid, setUid] = useState("")
    const [showpassword, setShowpassword] = useState(false)

    const queryClient = useQueryClient()

    //mutation to handle signup
    const { mutate: signupMutation, isPending } = useMutation({
        mutationFn: async () => {
            const res = await axiosInstance.post("/auth/signup", {
                fullname,
                email,
                password,
                uid
            })
            return res.data
        },
        onSuccess: () => {
            toast.success("Account created successfully!")
            //refetch
            queryClient.invalidateQueries({ queryKey: ["authUser"] })
        },
        onError: (err: any) => {
            toast.error(err.response.data.message || "Error creating account!")
        }
    })
    function handleSignup(e: any) {
        e.preventDefault()
        signupMutation()
    }

    //mutation to get the uid of the provider
    const { mutate: getProviderUid } = useMutation({
        mutationFn: async () => {
            try {
                const res = await signInWithPopup(auth, provider)
                setUid(res.user.uid)
                setEmail(res.user.email ?? "")
            }
            catch (err) {
                throw err   //onError is triggered
            }
        },
        onError: () => {
            toast.error("Can't get Uid")
            setUid("")
            setEmail("")
        }
    })


    return <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-xl p-8 flex flex-col "
    >
        <h1 className="text-3xl font-bold text-center text-white mb-6">Create Account</h1>
        <form onSubmit={handleSignup} className="space-y-5">

            <Input
                icon={User}
                type="text"
                placeholder="Fullname"
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
            />
            {/* email  */}
            {!uid ? (
                <button className="cursor-pointer text-gray-700
                    bg-gray-200 hover:bg-gray-300 
                    border-blue-300 focus:border-blue-200 focus:ring-3 focus:ring-blue-200
                    font-bold rounded-lg text-sm px-5 py-2.5 me-2 w-full border "
                    type="button"
                    onClick={() => {
                        getProviderUid()
                    }} disabled={isPending}>
                    {
                        isPending ? <Loader className="animate-spin w-5 h-5 mx-auto" /> : (
                            <div className="flex justify-center">
                                <img src="/google.png" alt="google_img" className="w-5 h-5 mr-2" />
                                <span>Click to add Email</span>
                            </div>
                        )
                    }
                </button>
            ) : (
                <div className="relative">
                    <Input
                        icon={Mail}
                        type="text"
                        placeholder={email}
                        readOnly={true}
                    />
                    <button onClick={() => setUid("")} className="absolute top-2.5 right-3 text-gray-6-- cursor-pointer text-purple-500  hover:text-purple-600">
                        <RefreshCcw size={20} />
                    </button>
                </div>
            )}

            {/* password input  */}
            <div className="relative w-full max-w-md">
                <Input
                    icon={Lock}
                    type={showpassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button type="button" onClick={() => setShowpassword((prev) => !prev)}
                    className="absolute top-2.5 right-3 text-purple-500 cursor-pointer hover:text-purple-600">
                    {showpassword ? <EyeClosed size={20} /> : <Eye size={20} />}
                </button>

            </div>

            {/* submit button  */}
            <motion.button
                className="w-full py-3 px-4 
               bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500 
               text-white font-bold rounded-lg  
               hover:from-violet-600 hover:via-fuchsia-600 hover:to-pink-600
               focus:outline-none focus:ring-2 focus:ring-fuchsia-400 
               transition duration-200 cursor-pointer
               shadow-[0_0_20px_rgba(217,70,239,0.5)]"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type='submit'
                disabled={isPending}
            >
                {isPending ? <Loader className="animate-spin m-auto" /> : "Sign up"}
            </motion.button>
        </form>

        {/* Login link */}
        <p className="text-sm text-gray-200 text-center mt-6">
            Already have an account?{" "}
            <Link to={"/login"} className="text-yellow-400 hover:underline">
                Log in
            </Link>
        </p>

    </motion.div>
}