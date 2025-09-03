import { PrismaClient } from "@prisma/client";
const client = new PrismaClient()


//find all the users except the current user
export async function getAllUsers(req: any, res: any) {
    try {
        const currentUserId = req.user.id    //set by the protectRoute middleware middleware
        // console.log("Current User: ", req.user);
        const users = await client.userSchema.findMany({
            where: {
                id: {
                    not: currentUserId  //not the current user
                }
            }
        })
        return res.status(200).json(users)

    } catch (err) {
        console.log(`Error from getAllUsers route: ${err}`);
        return res.status(500).json({ message: "Internal server error" })
    }
}

//get all the messages
export async function getMessages(req: any, res: any) {
    try {
        const myId = req.user.id.toString()   //set by the protectRoute middleware
        const { userId } = req.params //from the parameter

        //find the messages where either the user is sending or receiving messages
        const messages = await client.messageSchema.findMany({
            where: {
                OR: [
                    { senderId: userId, receiverId: myId },
                    { senderId: myId, receiverId: userId }
                ]
            },
            orderBy: {
                createdAt: "asc"   //latest msg at bottom
            }
        })

        res.status(200).json(messages)

    } catch (err: any) {
        console.log(`Error from getMessages route: ${err}`);
        return res.status(500).json({ message: "Internal server error" })
    }


}