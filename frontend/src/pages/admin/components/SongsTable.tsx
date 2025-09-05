import { Calendar, Loader, Trash2 } from "lucide-react"
import { useFetchSongs } from "../../../hooks/useMusicHook"
import type { songInterface } from "../../../types"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { axiosInstance } from "../../../lib/axios"
import { toast } from "react-toastify"

export default function SongsTable() {
    const queryClient = useQueryClient()
    const { data: allSongs, isLoading } = useFetchSongs()


    //mutation to delete a song
    const { mutate: deleteSongMutation, isPending: isSongDeleting } = useMutation({
        mutationFn: async (id: number) => {
            await axiosInstance.delete(`/admin/songs/${id}`)
        },
        onSuccess: () => {
            toast.success("Song deleted successfully!")
            queryClient.invalidateQueries({ queryKey: ["allSongs"] }) //refetch
            queryClient.invalidateQueries({ queryKey: ["allStats"] }) //refetch
        },
        onError: (err: any) => {
            toast.error(err.respose.data.error)
        }
    })


    if (isLoading) {
        return <div className="flex flex-col items-center justify-center">
            <Loader className="animate-spin size-7 text-green-500" />
            <div className="text-zinc-400">Loading songs...</div>
        </div>
    }

    return <div>
        {/* table section  */}
        <div className="bg-black/20 backdrop-blur-sm h-70 overflow-y-auto pb-20 mt-5">

            {/* table header  */}
            <div className="grid grid-cols-[1fr_1fr_1fr_auto] gap-4 px-10 py-2 text-sm hover:bg-zinc-800/50 rounded-md sticky top-0 bg-black z-10">
                <div className="pl-8">Title</div>
                <div className="pl-8">Artist</div>
                <div className=" pl-8">Released Date</div>
                <div className="justify-self-end">Actions</div>
            </div>

            {/* table rows  */}
            <div>
                {allSongs?.map((song: songInterface) => (
                    <div key={song.id} className="grid grid-cols-[1fr_1fr_1fr_auto] gap-4 px-10 py-2 hover:bg-zinc-800/50 items-center rounded-md">
                        <div className="flex gap-2 items-center">
                            <img src={song.imageUrl} alt={song.title} className="size-10 rounded object-cover" />
                            <div className="font-medium">{song.title}</div>
                        </div>
                        <div>{song.artist}</div>
                        <div>
                            <span className="inline-flex items-center gap-1 text-zinc-400">
                                <Calendar className="size-4" />
                                {song.createdAt.split("T")[0]}
                            </span>
                        </div>
                        <button className={`btn-ghost text-red-400 hover:text-red-300 hover:bg-red-400/10 
                        ${isSongDeleting ? "cursor-not-allowed" : "cursor-pointer"}`}
                            onClick={() => deleteSongMutation(song.id)}
                            disabled={isSongDeleting}
                        >
                            <Trash2 className="size-4" />
                        </button>
                    </div>
                ))}
            </div>

        </div>

    </div>
}