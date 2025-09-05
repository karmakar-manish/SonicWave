import jwt from "jsonwebtoken"
import { PrismaClient } from "@prisma/client";
import { defineDmmfProperty } from "@prisma/client/runtime/library";
const client = new PrismaClient()

export async function protectRoute(req: any, res: any, next: any) {
    //take the token from the cookies
    const token = req.cookies?.token

    //incase no token in cookie
    if (!token)
        return res.status(401).json({ message: "Unauthorized - No token provided." })

    try {
        //decode the token 
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: number }

        //find the user with the token id in database
        const user = await client.userSchema.findFirst({
            where: {
                id: decoded.id
            },
            select: {
                id: true,
                fullname: true,
                email: true,
                imageUrl: true,
                createdAt: true
            }
        })
        
        if (!user)
            return res.status(401).json({ message: "User not found!" })

        //set the user data in the req body
        req.user = user
        next()

    } catch (err) {
        console.log(`Error from protectRoute middleware: ${err}`);
        return res.status(500).json({ message: "Invalid token!" })
    }
}

//function to get current user details set by the middleware
export function getCurrentUser(req: any, res: any) {
    try {
        return res.json(req.user)
    }
    catch (err) {
        console.log(`Error from getCurrentUser route: ${err}`);
        return res.status(500).json({ message: "Internal server error!" })
    }
}

//function to check if user is admin
export async function requireAdmin(req: any, res: any, next: any) {
    //get the current user's email
    try {
        const currentUser = req.user 
        //check if the currentUser's email is in AdminSchema or not
        const admin = await client.adminSchema.findFirst({
            where: {
                email: currentUser.email
            }
        })

        //incase current user is not admin
        if (!admin)
            return res.status(403).json({ message: "Unauthorized - you must be an admin" })
        next()

    }
    catch (err) {
        console.log("Error from requireAdmin route: ", err);
        return res.status(500).json({ message: "Internal Server Error!" })
    }
}
