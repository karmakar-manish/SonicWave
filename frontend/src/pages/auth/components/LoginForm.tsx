import { motion } from "framer-motion"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { axiosInstance } from "../../../lib/axios"
import { toast } from "react-toastify"
import { Eye, EyeClosed, Loader, Lock, Mail } from "lucide-react"
import Input from "../../../components/Input"
import { Link } from "react-router-dom"
import { signInWithPopup } from "firebase/auth"
import { auth, provider } from "../../../firebase"

export default function LoginForm() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    //for togging the show password button
    const [showpassword, setShowpassword] = useState(false)


    const queryClient = useQueryClient()

    //call the login api
    const { mutate: loginMutation, isPending } = useMutation({
        mutationFn: async (userData: { email: string, password: string }) => {
            const res = await axiosInstance.post("/auth/login", userData)
            return res.data
        },
        onSuccess: () => {
            //re-fetch the authenticated user's data
            queryClient.invalidateQueries({ queryKey: ["authUser"] })
        },
        onError: (err: any) => {
            toast.error(err.response.data.message || "Error while login")
        }
    })


    //button function for username, password login
    async function handleLogin(e: any) {
        e.preventDefault()
        //call the login mutation
        loginMutation({ email, password })
    }

    //button function for guest login
    function handleGuestLogin()
    {
        //call the mutation function with default values
        loginMutation({email:"kaptaanjacksparrow106@gmail.com", password:"123456"})
    }
    //mutation for provider login
    const { mutate: providerLoginMutation, isPending: isProviderPending } = useMutation({
        mutationFn: async () => {
            try{
                const res = await signInWithPopup(auth,provider)
                const uid = res.user.uid 
                const response = await axiosInstance.post("/auth/providerLogin", {uid})
                return response.data
            }
            catch(err)
            {
                throw err 
            }
        },
        onSuccess: ()=>{
            //re-fetch
            queryClient.invalidateQueries({queryKey: ["authUser"]})
        },
        onError: (err:any)=>{
            toast.error(err.response.data.message || "Something went wrong")
        }
    })

    return <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-xl p-8 flex flex-col "
    >
        <h1 className="text-3xl font-bold text-center text-white mb-6">Welcome Back</h1>
        <form onSubmit={handleLogin} className="space-y-5">

            <Input
                icon={Mail}
                type="text"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
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
                {isPending ? <Loader className="animate-spin m-auto" /> : "Sign in"}
            </motion.button>
        </form>
        {/* Divider */}
        <div className="flex items-center my-6">
            <hr className="flex-1 border-gray-500" />
            <span className="px-3 text-gray-300 text-sm">OR</span>
            <hr className="flex-1 border-gray-500" />
        </div>

        {/* Google login */}
        <motion.button
            type="button"
            className="w-full py-3 px-4 bg-white text-gray-700 font-semibold rounded-lg shadow-lg flex items-center justify-center gap-2 hover:bg-gray-100 transition cursor-pointer"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => providerLoginMutation()}
            disabled={isProviderPending}
        >
            {isProviderPending ? <Loader className="animate-spin w-5 h-5 mx-auto" /> : (
                <div className="flex justify-center items-center">
                    <img src="/google.png" alt="google_img" className="w-5 h-5 mr-2" />
                    <span>Login with Google</span>
                </div>
            )}
        </motion.button>

        {/* Signup link */}
        <p className="text-sm text-gray-200 text-center mt-6">
            New to <span className="font-semibold">Sonic Wave</span>?{" "}
            <Link to={"/signup"} className="text-yellow-400 hover:underline">
                Sign up {" "}
            </Link>
            {" "} or {" "}
            <button className="cursor-pointer" onClick={handleGuestLogin}>
                <p className="text-yellow-400 hover:underline">Guest Login</p>
            </button>
        </p>


    </motion.div>
}
