import { PrismaClient } from "@prisma/client";
const client = new PrismaClient()


//find all the users except the current user
export async function getAllUsers(req:any, res:any)
{
    try{
        const currentUserId = req.user.id    //set by the protectRoute middleware middleware
        // console.log("Current User: ", req.user);
        const users = await client.userSchema.findMany({
            where: {
                id: {
                    not: currentUserId  //not the current user
                }
            }
        })
        return  res.status(200).json(users)

    }catch(err)
    {
        console.log(`Error from getAllUsers route: ${err}`);
        return res.status(500).json({message: "Internal server error"})
    }
}