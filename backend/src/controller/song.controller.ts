import { PrismaClient } from "@prisma/client";
const client = new PrismaClient()

//get all the songs for admin route in descending order
export async function getAllSongs(req: any, res: any) {
    try {
        const songs = await client.songSchema.findMany({
            orderBy: { createdAt: "desc" }
        })
        return res.status(200).json(songs)
    } catch (err) {
        console.log("Error from getAllSongs route: ", err);
        return res.status(500).json({ message: "Internal server error" })
    }
}

//randomly select some songs for the user
export async function getFeaturedSongs(req: any, res: any) {
    try {
        const songs = await client.$queryRaw
            `SELECT * FROM "SongSchema" ORDER BY RANDOM() LIMIT 6;`;
        return res.status(200).json(songs)
    } catch (err) {
        console.log("Error from getFeaturedSongs route: ", err);
        return res.status(500).json({ message: "Internal server error" })
    }
}

export async function getMadeForYou(req: any, res: any) {
    try {
        const songs = await client.$queryRaw
            `SELECT * FROM "SongSchema" ORDER BY RANDOM() LIMIT 4;`;
        return res.status(200).json(songs)
    } catch (err) {
        console.log("Error from getFeaturedSongs route: ", err);
        return res.status(500).json({ message: "Internal server error" })
    }
}

export async function getTrendingSongs(req: any, res: any) {
    try {
        const songs = await client.$queryRaw
            `SELECT * FROM "SongSchema" ORDER BY RANDOM() LIMIT 4;`;
        return res.status(200).json(songs)
    } catch (err) {
        console.log("Error from getFeaturedSongs route: ", err);
        return res.status(500).json({ message: "Internal server error" })
    }
}