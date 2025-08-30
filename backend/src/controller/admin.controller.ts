import { PrismaClient } from "@prisma/client"
const client = new PrismaClient()
import cloudinary from "../lib/cloudinary"


//helper functions to upload to cloudinary
async function uploadToCloudinary(file: any) {
    try {
        const result = await cloudinary.uploader.upload(file.tempFilePath, {
            resource_type: "auto"
        })
        return result.secure_url
    } catch (err) {
        console.log("Error in upload to cloudinary function: ", err);
        throw new Error("Error uploading to cloudinary")
    }
}

//function to check if the current user is admin or not
export async function checkAdmin(req: any, res: any) {
    try {
        const currentUser = req.user
        // console.log("current User: ", currentUser);

        const isAdmin = process.env.ADMIN_EMAIL === currentUser.email
        return res.status(200).json({isAdmin})
    }
    catch (err) {
        console.log("Error from requireAdmin route: ", err);
        return res.status(500).json({ message: "Internal Server Error!" })
    }
}


export async function createSong(req: any, res: any, next: any) {
    try {
        //check if user has both audio and image file
        if (!req.files || !req.files.audioFile || !req.files.imageFile) {
            return res.status(400).json({ message: "Please upload all files" })
        }

        const { title, artist, albumId, duration } = req.body

        const audioFile = req.files.audioFile
        const imageFile = req.files.imageFile

        //save it to cloudinary
        const audioUrl = await uploadToCloudinary(audioFile)
        const imageUrl = await uploadToCloudinary(imageFile)

        //create a new song instance
        const song = await client.songSchema.create({
            data: {
                title,
                artist,
                imageUrl,
                audioUrl,
                duration,
                albumId: albumId || null
            }
        })

        //if songs belong to an album, upload the album's songs array
        if (albumId) {
            await client.albumSchema.update({
                where: {
                    id: albumId
                },
                data: {
                    songs: {
                        connect: { id: song.id }
                    }
                }
            })
        }
        res.status(201).json(song)
    }
    catch (err) {
        console.log("Error in create song controller: ", err);
        next(err)   //calling the middleware
    }
}

export async function deleteSong(req: any, res: any) {
    try {
        const { id } = req.params
        const song = await client.songSchema.findFirst({
            where: {
                id: parseInt(id)
            }
        })

        //if song belongs to an album, update the album's song array
        if (song?.albumId) {
            await client.albumSchema.update({
                where: {
                    id: song.albumId
                },
                data: {
                    songs: {
                        disconnect: {
                            id: song.id
                        }
                    }
                }
            })
        }
        res.status(200).json({ message: "Song deleted successfully!" })

    } catch (err) {
        console.log("Error from deleteSong route ", err);
        return res.status(500).json({ message: "Internal server error" })
    }
}

//function to create an album
export async function createAlbum(req: any, res: any, next: any) {
    try {
        const { title, artist, releaseYear } = req.body
        const { imageFile } = req.files

        const imageUrl = await uploadToCloudinary(imageFile)

        const album = await client.albumSchema.create({
            data: {
                title,
                artist,
                imageUrl,
                releaseYear
            }
        })
        res.status(200).json(album)

    } catch (err) {
        console.log("Error from createAlbum route ", err);
        return res.status(500).json({ message: "Internal server error" })
    }
}

//function to delete an album
export async function deleteAlbum(req: any, res: any, next: any) {
    try {
        const { id } = req.params

        //delete all the songs belonging to the album
        await client.songSchema.deleteMany({
            where: {
                albumId: id
            }
        })

        //delete the album
        await client.albumSchema.delete({
            where: {
                id: id
            }
        })
        res.status(200).json({ message: "Album deleted successfully!" })

    } catch (err) {
        console.log("Error from deleteAlbum route ", err);
        return res.status(500).json({ message: "Internal server error" })
    }
}   