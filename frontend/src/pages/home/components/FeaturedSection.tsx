import type { songInterface } from "@/types"
import FeaturedGridSkeleton from "../../../components/skeletons/FeaturedGridSkeleton"
import { useFeaturedSongs } from "../../../hooks/useMusicHook"
import PlayButton from "./PlayButton"

export default function FeaturedSection()
{
    const { data: featuredSongs, isPending } = useFeaturedSongs()

    //incase of loading, return the skeleton
    if(isPending)
    {
        return <FeaturedGridSkeleton/>
    }


    return <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
         {featuredSongs?.map((song: songInterface)=>(
            <div key={song.id} className="flex items-center relative bg-zinc-800/50 rounded-md hover:bg-zinc-700/50 transition-colors group cursor-pointer">
                <img src={song.imageUrl} alt={song.title}
                className="w-16 sm:w-20 h-16 sm:h-20 object-cover rounded-l-md" />
                <div className="flex-1 p-4 truncate">
                    <p className="font-medium truncate">{song.title}</p>
                    <p className="text-sm truncate text-zinc-400 ">{song.artist}</p>
                </div>

                <PlayButton song={song}/>
            </div>
            
         ))}
    </div>
}