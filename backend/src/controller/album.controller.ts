import { Prisma, PrismaClient } from "@prisma/client";
const client = new PrismaClient()


export async function getAllAlbums(req:any, res:any)
{
    try{
        const albums = await client.albumSchema.findMany()
        return res.status(200).json(albums)
    }catch(err)
    {
        console.log(`Error from getAllAlbums route: ${err}`);
        return res.status(500).json({message:"Internal server error!"})
    }
}

export async function getAlbumById(req:any, res:any)
{
    try{
        const {albumId} = req.params
        
        const albums = await client.albumSchema.findFirst({
            where: {
                id : parseInt(albumId)
            },
            include:{
                songs: true //load songs for this album
            }
        })

        //incase this album not exists
        if(!albums)
            return res.status(404).json({message: "Album not found!"})

        return res.status(200).json(albums)
    }catch(err)
    {
        console.log(`Error from getAlbumById route: ${err}`);
        return res.status(500).json({message:"Internal server error!"})
    }
}