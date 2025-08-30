import { PrismaClient } from "@prisma/client";
const client = new PrismaClient()


export async function getStats(req:any, res:any)
{
    try{
        //fetch the total songs, total user, total albums from the database
        /*
            const totalSongs = await client.songSchema.count()
            const totalUsers = await client.userSchema.count()
            const totalAlbums = await client.albumSchema.count()
        */

        //---This will take more time since the lines will run one time at a time
        const [totalSongs, totalUsers, totalAlbums, uniqueArtist] = await Promise.all([
            client.songSchema.count(),
            client.userSchema.count(),
            client.albumSchema.count(),

            // Finds all unique artists from the songs table.
            client.songSchema.findMany({
                select: {artist: true},
                distinct: ['artist']
            }).then((artists)=>artists.length)
        ])

        return res.status(200).json({
            totalSongs,
            totalAlbums,
            totalUsers,
            totalArtists: uniqueArtist
        })


    }catch(err)
    {
        console.log("Error from stat controller : ", err);
        return res.status(500).json({message: "Internal server error!"})
    }
}