import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import {toast} from "react-toastify"
import { useChatStore } from "./useChatStore";

export function useAuthUserHook() {
    const {initSocket} = useChatStore()
    return useQuery({
        queryKey: ["authUser"],
        queryFn: async () => {
            try {
                const res = await axiosInstance.get("/auth/me") //getting current user details

                //initialize token
                if(res.data.id)
                    initSocket(res.data.id)
                return res.data
            } catch (err: any) {
                //for preventing popup for the first time
                if (err.response && err.response.status === 401)
                    return null;
                toast.error(err.response.data.message || "Something went wrong")
            }
        }
    })
}