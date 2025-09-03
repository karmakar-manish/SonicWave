import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios"
// import { toast } from "react-toastify";

export function useFetchUsers() {
    return useQuery({
        queryKey: ["getAllUsers"],
        queryFn: async () => {
            try {
                const res = await axiosInstance.get("/users")
                return res.data
            }
            catch(err:any)
            {
                return null 
            }
        }

    })
}

// //fetch all the messages of the user
// export function useFetchMessages(authUserId?:number){
//     return useQuery({
//         queryKey: ["getAllMessages", authUserId],
//         enabled: !!authUserId,   //only run when userId exists
//         queryFn: async()=>{
//             try{
//                 const res = await axiosInstance.get(`/users/messages/${authUserId}`)
//                 return res.data
//             }
//             catch(err:any){
//                 console.log("Error from fetch message hook: ", err);
//                 toast.error(err.response.data.message || "Error while fetching messages")
//                 throw err
//             }
//         }
//     })
// }

