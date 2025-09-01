import type { songInterface } from "@/types"
import SectionGridSkeleton from "../../../components/skeletons/SectionGridSkeleton"
import PlayButton from "./PlayButton"

export default function SectionGrid({title, songs, isPending}: {
    title: string
    songs: any
    isPending: boolean
})
{
    //incase of pending
    if(isPending)
    {
        return <SectionGridSkeleton/>
    }
    

    return (
        <div className="mb-8">
            <div className="flex items-center justify-between mb-4 px-1">
                <h2 className="text-xl sm:text-2xl font-bold">{title}</h2>
                <button className="text-sm text-zinc-400 hover:text-white cursor-pointer">Show all</button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {songs?.map((song: songInterface)=>(
                    <div key={song.id} className="bg-zinc-800/40 p-4 rounded-md hover:bg-zinc-700/40 transition-all group cursor-pointer">
                        <div className="relative mb-4">
                            <div className="aspect-square rounded-md shadow-lg overflow-hidden">
                                <img src={song.imageUrl} alt={song.title}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />

                                {/* TODO: Add play button  */}
                                <PlayButton song={song}/>
                            </div>
                        </div>
                        <h3 className="font-medium mb-2 truncate">{song.title}</h3>
                        <p className="text-sm text-zinc-400 truncate">{song.artist}</p>
                    </div>
                ))}


            </div>
        </div>
    )
}