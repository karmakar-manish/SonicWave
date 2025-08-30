import { Pause, Play } from "lucide-react";
import { usePlayerStore } from "../../../hooks/usePlayerStore";
import type { songInterface } from "../../../types/index";

export default function PlayButton({ song }: { song: songInterface }) {
    const { currentSong, isPlaying, setCurrentSong, togglePlay } = usePlayerStore()

    //checking if the current song is playing
    const isCurrentSong = currentSong?.id === song.id

    function handlePlay() {
        if (isCurrentSong) togglePlay()    //change the button
        else setCurrentSong(song)   //start playing the song
    }

    return <button onClick={handlePlay}
        className={`absolute bottom-4 right-2 bg-green-500 hover:bg-green-400 hover:scale-105 transition-all opacity-0 translate-y-2 group-hover:translate-y-0 p-1 rounded-sm cursor-pointer
    ${isCurrentSong ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
        
        {isCurrentSong && isPlaying ? (
            <Pause className="size-5 text-black"/>
        ): (
            <Play className="size-5 text-black"/>
        )}
    </button>
}