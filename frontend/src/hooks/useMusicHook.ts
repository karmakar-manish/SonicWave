import { axiosInstance } from "../lib/axios"
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";


//get all the albums
export function useAlbums() {
    return useQuery({
        queryKey: ["allAlbums"],
        queryFn: async () => {
            try {
                const res = await axiosInstance.get("/albums")
                return res.data
            } catch (err: any) {
                toast.error(err.response.data.message || "Error while fetching albums")
            }
        }
    })
}

//get the album with the given id
export function useAlbumById(albumId: string) {
    return useQuery({
        queryKey: ["currentALbum", albumId],
        queryFn: async () => {
            try {
                const res = await axiosInstance.get(`/albums/${albumId}`)
                return res.data
            }
            catch (err: any) {
                toast.error(err.response.data.message || "Error while fetching album")
                throw err
            }
        },
        enabled: !!albumId  //don't run till we have an album id

    })
}

//get featured songs
export function useFeaturedSongs() {
    return useQuery({
        queryKey: ["featuredSongs"],
        queryFn: async () => {
            try {
                const res = await axiosInstance.get("/songs/featured")
                return res.data

            } catch (err: any) {
                toast.error(err.response.data.message || "Error while fetching featured songs")
                throw err
            }
        }
    })
}


//get trending songs
export function useTrendingSongs() {
    return useQuery({
        queryKey: ["trendingSongs"],
        queryFn: async () => {
            try {
                const res = await axiosInstance.get("/songs/trending")
                return res.data

            } catch (err: any) {
                toast.error(err.response.data.message || "Error while fetching trending songs")
                throw err
            }
        }
    })
}


//get madeForyouSongs
export function useMadeForYouSongs() {
    return useQuery({
        queryKey: ["madeForYouSongs"],
        queryFn: async () => {
            try {
                const res = await axiosInstance.get("/songs/made-for-you")
                return res.data
            } catch (err: any) {
                toast.error(err.response.data.message || "Error while fetching madeForYou songs")
                throw err
            }
        }
    })
}