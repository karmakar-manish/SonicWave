import { useEffect, useRef, useState } from "react"
import { usePlayerStore } from "../../hooks/usePlayerStore"
import { Laptop2, ListMusic, Mic2, PauseCircle, PlayCircle, Repeat, Shuffle, SkipBack, SkipForward, Volume1, VolumeOff } from "lucide-react"
import { formatDuration } from "../../pages/album/AlbumPage"

export default function PlaybackControl() {
    const { currentSong, isPlaying, togglePlay, playNext, playPrevious } = usePlayerStore()

    const [volume, setVolume] = useState(75)
    const [prevVolume, setPrevVolume] = useState(75)
    const [currentTime, setCurrentTime] = useState(0)
    const [duration, setDuration] = useState(0)
    const audioRef = useRef<HTMLAudioElement | null>(null)

    useEffect(() => {
        audioRef.current = document.querySelector("audio")
        const audio = audioRef.current

        if (!audio) return

        function updateTime() {
            setCurrentTime(audio?.currentTime ?? 0) // default value
        }

        function updateDuration() {
            setDuration(audio?.duration ?? 0)   // default value
        }

        audio.addEventListener("timeupdate", updateTime)
        audio.addEventListener("loadedmetadata", updateDuration)

        //this will handle what to do when music ends
        function handleEnded() {
            usePlayerStore.setState({ isPlaying: false })
        }
        audio.addEventListener("ended", handleEnded)

        return () => {
            audio.removeEventListener("timeupdate", updateTime)
            audio.removeEventListener("loadedmetadata", updateDuration)
            audio.removeEventListener("ended", handleEnded)
        }
    }, [currentSong])

    function handleSeek(value: number) {
        if (audioRef.current)
            audioRef.current.currentTime = value
    }

    return <footer className="h-15 sm:h-19 bg-zinc-900 border-t border-zinc-800 px-4">
        <div className="flex justify-between items-center h-full max-w-[1800px] mx-auto">
            {/* currently playing song  */}
            <div className="hidden sm:flex items-center gap-4 min-w-[180px] w-[30%]">
                {currentSong && (
                    <>
                        <img
                            src={currentSong.imageUrl}
                            alt={currentSong.title}
                            className="w-14 h-14 object-cover rounded-md"
                        />

                        <div className="flex-1 min-w-0">
                            <div className="font-medium truncate hover:underline cursor-pointer">
                                {currentSong.title}
                            </div>
                            <div className="text-sm text-zinc-400 truncate hover:underline cursor-pointer">
                                {currentSong.artist}
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* player controls  */}
            <div className="flex flex-col items-center gap-2 flex-1 max-w-full sm:max-w-[45%] ">
                <div className="flex items-center gap-4 sm:gap-6">

                    <button className="size-6 btn-ghost hidden sm:inline-flex hover:text-white text-zinc-200 justify-center items-center cursor-pointer ">
                        <Shuffle className="size-4" />
                    </button>

                    <button className="btn-ghost hover:text-white text-zinc-400 cursor-pointer"
                        onClick={playPrevious} disabled={!currentSong}>
                        <SkipBack className="size-4" />
                    </button>

                    <button className="btn-ghost hover:text-white text-zinc-400 cursor-pointer"
                        onClick={togglePlay} disabled={!currentSong}>
                        {isPlaying ? <PauseCircle className="size-6 " /> : <PlayCircle className="size-6" />}
                    </button>

                    <button className="btn-ghost hover:text-white text-zinc-400 cursor-pointer"
                        onClick={playNext} disabled={!currentSong}>
                        <SkipForward className="size-4" />
                    </button>

                    <button className="btn-ghost hover:text-white text-zinc-200 inline-flex cursor-pointer"
                        onClick={playNext} disabled={!currentSong}>
                        <Repeat className="size-4" />
                    </button>
                </div>

                <div className="hidden sm:flex items-center gap-2 w-full">
                    <div className="text-xs text-zinc-400">
                        {formatDuration(currentTime)}</div>
                    <input
                        type="range"
                        min={0}
                        max={duration || 100}
                        step={1}
                        value={currentTime}
                        onChange={(e) => handleSeek(Number(e.target.value))}
                        className="w-full hover:cursor-grab active:cursor-grabbing"
                    />
                    <div className="text-xs text-zinc-400">{formatDuration(duration)}</div>
                </div>
            </div>

            {/* volume controls  */}
            <div className="hidden sm:flex items-center gap-4 min-w-[180px] w-[30%] justify-end">
                <button className="btn-ghost hover:text-white text-zinc-400">
                    <Mic2 className="size-4" />
                </button>
                <button className="btn-ghost hover:text-white text-zinc-400">
                    <ListMusic className="size-4" />
                </button>
                <button className="btn-ghost hover:text-white text-zinc-400">
                    <Laptop2 className="size-4" />
                </button>

                <div className="flex items-center gap-2">
                    <button className="btn-ghost hover:text-white text-zinc-400 cursor-pointer"
                        onClick={() => {
                            let newVolume = volume

                            if (volume === 0)
                            {
                                // restore prev volume 
                                newVolume=prevVolume
                                setVolume(prevVolume)
                            }

                            else {
                                setPrevVolume(volume)
                                newVolume=0 //mute
                                setVolume(0)
                            }

                            if (audioRef.current) {
                                audioRef.current.volume = newVolume / 100
                            }
                        }
                        }>
                        {volume === 0 ? (
                            <VolumeOff className="size-4 text-red-400" />
                        ) : (
                            <Volume1 className="size-4 " />
                        )}
                    </button>

                    <input
                        type="range"
                        max={100}
                        step={1}
                        value={volume}
                        onChange={(e) => {
                            const newVolume = Number(e.target.value)
                            setVolume(newVolume)
                            if (audioRef.current) {
                                audioRef.current.volume = newVolume / 100
                            }
                        }}
                        className="w-24 hover:cursor-grab active:cursor-grabbing"
                    />
                </div>
            </div>
        </div>
    </footer >
}