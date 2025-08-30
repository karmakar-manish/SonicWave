import { axiosInstance } from "../lib/axios"
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";

export function useCheckAdmin(options={}) {
    return useQuery({
        queryKey: ["isAdmin"],
        queryFn: async () => {
            try {
                const res = await axiosInstance.get("/admin/checkAdmin")
                return res.data
            } catch (err: any) {
                toast.error(err.response.data.message || "Error while fetching albums")
                throw err
            }
        },
        ...options 
    })
}