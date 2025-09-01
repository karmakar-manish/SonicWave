import { useRef, useState } from "react"
import { useFetchAlbums } from "../../../hooks/useMusicHook"
import { PlusCircle, Upload, X } from "lucide-react"
import type { albumInterface } from "../../../types"
import { toast } from "react-toastify"
import { axiosInstance } from "../../../lib/axios"

interface NewSong {
    title: string,
    artist: string,
    album: string,
    duration: string
}

export default function AddSongDialog() {
    const { data: allAlbums } = useFetchAlbums()

    const [songDialogOpen, setSongDialogOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const [newSong, setNewSong] = useState<NewSong>({
        title: "",
        artist: "",
        album: "",
        duration: "0"
    })

    const [files, setFiles] = useState<{ audio: File | null, image: File | null }>({
        audio: null,
        image: null
    })

    const audioInputRef = useRef<HTMLInputElement>(null)
    const imageInputRef = useRef<HTMLInputElement>(null)

    async function handleSubmit(e: any) {
        e.preventDefault()
        setIsLoading(true)

        try {
            if (!files.audio || !files.image) {
                return toast.error("Please upload both audio and image files")
            }
            const formData = new FormData()

            formData.append("title", newSong.title)
            formData.append("artist", newSong.artist)
            formData.append("duration", newSong.duration.toString())

            //'none' is given in the option value
            if (newSong.album && newSong.album !== "none") {
                formData.append("albumId", newSong.album)
            }

            formData.append("audioFile", files.audio)
            formData.append("imageFile", files.image)

            await axiosInstance.post("/admin/songs", formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    }
                }
            )

            //reset state variables
            setNewSong({
                title: "",
                artist: "",
                album: "",
                duration: "0"
            })
            setFiles({
                audio: null,
                image: null
            })

            toast.success("Song added successfully!")
            setIsLoading(false)

        } catch (err: any) {
            toast.error("Failed to add song")
        }
    }

    return (
        <div>
            <button className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white p-2 rounded-md cursor-pointer hover:scale-105 transition-all"
                onClick={() => setSongDialogOpen(true)}>
                <PlusCircle className=" size-4" />
                Add Song
            </button>

            {/* Dialog overlay  */}
            {songDialogOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-zinc-900 border border-zinc-800 max-h-[90vh] p-6 w-full max-w-lg rounded-md shadow-xl overflow-y-auto relative" >
                        <div className="">
                            <h2 className="text-xl font-bold">Add New song</h2>
                            <p className="text-sm font-light">Add a new song to your music library</p>


                            <div className="space-y-4 py-4">
                                <input
                                    type="file"
                                    accept="audio/*"
                                    ref={audioInputRef}
                                    hidden
                                    onChange={(e) => setFiles((prev) => ({ ...prev, audio: e.target.files![0] }))}
                                />

                                <input
                                    type="file"
                                    accept="image/*"
                                    ref={imageInputRef}
                                    hidden
                                    onChange={(e) => setFiles((prev) => ({ ...prev, image: e.target.files![0] }))}
                                />

                                {/* image upload area  */}
                                <div className="flex items-center justify-center p-6 border-dashed border-2 border-zinc-700 rounded-lg cursor-pointer"
                                    onClick={() => imageInputRef.current?.click()}>
                                    <div className="text-center">
                                        {files.image ? (
                                            <div className="text-center">
                                                <div className="text-sm text-emerald-500">Image selected:</div>
                                                <div className="text-xs text-zinc-400">{files.image.name.slice(0, 20)}</div>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="p-3 bg-zinc-800 rounded-full inline-block mb-2">
                                                    <Upload className="size-6 text-zinc-400" />
                                                </div>
                                                <div className="text-sm text-zinc-400 mb-2">Upload artwork</div>
                                                <button className="text-sm text-zinc-400 mb-2 btn-outline cursor-pointer">Choose File</button>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* Audio upload  */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Audio File</label>
                                    <div className="flex items-center gap-2">
                                        <button className="btn-outline cursor-pointer border w-full rounded-sm p-1 hover:bg-zinc-900 border-slate-400"
                                            onClick={() => audioInputRef.current?.click()}>
                                            {files.audio ? files.audio.name.slice(0, 20) : "Choose Audio File"}
                                        </button>
                                    </div>
                                </div>

                                {/* Other fields  */}
                                <div className="flex flex-col">
                                    <label className="text-sm font-medium mb-1">Title</label>
                                    <input
                                        value={newSong.title}
                                        onChange={(e) => setNewSong({ ...newSong, title: e.target.value })}
                                        className="bg-zinc-800 border border-zinc-700 rounded-sm p-2"
                                    />
                                </div>

                                <div className="flex flex-col">
                                    <label className="text-sm font-medium mb-1">Artist</label>
                                    <input
                                        value={newSong.artist}
                                        onChange={(e) => setNewSong({ ...newSong, artist: e.target.value })}
                                        className="bg-zinc-800 border border-zinc-700 rounded-sm p-2"
                                    />
                                </div>

                                <div className="flex flex-col">
                                    <label className="text-sm font-medium mb-1">Duration (seconds)</label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={newSong.duration}
                                        onChange={(e) => setNewSong({ ...newSong, duration: e.target.value || "0" })}
                                        className="bg-zinc-800 border border-zinc-700 rounded-sm p-2"
                                    />
                                </div>

                                {/* Album field  */}
                                <div className="flex flex-col">
                                    <label className="text-sm font-medium mb-1 text-zinc-300">Album (Optional)</label>
                                    <select value={newSong.album} onChange={(e) => setNewSong({ ...newSong, album: e.target.value })}
                                        className="w-full p-2 rounded-lg bg-zinc-800 text-white border border-zinc-700 focus:outline-none focus:ring-2 cursor-pointer">

                                        <option value="">Select Album</option>
                                        <option value="none">No Album (Single)</option>
                                        {allAlbums?.map((album: albumInterface) => (
                                            <option key={album.id} value={album.id}>{album.title}</option>
                                        ))}

                                    </select>
                                </div>
                            </div>

                            <div className="text-right mt-2">
                                <button onClick={() => setSongDialogOpen(false)} className="bg-red-100 px-2 py-1 text-red-600 rounded-md cursor-pointer mr-4 font-semibold hover:scale-105 transition-all">Cancel</button>
                                <button onClick={handleSubmit} disabled={isLoading} className="bg-green-500 px-2 py-1 text-white rounded-md cursor-pointer mr-4 font-semibold hover:scale-105 transition-all">{isLoading ? "Uploading..." : "Add Song"}</button>
                            </div>


                            <button className="absolute top-0 right-0 p-2 cursor-pointer hover:scale-105"
                                onClick={() => {
                                    setSongDialogOpen(false)
                                }}>
                                < X className="size-5" />
                            </button>
                        </div>
                    </div>
                </div>
            )}


        </div>

    )
}