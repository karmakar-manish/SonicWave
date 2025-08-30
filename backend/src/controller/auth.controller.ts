import bcrypt from "bcryptjs"
import { PrismaClient } from "@prisma/client"
import generateToken_Cookie from "../lib/utils"
const client = new PrismaClient()


export async function signup(req: any, res: any) {
    const { fullname, email, password, uid } = req.body
    if (!fullname || !email || !password )
        return res.status(400).json({ message: "All fields are required!" })

    try {
        //check if email is already taken
        const existingEmail = await client.userSchema.findFirst({
            where: {
                email: email
            }
        })

        if (existingEmail)
            return res.status(400).json({ message: "Email already taken" })

        //check password length
        if (password.length < 6)
            return res.status(400).json({ message: "Password must be atleast 6 characters" })

        //hash the password before storing
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        //create a new user in database
        const user = await client.userSchema.create({
            data: {
                fullname,
                email,
                password: hashedPassword,
                uid
            }
        })

        //generate the token and get the cookie
        const token = generateToken_Cookie({userId: user.id, res})

        return res.status(200).json({
            message: "User registered successfully!",
            token: token,
        })

    }

    catch (err) {
        console.log("Error from signup route: ", err);
        res.status(500).json({ message: "Internal server error" })
    }
}

export async function login(req:any, res:any) {
    const {email, password} = req.body 
    if(!email || !password)
        return res.status(400).json({message:"All fields are required!"})

    try{
        //check if user exists with given email
        const user = await client.userSchema.findFirst({
            where: {
                email
            }
        })
        if(!user)
            return res.status(400).json({message: "Invalid credentials!"})

        //now check the hashed password
        const checkedPassword = await bcrypt.compare(password, user.password)

        if(!checkedPassword)
            return res.status(400).json({message: "Invalid credentials!"})
        
        //generate the token and put it in cookie
        const token = generateToken_Cookie({userId: user.id, res})

        return res.status(200).json({
            message: "User registered successfully!",
            token: token
        })


    }catch(err)
    {
        console.log("Error from login route: ", err);
        res.status(500).json({ message: "Internal server error" })
    }
}

export async function logout(req:any, res:any)
{
    //clear the cookie
    res.clearCookie("token")

    return res.json({message:"Logged out successfully!"})
}