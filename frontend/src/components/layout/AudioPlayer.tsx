import { usePlayerStore } from "../../hooks/usePlayerStore"
import { useEffect, useRef } from "react"

export default function AudioPlayer() {
    const audioRef = useRef<HTMLAudioElement>(null)
    const prevSongRef = useRef<string | null>(null)

    const { currentSong, isPlaying, playNext } = usePlayerStore()   //the hook

    //handle play/pause logic
    useEffect(() => {
        if (isPlaying) audioRef.current?.play()
        else audioRef.current?.pause()
    }, [isPlaying])

    //handle song change logic
    useEffect(() => {
        const audio = audioRef.current

        function handleEnded() {
            playNext()
        }

        //play the next song when current song ended
        audio?.addEventListener("ended", handleEnded)

        //remove event listener while unmounting
        return () => audio?.removeEventListener("ended", handleEnded)
    }, [playNext])


    //handle song change logic and the playback position
    useEffect(() => {
        if (!audioRef.current || !currentSong) return;

        const audio = audioRef.current

        //check if this is actually a new song
        const isSongChange = prevSongRef.current !== currentSong?.audioUrl
        if (isSongChange) {
            audio.src = currentSong?.audioUrl   //change the audio source
            //reset the playback position
            audio.currentTime = 0

            prevSongRef.current = currentSong?.audioUrl

            if (isPlaying) audio.play()
        }
    }, [currentSong, isPlaying])




    return <audio ref={audioRef} />
}