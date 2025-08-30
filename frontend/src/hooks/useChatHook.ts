import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios"

export function useFetchUsers() {
    return useQuery({
        queryKey: ["getAllUsers"],
        queryFn: async () => {
            try {
                const res = await axiosInstance.get("/users/")
                return res.data
            }
            catch(err:any)
            {
                return null 
            }
        }

    })
}