import { PrismaClient } from "@prisma/client";
import cloudinary from "../lib/cloudinary";
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

//route to update the profile of the user
export async function updateProfile(req:any, res:any, next:any) {
    try{
        const {imageUrl, fullname} = req.body

        //get the userId set by the middleware
        const userId = req.user?.id 

        //find the user from the database and delete the prev cloudinary image
        const user = await client.userSchema.findFirst({
            where: {
                id: userId
            }
        })

        if(user?.public_id && user?.public_id.length>0)
        {
            await cloudinary.uploader.destroy(user.public_id)
        }

        //upload the imageUrl
        const newImage = await cloudinary.uploader.upload(imageUrl)
        
        const updatedUser = await client.userSchema.update({
            where: {
                id: userId
            }, 
            data: {
                fullname: fullname,
                imageUrl: newImage.secure_url,
                public_id: newImage.public_id
            }
        })

        return res.status(200).json({message:"Profile updated successfully!"})
    }
    catch(err:any)
    {
        console.log(`Error from updateProfile route: ${err}`);
        next(err)   //global error handling middleware
    }
}