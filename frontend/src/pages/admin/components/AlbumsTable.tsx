import { useMutation, useQueryClient } from "@tanstack/react-query"
import { axiosInstance } from "../../../lib/axios"
import { toast } from "react-toastify"
import { useFetchAlbums } from "../../../hooks/useMusicHook"
import { Calendar, Loader, Music, Trash2 } from "lucide-react"
import type { albumInterface } from "../../../types"

export default function AlbumTable() {
    const queryClient = useQueryClient()
    const { data: allAlbums, isLoading } = useFetchAlbums()

    //mutation to delete an album 
    const { mutate: deleteAlbumMutation, isPending: isAlbumDeleting } = useMutation({
        mutationFn: async (id: number) => {
            await axiosInstance.delete(`/admin/albums/${id}`)
        },
        onSuccess: () => {
            toast.success("Album deleted successfully!")
            queryClient.invalidateQueries({ queryKey: ["allAlbums"] }) //refetch
            queryClient.invalidateQueries({ queryKey: ["allStats"] }) //refetch
        },
        onError: (err: any) => {
            toast.error(err.respose.data.error || "Error deleting album!")
        }
    })

    if (isLoading) {
        return <div className="flex flex-col items-center justify-center">
            <Loader className="animate-spin size-7 text-green-500" />
            <div className="text-zinc-400">Loading albums...</div>
        </div>
    }

    return <div>
        {/* table section  */}
        <div className="bg-black/20 backdrop-blur-sm h-70 overflow-y-auto pb-20 mt-5">

            {/* table header  */}
            <div className="grid grid-cols-[1fr__1fr_1fr_1fr_auto] gap-4 px-10 py-2 text-sm hover:bg-zinc-800/50 rounded-md sticky top-0 bg-black z-10">
                <div className="pl-8">Title</div>
                <div className="pl-8">Artist</div>
                <div className=" pl-6">Released Year</div>
                <div className="pl-8">Songs</div>
                <div className="justify-self-end">Actions</div>
            </div>

            {/* table rows  */}
            <div>
                {allAlbums?.map((album: albumInterface) => (
                    <div key={album.id} className="grid grid-cols-[1fr_1fr_1fr_1fr_auto] gap-4 px-10 py-2 hover:bg-zinc-800/50 items-center rounded-md">
                        <div className="flex gap-2 items-center">
                            <img src={album.imageUrl} alt={album.title} className="size-10 rounded object-cover" />
                            <div className="font-medium">{album.title}</div>
                        </div>
                        <div>{album.artist}</div>
                        <div>
                            <span className="inline-flex items-center gap-1 text-zinc-400">
                                <Calendar className="size-4" />
                                {album.releaseYear}
                            </span>
                        </div>
                        <div>
                            <span className="inline-flex items-center gap-1 text-zinc-400">
                                <Music className="size-4" />
                                {album.songs.length} songs
                            </span>
                        </div>
                        <button className={`btn-ghost text-red-400 hover:text-red-300 hover:bg-red-400/10 ${isAlbumDeleting ? "cursor-not-allowed" : "cursor-pointer"}`}
                            onClick={() => deleteAlbumMutation(album.id)}
                            disabled={isAlbumDeleting}
                        >
                            <Trash2 className="size-4" />
                        </button>
                    </div>
                ))}
            </div>

        </div>

    </div>
}