import { Music } from "lucide-react"
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import SignupForm from "./components/SignupForm"

export default function SignupPage()
{
    const navigate = useNavigate()

    return (
        <div className="h-screen w-full flex justify-center items-center bg-gradient-to-b from-violet-400 to-violet-900 via-violet-600 bg-black">
            <div className="border border-violet-300/20  bg-purple-900/60 backdrop-blur-xl p-10 rounded-2xl h-[90vh] w-[90vw] grid grid-cols-1 lg:grid-cols-2 gap-10 shadow-2xl">

                {/* left div  */}
                <motion.div
                    initial={{ opacity: 0, x: -40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.7 }}
                    className=" text-center px-6 hidden  my-auto justify-center lg:flex flex-col items-center"
                >
                    <button className="relative cursor-pointer" onClick={() => navigate("/")}>
                        <Music className="size-32 text-white animate-bounce m-auto drop-shadow-[0_0_20px_rgba(255,255,255,0.4)]" />
                    </button>
                    <h1 className="text-white font-bold font-serif text-5xl mt-6 bg-gradient-to-r from-yellow-300 via-pink-300 to-orange-400 bg-clip-text ">
                        Sonic Wave
                    </h1>
                    <p className="text-base text-zinc-200 px-6 mt-4 max-w-md leading-relaxed">
                        Immerse yourself in music's endless possibilities.
                    </p>
                    <p className="text-sm text-zinc-400 italic mt-2">
                        "Find your groove."
                    </p>
                </motion.div>


                {/* right div  */}
                <div className="w-full flex justify-center items-center">
                    <SignupForm />
                </div>
            </div>
        </div>
    )
}