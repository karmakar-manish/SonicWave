import { useAuthUserHook } from "../../hooks/useAuthUserHook"
import { HomeIcon, Library, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import PlaylistSkeleton from "../skeletons/PlaylistSkeleton";
import {  useFetchAlbums } from "../../hooks/useMusicHook";
import type { albumInterface } from "@/types";

export default function LeftSidebar() {
    const { data: authUser } = useAuthUserHook()

    const {data: allAlbums, isPending: isAlbumsLoading} = useFetchAlbums()


    return <div className="h-full flex flex-col gap-2">
        {/* Navigation Menu  */}
        <div className="rounded-lg bg-zinc-900 w-full text-white flex flex-col p-2 h-auto overflow-hidden text-ellipsis">

            {/* Home button  */}
            <div className="flex items-center gap-2">
                <Link to={"/"}
                    className="cursor-pointer flex items-center w-full gap-2 p-2 rounded-md hover:bg-zinc-800 transition overflow-hidden">
                    <HomeIcon className="size-5 mr-2 flex-shrink-0 " />
                    <span>Home</span>
                </Link>
            </div>


            {/* message button  */}
            {authUser && (
                <div className="flex items-center gap-2">
                    <Link to={"/chat"}
                        className="w-full cursor-pointer flex items-center gap-2 p-2 rounded-md hover:bg-zinc-800 transition">
                        <MessageCircle className="size-5 mr-2 flex-shrink-0" />
                        <span>Messages</span>
                    </Link>

                </div>
            )}
        </div>


        {/* Library section  */}
        <div className="flex-1 rounded-lg bg-zinc-900 p-4 overflow-hidden"> 
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center text-white px-2">
                    <Library className="size-6 mr-2" />
                    <span className="text-ellipsis">Playlists</span>
                </div>
            </div>

            {/* Scroll Area  */}
            <div className="h-[calc(100vh-300px)] overflow-auto">
                <div className="space-y-2 ">
                    {isAlbumsLoading ? (
                        <PlaylistSkeleton/>
                    ): (
                        allAlbums.map((album: albumInterface) => (
                            <Link  to={`/albums/${album.id}`}
                            key={album.id}
                            className="p-2 flex items-center hover:bg-zinc-800 rounded-md gap-3 group cursor-pointer">
                                <img src={album.imageUrl} alt="Playlist img"
                                className="size-12 rounded-md object-cover" />
                                
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium truncate">{album.title}</p>
                                    <p className="text-sm text-zinc-400 truncate">Album • {album.artist}</p>
                                </div>
                            </Link>
                        ))
                    )}
                </div>
            </div>

        </div>
    </div>
}