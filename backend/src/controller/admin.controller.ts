import { PrismaClient } from "@prisma/client"
const client = new PrismaClient()
import cloudinary from "../lib/cloudinary"
import fs from "fs";

//helper functions to upload to cloudinary
async function uploadToCloudinary(file: any) {
    try {
        const result = await cloudinary.uploader.upload(file.tempFilePath, {
            resource_type: "auto"
        })
        return result
    } catch (err) {
        console.log("Error in upload to cloudinary function: ", err);
        throw new Error("Error uploading to cloudinary")
    }
}

//function to check if the current user is admin or not
export async function checkAdmin(req: any, res: any) {
    try {
        const currentUser = req.user

        //check if the currentUser's email is in AdminSchema or not
        const admin = await client.adminSchema.findFirst({
            where: {
                email: currentUser.email
            }
        })

        if (admin)
            return res.status(200).json({ isAdmin: true })
        else
            return res.status(200).json({ isAdmin: false })

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
            return res.status(400).json({ message: "Audio and image files are required" })
        }

        const { title, artist, albumId, duration } = req.body

        // const audioFile = req.files.audioFile
        // const imageFile = req.files.imageFile
        const audioFile = (req.files as any).audioFile
        const imageFile = (req.files as any).imageFile

        //upload audio
        const audioUpload = await cloudinary.uploader.upload(audioFile.tempFilePath, {
            resource_type: "video",     //cloudinary treats audio as video
            folder: "songs/audio"
        })
        //upload audio
        const imageUpload = await cloudinary.uploader.upload(imageFile.tempFilePath, {
            resource_type: "image",
            folder: "songs/image"
        })


        // delete temp files after upload
        fs.unlinkSync(audioFile.tempFilePath);
        fs.unlinkSync(imageFile.tempFilePath);


        //create a new song instance
        const song = await client.songSchema.create({
            data: {
                title,
                artist,
                imageUrl: imageUpload.secure_url,
                img_public_id: imageUpload.public_id,
                audioUrl: audioUpload.secure_url,
                audio_public_id: audioUpload.public_id,
                duration: parseInt(duration),
                albumId: parseInt(albumId) || null
            }
        })

        //if songs belong to an album, upload the album's songs array
        if (albumId) {
            await client.albumSchema.update({
                where: {
                    id: parseInt(albumId)
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

        //1. delete the cloudinary image of the song
        if (song?.img_public_id && song.img_public_id.length > 0)
            await cloudinary.uploader.destroy(song.img_public_id)

        // 2. delete the cloudinary audio of the song
        if (song?.audio_public_id && song.audio_public_id.length > 0)
            await cloudinary.uploader.destroy(song.audio_public_id, { resource_type: "video" })


        //delete the song
        await client.songSchema.delete({
            where: {
                id: song?.id
            }
        })


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

        const image = await uploadToCloudinary(imageFile)

        const album = await client.albumSchema.create({
            data: {
                title,
                artist,
                imageUrl: image.secure_url,
                public_id: image.public_id,
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

        //1. first fetch all songs belonging to the album
        const allsongs = await client.songSchema.findMany({
            where: {
                albumId: parseInt(id)
            }
        })

        //2. Delete cloudinary image and audio for each song
        for (const song of allsongs) {
            if (song?.img_public_id && song.img_public_id.length > 0)
                await cloudinary.uploader.destroy(song.img_public_id)

            // 2. delete the cloudinary audio of the song
            if (song?.audio_public_id && song.audio_public_id.length > 0)
                await cloudinary.uploader.destroy(song.audio_public_id, { resource_type: "video" })
            // Cloudinary audio must be deleted with { resource_type: "video" }

        }

        //3. delete all the songs belonging to the album
        await client.songSchema.deleteMany({
            where: {
                albumId: parseInt(id)
            }
        })

        //4. find the album to be deleted
        const album = await client.albumSchema.findFirst({
            where: {
                id: parseInt(id)
            }
        })

        //5. Delete the image of the album
        if (album?.public_id && album?.public_id.length > 0) {
            await cloudinary.uploader.destroy(album.public_id)
        }


        //6. delete the album
        await client.albumSchema.delete({
            where: {
                id: parseInt(id)
            }
        })
        res.status(200).json({ message: "Album deleted successfully!" })

    } catch (err) {
        console.log("Error from deleteAlbum route ", err);
        return res.status(500).json({ message: "Internal server error" })
    }
}   