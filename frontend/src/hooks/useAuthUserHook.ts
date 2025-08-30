import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import {toast} from "react-toastify"

export function useAuthUserHook() {
    return useQuery({
        queryKey: ["authUser"],
        queryFn: async () => {
            try {
                const res = await axiosInstance.get("/auth/me") //getting current user details
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