import { useRef, useState } from "react"
import { Loader, PlusCircle, Upload, X } from "lucide-react"
import { toast } from "react-toastify"
import { axiosInstance } from "../../../lib/axios"
import { useQueryClient } from "@tanstack/react-query"

interface NewAlbum {
    title: string,
    artist: string,
    releaseYear: string
}

export default function AddAlbumDialog() {

    const queryClient = useQueryClient()
    const [albumDialogOpen, setAlbumDialogOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const [newAlbum, setNewAlbum] = useState<NewAlbum>({
        title: "",
        artist: "",
        releaseYear: ""
    })

    const [files, setFiles] = useState<{ image: File | null }>({
        image: null
    })

    const imageInputRef = useRef<HTMLInputElement>(null)

    async function handleSubmit(e: any) {
        e.preventDefault()
        setIsLoading(true)

        try {
            if (!files.image) {
                toast.error("Please upload image file")
                setIsLoading(false)
                return 
            }
            const formData = new FormData()

            formData.append("title", newAlbum.title)
            formData.append("artist", newAlbum.artist)
            formData.append("releaseYear", newAlbum.releaseYear)
            formData.append("imageFile", files.image)

            await axiosInstance.post("/admin/albums", formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    }
                }
            )

            queryClient.invalidateQueries({ queryKey: ["allStats"] }) //refetch
            queryClient.invalidateQueries({ queryKey: ["allAlbums"] }) //refetch

            //reset state variables
            setNewAlbum({
                title: "",
                artist: "",
                releaseYear: ""
            })
            setFiles({
                image: null
            })

            toast.success("Album added successfully!")
            setIsLoading(false)

        } catch (err: any) {
            toast.error("Failed to add album")
        }
    }
    //function to reset state varible values on cancel and cross button click
    function handleCancel() {
        //reset state variables
        setNewAlbum({
            title: "",
            artist: "",
            releaseYear: ""
        })
        setFiles({
            image: null
        })
        setAlbumDialogOpen(false)
        setIsLoading(false)
    }

    return (
        <div>
            <button className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white p-2 
            rounded-md cursor-pointer hover:scale-105 transition-all"
                onClick={() => setAlbumDialogOpen(true)}>
                <PlusCircle className=" size-4" />
                Add Album
            </button>

            {/* Dialog overlay  */}
            {albumDialogOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-zinc-900 border border-zinc-800 max-h-[90vh] p-6 w-full max-w-lg 
                    rounded-md shadow-xl overflow-y-auto relative" >
                        <div className="">
                            <h2 className="text-xl font-bold">Add New album</h2>
                            <p className="text-sm font-light">Add a new album to your music library</p>


                            <div className="space-y-4 py-4">
                                <input
                                    type="file"
                                    accept="image/*"
                                    ref={imageInputRef}
                                    hidden
                                    onChange={(e) => setFiles((prev) => ({ ...prev, image: e.target.files![0] }))}
                                />

                                {/* image upload area  */}
                                <div className="flex items-center justify-center p-6 border-dashed border-2
                                 border-zinc-700 rounded-lg cursor-pointer"
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

                                {/* Other fields  */}
                                <div className="flex flex-col">
                                    <label className="text-sm font-medium mb-1">Title</label>
                                    <input
                                        value={newAlbum.title}
                                        onChange={(e) => setNewAlbum({ ...newAlbum, title: e.target.value })}
                                        className="bg-zinc-800 border border-zinc-700 rounded-sm p-2"
                                    />
                                </div>

                                <div className="flex flex-col">
                                    <label className="text-sm font-medium mb-1">Artist</label>
                                    <input
                                        value={newAlbum.artist}
                                        onChange={(e) => setNewAlbum({ ...newAlbum, artist: e.target.value })}
                                        className="bg-zinc-800 border border-zinc-700 rounded-sm p-2"
                                    />
                                </div>

                                <div className="flex flex-col">
                                    <label className="text-sm font-medium mb-1">Release Year</label>
                                    <input
                                        value={newAlbum.releaseYear}
                                        onChange={(e) => setNewAlbum({ ...newAlbum, releaseYear: e.target.value })}
                                        className="bg-zinc-800 border border-zinc-700 rounded-sm p-2"
                                    />
                                </div>

                            </div>

                            <div className="mt-2 flex  justify-end items-center">
                                <button onClick={() => setAlbumDialogOpen(false)} className="bg-red-100 px-2 py-1 text-red-600 rounded-md cursor-pointer mr-4 font-semibold hover:scale-105 transition-all">Cancel</button>
                                <button onClick={handleSubmit} disabled={isLoading}
                                    className="bg-green-500 px-2 py-1 text-white rounded-md cursor-pointer mr-4 font-semibold hover:scale-105 transition-all">
                                    {isLoading ? (
                                        <div className="flex gap-2 items-center justify-center">
                                            <Loader className="size-5 animate-spin hover:cursor-not-allowed" />
                                            Uploading
                                        </div>
                                    ) : "Add Album"}</button>
                            </div>


                            <button className="absolute top-0 right-0 p-2 cursor-pointer hover:scale-105"
                                onClick={handleCancel}>
                                < X className="size-5" />
                            </button>
                        </div>
                    </div>
                </div>
            )}


        </div>

    )
}