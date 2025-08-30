import { create } from "zustand"
import type { songInterface } from "../types/index"


interface PlayerStore {
    currentSong: songInterface | null
    isPlaying: boolean
    queue: songInterface[]
    currentIndex: number


    initializeQueue: (songs: songInterface[]) => void
    playAlbum: (songs: songInterface[], startIndex?: number) => void
    setCurrentSong: (song: songInterface | null) => void
    togglePlay: () => void
    playNext: () => void
    playPrevious: () => void
}

export const usePlayerStore = create<PlayerStore>((set, get) => ({
    currentSong: null,
    isPlaying: false,
    queue: [],
    currentIndex: -1,

    initializeQueue: (songs: songInterface[]) => {
        set({
            queue: songs,
            currentSong: get().currentSong || songs[0],
            currentIndex: get().currentIndex === -1 ? 0 : get().currentIndex
        })
    },

    playAlbum: (songs: songInterface[], startIndex = 0) => {
        if (songs.length === 0) return

        const song = songs[startIndex]

        set({
            queue: songs,
            currentSong: song,
            currentIndex: startIndex,
            isPlaying: true
        })
    },

    setCurrentSong: (song: songInterface | null) => {
        if (!song) return

        const songIndex = get().queue.findIndex(s => s.id == song.id)

        set({
            currentSong: song,
            isPlaying: true,
            currentIndex: songIndex !== -1 ? songIndex : get().currentIndex
        })
    },

    togglePlay: () => {
        const willStartPlaying = !get().isPlaying

        set({
            isPlaying: willStartPlaying
        })
    },

    playNext: () => {
        const { currentIndex, queue } = get() //get the data
        const nextInd = currentIndex + 1

        //if there is a next song, then play it
        if (nextInd < queue.length) {
            const nextSong = queue[nextInd]
            set({
                currentSong: nextSong,
                currentIndex: nextInd,
                isPlaying: true
            })
        }
        else {
            //no next song
            set({
                isPlaying: false
            })
        }
    },


    playPrevious: () => {
        const { currentIndex, queue } = get() //get the data

        const prevInd = currentIndex - 1;

        //if there is a previous song
        if (prevInd >= 0) {
            const prevSong = queue[prevInd]
            set({
                currentSong: prevSong,
                currentIndex: prevInd,
                isPlaying: true
            })
        }
        else {
            set({
                isPlaying: false    //no prev song
            })
        }
    }

}))