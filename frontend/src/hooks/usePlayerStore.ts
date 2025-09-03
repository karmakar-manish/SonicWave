import { create } from "zustand"
import type { songInterface } from "../types/index"
import { useChatStore } from "./useChatStore"


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

        //get the socket and update the socket when playing songs
        const socket = useChatStore.getState().socket
        if (socket.auth) {
            socket.emit("update_activity", {
                userId: socket.auth.userId,
                activity: `Playing ${song.title} by ${song.artist}`
            })

        }

        set({
            queue: songs,
            currentSong: song,
            currentIndex: startIndex,
            isPlaying: true
        })
    },

    setCurrentSong: (song: songInterface | null) => {
        if (!song) return

        //get the socket and update the socket when playing songs
        const socket = useChatStore.getState().socket
        if (socket.auth) {
            socket.emit("update_activity", {
                userId: socket.auth.userId,
                activity: `Playing ${song.title} by ${song.artist}`
            })

        }

        const songIndex = get().queue.findIndex(s => s.id == song.id)

        set({
            currentSong: song,
            isPlaying: true,
            currentIndex: songIndex !== -1 ? songIndex : get().currentIndex
        })
    },

    togglePlay: () => {
        const willStartPlaying = !get().isPlaying

        const currentSong = get().currentSong
        //get the socket and update the socket when playing songs
        const socket = useChatStore.getState().socket
        if (socket.auth) {
            socket.emit("update_activity", {
                userId: socket.auth.userId,
                activity: willStartPlaying && currentSong ? `Playing ${currentSong.title} by ${currentSong.artist}` : "Idle"
            })

        }

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

            //get the socket and update the socket when playing songs
            const socket = useChatStore.getState().socket
            if (socket.auth) {
                socket.emit("update_activity", {
                    userId: socket.auth.userId,
                    activity: `Playing ${nextSong.title} by ${nextSong.artist}`
                })

            }

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
            //get the socket and update the socket when playing songs
            const socket = useChatStore.getState().socket
            if (socket.auth) {
                socket.emit("update_activity", {
                    userId: socket.auth.userId,
                    activity: "Idle"
                })
            }
        }
    },


    playPrevious: () => {
        const { currentIndex, queue } = get() //get the data

        const prevInd = currentIndex - 1;

        //if there is a previous song
        if (prevInd >= 0) {
            const prevSong = queue[prevInd]

            //get the socket and update the socket when playing songs
            const socket = useChatStore.getState().socket
            if (socket.auth) {
                socket.emit("update_activity", {
                    userId: socket.auth.userId,
                    activity: `Playing ${prevSong.title} by ${prevSong.artist}`
                })

            }

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

            //get the socket and update the socket when playing songs
            const socket = useChatStore.getState().socket
            if (socket.auth) {
                socket.emit("update_activity", {
                    userId: socket.auth.userId,
                    activity: "Idle"
                })

            }
        }
    }

}))