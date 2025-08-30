import { useParams } from "react-router-dom"
import { useAlbumById } from "../../hooks/useMusicHook"
import { Clock, Pause, Play } from "lucide-react"
import type { songInterface } from "../../types/index"
import { usePlayerStore } from "../../hooks/usePlayerStore"


export function formatDuration(seconds: number) {
    const floored = Math.floor(seconds)     //drop decimal part 
    const minutes = Math.floor(floored / 60)
    const remainingSeconds = floored % 60

    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
}

export default function AlbumPage() {
    const { albumId } = useParams()   //from the parameter
    const { data: currentALbum } = useAlbumById(albumId!)

    const { currentSong, isPlaying, playAlbum, togglePlay } = usePlayerStore()

    //to start and pause playing the song
    function handlePlayAlbum() {
        if (!currentALbum) return

        const isCurrentAlbumPlaying = currentALbum?.songs.some((song: any) => song.id === currentSong?.id)

        //incase the current song is already playing
        if (isCurrentAlbumPlaying) togglePlay()
        else {
            //start playing the album from the beginning'
            playAlbum(currentALbum?.songs, 0)
        }
    }

    //this will play the current song
    function handlePlaySong(index: number) {
        if (!currentALbum) return

        playAlbum(currentALbum?.songs, index)
    }

    return <div className="h-full">
        <div className="h-full">
            <div className="relative min-h-full">
                {/* bg-gradient decoration  */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#5038a0]/80 via-zinc-900/80 to-zinc-900 pointer-events-none rounded-md" />

                {/* content  */}
                <div className="relative z-10 ">
                    <div className="flex p-6 gap-6 pb-8">
                        <img src={currentALbum?.imageUrl} alt={currentALbum?.title}
                            className="w-[240px] h-[240px] shadow-xl rounded" />

                        <div className="flex flex-col justify-end">
                            <p className="text-sm font-medium">Album</p>
                            <h1 className="text-7xl font-bold my-4">{currentALbum?.title}</h1>

                            <div className="flex items-center gap-2 text-sm text-zinc-100">
                                <span className="font-medium text-white">{currentALbum?.artist}</span>
                                <span>• {currentALbum?.songs.length} songs</span>
                                <span>• {currentALbum?.releaseYear}</span>
                            </div>
                        </div>
                    </div>

                    {/* Play button  */}
                    <div className="px-6 pb-4 flex items-center gap-6">
                        <button onClick={handlePlayAlbum}
                            className="rounded-full bg-green-500 hover:bg-green-400 hover:scale-105 transition cursor-pointer p-2">
                            {isPlaying && currentALbum?.songs.some((song: any) => song.id === currentSong?.id) ? (
                                // if we are in another album, we donot want to show the pause button there also
                                <Pause className="size-7 text-black" />
                            ) : (
                                <Play className="size-7 text-black" />
                            )}
                        </button>
                    </div>

                    {/* table section  */}
                    <div className="bg-black/20 backdrop-blur-sm h-70 overflow-y-auto pb-20">
                        {/* table header  */}
                        <div className="grid grid-cols-[16px_4fr_2fr_1fr] gap-4 px-10 py-2 text-sm">
                            <div className="text-md">#</div>
                            <div>Title</div>
                            <div>Released Date</div>
                            <div>
                                <Clock size={15} />
                            </div>
                        </div>

                        {/* Songs list  */}
                        <div className="px-6">
                            <div className="space-y-2 py-4">
                                {currentALbum?.songs.map((song: songInterface, index: number) => {

                                    const isCurrentSong = currentSong?.id === song.id

                                    return (
                                        <div key={index} onClick={() => handlePlaySong(index)} className="grid grid-cols-[16px_4fr_2fr_1fr] gap-4 px-4 py-2 text-sm text-zinc-400 hover:bg-white/5 rounded-md group cursor-pointer">

                                            <div className="flex items-center justify-center">
                                                {isCurrentSong && isPlaying ? (
                                                    <div className="size-4 text-green-500">♫</div>
                                                ) : (
                                                    <span className="group-hover:hidden">{index + 1}</span>
                                                )}

                                                {/* only show if this is not the current song playing  */}
                                                {!currentSong && (
                                                    <Play className="size-4 hidden group-hover:block" />
                                                )}

                                            </div>

                                            <div className="flex items-center gap-3">
                                                <img src={song.imageUrl} alt={song.title} className="size-10" />


                                                <div className="">
                                                    <div className="font-medium text-white">{song.title}</div>
                                                    <div>{song.artist}</div>
                                                </div>

                                            </div>
                                            <div className="flex items-center">
                                                {song.createdAt.split("T")[0]}
                                            </div>

                                            <div className="flex items-center">
                                                {formatDuration(song.duration)}
                                            </div>

                                        </div>
                                    )
                                })}

                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </div>
    </div>
}